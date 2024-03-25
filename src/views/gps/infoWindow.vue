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
          <img src="http://47.96.147.99:9000/haisheng/static/img/cheliangTelphone.png" class="cheliangTelphone" />
          {{pointObj.telephone!= null?pointObj.telephone:'未绑定'}}
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
    height: 240px;
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

</style>
