<template>
  <div class="testPaper">
    <!-- 条件栏 -->
    <div>
      试卷名称：
      <el-input v-model="examName" class="seachInput" placeholder="请选择输入试卷名称" clearable />
      试题内容：
      <el-input v-model="questionContent" class="seachInput" placeholder="请选择输入试题内容" clearable />
      试题类型：
      <el-select v-model="status" placeholder="请选择试题类型" class="seachInput" clearable>
        <el-option label="未批阅" :value="0" />
        <el-option label="已批阅" :value="1" />
      </el-select>
      <el-button type="primary" @click="seach">搜索</el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="records" element-loading-text="加载中" border fit highlight-current-row stripe style="margin-top:1.04vw">
      <el-table-column align="center" label="#" width="95">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="试卷名称" prop="examName" />
      <el-table-column align="center" label="试题内容" prop="questionContent" />
      <el-table-column align="center" label="用户答案" prop="userAnswer" />
      <el-table-column align="center" label="正确答案" prop="answer" />
      <el-table-column align="center" label="试题分数" prop="scores" />
      <el-table-column align="center" label="用户分数" prop="userScores" />
      <!-- <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          {{ scope.row.status==0?'未批阅':'已批阅' }}
        </template>
      </el-table-column> -->
      <el-table-column align="center" label="操作" width="360">
        <template slot-scope="scope">
          <div v-if="scope.row.status==0">
            <el-input-number v-model="scope.row.userScoresShow" :min="0" style="width:140px" />
            <el-button style="margin-left:10px" @click="tijiao(scope.row)">提交</el-button>
          </div>
          <div v-else>
            <el-tag type="success">已批阅</el-tag>
          </div>

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
  listEssayQuestionPage,
  readOverQuestion
} from '@/api/table'
import {
  mapGetters
} from 'vuex'
// import moment from 'moment'
export default {
  name: 'Yuejuan',
  data() {
    return {
      pageNo: 1,
      pageSize: 10,
      total: 0,
      records: [],
      examName: '',
      questionContent: '',
      status: ''
    }
  },
  computed: {
    ...mapGetters([
      'userId'
    ])
  },
  mounted() {
    this.listEssayQuestionPage()
  },
  methods: {
    listEssayQuestionPage() {
      listEssayQuestionPage({
        examName: this.examName,
        questionContent: this.questionContent,
        status: this.status,
        pageIndex: this.pageNo,
        pageSize: this.pageSize
      }).then(res => {
        const recordsList = res.retData.records
        recordsList.forEach(e => {
          e.userScoresShow = e.scores
        })
        this.records = res.retData.records
        this.total = res.retData.total
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.listEssayQuestionPage()
    },
    handleCurrentChange(val) {
      this.pageNo = val
      this.listEssayQuestionPage()
    },
    seach() {
      this.pageNo = 1
      this.listEssayQuestionPage()
    },
    tijiao(item) {
      console.log(item)
      readOverQuestion({
        userExamQuestionId: item.userExamQuestionId,
        operateUserId: this.userId,
        scores: item.userScoresShow
      }).then(res => {
        this.$notify({
          type: 'success',
          message: res.retMsg
        })
        this.listEssayQuestionPage()
      })
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
