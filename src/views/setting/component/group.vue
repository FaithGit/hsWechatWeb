<template>
  <div class="testPaper">
    <!-- 条件栏 -->
    <div class="headClass">
      <el-button type="primary" @click="addUser">新增组</el-button>
    </div>

    <!-- 表格 -->
    <el-table v-loading="listLoading" :data="roleList" element-loading-text="加载中" border fit highlight-current-row
      stripe style="margin-top:1.04vw" height="calc(54vh)">
      <!-- <el-table-column align="center" label="#" width="95">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column> -->
      <el-table-column type="expand">
        <template slot-scope="props">
          <div style="font-size: 17px;font-weight: bold;margin-bottom: 6px;">组员列表</div>
          <div v-for="item in props.row.groupUsers" :key="item.telephone">{{item.username}}-{{item.telephone}}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="组名" prop="groupName" />
      <el-table-column align="center" label="组长" prop="groupLeader" />
      <el-table-column align="center" label="部门名称" prop="departmentName" />
      <el-table-column align="center" label="车牌号" prop="licensePlate" />
      <el-table-column align="center" label="是否是在线运维组" prop="isOnlineOperationName" />
      <el-table-column align="center" label="排序号" prop="orderNum" />

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

        <el-form-item label="组名" prop="groupName">
          <el-input v-model="form.groupName" placeholder="请输入组名" />
        </el-form-item>
        <el-form-item label="组长" prop="leaderId">
          <treeselect v-model="form.leaderId" :multiple="false" :options="userlist" :normalizer="normalizer2"
            :clearable="false" placeholder="请选择用户" class="seachInput" no-children-text="暂无数据" @select="chooseUser" />
        </el-form-item>
        <el-form-item label="车牌号" prop="licensePlate">
          <el-input v-model="form.licensePlate" placeholder="请输入车牌号" />
        </el-form-item>
        <el-form-item label="部门" prop="departmentId">
          <treeselect v-model="form.departmentId" :multiple="false" :options="groupList" :normalizer="normalizer4"
            placeholder="请选择部门" class="seachInput" no-children-text="暂无数据" @input="parentgroupIdChange" />
        </el-form-item>
        <el-form-item label="是否属于在线运维" prop="isOnlineOperation">
          <el-radio-group v-model="form.isOnlineOperation">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>


        <div style="text-align:center;margin-top:80px">
          <el-button @click="visible=false">取 消</el-button>
          <el-button v-if="visibleTitle=='新增组'" type="primary" @click="sumbitUser">提 交</el-button>
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
    addRole,
    addGroup,
    listUser
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
          groupName: [{
            required: true,
            message: '请输入组名',
            trigger: 'blur'
          }],
          licensePlate: [{
            required: false,
            message: '请输入车牌号',
            trigger: 'blur'
          }],

          leaderId: [{
            required: true,
            message: '请选择部门',
            trigger: 'change'
          }],
          departmentId: [{
            required: true,
            message: '请选择部门',
            trigger: 'change'
          }],

          isOnlineOperation: [{
            required: true,
            message: '请选择是否属于在线运维',
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
      this.listUser()
      this.listGroup()
      this.listDepartment()
    },
    methods: {
      chooseUser(e) {
        console.log(e)
        this.form.groupLeader = e.userName
        this.$nextTick(() => {
          this.$refs.form1.validateField('leaderId');
        })
      },
      listUser() {
        listUser({}).then(res => {
          console.log(res.retData)
          this.userlist = res.retData
        })
      },
      listGroup() { //角色
        listGroup({}).then(res => {
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
          this.$refs.form1.validateField('departmentId');
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
        this.visibleTitle = '新增组'
      },
      sumbitUser() {
        this.$refs.form1.validate((valid) => {
          if (valid) {


            addGroup(this.form).then(res => {
              console.log(res)
              this.$notify({
                type: 'success',
                message: res.retMsg
              })
              this.visible = false
              this.listGroup()
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
      },
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
