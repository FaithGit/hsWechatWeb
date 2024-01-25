<template>
  <div class="testPaper">
    <!-- 条件栏 -->
    <div class="headClass">
      <el-button type="primary" @click="addUser">新增角色</el-button>
    </div>

    <!-- 表格 -->
    <el-table v-loading="listLoading" :data="roleList" element-loading-text="加载中" border fit highlight-current-row
      stripe style="margin-top:1.04vw" height="calc(54vh)">
      <el-table-column align="center" label="#" width="95">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色id" prop="roleId" />
      <el-table-column align="center" label="角色名称" prop="roleName" />
      <el-table-column align="center" label="部门名称" prop="departmentName" />
      <el-table-column align="center" label="是否属于海晟公司" prop="isHaishengName" />
      <!-- <el-table-column align="center" label="操作" width="280">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)">编辑</el-button>
          <el-button type="danger" @click="remove(scope.row)">删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>

    <el-dialog v-if="visible" :title="visibleTitle" :append-to-body="true" :visible="visible" width="40%"
      :close-on-click-modal="false" @close="visible=false">
      <el-form ref="form1" :model="form" label-width="140px" :rules="rules">

        <el-form-item label="角色ID" prop="roleId">
          <el-input v-model="form.roleId" placeholder="请输入角色ID" />
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="部门" prop="departmentId">
          <treeselect v-model="form.departmentId" :multiple="false" :options="groupList" :normalizer="normalizer4"
            placeholder="请选择部门" class="seachInput" no-children-text="暂无数据" @input="parentgroupIdChange" />
        </el-form-item>
        <el-form-item label="是否属于海晟公司" prop="isHaisheng">
          <el-radio-group v-model="form.isHaisheng">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>


        <div style="text-align:center;margin-top:80px">
          <el-button @click="visible=false">取 消</el-button>
          <el-button v-if="visibleTitle=='新增角色'" type="primary" @click="sumbitUser">提 交</el-button>
          <!-- <el-button v-if="visibleTitle=='编辑用户'" type="primary" @click="editSubmit">更 改</el-button> -->
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
    listRole,
    listGroup,
    listUserPage,
    addUser,
    removeUser,
    getUser,
    updateUser,
    listDepartment,
    addRole

  } from '@/api/table'
  import {
    moblie
  } from '@/utils/asyncValidator'
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
    name: 'User',
    components: {
      Treeselect
    },
    data() {
      return {
        userName: "",
        roleId: null,
        roleList: [],
        groupId: null,
        groupList: [],
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
          roleId: [{
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }],
          roleName: [{
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }],

          departmentId: [{
            required: true,
            message: '请选择部门',
            trigger: 'change'
          }],

          isHaisheng: [{
            required: true,
            message: '请选择是否属于海晟公司',
            trigger: 'change'
          }]
        },
        normalizer(node) {
          return {
            id: node.certificateId,
            label: node.certificateName,
            children: node.children && node.children.length ? node.children : 0
          }
        },
        normalizer2(node) {
          return {
            id: node.userId,
            label: node.userName,
            children: node.children && node.children.length ? node.children : 0
          }
        },
        normalizer3(node) {
          return {
            id: node.roleId,
            label: node.roleName,
            children: node.children && node.children.length ? node.children : 0
          }
        },
        normalizer4(node) {
          return {
            id: node.departmentId,
            label: node.departmentName,
            children: node.children && node.children.length ? node.children : 0
          }
        },

      }
    },
    computed: {
      ...mapGetters([
        'userId'
      ])
    },
    mounted() {
      this.listRole()
      this.listDepartment()
    },
    methods: {
      listRole() { //角色
        listRole({}).then(res => {
          console.log(res)
          this.roleList = res.retData
        })
      },

      listDepartment() { //角色
        listDepartment({}).then(res => {
          console.log(res)
          this.groupList = res.retData
        })
      },
      parentroleIdChange(val) {
        // console.log('parentId变化', val);
        this.$nextTick(() => {
          this.$refs.form1.validateField('roleId');
        })
      },
      parentgroupIdChange(val) {
        // console.log('parentId变化', val);
        this.$nextTick(() => {
          this.$refs.form1.validateField('groupId');
        })
      },

      remove(e) {
        console.log(e)
        this.$confirm('此操作将永久该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          removeUser({
            userId: e.userId
          }).then(res => {
            this.$notify({
              type: 'success',
              message: res.retMsg
            })
            this.listUserPage()
          })
        })
      },
      edit(e) {
        console.log(e)
        getUser({
          userId: e.userId
        }).then(res => {
          console.log(res)
          const {
            retData
          } = res
          this.visible = true
          this.form = {
            userId: retData.userId,
            telephone: retData.telephone,
            roleId: retData.roleId,
            groupId: retData.groupId,
            userName: retData.userName,
          }
          this.visibleTitle = '编辑用户'
        })
      },
      addUser(e) {
        this.visible = true
        this.form = {}
        this.visibleTitle = '新增角色'
      },
      sumbitUser() {
        this.$refs.form1.validate((valid) => {
          if (valid) {


            addRole(this.form).then(res => {
              console.log(res)
              this.$notify({
                type: 'success',
                message: res.retMsg
              })
              this.visible = false
              this.listRole()
            })
          }
        })
      },
      editSubmit() {
        this.$refs.form1.validate((valid) => {
          if (valid) {
            updateUser(this.form).then(res => {
              console.log(res)
              this.$notify({
                type: 'success',
                message: res.retMsg
              })
              this.visible = false
              this.listUserPage()
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
