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
      <el-button type="primary" @click="seach">搜索</el-button>
      <el-button type="primary" @click="addCom">新增职位变迁</el-button>
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
      <el-table-column align="center" label="旧职位" prop="oldJob" />
      <el-table-column align="center" label="新职位" prop="newJob" />
      <el-table-column align="center" label="变更时间" prop="operateTime" />

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
        <el-form-item label="旧职位" prop="oldJob">
          <el-input v-model="form.oldJob" placeholder="请输入旧职位" />
        </el-form-item>
        <el-form-item label="新职位" prop="newJob">
          <el-input v-model="form.newJob" placeholder="请输入新职位" />
        </el-form-item>
        <el-form-item label="变更时间" prop="operateTime">
          <el-date-picker v-model="form.operateTime" type="datetime" placeholder="请选择变更时间" />
        </el-form-item>
        <el-form-item label="考核记录文件">
          (点击列表查看附件)
          <el-upload
            action="#"
            :on-change="handleChangeID"
            :on-remove="handleRemoveID"
            :on-preview="handlePreview"
            :auto-upload="false"
            :file-list="zhiweiList"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>

        <div style="text-align:center;margin-top:80px">
          <el-button @click="visible=false">取 消</el-button>
          <el-button v-if="visibleTitle=='新增职位变迁'" type="primary" @click="sumbitCom">确 定</el-button>
          <el-button v-if="visibleTitle=='编辑职位变迁'" type="primary" @click="editSubmit">更 改</el-button>
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
  deleteJobChange,
  updateJobChange,
  listCertificateSel,
  listUser,
  listJobChangePage,
  addJobChange,
  getJobChangeDetail
} from '@/api/table'
import {
  mapGetters
} from 'vuex'
import axios from 'axios'
import setting from '@/settings'
import moment from 'moment'
import {
  getToken
} from '@/utils/auth'
// import moment from 'moment'
export default {
  name: 'Zhiwei',
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
      rewardPunishType: '',
      visibleTitle: '',
      comName: '',
      areaCode: null,
      status: '',
      visible: false,
      editVisible: false,
      listLoading: false,
      form: {},
      allyjList: [], // 全部药剂列表
      zhiweiList: [], // 全部药剂列表
      zhengshuList: [], // 全部药剂列表
      yaojiChoose: [], // 全部药剂列表
      userlist: [], // 全部药剂列表
      rewardPunishTypeList: [{
        label: '奖励',
        value: 1
      }, {
        label: '惩罚',
        value: 2
      }], // 全部药剂列表
      rules: {
        userId: [{
          required: true,
          message: '请选择用户',
          trigger: 'change'
        }],
        oldJob: [{
          required: true,
          message: '请输入旧职位',
          trigger: 'blur'
        }],
        newJob: [{
          required: true,
          message: '请输入新职位',
          trigger: 'blur'
        }],
        operateTime: [{
          required: true,
          message: '请输入变更时间',
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
    // this.listJobChangePage()
    this.listUser()
    if (!this.$route.params.pmId) {
      this.listJobChangePage()
    }
  },
  activated() {
    if (this.$route.params.pmId) {
      console.log('执行吗')
      this.userIdShow = this.$route.params.pmId
      this.listJobChangePage()
    }
  },
  methods: {
    handleChangeID(file, fileList) { // 身份附件上传
      var formData = new FormData()
      formData.append('file', file.raw)
      formData.append('type', 'education')
      axios.post(setting.baseUrl + '/sysSup/fileConvert', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'token': getToken()
        }
      })
        .then(res => {
          console.log(res.data)
          this.zhiweiList.push(res.data.retData)
        })
    },
    handleRemoveID(file, fileList) { // 身份附件删除
      console.log(file, fileList)
      this.zhiweiList = fileList
    },
    handlePreview(file) { // 预览
      console.log(file)
      window.open(file.url)
    },
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
    listJobChangePage() {
      listJobChangePage({
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
      this.listJobChangePage()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.listJobChangePage()
    },
    seach() {
      this.pageIndex = 1
      this.listJobChangePage()
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
      this.$confirm('此操作将永久删除该条职位变迁, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteJobChange({
          jobChangeId: e.jobChangeId
        }).then(res => {
          this.$notify({
            type: 'success',
            message: res.retMsg
          })
          this.listJobChangePage()
        })
      })
    },
    edit(e) {
      getJobChangeDetail({
        jobChangeId: e.jobChangeId
      }).then(res => {
        console.log(res)
        const {
          retData
        } = res
        this.visible = true
        this.form = res.retData
        this.form = {
          jobChangeId: retData.jobChangeId,
          newJob: retData.newJob,
          oldJob: retData.oldJob,
          operateTime: retData.operateTime,
          userId: retData.userId
        }
        this.zhiweiList = retData.files
        this.visibleTitle = '编辑职位变迁'
      })
    },
    addCom(e) {
      this.visible = true
      this.form = {}
      this.visibleTitle = '新增职位变迁'
    },
    sumbitCom() {
      this.$refs.form1.validate((valid) => {
        if (valid) {
          var _zhiweiList = []
          this.zhiweiList.forEach(e => {
            _zhiweiList.push({
              name: e.name,
              url: e.url
            })
          })
          const newObj = {
            operateUserId: this.userId,
            userId: this.form.userId,
            oldJob: this.form.oldJob,
            newJob: this.form.newJob,
            operateTime: moment(this.form.operateTime).format('YYYY-MM-DD HH:mm:ss'),
            rewardPunishContent: this.form.rewardPunishContent,
            files: _zhiweiList
          }

          addJobChange(newObj).then(res => {
            console.log(res)
            this.$notify({
              type: 'success',
              message: res.retMsg
            })
            this.visible = false
            this.listJobChangePage()
          })
        }
      })
    },
    editSubmit() {
      this.$refs.form1.validate((valid) => {
        if (valid) {
          var _zhiweiList = []
          this.zhiweiList.forEach(e => {
            _zhiweiList.push({
              name: e.name,
              url: e.url
            })
          })
          const newObj = {
            operateUserId: this.userId,
            jobChangeId: this.form.jobChangeId,
            userId: this.form.userId,
            oldJob: this.form.oldJob,
            newJob: this.form.newJob,
            operateTime: moment(this.form.operateTime).format('YYYY-MM-DD HH:mm:ss'),
            rewardPunishContent: this.form.rewardPunishContent,
            files: _zhiweiList
          }
          updateJobChange(newObj).then(res => {
            console.log(res)
            this.$notify({
              type: 'success',
              message: res.retMsg
            })
            this.visible = false
            this.listJobChangePage()
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
