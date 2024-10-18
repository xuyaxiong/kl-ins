import { Socket } from "net";
import { Tools } from "../utils/tools";
import { TCPConfig } from "./bo";

export default class TCPClient {
  private client: Socket;
  private reconnectTimeout: NodeJS.Timeout | undefined = undefined;

  constructor(
    private name: string,
    private tcpConfig: TCPConfig,
    private dataHandler: Function
  ) {
    this.client = new Socket();
  }

  async connect() {
    const { host, port } = this.tcpConfig;
    return new Promise((resolve) => {
      this.client.connect(port, host, () => {
        Tools.logKVSuccess(`${this.name}状态`, "连接成功");

        this.client.on("data", (data) => {
          this.dataHandler && this.dataHandler(data);
        });

        // 监听连接断开事件
        this.client.on("close", async () => {
          Tools.logKVFail(`${this.name}状态`, "连接中断");
          await this.reconnect();
        });
        resolve(true);
      });

      this.client.on("error", async (err) => {
        Tools.logKVFail(`${this.name}状态`, "连接失败");
        await this.reconnect();
      });
    });
  }

  // 发送数据
  sendData(data: Uint8Array) {
    return this.client.write(data);
  }

  // 断开TCP连接
  async close() {
    this.client.end();
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
          this.reconnectTimeout = undefined;
          this.client.removeAllListeners();
          this.connect();

          resolve(true);
        }, reconnectInterval);
      });
    }
  }
}
