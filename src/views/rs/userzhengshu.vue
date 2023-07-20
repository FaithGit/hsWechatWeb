<template>
  <div class="testPaper">
    <!-- 条件栏 -->
    <div class="headClass">

      用户名称：
      <treeselect
        v-model="userIdShow"
        :multiple="false"
        :options="userlist"
        :normalizer="normalizer2"
        placeholder="请选择用户"
        class="seachInput"
        no-children-text="暂无数据"
      />
      证书名称：
      <treeselect
        v-model="certificateId"
        :multiple="false"
        :options="zhengshuList"
        :normalizer="normalizer"
        placeholder="请选择证书"
        class="seachInput"
        no-children-text="暂无数据"
      />
      <el-button type="primary" @click="seach">搜索</el-button>
      <el-button type="primary" @click="addCom">新增用户证书</el-button>
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
      <el-table-column align="center" label="用户名" prop="userName" />
      <el-table-column align="center" label="证书名称" prop="certificateName" />
      <el-table-column align="center" label="到期时间" prop="expireDate" />

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
        <el-form-item label="用户名称" prop="userId">
          <treeselect
            v-model="form.userId"
            :multiple="false"
            :options="userlist"
            :normalizer="normalizer2"
            placeholder="请选择用户"
            no-children-text="暂无数据"
          />
        </el-form-item>
        <el-form-item label="证书名称" prop="certificateId">
          <treeselect
            v-model="form.certificateId"
            :multiple="false"
            :options="zhengshuList"
            :normalizer="normalizer"
            placeholder="请选择证书"
            no-children-text="暂无数据"
          />
        </el-form-item>

        <el-form-item label="过期日期" prop="expireDate">
          <el-date-picker v-model="form.expireDate" type="date" placeholder="请选择过期日期" />
        </el-form-item>

        <div style="text-align:center;margin-top:80px">
          <el-button @click="visible=false">取 消</el-button>
          <el-button v-if="visibleTitle=='新增用户证书'" type="primary" @click="sumbitCom">确 定</el-button>
          <el-button v-if="visibleTitle=='编辑用户证书'" type="primary" @click="editSubmit">更 改</el-button>
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
  deleteUserCertificate,
  updateUserCertificate,
  listCertificateSel,
  listUser,
  listUserCertificatePage,
  addUserCertificate,
  getUserCertificate
} from '@/api/table'
import {
  mapGetters
} from 'vuex'
import moment from 'moment'
// import moment from 'moment'
export default {
  name: 'Userzhengshu',
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
      certificateName: '',
      visibleTitle: '',
      comName: '',
      areaCode: null,
      status: '',
      visible: false,
      editVisible: false,
      listLoading: false,
      form: {},
      allyjList: [], // 全部药剂列表
      zhengshuList: [], // 全部药剂列表
      yaojiChoose: [], // 全部药剂列表
      userlist: [], // 全部药剂列表
      rules: {
        certificateId: [{
          required: true,
          message: '请选择证书名称',
          trigger: 'blur'
        }],
        userId: [{
          required: true,
          message: '请选择用户',
          trigger: 'change'
        }],
        expireDate: [{
          required: true,
          message: '请选择到期时间',
          trigger: 'change'
        }]
      },
      normalizer(node) {
        // if (!node.children.length) delete node.children
        return {
          id: node.certificateId,
          label: node.certificateName,
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
    this.listCertificateSel()
    this.listUser()

    if (!this.$route.params.pmId) {
      this.listUserCertificatePage()
    }
  },
  activated() {
    if (this.$route.params.pmId) {
      console.log('执行吗')
      this.userIdShow = this.$route.params.pmId
      this.listUserCertificatePage()
    }
  },
  methods: {
    listCertificateSel() {
      listCertificateSel({}).then(res => {
        console.log(res.retData)
        this.zhengshuList = res.retData
      })
    },
    listUser() {
      listUser({}).then(res => {
        console.log(res.retData)
        this.userlist = res.retData
      })
    },
    listUserCertificatePage() {
      listUserCertificatePage({
        certificateId: this.certificateId || '',
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
      this.listUserCertificatePage()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.listUserCertificatePage()
    },
    seach() {
      this.pageIndex = 1
      this.listUserCertificatePage()
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
      this.$confirm('此操作将永久删除该用户证书, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUserCertificate({
          userCertificateId: e.userCertificateId
        }).then(res => {
          this.$notify({
            type: 'success',
            message: res.retMsg
          })
          this.listUserCertificatePage()
        })
      })
    },
    edit(e) {
      getUserCertificate({
        userCertificateId: e.userCertificateId
      }).then(res => {
        console.log(res)
        this.visible = true
        this.form = res.retData
        this.visibleTitle = '编辑用户证书'
      })
    },
    addCom(e) {
      this.visible = true
      this.form = {}
      this.visibleTitle = '新增用户证书'
    },
    sumbitCom() {
      this.$refs.form1.validate((valid) => {
        if (valid) {
          const newObj = {
            certificateId: this.form.certificateId,
            userId: this.form.userId,
            expireDate: moment(this.form.expireDate).format('YYYY-MM-DD')
          }
          addUserCertificate(newObj).then(res => {
            console.log(res)
            this.$notify({
              type: 'success',
              message: res.retMsg
            })
            this.visible = false
            this.listUserCertificatePage()
          })
        }
      })
    },
    editSubmit() {
      this.$refs.form1.validate((valid) => {
        if (valid) {
          const newObj = {
            id: this.form.id,
            certificateId: this.form.certificateId,
            userId: this.form.userId,
            expireDate: moment(this.form.expireDate).format('YYYY-MM-DD')
          }
          updateUserCertificate(newObj).then(res => {
            console.log(res)
            this.$notify({
              type: 'success',
              message: res.retMsg
            })
            this.visible = false
            this.listUserCertificatePage()
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
