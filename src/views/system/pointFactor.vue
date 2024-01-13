<template>
  <div class="testPaper">
    <!-- 条件栏 -->
    <div class="headClass">
      企业名称：
      <treeselect v-model="companyId" :multiple="false" :options="comlist" :normalizer="normalizer" placeholder="请选择企业"
        class="seachInput" style="width:300px" @input="changeCom" />
      点位名称：
      <treeselect v-model="pointId" :multiple="false" :options="dianweiList" :normalizer="normalizer2"
        placeholder="请选择点位" class="seachInput" style="width:300px" />
      因子名称：
      <treeselect v-model="factorId" :multiple="false" :options="factorList" :normalizer="normalizer3"
        placeholder="请选择因子" class="seachInput" style="width:300px" />

      污染源种类：
      <el-select v-model="pollutionType" placeholder="请选择污染源种类" clearable class="seachInput">
        <el-option label="废水" :value="1" />
        <el-option label="废气" :value="2" />
        <el-option label="vocs" :value="3" />
        <el-option label="地表水" :value="4" />
        <el-option label="其他" :value="5" />
      </el-select>

      <el-button type="primary" @click="seach">搜索</el-button>
      <el-button type="primary" @click="addShebei">新增因子</el-button>
    </div>

    <!-- 表格 -->
    <el-table v-loading="listLoading" :data="records" element-loading-text="加载中" border fit highlight-current-row stripe
      style="margin-top:1.04vw" height="calc(100vh - 84px - 60px - 40px - 32px - 1.04vw - 17px)">
      <el-table-column align="center" label="企业简称" prop="comShortName" />
      <el-table-column align="center" label="点位名称" prop="pointName" />
      <el-table-column align="center" label="因子名称">
        <template slot-scope="scope">
          {{ computedNull(scope.row.factorName) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="因子编码">
        <template slot-scope="scope">
          {{ computedNull(scope.row.factorCode) }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="超标下限">
        <template slot-scope="scope">
          {{ computedNull(scope.row.alarmLowerLimit) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="超标上限">
        <template slot-scope="scope">
          {{ computedNull(scope.row.alarmUpperLimit) }}
        </template>
      </el-table-column>



      <el-table-column align="center" label="预警系数">
        <template slot-scope="scope">
          {{ computedNull(scope.row.earlyWarningCoefficient) }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="超标预警">
        <template slot-scope="scope">
          {{ computedNull(scope.row.isMinuteName) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="恒值预警">
        <template slot-scope="scope">
          {{ computedNull(scope.row.isConstantName) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="出零预警">
        <template slot-scope="scope">
          {{ computedNull(scope.row.isZeroOutName) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="折算校验">
        <template slot-scope="scope">
          {{ computedNull(scope.row.isCorrectedName) }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="小程序展示">
        <template slot-scope="scope">
          {{ computedNull(scope.row.isDisplayName) }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200px">
        <template slot-scope="scope">
          <el-button @click="editPoint(scope.row)">编辑</el-button>
          <!-- <el-button @click="gotoPoint(scope.row)">设备管理</el-button>
          <el-button @click="gotoPoint(scope.row)">因子管理</el-button> -->
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

    <el-dialog v-if="addVisible" title="新增因子" :append-to-body="true" :visible="addVisible" width="40%"
      :close-on-click-modal="false" @close="addVisible=false">
      <el-form ref="form1" :model="form" label-width="200px" :rules="rules">
        <el-form-item label="企业名称" prop="companyId">
          <treeselect v-model="form.companyId" :multiple="false" :options="comlist" :normalizer="normalizer"
            placeholder="请选择企业" :clearable="false" @input="changeCom2" />
        </el-form-item>
        <el-form-item label="点位名称" prop="pointId">
          <treeselect v-model="form.pointId" :multiple="false" :options="dianweiList2" :normalizer="normalizer2"
            placeholder="请选择点位名称" @input="changePointId" />
        </el-form-item>
        <el-form-item label="因子名称" prop="factorCode">
          <treeselect v-model="form.factorCode" :multiple="false" :options="factorList" :normalizer="normalizer3"
            placeholder="请选择因子" @input="changeFactorCode" />
        </el-form-item>

        <el-form-item label="浓度报警下限值" prop="alarmLowerLimit">
          <el-input-number v-model="form.alarmLowerLimit" placeholder="报警下限值" />
        </el-form-item>
        <el-form-item label="浓度报警上限值" prop="alarmUpperLimit">
          <el-input-number v-model="form.alarmUpperLimit" placeholder="报警上限值" />
          <div v-if="alarmShow" class="alarmShow">上限值需小于下限值</div>
        </el-form-item>
        <el-form-item label="预警系数" prop="earlyWarningCoefficient">
          <el-input-number v-model="form.earlyWarningCoefficient" />
        </el-form-item>
        <el-form-item label="小程序是否展示" prop="isDisplay">
          <el-switch v-model="form.isDisplay" active-text="是" inactive-text="否" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item label="是否参与分钟值超标预警判断" prop="isMinute">
          <el-switch v-model="form.isMinute" active-text="是" inactive-text="否" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item label="是否参与恒值预警判断" prop="isConstant">
          <el-switch v-model="form.isConstant" active-text="是" inactive-text="否" :active-value="1"
            :inactive-value="0" />
        </el-form-item>
        <el-form-item label="是否参与出零预警判断" prop="isZeroOut">
          <el-switch v-model="form.isZeroOut" active-text="是" inactive-text="否" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item label="是否参与折算判断" prop="isCorrected">
          <el-switch v-model="form.isCorrected" active-text="是" inactive-text="否" :active-value="1"
            :inactive-value="0" />
        </el-form-item>
        <div style="text-align:center;margin-top:80px">
          <el-button @click="addVisible=false">取 消</el-button>
          <el-button type="primary" @click="sumbitPoint">确 定</el-button>
        </div>
      </el-form>
    </el-dialog>

    <el-dialog v-if="editVisible" title="编辑因子" :append-to-body="true" :visible="editVisible" width="40%"
      :close-on-click-modal="false" @close="editVisible=false">

      <el-form ref="form1" :model="form" label-width="200px" :rules="rules">
        <el-form-item label="企业名称">
          {{ form.comName }}
        </el-form-item>
        <el-form-item label="点位名称">
          {{ form.pointName }}
        </el-form-item>
        <el-form-item label="因子名称">
          {{ form.factorName }}
        </el-form-item>
        <el-form-item label="浓度报警下限值" prop="alarmLowerLimit">
          <el-input-number v-model="form.alarmLowerLimit" placeholder="报警下限值" />
        </el-form-item>
        <el-form-item label="浓度报警上限值" prop="alarmUpperLimit">
          <el-input-number v-model="form.alarmUpperLimit" placeholder="报警上限值" />
          <div v-if="alarmShow" class="alarmShow">上限值需小于下限值</div>
        </el-form-item>
        <el-form-item label="预警系数" prop="earlyWarningCoefficient">
          <el-input-number v-model="form.earlyWarningCoefficient" />
        </el-form-item>
        <el-form-item label="小程序是否展示" prop="isDisplay">
          <el-switch v-model="form.isDisplay" active-text="是" inactive-text="否" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item label="是否参与分钟值超标预警判断" prop="isMinute">
          <el-switch v-model="form.isMinute" active-text="是" inactive-text="否" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item label="是否参与恒值预警判断" prop="isConstant">
          <el-switch v-model="form.isConstant" active-text="是" inactive-text="否" :active-value="1"
            :inactive-value="0" />
        </el-form-item>
        <el-form-item label="是否参与出零预警判断" prop="isZeroOut">
          <el-switch v-model="form.isZeroOut" active-text="是" inactive-text="否" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item label="是否参与折算判断" prop="isCorrected">
          <el-switch v-model="form.isCorrected" active-text="是" inactive-text="否" :active-value="1"
            :inactive-value="0" />
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
  import Treeselect from '@riophae/vue-treeselect'
  // import the styles
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'

  import {
    listPointFactorPage,
    listCompanySel,
    listShortPointSel,
    listInstrumentTypeSel,
    updatePointFactor,
    listFactorSel,
    addPointFactor,
    deletePointFactor,
    getFactor
  } from '@/api/table'
  import {
    mapGetters
  } from 'vuex'
  // import moment from 'moment'
  export default {
    name: 'PointFactor',
    components: {
      Treeselect
    },
    data() {
      return {
        pageIndex: 1,
        pageSize: 10,
        companyId: null,
        groupId: null,
        pointId: null,
        factorId: null,
        total: 0,
        records: [],
        comlist: [],
        groupList: [],
        pointStatus: '',
        pollutionType: '',
        comName: '',
        pointName: '',
        status: '',
        addVisible: false,
        editVisible: false,
        listLoading: false,
        alarmShow: false,
        form: {},
        allyjList: [], // 全部药剂列表
        yaojiChoose: [], // 全部药剂列表
        shebeilist: [], // 全部药剂列表
        dianweiList: [], // 全部药剂列表
        dianweiList2: [], // 全部药剂列表
        factorList: [], // 全部药剂列表
        options: [{
          value: 1,
          label: '在用'
        }, {
          value: 2,
          label: '停运'
        }, {
          value: 3,
          label: '建设'
        }, {
          value: 4,
          label: '合同转包'
        }, {
          value: 5,
          label: '合同终止'
        }, {
          value: 6,
          label: '拆除'
        }],
        rules: {

          companyId: [{
            required: true,
            message: '请选择企业名称',
            trigger: 'input'
          }],
          pointId: [{
            required: true,
            message: '请选择点位名称',
            trigger: 'input'
          }],
          factorCode: [{
            required: true,
            message: '请选择因子名称',
            trigger: 'input'
          }],
          alarmUpperLimit: [{
            required: true,
            message: '请输入浓度报警上限值',
            trigger: 'change'
          }],
          alarmLowerLimit: [{
            required: true,
            message: '请输入浓度报警下限值',
            trigger: 'change'
          }]

          // socialCreditCode: [{
          //   required: true,
          //   message: '请输入统一社会信用代码',
          //   trigger: 'blur'
          // }, {
          //   len: 18,
          //   message: '请输入18位统一社会信用代码',
          //   trigger: 'blur'
          // }]
        },
        normalizer(node) {
          return {
            id: node.companyId,
            label: node.comName,
            children: node.children && node.children.length ? node.children : 0
          }
        },
        normalizer2(node) {
          return {
            id: node.pointId,
            label: node.pointName,
            children: node.children && node.children.length ? node.children : 0
          }
        },
        normalizer3(node) {
          return {
            id: node.factorCode,
            label: node.factorName,
            children: node.children && node.children.length ? node.children : 0
          }
        }

      }
    },
    computed: {
      ...mapGetters([
        'userId', 'roleId', 'userGroupId'
      ])
    },
    activated() {
      console.log(this.$route.params)
      if (JSON.stringify(this.$route.params) !== '{}') {
        this.companyId = this.$route.params.companyId
        console.log('更新数据')
        setTimeout(() => {
          this.pointId = this.$route.params.pointId
          this.listPointFactorPage()
        }, 1000)
      } else {
        this.listPointFactorPage()
      }
    },
    mounted() {
      this.listCompanySel()
      // this.listShortPointSel2()
      this.listInstrumentTypeSel()
      // this.listShortPointSel()
      this.listFactorSel()
    },
    methods: {
      computedNull(val) {
        if (val === undefined || val === null || val === '' || val === ' ') {
          return '-'
        } else {
          return val
        }
      },
      changeCom(node, instanceId) {
        console.log('🚀 ~ changeCom ~ node,instanceId:', node, instanceId)
        if (node === undefined) {
          this.dianweiList = []
        } else {
          this.listShortPointSel()
        }
        this.pointId = null
      },
      changeCom2(node, instanceId) {
        console.log('🚀 ~ changeCom ~ node,instanceId:', node, instanceId)
        this.listShortPointSel2()
        // this.form.pointId = null
        this.$set(this.form, 'pointId', null)
        this.$refs['form1'].validateField('companyId')
      },
      changePointId() {
        this.$refs['form1'].validateField('pointId')
      },
      changeFactorCode(e) {
        console.log(e)
        if (e) {
          getFactor({
            factorCode: e
          }).then(res => {
            console.log(res)
            this.form.isDisplay = res.retData.defaultDisplay
            this.form.isMinute = res.retData.defaultMinute
            this.form.isConstant = res.retData.defaultConstant
            this.form.isZeroOut = res.retData.defaultZeroOut
            this.form.isCorrected = res.retData.defaultCorrected
            this.form.earlyWarningCoefficient = res.retData.defaultCoefficient
          })
        }
        this.$refs['form1'].validateField('factorCode')
      },
      listInstrumentTypeSel() { // 设备类型
        listInstrumentTypeSel({}).then(res => {
          this.shebeilist = res.retData
        })
      },
      listFactorSel() { // 所有因子列表
        listFactorSel({}).then(res => {
          this.factorList = res.retData
        })
      },
      listShortPointSel() { // 点位id
        listShortPointSel({
          companyId: this.companyId || ''
        }).then(res => {
          console.log(res)
          this.dianweiList = res.retData
        })
      },
      listShortPointSel2() { // 点位id
        listShortPointSel({
          companyId: this.form.companyId || ''
        }).then(res => {
          console.log(res)
          this.dianweiList2 = res.retData
        })
      },
      listCompanySel() { // 公司id
        listCompanySel({}).then(res => {
          console.log(res)
          this.comlist = res.retData
        })
      },
      listPointFactorPage() {
        listPointFactorPage({
          companyId: this.companyId || '',
          pointId: this.pointId || '',
          factorCode: this.factorId || '',
          pollutionType: this.pollutionType || '',
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          roleId: this.roleId,
          groupId: this.userGroupId
        }).then(res => {
          console.log(res)
          this.records = res.retData.records
          this.total = res.retData.total
        })
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.listPointFactorPage()
      },
      handleCurrentChange(val) {
        this.pageIndex = val
        this.listPointFactorPage()
      },
      seach() {
        this.pageIndex = 1
        this.listPointFactorPage()
      },
      editPoint(e) {
        this.editVisible = true
        this.alarmShow = false
        this.form = Object.assign({}, e)
        console.log('🚀 ~ editPoint ~   this.form:', this.form)
      },
      remove(e) {
        this.$confirm('此操作将永久删除点位因子, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deletePointFactor({
            pointFactorId: e.pointFactorId
          }).then(res => {
            this.$notify({
              type: 'success',
              message: res.retMsg
            })
            this.listPointFactorPage()
          })
        })
      },
      addShebei(e) {
        this.addVisible = true
        this.form = {
          companyId: null,
          pointId: null,
          factorCode: null,
          earlyWarningCoefficient: 0,
          isDisplay: 1,
          isMinute: 1,
          isConstant: 1,
          isZeroOut: 1,
          isCorrected: 1,
          alarmLowerLimit: 0,
          alarmUpperLimit: 0


          // isAbnormalFluctuation: 1,
          // isCorrected: 1
        }
        this.alarmShow = false
        if (this.companyId) {
          this.form.companyId = this.companyId
          this.listShortPointSel2()
        }
        if (this.pointId) {
          this.form.pointId = this.pointId
        }
      },
      sumbitPoint() {
        this.$refs.form1.validate((valid) => {
          if (valid) {
            if (this.form.alarmLowerLimit > this.form.alarmUpperLimit) {
              this.alarmShow = true
              return
            } else {
              this.alarmShow = false
            }

            addPointFactor(this.form).then(res => {
              console.log(res)
              this.$notify({
                type: 'success',
                message: res.retMsg
              })
              this.addVisible = false
              this.listPointFactorPage()
            })
          }
        })
      },
      editSubmit() {
        this.$refs.form1.validate((valid) => {
          if (valid) {
            if (this.form.alarmLowerLimit > this.form.alarmUpperLimit) {
              this.alarmShow = true
              return
            } else {
              this.alarmShow = false
            }
            updatePointFactor(this.form).then(res => {
              console.log(res)
              this.$notify({
                type: 'success',
                message: res.retMsg
              })
              this.editVisible = false
              this.listPointFactorPage()
            })
          }
        })
      },
      gotoPoint(e) {
        console.log(e)
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

  .alarmShow {
    color: #F56C6C;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
  }

</style>
