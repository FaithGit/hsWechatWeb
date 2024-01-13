<template>
  <div class="testPaper">
    <!-- 条件栏 -->
    <div class="headClass">
      因子名称：
      <el-input v-model="factorName" class="seachInput" placeholder="请选择输入因子名称" clearable />
      因子编码：
      <el-input v-model="factorCode" class="seachInput" placeholder="请选择输入因子编码" clearable />
      因子类型：
      <el-select v-model="factorType" class="seachInput" clearable>
        <el-option :value="1" label="水" />
        <el-option :value="2" label="气" />
        <el-option :value="3" label="通用" />
      </el-select>

      <el-button type="primary" @click="seach">搜索</el-button>
      <el-button type="primary" @click="addShebei">新增因子</el-button>
    </div>

    <!-- 表格 -->
    <el-table v-loading="listLoading" :data="records" element-loading-text="加载中" border fit highlight-current-row stripe
      style="margin-top:1.04vw" height="calc(100vh - 84px - 60px - 40px - 32px - 1.04vw - 17px)">
      <el-table-column align="center" label="#" width="95">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="因子名称">
        <template slot-scope="scope">
          {{ computedNull(scope.row.factorName) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="因子简称">
        <template slot-scope="scope">
          {{ computedNull(scope.row.factorShortName) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="因子编码">
        <template slot-scope="scope">
          {{ computedNull(scope.row.factorCode) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="因子种类">
        <template slot-scope="scope">
          {{ computedNull(scope.row.factorTypeName) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="缺省计量单位(排放量)">
        <template slot-scope="scope">
          {{ computedNull(scope.row.dischargeUnit) }}
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="缺省数据类型(浓度)">
        <template slot-scope="scope">

          {{ computedNull(scope.row.concentrationDataType) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="缺省计量单位(浓度)">
        <template slot-scope="scope">
          {{ computedNull(scope.row.concentrationUnit) }}
        </template>
      </el-table-column> -->
      <el-table-column align="center" label="排序号">
        <template slot-scope="scope">
          {{ computedNull(scope.row.orderNum) }}
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="原编码">
        <template slot-scope="scope">
          {{ computedNull(scope.row.originalCode) }}
        </template>
      </el-table-column> -->
      <el-table-column align="center" label="超标预警">
        <template slot-scope="scope">
          {{ computedNull(scope.row.defaultMinuteName) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="恒值预警">
        <template slot-scope="scope">
          {{ computedNull(scope.row.defaultConstantName) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="出零预警">
        <template slot-scope="scope">
          {{ computedNull(scope.row.defaultZeroOutName) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="折算校验">
        <template slot-scope="scope">
          {{ computedNull(scope.row.defaultCorrectedName) }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="小程序展示">
        <template slot-scope="scope">
          {{ computedNull(scope.row.defaultDisplayName) }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button @click="editPoint(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="buttonPagination">
      <el-pagination :current-page="pageIndex" :page-sizes="[10,20,30,40,50]" :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>

    <el-dialog v-if="addVisible" :title="digTitle" :append-to-body="true" :visible="addVisible" width="50%"
      :close-on-click-modal="false" @close="addVisible=false">
      <el-form ref="form1" :model="form" :rules="rules">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="因子名称" prop="factorName">
              <el-input v-model="form.factorName" placeholder="请输入因子名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="因子简称" prop="factorShortName">
              <el-input v-model="form.factorShortName" placeholder="请输入因子简称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="因子编码" prop="factorCode">
              <el-input v-model="form.factorCode" placeholder="请输入因子编码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="因子类型" prop="factorType">
              <el-select v-model="form.factorType" clearable style="width:100%">
                <el-option :value="1" label="水" />
                <el-option :value="2" label="气" />
                <el-option :value="3" label="通用" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="原编码" prop="originalCode">
              <el-input v-model="form.originalCode" placeholder="请输入原编码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="缺省计量单位(浓度)" prop="concentrationUnit">
              <el-input v-model="form.concentrationUnit" placeholder="请输入缺省计量单位(浓度)" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="缺省计量单位(排放量)" prop="dischargeUnit">
              <el-input v-model="form.dischargeUnit" placeholder="请输入缺省计量单位(排放量)" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="缺省数据类型(浓度)" prop="concentrationDataType">
              <el-input v-model="form.concentrationDataType" placeholder="请输入缺省数据类型(浓度)" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预警系数" prop="defaultCoefficient">
              <el-input-number v-model="form.defaultCoefficient" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否展示" prop="defaultDisplay">
              <el-switch v-model="form.defaultDisplay" active-text="是" inactive-text="否" :active-value="1"
                :inactive-value="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否参与分钟值超标预警判断" prop="defaultMinute">
              <el-switch v-model="form.defaultMinute" active-text="是" inactive-text="否" :active-value="1"
                :inactive-value="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否参与恒值预警判断" prop="defaultConstant">
              <el-switch v-model="form.defaultConstant" active-text="是" inactive-text="否" :active-value="1"
                :inactive-value="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否参与出零预警判断" prop="defaultZeroOut">
              <el-switch v-model="form.defaultZeroOut" active-text="是" inactive-text="否" :active-value="1"
                :inactive-value="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否参与脱机预警判断" prop="defaultOffLine">
              <el-switch v-model="form.defaultOffLine" active-text="是" inactive-text="否" :active-value="1"
                :inactive-value="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否参与异常波动预警判断" prop="defaultAbnormalFluctuation">
              <el-switch v-model="form.defaultAbnormalFluctuation" active-text="是" inactive-text="否" :active-value="1"
                :inactive-value="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">

            <el-form-item label="是否参与折算校验" prop="defaultCorrected">
              <el-switch v-model="form.defaultCorrected" active-text="是" inactive-text="否" :active-value="1"
                :inactive-value="0" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="排序号" prop="orderNum">
          <el-input-number v-model="form.orderNum" />
        </el-form-item>

        <div style="text-align:center;margin-top:80px">
          <el-button @click="addVisible=false">取 消</el-button>
          <el-button v-if="digTitle=='新增因子'" type="primary" @click="sumbitPoint">确 定</el-button>
          <el-button v-else type="primary" @click="editSubmit">更 新</el-button>
        </div>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
  import {
    listFactorPage,
    addFactor,
    getFactorById,
    updateFactor
  } from '@/api/table'
  import {
    mapGetters
  } from 'vuex'
  export default {
    name: 'Factor',
    data() {
      return {
        factorCode: '',
        factorName: '', 
        factorType: '',
        pageIndex: 1,
        pageSize: 10,
        listLoading: false,
        addVisible: false,
        digTitle: '新增因子',
        total: 0,
        records: [],
        form: {},
        rules: {
          factorName: [{
            required: true,
            message: '请输入因子名称',
            trigger: 'blur'
          }],
          factorCode: [{
            required: true,
            message: '请输入因子编码',
            trigger: 'blur'
          }],
          factorType: [{
            required: true,
            message: '请输入因子编码',
            trigger: 'blur'
          }]

        }
      }
    },
    computed: {
      ...mapGetters([
        'userId'
      ])
    },
    mounted() {
      this.listFactorPage()
    },
    methods: {
      listFactorPage() {
        listFactorPage({
          factorCode: this.factorCode || '',
          factorName: this.factorName || '',
          factorType: this.factorType || '',
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }).then(res => {
          console.log(res)
          this.records = res.retData.records
          this.total = res.retData.total
        })
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.listFactorPage()
      },
      handleCurrentChange(val) {
        this.pageIndex = val
        this.listFactorPage()
      },
      seach() {
        this.pageIndex = 1
        this.listFactorPage()
      },
      editPoint(e) {
        this.addVisible = true
        this.digTitle = '编辑因子'

        getFactorById({
          factorId: e.factorId
        }).then(res => {
          this.form = res.retData
        })

        console.log('🚀 ~ editPoint ~   this.form:', this.form)
      },
      remove(e) {
        this.$confirm('此操作将永久删除点位因子, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // deletePointFactor({
          //   pointFactorId: e.pointFactorId
          // }).then(res => {
          //   this.$notify({
          //     type: 'success',
          //     message: res.retMsg
          //   })
          //   this.listFactorPage()
          // })
        })
      },
      addShebei(e) {
        this.addVisible = true
        this.digTitle = '新增因子'
        this.form = {
          factorCode: '',
          factorName: '',
          factorShortName: '',
          factorType: '',
          originalCode: '',
          concentrationUnit: '',
          dischargeUnit: '',
          concentrationDataType: '',
          defaultCoefficient: 0,
          defaultDisplay: 0,
          defaultMinute: 0,
          defaultConstant: 0,
          defaultZeroOut: 0,
          defaultOffLine: 0,
          defaultAbnormalFluctuation: 0,
          defaultCorrected: 0,
          remark: '',
          orderNum: 0
        }
      },
      sumbitPoint() {
        this.$refs.form1.validate((valid) => {
          if (valid) {
            addFactor(this.form).then(res => {
              console.log(res)
              this.$notify({
                type: 'success',
                message: res.retMsg
              })
              this.addVisible = false
              this.listFactorPage()
            })
          }
        })
      },
      editSubmit() {
        this.$refs.form1.validate((valid) => {
          if (valid) {
            updateFactor(this.form).then(res => {
              console.log(res)
              this.$notify({
                type: 'success',
                message: res.retMsg
              })
              this.addVisible = false
              this.listFactorPage()
            })
          }
        })
      },
      computedNull(val) {
        if (val === undefined || val === null || val === '' || val === ' ') {
          return '-'
        } else {
          return val
        }
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
