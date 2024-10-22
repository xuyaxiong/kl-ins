const _ = require("lodash");
import InsTools from "./instools";
import Ins from "./Ins";
import SyncIns from "./SyncIns";
import { Timeout } from "./decorator";
import { MoveItemInfo } from "./bo";

@Timeout({ timeout: 2_000 })
export class EnumAxisIns extends SyncIns {
  public static readonly NAME = "枚举有效轴号指令";
  public static readonly MODULE_NUM = 1;
  public static readonly NUM = 1;

  public constructor() {
    super();
  }

  protected getPayload(): number[] {
    return [this._sendNo];
  }

  public detail(): string {
    return `${this.getName()}\n\t`;
  }

  public mockRespData(): string {
    return `55 aa 0d 00 01 81 ${this.getSendNoHex()} 01 02 03 04 0d 0a`;
  }

  public parseRespData(data: number[] | Buffer): any {
    return InsTools.getPayloadFromResp(data);
  }
}

@Timeout({ timeout: 120_000 })
export class HomeIns extends SyncIns {
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

  public detail(): string {
    return `${this.getName()}\n\t轴号列表: ${this.axisList.join(", ")}`;
  }

  public mockRespData(): string {
    return `55 aa 0d 00 01 82 ${this.getSendNoHex()} 00 00 00 00 0d 0a`;
  }

  public parseRespData(data: number[] | Buffer) {
    return InsTools.getPayloadFromResp(data);
  }
}

export class JogStartIns extends Ins {
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
    payload.push(...InsTools.float32ToByteArr(this.speed));
    payload.push(this.direction);
    return payload;
  }

  public detail(): string {
    return `${this.getName()}\n\t轴号: ${this.axisNum}\n\t速度: ${
      this.speed
    }\n\t方向: ${this.direction}`;
  }
}

export class JogStopIns extends Ins {
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

  public detail(): string {
    return `${this.getName()}\n\t轴号: ${this.axisNum}`;
  }
}

@Timeout({ timeout: 120_000 })
export class MoveIns extends SyncIns {
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
      payload.push(...InsTools.float32ToByteArr(item.speed)); // 4字节
      payload.push(...InsTools.float32ToByteArr(item.dest)); // 4字节
      payload.push(item.isRelative ? 1 : 0); // 1字节
    }
    return payload;
  }

  public detail(): string {
    const info = this.moveItemInfoList
      .map(
        (item) =>
          `轴号: ${item.axisNum}, 速度: ${item.speed}, 目标值: ${item.dest}, 是否相对: ${item.isRelative}`
      )
      .join("\n\t");
    return `${this.getName()}\n\t${info}`;
  }

  public mockRespData(): string {
    return `55 aa 0d 00 01 85 ${this.getSendNoHex()} 00 00 00 00 0d 0a`;
  }

  public parseRespData(data: number[] | Buffer) {
    return InsTools.getPayloadFromResp(data);
  }
}

@Timeout({ timeout: 10_000 })
export class GetPosIns extends SyncIns {
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

  public detail(): string {
    return `${this.getName()}\n\t轴号列表: ${this.axisList.join(", ")}`;
  }

  public mockRespData(): string {
    const mockData = [
      { axis: 1, speed: 100, dest: 201 },
      { axis: 2, speed: 101, dest: 202 },
      { axis: 3, speed: 102, dest: 203 },
    ];
    const arr = [];
    for (const item of mockData) {
      arr.push(item.axis);
      arr.push(...InsTools.float32ToByteArr(item.speed));
      arr.push(...InsTools.float32ToByteArr(item.dest));
    }
    const len = 6 + 1 + mockData.length * (1 + 4 + 4) + 2;
    return `55 aa ${InsTools.byteArrToHexStr(
      InsTools.lenToLoHi(len)
    )} 01 86 ${this.getSendNoHex()} ${InsTools.byteArrToHexStr(arr)} 0d 0a`;
  }

  public parseRespData(data: number[] | Buffer) {
    data = InsTools.getPayloadFromResp(data);
    const chunks = _.chunk(data, 9);
    const res = chunks.map((item: number[]) => {
      const axisNum = item[0];
      const speed = InsTools.byteArrToFloat32(_.slice(item, 1, 5));
      const pos = InsTools.byteArrToFloat32(_.slice(item, 5, 10));
      return {
        axisNum,
        speed,
        pos,
      };
    });
    return res;
  }
}
