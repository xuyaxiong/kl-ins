import Proxy from "./proxy";
import { isSync } from "../ins/decorator";
import TCPServer from "./server";

export default class ServerProxy extends Proxy {
  public listen() {
    this.end.listen(this.port);
  }

  public constructor(private port: number) {
    super();
    this.end = new TCPServer(async (data: Buffer) => {
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
