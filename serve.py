import http.server, socketserver, os

os.chdir("/home/wiki/aqua-nord/out")
handler = http.server.SimpleHTTPRequestHandler
with socketserver.TCPServer(("0.0.0.0", 8181), handler) as httpd:
    print("Serving on 0.0.0.0:8181", flush=True)
    httpd.serve_forever()
