import { InstructionTool } from "./tool";
import { Instruction } from "./base";

export class SubAxisInstruction extends Instruction {
  public static readonly NAME = "订阅轴状态指令";
  public static readonly MODULE_NUM = 3;
  public static readonly NUM = 2;

  private cycle: number;

  constructor(cycle: number) {
    super();
    this.cycle = cycle;
    this.fillingData();
  }

  protected getPayloadLen(): number {
    return 4;
  }

  protected _fillPayload() {
    this._data.push(...InstructionTool.float32ToByteArr(this.cycle)); // 4字节
  }
}

export class UnsubAxisInstruction extends Instruction {
  public static readonly NAME = "退订轴状态指令";
  public static readonly MODULE_NUM = 3;
  public static readonly NUM = 3;

  constructor() {
    super();
    this.fillingData();
  }

  protected getPayloadLen(): number {
    return 0;
  }

  protected _fillPayload() {}
}
