import Proxy from "./Proxy";
import TCPClient from "./TCPClient";
import SyncIns from "../ins/SyncIns";

export default class ClientProxy extends Proxy {
  public async connect() {
    await this.end.connect();
  }

  public constructor(name: string, host: string, port: number) {
    super();
    this.end = new TCPClient(name, { host, port }, async (data: Buffer) => {
      const { strippedData, receiveModuleNum, receiveNum } =
        this.preprocessData(data);
      if (SyncIns.isSyncIns(receiveModuleNum, receiveNum)) {
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
