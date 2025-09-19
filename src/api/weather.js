// 和风天气API服务
import axios from 'axios'

// API配置
const API_CONFIG = {
  // 使用API KEY方式进行认证（更适合前端应用）
  // 重要：请在生产环境中使用环境变量或配置文件管理API密钥
  apiKey: import.meta.env.VITE_QWEATHER_API_KEY || 'db9123dd88164046b314ad1273139249', // 优先使用环境变量
  // 使用自定义API主机地址
  baseURL: 'https://p47fbyuxn3.re.qweatherapi.com',
  weatherBaseURL: 'https://p47fbyuxn3.re.qweatherapi.com',
  typhoonBaseURL: 'https://p47fbyuxn3.re.qweatherapi.com'
}

// 创建axios实例
const geoApi = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: 10000
})

const weatherApi = axios.create({
  baseURL: API_CONFIG.weatherBaseURL,
  timeout: 10000
})

const typhoonApi = axios.create({
  baseURL: API_CONFIG.typhoonBaseURL,
  timeout: 10000
})

// 添加请求拦截器
function addAuthInterceptor(apiInstance) {
  apiInstance.interceptors.request.use(
    config => {
      // 使用API KEY方式进行认证
      config.params = config.params || {}
      config.params.key = API_CONFIG.apiKey
      
      return config
    },
    error => {
      return Promise.reject(error)
    }
  )
  
  // 添加响应拦截器
  apiInstance.interceptors.response.use(
    response => {
      if (response.data && response.data.code === '200') {
        return response.data
      } else if (response.data && response.data.code) {
        console.error(`API错误 ${response.data.code}:`, response.data.refer || '未知错误')
        throw new Error(`API错误 ${response.data.code}: ${response.data.refer || '请求失败'}`)
      } else {
        return response.data
      }
    },
    error => {
      console.error('API请求错误:', error)
      if (error.response) {
        const status = error.response.status
        if (status === 401 || status === 403) {
          throw new Error('API密钥无效或权限不足，请检查配置')
        } else if (status === 404) {
          throw new Error('API接口不存在或路径错误')
        } else if (status >= 500) {
          throw new Error('服务器错误，请稍后重试')
        }
      }
      throw error
    }
  )
}

addAuthInterceptor(geoApi)
addAuthInterceptor(weatherApi)
addAuthInterceptor(typhoonApi)

// GeoAPI - 城市搜索
export async function searchCities(query) {
  try {
     const response = await geoApi.get('/geo/v2/city/lookup', {
      params: {
        location: query,
        adm: '', // 可以指定行政区域
        range: 'world' // 搜索范围：world, cn
      }
    })
    return response.location || []
  } catch (error) {
    console.error('城市搜索失败:', error)
    throw new Error('城市搜索失败，请检查网络连接')
  }
}

// GeoAPI - 热门城市
export async function getPopularCities() {
  try {
    const response = await geoApi.get('/v2/city/top', {
      params: {
        range: 'world',
        number: 20
      }
    })
    return response.topCityList || []
  } catch (error) {
    console.error('获取热门城市失败:', error)
    return []
  }
}

// 天气API - 实时天气
export async function getCurrentWeather(locationId) {
  try {
    const response = await weatherApi.get('/v7/weather/now', {
      params: {
        location: locationId
      }
    })
    return response.now
  } catch (error) {
    console.error('获取实时天气失败:', error)
    throw new Error('获取天气数据失败')
  }
}

// 天气API - 7天预报
export async function getWeatherForecast(locationId, days = 7) {
  try {
    const response = await weatherApi.get('/v7/weather/7d', {
      params: {
        location: locationId
      }
    })
    return response.daily?.slice(0, days) || []
  } catch (error) {
    console.error('获取天气预报失败:', error)
    throw new Error('获取天气预报失败')
  }
}

// 天气API - 生活指数
export async function getWeatherIndices(locationId) {
  try {
    const response = await weatherApi.get('/v7/indices/1d', {
      params: {
        location: locationId,
        type: '1,2,3,5,6,8' // 运动,洗车,穿衣,钓鱼,紫外线,舒适度
      }
    })
    return response.daily || []
  } catch (error) {
    console.error('获取生活指数失败:', error)
    return []
  }
}

// 天气API - 空气质量
export async function getAirQuality(locationId) {
  try {
    const response = await weatherApi.get('/v7/air/now', {
      params: {
        location: locationId
      }
    })
    return response.now
  } catch (error) {
    console.error('获取空气质量失败:', error)
    return null
  }
}

// 根据IP获取位置
export async function getLocationByIP() {
  try {
    // 首先尝试使用浏览器地理位置API
    if (navigator.geolocation) {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          async position => {
            const { latitude, longitude } = position.coords
            try {
              const response = await geoApi.get('/v2/city/lookup', {
                params: {
                  location: `${longitude},${latitude}`
                }
              })
              if (response.location && response.location.length > 0) {
                resolve(response.location[0])
              } else {
                reject(new Error('无法获取位置信息'))
              }
            } catch (error) {
              reject(error)
            }
          },
          error => {
            console.warn('地理位置获取失败，使用默认城市:', error)
            // 使用默认城市（北京）
            resolve({
              id: '101010100',
              name: '北京',
              adm1: '北京',
              adm2: '北京',
              country: '中国'
            })
          }
        )
      })
    } else {
      // 浏览器不支持地理位置，返回默认城市
      return {
        id: '101010100',
        name: '北京',
        adm1: '北京',
        adm2: '北京',
        country: '中国'
      }
    }
  } catch (error) {
    console.error('获取位置失败:', error)
    // 返回默认城市
    return {
      id: '101010100',
      name: '北京',
      adm1: '北京',
      adm2: '北京',
      country: '中国'
    }
  }
}

// 台风API - 获取台风列表
export async function getTyphoonList(year = new Date().getFullYear(), basin = 'NP') {
  try {
    const response = await typhoonApi.get('/v7/tropical/storm-list', {
      params: {
        year: year,
        basin: basin // NP: 西北太平洋, NA: 北大西洋, EP: 东北太平洋, etc.
      }
    })
    return response.storm || []
  } catch (error) {
    console.error('获取台风列表失败:', error)
    // 如果台风API不可用，返回模拟数据用于演示
    if (error.message.includes('404') || error.message.includes('403')) {
      console.warn('台风API可能需要付费版本，返回演示数据')
      return getMockTyphoonData(year)
    }
    throw new Error('获取台风列表失败: ' + error.message)
  }
}

// 台风API - 获取台风实时路径
export async function getTyphoonTrack(stormId) {
  try {
    const response = await typhoonApi.get('/v7/tropical/storm-track', {
      params: {
        stormid: stormId
      }
    })
    return response.track || []
  } catch (error) {
    console.error('获取台风路径失败:', error)
    // 如果台风API不可用，返回模拟数据
    if (error.message.includes('404') || error.message.includes('403')) {
      console.warn('台风路径API可能需要付费版本，返回演示数据')
      return getMockTrackData(stormId)
    }
    throw new Error('获取台风路径失败: ' + error.message)
  }
}

// 台风API - 获取台风预报
export async function getTyphoonForecast(stormId) {
  try {
    const response = await typhoonApi.get('/v7/tropical/storm-forecast', {
      params: {
        stormid: stormId
      }
    })
    return response.forecast || []
  } catch (error) {
    console.error('获取台风预报失败:', error)
    // 如果台风API不可用，返回模拟数据
    if (error.message.includes('404') || error.message.includes('403')) {
      console.warn('台风预报API可能需要付费版本，返回演示数据')
      return getMockForecastData(stormId)
    }
    throw new Error('获取台风预报失败: ' + error.message)
  }
}

// 根据城市搜索API - 增强版城市搜索
export async function searchCitiesEnhanced(query, options = {}) {
  try {
    const params = {
      location: query,
      number: options.number || 10,
      lang: options.lang || 'zh'
    }
    
    // 添加可选参数
    if (options.adm) params.adm = options.adm
    if (options.range) params.range = options.range
    
    const response = await geoApi.get('/v2/city/lookup', { params })
    return response.location || []
  } catch (error) {
    console.error('城市搜索失败:', error)
    throw new Error('城市搜索失败，请检查网络连接')
  }
}

// 获取当前活跃台风
export async function getActiveTyphoons() {
  try {
    const currentYear = new Date().getFullYear()
    const typhoonList = await getTyphoonList(currentYear)
    
    // 过滤出当前活跃的台风（状态为active）
    const activeTyphoons = typhoonList.filter(typhoon => 
      typhoon.isActive === '1' || typhoon.isActive === 1
    )
    
    return activeTyphoons
  } catch (error) {
    console.error('获取活跃台风失败:', error)
    return []
  }
}

// 模拟数据函数 - 当台风API不可用时使用
function getMockTyphoonData(year) {
  return [
    {
      id: '2024001',
      name: 'Doksuri',
      nameLocal: '杜苏芮',
      level: 'STY',
      isActive: year === new Date().getFullYear() ? '1' : '0',
      timeStart: `${year}-07-15T06:00:00Z`,
      timeEnd: year === new Date().getFullYear() ? null : `${year}-07-28T18:00:00Z`
    },
    {
      id: '2024002',
      name: 'Khanun',
      nameLocal: '卡努',
      level: 'TY',
      isActive: '0',
      timeStart: `${year}-07-28T12:00:00Z`,
      timeEnd: `${year}-08-10T06:00:00Z`
    },
    {
      id: '2024003',
      name: 'Lan',
      nameLocal: '兰恩',
      level: 'TS',
      isActive: '0',
      timeStart: `${year}-08-12T00:00:00Z`,
      timeEnd: `${year}-08-18T12:00:00Z`
    }
  ]
}

function getMockTrackData(stormId) {
  const baseTime = new Date()
  return [
    {
      time: new Date(baseTime.getTime() - 24 * 60 * 60 * 1000).toISOString(),
      lat: '25.5',
      lon: '125.8',
      windSpeed: '85',
      pressure: '975',
      moveSpeed: '15'
    },
    {
      time: new Date(baseTime.getTime() - 18 * 60 * 60 * 1000).toISOString(),
      lat: '26.2',
      lon: '124.5',
      windSpeed: '95',
      pressure: '965',
      moveSpeed: '18'
    },
    {
      time: new Date(baseTime.getTime() - 12 * 60 * 60 * 1000).toISOString(),
      lat: '27.1',
      lon: '123.2',
      windSpeed: '105',
      pressure: '950',
      moveSpeed: '20'
    },
    {
      time: new Date(baseTime.getTime() - 6 * 60 * 60 * 1000).toISOString(),
      lat: '28.0',
      lon: '122.0',
      windSpeed: '115',
      pressure: '945',
      moveSpeed: '22'
    }
  ]
}

function getMockForecastData(stormId) {
  const baseTime = new Date()
  return [
    {
      fxTime: new Date(baseTime.getTime() + 6 * 60 * 60 * 1000).toISOString(),
      lat: '29.2',
      lon: '120.8',
      windSpeed: '125',
      pressure: '940',
      moveSpeed: '25'
    },
    {
      fxTime: new Date(baseTime.getTime() + 12 * 60 * 60 * 1000).toISOString(),
      lat: '30.5',
      lon: '119.5',
      windSpeed: '130',
      pressure: '935',
      moveSpeed: '28'
    },
    {
      fxTime: new Date(baseTime.getTime() + 24 * 60 * 60 * 1000).toISOString(),
      lat: '32.0',
      lon: '118.0',
      windSpeed: '110',
      pressure: '955',
      moveSpeed: '20'
    }
  ]
}
