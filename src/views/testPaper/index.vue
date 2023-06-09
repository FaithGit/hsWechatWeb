<template>
  <div class="testPaper">
    <!-- 条件栏 -->
    <div>
      试卷名称：
      <el-input v-model="examName" class="seachInput" placeholder="请选择输入关键字" clearable />
      试卷类型：
      <el-select v-model="examType" placeholder="请选择型" class="seachInput" clearable>
        <el-option v-for="item in examTypeOptions" :key="item.value+'型'" :label="item.label" :value="item.value" />
      </el-select>
      试卷状态：
      <el-select v-model="status" placeholder="请选择状态" class="seachInput" clearable>
        <el-option v-for="item in statusoptions" :key="item.value+'状态'" :label="item.label" :value="item.value" />
      </el-select>
      <el-button type="primary" @click="seach">搜索</el-button>
      <el-button type="primary" @click="openSj">生成考核试卷</el-button>
    </div>

    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="records"
      element-loading-text="加载中"
      border
      fit
      highlight-current-row
      style="margin-top:1.04vw"
    >
      <el-table-column align="center" label="#" width="95">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="试卷名" prop="examName" />
      <el-table-column align="center" label="总分" prop="examTotalScore" />
      <el-table-column align="center" label="答题限时/分" prop="examAnswerTime" />
      <!-- <el-table-column align="center" label="考核角色" prop="roleName" /> -->
      <el-table-column align="center" label="创建人" prop="generateUserName" />
      <el-table-column align="center" label="发布时间" prop="examPublishTime" />
      <el-table-column align="center" label="截止时间" prop="examDeadlineTime" />
      <el-table-column align="center" label="试卷状态" prop="examStatusName" />
      <!-- <el-table-column align="center" label="已考人数" prop="testedNum" />
      <el-table-column align="center" label="未考人数" prop="notTestNum" /> -->
      <el-table-column align="center" label="操作" width="180">
        <template slot-scope="scope">
          <!-- <el-button @click="getExam(scope.row)"> 查看</el-button> -->
          <el-button type="danger" @click="remove(scope.row)"> 删除</el-button>
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

    <!-- 查看试卷 -->
    <el-dialog
      v-if="examVisible"
      title="查看试卷"
      :append-to-body="true"
      :visible="examVisible"
      width="80%"
      :close-on-click-modal="false"
      @close="examVisible=false"
    >

      <el-row class="testDetails">
        <el-col :span="2">试卷名称：</el-col>
        <el-col :span="10">
          {{ examObj.examName }}
        </el-col>
        <el-col :span="2">答题限时：</el-col>
        <el-col :span="10">
          {{ examObj.examAnswerTime }}分
        </el-col>
        <el-col :span="2">试卷总分：</el-col>
        <el-col :span="10">
          {{ examObj.examTotalScore }}
        </el-col>
        <el-col :span="2">开始时间：</el-col>
        <el-col :span="10">
          {{ examObj.examPublishTime }}
        </el-col>
        <el-col :span="2">试卷状态：</el-col>
        <el-col :span="10">
          {{ examObj.examStatus==1?'未开始':examObj.examStatus==2?'已开始':'已过期失效' }}
        </el-col>
        <el-col :span="2">结束时间：</el-col>
        <el-col :span="10">
          {{ examObj.examDeadlineTime }}
        </el-col>

      </el-row>

      <el-table
        :data="examObj.questions.filter(data => !search1 || data.questionContent.toLowerCase().includes(search1.toLowerCase()))"
        style="width: 100%"
        max-height="500"
      >
        <el-table-column align="center" label="#" width="60">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="试题类型" prop="questionTypeName" width="80" align="center" />
        <el-table-column label="试题得分" prop="questionScores" width="80" align="center" />
        <el-table-column label="试题内容" prop="questionContent" />
        <el-table-column label="试题选项">
          <template slot-scope="scope">
            <div>
              {{ computOptions(scope.row.options) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="标准答案" prop="questionAnswer" align="center" />
        <el-table-column align="right" width="160">
          <template slot="header" slot-scope="scope">
            <el-input v-model="search1" size="mini" placeholder="输入试题内容搜索" clearable />
            <div v-if="0">{{ scope }}</div>
          </template>
          <template slot-scope="scope">
            <div v-if="scope.row.questionImg" style="text-align:center">
              <img :src="scope.row.questionImg" alt="" srcset="" style="width:100px">
            </div>
            <div v-else style="text-align:center">
              无示例图
            </div>

          </template>
        </el-table-column>
      </el-table>

    </el-dialog>

    <!-- 导入题目 -->
    <el-dialog
      v-if="timuVisible"
      title="导入题目"
      :append-to-body="true"
      :visible="timuVisible"
      width="30%"
      :close-on-click-modal="false"
      @close="timuVisible=false"
    >

      <el-form ref="form" label-width="80px">
        <el-form-item label="题目附件">
          <el-upload
            class="upload-demo"
            action="#"
            :on-remove="upRemove"
            :limit="1"
            :file-list="uplist"
            accept=".xlsx"
            :auto-upload="false"
            :on-change="upChangeFile"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">限单个xlsx文件</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div style="text-align:center">
        <el-button @click="timuVisible=false">取消</el-button>
        <el-button type="primary" :loading="loading" @click="upFile">确认</el-button>
      </div>
    </el-dialog>
    <!-- 随机生成试卷 -->
    <el-dialog
      v-if="sjVisible"
      title="生成考核试卷"
      :append-to-body="true"
      :visible="sjVisible"
      width="70%"
      :close-on-click-modal="false"
      @close="sjVisible=false"
    >
      <el-form ref="form1" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="试卷名称" prop="examName">
          <el-input v-model="form.examName" placeholder="请输入试卷名称" style="width:220px" />
        </el-form-item>

        <el-form-item label="发布时间" prop="examPublishTime">
          <el-date-picker v-model="form.examPublishTime" type="datetime" placeholder="选择发布时间" />
        </el-form-item>
        <el-form-item label="截止时间" prop="examDeadlineTime">
          <el-date-picker v-model="form.examDeadlineTime" type="datetime" placeholder="选择截止时间" />
        </el-form-item>
        <el-form-item label="答题限时" prop="examAnswerTime">
          <el-input-number v-model="form.examAnswerTime" :min="0" placeholder="请输入试卷答题限时时间(分钟)" /> 分钟
        </el-form-item>
        <el-form-item label="对应考试角色" prop="testUserIds">
          <treeselect
            v-model="form.testUserIds"
            :multiple="true"
            :options="userlist"
            :normalizer="normalizer2"
            placeholder="请选择对应考试人员"
            no-children-text="暂无数据"
          />
        </el-form-item>
        <el-row :gutter="20" style="margin-bottom:20px">
          <el-col :span="4" :offset="2" style="text-align:center">
            <div style="margin-bottom:15px">单选题选项</div>
            <div style="margin-bottom:5px">数量：
              <el-input-number v-model="form.singleAnswerNum" size="small" style="width:140px" :min="0" />
            </div>
            <div>分数：
              <el-input-number v-model="form.singleAnswerScores" size="small" style="width:140px" :min="0" />
            </div>
          </el-col>
          <el-col :span="4" style="text-align:center">
            <div style="margin-bottom:15px">多选题选项</div>
            <div style="margin-bottom:5px">数量：
              <el-input-number v-model="form.multipleAnswerNum" size="small" style="width:140px" :min="0" />
            </div>
            <div>分数：
              <el-input-number v-model="form.multipleAnswerScores" size="small" style="width:140px" :min="0" />
            </div>
          </el-col>
          <el-col :span="4" style="text-align:center">
            <div style="margin-bottom:15px">判断题选项</div>
            <div style="margin-bottom:5px">数量：
              <el-input-number v-model="form.trueFalseQuestionNum" size="small" style="width:140px" :min="0" />
            </div>
            <div>分数：
              <el-input-number v-model="form.trueFalseQuestionScores" size="small" style="width:140px" :min="0" />
            </div>
          </el-col>
          <el-col :span="4" style="text-align:center">
            <div style="margin-bottom:15px">填空题选项</div>
            <div style="margin-bottom:5px">数量：
              <el-input-number v-model="form.fillInTheBlankNum" size="small" style="width:140px" :min="0" />
            </div>
            <div>分数：
              <el-input-number v-model="form.fillInTheBlankScores" size="small" style="width:140px" :min="0" />
            </div>
          </el-col>
          <el-col :span="4" style="text-align:center">
            <div style="margin-bottom:15px">问答题选项</div>
            <div style="margin-bottom:5px">数量：
              <el-input-number v-model="form.essayQuestionNum" size="small" style="width:140px" :min="0" />
            </div>
            <div>分数：
              <el-input-number v-model="form.essayQuestionScores" size="small" style="width:140px" :min="0" />
            </div>
          </el-col>
        </el-row>

      </el-form>
      <div style="text-align:center;margin-top:60px">
        <el-button @click="sjVisible=false">取消</el-button>
        <el-button type="primary" :loading="loading" @click="upSuiji">确认</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {
  listExam,
  exportExcelDemo,
  getExam,
  randomGenerateExam,
  removeExam,
  listUser
} from '@/api/table'
import {
  mapGetters
} from 'vuex'

// import the styles
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

import moment from 'moment'

import axios from 'axios'
import setting from '@/settings'
import {
  getToken
} from '@/utils/auth'

export default {
  name: 'TestPaper',
  components: {
    Treeselect
  },
  data() {
    return {
      pageNo: 1,
      pageSize: 10,
      total: 0,
      records: [],
      userlist: [],
      statusoptions: [{
        value: 1,
        label: '未开始'
      }, {
        value: 2,
        label: '已开始'
      }, {
        value: 3,
        label: '已过期失效'
      }],
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
      status: '',
      examType: '',
      examName: '',
      search1: '',
      listLoading: false,
      loading: false, // 上传题目的loading
      examVisible: false,
      shijuanVisible: false,
      timuVisible: false,
      examObj: {},
      uplist: [], // 题目列表
      form: {
        examName: '',
        examPublishTime: '',
        examDeadlineTime: '',
        examAnswerTime: 60
      },
      rules: {
        examName: [{
          required: true,
          message: '请输入试卷名称',
          trigger: 'blur'
        }],
        testUserIds: [{
          required: true,
          message: '请选择考试人员',
          trigger: 'change'
        }],
        examPublishTime: [{
          required: true,
          message: '请选择试卷发布时间',
          trigger: 'change'
        }],
        examDeadlineTime: [{
          required: true,
          message: '请选择试卷截止时间',
          trigger: 'change'
        }],
        examAnswerTime: [{
          required: true,
          message: '请输入试卷答题限时时间(分钟)',
          trigger: 'change'
        }]
      },
      sjVisible: false,
      normalizer2(node) {
        // if (!node.children.length) delete node.children
        return {
          id: node.userId,
          label: node.userName,
          children: node.children && node.children.length ? node.children : 0
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'userId'
    ])
  },
  mounted() {
    this.listUser()
    this.listExam()
  },
  methods: {

    listUser() { // 试卷列表
      listUser({}).then(res => {
        console.log(res)
        this.userlist = res.retData
      })
    },
    listExam() { // 试卷列表
      listExam({
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        status: this.status,
        examType: this.examType,
        examName: this.examName
      }).then(res => {
        console.log('🚀 ~ listExam ~ res', res)
        this.records = res.retData.records
        this.total = res.retData.total
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.listExam()
    },
    handleCurrentChange(val) {
      this.pageNo = val
      this.listExam()
    },
    seach() {
      this.pageNo = 1
      this.listExam()
    },
    download() { // 下载模板
      exportExcelDemo({}).then(res => {
        console.log(res)
        window.open(res.retData, '_self')
      })
    },
    openTimu() {
      this.timuVisible = true
      this.uplist = []
    },
    getExam(item) { // 查看试卷
      console.log(item)
      getExam({
        examId: item.examId,
        userId: this.userId
      }).then(res => {
        console.log(res)
        this.examObj = res.retData
        this.examVisible = true
      })
    },
    upChangeFile(file, fileList) { // 更改图片
      this.uplist = fileList
    },
    upRemove(file, fileList) { // 删除上传题目
      console.log(file, fileList)
      this.uplist = fileList
    },

    openShijuan() { // 新建试卷
      this.uplist = []
      this.loading = false
      this.shijuanVisible = true
      this.form = {
        examName: '',
        examPublishTime: '',
        examDeadlineTime: '',
        examAnswerTime: 60
      }
    },
    openSj() { // 新建随机试卷
      this.loading = false
      this.sjVisible = true
      this.form = {
        examName: '',
        testUserIds: [],
        examPublishTime: '',
        examDeadlineTime: '',
        examAnswerTime: 60,
        singleAnswerNum: 0,
        singleAnswerScores: 0,
        multipleAnswerNum: 0,
        multipleAnswerScores: 0,
        trueFalseQuestionNum: 0,
        trueFalseQuestionScores: 0,
        fillInTheBlankNum: 0,
        fillInTheBlankScores: 0,
        essayQuestionNum: 0,
        essayQuestionScores: 0
      }
    },
    upFile() { // 上传题目
      this.loading = true
      console.log(this.uplist)
      if (this.uplist.length === 0) {
        this.$notify({
          type: 'warning',
          message: '没有上传文件'
        })
        this.loading = false
        return
      } else {
        var formData = new FormData()
        formData.append('file', this.uplist[0].raw)

        // return
        axios.post(setting.baseUrl + '/exam/importExcel', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'token': getToken()
          }
        })
          .then(res => {
            console.log(res.data)
            if (res.data.retCode === 1000) {
              this.$notify({
                type: 'success',
                message: '上传成功'
              })
              this.timuVisible = false
              this.loading = false
              this.seach()
            } else {
              this.$notify({
                type: 'warning',
                message: res.data.retMsg
              })
            }
            this.loading = false
          }).catch((e) => {
            console.log('🚀 ~ this.$refs.fuform.validate ~ e', e)
            this.loading = false
          })
      }
    },
    upTest() { // 上传题目
      this.$refs.form1.validate((valid) => {
        if (valid) {
          this.loading = true
          console.log(this.uplist)
          if (this.uplist.length === 0) {
            this.$notify({
              type: 'warning',
              message: '没有上传文件'
            })
            this.loading = false
            return
          } else {
            var formData = new FormData()
            formData.append('file', this.uplist[0].raw)
            formData.append('examName', this.form.examName)
            formData.append('examPublishTime', moment(this.form.examPublishTime).format('YYYY-MM-DD HH:mm:ss'))
            formData.append('examDeadlineTime', moment(this.form.examDeadlineTime).format('YYYY-MM-DD HH:mm:ss'))
            formData.append('examAnswerTime', this.form.examAnswerTime)

            // return
            axios.post(setting.baseUrl + '/exam/importExcelAndGenerateExam', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                'token': getToken()
              }
            })
              .then(res => {
                console.log(res.data)
                if (res.data.retCode === 1000) {
                  this.$notify({
                    type: 'success',
                    message: '上传成功'
                  })
                  this.shijuanVisible = false
                  this.loading = false
                  this.seach()
                } else {
                  this.$notify({
                    type: 'warning',
                    message: res.data.retMsg
                  })
                }
                this.loading = false
              }).catch((e) => {
                console.log('🚀 ~ this.$refs.fuform.validate ~ e', e)
                this.loading = false
              })
          }
        }
      }

      )
    },
    upSuiji() { // 上传题目
      this.$refs.form1.validate((valid) => {
        if (valid) {
          this.loading = true
          const _obj = {
            userId: this.userId,
            examName: this.form.examName,
            testUserIds: this.form.testUserIds,
            examPublishTime: moment(this.form.examPublishTime).format('YYYY-MM-DD HH:mm:ss'),
            examDeadlineTime: moment(this.form.examDeadlineTime).format('YYYY-MM-DD HH:mm:ss'),
            examAnswerTime: this.form.examAnswerTime,
            singleAnswerNum: this.form.singleAnswerNum,
            singleAnswerScores: this.form.singleAnswerScores,
            multipleAnswerNum: this.form.multipleAnswerNum,
            multipleAnswerScores: this.form.multipleAnswerScores,
            trueFalseQuestionNum: this.form.trueFalseQuestionNum,
            trueFalseQuestionScores: this.form.trueFalseQuestionScores,
            fillInTheBlankNum: this.form.fillInTheBlankNum,
            fillInTheBlankScores: this.form.fillInTheBlankScores,
            essayQuestionNum: this.form.essayQuestionNum,
            essayQuestionScores: this.form.essayQuestionScores
          }

          randomGenerateExam(_obj).then(res => {
            console.log(res)
            if (res.retCode === 1000) {
              this.$notify({
                type: 'success',
                message: '上传成功'
              })
              this.sjVisible = false
              this.loading = false
              this.seach()
            } else {
              this.$notify({
                type: 'warning',
                message: res.retMsg
              })
            }
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        }
      }

      )
    },
    computOptions(options) { // 计算题目的选项
      console.log(options)
      let str = ''
      options.forEach((e, i) => {
        if (i === options.length - 1) {
          str += e.value
        } else {
          str += e.value + '|'
        }
      })
      return str
    },
    remove(item) {
      console.log(item)
      this.$confirm('此操作将永久删除该试卷, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeExam({
          examId: item.examId
        }).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.listExam()
        })
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

</style>
