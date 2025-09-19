<template>
  <div class="weather-card animate-slide-up">
    <h2 class="text-xl font-semibold text-gray-800 mb-6 flex items-center">
      <Icon name="calendar" size="24" color="#1f2937" class="mr-2" />
      7天预报
    </h2>
    
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
      <div
        v-for="(day, index) in forecast"
        :key="index"
        class="forecast-item bg-gradient-to-b from-blue-50 to-white rounded-lg p-4 text-center hover:shadow-md transition-all duration-200"
      >
        <!-- 日期 -->
        <div class="text-sm font-medium text-gray-600 mb-2">
          {{ formatDate(day.fxDate, index) }}
        </div>
        
        <!-- 天气图标和描述 -->
        <div class="mb-3">
          <div class="mb-1 flex justify-center">
            <Icon :name="getWeatherIconName(day.iconDay)" size="32" color="#3b82f6" />
          </div>
          <div class="text-xs text-gray-600">{{ day.textDay }}</div>
        </div>
        
        <!-- 温度 -->
        <div class="mb-3">
          <div class="text-lg font-bold text-gray-800">{{ day.tempMax }}°</div>
          <div class="text-sm text-gray-500">{{ day.tempMin }}°</div>
        </div>
        
        <!-- 其他信息 -->
        <div class="space-y-1 text-xs text-gray-600">
          <div class="flex items-center justify-between">
            <span>💨</span>
            <span>{{ day.windSpeedDay }}km/h</span>
          </div>
          <div class="flex items-center justify-between">
            <span>💧</span>
            <span>{{ day.humidity }}%</span>
          </div>
          <div class="flex items-center justify-between">
            <span>🌧️</span>
            <span>{{ day.precip }}mm</span>
          </div>
        </div>
        
        <!-- 紫外线指数 -->
        <div class="mt-2 pt-2 border-t border-gray-100">
          <div class="flex items-center justify-center space-x-1">
            <span class="text-xs">☀️ UV</span>
            <span class="text-xs font-medium" :class="getUVColor(day.uvIndex)">
              {{ day.uvIndex }}
            </span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 移动端滚动提示 -->
    <div class="sm:hidden text-center mt-4">
      <p class="text-xs text-gray-500">👈 左右滑动查看更多</p>
    </div>
  </div>
</template>

<script>
import Icon from './Icon.vue'

export default {
  name: 'ForecastCard',
  components: {
    Icon
  },
  props: {
    forecast: {
      type: Array,
      required: true
    }
  },
  setup() {
    // 获取天气图标名称
    const getWeatherIconName = (iconCode) => {
      const iconNameMap = {
        '100': 'sunny', '101': 'cloudy', '102': 'cloudy', '103': 'cloudy', '104': 'cloudy',
        '300': 'rainy', '301': 'rainy', '302': 'rainy', '303': 'rainy', '304': 'rainy',
        '305': 'rainy', '306': 'rainy', '307': 'rainy', '308': 'rainy', '309': 'rainy',
        '310': 'rainy', '399': 'rainy', '400': 'rainy', '401': 'rainy', '402': 'rainy',
        '403': 'rainy', '404': 'rainy', '499': 'rainy', '500': 'cloudy', '501': 'cloudy',
        '502': 'cloudy', '503': 'wind', '999': 'warning'
      }
      return iconNameMap[iconCode] || 'sunny'
    }

    // 获取天气图标
    const getWeatherIcon = (iconCode) => {
      const iconMap = {
        '100': '☀️', // 晴
        '101': '🌤️', // 多云
        '102': '⛅', // 少云
        '103': '☁️', // 晴间多云
        '104': '☁️', // 阴
        '300': '🌦️', // 阵雨
        '301': '🌧️', // 强阵雨
        '302': '⛈️', // 雷阵雨
        '303': '⛈️', // 强雷阵雨
        '304': '🌨️', // 雷阵雨伴有冰雹
        '305': '🌦️', // 小雨
        '306': '🌧️', // 中雨
        '307': '🌧️', // 大雨
        '308': '🌧️', // 极端降雨
        '309': '🌦️', // 毛毛雨/细雨
        '310': '🌧️', // 暴雨
        '311': '🌧️', // 大暴雨
        '312': '🌧️', // 特大暴雨
        '313': '🌧️', // 冻雨
        '399': '🌧️', // 雨
        '400': '🌨️', // 小雪
        '401': '❄️', // 中雪
        '402': '❄️', // 大雪
        '403': '❄️', // 暴雪
        '404': '🌨️', // 雨夹雪
        '499': '❄️', // 雪
        '500': '🌫️', // 薄雾
        '501': '🌫️', // 雾
        '502': '🌫️', // 霾
        '503': '💨', // 扬沙
        '999': '❓'  // 未知
      }
      
      return iconMap[iconCode] || '🌤️'
    }

    // 格式化日期
    const formatDate = (dateStr, index) => {
      const date = new Date(dateStr)
      const today = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(today.getDate() + 1)
      
      if (index === 0) {
        return '今天'
      } else if (index === 1) {
        return '明天'
      } else {
        return date.toLocaleDateString('zh-CN', {
          month: 'short',
          day: 'numeric'
        })
      }
    }

    // 获取紫外线指数颜色
    const getUVColor = (uvIndex) => {
      const uv = parseInt(uvIndex)
      if (uv <= 2) return 'text-green-600'
      if (uv <= 5) return 'text-yellow-600'
      if (uv <= 7) return 'text-orange-600'
      if (uv <= 10) return 'text-red-600'
      return 'text-purple-600'
    }

    return {
      getWeatherIcon,
      getWeatherIconName,
      formatDate,
      getUVColor
    }
  }
}
</script>

<style scoped>
.forecast-item {
  min-width: 140px;
}

@media (max-width: 640px) {
  .grid {
    grid-template-columns: repeat(7, minmax(120px, 1fr));
    overflow-x: auto;
    scrollbar-width: thin;
    scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
  }
  
  .grid::-webkit-scrollbar {
    height: 4px;
  }
  
  .grid::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .grid::-webkit-scrollbar-thumb {
    background-color: rgba(156, 163, 175, 0.5);
    border-radius: 2px;
  }
}

.forecast-item:hover {
  transform: translateY(-2px);
}
</style>
