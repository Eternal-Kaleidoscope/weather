<template>
  <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
    <div class="flex items-start">
      <div class="flex-shrink-0">
        <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
      </div>
      <div class="ml-3">
        <h3 class="text-sm font-medium text-yellow-800">
          API 连接状态
        </h3>
        <div class="mt-2 text-sm text-yellow-700">
          <p class="mb-2">
            当前应用使用 <strong>API KEY</strong> 认证方式连接和风天气API：<code class="bg-yellow-100 px-1 rounded">p47fbyuxn3.re.qweatherapi.com</code>
          </p>
          <ul class="list-disc list-inside space-y-1">
            <li>🔑 <strong>认证方式</strong> - API KEY (简单安全)</li>
            <li>✅ <strong>天气预报功能</strong> - 正常可用（城市搜索、实时天气、7天预报、生活指数等）</li>
            <li>🌪️ <strong>台风监测功能</strong> - 如API不可用会显示演示数据</li>
            <li>📡 如遇到连接问题，请检查API密钥配置</li>
          </ul>
        </div>
        <div class="mt-3">
          <a 
            href="https://dev.qweather.com/docs/finance/pricing/" 
            target="_blank"
            class="text-sm text-yellow-800 underline hover:text-yellow-900"
          >
            查看API定价详情 →
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ApiStatus'
}
</script>

<style scoped>
/* 组件样式已包含在Tailwind CSS中 */
</style>
