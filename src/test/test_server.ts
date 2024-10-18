import { ServerProxy } from "../client/serverProxy";
import { HomeInstruction } from "../ins/axis";
import { Tools } from "../utils/tools";

const proxy = new ServerProxy(7777);
proxy.listen();

(async () => {
  await Tools.sleep(10_000);
  proxy.sendInstruction(new HomeInstruction([1, 2, 3, 4]));
})();
