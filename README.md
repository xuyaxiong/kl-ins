# kl-ins

### 安装

```bash
npm install kl-ins
```

### 用法

```typescript
const proxy = new ClientProxy("PLC", "127.0.0.1", 3000);
await proxy.connect();

// 发送同步指令
const ins = new HomeInstruction([1, 2, 3, 4]);
await proxy.sendInstruction(ins);

// 设置监听函数
proxy.setPlcReportDataHandler(({
    moduleNum: number,
    instructionNum: number,
    data: number[]
}) => {
    // 处理数据
});
```

### 指令集

1. 轴控制

- EnumAxisInstruction（枚举有效轴号指令）

```typescript
new EnumAxisInstruction();
```

- HomeInstruction（复位回零指令）

```typescript
new HomeInstruction(axisList: number[]);
```

- JogStartInstruction（手动示教移动开始指令）

```typescript
new JogStartInstruction(axisNum: number, speed: number, direction: number);
```

- JogStopInstruction（手动示教移动停止指令）

```typescript
new JogStopInstruction(axisNum: number);
```

- MoveInstruction（运动指令）

```typescript
new MoveInstruction(moveItemInfoList: [{
    axisNum: number,
    speed: number,
    dest: number,
    isRelative: boolean
}]
```

- GetPosInstruction（获取轴速与位置指令）

```typescript
new GetPosInstruction(axisList: number[]);
```

2. IO 控制

3. 周期性包

### 自定义指令

1. 同步指令

```typescript
import { Instruction, IsSync } from "kl-ins";

// 同步方法需要使用IsSync注解，并传入超时时长，单位为毫秒
@IsSync({ TIMEOUT: 2_000 })
class YourInstruction extends Instruction {
  public static readonly NAME = "你的指令名称";
  public static readonly MODULE_NUM = 1; //  模块号
  public static readonly NUM = 1; // 指令号,同一模块指令号需保证唯一

  protected getPayload(): number[] {
    // 你需要实现这个方法，返回payload数组
    return [];
  }
}
```

2. 异步指令

```typescript
import { Instruction } from "kl-ins";

class YourInstruction extends Instruction {
  public static readonly NAME = "你的指令名称";
  public static readonly MODULE_NUM = 1; //  模块号
  public static readonly NUM = 1; // 指令号,同一模块指令号需保证唯一

  protected getPayload(): number[] {
    // 你需要实现这个方法，返回payload数组
    return [];
  }
}
```
