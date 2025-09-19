#!/usr/bin/env node

// 项目启动验证脚本
import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

console.log('🔍 Kaleidoscope Weather 项目检查...\n')

const checks = [
  {
    name: '📦 package.json 格式',
    check: () => {
      try {
        const pkg = JSON.parse(readFileSync(join(__dirname, 'package.json'), 'utf8'))
        return pkg.name === 'kaleidoscope-weather'
      } catch (e) {
        return false
      }
    }
  },
  {
    name: '📁 源码目录',
    check: () => existsSync(join(__dirname, 'src'))
  },
  {
    name: '🎨 图标组件',
    check: () => existsSync(join(__dirname, 'src', 'components', 'Icon.vue'))
  },
  {
    name: '🌐 API配置',
    check: () => existsSync(join(__dirname, 'src', 'api', 'weather.js'))
  },
  {
    name: '🏗️ 构建配置',
    check: () => existsSync(join(__dirname, 'vite.config.js'))
  },
  {
    name: '🎯 Tailwind配置',
    check: () => existsSync(join(__dirname, 'tailwind.config.js'))
  },
  {
    name: '🚀 部署配置',
    check: () => existsSync(join(__dirname, '.github', 'workflows', 'deploy.yml'))
  },
  {
    name: '📚 文档文件',
    check: () => existsSync(join(__dirname, 'README.md')) && existsSync(join(__dirname, 'DEPLOYMENT.md'))
  }
]

let passed = 0
let failed = 0

checks.forEach(({ name, check }) => {
  const result = check()
  const status = result ? '✅' : '❌'
  console.log(`${status} ${name}`)
  
  if (result) {
    passed++
  } else {
    failed++
  }
})

console.log(`\n📊 检查结果: ${passed} 通过, ${failed} 失败`)

if (failed === 0) {
  console.log('\n🎉 项目设置完成！可以运行以下命令:')
  console.log('   npm run dev    - 启动开发服务器')
  console.log('   npm run build  - 构建生产版本')
} else {
  console.log('\n⚠️  请修复失败的检查项后重试')
  process.exit(1)
}
