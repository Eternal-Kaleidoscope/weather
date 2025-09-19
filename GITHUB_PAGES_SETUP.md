# 🔧 GitHub Pages 设置指南

## 🚨 解决部署 404 错误

### 问题分析
您遇到的错误 `Failed to create deployment (status: 404)` 通常是因为：
1. GitHub Pages 没有在仓库中启用
2. 权限设置不正确
3. 使用了过于新的 API 而仓库还未支持

### ✅ 解决方案

我已经修改了部署配置，使用更兼容的 `peaceiris/actions-gh-pages@v3`，这是最稳定和广泛使用的 GitHub Pages 部署 Action。

## 📋 GitHub Pages 手动设置步骤

### 1. 启用 GitHub Pages
1. 进入你的 GitHub 仓库页面
2. 点击 `Settings` 标签
3. 在左侧菜单中找到 `Pages`
4. 在 "Source" 部分：
   - 选择 `Deploy from a branch`
   - Branch 选择 `gh-pages`
   - Folder 保持 `/ (root)`
5. 点击 `Save`

### 2. 设置仓库权限（重要！）
1. 在 `Settings` → `Actions` → `General`
2. 找到 "Workflow permissions"
3. 选择 `Read and write permissions`
4. 勾选 `Allow GitHub Actions to create and approve pull requests`
5. 点击 `Save`

### 3. 检查 Secrets 配置
确保在 `Settings` → `Secrets and variables` → `Actions` 中有：
```
QWEATHER_API_KEY = 你的和风天气API密钥
```

## 🔄 新的部署流程

### 配置特点
- ✅ **单一作业**: 构建和部署在一个作业中完成
- ✅ **兼容性**: 使用成熟稳定的 peaceiris/actions-gh-pages
- ✅ **权限**: 设置了正确的 contents: write 权限
- ✅ **分支**: 自动创建和管理 gh-pages 分支

### 部署步骤
```yaml
1. 📥 检出代码
2. 📦 设置 Node.js 环境
3. 🔧 安装依赖
4. 🏗️ 构建项目
5. 🚀 部署到 gh-pages 分支
6. 🎉 生成报告
```

## 🎯 预期结果

推送代码后你将看到：
1. **GitHub Actions 成功运行**
2. **自动创建 gh-pages 分支**
3. **GitHub Pages 自动激活**
4. **网站可通过以下地址访问**：
   ```
   https://你的用户名.github.io/wearther
   ```

## 🔍 常见问题排查

### Q1: 仍然出现 404 错误？
**解决方案**：
- 检查仓库是否为公开仓库（私有仓库需要 Pro 账户）
- 确认在 Settings → Pages 中选择了 gh-pages 分支

### Q2: GitHub Pages 显示 "There isn't a GitHub Pages site here"？
**解决方案**：
- 等待几分钟让部署完成
- 检查 gh-pages 分支是否有内容
- 刷新浏览器缓存

### Q3: 构建成功但页面显示空白？
**解决方案**：
- 检查浏览器控制台是否有错误
- 确认 API 密钥配置正确
- 检查网络是否能访问 API 地址

## 🚀 测试部署

完成上述设置后，推送任何代码到 main 分支都会自动触发部署：

```bash
git add .
git commit -m "测试 GitHub Pages 部署"
git push origin main
```

---

**状态**: 🔧 配置已优化，等待您手动设置 GitHub Pages
**下一步**: 按照上述步骤设置 GitHub Pages，然后推送代码测试
