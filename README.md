# Kaleidoscope's Weather

基于和风天气API的现代化天气预报应用，集成台风监测功能，支持PC端和移动端响应式设计。

## 🌟 功能特性

- 🔐 **JWT认证集成** - 安全的API访问认证
- 🌍 **全球城市搜索** - 基于和风天气GeoAPI的智能城市搜索
- 🌤️ **实时天气数据** - 获取准确的实时天气信息
- 📅 **7天天气预报** - 详细的未来一周天气预报
- 🏃‍♂️ **生活指数** - 运动、穿衣、洗车等生活建议
- 🌬️ **空气质量监测** - PM2.5、PM10等空气质量指标
- 🌪️ **台风监测系统** - 实时台风路径追踪和预报
- 📊 **历史台风数据** - 查看历年台风记录
- 🎯 **台风预报路径** - 未来台风发展趋势预测
- 📱 **响应式设计** - 完美适配PC端和移动端
- 🎨 **现代化UI** - 使用Tailwind CSS构建的美观界面

## 🚀 快速开始

### 环境要求

- Node.js 16+
- npm 或 yarn

### 安装依赖

\`\`\`bash
npm install
# 或
yarn install
\`\`\`

### 配置API密钥

1. 注册和风天气开发者账号：https://dev.qweather.com/
2. 创建项目并生成API KEY
3. 编辑 \`src/api/weather.js\` 文件
4. 将 \`YOUR_API_KEY\` 替换为您的实际API KEY

\`\`\`javascript
const API_CONFIG = {
  apiKey: 'YOUR_ACTUAL_API_KEY', // 替换为您的API KEY
  // ...
}
\`\`\`

### 启动开发服务器

\`\`\`bash
npm run dev
# 或
yarn dev
\`\`\`

应用将在 http://localhost:3000 启动

### 构建生产版本

\`\`\`bash
npm run build
# 或
yarn build
\`\`\`

## 🔧 项目结构

\`\`\`
weather-hefeng/
├── src/
│   ├── api/
│   │   └── weather.js          # 和风天气API接口
│   ├── components/
│   │   ├── WeatherCard.vue     # 当前天气卡片
│   │   ├── ForecastCard.vue    # 天气预报卡片
│   │   ├── LifeIndexCard.vue   # 生活指数卡片
│   │   └── PopularCities.vue   # 热门城市组件
│   ├── utils/
│   │   └── jwt.js              # JWT认证工具
│   ├── App.vue                 # 主应用组件
│   ├── main.js                 # 应用入口
│   └── style.css               # 全局样式
├── index.html                  # HTML模板
├── package.json                # 项目配置
├── vite.config.js              # Vite配置
├── tailwind.config.js          # Tailwind CSS配置
└── README.md                   # 项目说明
\`\`\`

## 🌐 API集成

### 和风天气API

本项目集成了以下和风天气API：

- **GeoAPI** - 城市搜索和地理位置解析 ([文档](https://dev.qweather.com/docs/api/geoapi/city-lookup/))
- **天气预报API** - 实时天气和7天预报 ([实时天气](https://dev.qweather.com/docs/api/weather/weather-now/) | [每日预报](https://dev.qweather.com/docs/api/weather/weather-daily-forecast/))
- **生活指数API** - 各种生活建议指数
- **空气质量API** - 空气质量监测数据
- **台风API** - 台风监测和预报系统
  - [台风列表API](https://dev.qweather.com/docs/api/tropical-cyclone/storm-list/) - 获取历年台风记录
  - [台风实时路径API](https://dev.qweather.com/docs/api/tropical-cyclone/storm-track/) - 台风历史路径追踪
  - [台风预报API](https://dev.qweather.com/docs/api/tropical-cyclone/storm-forecast/) - 台风未来路径预测

### API KEY认证

项目使用简单高效的API KEY认证方式：

1. **获取密钥**：在和风天气控制台生成API KEY
2. **配置密钥**：在项目中配置API KEY
3. **自动认证**：每个请求自动携带密钥进行认证

> 优势：配置简单、调试方便、性能优秀，适合前端应用使用。

## 📱 响应式设计

应用采用移动优先的响应式设计策略：

- **移动端** (< 640px): 单列布局，触摸优化
- **平板端** (640px - 1024px): 自适应网格布局
- **桌面端** (> 1024px): 多列布局，悬停效果

## 🎨 技术栈

- **前端框架**: Vue 3 + Composition API
- **构建工具**: Vite
- **样式框架**: Tailwind CSS
- **HTTP客户端**: Axios
- **工具库**: @vueuse/core

## 🔒 安全考虑

1. **API密钥保护**: 避免在前端暴露敏感密钥
2. **请求频率限制**: 合理控制API调用频率
3. **错误处理**: 完善的错误处理机制
4. **数据验证**: 对API返回数据进行验证

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交Issues和Pull Requests来改进这个项目！

## 📞 联系

如有问题，请通过GitHub Issues联系我们。

---

**数据来源**: [和风天气](https://www.qweather.com/)
