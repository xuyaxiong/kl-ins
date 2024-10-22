import Proxy from "./Proxy";
import TCPServer from "./TCPServer";
import SyncIns from "../ins/SyncIns";

export default class ServerProxy extends Proxy {
  public listen() {
    this.end.listen(this.port);
  }

  public constructor(private port: number) {
    super();
    this.end = new TCPServer(async (data: Buffer) => {
      const { strippedData, receiveModuleNum, receiveNum } =
        this.preprocessData(data);
      if (SyncIns.isSyncIns(receiveModuleNum, receiveNum)) {
        const receiveSendNo = strippedData[6];
        if (this.getLatestSendNo() === receiveSendNo) {
          const resolve = this.getResolve();
          const latestSyncIns = this.getLatestSyncIns();
          const parsedData = latestSyncIns!.parseRespData(strippedData);
          resolve?.(parsedData);
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
