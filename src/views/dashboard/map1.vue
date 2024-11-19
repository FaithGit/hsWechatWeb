<template>
  <div id="mapContainerTD" class="map" />
</template>

<script>
import {
  listVehicle
} from '@/api/table'

export default {
  // props: {
  //   listData4: {
  //     type: Array,
  //     required: true
  //   }
  // },
  data() {
    return {
      mapTD: null
    }
  },

  mounted() {
    var T = window.T // 这个一定需要定义，可以直接在mounted里面定义
    this.mapTD = null
    const mapTD = new T.Map('mapContainerTD') // div的id
    console.log(mapTD)
    // 传参中心点经纬度，以及放大程度
    mapTD.centerAndZoom(new T.LngLat(120.55899, 30.546041), 9)
    this.mapTD = mapTD
    this.listVehicle()
  },
  methods: {
    listVehicle() {
      var PI = 3.1415926535897932384626
      var a = 6378245.0
      var ee = 0.00669342162296594323

      const transformlat = function(lng, lat) {
        var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(
          lng))
        ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0
        ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0
        ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0
        return ret
      }

      const transformlng = function(lng, lat) {
        var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng))
        ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0
        ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0
        ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0
        return ret
      }

      /**
         * 判断是否在国内，不在国内则不做偏移
         * @param lng
         * @param lat
         * @returns {boolean}
         */
      const out_of_china = function(lng, lat) {
        return (lng < 72.004 || lng > 137.8347) || ((lat < 0.8293 || lat > 55.8271) || false)
      }

      /**
         * WGS84转GCj02
         * @param lng
         * @param lat
         * @returns {*[]}
         */
      // const wgs84togcj02 = function(lng, lat) {
      //   if (out_of_china(lng, lat)) {
      //     return [lng, lat]
      //   } else {
      //     var dlat = transformlat(lng - 105.0, lat - 35.0)
      //     var dlng = transformlng(lng - 105.0, lat - 35.0)
      //     var radlat = lat / 180.0 * PI
      //     var magic = Math.sin(radlat)
      //     magic = 1 - ee * magic * magic
      //     var sqrtmagic = Math.sqrt(magic)
      //     dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI)
      //     dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI)
      //     var mglat = lat + dlat
      //     var mglng = lng + dlng
      //     return [mglng, mglat]
      //   }
      // }

      /**
         * GCJ02 转换为 WGS84
         * @param lng
         * @param lat
         * @returns {*[]}
         */
      const gcj02towgs84 = function(lng, lat) {
        if (out_of_china(lng, lat)) {
          return [lng, lat]
        } else {
          var dlat = transformlat(lng - 105.0, lat - 35.0)
          var dlng = transformlng(lng - 105.0, lat - 35.0)
          var radlat = lat / 180.0 * PI
          var magic = Math.sin(radlat)
          magic = 1 - ee * magic * magic
          var sqrtmagic = Math.sqrt(magic)
          dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI)
          dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI)
          const mglat = Number(lat) + dlat
          const mglng = Number(lng) + dlng

          // console.log([lng * 2 - mglng, lat * 2 - mglat])
          return [lng * 2 - mglng, lat * 2 - mglat]
        }
      }

      /**
         * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换
         * 即 百度 转 谷歌、高德
         * @param bd_lon
         * @param bd_lat
         * @returns {*[]}
         */
      // const bd09togcj02 = function(bd_lon, bd_lat) {
      //   var x_pi = 3.14159265358979324 * 3000.0 / 180.0
      //   var x = bd_lon - 0.0065
      //   var y = bd_lat - 0.006
      //   var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi)
      //   var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi)
      //   var gg_lng = z * Math.cos(theta)
      //   var gg_lat = z * Math.sin(theta)
      //   return [gg_lng, gg_lat]
      // }

      /**
         * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
         * 即谷歌、高德 转 百度
         * @param lng
         * @param lat
         * @returns {*[]}
         */
      // const gcj02tobd09 = function(lng, lat) {
      //   var x_PI = 3.14159265358979324 * 3000.0 / 180.0
      //   var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI)
      //   var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI)
      //   var bd_lng = z * Math.cos(theta) + 0.0065
      //   var bd_lat = z * Math.sin(theta) + 0.006
      //   return [bd_lng, bd_lat]
      // }

      listVehicle({
        departmentId: 1,
        pointId: ''
      }).then(res => {
        console.log('listVehicle', res.retData)
        var T = window.T
        const icon = new T.Icon({ // 创建图片对象
          iconUrl: 'http://47.96.147.99:9000/haisheng/static/img/car11.png',
          iconSize: new T.Point(30 * 0.6, 50 * 0.6),
          iconAnchor: new T.Point(30 * 0.6 / 2, 50 * 0.6)
        })
        res.retData.forEach(e => {
            console.log(gcj02towgs84(e.lng, e.lat))
            var label = new T.Label({
              text: e.licensePlate, // 文本标注的内容
              position: new T.LngLat(gcj02towgs84(e.lng, e.lat)[0], gcj02towgs84(e.lng, e.lat)[1]), // 文本标注的地理位置
              offset: new T.Point(-50, 20) // 文本标注的位置偏移值
            })

            var marker = new T.Marker(new T.LngLat(gcj02towgs84(e.lng, e.lat)[0], gcj02towgs84(e.lng, e.lat)[1]), {
              icon: icon
            })
            this.mapTD.addOverLay(label)
            this.mapTD.addOverLay(marker)
        })
      })
    }
  }
}

</script>

<style lang="scss" scoped>
  .map {
    width: 31vw;
    margin: 0 auto;
    height: 19.9vw;
    position: relative;
    top: 3vw;
    z-index: 99;
  }

</style>

<style>
  .tdt-label {
    border-color: #d05050;
    border-radius: 10px;

  }

</style>
