<template>
  <div class="biaoye">
    <el-button-group class="fuGroup">
      <el-button :type="type==1?'primary':'info '" size="mini" @click="toggleDate(1)">近一月</el-button>
      <el-button :type="type==2?'primary':'info '" size="mini" @click="toggleDate(2)">近两月</el-button>
    </el-button-group>
    <div id="biaoye" style="width:100%;height:100%" />
  </div>
</template>

<script>
var echarts = require('echarts')
import {
  listStandardSolutionInfoInThePastMonth
} from '@/api/table'
import moment from 'moment'
export default {
  data() {
    return {
      myChart102: null,
      option: null,
      listData3: [],
      type: 1 // 1 近1个月 2 近2月
    }
  },
  destroyed() {
    window.removeEventListener('resize', this.echartsResize)
    // this.myChart102.dispose()
  },
  mounted() {
    this.listStandardSolutionInfoInThePastMonth()
  },
  methods: {
    toggleDate(value) {
      if (this.type === value) {
        return
      } else {
        console.log(value)
        this.type = value
      }
      this.listStandardSolutionInfoInThePastMonth()
    },
    listStandardSolutionInfoInThePastMonth() {
      var startDate = ''
      var endDate = ''
      if (this.type === 1) {
        startDate = moment().subtract(1, 'month').format('YYYY-MM-DD')
        endDate = moment().format('YYYY-MM-DD')
      } else {
        startDate = moment().subtract(2, 'month').format('YYYY-MM-DD')
        endDate = moment().format('YYYY-MM-DD')
      }

      listStandardSolutionInfoInThePastMonth({
        startDate: startDate,
        endDate: endDate
      }).then(res => {
        console.log('listData3', res)
        this.listData3 = res.retData
        this.drawChart()
      })
    },
    drawChart() {
      console.log('listData3', this.listData3)
      var xList = []
      var peizhi = []
      var shiyong = []

      this.listData3.forEach(e => {
        xList.push(e.date)
        peizhi.push(e.preparationNum)
        shiyong.push(e.usedNum)
      })

      this.myChart102 = echarts.init(document.getElementById('biaoye'))

      this.option = {
        color: ['#89f5b0', '#FCDA5B'],
        legend: {
          data: ['配置数量', '使用数量'],
          top: '8%'
        },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '5%',
          right: '3%',
          bottom: '5%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          boundaryGap: false,
          data: xList
        }],
        yAxis: [{
          type: 'value'
        },
        {
          type: 'value',
          position: 'right',
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: '#fff',
              fontSize: '14'
            },
            formatter: '{value}'
          },
          axisLine: {
            show: false
          },
          splitLine: {
            show: false
          }
        }
        ],
        series: [{
          name: '配置数量',
          type: 'line',
          data: peizhi,
          symbolSize: 1,
          symbol: 'circle',
          smooth: true,
          yAxisIndex: 0,
          showSymbol: false,
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0,
                color: ' #8EF5B3'
              },
              {
                offset: 1,
                color: '#FFFFFF'
              }
              ],
              global: false // 缺省为 false
            }
          }
        },
        {
          name: '使用数量',
          type: 'line',
          data: shiyong,
          symbolSize: 1,
          symbol: 'circle',
          smooth: true,
          yAxisIndex: 0,
          showSymbol: false,
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0,
                color: ' #FCDA5B'
              },
              {
                offset: 1,
                color: '#FFFFFF'
              }
              ],
              global: false // 缺省为 false
            }
          }
        }
        ]
      }

      this.myChart102.setOption(this.option)
      // window.onresize = myChart102.resize
      // 注意：如果是一个页面中插入多个echarts图，那么需要用第一种方式来监听resize事件，即：window.addEventListener，若选用第二种方法只能监听一个echarts图的自适应。区别在于addEventListener与on上，有兴趣可以自行查阅。
      window.addEventListener('resize', this.echartsResize)
    },
    echartsResize() {
      this.myChart102.resize()
    }
  }
}

</script>

<style lang="scss" scoped>
  .biaoye {
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
