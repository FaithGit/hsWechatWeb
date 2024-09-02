<template>
  <div class="info">
    <div class="cheliangHead" v-if="pointObj">
      <img src="http://47.96.147.99:9000/haisheng/static/img/cheliangHeadImg.png" class="cheliangHeadImg" />
      <div class="licensePlate">
        {{pointObj.licensePlate}}
      </div>
      <el-button class="xiangqing">详情</el-button>
      <div :class="['driveStatusName',`driveStatus${pointObj.driveStatus}`]">
        {{pointObj.driveStatusName}}
      </div>
      <div class="buttomInfo">
        <div class="buttomInfoBox">
          <img src="http://47.96.147.99:9000/haisheng/static/img/ywgroup.png" class="cheliangTelphone" />
          {{pointObj.driverList[0].groupName}}
        </div>
        <div class="buttomInfoBox">
          <img src="http://47.96.147.99:9000/haisheng/static/img/cheliangAcc.png" class="cheliangTelphone" />
          {{pointObj.accStatusName}}
        </div>
        <div class="buttomInfoBox">
          <img src="http://47.96.147.99:9000/haisheng/static/img/cheliangPower.png" class="cheliangTelphone" />
          {{pointObj.electricQuantity}}%
        </div>
      </div>
    </div>

    <div class="carinfoBox" v-if="pointObj">
      <div class="infoBox" style="margin-top: 0.63vw;">
        <img src="http://47.96.147.99:9000/haisheng/static/img/cheliangStatus.png" class="cheliangSpeed" />
        <div v-for="item in pointObj.driverList" :key="item.telephone" @click=" navigator.clipboard.writeText(`${item.telephone}`);"
          style="margin-right: 20px; display: flex;align-items: center;">
          <img src="http://47.96.147.99:9000/haisheng/static/img/phone.png" style="width:0.8vw;margin-right:3px" alt=""
            srcset="">
          {{item.userName}}
        </div>
      </div>
      <div class="infoBox">
        <img src="http://47.96.147.99:9000/haisheng/static/img/cheliangSpeed.png" class="cheliangSpeed" />
        {{pointObj.speed}} km/h
        <div class="rilic">
          日里程 {{pointObj.mileage}}公里
        </div>
      </div>
      <div class="infoBox">
        <img src="http://47.96.147.99:9000/haisheng/static/img/cheliangTime.png" class="cheliangSpeed" />
        {{pointObj.gpsTime}}
      </div>
      <div class="infoBox">
        <img src="http://47.96.147.99:9000/haisheng/static/img/cheliangTime.png" class="cheliangSpeed" />
        {{pointObj.address}}
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    props: {
      pointObj: {
        type: Object,
        default: function () {
          return {}
        }
      },
    },
    // watch: {
    //   pointObj: {
    //     handler: function (val, oldVal) {
    //       console.log(val, oldVal)
    //     },
    //     deep: true
    //   },
    // },
    data() {
      return {

      }
    },
    mounted() {

    },
    methods: {
      closeInfo() {
        this.$emit('closeInfo')
      }
    }

  }

</script>

<style lang="scss" scoped>
  .info {
    position: absolute;
    width: 19.53vw;
    height: 10.42vw;
    z-index: 1001;
    background: white;
    border-radius: 0.83vw;
  }

  .cheliangHead {
    height: 2.08vw;
    margin-top: 1.04vw;
    position: relative;
  }

  .cheliangHeadImg {
    width: 2.08vw;
    height: 2.08vw;
    left: 1.15vw;
    position: absolute;
  }

  .licensePlate {
    font-size: 0.78vw;
    font-family: Microsoft YaHei UI;
    font-weight: bold;
    color: #333333;
    position: absolute;
    left: 4.17vw;
    top: 0;
  }

  .xiangqing {
    position: absolute;
    left: 8.79vw;
    top: -0.1vw;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #e1fbec;
    width: 2.24vw;
    height: 0.99vw;
    white-space: nowrap;
    font-size: 0.63vw;
    color: #1AC55E;
    border: none;
  }

  .driveStatusName {
    position: absolute;
    left: 11.72vw;
    top: 0vw;
    height: 0.98vw;
    border-radius: 0.105vw;
    font-size: 0.63vw;
    font-family: Microsoft YaHei UI;
    font-weight: 400;
    padding: 0.1vw 0.44vw;
  }

  .driveStatus1 {
    color: #868686;
    border: 0.998px solid #747474;
  }

  .driveStatus2 {
    color: #F34747;
    border: 0.998px solid #F34747;
  }

  .driveStatus3 {
    color: #f8771d;
    border: 0.998px solid #f8771d;
  }

  .driveStatus4 {
    color: #10ca5c;
    border: 0.998px solid #10ca5c;
  }

  .buttomInfoBox {
    display: flex;
    align-items: center;
    margin-right: 0.78vw
  }

  .buttomInfo {
    position: absolute;
    left: 4.17vw;
    top: 1.43vw;
    display: flex;
    align-items: center;
    font-size: 0.63vw;
  }

  .cheliangTelphone {
    width: 0.83vw;
    margin-right: 0.26vw;
  }

  .infoBox {
    display: flex;
    align-items: center;
    margin-bottom: 0.26vw;
  }

  .carinfoBox {
    font-size: 0.63vw;
    font-family: Microsoft YaHei UI;
    font-weight: 400;
    color: #333333;
    background: #FBFCFE;
    /* background: red; */
    width: 17.37vw;
    margin-left: 1.09vw;
    padding: 0.65vw 0 0.39vw 0;
  }

  .cheliangSpeed {
    width: 0.67vw;
    height: 0.67vw;
    margin-right: 0.78vw;
  }

  .rilic {
    height: 0.99vw;
    line-height: 0.99vw;
    background: #deebfa;
    border-radius: 0.1vw;
    font-size: 0.63vw;
    font-family: Microsoft YaHei UI;
    font-weight: 400;
    color: #1782FC;
    padding: 0 0.49vw;
    margin-left: 0.99vw;
  }

</style>
