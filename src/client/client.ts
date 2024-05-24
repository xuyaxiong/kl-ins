import { Socket } from "net";
import { Tools } from "../utils/tools";

export class TCPConfig {
  host: string;
  port: number;
}

export class TCPClient {
  private client: Socket;
  private isConnected: boolean;
  private reconnectTimeout = null;

  constructor(
    private name: string,
    private tcpConfig: TCPConfig,
    private dataHandler = null
  ) {
    this.client = new Socket();
  }

  async connect() {
    const { host, port } = this.tcpConfig;
    this.client.connect(port, host, () => {
      Tools.logKVSuccess(`${this.name}状态`, "连接成功");
      this.isConnected = true;

      this.client.on("data", (data) => {
        this.dataHandler && this.dataHandler(data);
      });

      // 监听连接断开事件
      this.client.on("close", async () => {
        Tools.logKVFail(`${this.name}状态`, "连接中断");
        this.isConnected = false;
        await this.reconnect();
      });
    });

    this.client.on("error", async (err) => {
      Tools.logKVFail(`${this.name}状态`, "连接失败");
      this.isConnected = false;
      await this.reconnect();
    });
  }

  // 发送数据
  sendData(data) {
    return this.client.write(data);
  }

  // 断开TCP连接
  async close() {
    this.client.end();
    this.isConnected = false;
  }

  private reconnectCount = 0;

  private reconnect() {
    if (!this.reconnectTimeout) {
      const reconnectInterval = 3_000;
      console.log(
        `${Tools.formatNowTimestamp()} ${
          reconnectInterval / 1000
        }秒后尝试重新连接到${this.name} ...${++this.reconnectCount}`
      );
      return new Promise((resolve, reject) => {
        this.reconnectTimeout = setTimeout(() => {
          this.reconnectTimeout = null;
          this.client.removeAllListeners();
          this.connect();

          resolve(true);
        }, reconnectInterval);
      });
    }
  }
}
