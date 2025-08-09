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
      <el-button type="primary" style="margin-left: 10px" @click="seach">搜索</el-button>
      <el-button type="primary" icon="el-icon-download" style="margin-left: 10px" @click="daochuAjax"
        v-loading="loading">导出</el-button>

      <el-popover placement="top" v-model="visible">
        <div style="margin-bottom: 10px;">请选择导出月份</div>
        <el-date-picker v-model="month2" type="month" placeholder="选择月" :clearable="false">
        </el-date-picker>
        <div style="text-align: right; margin-top: 10px">
          <el-button size="mini" type="text" @click="visible = false">取消</el-button>
          <el-button type="primary" size="mini" @click="daochu2">确定</el-button>
        </div>
        <el-button slot="reference" type="primary" icon="el-icon-download" style="margin-left: 10px"
          v-loading="loading">导出每日推送月统计</el-button>
      </el-popover>



    </div>
    <!-- 表格 -->
    <el-table :data="records" element-loading-text="加载中" border fit stripe highlight-current-row
      style="margin-top: 1.04vw" height="calc(100vh - 84px - 60px - 40px - 32px - 1.04vw - 17px)">
      <el-table-column align="center" label="#" width="95">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="试卷类型" prop="examTypeName" />
      <el-table-column align="center" label="试卷名称" prop="examName" />
      <el-table-column align="center" label="用户姓名" prop="userName" />
      <el-table-column align="center" label="试卷总分" prop="examTotalScore" />
      <el-table-column align="center" label="用户得分" prop="score" />
      <el-table-column align="center" label="题目总数" prop="questionNum" />
      <el-table-column align="center" label="答对题数" prop="rightQuestionNum" />
      <el-table-column align="center" label="正确率">
        <template slot-scope="scope"> {{ scope.row.accuracy }}% </template>
      </el-table-column>

      <el-table-column align="center" label="试卷发布时间" prop="examPublishTime" />
      <el-table-column align="center" label="用户答题时间" prop="submitTime" />
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <!-- <el-button type="primary" @click="daochu(scope.row)">导出</el-button> -->
          <el-button v-if="scope.row.userExamStatus == 4" type="primary" @click="check(scope.row)">查看试卷</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="buttonPagination">
      <el-pagination :current-page="pageNo" :page-sizes="[10, 20, 30, 40, 50]" :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>

    <el-dialog :visible="dialogVisible" width="700px" @close="dialogVisible = false" top="2%">
      <div class="queBox" id="queBox">
        <div v-for="(item, index) in questions" :key="item.questionId" class="timu">
          <div class="checkExamName" v-if="index == 0">
            {{ checkExamName }} - {{ zuotiren }}
            <div class="score">
              <span class="userScore">{{ userScore }}</span>/{{ examTotalScore }}
            </div>
          </div>
          <div class="questionTypeName">
            [{{ item.questionTypeName }}] {{ index + 1 }}.
            {{ item.questionContent }} ({{ item.questionScores }}分)
            {{ item.questionUserAnswer == item.questionAnswer ? "✔️" : "❌" }}
          </div>
          <div v-if="item.questionImg">
            <img :src="item.questionImg" alt="" srcset="" class="questionImg" />
          </div>

          <div v-if="item.options.length != 0" style="height: 5px; opacity: 0">
            .
          </div>
          <div v-for="(itm, idx) in item.options" :key="itm.label + idx"
            style="margin-top: 5px; position: relative; padding-left: 5px">
            ({{ itm.label }}) {{ itm.value }}
            <div v-if="item.questionUserAnswer == itm.label" class="questionUserAnswer"></div>
            <div v-if="item.questionAnswer == itm.label" class="questionAnswer"></div>
          </div>

          <div style="margin-top: 10px">
            用户答案：
            <span style="color: #ff896b; font-weight: bold; margin-right: 10px">{{ item.questionUserAnswer }}</span>
            标准答案：
            <span style="color: #2ac105; font-weight: bold">{{
              item.questionAnswer
            }}</span>
          </div>
          <div style="margin-top: 5px; color: rgb(157 157 157); font-size: 13px">
            试题分析：{{ item.questionAnalysis }}
          </div>
        </div>
      </div>


      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="pdfdaochu()">导出</el-button>
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { listUserExamPage, exportUserExam, getExam, exportExamResult, exportStatisticsUserMonthDayPush } from "@/api/table";
import moment from "moment/moment";
import { mapGetters } from "vuex";
// import moment from 'moment'
export default {
  name: "TestPaper",
  data() {
    return {
      pageNo: 1,
      pageSize: 10,
      total: 0,
      records: [],
      content: "",
      examName: "",
      checkExamName: "",
      examTotalScore: "",
      zuotiren: "",
      userScore: "",
      userName: "",
      half: "",
      year: "",
      time: "",
      examType: "",
      dialogVisible: false,
      visible: false,
      loading: false,
      questions: [],
      month2: moment().format("YYYY-MM-DD HH:mm:ss"),
      examTypeOptions: [
        {
          value: 1,
          label: "练习",
        },
        {
          value: 2,
          label: "月考",
        },
        {
          value: 3,
          label: "考核",
        },
        {
          value: 4,
          label: "每日推送",
        },
      ],
      userExamStatus: "",
      userExamStatusList: [
        {
          value: 1,
          label: "未作答",
        },
        {
          value: 2,
          label: "已作答部分未提交",
        },
        {
          value: 3,
          label: "批阅未完成",
        },
        {
          value: 4,
          label: "批阅完成",
        },
      ],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近半年",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
    };
  },
  computed: {
    ...mapGetters(["userId"]),
  },
  mounted() {
    this.listUserExamPage();
  },
  methods: {
    daochu2() {
      console.log("??", moment(this.month2).startOf('months').format("YYYY-MM-DD HH:mm:ss"))
      exportStatisticsUserMonthDayPush({
        startTime: moment(this.month2).startOf('months').format("YYYY-MM-DD HH:mm:ss"),
        endTime: moment(this.month2).startOf('month').subtract('month', -1).format("YYYY-MM-DD HH:mm:ss"),
      }).then((res) => {
        console.log(res);
        this.visible = false
        this.$message.success("导出成功");
        window.open(res.retData);
      });
    },
    daochuAjax() {
      this.loading = true
      exportExamResult({
        examName: this.examName || "",
        userName: this.userName || "",
        examType: this.examType || "",
        userExamStatus: this.userExamStatus || "",
      }).then((res) => {
        console.log(res);
        this.loading = false
        this.$message.success("导出成功");
        window.open(res.retData);
      });
    },
    pdfdaochu(item) {

      this.getPdf(this.checkExamName + this.zuotiren)
    },
    daochu(e) {
      console.log(e.userExamId);
      exportUserExam({
        userExamId: e.userExamId,
      }).then((res) => {
        console.log(res);
        window.open(res.retData);
      });
    },
    check(e) {
      console.log(e.userExamId);
      getExam({
        userExamId: e.userExamId,
      }).then((res) => {
        console.log(res);
        this.dialogVisible = true;
        this.checkExamName = res.retData.examName;
        this.userScore = res.retData.userScore;
        this.examTotalScore = res.retData.examTotalScore;
        this.questions = res.retData.questions;
        this.zuotiren = res.retData.userName;
      });
    },
    listUserExamPage() {
      listUserExamPage({
        examName: this.examName || "",
        userName: this.userName || "",
        examType: this.examType || "",
        userExamStatus: this.userExamStatus || "",
        pageIndex: this.pageNo,
        pageSize: this.pageSize,
      }).then((res) => {
        this.records = res.retData.records;
        this.total = res.retData.total;
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.listUserExamPage();
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.listUserExamPage();
    },
    seach() {
      this.pageNo = 1;
      this.listUserExamPage();
    },
  },
};
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

.checkExamName {
  font-size: 20px;
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.score {
  position: absolute;
  right: 5px;
}

.userScore {
  font-size: 22px;
  color: #e42929;
}

.queBox {
  width: 100%;
  height: 700px;
  overflow: auto;
  padding: 0 20px;
}

.timu {
  margin-top: 30px;
}

.questionImg {
  height: 200px;
  width: 200px;
  margin-top: 10px;
}

.questionUserAnswer {
  position: absolute;
  left: 2px;
  top: -4px;
  width: 25px;
  height: 25px;
  background: transparent;
  border-radius: 50%;
  border: 4px solid #ff896b;
  z-index: 1;
}

.questionAnswer {
  position: absolute;
  left: 2px;
  top: -4px;
  width: 25px;
  height: 25px;
  background: transparent;
  border-radius: 50%;
  border: 4px solid #2ac105;
  z-index: 2;
}

.questionTypeName {
  font-size: 16px;
  font-weight: bold;
  line-height: 150%;
}
</style>
