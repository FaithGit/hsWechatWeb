<template>
  <div class="testPaper">
    <!-- 条件栏 -->
    <div class="headClass">
      用户名称：
      <treeselect v-model="userIdSeach" :multiple="false" :disable-branch-nodes="true" :options="userlist"
        :normalizer="normalizer2" placeholder="请选择用户" class="seachInput" no-children-text="暂无数据" />

      培训主题：
      <el-input v-model="trainingTheme" class="seachInput" placeholder="请选择输入关键字" clearable />
      <el-button type="primary" @click="seach">搜索</el-button>
      <el-button type="primary" @click="addCom">新增培训</el-button>
    </div>

    <!-- 表格 -->
    <el-table v-loading="listLoading" :data="records" element-loading-text="加载中" border fit highlight-current-row stripe
      style="margin-top:1.04vw">
      <el-table-column align="center" label="#" width="95">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="培训主题" prop="trainingTheme" />
      <el-table-column align="center" label="培训类型" prop="trainingTypeName" width="100" />
      <el-table-column align="center" label="培训内容" prop="trainingContent" />
      <el-table-column align="center" label="培训时间" prop="trainingTime" width="180" />
      <el-table-column align="center" label="受训人" prop="trainees" />
      <el-table-column align="center" label="关联签到">
        <template slot-scope="scope">
          {{ computedNull(scope.row.signInTheme) }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="280">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)">编辑</el-button>
          <el-button type="danger" @click="remove(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="buttonPagination">
      <el-pagination :current-page="pageIndex" :page-sizes="[10,20,30,40,50]" :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>

    <el-dialog v-if="visible" :title="visibleTitle" :append-to-body="true" :visible="visible" width="40%"
      :close-on-click-modal="false" @close="visible=false">
      <el-form ref="form1" :model="form" label-width="140px" :rules="rules">
        <el-form-item label="培训主题" prop="trainingTheme">
          <el-input v-model="form.trainingTheme" placeholder="请输入培训主题" />
        </el-form-item>
        <el-form-item label="培训人" prop="trainer">
          <el-input v-model="form.trainer" placeholder="请输入培训人" />
        </el-form-item>
        <el-form-item label="培训类型" prop="trainingType">
          <el-select v-model="form.trainingType" placeholder="请选择培训类型">
            <el-option label="技能培训" :value="1" />
            <el-option label="安全培训" :value="2" />
            <el-option label="入职培训" :value="3" />
            <el-option label="其他培训" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="培训内容" prop="trainingContent">
          <el-input v-model="form.trainingContent" type="textarea" :rows="2" placeholder="请输入培训内容" />
        </el-form-item>
        <el-form-item label="培训开始日期" prop="trainingStartTime">
          <el-date-picker v-model="form.trainingStartTime" type="date" placeholder="请选择培训开始日期" />
        </el-form-item>
        <el-form-item label="培训结束日期" prop="trainingEndTime">
          <el-date-picker v-model="form.trainingEndTime" type="date" placeholder="请选择培训结束日期" />
        </el-form-item>

        <el-form-item label="受训人" prop="trainees">
          <treeselect v-model="form.trainees" :multiple="true" :options="userlist" :normalizer="normalizer2"
            placeholder="请选择受训人" no-children-text="暂无数据" :value-consists-of="'LEAF_PRIORITY'" />
        </el-form-item>

        <el-form-item label="关联签到">
          <treeselect :disabled="sgFalg" v-model="form.signInId" :multiple="false" :options="qiandaoList"
            :normalizer="normalizer3" placeholder="请选择关联签到" no-children-text="暂无数据" @select="changeQD" />
        </el-form-item>

        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" />
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
    listTrainingPage,
    listUserTree,
    listSignInPage
  } from '@/api/table'

  // import the styles
  import Treeselect from '@riophae/vue-treeselect'
  // import the styles
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import {
    mapGetters
  } from 'vuex'
  import moment from 'moment'
  // import moment from 'moment'
  export default {
    name: 'Training',
    components: {
      Treeselect
    },
    data() {
      return {
        pageIndex: 1,
        pageSize: 10,
        total: 0,
        records: [],
        allAreacode: [],
        certificateName: '',
        userIdSeach: null,
        trainingTheme: '',
        visibleTitle: '',
        comName: '',
        areaCode: null,
        status: '',
        visible: false,
        sgFalg: false,
        editVisible: false,
        listLoading: false,
        form: {},
        allyjList: [], // 全部药剂列表
        yaojiChoose: [], // 全部药剂列表
        userlist: [], // 全部药剂列表
        qiandaoList: [], // 全部药剂列表
        rules: {
          trainingType: [{
            required: true,
            message: '请选择培训类型',
            trigger: 'change'
          }],
          trainer: [{
            required: true,
            message: '请选择培训人',
            trigger: 'blur'
          }],
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
          trainingStartTime: [{
            required: true,
            message: '请选择培训开始时间',
            trigger: 'blur'
          }],
          trainingEndTime: [{
            required: true,
            message: '请选择培训结束时间',
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
        },
        normalizer2(node) {
          // if (!node.children.length) delete node.children
          return {
            id: node.id,
            label: node.label,
            children: node.children && node.children.length ? node.children : 0
          }
        },
        normalizer3(node) {
          // if (!node.children.length) delete node.children
          return {
            id: node.signInId,
            label: node.theme,
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
    activated() {
      if (this.$route.params.pmId) {
        console.log('执行吗')
        this.userIdSeach = this.$route.params.pmId
        this.listTrainingPage()
      }
    },
    mounted() {
      this.listTrainingPage()
      this.listUserTree()
      this.listSignInPage()
    },
    methods: {
      changeQD(e) {
        // console.log(e.userIds)
        var a = e.userIds

        var b = this.form.trainees

        var f = a.concat(b.filter(function (v) {
          return !(a.indexOf(v) > -1)
        }));
        console.log("a", a)
        console.log("b", b)
        console.log("f", f)
        this.form.trainees = f
      },
      listSignInPage() {
        listSignInPage({
          userId: this.userId,
          signInPermission: 1,
          theme: this.theme,
          pageIndex: 1,
          pageSize: 999
        }).then(res => {
          this.qiandaoList = res.retData.records
        })
      },
      listUserTree() { // 试卷列表
        listUserTree({}).then(res => {
          console.log(res)
          this.userlist = res.retData
        })
      },
      listTrainingPage() {
        listTrainingPage({
          userId: this.userIdSeach,
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
          if (this.form.signInId === null) {
            this.sgFalg = false
          } else {
            this.sgFalg = true
          }
          this.visibleTitle = '编辑培训'
        })
      },
      addCom(e) {
        this.visible = true
        this.form = {
          trainees: []
        }
        this.visibleTitle = '新增培训'
      },
      sumbitCom() {
        if (moment(this.form.trainingStartTime) - moment(this.form.trainingEndTime) > 0) {
          console.log('开始时间不能大于结束时间', moment(this.form.trainingStartTime) - moment(this.form.trainingEndTime))
          this.$notify.warning('开始时间不能大于结束时间')
          return
        }

        this.$refs.form1.validate((valid) => {
          if (valid) {
            const newObj = {
              trainer: this.form.trainer,
              trainingTheme: this.form.trainingTheme,
              trainingContent: this.form.trainingContent,
              trainingType: this.form.trainingType,
              trainingStartTime: moment(this.form.trainingStartTime).format('YYYY-MM-DD'),
              trainingEndTime: moment(this.form.trainingEndTime).format('YYYY-MM-DD'),
              remark: this.form.remark,
              signInId: this.form.signInId || '',
              trainees: this.form.trainees
            }
            console.log(newObj)
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
        if (moment(this.form.trainingStartTime) - moment(this.form.trainingEndTime) > 0) {
          console.log('开始时间不能大于结束时间', moment(this.form.trainingStartTime) - moment(this.form.trainingEndTime))
          this.$notify.warning('开始时间不能大于结束时间')
          return
        }
        this.$refs.form1.validate((valid) => {
          if (valid) {
            var newObj = {
              id: this.form.id,
              trainer: this.form.trainer,
              trainees: this.form.trainees,
              trainingTheme: this.form.trainingTheme,
              trainingContent: this.form.trainingContent,
              trainingType: this.form.trainingType,
              trainingStartTime: moment(this.form.trainingStartTime).format('YYYY-MM-DD'),
              trainingEndTime: moment(this.form.trainingEndTime).format('YYYY-MM-DD'),
              signInId: this.form.signInId || '',
              remark: this.form.remark
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
      },
      computedNull(val) {
        if (val === undefined || val === null || val === '' || val === ' ') {
          return '-'
        } else {
          return val
        }
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
