<template>
  <div class="testPaper">
    <!-- 条件栏 -->
    <div class="headClass">
      部门：
      <treeselect v-model="departmentId" :multiple="false" :options="bumenList" :normalizer="normalizer"
        placeholder="请选择部门" class="seachInput" @input="changeDepartId">
        <label slot="option-label" slot-scope="{ node, labelClassName }" :class="labelClassName" :title="node.label">
          {{ node.label }}
        </label>
      </treeselect>
      组：
      <treeselect v-model="groupIds" :multiple="true" :options="zuList" :normalizer="normalizer2" placeholder="请选择组"
        style="min:width:500px;max-width:60vw">
        <label slot="option-label" slot-scope="{ node, labelClassName }" :class="labelClassName" :title="node.label">
          {{ node.label }}
        </label>
      </treeselect>
      <el-button type="primary" @click="seach" style="margin-left:10px">搜索</el-button>
    </div>
    <div style="margin-top:10px;display:flex;align-items: center">
      配置人：
      <treeselect v-model="preparationPeople" :multiple="false" :options="userList" :normalizer="normalizer3"
        placeholder="请选择配置人" class="seachInput">
        <label slot="option-label" slot-scope="{ node, labelClassName }" :class="labelClassName" :title="node.label">
          {{ node.label }}
        </label>
      </treeselect>
      时间范围：
      <el-date-picker v-model="time" type="daterange" range-separator="至" start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
      <el-button type="primary" @click="daochu" style="margin-left:10px" icon="el-icon-download">导出</el-button>

    </div>

    <el-tabs v-model="activeName" @tab-click="handleClick" style="margin-top:10px">
      <el-tab-pane label="试剂报表" name="first"></el-tab-pane>
      <el-tab-pane label="药剂使用报表" name="second"></el-tab-pane>
      <el-tab-pane label="试剂配置明细" name="third"></el-tab-pane>
    </el-tabs>

    <!-- 表格 -->
    <el-table v-loading="listLoading" :data="records" element-loading-text="加载中" border fit highlight-current-row stripe
      v-if="activeName == 'first'" ref="firstTable">
      <el-table-column align="center" label="#" width="95">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="试剂名称">
        <template slot-scope="scope">
          {{ computedNull(scope.row.reagentName) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="配置数量(瓶次)"  sortable :sort-method="sortNumWithTotal">
        <template slot-scope="scope">
          {{ computedNull(scope.row.num) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="工时">
        <template slot-scope="scope">
          {{ computedNull(scope.row.workingHour) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="浓度单位">
        <template slot-scope="scope">
          {{ computedNull(scope.row.concentration) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="主要药剂名称">
        <template slot-scope="scope">
          {{ computedNull(scope.row.concentrationName) }}
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格 -->
    <el-table v-loading="listLoading" :data="records" element-loading-text="加载中" border fit highlight-current-row stripe
      v-if="activeName == 'second'">
      <el-table-column align="center" label="#" width="95">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="药剂名称">
        <template slot-scope="scope">
          {{ computedNull(scope.row.pharmaceuticalName) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="理论使用">
        <template slot-scope="scope">
          {{ computedNull(scope.row.theoreticalUsed) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="实际使用">
        <template slot-scope="scope">
          {{ computedNull(scope.row.realUsed) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="单位">
        <template slot-scope="scope">
          {{ computedNull(scope.row.unit) }}
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格 -->
    <el-table v-loading="listLoading" :data="records" element-loading-text="加载中" border fit highlight-current-row stripe
      v-if="activeName == 'third'">
      <el-table-column align="center" label="#" width="95">
        <template slot-scope="scope">
          {{ (pageIndex - 1) * 10 + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="申请人">
        <template slot-scope="scope">
          {{ computedNull(scope.row.applyUserName) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="试剂名称">
        <template slot-scope="scope">
          {{ computedNull(scope.row.reagentName) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="申请领用时间">
        <template slot-scope="scope">
          {{ computedNull(scope.row.needTime) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="申请试剂数量">
        <template slot-scope="scope">
          {{ computedNull(scope.row.reagentQuantity) }}
        </template>
      </el-table-column>
    </el-table>


    <!-- 分页 -->
    <div class="buttonPagination" v-if="activeName == 'third'">
      <el-pagination :current-page="pageIndex" :page-sizes="[10, 20, 30, 40, 50, 100, 500, 1000]" :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>

  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

import {
  listFactorPage,
  addFactor,
  getFactorById,
  updateFactor,
  listReagentDepartment,
  listGroupByDepartment,
  getReagentStatement,
  getPharmaceuticalStatement,
  reagentStatementDetail,
  exportReagentStatement,
  exportPharmaceuticalStatement,
  exportReagentStatementDetail,
  listUserSelChoose
} from '@/api/table'
import {
  mapGetters
} from 'vuex'
import moment from 'moment'
export default {
  name: 'Sjbb',
  components: {
    Treeselect
  },
  data() {
    return {
      activeName: "first",
      factorCode: '',
      factorName: '',
      factorType: '',
      pageIndex: 1,
      pageSize: 10,
      listLoading: false,
      addVisible: false,
      digTitle: '新增因子',
      total: 0,
      departmentId: null,
      records: [],
      bumenList: [],
      groupIds: [],
      zuList: [],
      time: null,
      userList: [],
      preparationPeople: null,
      normalizer(node) {
        return {
          id: node.id,
          label: node.name,
          children: node.children && node.children.length ? node.children : 0
        }
      },
      normalizer2(node) {
        return {
          id: node.id,
          label: node.groupName,
          children: node.children && node.children.length ? node.children : 0
        }
      },
      normalizer3(node) {
        return {
          id: node.userId,
          label: node.userName,
          children: node.children && node.children.length ? node.children : 0
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'userId'
    ])
  },
  mounted() {
    this.listReagentDepartment()
    this.listGroupByDepartment()
    this.getReagentStatement()
    this.listUserSelChoose()
  },
  methods: {
    sortNumWithTotal(a, b) { // 自定义排序方法，确保“总计”始终在最下方
      if (a.standardSolutionName === '总计') {
        return this.$refs.firstTable?.table?.order === 'descending' ? -1 : 1;
      }
      if (b.standardSolutionName === '总计') {
        return this.$refs.firstTable?.table?.order === 'descending' ? 1 : -1;
      }
      return a.num - b.num;
    },
    listUserSelChoose() {
      listUserSelChoose({
        roleId: "syy"
      }).then(res => {
        console.log(res)
        this.userList = res.retData
        this.userList.shift()
      })
    },
    handleClick() { //avtiveClick
      console.log(this.activeName)
      if (this.activeName == 'first') {
        this.getReagentStatement()
      } else if (this.activeName == 'second') {
        this.getPharmaceuticalStatement()
      } else {
        this.reagentStatementDetail()
      }
    },
    daochu() {
      var startTime = ''
      var endTime = ''
      if (this.time !== null) {
        startTime = moment(this.time[0]).format("YYYY/MM/DD")
        endTime = moment(this.time[1]).format("YYYY/MM/DD 23:59:59")
      }
      if (this.activeName == 'first') {

        exportReagentStatement({
          groupIds: this.groupIds,
          preparationPeople: this.preparationPeople,
          startTime: startTime,
          endTime: endTime,
        }).then(res => {
          console.log(res)
          window.open(res.retData, "_self")

        })
      } else if (this.activeName == 'second') {
        exportPharmaceuticalStatement({
          groupIds: this.groupIds,
          preparationPeople: this.preparationPeople,
          startTime: startTime,
          endTime: endTime,
        }).then(res => {
          console.log(res)
          window.open(res.retData, "_self")
        })
      } else {
        exportReagentStatementDetail({
          groupIds: this.groupIds,
          preparationPeople: this.preparationPeople,
          startTime: startTime,
          endTime: endTime,
        }).then(res => {
          console.log(res)
          window.open(res.retData, "_self")
        })
      }
    },
    changeDepartId(e) { //改变部门ID
      console.log(e)
      this.listGroupByDepartment()
    },
    listReagentDepartment() { //部门
      listReagentDepartment({}).then(res => {
        console.log("listReagentDepartment", res)
        this.bumenList = res.retData
      })
    },
    listGroupByDepartment() { //组
      listGroupByDepartment({
        departmentId: this.departmentId || ''
      }).then(res => {
        console.log("listGroupByDepartment", res)
        this.zuList = res.retData
        let groupIds = []
        this.zuList.forEach(e => {
          groupIds.push(e.id)
        })
        this.groupIds = groupIds
      })
    },
    getReagentStatement() { //试剂报表
      var startTime = ''
      var endTime = ''
      if (this.time !== null) {
        startTime = moment(this.time[0]).format("YYYY/MM/DD")
        endTime = moment(this.time[1]).format("YYYY/MM/DD 23:59:59")
      }
      getReagentStatement({
        groupIds: this.groupIds,
        preparationPeople: this.preparationPeople,
        startTime: startTime,
        endTime: endTime,
      }).then(res => {
        console.log(res)
        let temp = res.retData
        let pc = 0
        let gs = 0
        temp.forEach(e => {
          pc += e.num
          gs += e.workingHour
        })
        temp.push({
          concentration: "-",
          num: pc,
          reagentName: "总计",
          workingHour: gs.toFixed(4),
        })
        this.records = res.retData
      })
    },
    getPharmaceuticalStatement() { //药剂使用报表
      var startTime = ''
      var endTime = ''
      if (this.time !== null) {
        startTime = moment(this.time[0]).format("YYYY/MM/DD")
        endTime = moment(this.time[1]).format("YYYY/MM/DD 23:59:59")
      }
      getPharmaceuticalStatement({
        groupIds: this.groupIds,
        preparationPeople: this.preparationPeople,
        startTime: startTime,
        endTime: endTime,
      }).then(res => {
        console.log(res)
        this.records = res.retData
      })
    },
    reagentStatementDetail() { //试剂配置明细
      var startTime = ''
      var endTime = ''
      if (this.time !== null) {
        startTime = moment(this.time[0]).format("YYYY/MM/DD")
        endTime = moment(this.time[1]).format("YYYY/MM/DD 23:59:59")
      }
      reagentStatementDetail({
        groupIds: this.groupIds,
        preparationPeople: this.preparationPeople,
        startTime: startTime,
        endTime: endTime,
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
      this.reagentStatementDetail()

    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.reagentStatementDetail()
    },

    seach() {
      this.pageIndex = 1
      console.log(this.time)
      this.handleClick()
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
