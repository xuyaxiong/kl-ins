import { HomeInstruction } from "../src/ins/axis";

test("ins test", async () => {
  const home = new HomeInstruction([1, 2, 3, 4]);
  console.log(home.toString());
  expect(HomeInstruction.NUM).toBe(2);
});
