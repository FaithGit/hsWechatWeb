<template>
  <div class="testPaper">
    <!-- 条件栏 -->
    <div>
      标液名称：
      <el-input v-model="byname" class="seachInput" placeholder="请选择输入关键字" clearable />
      <el-button type="primary" @click="seach">搜索</el-button>
      <el-button type="primary" @click="addYaoji">新增标液</el-button>
    </div>

    <!-- 表格 -->
    <el-table v-loading="listLoading" :data="records" element-loading-text="加载中" border fit highlight-current-row
      style="margin-top:1.04vw">
      <el-table-column align="center" label="#" width="95">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="标液名称" prop="name" />
      <el-table-column align="center" label="每毫升标液需要的量" prop="concentrationCoefficient" />
      <el-table-column align="center" label="有效天数" prop="effectDay" />
      <el-table-column align="center" label="标液单位" prop="unit" />
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

    <el-dialog v-if="addVisible" title="新增标液" :append-to-body="true" :visible="addVisible" width="40%"
      :close-on-click-modal="false" @close="addVisible=false">
      <el-form ref="form1" :model="form" label-width="160px" :rules="rules">
        <el-form-item label="标液名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入标液名称" />
        </el-form-item>
        <el-form-item label="每毫升标液需要的量" prop="concentrationCoefficient">
          <el-input v-model="form.concentrationCoefficient" placeholder="请输入每毫升标液需要的量" />
        </el-form-item>
        <el-form-item label="有效天数" prop="effectDay">
          <el-input v-model="form.effectDay" placeholder="请输入有效天数" />
        </el-form-item>
        <div style="text-align:center;margin-top:80px">
          <el-button @click="addVisible=false">取 消</el-button>
          <el-button type="primary" @click="sumbityaoji">确 定</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog v-if="editVisible" title="编辑标液" :append-to-body="true" :visible="editVisible" width="40%"
      :close-on-click-modal="false" @close="editVisible=false">
      <el-form ref="form1" :model="form" label-width="160px" :rules="rules">
        <el-form-item label="标液名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入标液名称" />
        </el-form-item>
        <el-form-item label="每毫升标液需要的量" prop="concentrationCoefficient">
          <el-input v-model="form.concentrationCoefficient" placeholder="请输入每毫升标液需要的量" />
        </el-form-item>
        <el-form-item label="有效天数" prop="effectDay">
          <el-input v-model="form.effectDay" placeholder="请输入有效天数" />
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
    updateStandardSolution,
    listStandardSolution,
    addStandardSolution,
    removeStandardSolution
  } from '@/api/table'
  import {
    mapGetters
  } from 'vuex'
  // import moment from 'moment'
  export default {
    name: 'Shiji',
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
        byname: "",
        status: "",
        addVisible: false,
        editVisible: false,
        listLoading: false,
        form: {},
        allyjList: [], //全部药剂列表
        yaojiChoose: [], //全部药剂列表
        rules: {
          name: [{
            required: true,
            message: '请输入标液名称',
            trigger: 'blur'
          }],
          concentrationCoefficient: [{
            required: true,
            message: '请输入每毫升标液需要的量',
            trigger: 'blur'
          }],
          effectDay: [{
            required: true,
            message: '有效天数',
            trigger: 'blur'
          }],
        },

      }
    },
    mounted() {
      this.listStandardSolution()
    },
    methods: {
      handleSizeChange(val) {
        this.pageSize = val
        this.listStandardSolution()
      },
      handleCurrentChange(val) {
        this.pageIndex = val
        this.listStandardSolution()
      },
      seach() {
        this.pageIndex = 1
        this.listStandardSolution()
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
          removeStandardSolution({
            id: e.id
          }).then(res => {
            this.$notify({
              type: "success",
              message: res.retMsg
            })
            this.listStandardSolution()
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
            addStandardSolution(this.form).then(res => {
              console.log(res)
              this.$notify({
                type: "success",
                message: res.retMsg
              })
              this.addVisible = false
              this.listStandardSolution()
            })
          }
        })
      },
      editSubmit() {
        this.$refs.form1.validate((valid) => {
          if (valid) {
            updateStandardSolution(this.form).then(res => {
              console.log(res)
              this.$notify({
                type: "success",
                message: res.retMsg
              })
              this.editVisible = false
              this.listStandardSolution()
            })
          }
        })
      },
      listStandardSolution() { //全部试剂 新增使用
        listStandardSolution({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          name: this.byname
        }).then(res => {
          console.log(res)
          this.records = res.retData.records
          this.total = res.retData.total
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

</style>
