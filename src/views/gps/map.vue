<template>
  <div class="dashboard-container">
    <div class="topHead">


      部门：
      <el-select v-model="departmentId" placeholder="请选择部门" clearable style="width:150px">
        <el-option v-for="item in bumenArr" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      图例：
      <el-select v-model="modeIndex" placeholder="请选择图例" clearable style="width:130px">
        <el-option label="单车辆" :value="1"></el-option>
        <el-option label="单点位" :value="2"></el-option>
      </el-select>
      <span v-if="modeIndex!=2"> 车牌号：</span>
      <el-select v-if="modeIndex!=2" v-model="licensePlate" placeholder="请选择车牌号" clearable>
        <el-option v-for="item in plateSelList" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <span v-if="modeIndex!=1"> 污染源种类：</span>
      <el-select v-if="modeIndex!=1" v-model="pollutionType" placeholder="请选择" clearable style="width:100px">
        <el-option v-for="item in pollutionTypeArr" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>

      <el-button type="primary" style="margin-left:10px" @click="idMode">搜索</el-button>

    </div>


    <div id="container" style="width:100%;height:100%;" />
    <div style="display:none;">
      <infoWindow ref="infowindows" :pointObj="pointObj" @closeInfo="closeInfo" />
    </div>
    <div style="display:none;">
      <infoWindowPoint ref="infoWindowPoint" :pointObj="pointObj" @closeInfo="closeInfo" />
    </div>

    <div class="tuli" v-if="modeIndex!=2">
      <div class="tuliItem">
        <div class="flag1"></div> 离线
      </div>
      <div class="tuliItem">
        <div class="flag2"></div> 停车
      </div>
      <div class="tuliItem">
        <div class="flag3"></div> 怠行
      </div>
      <div class="tuliItem">
        <div class="flag4"></div> 行驶
      </div>
    </div>
  </div>
</template>

<script>
  import AMapLoader from '@amap/amap-jsapi-loader'
  import infoWindow from './infoWindow.vue'
  import infoWindowPoint from './infoWindowPoint.vue'
  import {
    gpsDepartmentSel,
    listVehicle,
    listLicensePlateSel,
    pointMapList
  } from '@/api/table'



  export default {
    name: 'Map',
    components: {
      infoWindow,
      infoWindowPoint
    },
    data() {
      return {
        map: null,
        pointObj: null,
        markers: [],
        markList: [],
        departmentId: '',
        pollutionType: "",
        licensePlate: "",
        modeIndex: 1,
        bumenArr: [],
        plateSelList: [],
        pollutionTypeArr: [{
          label: "废水",
          value: 1
        }, {
          label: "废气",
          value: 2
        }, {
          label: "vocs",
          value: 3
        }, {
          label: "地表水",
          value: 4
        }, {
          label: "其他",
          value: 5
        }], //种类
      }
    },
    mounted() {
      this.gpsDepartmentSel()
      this.listLicensePlateSel()
      AMapLoader.load({
        'key': '30e1690c958f1abdf298a620474abea2', // 申请好的Web端开发者Key，首次调用 load 时必填
        'version': '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        'animateEnable': false
      }).then((AMap) => {
        this.map = new AMap.Map('container', {
          zoom: 11,
          resizeEnable: true,
          center: [120.55899, 30.546041],
        })

        this.map.on('complete', () => {
          this.idMode()
        })
      })
    },
    methods: {
      idMode() {
        if (this.modeIndex == "") {
          console.log("全部")
          this.pointAll()
        } else if (this.modeIndex == 1) {
          console.log("单车辆")
          this.listVehicle()
        } else if (this.modeIndex == 2) {
          console.log("单点位")
          this.pointMapList()
        }
      },
      closeInfo() {
        this.map.clearInfoWindow()
      },
      gpsDepartmentSel() { //部门list
        gpsDepartmentSel({}).then(res => {
          this.bumenArr = res.retData
          this.bumenArr.shift()
          console.log(this.bumenArr)
        })
      },
      listVehicle() { //单车辆列表
        if (this.map) {
          this.map.clearInfoWindow()
          this.map.remove(this.markers)
        }

        this.markers = []
        var that = this
        AMapLoader.load({
          'key': '30e1690c958f1abdf298a620474abea2', // 申请好的Web端开发者Key，首次调用 load 时必填
          'version': '2.0' // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        }).then(AMap => {

          listVehicle({
            departmentId: this.departmentId,
            pointId: "",
            licensePlate: this.licensePlate
          }).then(res => {
            console.log('res', res)
            this.markList = res.retData

            var infoWindow = new AMap.InfoWindow({
              anchor: 'right',
              closeWhenClickMap: true,
              isCustom: true,
              offset: new AMap.Pixel(35, 0)
            })

            function markerClick(e) {
              // console.log(e)
              // console.log(e.target.getExtData().pointObj)
              that.pointObj = JSON.parse(JSON.stringify(e.target.getExtData().pointObj))

              console.log("that.pointObj", that.pointObj)

              infoWindow.setContent(e.target.content)
              infoWindow.open(that.map, e.target.getPosition())

              that.map.panTo([e.lnglat.lng, e.lnglat.lat])
            }

            for (var j = 0; j < this.markList.length; j++) {

              var markerIcon = new AMap.Icon({
                // size: new AMap.Size(30 * 0.6, 50 * 0.6), // 图标尺寸
                image: this.markList[j].departmentId == 1 ?
                  'http://47.96.147.99:9000/haisheng/static/img/car11.png' :
                  'http://47.96.147.99:9000/haisheng/static/img/car22.png', // Icon的图像
                imageSize: new AMap.Size(30 * 0.6, 50 * 0.6)
              })

              var marker = new AMap.Marker({
                icon: markerIcon,
                position: [this.markList[j].lng, this.markList[j].lat],
                title: this.markList[j].licensePlate,
                anchor: 'center',
                extData: {
                  'pointObj': this.markList[j]
                }
              })
              marker.content = this.$refs.infowindows.$el
              // marker.comId = this.markList[j].comId
              marker.on('click', markerClick)
              marker.setLabel({
                direction: 'bottom',
                offset: new AMap.Pixel(0, 0), //设置文本标注偏移量
                content: `<div class='mapInfo' style=" border-color:${ this.markList[j].driveStatus==1?'#878c92': this.markList[j].driveStatus==2?'#105bc9': this.markList[j].driveStatus==3?'#f1a010':'#40c040'}">${ this.markList[j].licensePlate}</div>`, //设置文本标注内容
              });
              this.markers.push(marker)
            }
            this.map.add(this.markers)
            // that.map.setFitView() // 视口自适应

          })

        })



      },
      pointMapList() { //单点位列表
        if (this.map) {
          this.map.clearInfoWindow()
          this.map.remove(this.markers)
        }

        this.markers = []
        var that = this
        AMapLoader.load({
          'key': '30e1690c958f1abdf298a620474abea2', // 申请好的Web端开发者Key，首次调用 load 时必填
          'version': '2.0' // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        }).then(AMap => {

          pointMapList({
            departmentId: this.departmentId,
            pollutionType: this.pollutionType
          }).then(res => {
            console.log('res', res)
            this.markList = res.retData

            var infoWindow = new AMap.InfoWindow({
              anchor: 'right',
              closeWhenClickMap: true,
              isCustom: true,
              offset: new AMap.Pixel(35, 0)
            })

            function markerClick(e) {
              // console.log(e)
              console.log(e.target.getExtData().pointObj)
              that.pointObj = JSON.parse(JSON.stringify(e.target.getExtData().pointObj))

              console.log("that.pointObj", that.pointObj)

              infoWindow.setContent(e.target.content)
              infoWindow.open(that.map, e.target.getPosition())

              that.map.panTo([e.lnglat.lng, e.lnglat.lat])
            }

            for (var j = 0; j < this.markList.length; j++) {

              var markerIcon = new AMap.Icon({
                // size: new AMap.Size(30 * 0.6, 50 * 0.6), // 图标尺寸
                image: "http://47.96.147.99:9000/haisheng/static/img/comPoint1.png", // Icon的图像
                imageSize: new AMap.Size(24 * 0.6, 30 * 0.6)
              })

              var marker = new AMap.Marker({
                icon: markerIcon,
                position: [this.markList[j].lng, this.markList[j].lat],
                title: this.markList[j].licensePlate,
                anchor: 'center',
                extData: {
                  'pointObj': this.markList[j]
                }
              })
              marker.content = this.$refs.infoWindowPoint.$el
              // marker.comId = this.markList[j].comId
              marker.on('click', markerClick)
              marker.setLabel({
                direction: 'bottom',
                offset: new AMap.Pixel(0, 0), //设置文本标注偏移量
                content: `<div class='mapInfo'>${ this.markList[j].comShortName}</div>`, //设置文本标注内容
              });
              this.markers.push(marker)
            }
            this.map.add(this.markers)
            // that.map.setFitView() // 视口自适应

          })

        })



      },

      pointAll() {
        if (this.map) {
          this.map.clearInfoWindow()
          this.map.remove(this.markers)
        }

        this.markers = []
        var that = this
        AMapLoader.load({
          'key': '30e1690c958f1abdf298a620474abea2', // 申请好的Web端开发者Key，首次调用 load 时必填
          'version': '2.0' // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        }).then(AMap => {

          listVehicle({
            departmentId: this.departmentId,
            pointId: "",
            licensePlate: this.licensePlate
          }).then(res => {
            console.log('res', res)
            this.markList = res.retData

            var infoWindow = new AMap.InfoWindow({
              anchor: 'right',
              closeWhenClickMap: true,
              isCustom: true,
              offset: new AMap.Pixel(35, 0)
            })

            function markerClick(e) {
              // console.log(e)
              // console.log(e.target.getExtData().pointObj)
              that.pointObj = JSON.parse(JSON.stringify(e.target.getExtData().pointObj))

              console.log("that.pointObj", that.pointObj)

              infoWindow.setContent(e.target.content)
              infoWindow.open(that.map, e.target.getPosition())

              that.map.panTo([e.lnglat.lng, e.lnglat.lat])
            }

            for (var j = 0; j < this.markList.length; j++) {

              var markerIcon = new AMap.Icon({
                // size: new AMap.Size(30 * 0.6, 50 * 0.6), // 图标尺寸
                image: this.markList[j].departmentId == 1 ?
                  'http://47.96.147.99:9000/haisheng/static/img/car11.png' :
                  'http://47.96.147.99:9000/haisheng/static/img/car22.png', // Icon的图像
                imageSize: new AMap.Size(30 * 0.6, 50 * 0.6)
              })

              var marker = new AMap.Marker({
                icon: markerIcon,
                position: [this.markList[j].lng, this.markList[j].lat],
                title: this.markList[j].licensePlate,
                anchor: 'center',
                extData: {
                  'pointObj': this.markList[j]
                }
              })
              marker.content = this.$refs.infowindows.$el
              // marker.comId = this.markList[j].comId
              marker.on('click', markerClick)
              marker.setLabel({
                direction: 'bottom',
                offset: new AMap.Pixel(0, 0), //设置文本标注偏移量
                content: `<div class='mapInfo' style=" border-color:${ this.markList[j].driveStatus==1?'#878c92': this.markList[j].driveStatus==2?'#105bc9': this.markList[j].driveStatus==3?'#f1a010':'#40c040'}">${ this.markList[j].licensePlate}</div>`, //设置文本标注内容
              });
              this.markers.push(marker)
            }
            this.map.add(this.markers)
            // that.map.setFitView() // 视口自适应


            pointMapList({
              departmentId: this.departmentId,
              pollutionType: this.pollutionType
            }).then(res => {
              console.log('res', res)
              this.markList = res.retData

              var infoWindow = new AMap.InfoWindow({
                anchor: 'right',
                closeWhenClickMap: true,
                isCustom: true,
                offset: new AMap.Pixel(35, 0)
              })

              function markerClick(e) {
                // console.log(e)
                console.log(e.target.getExtData().pointObj)
                that.pointObj = JSON.parse(JSON.stringify(e.target.getExtData().pointObj))

                console.log("that.pointObj", that.pointObj)

                infoWindow.setContent(e.target.content)
                infoWindow.open(that.map, e.target.getPosition())

                that.map.panTo([e.lnglat.lng, e.lnglat.lat])
              }

              for (var j = 0; j < this.markList.length; j++) {

                var markerIcon = new AMap.Icon({
                  // size: new AMap.Size(30 * 0.6, 50 * 0.6), // 图标尺寸
                  image: "http://47.96.147.99:9000/haisheng/static/img/comPoint1.png", // Icon的图像
                  imageSize: new AMap.Size(24 * 0.6, 30 * 0.6)
                })

                var marker = new AMap.Marker({
                  icon: markerIcon,
                  position: [this.markList[j].lng, this.markList[j].lat],
                  title: this.markList[j].licensePlate,
                  anchor: 'center',
                  extData: {
                    'pointObj': this.markList[j]
                  }
                })
                marker.content = this.$refs.infoWindowPoint.$el
                // marker.comId = this.markList[j].comId
                marker.on('click', markerClick)
                marker.setLabel({
                  direction: 'bottom',
                  offset: new AMap.Pixel(0, 0), //设置文本标注偏移量
                  content: `<div class='mapInfo'>${ this.markList[j].comShortName}</div>`, //设置文本标注内容
                });
                this.markers.push(marker)
              }
              this.map.add(this.markers)
              // that.map.setFitView() // 视口自适应

            })

          })

        })

      },
      listLicensePlateSel() { //所有车牌号
        listLicensePlateSel({}).then(res => {
          console.log("车牌号", res)
          this.plateSelList = res.retData
          this.plateSelList.shift()
        })
      },
    }
  }

</script>

<style lang="scss">
  .amap-marker-label {
    border: none;
    background: transparent;
  }

  .mapInfo {
    position: relative;
    margin: 0;
    top: 0;
    right: 0;
    min-width: 0;
    border-radius: 10px;
    border: 2px solid #105bc9;
    background: white;
    padding: 3px;
  }

</style>

<style lang="scss" scoped>
  .dashboard {
    &-container {
      padding: 20px;
      height: calc(100vh - 50px - 34px);
      background: #f2f2f2;
      overflow: auto;
    }
  }

  .topHead {
    position: absolute;
    top: 10px;
    left: 20px;
    z-index: 99;
    background: #f2f2f2;
  }


  .tuli {
    position: absolute;
    z-index: 10;
    left: 1.04vw;
    bottom: 2.6vw;
    font-size: 0.83vw;
    background: white;
    border-radius: 0.39vw;
    padding-right: 1vw;
  }

  .tuliItem {
    display: flex;
    align-items: center;
    margin: 0.39vw;
  }

  .flag1,
  .flag2,
  .flag3,
  .flag4 {
    width: 0.78vw;
    height: 0.78vw;
    border-radius: 50%;
    background-color: #878c92;
    margin: 0 0.68vw;
  }

  .flag2 {
    background-color: #105bc9;
  }

  .flag3 {
    background-color: #f1a010;
  }

  .flag4 {
    background-color: #40c040;
  }

</style>
