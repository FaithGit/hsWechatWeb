<template>
  <div class="info">
    <div class="cheliangHead" v-if="newObj">
      <img src="http://47.96.147.99:9000/haisheng/static/img/pointCom.png" class="cheliangHeadImg" />
      <div class="licensePlateCom">
        {{newObj.comName}}-{{newObj.pointName}}-{{newObj.pointStatusName ||'-'}}
        <div class="buttomInfo2">
          <div class="buttomInfoBox">
            紧急联系人：{{newObj.emergencyContact}}
            {{newObj.emergencyMobile!= null?newObj.emergencyMobile:'未绑定'}}
          </div>
        </div>
      </div>
    </div>

    <div class="carinfoBox" v-if="newObj">
      <div class="infoBox" style="margin-top: 0.63vw;">
        <img src="http://47.96.147.99:9000/haisheng/static/img/cheliangStatus.png" class="cheliangSpeed" />
        {{newObj.groupName}} {{newObj.groupPeople}}
      </div>
      <div class="infoBox">
        <img src="http://47.96.147.99:9000/haisheng/static/img/cheliangStatus.png" class="cheliangSpeed" />
        IP地址 {{newObj.dciIp||'-'}}
      </div>
      <div class="infoBox">
        <img src="http://47.96.147.99:9000/haisheng/static/img/cheliangStatus.png" class="cheliangSpeed" />
        数采仪编码：{{newObj.dciMn||'-'}}
      </div>

    </div>

  </div>
</template>

<script>
  import {
    pointInfoList
  } from "@/api/table"
  export default {
    props: {
      pointObj: {
        type: Object,
        default: function () {
          return {}
        }
      },
    },
    watch: {
      pointObj: {
        handler: function (val, oldVal) {
          console.log(val)
          pointInfoList({
            pointId: val.pointId
          }).then(res => {
            console.log(res.retData[0])
            this.newObj = res.retData[0]
          })
        },
        deep: true
      },
    },
    data() {
      return {
        newObj: {}
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
    height: 9.42vw;
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

  .licensePlateCom {
    font-size: 0.74vw;
    font-family: Microsoft YaHei UI;
    font-weight: bolder;
    color: #333333;
    position: absolute;
    left: 4.17vw;
    top: 0;
    width: 13.67vw;
  }

</style>
