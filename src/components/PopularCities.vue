<template>
  <div class="weather-card animate-fade-in">
    <h2 class="text-xl font-semibold text-gray-800 mb-6 flex items-center">
      🌍 热门城市
    </h2>
    
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      <button
        v-for="city in cities"
        :key="city.id"
        @click="selectCity(city)"
        class="city-button bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-lg p-4 text-left transition-all duration-200 border border-gray-200 hover:border-blue-300 hover:shadow-md group"
      >
        <div class="flex items-center justify-between mb-2">
          <h3 class="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
            {{ city.name }}
          </h3>
          <span class="text-lg">{{ getCityIcon(city.country) }}</span>
        </div>
        
        <div class="text-xs text-gray-600">
          <div>{{ city.adm1 }}</div>
          <div class="mt-1 text-gray-500">{{ city.country }}</div>
        </div>
      </button>
    </div>
    
    <div class="mt-6 text-center">
      <p class="text-sm text-gray-600">
        点击任意城市查看天气信息
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PopularCities',
  props: {
    cities: {
      type: Array,
      required: true
    }
  },
  emits: ['city-select'],
  setup(props, { emit }) {
    // 选择城市
    const selectCity = (city) => {
      emit('city-select', city)
    }

    // 获取城市图标
    const getCityIcon = (country) => {
      const countryIconMap = {
        '中国': '🇨🇳',
        '美国': '🇺🇸',
        '英国': '🇬🇧',
        '法国': '🇫🇷',
        '德国': '🇩🇪',
        '日本': '🇯🇵',
        '韩国': '🇰🇷',
        '加拿大': '🇨🇦',
        '澳大利亚': '🇦🇺',
        '意大利': '🇮🇹',
        '西班牙': '🇪🇸',
        '荷兰': '🇳🇱',
        '瑞士': '🇨🇭',
        '俄罗斯': '🇷🇺',
        '印度': '🇮🇳',
        '巴西': '🇧🇷',
        '新加坡': '🇸🇬',
        '泰国': '🇹🇭',
        '马来西亚': '🇲🇾',
        '印度尼西亚': '🇮🇩',
        '菲律宾': '🇵🇭',
        '越南': '🇻🇳',
        '土耳其': '🇹🇷',
        '南非': '🇿🇦',
        '埃及': '🇪🇬',
        '阿联酋': '🇦🇪',
        '沙特阿拉伯': '🇸🇦',
        '以色列': '🇮🇱',
        '墨西哥': '🇲🇽',
        '阿根廷': '🇦🇷',
        '智利': '🇨🇱',
        '新西兰': '🇳🇿'
      }
      
      return countryIconMap[country] || '🌍'
    }

    return {
      selectCity,
      getCityIcon
    }
  }
}
</script>

<style scoped>
.city-button {
  min-height: 80px;
  transition: all 0.3s ease;
}

.city-button:hover {
  transform: translateY(-2px);
}

.city-button:active {
  transform: translateY(0);
}

@media (max-width: 640px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
  
  .city-button {
    min-height: 70px;
    padding: 0.75rem;
  }
}

@media (max-width: 480px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
