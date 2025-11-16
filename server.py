from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

API_BASE = "https://teraboxdownloder.rishuapi.workers.dev/?url="

@app.route("/")
def index():
    return jsonify({"status": "running"})

@app.route("/proxy")
def proxy():
    url = request.args.get("url")
    if not url:
        return jsonify({"error": "missing url"}), 400
    
    try:
        upstream = API_BASE + requests.utils.quote(url, safe="")
        resp = requests.get(upstream)
        return (resp.text, resp.status_code, {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "*",
            "Content-Type": "application/json"
        })
    except Exception as e:
        return jsonify({"error": "proxy failed", "details": str(e)}), 500


@app.after_request
def add_cors(resp):
    resp.headers["Access-Control-Allow-Origin"] = "*"
    resp.headers["Access-Control-Allow-Headers"] = "*"
    resp.headers["Access-Control-Allow-Methods"] = "*"
    return resp


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)