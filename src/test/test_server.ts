import ServerProxy from "../proxy/ServerProxy";
import { HomeIns } from "../ins/axis";
import Tools from "../utils/tools";

const proxy = new ServerProxy(7777);
proxy.listen();

(async () => {
  await Tools.sleep(10_000);
  const homeIns = new HomeIns([1, 2, 3, 4]);
  console.log(homeIns.mockRespData());
  const retBuf = await proxy.sendIns(homeIns);
  console.log("解析返回数据:", homeIns.parseRespData(retBuf!));
})();
