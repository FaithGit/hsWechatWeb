<template>
  <div class="testPaper">
    <!-- 条件栏 -->
    <div class="headClass">

      用户名称：
      <treeselect v-model="userIdShow" :multiple="false" :options="userlist" :normalizer="normalizer2"
        placeholder="请选择用户" class="seachInput" no-children-text="暂无数据">
        <label slot="option-label" slot-scope="{ node, labelClassName }" :class="labelClassName" :title="node.label">
          {{ node.label }}
        </label>
      </treeselect>
      证书名称：
      <treeselect v-model="certificateId" :multiple="false" :options="zhengshuList" :normalizer="normalizer"
        placeholder="请选择证书" class="seachInput" no-children-text="暂无数据">
        <label slot="option-label" slot-scope="{ node, labelClassName }" :class="labelClassName" :title="node.label">
          {{ node.label }}
        </label>
      </treeselect>
      证书状态：
      <el-select v-model="expireStatus" class="seachInput" clearable>
        <el-option label="正常" :value="0"></el-option>
        <el-option label="即将到期" :value="1"></el-option>
        <el-option label="已到期" :value="2"></el-option>
      </el-select>
      <el-button type="primary" @click="seach">搜索</el-button>
      <el-button type="primary" @click="addCom">新增用户证书</el-button>
      <el-button type="primary" @click="zsClick">证书管理</el-button>
    </div>

    <!-- 表格 -->
    <el-table v-loading="listLoading" :data="records" element-loading-text="加载中" border fit highlight-current-row
      style="margin-top:1.04vw" :span-method="arraySpanMethod" :row-class-name="tableRowClassName"
      height="calc(100vh - 84px - 60px - 40px - 32px - 1.04vw - 17px)">
      <el-table-column align="center" label="序号" width="95">
        <template slot-scope="scope">
          {{ scope.row.index+1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户名" prop="userName" width="95" />
      <el-table-column align="center" label="证书名称" prop="certificateName" />
      <el-table-column align="center" label="是否已上传证书">
        <template slot-scope="scope">
          <span :class="[scope.row.uploadStatus==0?'guoqi':'']">
            {{ scope.row.uploadStatus==1?'已上传':scope.row.uploadStatus==0?'未上传':'-' }}
          </span>

        </template>
      </el-table-column>
      <el-table-column align="center" label="到期时间">
        <template slot-scope="scope">
          <span :class="[scope.row.expireStatus==1?'jijiang':scope.row.expireStatus==2?'guoqi':'']">
            {{ scope.row.expireDate }}</span>

        </template>
      </el-table-column>

      <el-table-column align="center" label="附件">
        <template slot-scope="scope">

          <div>
            <viewer>
              <template v-for="item in scope.row.files">
                <img :src="item.url" alt="" srcset="" :title="item.name" style="width:100px;height:100px"
                  :key="item.fileId">
              </template>
            </viewer>
          </div>

        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="280">
        <template slot-scope="scope">
          <el-button v-if="scope.row.userCertificateId!=''" @click="edit(scope.row)">编辑</el-button>
          <el-button v-if="scope.row.userCertificateId!=''" type="danger" @click="remove(scope.row)">删除</el-button>
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
            placeholder="请选择用户" no-children-text="暂无数据">
            <label slot="option-label" slot-scope="{ node, labelClassName }" :class="labelClassName"
              :title="node.label">
              {{ node.label }}
            </label>
          </treeselect>
        </el-form-item>
        <el-form-item label="证书名称" prop="certificateId">
          <treeselect v-model="form.certificateId" :multiple="false" :options="zhengshuList" :normalizer="normalizer"
            placeholder="请选择证书" no-children-text="暂无数据">
            <label slot="option-label" slot-scope="{ node, labelClassName }" :class="labelClassName"
              :title="node.label">
              {{ node.label }}
            </label>
          </treeselect>
        </el-form-item>
        <el-form-item label="证书编号">
          <el-input v-model="form.userCertificateCode" placeholder="请填写证书编号" />
        </el-form-item>

        <el-form-item label="过期日期" prop="expireDate">
          <el-date-picker v-model="form.expireDate" type="date" placeholder="请选择过期日期" />
        </el-form-item>

        <el-form-item label="证书附件">
          (点击列表查看附件-限值图片格式)
          <el-upload action="#" accept=".jpg,.jpeg,.png" :on-change="handleChangeID" :on-remove="handleRemoveID"
            :on-preview="handlePreview" :auto-upload="false" :file-list="zhiweiList">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>

        <div style="text-align:center;margin-top:80px">
          <el-button @click="visible=false">取 消</el-button>
          <el-button v-if="visibleTitle=='新增用户证书'" type="primary" @click="sumbitCom">确 定</el-button>
          <el-button v-if="visibleTitle=='编辑用户证书'" type="primary" @click="editSubmit">更 改</el-button>
        </div>
      </el-form>
    </el-dialog>


    <el-dialog v-if="zsVisible" title="证书管理" :append-to-body="true" :visible="zsVisible" width="60%"
      :close-on-click-modal="false" @close="zsVisible=false">
      <certificate></certificate>
    </el-dialog>
  </div>
</template>

<script>
  // import the styles
  import Treeselect from '@riophae/vue-treeselect'
  // import the styles
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import axios from 'axios'
  import setting from '@/settings'
  import certificate from './component/certificate.vue'
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
  import {
    getToken
  } from '@/utils/auth'
  // import moment from 'moment'
  export default {
    name: 'UserCertificate',
    components: {
      Treeselect,
      certificate
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
        expireStatus: '',
        visibleTitle: '',
        comName: '',
        areaCode: null,
        status: '',
        visible: false,
        editVisible: false,
        listLoading: false,
        zsVisible: false,
        form: {},
        allyjList: [], // 全部药剂列表
        zhengshuList: [], // 全部药剂列表
        yaojiChoose: [], // 全部药剂列表
        userlist: [], // 全部药剂列表
        zhiweiList: [], // 全部药剂列表
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
      zsClick() { //打开证书管理
        this.zsVisible = true
      },
      handleChangeID(file, fileList) { // 身份附件上传
        var formData = new FormData()
        formData.append('file', file.raw)
        formData.append('type', 'certificate')
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
      listUserCertificatePage() {
        listUserCertificatePage({
          certificateId: this.certificateId || '',
          userId: this.userIdShow || '',
          expireStatus: this.expireStatus,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }).then(res => {
          console.log(res)

          var temp = res.retData.records
          var newArr = []
          var people = []
          var peopleNum = 0
          temp.forEach((e, index) => {
            peopleNum = 0
            if (e.certificates.length === 0) {
              newArr.push({
                userName: e.userName,
                certificateName: ' - ',
                expireDate: ' - ',
                uploadStatus: '',
                expireStatus: '',
                userCertificateId: '',
                files: [],
                index: index
              })
              people.push(1)
            } else {
              e.certificates.forEach(i => {
                peopleNum++
                // console.log(i)
                newArr.push({
                  userName: e.userName,
                  certificateName: i.certificateName,
                  expireDate: i.expireDate,
                  userCertificateId: i.userCertificateId,
                  uploadStatus: i.uploadStatus,
                  expireStatus: i.expireStatus,
                  files: i.files,
                  index: index
                })
              })
              people.push(peopleNum)
            }
          })

          let count = 1
          for (let i = 0; i < people.length; i++) {
            newArr[count - 1].people = people[i]
            count += people[i]
          }

          console.log(people)
          console.log(newArr)

          this.records = newArr
          this.total = res.retData.total
        })
      },
      // 表格合并方法
      arraySpanMethod({
        row,
        column,
        rowIndex,
        columnIndex
      }) {
        if (columnIndex === 0 || columnIndex === 1) {
          if (row.people) { // 如果有值,说明需要合并
            return [row.people, 1]
          } else return [0, 0]
        }
      },
      tableRowClassName({
        row,
        rowIndex
      }) {
        // console.log('row', row)
        if (row.index % 2 === 0) {
          return 'bkred'
        } else {
          return 'bkgreen'
        }
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
        this.zhiweiList = []
        getUserCertificate({
          userCertificateId: e.userCertificateId
        }).then(res => {
          console.log(res)
          this.visible = true
          this.form = res.retData
          this.zhiweiList = res.retData.files
          this.visibleTitle = '编辑用户证书'
        })
      },
      addCom(e) {
        this.visible = true
        this.form = {}
        this.visibleTitle = '新增用户证书'
        this.zhiweiList = []
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
              certificateId: this.form.certificateId,
              userId: this.form.userId,
              userCertificateCode: this.form.userCertificateCode,
              expireDate: moment(this.form.expireDate).format('YYYY-MM-DD'),
              files: _zhiweiList
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
            var _zhiweiList = []
            this.zhiweiList.forEach(e => {
              _zhiweiList.push({
                name: e.name,
                url: e.url
              })
            })
            const newObj = {
              id: this.form.id,
              certificateId: this.form.certificateId,
              userId: this.form.userId,
              userCertificateCode: this.form.userCertificateCode,
              expireDate: moment(this.form.expireDate).format('YYYY-MM-DD'),
              files: _zhiweiList
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

  .guoqi {
    color: red;
    font-weight: bold;
  }

  .jijiang {
    color: rgb(255, 136, 0);
    font-weight: bold;
  }

</style>
<style>
  .el-table .bkred {
    background: #ffffff;
  }

  .el-table .bkgreen {
    background: #fafafa
  }

</style>
