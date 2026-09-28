interface CloudflareFetcher {
  fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
}

interface Env {
  ASSETS: CloudflareFetcher;
}

export default {
  // Removed ctx: ExecutionContext since it's not used in this file
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Proxy /api/* and /ws/* requests to the Fly.io backend
    if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/ws/")) {
      const backendUrl = `https://topo.fly.dev${url.pathname}${url.search}`;

      // Handle WebSocket upgrade requests
      if (request.headers.get("Upgrade")?.toLowerCase() === "websocket") {
        const proxyReq = new Request(backendUrl, request);
        return fetch(proxyReq);
      }

      // Regular HTTP request proxying
      const proxyRequest = new Request(backendUrl, {
        method: request.method,
        headers: request.headers,
        body: request.method !== "GET" && request.method !== "HEAD" ? request.body : undefined,
        redirect: "manual",
      });

      const response = await fetch(proxyRequest);

      // Clone headers to add CORS
      const newHeaders = new Headers(response.headers);
      newHeaders.set("Access-Control-Allow-Origin", url.origin);

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
      });
    }

    // For all other requests, serve static assets
    return env.ASSETS.fetch(request);
  },
};