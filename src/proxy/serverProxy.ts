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
      const { insData, modNum, insNum } = this.preprocessData(data);
      if (SyncIns.isSyncIns(modNum, insNum)) {
        const receiveSendNo = insData[6];
        if (this.getLatestSendNo() === receiveSendNo) {
          const resolve = this.getResolve();
          const latestSyncIns = this.getLatestSyncIns();
          const parsedData = latestSyncIns!.parseRespData(insData);
          resolve?.(parsedData);
        }
      } else {
        if (this.reportDataHandler)
          await this.reportDataHandler({
            modNum: modNum,
            insNum: insNum,
            data: insData,
          });
      }
    });
  }
}
