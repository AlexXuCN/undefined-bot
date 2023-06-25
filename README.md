# undefined-bot

自用的QQ机器人，模块化，代码质量低劣（笑）

基于[go-cqhttp](https://github.com/Mrs4s/go-cqhttp) (onebot11) 的正向Websocket服务器

使用nodejs编写

## 使用

### 连接到go-cqhttp

设置环境变量`BOT_WS_HOST`以及`BOT_WS_TOKEN`  
或写入`.env`文件 示例：  
```
BOT_WS_HOST=ws://127.0.0.1:8888
BOT_WS_TOKEN=KFCCRAZYTHURSDAYVIVO50
```

### 启用模块

编辑`entry.js`的最后几行 祝你好运:)

### 启动

- Windows系统使用`bot.cmd`  
- *nix系统使用`bot.sh`  
  *注：\*nix用户可在当前目录下新建一个名为`norestart`的空文件来阻止崩溃时自动重启机器人*