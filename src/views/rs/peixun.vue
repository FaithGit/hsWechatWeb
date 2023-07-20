<template>
  <div class="testPaper">
    <!-- 条件栏 -->
    <div class="headClass">
      培训主题：
      <el-input v-model="trainingTheme" class="seachInput" placeholder="请选择输入关键字" clearable />
      <el-button type="primary" @click="seach">搜索</el-button>
      <el-button type="primary" @click="addCom">新增培训</el-button>
    </div>

    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="records"
      element-loading-text="加载中"
      border
      fit
      highlight-current-row
      stripe
      style="margin-top:1.04vw"
    >
      <el-table-column align="center" label="#" width="95">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="培训主题" prop="trainingTheme" />
      <el-table-column align="center" label="培训内容" prop="trainingContent" />
      <el-table-column align="center" label="培训时间" prop="trainingTime" />
      <el-table-column align="center" label="操作" width="280">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)">编辑</el-button>
          <el-button type="danger" @click="remove(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="buttonPagination">
      <el-pagination
        :current-page="pageIndex"
        :page-sizes="[10,20,30,40,50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog
      v-if="visible"
      :title="visibleTitle"
      :append-to-body="true"
      :visible="visible"
      width="40%"
      :close-on-click-modal="false"
      @close="visible=false"
    >
      <el-form ref="form1" :model="form" label-width="140px" :rules="rules">
        <el-form-item label="培训主题" prop="trainingTheme">
          <el-input v-model="form.trainingTheme" placeholder="请输入培训主题" />
        </el-form-item>
        <el-form-item label="培训内容" prop="trainingContent">
          <el-input v-model="form.trainingContent" type="textarea" :rows="2" placeholder="请输入培训内容" />
        </el-form-item>
        <el-form-item label="培训日期" prop="trainingTime">
          <el-date-picker v-model="form.trainingTime" type="datetime" placeholder="请选择培训日期" />
        </el-form-item>
        <div style="text-align:center;margin-top:80px">
          <el-button @click="visible=false">取 消</el-button>
          <el-button v-if="visibleTitle=='新增培训'" type="primary" @click="sumbitCom">确 定</el-button>
          <el-button v-else type="primary" @click="editSubmit">更 改</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
// import the styles
import {
  updateTraining,
  addTraining,
  deleteTraining,
  getTraining,
  listTrainingPage
} from '@/api/table'
import {
  mapGetters
} from 'vuex'
import moment from 'moment'
// import moment from 'moment'
export default {
  name: 'Peixun',
  data() {
    return {
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      records: [],
      allAreacode: [],
      certificateName: '',
      trainingTheme: '',
      visibleTitle: '',
      comName: '',
      areaCode: null,
      status: '',
      visible: false,
      editVisible: false,
      listLoading: false,
      form: {},
      allyjList: [], // 全部药剂列表
      yaojiChoose: [], // 全部药剂列表
      rules: {
        trainingTheme: [{
          required: true,
          message: '请输入培训主题',
          trigger: 'blur'
        }],
        trainingContent: [{
          required: true,
          message: '请输入培训内容',
          trigger: 'blur'
        }],
        trainingTime: [{
          required: true,
          message: '请选择培训时间',
          trigger: 'blur'
        }]
      },
      normalizer(node) {
        // if (!node.children.length) delete node.children
        return {
          id: node.value,
          label: node.label,
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
    this.listTrainingPage()
  },
  methods: {
    listTrainingPage() {
      listTrainingPage({
        trainingTheme: this.trainingTheme,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }).then(res => {
        console.log(res)
        this.records = res.retData.records
        this.total = res.retData.total
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.listTrainingPage()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.listTrainingPage()
    },
    seach() {
      this.pageIndex = 1
      this.listTrainingPage()
    },
    editShiji(e) {
      this.editVisible = true
      this.form = Object.assign({}, e)
      if (this.form.areaCode === 0) {
        this.form.areaCode = null
      }
      console.log('🚀 ~ editShiji ~   this.form:', this.form)
    },
    remove(e) {
      this.$confirm('此操作将永久删除该培训, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteTraining({
          trainingId: e.trainingId
        }).then(res => {
          this.$notify({
            type: 'success',
            message: res.retMsg
          })
          this.listTrainingPage()
        })
      })
    },
    edit(e) {
      getTraining({
        trainingId: e.trainingId
      }).then(res => {
        console.log(res)
        this.visible = true
        this.form = res.retData
        this.visibleTitle = '编辑培训'
      })
    },
    addCom(e) {
      this.visible = true
      this.form = {

      }
      this.visibleTitle = '新增培训'
    },
    sumbitCom() {
      this.$refs.form1.validate((valid) => {
        if (valid) {
          const newObj = {
            trainingTheme: this.form.trainingTheme,
            trainingContent: this.form.trainingContent,
            trainingTime: moment(this.form.trainingTime).format('YYYY-MM-DD HH:mm:ss')
          }
          addTraining(newObj).then(res => {
            console.log(res)
            this.$notify({
              type: 'success',
              message: res.retMsg
            })
            this.visible = false
            this.listTrainingPage()
          })
        }
      })
    },
    editSubmit() {
      this.$refs.form1.validate((valid) => {
        if (valid) {
          var newObj = {
            id: this.form.id,
            trainingTheme: this.form.trainingTheme,
            trainingContent: this.form.trainingContent,
            trainingTime: moment(this.form.trainingTime).format('YYYY-MM-DD HH:mm:ss')
          }
          updateTraining(newObj).then(res => {
            console.log(res)
            this.$notify({
              type: 'success',
              message: res.retMsg
            })
            this.visible = false
            this.listTrainingPage()
          })
        }
      })
    },
    gotoPoint(e) {
      console.log(e)
      this.$router.push({
        name: 'Ponit',
        params: {
          companyId: e.companyId
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
