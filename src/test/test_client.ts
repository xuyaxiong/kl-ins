import ClientProxy from "../proxy/ClientProxy";
import { MoveIns } from "../ins/axis";

const proxy = new ClientProxy("测试客户端", "127.0.0.1", 7777);

proxy.setOnSuccess(() => {
  console.log("foo");
});

proxy.setOnFailed(() => {
  console.log("bar");
});

(async () => {
  await proxy.connect();
  const moveIns = new MoveIns([
    {
      axisNum: 1,
      speed: 99.99,
      dest: 100.01,
      isRelative: true,
    },
  ]);
  console.log("mock返回数据:", moveIns.mockRespData());
  const res = await proxy.sendIns(moveIns);
  console.log("解析返回数据:", res);
})();
