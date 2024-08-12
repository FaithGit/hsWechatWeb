<template>
  <div class="app">
    <el-row v-loading="loading">
      <el-col :span="8" style="height:80vh;overflow: auto;">
        <treeselect v-model="roleId" :multiple="false" :options="roleList" :normalizer="normalizer" :clearable="false"
          :maxHeight="999999" :alwaysOpen='true' no-children-text="暂无数据" @select="changeRole">
          <label slot="option-label" slot-scope="{ node, labelClassName }" :class="labelClassName" :title="node.label">
            {{ node.label }}
          </label>
        </treeselect>
      </el-col>
      <el-col :span="16" style="height:80vh;overflow: auto;">
        <treeselect v-model="roleIds" :multiple="true" :options="tableData" :normalizer="normalizer2"
          :maxHeight="999999" :valueConsistsOf="'ALL_WITH_INDETERMINATE'" :alwaysOpen='true' no-children-text="暂无数据"
          :defaultExpandLevel='2'>
          <label slot="option-label" slot-scope="{ node, labelClassName }" :class="labelClassName" :title="node.label">
            {{ node.label }}
          </label>
        </treeselect>
      </el-col>
    </el-row>
    <div style="margin-top:20px;text-align:center">
      <el-button type="primary" style="width:50vw" v-loading="loading" @click="updatePcRoleMenu">提交</el-button>
    </div>
  </div>
</template>

<script>
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'

  import {
    listPcMenu,
    getPcMenu,
    listRoleSel,
    listPcRoleMenus,
    deletePcMenu,
    addPcMenu,
    updatePcMenu,
    updatePcRoleMenu
  } from '@/api/table'
  export default {
    name: 'Role',
    components: {
      Treeselect
    },
    data() {
      return {
        seletComList: [],
        parentList: [],
        menutitle: '新增菜单栏',
        type: 'gk',
        routerVisible: false,
        loading: false,
        form: {
          path: '',
          name: '',
          component: '',
          hidden: false,
          meta: {
            title: '',
            icon: '',
            roles: []
          },
          children: []
        },
        roleIds: [],
        roleList: [],
        tableData: [],
        roleId: "zjb",
        normalizer(node) {
          // console.log(node)
          //如果涉及到对子对象属性获取，js会报错
          if (node.id == '') {
            return {}
          }
          //去掉children=[]的children属性
          if (node.children && !node.children.length) {
            delete node.children;
          }
          return {
            id: node.roleId,
            label: node.roleName,
            children: node.children && node.children.length ? node.children : 0
          }
        },
        normalizer2(node) {
          // console.log(node)
          //如果涉及到对子对象属性获取，js会报错
          if (node.id == '') {
            return {}
          }
          //去掉children=[]的children属性
          if (node.children && !node.children.length) {
            delete node.children;
          }
          return {
            id: node.id,
            label: node.meta.title,
            children: node.children && node.children.length ? node.children : 0
          }
        },
      }
    },
    mounted() {
      this.listPcMenu()
      this.listRoleSel()

    },
    methods: {
      changeRole(e) {
        console.log(e.roleId)
        this.loading = true
        listPcRoleMenus({
          roleId: e.roleId
        }).then(res => {
          this.roleIds = res.retData
          this.loading = false
        })
      },
      updatePcRoleMenu() {
        this.loading = true
        updatePcRoleMenu({
          roleId: this.roleId,
          menuIds: this.roleIds
        }).then(res => {
          console.log(res)
          this.loading = false
          this.listPcRoleMenus()
        })

      },
      listRoleSel() { //角色表
        listRoleSel({}).then(res => {
          console.log("角色列表", res)
          this.roleList = res.retData
          this.listPcRoleMenus()
        })
      },
      listPcRoleMenus() { //角色对应的菜单
        this.loading = true
        listPcRoleMenus({
          roleId: this.roleId
        }).then(res => {
          this.roleIds = res.retData
          this.loading = false
        })
      },

      listPcMenu() { //获得完整菜单
        listPcMenu({}).then(res => {
          this.tableData = res.retData
          console.log('获得完整菜单', this.tableData)
        })
      },
      upMenuIdTree(e) { //处理upMenu0的问题
        if (e.upMenuId === 0 || e.upMenuId === '') {
          e.upMenuId = null
        }
        return e
      },
    }

  }

</script>
<style lang="scss" scoped>
  .app {
    margin: 20px;
  }

  .conFelx {
    display: flex;
  }

  ::v-deep .vue-treeselect--open.vue-treeselect--open-below .vue-treeselect__control {
    display: none;
  }

  ::v-deep .vue-treeselect__label {
    font-size: 18px;
  }

  ::v-deep .vue-treeselect__indent-level-1 .vue-treeselect__option {
    margin: 10px 0;
  }

</style>
