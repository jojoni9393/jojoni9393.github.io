<template>
  <div>
    <div id="container"></div>
    <div>{{ info }}</div>
    <div>{{ info2 }}</div>
    <button @click="get_ip">按钮</button>
    <button @click="getCityInfo">按钮2</button>
  </div>
</template>

<script>
import AMap from '@/utils/AMap'

export default {
  name: 'home',
  data() {
    return {
      map: null,
      resMap: null,
      marker: null,
      lng: 120.463897,
      lat: 27.85338171,
      info: '1',
      info2: '2'
    }
  },
  created() {},
  mounted() {
    this.initAMap()
  },
  methods: {
    // 构建矢量圆形
    addCircle() {
      return new this.resMap.Circle({
        center: new this.resMap.LngLat(`${this.lng}`, `${this.lat}`), // 圆心位置
        radius: 500, //半径，米
        strokeColor: '#F33', //线颜色
        strokeOpacity: 1, //线透明度
        strokeWeight: 3, //线粗细度
        fillColor: '#ee2200', //填充颜色
        fillOpacity: 0.35 //填充透明度
      })
    },
    //自定义icon
    addIcon() {
      return new this.resMap.Icon({
        // 图标尺寸
        size: new this.resMap.Size(40, 40),
        // 图标的取图地址
        image: require('@/assets/auto.png'),
        // 图标所用图片大小
        imageSize: new this.resMap.Size(40, 40)
        // 图标取图偏移量
        // imageOffset: new this.resMap.Pixel(-13, -60)
      })
    },
    addMarker() {
      this.marker = new this.resMap.Marker({
        //官方icon自定义icon二选一
        // 官方icon
        icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
        //自定义icon
        // icon: this.addIcon(),
        position: [this.lng, this.lat],
        offset: new this.resMap.Pixel(-13, -30)
      })
      this.circle = this.addCircle()
      this.map.add([this.marker, this.circle])
      this.map.setFitView()
    },
    async initAMap() {
      try {
        this.resMap = await AMap()
        this.map = new this.resMap.Map('container', {
          resizeEnable: true, //是否监控地图容器尺寸变化
          zooms: [3, 19], //设置地图级别范围
          zoom: 14, //初始化地图层级
          zoomEnable: true, // 是否缩放
          scrollWheel: true, // 是否支持滚轮缩放
          dragEnable: true, // 是否支持鼠标拖拽平移
          jogEnable: true, // 是否支持缓动效果
          buildingAnimation: true, // 模块消失是否有动画效果
          center: [this.lng, this.lat] //初始化地图中心点
        })
        this.addMarker()
      } catch (err) {
        console.error(err)
      }
    },

    //获取地址
    async get_ip() {
      console.log(88)
      let res = await this.axios({
        url: 'https://restapi.amap.com/v3/ip?parameters',
        params: {
          key: '1b2d9a3af752f0d41ff596557d8ce55e'
        }
      })
      console.log(res)
    },
    // 获取当前位置信息
    getCityInfo() {
      this.map.plugin('AMap.Geolocation', () => {
        var geolocation = new this.resMap.Geolocation({
          // 是否使用高精度定位，默认：true
          enableHighAccuracy: true,
          // 设置定位超时时间，默认：无穷大
          timeout: 10000,
          // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
          buttonOffset: new this.resMap.Pixel(10, 20),
          //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          zoomToAccuracy: true,
          //  定位按钮的排放位置,  RB表示右下
          buttonPosition: 'RB'
        })

        geolocation.getCurrentPosition()
        this.resMap.event.addListener(geolocation, 'complete', this.onComplete)
        this.resMap.event.addListener(geolocation, 'error', this.onError)
      })
    },
    // 获取定位结果
    onComplete(res) {
      this.info = JSON.stringify(res)
    },

    // 定位出错
    onError(err) {
      this.info = JSON.stringify(err)
    }
  }
}
</script>

<style>
#container {
  height: 500px;
  width: 500px;
  margin: 100px auto;
}
</style>
