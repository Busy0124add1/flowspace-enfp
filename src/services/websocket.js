/**
 * WSService - WebSocket service layer with exponential backoff reconnection
 */
class WSService {
  constructor() {
    this.ws = null
    this.listeners = new Map()
    this.reconnectDelay = 1000
    this.maxReconnectDelay = 30000
    this.url = null
  }

  connect(url) {
    this.url = url
    this.ws = new WebSocket(url)

    this.ws.onopen = () => {
      this.reconnectDelay = 1000
    }

    this.ws.onmessage = (e) => {
      const data = JSON.parse(e.data)
      this.emit(data.type, data.payload)
    }

    this.ws.onclose = () => {
      this.reconnect()
    }

    this.ws.onerror = () => {
      // Error will trigger onclose, which handles reconnect
    }
  }

  disconnect() {
    this.url = null
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event).push(callback)
  }

  off(event, callback) {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      const index = callbacks.indexOf(callback)
      if (index !== -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  emit(event, data) {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      callbacks.forEach(cb => cb(data))
    }
  }

  send(type, payload) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }))
    }
  }

  reconnect() {
    if (!this.url) return
    setTimeout(() => {
      this.connect(this.url)
      this.reconnectDelay = Math.min(this.reconnectDelay * 2, this.maxReconnectDelay)
    }, this.reconnectDelay)
  }
}

export default new WSService()
