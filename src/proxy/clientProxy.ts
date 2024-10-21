import Proxy from "./Proxy";
import { isSync } from "../ins/decorator";
import TCPClient from "./TCPClient";

export default class ClientProxy extends Proxy {
  public async connect() {
    await this.end.connect();
  }

  public constructor(name: string, host: string, port: number) {
    super();
    this.end = new TCPClient(name, { host, port }, async (data: Buffer) => {
      const { strippedData, receiveModuleNum, receiveNum } =
        this.preprocessData(data);
      if (isSync(receiveModuleNum, receiveNum)) {
        const receiveSendNo = strippedData[6];
        if (this.getLatestSendNo() === receiveSendNo) {
          const resolve = this.getResolve();
          resolve?.(data);
        }
      } else {
        if (this.plcReportDataHandler)
          await this.plcReportDataHandler({
            moduleNum: receiveModuleNum,
            instructionNum: receiveNum,
            data: strippedData,
          });
      }
    });
  }
}
