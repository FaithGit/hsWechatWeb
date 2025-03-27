<template>
  <div class="testPaper">
    <!-- 条件栏 -->
    <div>
      标气名称：
      <el-input v-model="byname" class="seachInput" placeholder="请输入关键字" clearable />
      <el-button type="primary" @click="seach">搜索</el-button>
      <el-button type="primary" @click="addYaoji">新增标气</el-button>
    </div>

    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="records"
      element-loading-text="加载中"
      border
      fit
      highlight-current-row
      stripe
      style="margin-top:1.04vw"
      height="calc(100vh - 84px - 60px - 40px - 32px - 1.04vw - 17px)"
    >
      <el-table-column align="center" label="#" width="95">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="标气名称" prop="name" />
      <el-table-column align="center" label="化学式" prop="chemicalFormula" />
      <el-table-column align="center" label="标气单位" prop="unit" />
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button @click="editShiji(scope.row)">编辑</el-button>
          <el-button type="danger" @click="remove(scope.row)"> 删除</el-button>
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
      v-if="addVisible"
      title="新增标气"
      :append-to-body="true"
      :visible="addVisible"
      width="40%"
      :close-on-click-modal="false"
      @close="addVisible=false"
    >
      <el-form ref="form1" :model="form" label-width="160px" :rules="rules">
        <el-form-item label="标气名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入标气名称" />
        </el-form-item>
        <el-form-item label="化学式" prop="chemicalFormula">
          <el-input v-model="form.chemicalFormula" placeholder="请输入化学式" />
        </el-form-item>
        <el-form-item label="单位">
          <el-input v-model="form.unit" placeholder="请输入单位" />
        </el-form-item>
        <div style="text-align:center;margin-top:80px">
          <el-button @click="addVisible=false">取 消</el-button>
          <el-button type="primary" @click="sumbityaoji">确 定</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog
      v-if="editVisible"
      title="编辑标气"
      :append-to-body="true"
      :visible="editVisible"
      width="40%"
      :close-on-click-modal="false"
      @close="editVisible=false"
    >
      <el-form ref="form1" :model="form" label-width="160px" :rules="rules">
        <el-form-item label="标气名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入标气名称" />
        </el-form-item>
        <el-form-item label="化学式" prop="chemicalFormula">
          <el-input v-model="form.chemicalFormula" placeholder="请输入化学式" />
        </el-form-item>
        <el-form-item label="单位" >
          <el-input v-model="form.unit" placeholder="请输入单位" />
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
  deletePharmaceutical,
  getReagent,
  addPharmaceutical,
  updatePharmaceutical,
  updateGas,
  listGasPage,
  saveGas,
  removeGas
} from '@/api/table'
import {
  mapGetters
} from 'vuex'
// import moment from 'moment'
export default {
  name: 'Gas',
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
      byname: '',
      status: '',
      addVisible: false,
      editVisible: false,
      listLoading: false,
      form: {},
      allyjList: [], // 全部药剂列表
      yaojiChoose: [], // 全部药剂列表
      rules: {
        name: [{
          required: true,
          message: '请输入标气名称',
          trigger: 'blur'
        }],
        chemicalFormula: [{
          required: true,
          message: '请输入化学式',
          trigger: 'blur'
        }],
        unit: [{
          required: true,
          message: '请输入单位',
          trigger: 'blur'
        }]
      }

    }
  },
  mounted() {
    this.listGasPage()
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val
      this.listGasPage()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.listGasPage()
    },
    seach() {
      this.pageIndex = 1
      this.listGasPage()
    },
    editShiji(e) {
      this.editVisible = true
      this.form = e
    },
    remove(e) {
      this.$confirm('此操作将永久删除该药剂, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeGas({
          id: e.id
        }).then(res => {
          this.$notify({
            type: 'success',
            message: res.retMsg
          })
          this.listGasPage()
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
          saveGas(this.form).then(res => {
            console.log(res)
            this.$notify({
              type: 'success',
              message: res.retMsg
            })
            this.addVisible = false
            this.listGasPage()
          })
        }
      })
    },
    editSubmit() {
      this.$refs.form1.validate((valid) => {
        if (valid) {
          updateGas(this.form).then(res => {
            console.log(res)
            this.$notify({
              type: 'success',
              message: res.retMsg
            })
            this.editVisible = false
            this.listGasPage()
          })
        }
      })
    },
    listGasPage() { // 全部试剂 新增使用
      listGasPage({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        gasName: this.byname
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
