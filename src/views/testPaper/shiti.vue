<template>
  <div class="testPaper">
    <!-- 条件栏 -->
    <div>
      试题内容：
      <el-input v-model="content" class="seachInput" placeholder="请选择输入试题内容" clearable />
      试题类型：
      <el-select v-model="timuType" placeholder="请选择试题类型" class="seachInput" clearable>
        <el-option v-for="item in timuTypeList" :key="item.value+'状态'" :label="item.label" :value="item.value" />
      </el-select>
      <el-button type="primary" @click="seach">搜索</el-button>
      <el-button type="primary" @click="download">下载模板</el-button>
      <el-button type="primary" @click="openTimu">导入题目</el-button>
      <el-button type="primary" @click="addTimu">新增题目</el-button>

    </div>
    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="records"
      element-loading-text="加载中"
      border
      fit
      stripe
      highlight-current-row
      style="margin-top:1.04vw"
    >
      <el-table-column align="center" label="#" width="95">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="试题类型" prop="typeName" />
      <el-table-column align="center" label="试题内容" prop="content" width="300" />

      <el-table-column align="center" label="示例图">
        <template slot-scope="scope">
          <div v-if="scope.row.img" style="text-align:center">
            <img :src="scope.row.img" alt="" srcset="" style="width:100px">
          </div>
          <div v-else style="text-align:center">
            无示例图
          </div>

        </template>
      </el-table-column>
      <el-table-column align="center" label="试题选项" prop="options" />
      <el-table-column align="center" label="试题答案" prop="answer" />
      <el-table-column align="center" label="试题解析" prop="analysis" />
      <el-table-column align="center" label="试题级别名称" prop="levelName" />

      <el-table-column align="center" label="操作" width="180">
        <template slot-scope="scope">
          <el-button @click="bianji(scope.row)"> 编辑</el-button>
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

    <!-- 新建题目 -->
    <el-dialog
      v-if="addtimuVisible"
      title="新建题目"
      :append-to-body="true"
      :visible="addtimuVisible"
      width="50%"
      :close-on-click-modal="false"
      @close="addtimuVisible=false"
    >
      <el-form ref="form1" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="试题类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择试题类型" style="width:220px" @change="changeType">
            <el-option v-for="item in timuTypeList" :key="item.roleId" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="试题分数" prop="scores">
          <el-input-number v-model="form.scores" :min="0" style="width:220px" />
        </el-form-item>
        <el-form-item label="试题内容" prop="content">
          <el-input v-model="form.content" type="textarea" placeholder="请输入试题内容" />
        </el-form-item>

        <el-form-item v-if="form.type==1||form.type==2||form.type==3" label="试题选项">
          <el-checkbox-group v-model="form.answerOptions" :max="form.type==2?9999:1">
            <div v-for="(item,index) in form.options" :key="item.label+'xuanxaing'">
              <el-checkbox :label="item.label">
                <el-tag effect="plain">{{ item.label }}</el-tag>
                <el-input v-model="item.value" placeholder="请输入选项内容" class="answerOptionsItem" />
              </el-checkbox>
              <el-button
                v-if="index==form.options.length-1 && form.type!=3"
                type="danger"
                icon="el-icon-delete"
                circle
                @click="removeOption(item.label)"
              />
              <el-button
                v-if="index==form.options.length-1 &&form.type!=3"
                type="success"
                icon="el-icon-plus"
                circle
                @click="addOption()"
              />
            </div>
          </el-checkbox-group>
          <div class="ps">
            注：勾选中的选项为正确答案
          </div>
        </el-form-item>
        <el-form-item v-if="form.type==4||form.type==5" label="试题答案" prop="answer">
          <el-input v-model="form.answer" type="textarea" placeholder="请输入试题答案" />
        </el-form-item>

        <el-form-item label="试题图片">
          <el-upload
            action="#"
            :class="{disable:uploadDisabled}"
            list-type="picture-card"
            :on-change="handleChange"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :limit="1"
            :auto-upload="false"
            :file-list="fileList"
          >
            <i class="el-icon-plus" />
          </el-upload>
        </el-form-item>
        <el-form-item label="试题级别" prop="level">
          <el-select v-model="form.level" placeholder="请选择试题级别" style="width:220px">
            <el-option v-for="item in levelList" :key="item.value+'级别'" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="试题解析" prop="analysis">
          <el-input v-model="form.analysis" type="textarea" placeholder="请输入试题解析" />
        </el-form-item>

      </el-form>
      <div style="text-align:center;margin-top:30px">
        <el-button @click="addtimuVisible=false">取消</el-button>
        <el-button type="primary" :loading="loading" @click="sumbitAdd">确认</el-button>
      </div>
    </el-dialog>

    <!-- 编辑题目 -->
    <el-dialog
      v-if="bianjiVIsible"
      title="编辑题目"
      :append-to-body="true"
      :visible="bianjiVIsible"
      width="50%"
      :close-on-click-modal="false"
      @close="bianjiVIsible=false"
    >
      <el-form ref="form1" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="试题类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择试题类型" style="width:220px" @change="changeType">
            <el-option v-for="item in timuTypeList" :key="item.roleId" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="试题分数" prop="scores">
          <el-input-number v-model="form.scores" :min="0" style="width:220px" />
        </el-form-item>
        <el-form-item label="试题内容" prop="content">
          <el-input v-model="form.content" type="textarea" placeholder="请输入试题内容" />
        </el-form-item>

        <el-form-item v-if="form.type==1||form.type==2||form.type==3" label="试题选项">
          <el-checkbox-group v-model="form.answerOptions" :max="form.type==2?9999:1">
            <div v-for="(item,index) in form.options" :key="item.label+'xuanxaing'">
              <el-checkbox :label="item.label">
                <el-tag effect="plain">{{ item.label }}</el-tag>
                <el-input v-model="item.value" placeholder="请输入选项内容" class="answerOptionsItem" />
              </el-checkbox>
              <el-button
                v-if="index==form.options.length-1 && form.type!=3"
                type="danger"
                icon="el-icon-delete"
                circle
                @click="removeOption(item.label)"
              />
              <el-button
                v-if="index==form.options.length-1 &&form.type!=3"
                type="success"
                icon="el-icon-plus"
                circle
                @click="addOption()"
              />
            </div>
          </el-checkbox-group>
          <div class="ps">
            注：勾选中的选项为正确答案
          </div>
        </el-form-item>
        <el-form-item v-if="form.type==4||form.type==5" label="试题答案" prop="answer">
          <el-input v-model="form.answer" type="textarea" placeholder="请输入试题答案" />
        </el-form-item>

        <el-form-item label="试题图片">
          <el-upload
            action="#"
            :class="{disable:uploadDisabled}"
            list-type="picture-card"
            :on-change="handleChange"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :limit="1"
            :auto-upload="false"
            :file-list="fileList"
          >
            <i class="el-icon-plus" />
          </el-upload>
        </el-form-item>
        <el-form-item label="试题级别" prop="level">
          <el-select v-model="form.level" placeholder="请选择试题级别" style="width:220px">
            <el-option v-for="item in levelList" :key="item.value+'级别'" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="试题解析" prop="analysis">
          <el-input v-model="form.analysis" type="textarea" placeholder="请输入试题解析" />
        </el-form-item>

      </el-form>
      <div style="text-align:center;margin-top:30px">
        <el-button @click="bianjiVIsible=false">取消</el-button>
        <el-button type="primary" :loading="loading" @click="sumbitgengxin">更新</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import {
  listQuestionPage,
  exportExcelDemo,
  removeQuestion,
  addQuestion,
  getQuestionDetail,
  updateQuestion
} from '@/api/table'
import {
  mapGetters
} from 'vuex'
// import moment from 'moment'

import axios from 'axios'
import setting from '@/settings'
import {
  getToken
} from '@/utils/auth'

export default {
  name: 'TestPaper',

  data() {
    return {
      pageNo: 1,
      pageSize: 10,
      total: 0,
      records: [],
      fileList: [],
      azList: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
        'U', 'V', 'W', 'X', 'Y', 'Z'
      ],
      timuTypeList: [{
        value: 1,
        label: '单选题'
      }, {
        value: 2,
        label: '多选题'
      }, {
        value: 3,
        label: '判断题'
      }, {
        value: 4,
        label: '填空题'
      }, {
        value: 5,
        label: '问答题'
      }],
      levelList: [{
        value: 1,
        label: '入职'
      }, {
        value: 2,
        label: '月考'
      }, {
        value: 3,
        label: '副组长'
      }, {
        value: 4,
        label: '组长'
      }],
      timuType: '',
      dialogImageUrl: '',
      content: '',
      yezz: '',
      search1: '',
      listLoading: false,
      loading: false, // 上传题目的loading
      examVisible: false,
      shijuanVisible: false,
      dialogVisible: false,
      timuVisible: false,
      examObj: {},
      uplist: [], // 题目列表
      roleIdList: [], // 题目列表
      form: {},
      bianjiVIsible: false,
      addtimuVisible: false,
      rules: {
        scores: [{
          required: true,
          message: '请输入试题分数',
          trigger: 'blur'
        }],
        answer: [{
          required: true,
          message: '请输入试题答案',
          trigger: 'blur'
        }],
        analysis: [{
          required: true,
          message: '请输入试题解析',
          trigger: 'blur'
        }],
        type: [{
          required: true,
          message: '请选择试题类型',
          trigger: 'change'
        }],
        level: [{
          required: true,
          message: '请选择试题级别',
          trigger: 'change'
        }],
        content: [{
          required: true,
          message: '请选择试题内容',
          trigger: 'blur'
        }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'userId'
    ]),
    uploadDisabled: function() {
      // this.form.yezz 图片上传成功后可以随便赋值 然后判断图片是否上传
      console.log(this.yezz)
      return this.yezz !== ''
    }
  },
  mounted() {
    this.listQuestionPage()
  },
  methods: {
    listQuestionPage() {
      listQuestionPage({
        type: this.timuType,
        content: this.content,
        pageIndex: this.pageNo,
        pageSize: this.pageSize
      }).then(res => {
        this.records = res.retData.records
        this.total = res.retData.total
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.listQuestionPage()
    },
    handleCurrentChange(val) {
      this.pageNo = val
      this.listQuestionPage()
    },
    seach() {
      this.pageNo = 1
      this.listQuestionPage()
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
    upChangeFile(file, fileList) { // 导入题目 更改文件
      this.uplist = fileList
    },
    upRemove(file, fileList) { // 导入题目 删除上传文件
      console.log(file, fileList)
      this.uplist = fileList
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
    remove(item) { // 删除题目
      console.log(item)
      this.$confirm('此操作将永久删除该题目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeQuestion({
          questionId: item.questionId
        }).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.listQuestionPage()
        })
      })
    },
    addTimu() { // 添加题目
      this.addtimuVisible = true
      this.yezz = ''
      this.form = {
        type: '',
        scores: 0,
        content: '',
        answer: '',
        answerOptions: [],
        options: []
      }
    },
    handlePictureCardPreview(file) { // 预览图片
      console.log('🚀 ~ handlePictureCardPreview ~ file:', file)
      console.log('🚀 ~ handlePictureCardPreview ~ this.fileList:', this.fileList)
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleRemove(file, fileList) {
      console.log('删除', file, fileList)
      this.fileList = []
      this.yezz = ''
    },
    handleChange(file) {
      this.yezz = '1'
      console.log('handleChange', file)
      var formData = new FormData()
      formData.append('file', file.raw)
      axios.post(setting.baseUrl + '/exam/imageConvert', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'token': getToken()
        }
      })
        .then(res => {
          console.log(res.data)
          this.fileList = [{
            url: res.data.retData
          }]
        })
    },
    changeType(value) { // 更改试题类型
      this.$refs.form1.clearValidate()
      console.log(value)
      if (value === 1 || value === 2) {
        this.form.options = [{
          'label': 'A',
          'value': ''
        },
        {
          'label': 'B',
          'value': ''
        }, {
          'label': 'C',
          'value': ''
        },
        {
          'label': 'D',
          'value': ''
        }
        ]
        this.form.answerOptions = []
      } else {
        this.form.options = [{
          'label': 'A',
          'value': '正确'
        },
        {
          'label': 'B',
          'value': '错误'
        }
        ]
        this.form.answerOptions = []
      }
    },
    removeOption(label) { // 删除子选项
      console.log('🚀 ~ removeOption ~ label:', label)
      console.log(this.form.options)
      console.log(this.form.answerOptions)
      var findIndexAnswer = this.form.answerOptions.findIndex(e => {
        // console.log('查找是否有', e)
        return e === label
      })
      console.log('findIndexAnswer', findIndexAnswer)
      if (findIndexAnswer !== -1) {
        this.form.answerOptions.splice(findIndexAnswer, 1)
      }

      this.form.options.splice(this.form.options.length - 1, 1)
      console.log(this.form.options)
      console.log(this.form.answerOptions)
    },
    addOption() { // 添加子选项
      console.log(this.form.options)
      console.log(this.form.options.length)
      this.form.options.push({
        label: this.azList[this.form.options.length],
        value: ''
      })
    },
    sumbitAdd() {
      console.log(this.form)
      this.$refs.form1.validate((valid) => {
        if (valid) {
          if (this.form.type === 1 || this.form.type === 2 || this.form.type === 3) {
            let optionsFalg = false
            this.form.options.forEach(e => {
              if (e.value === '') {
                optionsFalg = true
              }
            })

            if (optionsFalg) {
              this.$notify({
                type: 'warning',
                message: '选项内容不能为空'
              })
              return
            }
            if (this.form.answerOptions.length === 0) {
              this.$notify({
                type: 'warning',
                message: '请勾选正确答案'
              })
              return
            }
            this.loading = true

            addQuestion({
              type: this.form.type,
              scores: this.form.scores,
              content: this.form.content,
              img: this.fileList.length === 0 ? '' : this.fileList[0].url,
              options: this.form.options,
              answerOptions: this.form.answerOptions,
              answer: '',
              analysis: this.form.analysis,
              level: this.form.level
            }).then(res => {
              console.log(res)
              this.loading = false
              this.$notify({
                type: 'success',
                message: res.retMsg
              })
              this.addtimuVisible = false
              this.seach()
            }).catch(() => {
              this.loading = false
            })
          } else {
            this.loading = true
            addQuestion({
              type: this.form.type,
              scores: this.form.scores,
              content: this.form.content,
              img: this.fileList.length === 0 ? '' : this.fileList[0].url,
              options: [],
              answerOptions: [],
              answer: this.form.answer,
              analysis: this.form.analysis,
              level: this.form.level
            }).then(res => {
              console.log(res)
              this.loading = false
              this.$notify({
                type: 'success',
                message: res.retMsg
              })
              this.addtimuVisible = false
              this.seach()
            }).catch(() => {
              this.loading = false
            })
          }
        }
      }

      )
    },
    sumbitgengxin() {
      console.log(this.form)
      this.$refs.form1.validate((valid) => {
        if (valid) {
          if (this.form.type === 1 || this.form.type === 2 || this.form.type === 3) {
            let optionsFalg = false
            this.form.options.forEach(e => {
              if (e.value === '') {
                optionsFalg = true
              }
            })

            if (optionsFalg) {
              this.$notify({
                type: 'warning',
                message: '选项内容不能为空'
              })
              return
            }
            if (this.form.answerOptions.length === 0) {
              this.$notify({
                type: 'warning',
                message: '请勾选正确答案'
              })
              return
            }
            this.loading = true

            updateQuestion({
              questionId: this.form.questionId,
              type: this.form.type,
              scores: this.form.scores,
              content: this.form.content,
              img: this.fileList.length === 0 ? '' : this.fileList[0].url,
              options: this.form.options,
              answerOptions: this.form.answerOptions,
              answer: '',
              analysis: this.form.analysis,
              level: this.form.level
            }).then(res => {
              console.log(res)
              this.loading = false
              this.$notify({
                type: 'success',
                message: res.retMsg
              })
              this.bianjiVIsible = false
              this.seach()
            }).catch(() => {
              this.loading = false
            })
          } else {
            this.loading = true
            updateQuestion({
              questionId: this.form.questionId,
              type: this.form.type,
              scores: this.form.scores,
              content: this.form.content,
              img: this.fileList.length === 0 ? '' : this.fileList[0].url,
              options: [],
              answerOptions: [],
              answer: this.form.answer,
              analysis: this.form.analysis,
              level: this.form.level
            }).then(res => {
              console.log(res)
              this.loading = false
              this.$notify({
                type: 'success',
                message: res.retMsg
              })
              this.bianjiVIsible = false
              this.seach()
            }).catch(() => {
              this.loading = false
            })
          }
        }
      }

      )
    },
    bianji(row) {
      console.log(row)
      getQuestionDetail({
        questionId: row.questionId
      }).then(res => {
        this.bianjiVIsible = true
        console.log(res)
        this.form = res.retData
        if (this.form.img.length > 0) {
          this.yezz = '1'
          this.fileList = [{
            url: this.form.img
          }]
        }
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
  .ps{
    font-size: 12px;
  }

</style>
