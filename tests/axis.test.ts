import {
  EnumAxisIns,
  HomeIns,
  MoveIns,
  GetPosIns,
  JogStartIns,
  JogStopIns,
} from "../src";
import InsTools from "../src/ins/instools";

test("EnumAxisIns", () => {
  const enumAxisIns = new EnumAxisIns();
  console.log(enumAxisIns.detail());
  console.log(enumAxisIns.toHexString());
  const respData = InsTools.hexStringToBuffer(enumAxisIns.mockRespData());
  console.log(EnumAxisIns.parseRespData(respData));
});

test("HomeIns", () => {
  const homeIns = new HomeIns([1, 2, 3, 4]);
  console.log(homeIns.detail());
  console.log(homeIns.toHexString());
  const respData = InsTools.hexStringToBuffer(homeIns.mockRespData());
  console.log(HomeIns.parseRespData(respData));
});

test("MoveIns", () => {
  const moveIns = new MoveIns([
    {
      axisNum: 1,
      speed: 99.99,
      dest: 200,
      isRelative: false,
    },
  ]);
  console.log(moveIns.detail());
  console.log(moveIns.toHexString());
  const respData = InsTools.hexStringToBuffer(moveIns.mockRespData());
  console.log(MoveIns.parseRespData(respData));
});

test("GetPosIns", () => {
  const getPosIns = new GetPosIns([1, 2, 3, 4]);
  console.log(getPosIns.detail());
  console.log(getPosIns.toHexString());
  const respData = InsTools.hexStringToBuffer(getPosIns.mockRespData());
  console.log(GetPosIns.parseRespData(respData));
});

test("JogStartIns", () => {
  const jogStartIns = new JogStartIns(1, 99.99, 200);
  console.log(jogStartIns.detail());
  console.log(jogStartIns.toHexString());
});

test("JogStopIns", () => {
  const jogStopIns = new JogStopIns(1);
  console.log(jogStopIns.detail());
  console.log(jogStopIns.toHexString());
});
