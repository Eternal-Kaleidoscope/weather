#!/usr/bin/env node

/**
 * GitHub Actions 工作流验证脚本
 */

import fs from 'fs'
import path from 'path'

console.log('🔍 验证 GitHub Actions 工作流...\n')

const workflowPath = '.github/workflows/deploy.yml'

if (!fs.existsSync(workflowPath)) {
  console.log('❌ 工作流文件不存在:', workflowPath)
  process.exit(1)
}

try {
  const content = fs.readFileSync(workflowPath, 'utf8')
  
  // 基本语法检查
  const checks = [
    {
      name: 'YAML基本格式',
      test: () => !content.includes('\t'), // 不应该有制表符
      fix: '使用空格缩进，不要使用制表符'
    },
    {
      name: '工作流名称',
      test: () => content.includes('name:'),
      fix: '确保有 name 字段'
    },
    {
      name: '触发条件',
      test: () => content.includes('on:'),
      fix: '确保有 on 字段定义触发条件'
    },
    {
      name: '权限设置',
      test: () => content.includes('permissions:'),
      fix: '确保有 permissions 字段'
    },
    {
      name: '作业定义',
      test: () => content.includes('jobs:'),
      fix: '确保有 jobs 字段'
    },
    {
      name: 'Actions版本',
      test: () => content.includes('actions/checkout@v4') && 
                  content.includes('actions/upload-pages-artifact@v3') &&
                  content.includes('actions/deploy-pages@v4'),
      fix: '使用最新的 actions 版本（checkout@v4, upload-pages-artifact@v3, deploy-pages@v4）'
    },
    {
      name: '环境变量语法',
      test: () => !content.includes('secrets.') || content.includes('${{ secrets.'),
      fix: '正确使用 ${{ secrets.SECRET_NAME }} 语法'
    }
  ]
  
  let allPassed = true
  
  checks.forEach(({ name, test, fix }) => {
    const passed = test()
    const status = passed ? '✅' : '❌'
    console.log(`${status} ${name}`)
    if (!passed) {
      console.log(`   💡 建议: ${fix}`)
      allPassed = false
    }
  })
  
  console.log('\n' + '='.repeat(50))
  
  if (allPassed) {
    console.log('🎉 工作流配置验证通过！')
    console.log('\n📋 部署清单:')
    console.log('1. ✅ 推送代码到 main/master 分支')
    console.log('2. ✅ GitHub Actions 自动触发')
    console.log('3. ✅ 构建 Vue 项目')
    console.log('4. ✅ 部署到 GitHub Pages')
    console.log('\n🔗 访问地址: https://用户名.github.io/仓库名')
  } else {
    console.log('❌ 工作流配置需要修复')
  }
  
} catch (error) {
  console.log('❌ 读取工作流文件失败:', error.message)
  process.exit(1)
}
