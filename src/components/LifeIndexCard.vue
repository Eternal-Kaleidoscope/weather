<template>
  <div class="weather-card animate-slide-up">
    <h2 class="text-xl font-semibold text-gray-800 mb-6 flex items-center">
      🏃‍♂️ 生活指数
    </h2>
    
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="index in indices"
        :key="index.type"
        class="life-index-item bg-gradient-to-br from-white to-gray-50 rounded-lg p-4 border border-gray-100 hover:shadow-md transition-all duration-200"
      >
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center space-x-2">
            <span class="text-2xl">{{ getLifeIndexIcon(index.type) }}</span>
            <div>
              <h3 class="font-medium text-gray-800">{{ getLifeIndexName(index.type) }}</h3>
              <div class="text-sm" :class="getLifeIndexColor(index.level)">
                {{ getLifeIndexLevelText(index.level) }}
              </div>
            </div>
          </div>
          <div class="text-right">
            <div class="text-lg font-bold" :class="getLifeIndexColor(index.level)">
              {{ index.level }}
            </div>
          </div>
        </div>
        
        <p class="text-sm text-gray-600 leading-relaxed">
          {{ index.text }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LifeIndexCard',
  props: {
    indices: {
      type: Array,
      required: true
    }
  },
  setup() {
    // 获取生活指数图标
    const getLifeIndexIcon = (type) => {
      const iconMap = {
        '1': '🏃‍♂️', // 运动指数
        '2': '🚗', // 洗车指数
        '3': '👕', // 穿衣指数
        '4': '❄️', // 感冒指数
        '5': '🎣', // 钓鱼指数
        '6': '☀️', // 紫外线指数
        '7': '🚗', // 旅游指数
        '8': '😌', // 舒适度指数
        '9': '💧', // 洗车指数
        '10': '🌬️', // 空气污染扩散条件指数
        '11': '☂️', // 雨伞指数
        '12': '💄', // 化妆指数
        '13': '🌞', // 晾晒指数
        '14': '🌡️', // 中暑指数
        '15': '🎿', // 滑雪指数
        '16': '🔥'  // 火险指数
      }
      
      return iconMap[type] || '📊'
    }

    // 获取生活指数名称
    const getLifeIndexName = (type) => {
      const nameMap = {
        '1': '运动指数',
        '2': '洗车指数',
        '3': '穿衣指数',
        '4': '感冒指数',
        '5': '钓鱼指数',
        '6': '紫外线指数',
        '7': '旅游指数',
        '8': '舒适度指数',
        '9': '洗车指数',
        '10': '空气扩散',
        '11': '雨伞指数',
        '12': '化妆指数',
        '13': '晾晒指数',
        '14': '中暑指数',
        '15': '滑雪指数',
        '16': '火险指数'
      }
      
      return nameMap[type] || '生活指数'
    }

    // 获取指数等级颜色
    const getLifeIndexColor = (level) => {
      const levelNum = parseInt(level)
      if (levelNum <= 1) return 'text-green-600'
      if (levelNum === 2) return 'text-yellow-600'
      if (levelNum === 3) return 'text-orange-600'
      if (levelNum === 4) return 'text-red-600'
      return 'text-purple-600'
    }

    // 获取指数等级文本
    const getLifeIndexLevelText = (level) => {
      const levelNum = parseInt(level)
      const levelMap = {
        1: '非常适宜',
        2: '适宜',
        3: '一般',
        4: '不适宜',
        5: '非常不适宜'
      }
      
      return levelMap[levelNum] || `等级${level}`
    }

    return {
      getLifeIndexIcon,
      getLifeIndexName,
      getLifeIndexColor,
      getLifeIndexLevelText
    }
  }
}
</script>

<style scoped>
.life-index-item {
  transition: all 0.3s ease;
}

.life-index-item:hover {
  transform: translateY(-2px);
  border-color: rgb(59, 130, 246);
}

@media (max-width: 640px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
