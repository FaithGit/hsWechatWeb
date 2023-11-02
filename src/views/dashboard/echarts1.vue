<template>
  <div class="jiedao">
    <el-button-group class="fuGroup">
      <el-button :type="type==1?'primary':'info '" size="mini" @click="toggleDate(1)">近一周</el-button>
      <el-button :type="type==2?'primary':'info '" size="mini" @click="toggleDate(2)">近一月</el-button>
    </el-button-group>
    <div id="jiedao" style="width:100%;height:100%" />
  </div>
</template>

<script>
import {
  listOperateNumInThePastWeek
} from '@/api/table'
import moment from 'moment'

var echarts = require('echarts')
export default {
  data() {
    return {
      myChart100: null,
      option: null,
      listData1: [],
      type: 1 // 1 近一周 2 近一月
    }
  },
  destroyed() {
    window.removeEventListener('resize', this.echartsResize)
    // this.myChart100.dispose()
  },
  mounted() {
    this.listOperateNumInThePastWeek()
  },
  methods: {
    toggleDate(value) {
      if (this.type === value) {
        return
      } else {
        console.log(value)
        this.type = value
      }
      this.listOperateNumInThePastWeek()
    },
    listOperateNumInThePastWeek() {
      var startDate = ''
      var endDate = ''
      if (this.type === 1) {
        startDate = moment().subtract(1, 'week').format('YYYY-MM-DD')
        endDate = moment().format('YYYY-MM-DD')
      } else {
        startDate = moment().subtract(1, 'month').format('YYYY-MM-DD')
        endDate = moment().format('YYYY-MM-DD')
      }

      listOperateNumInThePastWeek({
        startDate: startDate,
        endDate: endDate
      }).then(res => {
        console.log(res)
        this.listData1 = res.retData
        this.drawChart()
      })
    },
    drawChart() {
      console.log('listData1', this.listData1)
      var xArr = []
      var xdata = []
      this.listData1.forEach(e => {
        xArr.push(e.date)
        xdata.push(e.num)
      })
      this.myChart100 = echarts.init(document.getElementById('jiedao'))
      this.option = {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '5%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: xArr
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: xdata,
          type: 'bar',
          barMaxWidth: 15,
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: '#97cdff'
              },
              {
                offset: 1,
                color: '#1b91fe'
              }
              ])
            }
          }
        }]
      }

      this.myChart100.setOption(this.option)
      // window.onresize = myChart100.resize
      // 注意：如果是一个页面中插入多个echarts图，那么需要用第一种方式来监听resize事件，即：window.addEventListener，若选用第二种方法只能监听一个echarts图的自适应。区别在于addEventListener与on上，有兴趣可以自行查阅。
      window.addEventListener('resize', this.echartsResize)
    },
    echartsResize() {
      this.myChart100.resize()
    }
  }
}

</script>

<style lang="scss" scoped>
  .jiedao {
    width: 27.6vw;
    height: 13.02vw;
    position: relative;
    top: 2.5vw;
    z-index: 99;
  }

  .fuGroup {
    position: absolute;
    right: 0.52vw;
    top: -1.25vw;
  }

</style>
