export function Timeout({ timeout }: { timeout: number }) {
  return function (target: any) {
    target.TIMEOUT = timeout;
  };
}
