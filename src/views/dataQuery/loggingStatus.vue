<template>
  <div class="testPaper">
    <!-- 条件栏 -->
    <div class="headClass">
      时间范围：
      <el-date-picker
        v-model="value1"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :clearable="false"
        :picker-options="pickerOptions"
      />
      <span style="margin-left: 10px">角色：</span>
      <treeselect
        v-model="roleIds"
        :multiple="true"
        :options="roleList"
        :normalizer="normalizer"
        placeholder="请选择"
        class="seachInput"
        style="width: 300px"
        no-children-text="暂无数据"
      >
        <label
          slot="option-label"
          slot-scope="{ node, labelClassName }"
          :class="labelClassName"
          :title="node.label"
        >
          {{ node.label }}
        </label>
      </treeselect>
      <el-button
        type="primary"
        style="margin-left: 10px"
        @click="seach"
      >搜索</el-button>
    </div>

    <div id="shiji" style="width: 90vw; height: 60vh" />
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

import { listKhLoginInfo, listLoginIndoRoleSel } from '@/api/table'
import { mapGetters } from 'vuex'
var echarts = require('echarts')
import moment from 'moment'
export default {
  name: 'LoggingStatus',
  components: {
    Treeselect
  },
  data() {
    return {
      value1: null,
      listData2: [],
      roleIds: [],
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      roleList: [],
      normalizer(node) {
        // if (!node.children.length) delete node.children
        return {
          id: node.roleId,
          label: node.roleName,
          children: node.children && node.children.length ? node.children : 0
        }
      }
    }
  },
  computed: {
    ...mapGetters(['userId'])
  },
  mounted() {
    this.value1 = [moment().subtract(1, 'months'), moment()]
    this.listKhLoginInfo()
    this.listLoginIndoRoleSel()
  },
  methods: {
    listLoginIndoRoleSel() {
      listLoginIndoRoleSel({}).then((res) => {
        console.log(res)
        this.roleList = res.retData
      })
    },
    listKhLoginInfo() {
      console.log(this.value1)
      var startTime = ''
      var endTime = ''
      if (this.value1 === null) {
        console.log('null')
      } else {
        startTime = moment(this.value1[0]).format('YYYY-MM-DD HH:mm:ss')
        endTime = moment(this.value1[1]).format('YYYY-MM-DD HH:mm:ss')
      }
      listKhLoginInfo({
        startTime: startTime,
        endTime: endTime,
        roleIds: this.roleIds
      }).then((res) => {
        console.log(res)
        this.listData2 = res.retData
        this.drawChart()
      })
    },
    drawChart() {
      console.log('listData2', this.listData2)
      this.myChart101 = echarts.init(document.getElementById('shiji'))
      this.option = {
        color: ['#42b983', '#4472c4'],
        legend: {
          data: ['每日登录人数', '总人数'],
          top: '8%'
        },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '10%',
          right: '10%',
          bottom: '5%',
          top: '20%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',

            data: this.listData2.xaxis
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            type: 'bar',
            name: '每日登录人数',
            silent: true,
            barWidth: '40%',
            barMaxWidth: 20,
            barGap: '-100%',
            z: 10,
            data: this.listData2.series[1].data,
            avoidLabelOverlap: true,
            label: {
              show: true,
              position: 'top'
            }
          },
          {
            type: 'bar',
            name: '总人数',
            barWidth: '40%',
            barMaxWidth: 20,
            data: this.listData2.series[0].data,
            label: {
              show: true,
              position: 'top'
            }
          }
        ]
      }

      this.myChart101.setOption(this.option)
      // window.onresize = myChart101.resize
      // 注意：如果是一个页面中插入多个echarts图，那么需要用第一种方式来监听resize事件，即：window.addEventListener，若选用第二种方法只能监听一个echarts图的自适应。区别在于addEventListener与on上，有兴趣可以自行查阅。
      window.addEventListener('resize', this.echartsResize)
    },
    echartsResize() {
      this.myChart101.resize()
    },
    seach() {
      this.listKhLoginInfo()
    }
  }
}
</script>

<style lang="scss" scoped>
.testPaper {
  margin: 30px;
}

.buttonPagination {
  text-align: center;
  margin-top: 15px;
}

.seachInput {
  width: 200px;
  margin: 0 10px;
}

.testDetails {
  font-size: 16px;
  line-height: 26px;
}

.card {
  display: flex;
  margin: 20px 0;
  align-items: center;
  justify-content: space-between;
}

.headClass {
  display: flex;
  align-items: center;
}
</style>
