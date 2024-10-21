import ServerProxy from "../proxy/serverProxy";
import { HomeIns } from "../ins/axis";
import Tools from "../utils/tools";

const proxy = new ServerProxy(7777);
proxy.listen();

(async () => {
  await Tools.sleep(10_000);
  proxy.sendIns(new HomeIns([1, 2, 3, 4]));
})();
