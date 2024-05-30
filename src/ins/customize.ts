import { InstructionTool } from "./tool";
import { Instruction } from "./base";
import { CapPos } from "./bo";
import { IsSync } from "./decorator";

@IsSync({ TIMEOUT: 10_000 })
export class SetZoomInstruction extends Instruction {
  public static readonly NAME = "切换物镜指令";
  public static readonly MODULE_NUM = 4;
  public static readonly NUM = 1;

  private lensNum: number;

  constructor(lensNum: number) {
    super();
    this.lensNum = lensNum;
    this.fillingData();
  }

  protected getPayload(): number[] {
    const payload = [];
    payload.push(this._sendNo); // 1字节
    payload.push(this.lensNum); // 1字节
    return payload;
  }
}

@IsSync({ TIMEOUT: 2_000 })
export class GetZoomInstruction extends Instruction {
  public static readonly NAME = "获取当前物镜指令";
  public static readonly MODULE_NUM = 4;
  public static readonly NUM = 2;

  public constructor() {
    super();
    this.fillingData();
  }

  protected getPayload(): number[] {
    return [this._sendNo];
  }
}

@IsSync({ TIMEOUT: 1_000 })
export class CapPosInstruction extends Instruction {
  public static readonly NAME = "下发拍照点位列表指令";
  public static readonly MODULE_NUM = 4;
  public static readonly NUM = 3;

  private total: number;
  private startIdx: number;
  private capPosList: CapPos[];

  constructor(total: number, startIdx: number, capPosList: CapPos[]) {
    super();
    this.total = total;
    this.startIdx = startIdx;
    this.capPosList = capPosList;
    this.fillingData();
  }

  protected getPayload(): number[] {
    const payload = [];
    payload.push(this._sendNo);
    payload.push(...InstructionTool.numToLoHi(this.total));
    payload.push(...InstructionTool.numToLoHi(this.startIdx));
    for (const capPos of this.capPosList) {
      payload.push(...InstructionTool.float32ToByteArr(capPos.x));
      payload.push(...InstructionTool.float32ToByteArr(capPos.y));
    }
    return payload;
  }
}

export class TakePhotoInstruction extends Instruction {
  public static readonly NAME = "触发相机拍照指令";
  public static readonly MODULE_NUM = 4;
  public static readonly NUM = 6;

  private camNum: number;

  constructor(camNum: number) {
    super();
    this.camNum = camNum;
    this.fillingData();
  }

  protected getPayload(): number[] {
    return [this._sendNo, this.camNum];
  }
}

export class SwitchModeInstruction extends Instruction {
  public static readonly NAME = "切换PLC手动/自动模式指令";
  public static readonly MODULE_NUM = 4;
  public static readonly NUM = 7;

  private mode: number;

  constructor(mode: number) {
    super();
    this.mode = mode;
    this.fillingData();
  }

  protected getPayload(): number[] {
    return [this._sendNo, this.mode];
  }
}

@IsSync({ TIMEOUT: 50_000 })
export class InitPlcInstruction extends Instruction {
  public static readonly NAME = "初始化PLC指令";
  public static readonly MODULE_NUM = 4;
  public static readonly NUM = 8;

  public constructor() {
    super();
    this.fillingData();
  }

  protected getPayload(): number[] {
    return [this._sendNo];
  }
}

@IsSync({ TIMEOUT: 5_000 })
export class StartPlcInstruction extends Instruction {
  public static readonly NAME = "启动PLC指令";
  public static readonly MODULE_NUM = 4;
  public static readonly NUM = 9;

  public constructor() {
    super();
    this.fillingData();
  }

  protected getPayload(): number[] {
    return [this._sendNo];
  }
}
