<template>
  <div class="app">
    <el-button @click="addRouter">添加</el-button>
    <el-table :data="tableData" style="width: 100%;margin-top: 10px;" row-key="path" border default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column label="标题">
        <template slot-scope="scope">
          {{ scope.row.meta.title }}
        </template>
      </el-table-column>
      <el-table-column prop="path" label="路径" />
      <el-table-column label="权限">
        <template slot-scope="scope">
          <el-tag v-for="item in scope.row.meta.roles " :key="item" style="margin:0 5px" :type="colorTag(item)"
            disable-transitions>{{ item }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit( scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="menutitle" :visible.sync="routerVisible" width="30%">
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
          <el-select v-model="form.parentId" placeholder="请选择">
            <el-option v-for="item in parentList" :key="item.id" :label="item.title" :value="item.id" />
          </el-select>
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
  import {
    listPcMenu
  } from '@/api/table'
  export default {
    name: 'Menu',
    data() {
      return {
        seletComList: [],
        parentList: [],
        menutitle: '新增菜单栏',
        sysId: '',
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
        tableData: []
      }
    },
    mounted() {
      this.roleList = []
      this.listPcMenu()
    },
    methods: {
      colorTag(value) {
        if (value === 'admin') {
          return 'primary'
        } else {
          return 'success'
        }
      },
      addRouter() {
        this.menutitle = '新增菜单栏'
        this.routerVisible = true
        this.form = {
          id: '',
          sysId: this.sysId,
          path: '',
          name: '',
          component: '',
          hidden: false,
          parentId: '',
          meta: {
            title: '',
            icon: '',
            roles: []

          }
        }
        findMenuTree({
          sysId: this.sysId
        }).then(res => {
          // console.log(res)
          this.parentList = res.retData
        })
      },
      handleEdit(scope) {
        this.listRoleVO()
        findMenuTree({
          sysId: this.sysId,
          roleId: getRold()
        }).then(res => {
          // console.log(res)
          this.parentList = res.retData
          getMenuBarVO({
              menuId: scope.id
            })
            .then(res => {
              console.log('?????????', res)
              this.form = res.retData
            })
          this.menutitle = '编辑菜单栏'
          this.routerVisible = true
          // this.form = scope
        })
      },
      listPcMenu() {
        listPcMenu({

        }).then(res => {
          console.log(res)
          this.tableData = res.retData
        })
      },
      listRoleVO() {
        listRoleVO({
          sysId: this.sysId
        }).then(res => {
          this.roleList = res.retData
        })
      },
      addMenu() {
        this.routerVisible = false
        saveMenu(this.form).then(res => {
          console.log(res)
          this.$message({
            type: 'success',
            message: res.retMsg
          })
          this.seach()
        })
      },
      handleDelete(scope) {
        // this.$confirm()
        this.$confirm('此操作将永久删除菜单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteMenuBar({
            menuId: scope.id
          }).then(res => {
            console.log(res)
            this.$message({
              type: 'success',
              message: res.retMsg
            })
            this.seach()
          })
        })
      },
      editmenu() {
        console.log(this.form)
        updateMenuBarVO(this.form).then(res => {
          console.log(res)
          this.routerVisible = false
          this.seach()
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
