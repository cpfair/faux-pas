import requests

# Get the stock store boot page
boot_req = requests.get("https://apps-prod.getpebble.com/en_US/")

boot_f = open("store_boot.html", "w")

# Bake in our cookies
cookie_set = """<script type="text/javascript">""" + ";".join(["document.cookie='%s=%s'"  % pair for pair in boot_req.cookies.items()]) + """</script>"""
boot_f.write(boot_req.text.replace("<script", cookie_set + "<script", 1).encode("utf-8"))

# Append our patches
boot_f.write("""<script type="text/javascript" src="/store_patch.js"></script><link rel="stylesheet" type="text/css" href="/store_patch.css">""")
