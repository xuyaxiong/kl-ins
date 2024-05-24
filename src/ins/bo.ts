// 总共10个字节
export interface MoveItemInfo {
  axisNum: number; // 轴号 1字节
  speed: number; // 速度 4字节
  dest: number; // 位置 4字节
  isRelative: boolean; // 是否相对运动 1字节
}

// 总共 3个字节
export interface SetIO {
  ioNum: number; // IO号 2字节
  status: number; // 状态 1字节
}

// 总共 14个字节
export interface PulseStart {
  ioNum: number; // IO号 2字节
  width: number; // 脉宽 4字节
  period: number; // 周期 4字节
  pulseNum: number; // 次数 4字节
}

export interface CapPos {
  x: number;
  y: number;
}
