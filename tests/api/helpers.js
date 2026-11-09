export function makeRequest(url, { method = "GET", body, headers = {} } = {}) {
  const init = { method, headers: { ...headers } };
  if (body !== undefined) {
    init.body = typeof body === "string" ? body : JSON.stringify(body);
    if (!init.headers["Content-Type"]) {
      init.headers["Content-Type"] = "application/json";
    }
  }
  return new Request(url, init);
}

export function jsonBody(res) {
  return res.json();
}
