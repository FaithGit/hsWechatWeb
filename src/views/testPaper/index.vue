<template>
  <div class="testPaper">
    <!-- 条件栏 -->
    <div>
      试卷名称：
      <el-input v-model="examName" class="seachInput" placeholder="请选择输入关键字" clearable />
      考试人员：
      <el-select v-model="licensedStatus" placeholder="请选择考试人员" class="seachInput" clearable>
        <el-option v-for="item in licensedStatusoptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      状态：
      <el-select v-model="status" placeholder="请选择状态" class="seachInput" clearable>
        <el-option v-for="item in statusoptions" :key="item.value+'状态'" :label="item.label" :value="item.value" />
      </el-select>
      <el-button type="primary" @click="seach">搜索</el-button>

    </div>
    <!-- 功能 -->
    <div style="margin-top:10px">
      <el-button type="primary" @click="download">下载模板</el-button>
      <el-button type="primary" @click="openTimu">导入题目</el-button>
      <el-button type="primary" @click="openShijuan">导入试卷</el-button>
      <el-button type="primary" @click="openSj">随机生成试卷</el-button>
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

      <el-table-column align="center" label="考试人员">
        <template slot-scope="scope">
          {{ scope.row.licensedStatus==1?"组长":scope.row.licensedStatus==2?"组员":"全部" }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="难度" prop="examDifficulty" />
      <el-table-column align="center" label="总分" prop="examTotalScore" />
      <el-table-column align="center" label="合格分" prop="passScore" />
      <el-table-column align="center" label="答题限时/分" prop="examAnswerTime" />
      <el-table-column align="center" label="发布时间" prop="examPublishTime" />
      <el-table-column align="center" label="截止时间" prop="examDeadlineTime" />
      <el-table-column align="center" label="试卷状态" prop="examStatusName" />
      <!-- <el-table-column align="center" label="已考人数" prop="testedNum" />
      <el-table-column align="center" label="未考人数" prop="notTestNum" /> -->
      <el-table-column align="center" label="操作" width="180">
        <template slot-scope="scope">
          <el-button @click="getExam(scope.row)"> 查看</el-button>
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
      width="70%"
      :close-on-click-modal="false"
      @close="examVisible=false"
    >

      <el-row class="testDetails">
        <el-col :span="2">试卷名称：</el-col>
        <el-col :span="10">
          {{ examObj.examName }}
        </el-col>
        <el-col :span="2">考试人员：</el-col>
        <el-col :span="10">
          {{ examObj.licensedStatus==1?"组长":examObj.licensedStatus==2?"组员":"全部" }}
        </el-col>
        <el-col :span="2">试卷难度：</el-col>
        <el-col :span="10">
          {{ examObj.examDifficulty }}
        </el-col>

        <el-col :span="2">答题限时：</el-col>
        <el-col :span="10">
          {{ examObj.examAnswerTime }}分
        </el-col>
        <el-col :span="2">试卷总分：</el-col>
        <el-col :span="10">
          {{ examObj.examTotalScore }}
        </el-col>
        <el-col :span="2">合格分数：</el-col>
        <el-col :span="10">
          {{ examObj.passScore }}
        </el-col>
        <el-col :span="2">开始时间：</el-col>
        <el-col :span="10">
          {{ examObj.examPublishTime }}
        </el-col>
        <el-col :span="2">结束时间：</el-col>
        <el-col :span="10">
          {{ examObj.examDeadlineTime }}
        </el-col>
        <el-col :span="2">试卷状态：</el-col>
        <el-col :span="10">
          {{ examObj.examStatus==1?'未开始':examObj.examStatus==2?'已开始':'已过期失效' }}
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
        <el-table-column label="标准答案" prop="questionAnswer" align="center" width="80" />
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

    <!-- 导入试卷 -->
    <el-dialog
      v-if="shijuanVisible"
      title="导入试卷"
      :append-to-body="true"
      :visible="shijuanVisible"
      width="50%"
      :close-on-click-modal="false"
      @close="shijuanVisible=false"
    >
      <el-form ref="form1" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="试卷名称" prop="examName">
          <el-input v-model="form.examName" placeholder="请输入试卷名称" />
        </el-form-item>
        <el-form-item label="考试人员" prop="licensedStatus">
          <el-select v-model="form.licensedStatus" placeholder="请选择考试人员">
            <el-option
              v-for="item in licensedStatusoptions"
              :key="item.value+'考试人员'"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="试卷难度" prop="examDifficultyCode">
          <el-select v-model="form.examDifficultyCode" placeholder="请选择试卷难度">
            <el-option
              v-for="item in examDifficultyCodeList"
              :key="item.value+'考试难度'"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="发布时间" prop="examPublishTime">
          <el-date-picker v-model="form.examPublishTime" type="datetime" placeholder="选择发布时间" />
        </el-form-item>
        <el-form-item label="截止时间" prop="examDeadlineTime">
          <el-date-picker v-model="form.examDeadlineTime" type="datetime" placeholder="选择截止时间" />
        </el-form-item>

        <el-form-item label="答题限时" prop="examAnswerTime">
          <el-input-number v-model="form.examAnswerTime" :min="0" placeholder="请输入试卷答题限时时间(分钟)" />
        </el-form-item>
        <el-form-item label="合格分数" prop="passScore">
          <el-input-number v-model="form.passScore" :min="0" placeholder="请输入合格通过分数" />
        </el-form-item>

        <el-form-item label="试卷附件">
          <el-upload
            style="width:30%"
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
        <el-button @click="shijuanVisible=false">取消</el-button>
        <el-button type="primary" :loading="loading" @click="upTest">确认</el-button>
      </div>
    </el-dialog>

    <!-- 随机生成试卷 -->
    <el-dialog
      v-if="sjVisible"
      title="随机生成试卷"
      :append-to-body="true"
      :visible="sjVisible"
      width="50%"
      :close-on-click-modal="false"
      @close="sjVisible=false"
    >
      <el-form ref="form1" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="试卷名称" prop="examName">
          <el-input v-model="form.examName" placeholder="请输入试卷名称" />
        </el-form-item>
        <el-form-item label="考试人员" prop="licensedStatus">
          <el-select v-model="form.licensedStatus" placeholder="请选择考试人员">
            <el-option
              v-for="item in licensedStatusoptions"
              :key="item.value+'考试人员'"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="试卷难度" prop="examDifficultyCode">
          <el-select v-model="form.examDifficultyCode" placeholder="请选择试卷难度">
            <el-option
              v-for="item in examDifficultyCodeList"
              :key="item.value+'考试难度'"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="发布时间" prop="examPublishTime">
          <el-date-picker v-model="form.examPublishTime" type="datetime" placeholder="选择发布时间" />
        </el-form-item>
        <el-form-item label="截止时间" prop="examDeadlineTime">
          <el-date-picker v-model="form.examDeadlineTime" type="datetime" placeholder="选择截止时间" />
        </el-form-item>

        <el-form-item label="答题限时" prop="examAnswerTime">
          <el-input-number v-model="form.examAnswerTime" :min="0" placeholder="请输入试卷答题限时时间(分钟)" />
        </el-form-item>
        <el-form-item label="合格分数" prop="passScore">
          <el-input-number v-model="form.passScore" :min="0" placeholder="请输入合格通过分数" />
        </el-form-item>

      </el-form>
      <div style="text-align:center">
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
  removeExam
} from '@/api/table'
import {
  mapGetters
} from 'vuex'
import moment from 'moment'

import axios from 'axios'
import setting from '@/settings'
import {
  getToken
} from '@/utils/auth'

export default {
  name: 'TestPaper',
  computed: {
    ...mapGetters([
      'userId'
    ])
  },
  data() {
    return {
      pageNo: 1,
      pageSize: 10,
      total: 0,
      records: [],
      licensedStatusoptions: [{
        value: 1,
        label: '组长'
      }, {
        value: 2,
        label: '组员'
      }, {
        value: 3,
        label: '全部'
      }],
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
      examDifficultyCodeList: [{
        value: 1,
        label: '易'
      }, {
        value: 2,
        label: '较易'
      }, {
        value: 3,
        label: '中等'
      }, {
        value: 4,
        label: '较难'
      }, {
        value: 5,
        label: '难'
      }

      ],
      licensedStatus: '',
      status: '',
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
        licensedStatus: '',
        examDifficultyCode: '',
        examPublishTime: '',
        examDeadlineTime: '',
        examAnswerTime: 60,
        passScore: 60
      },
      rules: {
        examName: [{
          required: true,
          message: '请输入试卷名称',
          trigger: 'blur'
        }],
        licensedStatus: [{
          required: true,
          message: '请选择考试人员',
          trigger: 'change'
        }],
        examDifficultyCode: [{
          required: true,
          message: '请选择试卷难度',
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
        }],
        passScore: [{
          required: true,
          message: '请输入合格分数',
          trigger: 'change'
        }]
      },
      sjVisible: false
    }
  },
  mounted() {
    this.listExam()
  },
  methods: {
    listExam() { // 试卷列表
      listExam({
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        licensedStatus: this.licensedStatus,
        status: this.status,
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
        encryption: false, // 是否加密(false不加密true加密)
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
        licensedStatus: '',
        examDifficultyCode: '',
        examPublishTime: '',
        examDeadlineTime: '',
        examAnswerTime: 60,
        passScore: 60
      }
    },
    openSj() { // 新建试卷
      this.loading = false
      this.sjVisible = true
      this.form = {
        examName: '',
        licensedStatus: '',
        examDifficultyCode: '',
        examPublishTime: '',
        examDeadlineTime: '',
        examAnswerTime: 60,
        passScore: 60
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
            formData.append('licensedStatus', this.form.licensedStatus)
            formData.append('examDifficulty', this.form.examDifficultyCode == 1 ? '易' : this.form
              .examDifficultyCode == 2 ? '较易' : this.form.examDifficultyCode == 3 ? '中等' : this.form
                .examDifficultyCode == 4 ? '较难' : '难'
            )
            formData.append('examDifficultyCode', this.form.examDifficultyCode)
            formData.append('examPublishTime', moment(this.form.examPublishTime).format('YYYY-MM-DD HH:mm:ss'))
            formData.append('examDeadlineTime', moment(this.form.examDeadlineTime).format('YYYY-MM-DD HH:mm:ss'))
            formData.append('examAnswerTime', this.form.examAnswerTime)
            formData.append('passScore', this.form.passScore)

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
            examName: this.form.examName,
            licensedStatus: this.form.licensedStatus,
            examDifficultyCode: this.form.examDifficultyCode,
            examPublishTime: moment(this.form.examPublishTime).format('YYYY-MM-DD HH:mm:ss'),
            examDeadlineTime: moment(this.form.examDeadlineTime).format('YYYY-MM-DD HH:mm:ss'),
            examAnswerTime: this.form.examAnswerTime,
            passScore: this.form.passScore,
            examDifficulty: this.form.examDifficultyCode == 1 ? '易' : this.form
              .examDifficultyCode == 2 ? '较易' : this.form.examDifficultyCode == 3 ? '中等' : this.form
                .examDifficultyCode == 4 ? '较难' : '难'
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
          })
        }
      }

      )
    },
    computOptions(options) { // 计算题目的选项
      console.log(options)
      let str = ''
      options.forEach((e, i) => {
        if (i == options.length - 1) {
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
