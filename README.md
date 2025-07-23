# 语音猜数字游戏

一个有趣的语音交互猜数字小游戏，支持微信小程序平台。

## 功能特点

- 🎤 语音交互体验
- 🎮 智能数字猜测算法
- 📱 微信小程序原生支持
- 🎨 精美的UI设计
- 🔊 音效和震动反馈

## 游戏规则

1. 在心里想一个1到100之间的整数
2. 程序会猜测你的数字
3. 你只需要说"高了"或"低了"来引导
4. 程序会根据你的反馈调整猜测范围
5. 直到猜中你心中的数字

## 技术栈

- 微信小程序原生开发
- JavaScript ES6+
- WXSS样式
- 微信小程序API

## 开发环境

1. 下载并安装微信开发者工具
2. 克隆本项目到本地
3. 配置项目：
   ```bash
   # 复制配置模板
   cp project.config.example.json project.config.json
   
   # 编辑 project.config.json，将 YOUR_WECHAT_APPID_HERE 替换为你的微信小程序 AppID
   ```
4. 在微信开发者工具中导入项目
5. 选择项目目录
6. 点击预览即可在手机上体验

## 配置说明

### 必需配置
- **AppID**: 在 `project.config.json` 中配置你的微信小程序 AppID
- **录音权限**: 在 `app.json` 中已配置录音权限声明

### 安全说明
- `project.config.json` 中的 AppID 已使用占位符
- 请勿将包含真实 AppID 的配置文件提交到公开仓库
- 私有配置文件已添加到 `.gitignore`

## 项目结构

```
├── app.js          # 小程序入口文件
├── app.json        # 小程序配置文件
├── app.wxss        # 全局样式文件
├── pages/
│   └── index/      # 游戏主页面
│       ├── index.js
│       ├── index.wxml
│       └── index.wxss
├── project.config.json  # 项目配置
├── sitemap.json         # 搜索配置
└── README.md           # 项目说明

```

## 部署说明

1. 在微信公众平台注册小程序账号
2. 获取AppID并在project.config.json中配置
3. 在微信开发者工具中点击"上传"
4. 在微信公众平台提交审核
5. 审核通过后即可发布

## 注意事项

- 需要用户授权录音权限
- 当前版本使用选择框模拟语音识别
- 如需真实语音识别，建议集成第三方AI服务

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request！