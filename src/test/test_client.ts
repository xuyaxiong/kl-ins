import { ClientProxy } from "../client/clientProxy";
import { MoveInstruction } from "../ins/axis";

const proxy = new ClientProxy("测试客户端", "127.0.0.1", 7777);
(async () => {
  await proxy.connect();
  const moveIns = new MoveInstruction([
    {
      axisNum: 1,
      speed: 99.99,
      dest: 100.01,
      isRelative: true,
    },
  ]);
  await proxy.sendInstruction(moveIns);
})();
