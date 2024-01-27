<template>
  <div class="app">
    <el-button @click="addRouter">添加</el-button>
    <el-table :data="tableData" style="width: 100%;margin-top: 10px;" row-key="id" border
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column label="标题">
        <template slot-scope="scope">
          {{ scope.row.meta.title }}
        </template>
      </el-table-column>
      <el-table-column prop="path" label="路径" align="center" />
      <el-table-column prop="component" label="组件指向" align="center" />
      <el-table-column label="排序号" align="center" width="80">
        <template slot-scope="scope">
          {{scope.row.orderNum}}
        </template>
      </el-table-column>
      <el-table-column label="权限" align="center">
        <template slot-scope="scope">
          <el-tag v-for="item in scope.row.meta.roles " :key="item" style="margin:0 5px" :type="colorTag(item)"
            disable-transitions>{{ item }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否隐藏" align="center" width="80">
        <template slot-scope="scope">
          {{scope.row.hidden?'隐藏':'显示'}}
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="160">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit( scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="menutitle" :visible.sync="routerVisible" width="60%" :close-on-click-modal="false">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="form.meta.title" />
        </el-form-item>
        <el-form-item label="路径">
          <el-input v-model="form.path" />
        </el-form-item>
        <el-form-item label="组件名">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="组件布局">
          <el-input v-model="form.component" />
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="form.meta.icon" />
        </el-form-item>
        <el-form-item label="权限">
          <el-checkbox-group v-model="form.meta.roles">
            <el-checkbox v-for="item in roleList" :key="item.value" :label="item.roleId">{{ item.roleName }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="父级菜单">
          <treeselect v-model="form.upMenuId" :multiple="false" :options="tableData" :normalizer="normalizer"
            placeholder="请选择父级菜单" class="seachInput" no-children-text="暂无数据" />
        </el-form-item>
        <el-form-item label="是否隐藏">
          <el-radio-group v-model="form.hidden">
            <el-radio :label="true">隐藏</el-radio>
            <el-radio :label="false">显示</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="form.orderNum" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="routerVisible = false">取 消</el-button>
        <el-button v-if="menutitle=='新增菜单栏'" type="primary" @click="addMenu">确 定</el-button>
        <el-button v-else type="primary" @click="editmenu">修 改</el-button>
      </span>
    </el-dialog>


  </div>
</template>

<script>
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'

  import {
    listPcMenu,
    getPcMenu,
    listRoleSel,
    deletePcMenu,
    addPcMenu,
    updatePcMenu
  } from '@/api/table'
  export default {
    name: 'Menu',
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
        roleList: [],
        tableData: [],
        normalizer(node) {
          console.log(node)
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
      this.roleList = []
      this.listPcMenu()
      this.listRoleSel()
    },
    methods: {

      listRoleSel() { //role lists
        listRoleSel({}).then(res => {
          console.log("角色列表", res)
          this.roleList = res.retData
        })
      },
      colorTag(value) { //tag color
        if (value === 'admin') {
          return 'primary'
        } else {
          return 'primary'
        }
      },
      addRouter() {
        this.menutitle = '新增菜单栏'
        this.routerVisible = true
        this.form = {
          id: '',
          path: '',
          name: '',
          component: '',
          hidden: false,
          upMenuId: null,
          meta: {
            title: '',
            icon: '',
            roles: []

          }
        }
      },
      handleEdit(scope) { //编辑菜单 获取单个菜单
        getPcMenu({
          menuId: scope.id
        }).then(res => {
          console.log(res)
          var temp = res.retData
          this.form = this.upMenuIdTree(temp)
          this.menutitle = '编辑菜单栏'
          this.routerVisible = true
        })
      },
      upMenuIdTree(e) { //处理upMenu0的问题
        if (e.upMenuId === 0 || e.upMenuId === '') {
          e.upMenuId = null
        }
        return e
      },


      listPcMenu() { //获得完整菜单
        listPcMenu({}).then(res => {
          this.tableData = res.retData
          console.log('获得完整菜单', this.tableData)
        })
      },
      addMenu() {
        this.routerVisible = false
        addPcMenu(this.form).then(res => {
          console.log(res)
          this.$message({
            type: 'success',
            message: res.retMsg
          })
          this.listPcMenu()
        })
      },
      handleDelete(scope) {
        // this.$confirm()
        this.$confirm('此操作将永久删除菜单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deletePcMenu({
            menuId: scope.id
          }).then(res => {
            console.log(res)
            this.$message({
              type: 'success',
              message: res.retMsg
            })
            this.listPcMenu()
          })
        })
      },
      editmenu() {
        console.log(this.form)
        this.form.children = []
        updatePcMenu(this.form).then(res => {
          console.log(res)
          this.routerVisible = false
          this.listPcMenu()
        })
      }
    }

  }

</script>
<style lang="scss" scoped>
  .app {
    margin: 20px;
  }

</style>
