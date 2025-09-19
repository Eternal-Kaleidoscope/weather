<template>
  <div class="weather-card animate-fade-in">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold text-gray-800 flex items-center">
        <Icon name="typhoon" size="24" color="#1f2937" class="mr-2" />
        台风监测
      </h2>
      
      <!-- 年份选择器 -->
      <div class="flex items-center space-x-2">
        <label class="text-sm text-gray-600">年份:</label>
        <select 
          v-model="selectedYear" 
          @change="fetchTyphoons"
          class="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option v-for="year in availableYears" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
        
        <button
          @click="fetchTyphoons"
          :disabled="loading"
          class="px-3 py-1 bg-primary-500 text-white text-sm rounded-md hover:bg-primary-600 disabled:opacity-50 flex items-center"
        >
          <Icon name="refresh" size="16" color="white" class="mr-1" />
          {{ loading ? '加载中...' : '刷新' }}
        </button>
      </div>
    </div>

    <!-- 活跃台风提示 -->
    <div v-if="activeTyphoons.length > 0" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <div class="flex items-center mb-2">
        <span class="text-red-600 text-lg mr-2">⚠️</span>
        <h3 class="font-medium text-red-800">当前活跃台风</h3>
      </div>
      <div class="space-y-2">
        <div 
          v-for="typhoon in activeTyphoons"
          :key="typhoon.id"
          @click="selectTyphoon(typhoon)"
          class="cursor-pointer bg-white rounded-md p-3 hover:bg-red-50 transition-colors"
        >
          <div class="flex items-center justify-between">
            <div>
              <span class="font-medium text-red-800">{{ typhoon.name }}</span>
              <span class="text-sm text-red-600 ml-2">({{ typhoon.nameLocal }})</span>
            </div>
            <div class="text-sm text-red-600">
              等级: {{ getTyphoonLevel(typhoon.level) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      <p class="mt-2 text-gray-600">正在获取台风数据...</p>
    </div>

    <!-- 错误提示 -->
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
      ⚠️ {{ error }}
    </div>

    <!-- 台风列表 -->
    <div v-if="typhoons.length > 0 && !loading" class="space-y-3">
      <div class="text-sm text-gray-600 mb-4">
        共找到 {{ typhoons.length }} 个台风记录
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="typhoon in typhoons"
          :key="typhoon.id"
          @click="selectTyphoon(typhoon)"
          class="typhoon-item bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 cursor-pointer hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-blue-300"
        >
          <div class="flex items-start justify-between mb-3">
            <div>
              <h3 class="font-semibold text-gray-800 text-lg">{{ typhoon.name }}</h3>
              <p class="text-sm text-gray-600">{{ typhoon.nameLocal }}</p>
            </div>
            <div class="text-right">
              <div class="text-sm font-medium" :class="getLevelColor(typhoon.level)">
                {{ getTyphoonLevel(typhoon.level) }}
              </div>
              <div class="text-xs text-gray-500">{{ typhoon.id }}</div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-gray-600">生成时间:</span>
              <div class="font-medium">{{ formatTime(typhoon.timeStart) }}</div>
            </div>
            <div>
              <span class="text-gray-600">结束时间:</span>
              <div class="font-medium">{{ formatTime(typhoon.timeEnd) || '进行中' }}</div>
            </div>
          </div>

          <div v-if="typhoon.isActive === '1'" class="mt-3 flex items-center">
            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              <span class="w-2 h-2 bg-red-400 rounded-full mr-1 animate-pulse"></span>
              活跃中
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 无数据提示 -->
    <div v-if="typhoons.length === 0 && !loading && !error" class="text-center py-8 text-gray-500">
      <div class="text-4xl mb-4">🌊</div>
      <p>{{ selectedYear }}年暂无台风记录</p>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue'
import { getTyphoonList, getActiveTyphoons } from '../api/weather.js'
import Icon from './Icon.vue'

export default {
  name: 'TyphoonList',
  components: {
    Icon
  },
  emits: ['typhoon-select'],
  setup(props, { emit }) {
    // 响应式数据
    const loading = ref(false)
    const error = ref('')
    const typhoons = ref([])
    const activeTyphoons = ref([])
    const selectedYear = ref(new Date().getFullYear())

    // 可选年份
    const availableYears = computed(() => {
      const currentYear = new Date().getFullYear()
      const years = []
      for (let i = currentYear; i >= currentYear - 5; i--) {
        years.push(i)
      }
      return years
    })

    // 获取台风数据
    const fetchTyphoons = async () => {
      try {
        loading.value = true
        error.value = ''
        
        // 并行获取台风列表和活跃台风
        const [typhoonList, activeTyphoonList] = await Promise.allSettled([
          getTyphoonList(selectedYear.value),
          getActiveTyphoons()
        ])

        if (typhoonList.status === 'fulfilled') {
          typhoons.value = typhoonList.value
        }
        
        if (activeTyphoonList.status === 'fulfilled') {
          activeTyphoons.value = activeTyphoonList.value
        }

      } catch (err) {
        error.value = err.message || '获取台风数据失败'
        console.error('台风数据获取失败:', err)
      } finally {
        loading.value = false
      }
    }

    // 选择台风
    const selectTyphoon = (typhoon) => {
      emit('typhoon-select', typhoon)
    }

    // 获取台风等级文本
    const getTyphoonLevel = (level) => {
      const levelMap = {
        'TD': '热带低压',
        'TS': '热带风暴',
        'STS': '强热带风暴',
        'TY': '台风',
        'STY': '强台风',
        'SuperTY': '超强台风'
      }
      return levelMap[level] || level || '未知'
    }

    // 获取等级颜色
    const getLevelColor = (level) => {
      const colorMap = {
        'TD': 'text-green-600',
        'TS': 'text-yellow-600',
        'STS': 'text-orange-600',
        'TY': 'text-red-600',
        'STY': 'text-red-700',
        'SuperTY': 'text-purple-600'
      }
      return colorMap[level] || 'text-gray-600'
    }

    // 格式化时间
    const formatTime = (timeStr) => {
      if (!timeStr) return ''
      const date = new Date(timeStr)
      return date.toLocaleDateString('zh-CN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    // 生命周期
    onMounted(() => {
      fetchTyphoons()
    })

    return {
      loading,
      error,
      typhoons,
      activeTyphoons,
      selectedYear,
      availableYears,
      fetchTyphoons,
      selectTyphoon,
      getTyphoonLevel,
      getLevelColor,
      formatTime
    }
  }
}
</script>

<style scoped>
.typhoon-item {
  transition: all 0.3s ease;
}

.typhoon-item:hover {
  transform: translateY(-2px);
}

.typhoon-item:active {
  transform: translateY(0);
}
</style>
