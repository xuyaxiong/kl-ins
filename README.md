# kl-ins

### 一、安装

```bash
npm install kl-ins
```

### 二、用法

```typescript
import { ClientProxy, MoveIns, ReportData } from "kl-ins";

const proxy = new ClientProxy("测试客户端", "127.0.0.1", 7777);
proxy.setReportDataHandler(async ({ modNum, insNum, data }: ReportData) => {
  // 处理主动上报数据
});
(async () => {
  await proxy.connect();
  const moveIns = new MoveIns([
    {
      axisNum: 1,
      speed: 99.99,
      dest: 100.01,
      isRelative: true,
    },
  ]);
  console.log("mock返回数据:", moveIns.mockRespData());
  const res = await proxy.sendIns(moveIns);
  console.log("解析返回数据:", res);
})();
```

### 三、指令集

1. 轴控制

- EnumAxisIns（枚举有效轴号指令）

```typescript
new EnumAxisIns();
```

- HomeIns（复位回零指令）

```typescript
new HomeIns(axisList: number[]);
```

- JogStartIns（手动示教移动开始指令）

```typescript
new JogStartIns(axisNum: number, speed: number, direction: number);
```

- JogStopIns（手动示教移动停止指令）

```typescript
new JogStopIns(axisNum: number);
```

- MoveIns（运动指令）

```typescript
new MoveIns(moveItemInfoList: [{
    axisNum: number,
    speed: number,
    dest: number,
    isRelative: boolean
}]
```

- GetPosIns（获取轴速与位置指令）

```typescript
new GetPosIns(axisList: number[]);
```

2. IO 控制

3. 周期性包

### 四、自定义指令

1. 同步指令

```typescript
import { SyncIns, Timeout } from "kl-ins";

// 同步方法需要使用Timeout注解，并传入超时时长，单位为毫秒
@Timeout(2_000)
class YourIns extends SyncIns {
  public static readonly NAME = "你的指令名称";
  public static readonly MOD_NUM = 1; //  模块号
  public static readonly INS_NUM = 1; // 指令号,同一模块指令号需保证唯一

  protected getPayload(): number[] {
    // 你需要实现这个方法，返回payload数组
  }

  public parseRespData(data: number[] | Buffer): any {
    // 你需要实现这个方法，返回解析后的结果
  }
}
```

2. 异步指令

```typescript
import { Ins } from "kl-ins";

class YourIns extends Ins {
  public static readonly NAME = "你的指令名称";
  public static readonly MOD_NUM = 1; //  模块号
  public static readonly INS_NUM = 1; // 指令号,同一模块指令号需保证唯一

  protected getPayload(): number[] {
    // 你需要实现这个方法，返回payload数组
    return [];
  }
}
```

### 五、备注

1. 本工具包使用了装饰器特性，需要在`tsconfig.json`中打开**装饰器**设置，设置如下：

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```
