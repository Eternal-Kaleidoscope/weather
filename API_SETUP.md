# API配置指南

## 重要提示

**当前应用使用API KEY认证方式，简单高效。** 请按照以下步骤进行配置：

## 1. 获取和风天气API密钥

1. 访问 [和风天气开发平台](https://dev.qweather.com/)
2. 注册开发者账号
3. 创建新项目
4. 在项目管理中添加凭据
5. 选择"API KEY"身份认证方式
6. 复制生成的API KEY

## 2. 配置项目

### 方式一：直接修改配置文件

编辑 `src/api/weather.js` 文件：

```javascript
const API_CONFIG = {
  apiKey: 'YOUR_ACTUAL_API_KEY_HERE', // 替换为您的API KEY
  baseURL: 'https://geoapi.qweather.com',
  weatherBaseURL: 'https://devapi.qweather.com'
}
```

### 方式二：使用环境变量（推荐生产环境）

1. 创建 `.env.local` 文件：
```
VITE_QWEATHER_API_KEY=your_actual_api_key_here
```

2. 修改 `src/api/weather.js`：
```javascript
const API_CONFIG = {
  apiKey: import.meta.env.VITE_QWEATHER_API_KEY || 'YOUR_API_KEY',
  baseURL: 'https://geoapi.qweather.com',
  weatherBaseURL: 'https://devapi.qweather.com'
}
```

## 3. 项目配置信息

根据您提供的信息：
- **API主机**: p47fbyuxn3.re.qweatherapi.com
- **API密钥**: db9123dd88164046b314ad1273139249

这些信息已经在 `src/api/weather.js` 中配置好了。

## 4. 验证配置

启动应用后，检查浏览器控制台：
- 如果看到API请求成功，说明配置正确
- 如果看到401或403错误，请检查API KEY是否正确
- 如果看到网络错误，请检查网络连接

## 5. API限制

请注意和风天气API的使用限制：
- 免费账户有每日请求次数限制
- 请合理控制请求频率
- 避免重复无效请求

## 故障排除

### 常见问题

1. **API KEY无效**
   - 检查API KEY是否完整复制
   - 确认API KEY状态是否为"启用"
   - 检查项目配置是否正确

2. **跨域请求问题**
   - 和风天气API支持跨域请求
   - 如果仍有问题，检查浏览器设置

3. **请求超时**
   - 检查网络连接
   - 可以适当增加timeout值

4. **数据格式错误**
   - 检查API版本是否匹配
   - 确认请求参数格式正确

## 安全建议

1. **不要在代码中硬编码API密钥**
2. **使用环境变量管理敏感信息**
3. **定期更换API密钥**
4. **监控API使用情况**
5. **在生产环境中使用HTTPS**

## 联系支持

如果遇到问题：
1. 查看 [和风天气开发文档](https://dev.qweather.com/docs/)
2. 联系和风天气技术支持
3. 在GitHub仓库提交Issue
