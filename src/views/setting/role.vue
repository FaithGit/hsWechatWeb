<template>
  <div class="app">
    <el-row v-loading="loading">
      <el-col :span="8">
        <treeselect
          v-model="roleId"
          :multiple="false"
          :options="roleList"
          :normalizer="normalizer"
          :clearable="false"
          :maxHeight="999999"
          :alwaysOpen='true'
          no-children-text="暂无数据"
          @select="changeRole"
        >
          <label slot="option-label" slot-scope="{ node, labelClassName }" :class="labelClassName" :title="node.label">
            {{ node.label }}
          </label>
        </treeselect>
      </el-col>

      <el-col :span="16">
        <treeselect
          v-model="roleIds"
          :multiple="true"
          :options="tableData"
          :normalizer="normalizer2"
          :maxHeight="999999"
          :valueConsistsOf="'ALL_WITH_INDETERMINATE'"
          :alwaysOpen='true'
          no-children-text="暂无数据"
          :defaultExpandLevel='2'
        >
          <label slot="option-label" slot-scope="{ node, labelClassName }" :class="labelClassName" :title="node.label">
            {{ node.label }}
          </label>
        </treeselect>
      </el-col>
    </el-row>

    <div class="submit-area">
      <el-button type="primary" style="width:50vw" v-loading="loading" @click="updatePcRoleMenu">提交</el-button>
    </div>
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

// 假设的 API 导入路径
import {
  listPcMenu,
  // getPcMenu, // 未使用
  listRoleSel,
  listPcRoleMenus,
  // deletePcMenu, // 未使用
  // addPcMenu, // 未使用
  // updatePcMenu, // 未使用
  updatePcRoleMenu
} from '@/api/table'

export default {
  name: 'Role',
  components: {
    Treeselect
  },
  data() {
    return {
      // 未使用的变量已保留，但建议删除以保持代码简洁
      seletComList: [],
      parentList: [],
      menutitle: '新增菜单栏',
      type: 'gk',
      routerVisible: false,
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
      // 核心数据
      loading: false, // 加载状态
      roleIds: [], // 当前角色拥有的菜单ID列表（右侧选中的菜单）
      roleList: [], // 角色列表（左侧树）
      tableData: [], // 完整菜单列表（右侧树）
      roleId: "zjb", // 当前选中的角色ID

      // 角色列表的 normalizer (左侧)
      normalizer(node) {
        if (node.roleId === undefined) { // 使用 roleId 进行更安全的检查
          return {}
        }
        // 去掉 children=[] 的 children 属性
        if (node.children && !node.children.length) {
          delete node.children;
        }
        return {
          id: node.roleId,
          label: node.roleName,
          children: node.children && node.children.length ? node.children : undefined // 使用 undefined 代替 0
        }
      },

      // 菜单列表的 normalizer (右侧)
      normalizer2(node) {
        if (node.id === undefined) { // 使用 id 进行更安全的检查
          return {}
        }
        // 去掉 children=[] 的 children 属性
        if (node.children && !node.children.length) {
          delete node.children;
        }
        return {
          id: node.id,
          label: node.meta.title,
          children: node.children && node.children.length ? node.children : undefined // 使用 undefined 代替 0
        }
      },
    }
  },
  mounted() {
    this.listPcMenu() // 1. 加载完整菜单列表 (右侧)
    this.listRoleSel() // 2. 加载角色列表 (左侧) 并触发加载对应菜单
  },
  methods: {
    /**
     * 切换角色时触发，加载新角色的菜单权限
     * @param {Object} e - 选中的角色节点对象
     */
    changeRole(e) {
      console.log('当前选中的角色ID:', e.roleId)
      this.roleId = e.roleId // 确保更新 roleId
      this.listPcRoleMenus()
    },

    /**
     * 提交角色菜单权限更新
     */
    updatePcRoleMenu() {
      this.loading = true
      updatePcRoleMenu({
        roleId: this.roleId,
        menuIds: this.roleIds
      }).then(res => {
        console.log("更新结果", res)
        this.$message.success('角色菜单权限更新成功'); // 添加成功提示
        // 更新完成后，可以选择重新加载当前角色的菜单，但这里省略以提高用户体验
      }).catch(err => {
        console.error("更新失败", err)
        this.$message.error('角色菜单权限更新失败'); // 添加失败提示
      }).finally(() => {
        this.loading = false
      })
    },

    /**
     * 获取角色列表（左侧树）
     */
    listRoleSel() {
      listRoleSel({}).then(res => {
        console.log("角色列表", res)
        this.roleList = res.retData
        // 角色列表加载完成后，加载当前选中角色的菜单权限
        if (this.roleList.length > 0 && this.roleId) {
          this.listPcRoleMenus()
        }
      }).catch(err => {
        console.error("加载角色列表失败", err)
      })
    },

    /**
     * 获取当前角色已拥有的菜单ID列表
     */
    listPcRoleMenus() {
      if (!this.roleId) return; // 避免在 roleId 未定义时发起请求

      this.loading = true
      listPcRoleMenus({
        roleId: this.roleId
      }).then(res => {
        console.log(`角色 ${this.roleId} 的菜单权限`, res)
        this.roleIds = res.retData
      }).catch(err => {
        console.error("加载角色菜单失败", err)
      }).finally(() => {
        this.loading = false
      })
    },

    /**
     * 获取完整的菜单列表（右侧树）
     */
    listPcMenu() {
      listPcMenu({}).then(res => {
        this.tableData = res.retData
        console.log('获得完整菜单', this.tableData)
      }).catch(err => {
        console.error("加载完整菜单列表失败", err)
      })
    },

    /**
     * 处理 upMenuId 为 0 的问题 (未在当前逻辑中使用，但保留)
     */
    upMenuIdTree(e) {
      if (e.upMenuId === 0 || e.upMenuId === '') {
        e.upMenuId = null
      }
      return e
    },
  }
}
</script>

<style lang="scss" scoped>
// 基础容器样式
.app {
  margin: 20px;
  background-color: #f5f7fa;
  padding: 10px;
  border-radius: 4px;
}

.conFelx {
  display: flex;
}

// 左右布局容器的高度和滚动条
.el-row {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background-color: #ffffff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

// 左侧角色选择区样式
.el-col:nth-child(1) {
  border-right: 1px solid #ebeef5;
  padding-right: 10px;
}

// 左右两侧的树形选择器容器，保持高度和滚动
.el-col {
  height: 80vh;
  overflow: auto;
  padding: 15px;
}

// --- vue-treeselect 样式定制 ---

// 隐藏顶部的控制区域（因为设置了 alwaysOpen='true'）
::v-deep .vue-treeselect--open.vue-treeselect--open-below .vue-treeselect__control {
  display: none;
}

// 树形列表容器
::v-deep .vue-treeselect__menu-container {
  border: none;
  box-shadow: none;
  position: static;
}

// 树形选项标签样式
::v-deep .vue-treeselect__label {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

// 鼠标悬停时的样式
::v-deep .vue-treeselect__option--highlight {
  background-color: #ecf5ff;
  color: #409eff;
}

// 缩进级别为 1 的子菜单项
::v-deep .vue-treeselect__indent-level-1 .vue-treeselect__option {
  margin: 5px 0;
}

// 角色列表（左侧）的选项：使其看起来更像列表项
.el-col:nth-child(1) ::v-deep .vue-treeselect__option {
  padding: 8px 10px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.el-col:nth-child(1) ::v-deep .vue-treeselect__option:hover {
  background-color: #f9f9f9;
}

// 选中状态的角色 (左侧)
.el-col:nth-child(1) ::v-deep .vue-treeselect__option--selected {
  background-color: #409eff;
  color: #ffffff;
}

.el-col:nth-child(1) ::v-deep .vue-treeselect__option--selected .vue-treeselect__label {
  color: #ffffff;
}


// --- 提交按钮样式 ---
.submit-area {
  margin-top: 20px;
  text-align: center;
}

// 加载时的遮罩颜色
::v-deep .el-loading-mask {
  background-color: rgba(255, 255, 255, 0.7);
}
</style>
