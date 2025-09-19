# 🚀 Kaleidoscope's Weather 部署指南

## 自动化部署配置

本项目已配置完整的 CI/CD 自动化部署流程，支持多种部署平台。

## 📋 部署前准备

### 1. GitHub Secrets 配置

在 GitHub 仓库设置中添加以下 Secrets：

#### 必需的 Secrets
```bash
# 和风天气API配置
QWEATHER_API_KEY=your_api_key_here

# Vercel部署配置 (可选)
VERCEL_TOKEN=your_vercel_token
ORG_ID=your_vercel_org_id
PROJECT_ID_VERCEL=your_vercel_project_id
```

#### GitHub Token
- `GITHUB_TOKEN` - GitHub 自动提供，用于 GitHub Pages 部署

### 2. 环境变量配置

在项目根目录创建 `.env.local` 文件：
```bash
VITE_QWEATHER_API_KEY=db9123dd88164046b314ad1273139249
```

## 🔄 自动化工作流

### GitHub Actions 工作流

#### 1. 主部署流程 (`.github/workflows/deploy.yml`)
- **触发条件**: 推送到 `main` 或 `master` 分支
- **部署目标**: GitHub Pages + Vercel
- **流程**:
  1. 检出代码
  2. 设置 Node.js 环境
  3. 安装依赖
  4. 构建项目
  5. 运行测试
  6. 部署到 GitHub Pages
  7. 部署到 Vercel

#### 2. CI/CD 管道 (`.github/workflows/ci.yml`)
- **触发条件**: 推送到任何分支或创建 PR
- **测试环境**: Node.js 16.x, 18.x, 20.x
- **流程**:
  1. 代码检查和类型检查
  2. 运行测试套件
  3. 构建验证
  4. 安全扫描
  5. 依赖审查

## 🌐 部署平台

### 1. GitHub Pages 部署

**自动部署**:
- 推送到主分支自动触发
- 构建文件自动发布到 `gh-pages` 分支
- 访问地址: `https://yourusername.github.io/repository-name`

**手动部署**:
```bash
npm run build
# 将 dist 目录内容推送到 gh-pages 分支
```

### 2. Vercel 部署

**自动部署**:
- 连接 GitHub 仓库
- 每次推送自动部署
- 支持预览分支

**手动部署**:
```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel --prod
```

**配置文件**: `vercel.json`
- 自动处理单页应用路由
- 环境变量配置
- 安全头设置

### 3. Netlify 部署

**配置**:
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 4. 自建服务器部署

#### 使用 Docker
```dockerfile
# Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### 使用 PM2
```bash
# 构建项目
npm run build

# 使用简单 HTTP 服务器
npm install -g serve pm2
pm2 serve dist 3000 --spa --name "kaleidoscope-weather"
```

## 🔧 构建优化

### 性能优化配置

在 `vite.config.js` 中添加：
```javascript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'axios'],
          ui: ['tailwindcss']
        }
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
})
```

### CDN 配置
可以使用 CDN 加速静态资源：
- jsDelivr: `https://cdn.jsdelivr.net/gh/username/repo@tag/dist/`
- unpkg: `https://unpkg.com/package@version/`

## 🚨 故障排除

### 常见问题

1. **构建失败**
   ```bash
   # 清理缓存
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. **环境变量未生效**
   - 检查变量名是否以 `VITE_` 开头
   - 确认 `.env.local` 文件位置正确
   - 验证 GitHub Secrets 配置

3. **路由404错误**
   - 配置服务器支持 SPA 路由
   - 检查 `vercel.json` 重定向规则

4. **API请求失败**
   - 验证 API 密钥有效性
   - 检查 CORS 配置
   - 确认 API 主机地址正确

### 调试命令
```bash
# 本地开发
npm run dev

# 构建调试
npm run build
npm run preview

# 检查构建大小
npm run build -- --analyze
```

## 📊 监控和分析

### 性能监控
- Google PageSpeed Insights
- Lighthouse CI
- Web Vitals

### 错误监控
- Sentry 集成
- LogRocket
- Bugsnag

### 分析工具
- Google Analytics
- Plausible Analytics
- Mixpanel

## 🔒 安全配置

### 环境安全
- 不要提交 `.env` 文件到仓库
- 定期轮换 API 密钥
- 使用最小权限原则

### 内容安全策略
在 `index.html` 中添加：
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';">
```

## 📝 部署检查清单

- [ ] 配置所有必需的环境变量
- [ ] 测试构建过程
- [ ] 验证 API 连接
- [ ] 检查响应式设计
- [ ] 测试所有功能模块
- [ ] 配置域名和SSL证书
- [ ] 设置监控和告警
- [ ] 准备回滚计划

---

**提示**: 首次部署前建议在测试环境验证所有功能！
