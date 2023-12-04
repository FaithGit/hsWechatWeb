<template>
  <div class="testPaper">
    <!-- 条件栏 -->
    <div class="headClass">
      用户姓名：
      <el-input v-model="userName" class="seachInput" placeholder="请选择输入关键字" clearable />
      部门：
      <el-select v-model="departmentId" class="seachInput" clearable>
        <el-option v-for="item in departmentList" :key="item.departmentId" :label="item.departmentName"
          :value="item.departmentId" />
      </el-select>
      <el-button type="primary" @click="seach">搜索</el-button>
      <el-button type="primary" @click="addPeople">新增用户</el-button>
    </div>

    <!-- 表格 -->
    <el-table v-loading="listLoading" :data="records" element-loading-text="加载中" border fit stripe highlight-current-row
      style="margin-top:1.04vw">
      <el-table-column align="center" label="#" width="95">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="姓名" prop="userName" />
      <el-table-column align="center" label="部门名称">
        <template slot-scope="scope">
          {{ computedNull(scope.row.departmentName) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色">
        <template slot-scope="scope">
          {{ computedNull(scope.row.roleName) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="联系方式">
        <template slot-scope="scope">
          {{ computedNull(scope.row.telephone) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="学历">
        <template slot-scope="scope">
          {{ computedNull(scope.row.education) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="身份证">
        <template slot-scope="scope">
          {{ computedNull(scope.row.idnum) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="出生年月">
        <template slot-scope="scope">
          {{ computedNull(scope.row.birth) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="紧急联系人">
        <template slot-scope="scope">
          {{ computedNull(scope.row.emergencyContact) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="紧急联系方式">
        <template slot-scope="scope">
          {{ computedNull(scope.row.emergencyMobile) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="入职时间">
        <template slot-scope="scope">
          {{ computedNull(scope.row.entryTime) }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="540">
        <template slot-scope="scope">
          <el-button @click="gotoZs(scope.row)">证书管理</el-button>
          <el-button @click="gotopx(scope.row)">培训管理</el-button>
          <el-button @click="gotozw(scope.row)">职位变迁</el-button>
          <el-button @click="gotojc(scope.row)">奖惩记录</el-button>
          <el-button type="success" @click="edit(scope.row)">编辑</el-button>
          <!-- <el-button @click="remove(scope.row)">删除</el-button> -->
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
        <el-form-item label="用户角色" prop="roleId">
          <el-select v-model="form.roleId">
            <el-option v-for="item in roleList" :key="item.roleId" :label="item.roleName" :value="item.roleId" />
          </el-select>
        </el-form-item>
        <el-form-item label="姓名" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="联系方式" prop="telephone">
          <el-input v-model="form.telephone" placeholder="请输入联系方式" />
        </el-form-item>
        <el-form-item label="学历" prop="education">
          <el-input v-model="form.education" placeholder="请输入学历" />
        </el-form-item>
        <el-form-item label="学历附件" prop="educationFiles">
          (点击列表查看附件)
          <el-upload action="#" :on-change="handleChange" :on-remove="handleRemove" :on-preview="handlePreview"
            :auto-upload="false" :file-list="xueliList">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>

        <el-form-item label="身份证" prop="idnum">
          <el-input v-model="form.idnum" placeholder="请输入身份证" />
        </el-form-item>
        <el-form-item label="身份证附件" prop="educationFiles">
          (点击列表查看附件)
          <el-upload action="#" :on-change="handleChangeID" :on-remove="handleRemoveID" :on-preview="handlePreview"
            :auto-upload="false" :file-list="IDList">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="出生年月" prop="birth">
          <el-date-picker v-model="form.birth" type="date" placeholder="请选择出生年月" />
        </el-form-item>
        <el-form-item label="紧急联系人" prop="emergencyContact">
          <el-input v-model="form.emergencyContact" placeholder="请输入紧急联系人" />
        </el-form-item>
        <el-form-item label="紧急联系方式" prop="emergencyMobile">
          <el-input v-model="form.emergencyMobile" placeholder="请输入紧急联系方式" />
        </el-form-item>
        <el-form-item label="入职时间" prop="entryTime">
          <!-- <el-input v-model="form.entryTime" placeholder="请输入入职时间" /> -->
          <el-date-picker v-model="form.entryTime" type="date" placeholder="请选择入职日期" />
        </el-form-item>

        <el-form-item label="人员照片" prop="educationFiles">
          (点击列表查看附件)
          <el-upload action="#" :on-change="handleChangePhoto" :on-remove="handleRemovePhoto"
            :on-preview="handlePreview" :auto-upload="false" :file-list="userImages">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>

        <div style="text-align:center;margin-top:80px">
          <el-button @click="visible=false">取 消</el-button>
          <el-button v-if="visibleTitle=='新增用户'" type="primary" :loading="btnLoding" @click="sumbitPeople">确 定
          </el-button>
          <el-button v-else type="primary" :loading="btnLoding" @click="editPeople">更 新
          </el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {
    moblie
  } from '@/utils/asyncValidator'

  import {
    listUserInfoPage,
    listDepartment,
    listRoleSel,
    addUserInfo,
    getUserInfoDetail,
    updateUserInfo
  } from '@/api/table'
  import {
    mapGetters
  } from 'vuex'
  import axios from 'axios'
  import setting from '@/settings'
  import {
    getToken
  } from '@/utils/auth'

  import moment from 'moment'

  export default {
    name: 'Rygk',
    data() {
      return {
        pageIndex: 1,
        pageSize: 10,
        total: 0,
        records: [],
        userName: '',
        departmentId: '',
        form: {},
        departmentList: [], // 全部药剂列表
        roleList: [],
        visibleTitle: '',
        xueliList: [],
        IDList: [],
        userImages: [],
        comName: '',
        areaCode: null,
        status: '',
        visible: false,
        editVisible: false,
        listLoading: false,
        btnLoding: false,

        rules: {
          userName: [{
            required: true,
            message: '请输入姓名',
            trigger: 'blur'
          }],
          telephone: [{
            required: true,
            validator: moblie,
            trigger: 'blur'
          }],
          emergencyMobile: [{
            required: true,
            message: '请输入联系方式',
            trigger: 'blur'
          }],
          education: [{
            required: true,
            message: '请输入学历',
            trigger: 'blur'
          }],

          birth: [{
            required: true,
            message: '请输入出生年月',
            trigger: 'change'
          }],
          entryTime: [{
            required: true,
            message: '请输入入职时间',
            trigger: 'change'
          }],
          emergencyContact: [{
            required: true,
            message: '请输入紧急联系人',
            trigger: 'blur'
          }],
          roleId: [{
            required: true,
            message: '请选择角色',
            trigger: 'change'
          }],
          idnum: [{
            required: true,
            message: '请输入18位身份证',
            trigger: 'blur'
          }, {
            len: 18,
            message: '请输入18位身份证',
            trigger: 'blur'
          }]
        }
      }
    },
    computed: {
      ...mapGetters([
        'userId'
      ])
    },
    mounted() {
      this.listRoleSel()
      this.listDepartment()
      this.listUserInfoPage()
    },
    methods: {
      computedNull(val) {
        if (val === undefined || val === null || val === '' || val === ' ') {
          return '-'
        } else {
          return val
        }
      },
      gotoZs(e) {
        console.log(e.userId)
        this.$router.push({
          name: 'Userzhengshu',
          params: {
            pmId: e.userId
          }
        })
      },
      gotopx(e) {
        console.log(e.userId)
        this.$router.push({
          name: 'UserPeixun',
          params: {
            pmId: e.userId
          }
        })
      },
      gotozw(e) {
        console.log(e.userId)
        this.$router.push({
          name: 'Zhiwei',
          params: {
            pmId: e.userId
          }
        })
      },
      gotojc(e) {
        console.log(e.userId)
        this.$router.push({
          name: 'Jiangcheng',
          params: {
            pmId: e.userId
          }
        })
      },
      handleChange(file, fileList) { // 学历上传
        console.log(file)
        console.log(fileList)
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
            this.xueliList.push(res.data.retData)
          })
      },
      handleRemove(file, fileList) { // 学历删除
        console.log(file, fileList)
        this.xueliList = fileList
      },
      handlePreview(file) { // 预览
        console.log(file)
        window.open(file.url)
      },
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
            this.IDList.push(res.data.retData)
          })
      },
      handleChangePhoto(file, fileList) { // 身份附件上传
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
            this.userImages.push(res.data.retData)
          })
      },
      handleRemoveID(file, fileList) { // 身份附件删除
        console.log(file, fileList)
        this.IDList = fileList
      },
      handleRemovePhoto(file, fileList) { // 身份附件删除
        console.log(file, fileList)
        this.userImages = fileList
      },
      listRoleSel() {
        listRoleSel({}).then(res => {
          console.log(res)
          this.roleList = res.retData
        })
      },
      listDepartment() {
        listDepartment({}).then(res => {
          console.log(res)
          this.departmentList = res.retData
        })
      },
      listUserInfoPage() {
        listUserInfoPage({
          userName: this.userName,
          departmentId: this.departmentId,
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
        this.listUserInfoPage()
      },
      handleCurrentChange(val) {
        this.pageIndex = val
        this.listUserInfoPage()
      },
      seach() {
        this.pageIndex = 1
        this.listUserInfoPage()
      },
      edit(e) {
        getUserInfoDetail({
          userId: e.userId
        }).then(res => {
          console.log(res)
          const {
            retData
          } = res
          this.visible = true
          this.visibleTitle = '编辑信息'
          this.form = {
            birth: retData.birth,
            education: retData.education,
            emergencyContact: retData.emergencyContact,
            emergencyMobile: retData.emergencyMobile,
            entryTime: retData.entryTime,
            idnum: retData.idnum,
            telephone: retData.telephone,
            userId: retData.userId,
            userName: retData.userName
          }
          this.xueliList = retData.educationFiles
          this.IDList = retData.idnumFiles
          this.userImages = retData.userImages
          this.form.roleId = retData.roleId.toString() || ''
        })
      },
      remove(e) {
        this.$confirm('此操作将永久删除该企业, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // deletePharmaceutical({
          //   id: e.id
          // }).then(res => {
          //   this.$notify({
          //     type: "success",
          //     message: res.retMsg
          //   })
          //   this.listUserInfoPage()
          // })
        })
      },
      addPeople(e) {
        this.visible = true
        this.visibleTitle = '新增用户'
        this.form = {

        }
        this.xueliList=[]
        this.userImages=[]
        this.IDList=[]
      },
      sumbitPeople() {
        // console.log('学习列表', this.xueliList)
        this.$refs.form1.validate((valid) => {
          if (valid) {
            this.btnLoding = true
            let newObj = this.form
            var _educationFiles = []
            this.xueliList.forEach(e => {
              _educationFiles.push({
                name: e.name,
                url: e.url
              })
            })

            var _idnumFiles = []
            this.IDList.forEach(e => {
              _idnumFiles.push({
                name: e.name,
                url: e.url
              })
            })

            var _userImages = []
            this.userImages.forEach(e => {
              _userImages.push({
                name: e.name,
                url: e.url
              })
            })

            newObj = {
              birth: moment(this.form.birth).format('YYYY-MM-DD'),
              education: this.form.education,
              emergencyContact: this.form.emergencyContact,
              emergencyMobile: this.form.emergencyMobile,
              entryTime: moment(this.form.entryTime).format('YYYY-MM-DD'),
              idnum: this.form.idnum,
              roleId: this.form.roleId,
              telephone: this.form.telephone,
              userId: this.form.userId,
              userName: this.form.userName,
              idnumFiles: _idnumFiles,
              userImages: _userImages,
              educationFiles: _educationFiles
            }

            addUserInfo(newObj).then(res => {
              console.log(res)
              this.$notify({
                type: 'success',
                message: res.retMsg
              })
              this.visible = false
              this.listUserInfoPage()
              this.btnLoding = false
            }).catch(() => {
              this.btnLoding = true
            })
          }
        })
      },
      editPeople() {
        // console.log('学习列表', this.xueliList)
        this.$refs.form1.validate((valid) => {
          if (valid) {
            this.btnLoding = true
            let newObj = this.form
            var _educationFiles = []
            this.xueliList.forEach(e => {
              _educationFiles.push({
                name: e.name,
                url: e.url
              })
            })
            var _idnumFiles = []
            this.IDList.forEach(e => {
              _idnumFiles.push({
                name: e.name,
                url: e.url
              })
            })
            var _userImages = []
            this.userImages.forEach(e => {
              _userImages.push({
                name: e.name,
                url: e.url
              })
            })
            newObj = {
              birth: moment(this.form.birth).format('YYYY-MM-DD'),
              userId: this.form.userId,
              education: this.form.education,
              emergencyContact: this.form.emergencyContact,
              emergencyMobile: this.form.emergencyMobile,
              entryTime: moment(this.form.entryTime).format('YYYY-MM-DD'),
              idnum: this.form.idnum,
              roleId: this.form.roleId,
              telephone: this.form.telephone,
              userName: this.form.userName,
              idnumFiles: _idnumFiles,
              userImages: _userImages,
              educationFiles: _educationFiles
            }
            updateUserInfo(newObj).then(res => {
              console.log(res)
              this.$notify({
                type: 'success',
                message: res.retMsg
              })
              this.visible = false
              this.listUserInfoPage()
              this.btnLoding = false
            }).catch(() => {
              this.btnLoding = true
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
