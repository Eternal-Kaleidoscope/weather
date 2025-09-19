#!/usr/bin/env node

/**
 * 部署前检查脚本
 * 检查项目是否准备好进行部署
 */

const fs = require('fs')
const path = require('path')

console.log('🔍 部署前检查...\n')

let allChecks = true

// 检查项目
const checks = [
  {
    name: '📦 package.json',
    check: () => fs.existsSync('package.json') && JSON.parse(fs.readFileSync('package.json', 'utf8')).name
  },
  {
    name: '🏗️ 构建配置',
    check: () => fs.existsSync('vite.config.js')
  },
  {
    name: '📝 源码目录',
    check: () => fs.existsSync('src') && fs.existsSync('src/main.js')
  },
  {
    name: '🎨 样式配置', 
    check: () => fs.existsSync('tailwind.config.js')
  },
  {
    name: '🔧 部署配置',
    check: () => fs.existsSync('.github/workflows/deploy.yml') || fs.existsSync('.github/workflows/auto-deploy.yml')
  },
  {
    name: '🌐 入口文件',
    check: () => fs.existsSync('index.html')
  }
]

// 运行检查
checks.forEach(({ name, check }) => {
  const result = check()
  const status = result ? '✅' : '❌'
  console.log(`${status} ${name}`)
  if (!result) allChecks = false
})

console.log('\n' + '='.repeat(40))

if (allChecks) {
  console.log('🎉 所有检查通过，项目可以部署！')
  console.log('\n💡 部署说明:')
  console.log('- 推送到 main/master 分支将自动触发部署')
  console.log('- GitHub Pages 部署地址将在 Actions 完成后可用')
  console.log('- 确保在 GitHub 仓库设置中启用了 GitHub Pages')
  
  // 检查是否有环境变量配置
  if (fs.existsSync('.env.local')) {
    console.log('- ✅ 发现本地环境配置文件 (.env.local)')
  } else {
    console.log('- ⚠️  未找到 .env.local 文件，请确保在 GitHub Secrets 中配置了 QWEATHER_API_KEY')
  }
  
  process.exit(0)
} else {
  console.log('❌ 部署检查失败，请修复上述问题后重试')
  process.exit(1)
}
