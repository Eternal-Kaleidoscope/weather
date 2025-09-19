<template>
  <div v-if="selectedTyphoon" class="weather-card animate-slide-up">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold text-gray-800 flex items-center">
        <Icon name="typhoon" size="24" color="#1f2937" class="mr-2" />
        {{ selectedTyphoon.name }} 路径追踪
      </h2>
      
      <button
        @click="closeTyphoon"
        class="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <Icon name="close" size="20" color="currentColor" />
      </button>
    </div>

    <!-- 台风基本信息 -->
    <div class="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h3 class="font-semibold text-gray-800 mb-2">基本信息</h3>
          <div class="space-y-1 text-sm">
            <div><span class="text-gray-600">英文名:</span> {{ selectedTyphoon.name }}</div>
            <div><span class="text-gray-600">中文名:</span> {{ selectedTyphoon.nameLocal }}</div>
            <div><span class="text-gray-600">编号:</span> {{ selectedTyphoon.id }}</div>
            <div>
              <span class="text-gray-600">状态:</span>
              <span :class="selectedTyphoon.isActive === '1' ? 'text-red-600 font-medium' : 'text-gray-600'">
                {{ selectedTyphoon.isActive === '1' ? '活跃中' : '已结束' }}
              </span>
            </div>
          </div>
        </div>
        
        <div>
          <h3 class="font-semibold text-gray-800 mb-2">时间信息</h3>
          <div class="space-y-1 text-sm">
            <div><span class="text-gray-600">生成:</span> {{ formatTime(selectedTyphoon.timeStart) }}</div>
            <div><span class="text-gray-600">结束:</span> {{ formatTime(selectedTyphoon.timeEnd) || '进行中' }}</div>
          </div>
        </div>
        
        <div>
          <h3 class="font-semibold text-gray-800 mb-2">强度信息</h3>
          <div class="space-y-1 text-sm">
            <div>
              <span class="text-gray-600">等级:</span>
              <span :class="getLevelColor(selectedTyphoon.level)" class="font-medium">
                {{ getTyphoonLevel(selectedTyphoon.level) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 选项卡 -->
    <div class="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        @click="activeTab = tab.key"
        :class="[
          'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors',
          activeTab === tab.key 
            ? 'bg-white text-primary-600 shadow-sm' 
            : 'text-gray-600 hover:text-gray-800'
        ]"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- 台风路径 -->
    <div v-if="activeTab === 'track'" class="space-y-4">
      <!-- 加载状态 -->
      <div v-if="trackLoading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        <p class="mt-2 text-gray-600">正在获取路径数据...</p>
      </div>

      <!-- 路径数据 -->
      <div v-else-if="trackData.length > 0" class="space-y-3">
        <div class="text-sm text-gray-600 mb-4">
          路径点数: {{ trackData.length }} 个
        </div>
        
        <div class="max-h-96 overflow-y-auto space-y-2">
          <div
            v-for="(point, index) in trackData"
            :key="index"
            class="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
          >
            <div class="flex items-center justify-between mb-2">
              <div class="font-medium text-gray-800">
                {{ formatTime(point.time) }}
              </div>
              <div class="text-sm text-gray-600">
                第 {{ index + 1 }} 个点
              </div>
            </div>
            
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>
                <span class="text-gray-600">位置:</span>
                <div class="font-medium">{{ point.lat }}°N, {{ point.lon }}°E</div>
              </div>
              <div>
                <span class="text-gray-600">风速:</span>
                <div class="font-medium">{{ point.windSpeed || 'N/A' }} km/h</div>
              </div>
              <div>
                <span class="text-gray-600">气压:</span>
                <div class="font-medium">{{ point.pressure || 'N/A' }} hPa</div>
              </div>
              <div>
                <span class="text-gray-600">移速:</span>
                <div class="font-medium">{{ point.moveSpeed || 'N/A' }} km/h</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 无路径数据 -->
      <div v-else class="text-center py-8 text-gray-500">
        <div class="text-4xl mb-4">📍</div>
        <p>暂无路径数据</p>
      </div>
    </div>

    <!-- 台风预报 -->
    <div v-if="activeTab === 'forecast'" class="space-y-4">
      <!-- 加载状态 -->
      <div v-if="forecastLoading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        <p class="mt-2 text-gray-600">正在获取预报数据...</p>
      </div>

      <!-- 预报数据 -->
      <div v-else-if="forecastData.length > 0" class="space-y-3">
        <div class="text-sm text-gray-600 mb-4">
          预报点数: {{ forecastData.length }} 个
        </div>
        
        <div class="space-y-3">
          <div
            v-for="(point, index) in forecastData"
            :key="index"
            class="bg-blue-50 rounded-lg p-4 border border-blue-200"
          >
            <div class="flex items-center justify-between mb-3">
              <div class="font-medium text-blue-800">
                {{ formatTime(point.fxTime) }}
              </div>
              <div class="text-sm text-blue-600">
                {{ getTimeFromNow(point.fxTime) }}
              </div>
            </div>
            
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>
                <span class="text-blue-600">预测位置:</span>
                <div class="font-medium">{{ point.lat }}°N, {{ point.lon }}°E</div>
              </div>
              <div>
                <span class="text-blue-600">预测风速:</span>
                <div class="font-medium">{{ point.windSpeed || 'N/A' }} km/h</div>
              </div>
              <div>
                <span class="text-blue-600">预测气压:</span>
                <div class="font-medium">{{ point.pressure || 'N/A' }} hPa</div>
              </div>
              <div>
                <span class="text-blue-600">预测移速:</span>
                <div class="font-medium">{{ point.moveSpeed || 'N/A' }} km/h</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 无预报数据 -->
      <div v-else class="text-center py-8 text-gray-500">
        <div class="text-4xl mb-4">🔮</div>
        <p>暂无预报数据</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, watch, computed } from 'vue'
import { getTyphoonTrack, getTyphoonForecast } from '../api/weather.js'
import Icon from './Icon.vue'

export default {
  name: 'TyphoonTracker',
  components: {
    Icon
  },
  props: {
    selectedTyphoon: {
      type: Object,
      default: null
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    // 响应式数据
    const activeTab = ref('track')
    const trackLoading = ref(false)
    const forecastLoading = ref(false)
    const trackData = ref([])
    const forecastData = ref([])

    const tabs = [
      { key: 'track', label: '历史路径' },
      { key: 'forecast', label: '预报路径' }
    ]

    // 获取台风路径数据
    const fetchTrackData = async () => {
      if (!props.selectedTyphoon) return
      
      try {
        trackLoading.value = true
        const data = await getTyphoonTrack(props.selectedTyphoon.id)
        trackData.value = data
      } catch (error) {
        console.error('获取台风路径失败:', error)
        trackData.value = []
      } finally {
        trackLoading.value = false
      }
    }

    // 获取台风预报数据
    const fetchForecastData = async () => {
      if (!props.selectedTyphoon) return
      
      try {
        forecastLoading.value = true
        const data = await getTyphoonForecast(props.selectedTyphoon.id)
        forecastData.value = data
      } catch (error) {
        console.error('获取台风预报失败:', error)
        forecastData.value = []
      } finally {
        forecastLoading.value = false
      }
    }

    // 关闭台风详情
    const closeTyphoon = () => {
      emit('close')
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
      return date.toLocaleString('zh-CN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    // 获取相对时间
    const getTimeFromNow = (timeStr) => {
      if (!timeStr) return ''
      const now = new Date()
      const targetTime = new Date(timeStr)
      const diffHours = Math.round((targetTime - now) / (1000 * 60 * 60))
      
      if (diffHours > 0) {
        return `${diffHours}小时后`
      } else if (diffHours < 0) {
        return `${Math.abs(diffHours)}小时前`
      } else {
        return '现在'
      }
    }

    // 监听选中的台风变化
    watch(
      () => props.selectedTyphoon,
      (newTyphoon) => {
        if (newTyphoon) {
          activeTab.value = 'track'
          fetchTrackData()
          fetchForecastData()
        }
      },
      { immediate: true }
    )

    // 监听选项卡变化
    watch(activeTab, (newTab) => {
      if (newTab === 'track' && trackData.value.length === 0) {
        fetchTrackData()
      } else if (newTab === 'forecast' && forecastData.value.length === 0) {
        fetchForecastData()
      }
    })

    return {
      activeTab,
      tabs,
      trackLoading,
      forecastLoading,
      trackData,
      forecastData,
      closeTyphoon,
      getTyphoonLevel,
      getLevelColor,
      formatTime,
      getTimeFromNow
    }
  }
}
</script>

<style scoped>
/* 自定义滚动条 */
.max-h-96::-webkit-scrollbar {
  width: 6px;
}

.max-h-96::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.max-h-96::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.max-h-96::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
