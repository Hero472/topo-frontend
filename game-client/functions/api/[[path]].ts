export async function onRequest(context: any) {
  const { path, request } = context;
  
  // Reconstruct the path (e.g., ["games"] becomes "games")
  const pathString = path ? path.join('/') : '';
  const backendUrl = `https://topo-backend.fly.dev/api/${pathString}`;

  // Clone headers but remove host/origin to avoid confusing the backend
  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("origin");
  headers.delete("referer");

  try {
    const response = await fetch(backendUrl, {
      method: request.method,
      headers: headers,
      body: request.body, 
    });
    return response;
  } catch (error) {
    console.error("Proxy error:", error);
    return new Response("Backend unavailable", { status: 502 });
  }
}