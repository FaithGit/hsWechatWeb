<template>
  <div class="testPaper">
    <!-- 条件栏 -->
    <div>
      试卷名称：
      <el-input v-model="examName" class="seachInput" placeholder="请输入试卷名称" clearable />
      用户名称：
      <el-input v-model="userName" class="seachInput" placeholder="请输入用户名称" clearable />
      试卷类型：
      <el-select v-model="examType" placeholder="请选择型" class="seachInput" clearable>
        <el-option v-for="item in examTypeOptions" :key="item.label" :label="item.label" :value="item.value" />
      </el-select>
      用户试卷状态：
      <el-select v-model="userExamStatus" placeholder="请选择型" class="seachInput" clearable>
        <el-option v-for="item in userExamStatusList" :key="item.label" :label="item.label" :value="item.value" />
      </el-select>
      <el-button type="primary" style="margin-left:10px" @click="seach">搜索</el-button>
    </div>
    <!-- 表格 -->
    <el-table
      :data="records"
      element-loading-text="加载中"
      border
      fit
      stripe
      highlight-current-row
      style="margin-top:1.04vw"
      height="calc(100vh - 84px - 60px - 40px - 32px - 1.04vw - 17px)"
    >
      <el-table-column align="center" label="#" width="95">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="试卷名称" prop="examName" />
      <el-table-column align="center" label="试卷类型" prop="examTypeName" />
      <el-table-column align="center" label="试卷总分" prop="examTotalScore" />
      <el-table-column align="center" label="用户姓名" prop="userName" />
      <el-table-column align="center" label="用户得分" prop="score" />
      <el-table-column align="center" label="试卷发布时间" prop="examPublishTime" />
      <el-table-column align="center" label="试卷截止时间" prop="examDeadlineTime" />
      <el-table-column align="center" label="答题限时(分)" prop="examAnswerTime" />
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="daochu(scope.row)">导出</el-button>
        </template>
      </el-table-column>
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
  listUserExamPage,
  exportUserExam
} from '@/api/table'
import {
  mapGetters
} from 'vuex'
// import moment from 'moment'
export default {
  name: 'TestPaper',
  data() {
    return {
      pageNo: 1,
      pageSize: 10,
      total: 0,
      records: [],
      content: '',
      examName: '',
      userName: '',
      half: '',
      year: '',
      time: '',
      examType: '',
      examTypeOptions: [{
        value: 1,
        label: '练习'
      }, {
        value: 2,
        label: '月考'
      }, {
        value: 3,
        label: '考核'
      }],
      userExamStatus: '',
      userExamStatusList: [{
        value: 1,
        label: '未作答'
      }, {
        value: 2,
        label: '已作答部分未提交'
      }, {
        value: 3,
        label: '批阅未完成'
      }, {
        value: 4,
        label: '批阅完成'
      }],
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
    this.listUserExamPage()
  },
  methods: {
    daochu(e) {
      console.log(e.userExamId)
      exportUserExam({
        userExamId: e.userExamId
      }).then(res => {
        console.log(res)
        window.open(res.retData)
      })
    },
    listUserExamPage() {
      listUserExamPage({
        examName: this.examName || '',
        userName: this.userName || '',
        examType: this.examType || '',
        userExamStatus: this.userExamStatus || '',
        pageIndex: this.pageNo,
        pageSize: this.pageSize
      }).then(res => {
        this.records = res.retData.records
        this.total = res.retData.total
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.listUserExamPage()
    },
    handleCurrentChange(val) {
      this.pageNo = val
      this.listUserExamPage()
    },
    seach() {
      this.pageNo = 1
      this.listUserExamPage()
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
