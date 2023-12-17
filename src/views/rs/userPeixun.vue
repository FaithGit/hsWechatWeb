<template>
  <div class="testPaper">
    <!-- 条件栏 -->
    <div class="headClass">

      用户名称：
      <treeselect v-model="userIdShow" :multiple="false" :options="userlist" :normalizer="normalizer2"
        placeholder="请选择用户" class="seachInput" no-children-text="暂无数据" />
      培训主题：
      <treeselect v-model="trainingId" :multiple="false" :options="peixunList" :normalizer="normalizer"
        placeholder="请选择培训主题" class="seachInput" no-children-text="暂无数据" />
      <el-button type="primary" @click="seach">搜索</el-button>
      <el-button type="primary" @click="addCom">新增用户培训</el-button>
    </div>

    <!-- 表格 -->
    <el-table v-loading="listLoading" :data="records" element-loading-text="加载中" border fit highlight-current-row stripe
      style="margin-top:1.04vw" height="calc(100vh - 84px - 60px - 40px - 32px - 1.04vw - 17px)">
      <el-table-column align="center" label="#" width="95">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户名" prop="userName" />
      <el-table-column align="center" label="培训主题" prop="trainingTheme" />
      <el-table-column align="center" label="考核分数" prop="trainingScore" />
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
      <el-pagination :current-page="pageIndex" :page-sizes="[10,20,30,40,50]" :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>

    <el-dialog v-if="visible" :title="visibleTitle" :append-to-body="true" :visible="visible" width="40%"
      :close-on-click-modal="false" @close="visible=false">
      <el-form ref="form1" :model="form" label-width="140px" :rules="rules">
        <el-form-item label="用户名称" prop="userId">
          <treeselect v-model="form.userId" :multiple="false" :options="userlist" :normalizer="normalizer2"
            placeholder="请选择用户" no-children-text="暂无数据" :disabled="visibleTitle!='新增用户培训'" />
        </el-form-item>
        <el-form-item label="培训主题" prop="trainingId">
          <treeselect v-model="form.trainingId" :multiple="false" :options="peixunList" :normalizer="normalizer"
            placeholder="请选择培训主题" no-children-text="暂无数据" />
        </el-form-item>

        <el-form-item label="考核成绩" prop="trainingScore">
          <el-input-number v-model="form.trainingScore" :min="0" />
        </el-form-item>

        <div style="text-align:center;margin-top:80px">
          <el-button @click="visible=false">取 消</el-button>
          <el-button v-if="visibleTitle=='新增用户培训'" type="primary" @click="sumbitCom">确 定</el-button>
          <el-button v-else type="primary" @click="editSubmit">更 改</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  // import the styles
  import Treeselect from '@riophae/vue-treeselect'
  // import the styles
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import {
    deleteUserTraining,
    updateUserTraining,
    listTrainingSel,
    listUser,
    listUserTrainingPage,
    addUserTraining,
    getUserTraining
  } from '@/api/table'
  import {
    mapGetters
  } from 'vuex'
  // import moment from 'moment'
  // import moment from 'moment'
  export default {
    name: 'UserPeixun',
    components: {
      Treeselect
    },
    data() {
      return {
        pageIndex: 1,
        pageSize: 10,
        total: 0,
        certificateId: null,
        userIdShow: null,
        records: [],
        allAreacode: [],
        trainingId: null,
        visibleTitle: '',
        comName: '',
        areaCode: null,
        status: '',
        visible: false,
        editVisible: false,
        listLoading: false,
        form: {},
        allyjList: [], // 全部药剂列表
        peixunList: [], // 全部药剂列表
        yaojiChoose: [], // 全部药剂列表
        userlist: [], // 全部药剂列表
        rules: {
          trainingId: [{
            required: true,
            message: '请选择培训主题',
            trigger: 'blur'
          }],
          userId: [{
            required: true,
            message: '请选择用户',
            trigger: 'change'
          }]
        },
        normalizer(node) {
          // if (!node.children.length) delete node.children
          return {
            id: node.trainingId,
            label: node.trainingTheme,
            children: node.children && node.children.length ? node.children : 0
          }
        },
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
      this.listTrainingSel()
      this.listUser()
      if (!this.$route.params.pmId) {
        this.listUserTrainingPage()
      }
    },
    activated() {
      if (this.$route.params.pmId) {
        console.log('执行吗')
        this.userIdShow = this.$route.params.pmId
        this.listUserTrainingPage()
      }
    },
    methods: {
      listTrainingSel() {
        listTrainingSel({}).then(res => {
          console.log(res.retData)
          this.peixunList = res.retData
        })
      },
      listUser() {
        listUser({}).then(res => {
          console.log(res.retData)
          this.userlist = res.retData
        })
      },
      listUserTrainingPage() {
        listUserTrainingPage({
          trainingId: this.trainingId || '',
          userId: this.userIdShow || '',
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
        this.listUserTrainingPage()
      },
      handleCurrentChange(val) {
        this.pageIndex = val
        this.listUserTrainingPage()
      },
      seach() {
        this.pageIndex = 1
        this.listUserTrainingPage()
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
        console.log(e)
        this.$confirm('此操作将永久删除该用户培训记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteUserTraining({
            userTrainingId: e.userTrainingId
          }).then(res => {
            this.$notify({
              type: 'success',
              message: res.retMsg
            })
            this.listUserTrainingPage()
          })
        })
      },
      edit(e) {
        getUserTraining({
          userTrainingId: e.userTrainingId
        }).then(res => {
          console.log(res)
          this.visible = true
          this.form = res.retData
          this.visibleTitle = '编辑用户培训'
        })
      },
      addCom(e) {
        this.visible = true
        this.form = {
          trainingScore: 0
        }
        this.visibleTitle = '新增用户培训'
      },
      sumbitCom() {
        this.$refs.form1.validate((valid) => {
          if (valid) {
            addUserTraining(this.form).then(res => {
              console.log(res)
              this.$notify({
                type: 'success',
                message: res.retMsg
              })
              this.visible = false
              this.listUserTrainingPage()
            })
          }
        })
      },
      editSubmit() {
        this.$refs.form1.validate((valid) => {
          if (valid) {
            updateUserTraining(this.form).then(res => {
              console.log(res)
              this.$notify({
                type: 'success',
                message: res.retMsg
              })
              this.visible = false
              this.listUserTrainingPage()
            })
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
