import InsTools from "../src/ins/instools";

test("lenToLoHi && loHiToLen", () => {
  const origNum = 500;
  const loHi = InsTools.lenToLoHi(origNum);
  const newNum = InsTools.loHiToLen(loHi[0], loHi[1]);
  expect(newNum).toBe(origNum);
});

test("byteArrToHexStr && hexStringToBuffer", () => {
  const arr = [1, 2, 255];
  const hexStr = InsTools.byteArrToHexStr(arr);
  const buf = InsTools.hexStringToBuffer(hexStr);
  expect(buf).toEqual(Buffer.from(arr));
});

test("float32ToByteArr && byteArrToFloat32", () => {
  const origNum = 99.987654;
  const byteArr = InsTools.float32ToByteArr(origNum);
  const newNum = InsTools.byteArrToFloat32(byteArr);
  expect(newNum).toBeCloseTo(origNum, 4);
});
