<template>
  <div id="app" class="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600">
    <!-- 头部 -->
    <header class="bg-white bg-opacity-10 backdrop-blur-sm">
      <div class="container mx-auto px-4 py-4">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 class="text-2xl font-bold text-white mb-4 sm:mb-0 flex items-center">
            <Icon name="typhoon" size="32" color="white" class="mr-3" />
            Kaleidoscope's Weather
          </h1>
          
          <!-- 搜索框 -->
          <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div class="relative">
              <input
                v-model="searchQuery"
                @keyup.enter="handleSearch"
                @input="handleSearchInput"
                type="text"
                placeholder="搜索城市..."
                class="search-input w-full sm:w-64 text-gray-700"
              />
              
              <!-- 搜索建议下拉框 -->
              <div
                v-if="searchSuggestions.length > 0"
                class="absolute top-full left-0 right-0 bg-white rounded-lg shadow-lg mt-1 z-50 max-h-60 overflow-y-auto"
              >
                <div
                  v-for="city in searchSuggestions"
                  :key="city.id"
                  @click="selectCity(city)"
                  class="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <div class="font-medium text-gray-800">{{ city.name }}</div>
                  <div class="text-sm text-gray-600">
                    {{ city.adm2 }} · {{ city.adm1 }} · {{ city.country }}
                  </div>
                </div>
              </div>
            </div>
            
            <button
              @click="handleSearch"
              :disabled="loading || !searchQuery.trim()"
              class="search-button disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ loading ? '搜索中...' : '搜索' }}
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- 导航选项卡 -->
    <nav class="bg-white bg-opacity-10 backdrop-blur-sm border-b border-white border-opacity-20">
      <div class="container mx-auto px-4">
        <div class="flex space-x-1">
          <button
            @click="activeView = 'weather'"
            :class="[
              'px-6 py-3 font-medium text-sm transition-colors border-b-2',
              activeView === 'weather' 
                ? 'text-white border-white bg-white bg-opacity-10' 
                : 'text-white text-opacity-70 border-transparent hover:text-white hover:bg-white hover:bg-opacity-5'
            ]"
            >
            <Icon name="sunny" size="20" color="currentColor" class="mr-2" />
            天气预报
          </button>
          <button
            @click="activeView = 'typhoon'"
            :class="[
              'px-6 py-3 font-medium text-sm transition-colors border-b-2',
              activeView === 'typhoon' 
                ? 'text-white border-white bg-white bg-opacity-10' 
                : 'text-white text-opacity-70 border-transparent hover:text-white hover:bg-white hover:bg-opacity-5'
            ]"
            >
            <Icon name="typhoon" size="20" color="currentColor" class="mr-2" />
            台风监测
          </button>
        </div>
      </div>
    </nav>

    <!-- 主内容区域 -->
    <main class="container mx-auto px-4 py-8">
      <!-- API状态说明 -->
      <ApiStatus />

      <!-- 加载状态 -->
      <div v-if="loading && !currentWeather" class="text-center text-white">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        <p class="mt-2">正在获取天气数据...</p>
      </div>

      <!-- 错误提示 -->
      <div v-if="error" class="bg-red-500 bg-opacity-20 border border-red-400 text-white px-4 py-3 rounded-lg mb-6">
        ⚠️ {{ error }}
      </div>

      <!-- 天气信息视图 -->
      <div v-if="activeView === 'weather'">
        <!-- 天气信息 -->
        <div v-if="currentWeather && selectedCity" class="space-y-6">
          <!-- 当前天气卡片 -->
          <WeatherCard
            :weather="currentWeather"
            :city="selectedCity"
            :air-quality="airQuality"
          />

          <!-- 7天预报 -->
          <ForecastCard
            v-if="forecast.length > 0"
            :forecast="forecast"
          />

          <!-- 生活指数 -->
          <LifeIndexCard
            v-if="lifeIndices.length > 0"
            :indices="lifeIndices"
          />
        </div>

        <!-- 热门城市 -->
        <PopularCities
          v-if="!currentWeather && popularCities.length > 0"
          :cities="popularCities"
          @city-select="selectCity"
        />
      </div>

      <!-- 台风监测视图 -->
      <div v-if="activeView === 'typhoon'" class="space-y-6">
        <!-- 台风追踪器 -->
        <TyphoonTracker
          v-if="selectedTyphoon"
          :selected-typhoon="selectedTyphoon"
          @close="selectedTyphoon = null"
        />
        
        <!-- 台风列表 -->
        <TyphoonList
          @typhoon-select="handleTyphoonSelect"
        />
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="bg-white bg-opacity-10 backdrop-blur-sm text-white text-center py-4 mt-8">
      <p class="text-sm">
        天气数据由 
        <a href="https://www.qweather.com/" target="_blank" class="underline hover:text-blue-200">
          和风天气
        </a> 
        提供 | 台风数据来源于官方监测
      </p>
      <p class="text-xs text-white text-opacity-70 mt-1">
        Kaleidoscope's Weather - 让世界天气如万花筒般绚烂
      </p>
    </footer>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import WeatherCard from './components/WeatherCard.vue'
import ForecastCard from './components/ForecastCard.vue'
import LifeIndexCard from './components/LifeIndexCard.vue'
import PopularCities from './components/PopularCities.vue'
import TyphoonList from './components/TyphoonList.vue'
import TyphoonTracker from './components/TyphoonTracker.vue'
import ApiStatus from './components/ApiStatus.vue'
import Icon from './components/Icon.vue'
import {
  searchCities,
  getPopularCities,
  getCurrentWeather,
  getWeatherForecast,
  getWeatherIndices,
  getAirQuality,
  getLocationByIP
} from './api/weather.js'

export default {
  name: 'App',
  components: {
    WeatherCard,
    ForecastCard,
    LifeIndexCard,
    PopularCities,
    TyphoonList,
    TyphoonTracker,
    ApiStatus,
    Icon
  },
  setup() {
    // 响应式数据
    const loading = ref(false)
    const error = ref('')
    const searchQuery = ref('')
    const searchSuggestions = ref([])
    
    const selectedCity = ref(null)
    const currentWeather = ref(null)
    const forecast = ref([])
    const lifeIndices = ref([])
    const airQuality = ref(null)
    const popularCities = ref([])
    
    // 台风相关数据
    const selectedTyphoon = ref(null)
    const activeView = ref('weather') // 'weather' 或 'typhoon'

    let searchTimeout = null

    // 搜索输入处理
    const handleSearchInput = () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout)
      }
      
      searchTimeout = setTimeout(async () => {
        if (searchQuery.value.trim().length > 1) {
          try {
            const cities = await searchCities(searchQuery.value.trim())
            searchSuggestions.value = cities.slice(0, 8) // 限制显示8个建议
          } catch (err) {
            console.error('搜索建议获取失败:', err)
            searchSuggestions.value = []
          }
        } else {
          searchSuggestions.value = []
        }
      }, 300)
    }

    // 执行搜索
    const handleSearch = async () => {
      if (!searchQuery.value.trim()) return
      
      try {
        loading.value = true
        error.value = ''
        const cities = await searchCities(searchQuery.value.trim())
        
        if (cities.length > 0) {
          await selectCity(cities[0])
        } else {
          error.value = '未找到相关城市，请尝试其他关键词'
        }
      } catch (err) {
        error.value = err.message || '搜索失败，请稍后重试'
      } finally {
        loading.value = false
        searchSuggestions.value = []
      }
    }

    // 选择城市
    const selectCity = async (city) => {
      try {
        loading.value = true
        error.value = ''
        selectedCity.value = city
        searchQuery.value = city.name
        searchSuggestions.value = []

        // 并行获取各种天气数据
        const [weather, forecastData, indices, air] = await Promise.allSettled([
          getCurrentWeather(city.id),
          getWeatherForecast(city.id),
          getWeatherIndices(city.id),
          getAirQuality(city.id)
        ])

        if (weather.status === 'fulfilled') {
          currentWeather.value = weather.value
        }
        
        if (forecastData.status === 'fulfilled') {
          forecast.value = forecastData.value
        }
        
        if (indices.status === 'fulfilled') {
          lifeIndices.value = indices.value
        }
        
        if (air.status === 'fulfilled') {
          airQuality.value = air.value
        }

      } catch (err) {
        error.value = err.message || '获取天气数据失败'
      } finally {
        loading.value = false
      }
    }

    // 初始化
    const initialize = async () => {
      try {
        loading.value = true
        
        // 并行获取热门城市和用户位置
        const [popularCitiesData, userLocation] = await Promise.allSettled([
          getPopularCities(),
          getLocationByIP()
        ])

        if (popularCitiesData.status === 'fulfilled') {
          popularCities.value = popularCitiesData.value
        }

        if (userLocation.status === 'fulfilled') {
          await selectCity(userLocation.value)
        }

      } catch (err) {
        console.error('初始化失败:', err)
        error.value = '初始化失败，请刷新页面重试'
      } finally {
        loading.value = false
      }
    }

    // 选择台风
    const handleTyphoonSelect = (typhoon) => {
      selectedTyphoon.value = typhoon
    }

    // 生命周期
    onMounted(() => {
      initialize()
    })

    return {
      loading,
      error,
      searchQuery,
      searchSuggestions,
      selectedCity,
      currentWeather,
      forecast,
      lifeIndices,
      airQuality,
      popularCities,
      handleSearchInput,
      handleSearch,
      selectCity,
      selectedTyphoon,
      activeView,
      handleTyphoonSelect
    }
  }
}
</script>

<style scoped>
/* 自定义动画 */
.container {
  max-width: 1200px;
}

@media (max-width: 640px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>
