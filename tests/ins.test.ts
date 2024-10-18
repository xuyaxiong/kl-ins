import { HomeIns } from "../src/ins/axis";

test("ins test", async () => {
  const home = new HomeIns([1, 2, 3, 4]);
  console.log(home.toString());
  expect(HomeIns.NUM).toBe(2);
});
