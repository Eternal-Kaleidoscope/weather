# 🚀 GitHub 自动部署指南

## 📋 概述

本项目配置了完整的 GitHub Actions 自动化部署流程，**每次推送到主分支时会自动触发部署**。

## ⚡ 快速开始

### 1. 推送代码自动部署
```bash
# 提交你的更改
git add .
git commit -m "更新功能"

# 推送到主分支 - 自动触发部署！
git push origin main
```

### 2. 本地部署测试
```bash
# 检查部署准备情况
npm run deploy:check

# 构建并预览部署版本
npm run deploy:preview
```

## 🔧 部署配置

### GitHub Secrets 配置
在 GitHub 仓库设置中添加以下 Secrets：

```
QWEATHER_API_KEY=你的和风天气API密钥
```

**配置步骤：**
1. 进入 GitHub 仓库页面
2. 点击 `Settings` → `Secrets and variables` → `Actions`
3. 点击 `New repository secret`
4. 添加上述 Secret

### GitHub Pages 设置
1. 进入仓库 `Settings` → `Pages`
2. Source 选择 `GitHub Actions`
3. 保存设置

## 🔄 自动化流程

### 触发条件
- ✅ 推送到 `main` 或 `master` 分支
- ✅ 手动触发 (workflow_dispatch)
- ❌ 忽略文档文件更改 (*.md)

### 部署步骤
1. **代码检出** - 获取最新代码
2. **环境准备** - 安装 Node.js 18
3. **依赖安装** - npm ci (带缓存优化)
4. **项目构建** - npm run build
5. **测试运行** - npm test (如果有)
6. **部署发布** - 部署到 GitHub Pages

### 两个工作流

#### 1. 完整部署流程 (`deploy.yml`)
- 🎯 功能全面，包含详细报告
- 🔄 支持 GitHub Pages + Vercel 双平台部署
- ⏱️ 适合正式发布

#### 2. 快速部署流程 (`auto-deploy.yml`)
- ⚡ 专注速度，快速部署
- 🎯 仅部署到 GitHub Pages
- ⏱️ 适合日常开发

## 📊 部署监控

### 查看部署状态
1. 进入 GitHub 仓库页面
2. 点击 `Actions` 标签
3. 查看最新的工作流运行状态

### 部署成功标志
- ✅ 绿色勾号表示部署成功
- 🔗 获取部署链接：`https://用户名.github.io/仓库名`

### 部署失败排查
1. **检查 Secrets 配置** - API 密钥是否正确
2. **查看构建日志** - 点击失败的 Action 查看详情
3. **检查代码语法** - 确保本地 `npm run build` 成功
4. **验证 GitHub Pages 设置** - 确保已启用

## 🎯 最佳实践

### 部署前检查
```bash
# 运行完整检查
npm run check

# 检查部署准备
npm run deploy:check

# 本地构建测试
npm run build
```

### 分支策略
```bash
# 开发分支 (不会触发部署)
git checkout -b feature/new-feature
git push origin feature/new-feature

# 合并到主分支 (触发自动部署)
git checkout main
git merge feature/new-feature
git push origin main  # 🚀 自动部署！
```

### 版本管理
```bash
# 添加版本标签
git tag v1.0.0
git push origin v1.0.0

# 自动生成版本号
npm version patch  # 1.0.0 → 1.0.1
git push origin main --tags
```

## 🔍 故障排除

### 常见问题

#### 1. 部署失败 - API 密钥错误
```
Error: API密钥无效或权限不足
```
**解决方案：**
- 检查 GitHub Secrets 中的 `QWEATHER_API_KEY`
- 确认 API 密钥在和风天气控制台中有效

#### 2. 部署失败 - 构建错误
```
Error: Failed to build
```
**解决方案：**
```bash
# 本地测试构建
npm run build
# 检查并修复构建错误
```

#### 3. GitHub Pages 无法访问
**解决方案：**
- 检查 GitHub Pages 设置
- 确认选择了 "GitHub Actions" 作为源
- 等待 DNS 传播（可能需要几分钟）

#### 4. 权限错误
```
Error: Permission denied
```
**解决方案：**
- 检查 GitHub Actions 权限设置
- 确保仓库具有 Pages 写入权限

## 📚 相关文档

- [GitHub Actions 文档](https://docs.github.com/cn/actions)
- [GitHub Pages 文档](https://docs.github.com/cn/pages)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html)

## 🎉 部署成功后

部署成功后，你的应用将在以下地址可用：
- 🔗 **GitHub Pages**: `https://用户名.github.io/wearther`
- 📱 支持移动端和桌面端访问
- ⚡ 自动 HTTPS 和 CDN 加速

**享受你的自动化部署流程！** 🚀
