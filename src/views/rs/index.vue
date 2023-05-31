<template>
  <div class="testPaper">
    <!-- 条件栏 -->
    <div class="headClass">
      用户姓名：
      <el-input v-model="userName" class="seachInput" placeholder="请选择输入关键字" clearable />
      部门：
      <el-select v-model="departmentId" class="seachInput" clearable>
        <el-option
          v-for="item in departmentList"
          :key="item.departmentId"
          :label="item.departmentName"
          :value="item.departmentId"
        />
      </el-select>
      <el-button type="primary" @click="seach">搜索</el-button>
      <el-button type="primary" @click="addPeople">新增用户</el-button>
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
      <el-table-column align="center" label="姓名" prop="userName" />
      <el-table-column align="center" label="部门名称">
        <template slot-scope="scope">
          {{ scope.row.departmentName||'-' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色">
        <template slot-scope="scope">
          {{ scope.row.roleName||'-' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="联系方式">
        <template slot-scope="scope">
          {{ scope.row.telephone||'-' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="学历">
        <template slot-scope="scope">
          {{ scope.row.education||'-' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="身份证">
        <template slot-scope="scope">
          {{ scope.row.idnum||'-' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="出生年月">
        <template slot-scope="scope">
          {{ scope.row.birth||'-' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="紧急联系人">
        <template slot-scope="scope">
          {{ scope.row.emergencyContact||'-' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="紧急联系方式">
        <template slot-scope="scope">
          {{ scope.row.emergencyMobile||'-' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="入职时间">
        <template slot-scope="scope">
          {{ scope.row.entryTime||'-' }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)">编辑</el-button>
          <!-- <el-button @click="remove(scope.row)">删除</el-button> -->
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
          <el-upload
            action="#"
            :on-change="handleChange"
            :on-remove="handleRemove"
            :on-preview="handlePreview"
            :auto-upload="false"
            :file-list="xueliList"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>

        <el-form-item label="身份证" prop="idnum">
          <el-input v-model="form.idnum" placeholder="请输入身份证" />
        </el-form-item>
        <el-form-item label="身份证附件" prop="educationFiles">
          (点击列表查看附件)
          <el-upload
            action="#"
            :on-change="handleChangeID"
            :on-remove="handleRemoveID"
            :on-preview="handlePreview"
            :auto-upload="false"
            :file-list="IDList"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="出生年月" prop="birth">
          <el-input v-model="form.birth" placeholder="请输入出生年月" />
        </el-form-item>
        <el-form-item label="紧急联系人" prop="emergencyContact">
          <el-input v-model="form.emergencyContact" placeholder="请输入紧急联系人" />
        </el-form-item>
        <el-form-item label="紧急联系方式" prop="emergencyMobile">
          <el-input v-model="form.emergencyMobile" placeholder="请输入紧急联系方式" />
        </el-form-item>
        <el-form-item label="入职时间" prop="entryTime">
          <el-input v-model="form.entryTime" placeholder="请输入入职时间" />
        </el-form-item>

        <div style="text-align:center;margin-top:80px">
          <el-button @click="visible=false">取 消</el-button>
          <el-button type="primary" @click="sumbitPeople">确 定</el-button>
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
  getAreaCodeTree,
  updateCompany,
  listUserInfoPage,
  listDepartment,
  listRoleSel,
  addUserInfo
} from '@/api/table'
import {
  mapGetters
} from 'vuex'
import axios from 'axios'
import setting from '@/settings'
import {
  getToken
} from '@/utils/auth'

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

      allAreacode: [],
      comName: '',
      areaCode: null,
      status: '',
      visible: false,
      editVisible: false,
      listLoading: false,

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
          validator: moblie,
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
          trigger: 'blur'
        }],
        entryTime: [{
          required: true,
          message: '请输入入职时间',
          trigger: 'blur'
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
    handlePreview(file) { // 学历预览
      console.log(file)
      window.open(file.url)
    },
    handleChangeID(file, fileList) { // 学历上传
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
    handleRemoveID(file, fileList) { // 学历删除
      console.log(file, fileList)
      this.IDList = fileList
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
    getAreaCodeTree() {
      getAreaCodeTree({
        areaCode: 3304
      }).then(res => {
        console.log(res)
        this.allAreacode.push(res.retData)
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
    editShiji(e) {
      this.editVisible = true
      this.form = Object.assign({}, e)
      if (this.form.areaCode === 0) {
        this.form.areaCode = null
      }
      console.log('🚀 ~ editShiji ~   this.form:', this.form)
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
    },
    sumbitPeople() {
      console.log('学习列表', this.xueliList)
      this.$refs.form1.validate((valid) => {
        if (valid) {
          const newObj = this.form
          newObj.educationFiles = this.xueliList
          newObj.idnumFiles = this.IDList
          addUserInfo(this.form).then(res => {
            console.log(res)
            this.$notify({
              type: 'success',
              message: res.retMsg
            })
            this.visible = false
            this.listUserInfoPage()
          })
        }
      })
    },
    editSubmit() {
      if (this.form.areaCode === null || this.form.areaCode === undefined) {
        this.$notify({
          type: 'error',
          message: '请选择地区code'
        })
        return
      }
      this.$refs.form1.validate((valid) => {
        if (valid) {
          updateCompany(this.form).then(res => {
            console.log(res)
            this.$notify({
              type: 'success',
              message: res.retMsg
            })
            this.editVisible = false
            this.listUserInfoPage()
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
