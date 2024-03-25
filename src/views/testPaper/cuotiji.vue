<template>
  <div class="testPaper">
    <!-- 条件栏 -->
    <div>
      试题内容：
      <el-input v-model="content" class="seachInput" placeholder="请输入试题内容" clearable />
      时间范围：
      <el-date-picker
        v-model="time"
        type="datetimerange"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
      />
      <el-button type="primary" style="margin-left:10px" @click="seach">搜索</el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="records" element-loading-text="加载中" border fit highlight-current-row stripe style="margin-top:1.04vw" height="calc(100vh - 84px - 60px - 40px - 32px - 1.04vw - 17px)">
      <el-table-column align="center" label="#" width="95">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="试题类型" prop="questionTypeName" />
      <el-table-column align="center" label="试题内容" prop="content" />
      <el-table-column align="center" label="正确答案" prop="answer" />
      <!-- <el-table-column align="center" label="日期" prop="date" /> -->
      <el-table-column align="center" label="总次数" prop="totalNum" />
      <el-table-column align="center" label="正确次数" prop="correctNumber" />
      <el-table-column align="center" label="正确率(%)" prop="accurateRate" />

    </el-table>
    <!-- 分页 -->
    <div class="buttonPagination">
      <el-pagination
        :current-page="pageNo"
        :page-sizes="[10,20,30,40,50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

  </div>
</template>

<script>
import {
  listQuestionStatisticsPage
} from '@/api/table'
import {
  mapGetters
} from 'vuex'
import moment from 'moment'
export default {
  name: 'Cuotiji',
  data() {
    return {
      pageNo: 1,
      pageSize: 10,
      total: 0,
      records: [],
      content: '',
      half: '',
      year: '',
      time: '',
      pickerOptions: {
        shortcuts: [{
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
        }, {
          text: '最近半年',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 180)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'userId'
    ])
  },
  mounted() {
    this.listQuestionStatisticsPage()
  },
  methods: {
    listQuestionStatisticsPage() {
      console.log(this.time)
      if (this.time) {
        listQuestionStatisticsPage({
          startTime: moment(this.time[0]).format('YYYY-MM-DD'),
          endTime: moment(this.time[1]).format('YYYY-MM-DD'),
          content: this.content,
          pageIndex: this.pageNo,
          pageSize: this.pageSize
        }).then(res => {
          this.records = res.retData.records
          this.total = res.retData.total
        })
      } else {
        listQuestionStatisticsPage({
          content: this.content,
          pageIndex: this.pageNo,
          pageSize: this.pageSize
        }).then(res => {
          this.records = res.retData.records
          this.total = res.retData.total
        })
      }
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.listQuestionStatisticsPage()
    },
    handleCurrentChange(val) {
      this.pageNo = val
      this.listQuestionStatisticsPage()
    },
    seach() {
      this.pageNo = 1
      this.listQuestionStatisticsPage()
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

  .disable {
    ::v-deep .el-upload--picture-card {
      display: none !important;
    }
  }

  .answerOptionsItem {
    width: 500px;
    margin: 0 10px;
  }

</style>
