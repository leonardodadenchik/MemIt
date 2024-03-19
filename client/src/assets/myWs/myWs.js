const host = (location.origin.replace(/^http/, 'ws') + ':80/')
    .replace(':3000', '')
    .replace(':8080', '')
const myWs = new WebSocket(host)

export default myWs
