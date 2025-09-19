<template>
  <div class="weather-card animate-fade-in">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 主要天气信息 -->
      <div class="lg:col-span-2">
        <div class="location-name flex items-center">
          <Icon name="location" size="20" color="#6b7280" class="mr-2" />
          {{ city.name }}
          <span class="text-sm font-normal text-gray-500 ml-2">
            {{ city.adm2 }} · {{ city.adm1 }}
          </span>
        </div>
        
        <div class="flex items-center justify-between mb-6">
          <div>
            <div class="temperature">{{ weather.temp }}°C</div>
            <div class="weather-desc">
              {{ weather.text }} · 体感温度 {{ weather.feelsLike }}°C
            </div>
          </div>
          
          <div class="text-right">
            <div class="weather-icon">
              <Icon :name="getWeatherIconName(weather.icon)" size="64" color="#3b82f6" />
            </div>
            <div class="text-sm text-gray-600">
              {{ formatTime(weather.obsTime) }}
            </div>
          </div>
        </div>

        <!-- 详细信息网格 -->
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div class="bg-blue-50 rounded-lg p-3 text-center">
            <div class="mb-1 flex justify-center">
              <Icon name="wind" size="24" color="#3b82f6" />
            </div>
            <div class="text-sm text-gray-600">风速</div>
            <div class="font-semibold">{{ weather.windSpeed }} km/h</div>
            <div class="text-xs text-gray-500">{{ weather.windDir }}</div>
          </div>
          
          <div class="bg-green-50 rounded-lg p-3 text-center">
            <div class="mb-1 flex justify-center">
              <Icon name="humidity" size="24" color="#10b981" />
            </div>
            <div class="text-sm text-gray-600">湿度</div>
            <div class="font-semibold">{{ weather.humidity }}%</div>
          </div>
          
          <div class="bg-yellow-50 rounded-lg p-3 text-center">
            <div class="mb-1 flex justify-center">
              <Icon name="search" size="24" color="#f59e0b" />
            </div>
            <div class="text-sm text-gray-600">能见度</div>
            <div class="font-semibold">{{ weather.vis }} km</div>
          </div>
          
          <div class="bg-purple-50 rounded-lg p-3 text-center">
            <div class="mb-1 flex justify-center">
              <Icon name="pressure" size="24" color="#8b5cf6" />
            </div>
            <div class="text-sm text-gray-600">气压</div>
            <div class="font-semibold">{{ weather.pressure }} hPa</div>
          </div>
          
          <div class="bg-orange-50 rounded-lg p-3 text-center">
            <div class="mb-1 flex justify-center">
              <Icon name="cloudy" size="24" color="#f97316" />
            </div>
            <div class="text-sm text-gray-600">云量</div>
            <div class="font-semibold">{{ weather.cloud }}%</div>
          </div>
          
          <div class="bg-indigo-50 rounded-lg p-3 text-center">
            <div class="mb-1 flex justify-center">
              <Icon name="temperature" size="24" color="#6366f1" />
            </div>
            <div class="text-sm text-gray-600">露点温度</div>
            <div class="font-semibold">{{ weather.dew }}°C</div>
          </div>
        </div>
      </div>

      <!-- 空气质量卡片 -->
      <div v-if="airQuality" class="lg:col-span-1">
        <div class="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-4 h-full">
          <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Icon name="air-quality" size="20" color="#1f2937" class="mr-2" />
            空气质量
          </h3>
          
          <div class="text-center mb-4">
            <div class="text-3xl font-bold" :class="getAQIColor(airQuality.aqi)">
              {{ airQuality.aqi }}
            </div>
            <div class="text-sm text-gray-600 mt-1">
              {{ getAQILevel(airQuality.aqi) }}
            </div>
          </div>
          
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span>PM2.5</span>
              <span class="font-medium">{{ airQuality.pm2p5 }} μg/m³</span>
            </div>
            <div class="flex justify-between text-sm">
              <span>PM10</span>
              <span class="font-medium">{{ airQuality.pm10 }} μg/m³</span>
            </div>
            <div class="flex justify-between text-sm">
              <span>SO₂</span>
              <span class="font-medium">{{ airQuality.so2 }} μg/m³</span>
            </div>
            <div class="flex justify-between text-sm">
              <span>NO₂</span>
              <span class="font-medium">{{ airQuality.no2 }} μg/m³</span>
            </div>
            <div class="flex justify-between text-sm">
              <span>O₃</span>
              <span class="font-medium">{{ airQuality.o3 }} μg/m³</span>
            </div>
            <div class="flex justify-between text-sm">
              <span>CO</span>
              <span class="font-medium">{{ airQuality.co }} mg/m³</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Icon from './Icon.vue'

export default {
  name: 'WeatherCard',
  components: {
    Icon
  },
  props: {
    weather: {
      type: Object,
      required: true
    },
    city: {
      type: Object,
      required: true
    },
    airQuality: {
      type: Object,
      default: null
    }
  },
  setup() {
    // 获取天气图标名称
    const getWeatherIconName = (iconCode) => {
      const iconNameMap = {
        '100': 'sunny', // 晴
        '101': 'cloudy', // 多云
        '102': 'cloudy', // 少云
        '103': 'cloudy', // 晴间多云
        '104': 'cloudy', // 阴
        '300': 'rainy', // 阵雨
        '301': 'rainy', // 强阵雨
        '302': 'rainy', // 雷阵雨
        '303': 'rainy', // 强雷阵雨
        '304': 'rainy', // 雷阵雨伴有冰雹
        '305': 'rainy', // 小雨
        '306': 'rainy', // 中雨
        '307': 'rainy', // 大雨
        '308': 'rainy', // 极端降雨
        '309': 'rainy', // 毛毛雨/细雨
        '310': 'rainy', // 暴雨
        '399': 'rainy', // 雨
        '400': 'rainy', // 小雪
        '401': 'rainy', // 中雪
        '402': 'rainy', // 大雪
        '403': 'rainy', // 暴雪
        '404': 'rainy', // 雨夹雪
        '499': 'rainy', // 雪
        '500': 'cloudy', // 薄雾
        '501': 'cloudy', // 雾
        '502': 'cloudy', // 霾
        '503': 'wind', // 扬沙
        '504': 'wind', // 浮尘
        '507': 'typhoon', // 沙尘暴
        '508': 'typhoon', // 强沙尘暴
        '999': 'warning'  // 未知
      }
      
      return iconNameMap[iconCode] || 'sunny'
    }

    // 获取天气图标（保留原有函数用于兼容）
    const getWeatherIcon = (iconCode) => {
      const iconMap = {
        '100': '☀️', // 晴
        '101': '🌤️', // 多云
        '102': '⛅', // 少云
        '103': '☁️', // 晴间多云
        '104': '☁️', // 阴
        '200': '🌬️', // 有风
        '201': '💨', // 平静
        '202': '🌪️', // 微风
        '203': '🌪️', // 和风
        '204': '🌪️', // 清风
        '205': '🌪️', // 强风/劲风
        '206': '🌪️', // 疾风
        '207': '🌪️', // 大风
        '208': '🌪️', // 烈风
        '209': '🌪️', // 风暴
        '210': '🌪️', // 狂爆风
        '211': '🌪️', // 飓风
        '212': '🌪️', // 龙卷风
        '213': '🌪️', // 热带风暴
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
        '314': '🌦️', // 小到中雨
        '315': '🌧️', // 中到大雨
        '316': '🌧️', // 大到暴雨
        '317': '🌧️', // 暴雨到大暴雨
        '318': '🌧️', // 大暴雨到特大暴雨
        '399': '🌧️', // 雨
        '400': '🌨️', // 小雪
        '401': '❄️', // 中雪
        '402': '❄️', // 大雪
        '403': '❄️', // 暴雪
        '404': '🌨️', // 雨夹雪
        '405': '🌨️', // 雨雪天气
        '406': '🌨️', // 阵雨夹雪
        '407': '🌨️', // 阵雪
        '408': '❄️', // 小到中雪
        '409': '❄️', // 中到大雪
        '410': '❄️', // 大到暴雪
        '499': '❄️', // 雪
        '500': '🌫️', // 薄雾
        '501': '🌫️', // 雾
        '502': '🌫️', // 霾
        '503': '💨', // 扬沙
        '504': '💨', // 浮尘
        '507': '💨', // 沙尘暴
        '508': '💨', // 强沙尘暴
        '509': '🌫️', // 浓雾
        '510': '🌫️', // 强浓雾
        '511': '🌫️', // 中度霾
        '512': '🌫️', // 重度霾
        '513': '🌫️', // 严重霾
        '514': '🌫️', // 大雾
        '515': '🌫️', // 特强浓雾
        '900': '🌡️', // 热
        '901': '🥶', // 冷
        '999': '❓'  // 未知
      }
      
      return iconMap[iconCode] || '🌤️'
    }

    // 获取空气质量等级颜色
    const getAQIColor = (aqi) => {
      if (aqi <= 50) return 'text-green-600'
      if (aqi <= 100) return 'text-yellow-600'
      if (aqi <= 150) return 'text-orange-600'
      if (aqi <= 200) return 'text-red-600'
      if (aqi <= 300) return 'text-purple-600'
      return 'text-red-800'
    }

    // 获取空气质量等级描述
    const getAQILevel = (aqi) => {
      if (aqi <= 50) return '优'
      if (aqi <= 100) return '良'
      if (aqi <= 150) return '轻度污染'
      if (aqi <= 200) return '中度污染'
      if (aqi <= 300) return '重度污染'
      return '严重污染'
    }

    // 格式化时间
    const formatTime = (timeStr) => {
      const date = new Date(timeStr)
      return date.toLocaleString('zh-CN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    return {
      getWeatherIcon,
      getWeatherIconName,
      getAQIColor,
      getAQILevel,
      formatTime
    }
  }
}
</script>

<style scoped>
.weather-card {
  transition: all 0.3s ease;
}

.weather-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.temperature {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>
