<template>
  <div class="testPaper">
    <!-- 条件栏 -->
    <div>
      药剂名称：
      <el-input v-model="pharmaceuticalName" class="seachInput" placeholder="请选择输入关键字" clearable />
      药剂名称：
      <el-select v-model="status" class="seachInput" placeholder="请选择状态" clearable>
        <el-option label="在用" value="1" />
        <el-option label="废用" value="0" />
      </el-select>
      <el-button type="primary" @click="seach">搜索</el-button>
      <el-button type="primary" @click="addYaoji">新增药剂</el-button>
    </div>

    <!-- 表格 -->
    <el-table v-loading="listLoading" :data="records" element-loading-text="加载中" border fit stripe highlight-current-row
      style="margin-top:1.04vw" height="calc(100vh - 84px - 60px - 40px - 32px - 1.04vw - 17px)">
      <el-table-column align="center" label="#" width="95">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="药剂名称" prop="pharmaceuticalName" />
      <el-table-column align="center" label="药剂单位" prop="unit" />
      <el-table-column align="center" label="工时" prop="workingHour" />
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          {{ scope.row.status==1?'在用':'费用' }}

        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button @click="editShiji(scope.row)">编辑</el-button>
          <el-button type="danger" @click="remove(scope.row)"> 删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="buttonPagination">
      <el-pagination :current-page="pageIndex" :page-sizes="[10,20,30,40,50]" :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>

    <el-dialog v-if="addVisible" title="新增药剂" :append-to-body="true" :visible="addVisible" width="40%"
      :close-on-click-modal="false" @close="addVisible=false">
      <el-form ref="form1" :model="form" label-width="140px" :rules="rules">
        <el-form-item label="药剂名称" prop="pharmaceuticalName">
          <el-input v-model="form.pharmaceuticalName" placeholder="请输入药剂名称" />
        </el-form-item>
        <el-form-item label="药剂单位" prop="unit">
          <el-input v-model="form.unit" placeholder="请输入药剂单位" />
        </el-form-item>
        <el-form-item label="工时" prop="workingHour">
          <el-input v-model="form.workingHour" placeholder="请输入工时" />
        </el-form-item>
        <div style="text-align:center;margin-top:80px">
          <el-button @click="addVisible=false">取 消</el-button>
          <el-button type="primary" @click="sumbityaoji">确 定</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog v-if="editVisible" title="编辑药剂" :append-to-body="true" :visible="editVisible" width="40%"
      :close-on-click-modal="false" @close="editVisible=false">
      <el-form ref="form1" :model="form" label-width="140px" :rules="rules">
        <el-form-item label="药剂名称" prop="pharmaceuticalName">
          <el-input v-model="form.pharmaceuticalName" placeholder="请输入药剂名称" />
        </el-form-item>
        <el-form-item label="药剂单位" prop="unit">
          <el-input v-model="form.unit" placeholder="请输入药剂单位" />
        </el-form-item>
        <el-form-item label="工时" prop="workingHour">
          <el-input v-model="form.workingHour" placeholder="请输入工时" />
        </el-form-item>
        <el-form-item label="药剂单位" prop="unit">
          <el-select v-model="form.status" class="seachInput" placeholder="请选择状态">
            <el-option label="在用" :value="1" />
            <el-option label="废用" :value="0" />
          </el-select>
        </el-form-item>
        <div style="text-align:center;margin-top:80px">
          <el-button @click="editVisible=false">取 消</el-button>
          <el-button type="primary" @click="editSubmit">更 新</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {
    listPharmaceuticalPage,
    deletePharmaceutical,
    getReagent,
    addPharmaceutical,
    updatePharmaceutical
  } from '@/api/table'
  import {
    mapGetters
  } from 'vuex'
  // import moment from 'moment'
  export default {
    name: 'Yaoji',
    computed: {
      ...mapGetters([
        'userId'
      ])
    },
    data() {
      return {
        pageIndex: 1,
        pageSize: 10,
        total: 0,
        records: [],
        pharmaceuticalName: '',
        status: '',
        addVisible: false,
        editVisible: false,
        listLoading: false,
        form: {},
        allyjList: [], // 全部药剂列表
        yaojiChoose: [], // 全部药剂列表
        rules: {
          pharmaceuticalName: [{
            required: true,
            message: '请输入药剂名称',
            trigger: 'blur'
          }],
          unit: [{
            required: true,
            message: '请输入药剂单位',
            trigger: 'blur'
          }],
          workingHour: [{
            type:"number",
            required: true,
            message: '请输入工时(纯数字)',
            trigger: 'blur',
            transform: value =>
              this.$options.filters.formValidateFun(value, "number")
          }]
        }

      }
    },
    mounted() {
      this.listPharmaceuticalPage()
    },
    methods: {
      handleSizeChange(val) {
        this.pageSize = val
        this.listPharmaceuticalPage()
      },
      handleCurrentChange(val) {
        this.pageIndex = val
        this.listPharmaceuticalPage()
      },
      seach() {
        this.pageIndex = 1
        this.listPharmaceuticalPage()
      },
      editShiji(e) {
        console.log(e)
        this.editVisible = true
        this.form = e
      },
      remove(e) {
        this.$confirm('此操作将永久删除该药剂, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deletePharmaceutical({
            id: e.id
          }).then(res => {
            this.$notify({
              type: 'success',
              message: res.retMsg
            })
            this.listPharmaceuticalPage()
          })
        })
      },
      addYaoji(e) {
        this.addVisible = true
        this.form = {}
      },
      sumbityaoji() {
        this.$refs.form1.validate((valid) => {
          if (valid) {
            addPharmaceutical(this.form).then(res => {
              console.log(res)
              this.$notify({
                type: 'success',
                message: res.retMsg
              })
              this.addVisible = false
              this.listPharmaceuticalPage()
            })
          }
        })
      },
      editSubmit() {
        this.$refs.form1.validate((valid) => {
          if (valid) {
            updatePharmaceutical(this.form).then(res => {
              console.log(res)
              this.$notify({
                type: 'success',
                message: res.retMsg
              })
              this.editVisible = false
              this.listPharmaceuticalPage()
            })
          }
        })
      },
      listPharmaceuticalPage() { // 全部试剂 新增使用
        listPharmaceuticalPage({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          pharmaceuticalName: this.pharmaceuticalName,
          status: this.status
        }).then(res => {
          console.log(res)
          this.records = res.retData.records
          this.total = res.retData.total
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

</style>
