import * as net from "net";
import { Tools } from "../utils/tools";

export class TCPServer {
  private server: net.Server;
  private socket: net.Socket | null = null;
  constructor(private dataHandler: Function) {
    this.server = net.createServer((socket) => {
      Tools.logKVSuccess("客户端", "连接成功");
      this.socket = socket;

      // 接收客户端发送的数据
      socket.on("data", (data) => {
        this.dataHandler && this.dataHandler(data);
      });

      // 处理客户端断开连接
      socket.on("end", () => {
        Tools.logKVFail("客户端", "连接中断");
      });

      // 处理错误
      socket.on("error", (err) => {
        Tools.logKVFail("客户端", "连接错误");
      });
    });
  }
  async listen(port: number) {
    this.server.listen(port, () => {
      Tools.logKVSuccess("服务端", `正在监听端口 ${port}`);
    });
  }

  sendData(data: Uint8Array) {
    this.socket?.write(data);
  }
}
