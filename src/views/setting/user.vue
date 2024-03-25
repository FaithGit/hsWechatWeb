<template>
  <div class="testPaper">
    <!-- 条件栏 -->
    <div class="headClass">

      用户名：
      <el-input v-model="userName" class="seachInput" placeholder="请输入关键字" clearable />
      角色名：
      <treeselect v-model="roleId" :multiple="false" :options="roleList" :normalizer="normalizer3" placeholder="请选择角色"
        class="seachInput" no-children-text="暂无数据" @open="openRole"  />
      组名：
      <treeselect v-model="groupId" :multiple="false" :options="groupList" :normalizer="normalizer4" placeholder="请选择组"
        class="seachInput" no-children-text="暂无数据" @open="openGroup" />

      <el-button type="primary" @click="seach" icon="el-icon-search">搜索</el-button>
      <el-button type="primary" @click="addUser" icon="el-icon-plus">新增用户</el-button>
      <el-button type="primary" @click="roleClick" icon="el-icon-s-custom">角色列表</el-button>
      <el-button type="primary" @click="groupClick" icon="el-icon-menu">组列表</el-button>
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
      <el-table-column align="center" label="手机号" prop="telephone" />
      <el-table-column align="center" label="角色名" prop="roleName" />
      <el-table-column align="center" label="组名" prop="groupName" />
      <el-table-column align="center" label="是否已关注公众号" prop="subscribeStatusName" />
      <el-table-column align="center" label="微信unionId" prop="unionId" />
      <el-table-column align="center" label="公众号openId" prop="publicAccountOpenId" />
      <el-table-column align="center" label="小程序openId" prop="miniProgramOpenId" />

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

        <el-form-item label="用户名" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入用户名" />
        </el-form-item>

        <el-form-item label="手机号" prop="telephone">
          <el-input v-model="form.telephone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="角色名" prop="roleId">
          <treeselect v-model="form.roleId" :multiple="false" :options="roleList" :normalizer="normalizer3"
            placeholder="请选择角色" class="seachInput" no-children-text="暂无数据" @input="parentroleIdChange" @open="openRole"  />
        </el-form-item>
        <el-form-item label="组名">
          <treeselect v-model="form.groupId" :multiple="false" :options="groupList" :normalizer="normalizer4"
            placeholder="请选择组" class="seachInput" no-children-text="暂无数据" @open="openGroup" />
        </el-form-item>

        <div style="text-align:center;margin-top:80px">
          <el-button @click="visible=false">取 消</el-button>
          <el-button v-if="visibleTitle=='新增用户'" type="primary" @click="sumbitUser">提 交</el-button>
          <el-button v-if="visibleTitle=='编辑用户'" type="primary" @click="editSubmit">更 改</el-button>
        </div>
      </el-form>
    </el-dialog>

    <el-dialog v-if="roleVisible" title="角色列表" :append-to-body="true" :visible="roleVisible" width="60%"
      :close-on-click-modal="false" @close="roleVisible=false">
      <role></role>
    </el-dialog>
    <el-dialog v-if="groupVisible" title="组列表" :append-to-body="true" :visible="groupVisible" width="60%"
      :close-on-click-modal="false" @close="groupVisible=false">
      <group></group>
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
    updateUser
  } from '@/api/table'
  import {
    moblie
  } from '@/utils/asyncValidator'

  import role from './component/role.vue'
  import group from './component/group.vue'
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
      Treeselect,
      role,
      group
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
        roleVisible: false,
        groupVisible: false,
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
          userName: [{
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }],
          telephone: [{
            required: true,
            validator: moblie,
            trigger: 'blur'
          }],
          roleId: [{
            required: true,
            message: '请选择角色名',
            trigger: 'change'
          }],
          groupId: [{
            required: true,
            message: '请选择组名',
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
            id: node.groupId,
            label: node.groupName,
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
      this.listGroup()
      this.listUserPage()
    },
    methods: {
      openGroup() {
        console.log("更新组")
        this.listGroup()
      },
      openRole() {
        console.log("更新role")
        this.listRole()
      },
      roleClick() {
        this.roleVisible = true
      },
      groupClick() {
        this.groupVisible = true
      },
      listRole() { //角色
        listRole({}).then(res => {
          console.log(res)
          this.roleList = res.retData
        })
      },

      listGroup() { //角色
        listGroup({}).then(res => {
          console.log(res)
          this.groupList = res.retData
        })
      },
      listUserPage() {
        listUserPage({
          userName: this.userName || '',
          roleId: this.roleId || '',
          groupId: this.groupId || '',
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }).then(res => {
          console.log(res)
          this.records = res.retData.records
          this.total = res.retData.total
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
      handleSizeChange(val) {
        this.pageSize = val
        this.listUserPage()
      },
      handleCurrentChange(val) {
        this.pageIndex = val
        this.listUserPage()
      },
      seach() {
        this.pageIndex = 1
        this.listUserPage()
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
        this.form = {
          groupId: null
        }
        this.visibleTitle = '新增用户'

      },
      sumbitUser() {
        this.$refs.form1.validate((valid) => {
          if (valid) {


            addUser({
              roleId: this.form.roleId,
              telephone: this.form.telephone,
              userName: this.form.userName,
              groupId: this.form.groupId || '',
            }).then(res => {
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
      editSubmit() {
        console.log(this.form)
        this.$refs.form1.validate((valid) => {
          if (valid) {
            updateUser({
              roleId: this.form.roleId,
              telephone: this.form.telephone,
              userName: this.form.userName,
              userId: this.form.userId,
              groupId: this.form.groupId || '',
            }).then(res => {
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
