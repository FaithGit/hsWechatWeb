<template>
  <div class="dashboard-container">
    <div class="fourCard">
      <div class="indexbox">
        <div class="indexTitle">企业数量</div>
        <div class="indexNum">{{ companyNum }} <span style="font-size:0.94vw">家</span></div>
        <img src="@/assets/index1.png" class="indexImg" alt="" srcset="">
      </div>
      <div class="indexbox">
        <div class="indexTitle">点位数量</div>
        <div class="indexNum">{{ pointNum }} <span style="font-size:0.94vw">个</span></div>
        <img src="@/assets/index2.png" class="indexImg" alt="" srcset="">
      </div>
      <div class="indexbox">
        <div class="indexTitle">运维车辆</div>
        <div class="indexNum">{{ driveNum }} <span style="font-size:0.94vw">辆</span></div>
        <img src="@/assets/index3.png" class="indexImg" alt="" srcset="">
      </div>
      <div class="indexbox">
        <div class="indexTitle">运维人员</div>
        <div class="indexNum">{{ userNum }} <span style="font-size:0.94vw">人</span></div>
        <img src="@/assets/index4.png" class="indexImg" alt="" srcset="">
      </div>

    </div>
    <div class="threeCard">
      <div class="echartbox">
        <div class="indexTitle">运维点位数量</div>
        <echarts1 />
      </div>
      <div class="echartbox">
        <div class="indexTitle">试剂配置和使用情况</div>
        <echarts2 />
      </div>
      <div class="echartbox">
        <div class="indexTitle">标液配置和使用情况</div>
        <echarts3 />
      </div>
    </div>
    <div class="threeCard">
      <div class="echartbox table1">
        <div class="indexTitle">运维考核情况({{ examName }})</div>
        <table1 v-if="listData4.length!=0" :list-data4="listData4" />
      </div>
      <div class="echartbox map1">
        <div class="indexTitle">运维车辆实时状况</div>
        <map1 />
      </div>
    </div>
  </div>
</template>

<script>
import {
  getBasicInfoNum,
  getRecentExam
} from '@/api/table'

import echarts1 from './echarts1.vue'
import echarts2 from './echarts2.vue'
import echarts3 from './echarts3.vue'
import table1 from './table1.vue'
import map1 from './map1.vue'

export default {
  name: 'Dashboard',
  components: {
    echarts1,
    echarts2,
    echarts3,
    table1,
    map1
  },
  data() {
    return {
      companyNum: '',
      driveNum: '',
      pointNum: '',
      userNum: '',
      listData3: [],
      listData4: [],
      examName: ''
    }
  },
  mounted() {
    this.getBasicInfoNum()
    this.getRecentExam()
  },
  methods: {
    getBasicInfoNum() {
      getBasicInfoNum().then(res => {
        console.log(res)
        this.companyNum = res.retData.companyNum
        this.driveNum = res.retData.driveNum
        this.pointNum = res.retData.pointNum
        this.userNum = res.retData.userNum
      })
    },
    getRecentExam() {
      getRecentExam().then(res => {
        console.log('getRecentExam', res)
        this.examName = res.retData.examName
        this.listData4 = res.retData.userAssesses
      })
    }
  }
}

</script>

<style lang="scss" scoped>
  .dashboard {
    &-container {
      padding: 20px;
      height: calc(100vh - 50px - 34px);
      background: #f2f2f2;
      overflow: auto;
    }
  }

  .fourCard,
  .threeCard {
    display: flex;
    justify-content: space-between;
  }

  .indexImg {
    width: 100%;
    height: 100%;
  }

  .indexbox {
    position: relative;
    width: 20.83vw;
    height: 8.33vw;
  }

  .indexTitle {
    font-size: 0.94vw;
    font-weight: bold;
    color: #565C61;
    position: absolute;
    left: 1.77vw;
    top: 1.46vw;
  }

  .indexNum {
    font-size: 3.13vw;
    color: #565C61;
    position: absolute;
    right: 2.03vw;
    bottom: 1.77vw;
  }

  .threeCard {
    margin-top: 1.61vw;
  }

  .echartbox {
    width: 27.6vw;
    height: 15.63vw;
    background: #FFFFFF;
    box-shadow: 0vw 0.31vw 0.94vw 0vw rgba(160, 160, 160, 0.1);
    border-radius: 0.1vw;
    position: relative;
  }

  .table1 {
    width: 53.33vw;
    height: 23.33vw;
  }

  .map1 {
    width: 32.14vw;
    height: 23.33vw;
  }

</style>
