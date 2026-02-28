// miniprogram/services/asr-websocket.js
class ASRWebSocket {
  constructor() {
    this.ws = null;
    this.isConnected = false;
    this.listeners = {};
  }

  /**
   * 连接 WebSocket
   */
  connect(url = 'ws://localhost:3000/asr') {
    return new Promise((resolve, reject) => {
      this.ws = wx.connectSocket({
        url,
        success: () => {
          console.log('WebSocket 连接中...');
        },
        fail: (error) => {
          console.error('WebSocket 连接失败:', error);
          reject(error);
        },
      });

      wx.onSocketOpen(() => {
        this.isConnected = true;
        console.log('WebSocket 已连接');
        resolve();
      });

      wx.onSocketMessage((res) => {
        const data = JSON.parse(res.data);
        this.emit(data.event, data.data);
      });

      wx.onSocketError((error) => {
        console.error('WebSocket 错误:', error);
        this.isConnected = false;
        this.emit('error', error);
      });

      wx.onSocketClose(() => {
        console.log('WebSocket 已关闭');
        this.isConnected = false;
        this.emit('close');
      });
    });
  }

  /**
   * 发送音频数据
   */
  sendAudio(audioData) {
    if (!this.isConnected) {
      console.error('WebSocket 未连接');
      return;
    }

    const message = JSON.stringify({
      event: 'audio',
      data: audioData,
    });

    wx.sendSocketMessage({
      data: message,
      fail: (error) => {
        console.error('发送失败:', error);
      },
    });
  }

  /**
   * 监听事件
   */
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  /**
   * 触发事件
   */
  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((callback) => callback(data));
    }
  }

  /**
   * 关闭连接
   */
  close() {
    if (this.ws) {
      wx.closeSocket();
      this.isConnected = false;
    }
  }
}

module.exports = ASRWebSocket;
