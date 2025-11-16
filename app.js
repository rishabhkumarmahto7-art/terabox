export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Extract the ?url=<terabox-link>
    const teraboxUrl = url.searchParams.get("url");

    // CORS headers to allow Telegram WebApp
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
      "Content-Type": "application/json"
    };

    // Handle preflight (Telegram WebView needs this)
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (!teraboxUrl) {
      return new Response(JSON.stringify({ error: "Missing ?url parameter" }), {
        status: 400,
        headers: corsHeaders
      });
    }

    try {
      // Upstream third-party API
      const upstream =
        "https://teraboxdownloder.rishuapi.workers.dev/?url=" +
        encodeURIComponent(teraboxUrl);

      const resp = await fetch(upstream);

      // Get raw output from upstream
      const data = await resp.text();

      // Return same data but with your own CORS headers
      return new Response(data, {
        status: resp.status,
        headers: corsHeaders
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: "Proxy failed", details: err + "" }), {
        status: 500,
        headers: corsHeaders
      });
    }
  }
};