import { InstructionTools } from "./instools";
import { Instruction } from "./base";
import { MoveItemInfo } from "./bo";
import { IsSync } from "./decorator";

@IsSync({ TIMEOUT: 2_000 })
export class EnumAxisInstruction extends Instruction {
  public static readonly NAME = "枚举有效轴号指令";
  public static readonly MODULE_NUM = 1;
  public static readonly NUM = 1;

  public constructor() {
    super();
  }

  protected getPayload(): number[] {
    return [this._sendNo];
  }
}

@IsSync({ TIMEOUT: 120_000 })
export class HomeInstruction extends Instruction {
  public static readonly NAME = "复位回零指令";
  public static readonly MODULE_NUM = 1;
  public static readonly NUM = 2;

  private axisList: number[];

  constructor(axisList: number[]) {
    super();
    this.axisList = axisList;
  }

  protected getPayload(): number[] {
    const payload = [this._sendNo];
    for (const axis of this.axisList) {
      payload.push(axis);
    }
    return payload;
  }
}

export class JogStartInstruction extends Instruction {
  public static readonly NAME = "手动示教移动开始指令";
  public static readonly MODULE_NUM = 1;
  public static readonly NUM = 3;

  private axisNum: number;
  private speed: number;
  private direction: number;

  constructor(axisNum: number, speed: number, direction: number) {
    super();
    this.axisNum = axisNum;
    this.speed = speed;
    this.direction = direction;
  }

  protected getPayload(): number[] {
    const payload = [];
    payload.push(this.axisNum);
    payload.push(...InstructionTools.float32ToByteArr(this.speed));
    payload.push(this.direction);
    return payload;
  }
}

export class JogStopInstruction extends Instruction {
  public static readonly NAME = "手动示教移动停止指令";
  public static readonly MODULE_NUM = 1;
  public static readonly NUM = 4;

  private axisNum: number;

  constructor(axisNum: number) {
    super();
    this.axisNum = axisNum;
  }

  protected getPayload(): number[] {
    return [this.axisNum];
  }
}

@IsSync({ TIMEOUT: 120_000 })
export class MoveInstruction extends Instruction {
  public static readonly NAME = "运动指令";
  public static readonly MODULE_NUM = 1;
  public static readonly NUM = 5;

  private moveItemInfoList: MoveItemInfo[];

  constructor(moveItemInfoList: MoveItemInfo[]) {
    super();
    this.moveItemInfoList = moveItemInfoList;
  }

  protected getPayload(): number[] {
    const payload = [];
    payload.push(this._sendNo); // 1字节
    for (const item of this.moveItemInfoList) {
      payload.push(item.axisNum); // 1字节
      payload.push(...InstructionTools.float32ToByteArr(item.speed)); // 4字节
      payload.push(...InstructionTools.float32ToByteArr(item.dest)); // 4字节
      payload.push(item.isRelative ? 1 : 0); // 1字节
    }
    return payload;
  }
}

@IsSync({ TIMEOUT: 2_000 })
export class GetPosInstruction extends Instruction {
  public static readonly NAME = "获取轴速与位置指令";
  public static readonly MODULE_NUM = 1;
  public static readonly NUM = 6;

  private axisList: number[];

  constructor(axisList: number[]) {
    super();
    this.axisList = axisList;
  }

  protected getPayload(): number[] {
    const payload = [];
    payload.push(this._sendNo); // 1字节
    for (const item of this.axisList) {
      payload.push(item); // 1字节
    }
    return payload;
  }
}
