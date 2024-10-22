export function Timeout(timeout: number) {
  return function (target: any) {
    target.TIMEOUT = timeout;
  };
}
