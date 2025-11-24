<template>
  <div class="app-container">
    <div>
      <span>MN号：</span>
      <el-input v-model="mn" style="width:200px;margin-right: 10px;" />
      <span>报文数据类型：</span>
      <el-select
      v-if="!isCustomInput"
      v-model="cn"
      placeholder="请选择报文类型"
      @change="handleSelectChange"
      clearable
    >
      <el-option
        v-for="item in reportOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
      <el-option label="其他（手动输入）" value="other"></el-option>
    </el-select>

    <el-input
      v-else
      v-model="cn"
      placeholder="请输入其他报文类型"
      style="width:200px;margin-right: 10px;"
    >
      <el-button slot="append" icon="el-icon-close" @click="handleClearInput"></el-button>
    </el-input>
      <span>数据日期：</span>
      <el-date-picker
        v-model="time"
        type="datetimerange"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
        @change="changeTime"
      />
      <span>上传日期：</span>
      <el-date-picker
        v-model="createtime"
        type="datetimerange"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
        @change="changeCreateTime"
      />
      <el-button type="primary" icon="el-icon-search" @click="searchClick">搜索</el-button>
    </div>
    <el-tabs v-model="activeName" type="card" class="elTab">
      <el-tab-pane label="表格" name="first">
        <el-table v-loading="loadable" border :data="tableData" style="margin:10px 0px 0px 0px">
          <el-table-column
            type="index"
            width="50"
            label="#"
            align="center"
          />
          <el-table-column label="数据时间" align="center" width="160px">
            <template slot-scope="scope">
              <div v-if="scope.row.dataTime">
                {{ scope.row.dataTime }}
              </div>
              <div v-else>
                /
              </div>
            </template>
          </el-table-column>
          <el-table-column label="上传时间" align="center" width="160px">
            <template slot-scope="scope">
              <div v-if="scope.row.createTime">
                {{ scope.row.createTime }}
              </div>
              <div v-else>
                /
              </div>
            </template>
          </el-table-column>
          <el-table-column label="数据报文" align="left">
            <template slot-scope="scope">
              <div v-if="scope.row.bw">
                {{ scope.row.bw }}
              </div>
              <div v-else>
                /
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <el-pagination
      :current-page="pageIndex"
      :page-sizes="[10,20,30,50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      class="paginationStyle"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <div class="daochu">
      <span>文件格式：</span>
      <el-select v-model="bookType" placeholder="请选择" size="small">
        <el-option label="xlsx" value="xlsx" />
        <el-option label="csv" value="csv" />
        <el-option label="txt" value="txt" />
      </el-select>
      <!-- <el-button v-if="deviceStyles==2" size="small" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownloadAll">
        单页导出
      </el-button> -->
      <el-button size="small" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload"> 单页导出</el-button>
    </div>

  </div>
</template>

<script>
import { messagePage } from '@/api/table'
import { getToken } from '@/utils/auth'
import moment from 'moment'

export default {
  name: 'Newspaper',
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      bookType: 'xlsx',
      activeName: 'first',
      list: null,
      listLoading: true,
      tableData: [],
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      loadable: false,
      comList: [],
      mn: '',
      realMn:"",
      cn: '2011',
      reportOptions: [
        { value: '2011', label: '2011 实时数据' },
        { value: '2051', label: '2051 分钟数据' },
        { value: '2061', label: '2061 小时数据' },
        { value: '2031', label: '2031 天数据' },
      ],
      isCustomInput: false,
      deviceList: [],
      device: '',
      deviceValue: '',
      startTime: '',
      endTime: '',
      createStartTime: '',
      createEndTime: '',
      time: [],
      createtime: [],
      pickerOptions: {
        shortcuts: [{
          text: '今日',
          onClick(picker) {
            const end = new Date()
            end.setHours(23)
            end.setMinutes(59)
            end.setSeconds(59)
            var date = new Date()
            // 2. 时分秒归零
            date.setHours(0)
            date.setMinutes(0)
            date.setSeconds(0)
            const start = date
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  mounted() {
    const end = new Date()
    end.setHours(23)
    end.setMinutes(59)
    end.setSeconds(59)
    var date = new Date()
    // 2. 时分秒归零
    date.setHours(0)
    date.setMinutes(0)
    date.setSeconds(0)
    const start2 = date
    this.createtime = [start2, end]
    this.createStartTime = moment(this.createtime[0]).format('YYYY-MM-DD HH:mm:ss')
    this.createEndTime = moment(this.createtime[1]).format('YYYY-MM-DD HH:mm:ss')
    this.time = [start2, end]
    this.startTime = moment(this.createtime[0]).format('YYYY-MM-DD HH:mm:ss')
    this.endTime = moment(this.createtime[1]).format('YYYY-MM-DD HH:mm:ss')
    console.log(this.$route.params.mn)
    if (this.$route.params.mn) {
      this.mn = this.$route.params.mn
      this.realMn = this.$route.params.mn
    }
    this.messagePage()
  },
  activated() {
    console.log(this.$route.params)
    if (JSON.stringify(this.$route.params) !== '{}') {
      const end = new Date()
      end.setHours(23)
      end.setMinutes(59)
      end.setSeconds(59)
      var date = new Date()
      // 2. 时分秒归零
      date.setHours(0)
      date.setMinutes(0)
      date.setSeconds(0)
      const start2 = date
      this.createtime = [start2, end]
      this.createStartTime = moment(this.createtime[0]).format('YYYY-MM-DD HH:mm:ss')
      this.createEndTime = moment(this.createtime[1]).format('YYYY-MM-DD HH:mm:ss')
      this.time = [start2, end]
      this.startTime = moment(this.createtime[0]).format('YYYY-MM-DD HH:mm:ss')
      this.endTime = moment(this.createtime[1]).format('YYYY-MM-DD HH:mm:ss')
      this.mn = this.$route.params.mn
      this.realMn = this.$route.params.mn
      this.messagePage()
    }
    console.log('有吗')
  },
  methods: {
    handleSelectChange(value) {
      if (value === 'other') {
        this.isCustomInput = true;
        this.cn = '';
      }
    },
    handleClearInput() {
      this.isCustomInput = false;
      this.cn = '';
    },
    handleDownload() {
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['数据时间','更新时间', '数据报文', 'IP'] // 表头名称
        const filterVal = ['dataTime','createTime', 'bw', 'ip']
        const list = this.tableData
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename,
          autoWidth: true,
          bookType: this.bookType || 'xlsx'
        })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (v[j] === true) {
          v[j] = '开'
        } else if (v[j] === false) {
          v[j] = '关'
        } else if (v[j] === undefined) {
          v[j] = undefined
        }
        return v[j]
      }))
    },
    handleSizeChange(val) {
      this.pageIndex = 1
      this.pageSize = val
      this.messagePage()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.messagePage()
    },

    searchClick() {
      // this.pageIndex = 1
      // this.deviceValue = this.device
      this.startTime = moment(this.time[0]).format('YYYY-MM-DD HH:mm:ss')
      this.endTime = moment(this.time[1]).format('YYYY-MM-DD HH:mm:ss')
      this.createStartTime = moment(this.createtime[0]).format('YYYY-MM-DD HH:mm:ss')
      this.createEndTime = moment(this.createtime[1]).format('YYYY-MM-DD HH:mm:ss')
      this.realMn = this.mn
      this.messagePage()
    },
    changeTime(val) {
      console.log(val)
      if (val === null) {
        this.time = []
      }
    },
    changeCreateTime(val) {
      console.log(val)
      if (val === null) {
        this.createtime = []
      }
    },
    messagePage() {
      this.loadable = true
      messagePage({
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        dataStartTime: this.startTime,
        dataEndTime: this.endTime,
        createStartTime: this.createStartTime,
        createEndTime: this.createEndTime,
        mn: this.realMn,
        cn:this.cn,
      }).then(res => {
        this.total = res.retData.total
        this.tableData = res.retData.records
        this.loadable = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.redSvg{
  color: red;
  font-size: 20px;
}
.greenSvg{
  color: green;
  font-size: 20px;
}
.paginationStyle{
 text-align: center;
 margin: 15px 0;
}
.elTab{
  margin-top:10px
}
.daochu{
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
  position: absolute;
  top: 74px;
  right: 22px;
  font-size: 14px;
  font-weight: 500;
}
</style>
