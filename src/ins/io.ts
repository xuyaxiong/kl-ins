import { InstructionTool } from "./tool";
import { Instruction } from "./base";
import { PulseStart } from "./bo";
import { SetIO } from "./bo";
import { IsSync } from "./decorator";

@IsSync({ TIMEOUT: 2_000 })
export class EnumIOInstruction extends Instruction {
  public static readonly NAME = "枚举IO点位指令";
  public static readonly MODULE_NUM = 2;
  public static readonly NUM = 1;

  public constructor() {
    super();
    this.fillingData();
  }

  protected getPayload(): number[] {
    return [this._sendNo];
  }
}

export class PulseStartInstruction extends Instruction {
  public static readonly NAME = "信号输出开始指令";
  public static readonly MODULE_NUM = 2;
  public static readonly NUM = 3;
  private pulseStart: PulseStart;

  constructor(pulseStart: PulseStart) {
    super();
    this.pulseStart = pulseStart;
    this.fillingData();
  }

  protected getPayload(): number[] {
    const payload = [];
    payload.push(this._sendNo); // 1字节
    payload.push(...InstructionTool.numToLoHi(this.pulseStart.ioNum));
    payload.push(...InstructionTool.float32ToByteArr(this.pulseStart.width)); // 4字节
    payload.push(
      ...InstructionTool.float32ToByteArr(this.pulseStart.period)
    ); // 4字节
    payload.push(
      ...InstructionTool.float32ToByteArr(this.pulseStart.pulseNum)
    ); // 4字节
    return payload;
  }
}

export class PulseStopInstruction extends Instruction {
  public static readonly NAME = "信号结束开始指令";
  public static readonly MODULE_NUM = 2;
  public static readonly NUM = 4;
  private ioNum: number;

  constructor(ioNum: number) {
    super();
    this.ioNum = ioNum;
    this.fillingData();
  }

  protected getPayload(): number[] {
    const payload = [];
    payload.push(this._sendNo); // 1字节
    payload.push(...InstructionTool.numToLoHi(this.ioNum));
    return payload;
  }
}

export class SetIOInstruction extends Instruction {
  public static readonly NAME = "设置IO状态指令";
  public static readonly MODULE_NUM = 2;
  public static readonly NUM = 5;
  private setIOList: SetIO[];

  constructor(setIOList: SetIO[]) {
    super();
    this.setIOList = setIOList;
    this.fillingData();
  }

  protected getPayload(): number[] {
    const payload = [];
    payload.push(this._sendNo); // 1字节
    for (const setIO of this.setIOList) {
      payload.push(...InstructionTool.numToLoHi(setIO.ioNum));
      payload.push(setIO.status);
    }
    return payload;
  }
}

@IsSync({ TIMEOUT: 2_000 })
export class GetIOInstruction extends Instruction {
  public static readonly NAME = "获取点位状态指令";
  public static readonly MODULE_NUM = 2;
  public static readonly NUM = 6;
  private axisList: number[];

  constructor(axisList: number[]) {
    super();
    this.axisList = axisList;
    this.fillingData();
  }

  protected getPayload(): number[] {
    const payload = [];
    payload.push(this._sendNo); // 1字节
    for (const axis of this.axisList) {
      payload.push(axis);
    }
    return payload;
  }
}
