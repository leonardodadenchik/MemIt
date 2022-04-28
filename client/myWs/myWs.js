const host = (location.origin.replace(/^http/, "ws") + ":8814/")
  .replace(":3000", "")
  .replace(":8080", "");
const myWs = new WebSocket(host);

export { myWs };
