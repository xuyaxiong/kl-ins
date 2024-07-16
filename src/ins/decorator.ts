const syncInstructionSet = new Set();
export function IsSync({ TIMEOUT }: { TIMEOUT: number }) {
  return function (target: any) {
    target.TIMEOUT = TIMEOUT;
    target.IS_SYNC = true;
    syncInstructionSet.add(`${target.MODULE_NUM}-${target.NUM}`);
  };
}

export function isSync(moduleNum: number, num: number) {
  return syncInstructionSet.has(`${moduleNum}-${num}`);
}
