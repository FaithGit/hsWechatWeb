<template>
  <div class="testPaper">
    <!-- 条件栏 -->
    <div class="headClass">
      企业名称：
      <treeselect v-model="companyId" :multiple="false" :options="comlist" :normalizer="normalizer" placeholder="请选择企业"
        class="seachInput" style="width:200px" @input="changeCom">
        <label slot="option-label" slot-scope="{ node, labelClassName }" :class="labelClassName" :title="node.label">
          {{ node.label }}
        </label>
      </treeselect>
      点位名称：
      <treeselect v-model="pointId" :multiple="false" :options="dianweiList" :normalizer="normalizer2"
        placeholder="请选择点位名称" class="seachInput" style="width:150px">
        <label slot="option-label" slot-scope="{ node, labelClassName }" :class="labelClassName" :title="node.label">
          {{ node.label }}
        </label>
      </treeselect>
      设备类型：
      <el-select v-model="pointStatus" placeholder="请选择设备类型" class="seachInput" clearable>
        <el-option v-for="item in shebeilist" :key="item.instrumentType + item.instrumentTypeName"
          :label="item.instrumentTypeName" :value="item.instrumentType" />
      </el-select>
      污染源种类：
      <el-select v-model="pollutionType" placeholder="请选择污染源种类" clearable class="seachInput" style="width:100px">
        <el-option label="废水" :value="1" />
        <el-option label="废气" :value="2" />
        <el-option label="vocs" :value="3" />
        <el-option label="地表水" :value="4" />
        <el-option label="其他" :value="5" />
      </el-select>
      点位是否存在设备：<el-select v-model="existInstrument" placeholder="是否存在" clearable class="seachInput" style="width:110px">
        <el-option label="不存在" :value="0" />
        <el-option label="存在" :value="1" />
      </el-select>
      <el-button type="primary" @click="seach">搜索</el-button>
      <el-button type="primary" @click="addShebei">新增设备</el-button>
      <el-button type="primary" @click="sdType = true">设备类型</el-button>
      <el-button type="primary" @click="daochu">导出</el-button>
    </div>

    <!-- 表格 -->
    <el-table v-loading="listLoading" :data="records" element-loading-text="加载中" border fit
      :span-method="arraySpanMethod" :row-class-name="tableRowClassName" style="margin-top:1.04vw"
      height="calc(100vh - 84px - 60px - 40px - 32px - 1.04vw - 17px)">
      <el-table-column align="center" label="#" width="95">
        <template slot-scope="scope">
          {{ (scope.row.index + 1) + (pageIndex - 1) * pageSize }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="企业名称" prop="comName" />
      <el-table-column align="center" label="点位名称" prop="pointName" />
      <el-table-column align="center" label="设备名称">
        <template slot-scope="scope">
          {{ computedNull(scope.row.instrumentName) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否需要维护">
        <template slot-scope="scope">
          {{ computedNull(scope.row.checkStatusName) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="工作量">
        <template slot-scope="scope">
          {{ computedNull(scope.row.workload) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="质保时间">
        <template slot-scope="scope">
          {{ computedNull(scope.row.warranty) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="开始年份">
        <template slot-scope="scope">
          {{ computedNull(scope.row.startYear) }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button v-if="scope.row.instrumentId != '-'" @click="editPoint(scope.row)">编辑</el-button>
          <el-button v-if="scope.row.instrumentId != '-'" type="danger" @click="remove(scope.row)"> 删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="buttonPagination">
      <el-pagination :current-page="pageIndex" :page-sizes="[10, 20, 30, 40, 50]" :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>

    <el-dialog v-if="addVisible" title="新增设备" :append-to-body="true" :visible="addVisible" width="40%"
      :close-on-click-modal="false" @close="addVisible = false">
      <el-form ref="form1" :model="form" label-width="140px" :rules="rules">
        <el-form-item label="企业名称" prop="companyId">
          <treeselect v-model="form.companyId" :multiple="false" :options="comlist" :normalizer="normalizer"
            placeholder="请选择企业" :clearable="false" @input="changeCom2">
            <label slot="option-label" slot-scope="{ node, labelClassName }" :class="labelClassName"
              :title="node.label">
              {{ node.label }}
            </label>
          </treeselect>
        </el-form-item>
        <el-form-item label="点位名称" prop="pointId">
          <treeselect v-model="form.pointId" :multiple="false" :options="dianweiList2" :normalizer="normalizer2"
            placeholder="请选择点位名称" @input="riskPersonDeptChangeValue">
            <label slot="option-label" slot-scope="{ node, labelClassName }" :class="labelClassName"
              :title="node.label">
              {{ node.label }}
            </label>
          </treeselect>
        </el-form-item>
        <el-form-item label="设备类型" prop="instrumentType">
          <el-select v-model="form.instrumentType" placeholder="请选择设备类型" @change="toggleInstrumentType">
            <el-option v-for="item in shebeilist" :key="'3' + item.instrumentType + item.instrumentTypeName"
              :label="item.instrumentTypeName" :value="item.instrumentType" />
          </el-select>
        </el-form-item>

        <el-form-item prop="correlationCoefficientK" v-if="form.instrumentType==2">
          <div slot="label" class="fulabel">
            相关性系数-K
            <el-popover placement="top-start" width="200" trigger="hover" content="相关性系数使用计算说明: COD = TOC * K + B">
              <i slot="reference" class="el-icon-question" />
            </el-popover>
          </div>
          <el-input v-model="form.correlationCoefficientK" placeholder="相关性系数-K" />
        </el-form-item>

        <el-form-item prop="correlationCoefficientB" v-if="form.instrumentType==2">
          <div slot="label" class="fulabel">
            相关性系数-B
            <el-popover placement="top-start" width="200" trigger="hover" content="相关性系数使用计算说明: COD = TOC * K + B">
              <i slot="reference" class="el-icon-question" />
            </el-popover>
          </div>
          <el-input v-model="form.correlationCoefficientB" placeholder="相关性系数-B" />
        </el-form-item>

        <el-form-item label="设备名称" prop="instrumentName">
          <el-input v-model="form.instrumentName" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="工作量" prop="workload">
          <el-input v-model="form.workload" placeholder="请输入工作量" />
        </el-form-item>

        <el-form-item label="开始时间年份" prop="startYear">
          <el-date-picker prop="startYear" v-model="form.startYear" type="year" placeholder="请输入开始时间年份"
            :editable="false">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="设备厂家型号" prop="instrumentFactoryModel">
          <el-input v-model="form.instrumentFactoryModel" placeholder="请输入设备厂家型号" />
        </el-form-item>

        <el-form-item label="质保时间">
          <el-date-picker v-model="form.warranty" type="date" placeholder="选择质保时间" :clearable="false">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="运维状态" prop="checkStatus">
          <el-select v-model="form.checkStatus" placeholder="请选择运维状态">
            <el-option label="不需要运维" :value="0" />
            <el-option label="需要运维" :value="1" />
          </el-select>
        </el-form-item>

        <el-form-item label="设备唯一码" prop="instrumentCode">
          <el-input v-model="form.instrumentCode" placeholder="请输入设备唯一码" />
        </el-form-item>

        <div style="text-align:center;margin-top:80px">
          <el-button @click="addVisible = false">取 消</el-button>
          <el-button type="primary" @click="sumbitPoint">确 定</el-button>
        </div>
      </el-form>
    </el-dialog>

    <el-dialog v-if="editVisible" title="编辑设备" :append-to-body="true" :visible="editVisible" width="40%"
      :close-on-click-modal="false" @close="editVisible = false">

      <el-form ref="form1" :model="form" label-width="140px" :rules="rules">
        <el-form-item label="设备类型" prop="instrumentType">
          <el-select v-model="form.instrumentType" placeholder="请选择设备类型" @change="toggleInstrumentType">
            <el-option v-for="item in shebeilist" :key="'2' + item.instrumentType + item.instrumentTypeName"
              :label="item.instrumentTypeName" :value="item.instrumentType" />
          </el-select>
        </el-form-item>
        <el-form-item prop="correlationCoefficientK" v-if="form.instrumentType==2">
          <div slot="label" class="fulabel">
            相关性系数-K
            <el-popover placement="top-start" width="200" trigger="hover" content="相关性系数使用计算说明: COD = TOC * K + B">
              <i slot="reference" class="el-icon-question" />
            </el-popover>
          </div>
          <el-input v-model="form.correlationCoefficientK" placeholder="相关性系数-K" />
        </el-form-item>

        <el-form-item prop="correlationCoefficientB" v-if="form.instrumentType==2">
          <div slot="label" class="fulabel">
            相关性系数-B
            <el-popover placement="top-start" width="200" trigger="hover" content="相关性系数使用计算说明: COD = TOC * K + B">
              <i slot="reference" class="el-icon-question" />
            </el-popover>
          </div>
          <el-input v-model="form.correlationCoefficientB" placeholder="相关性系数-B" />
        </el-form-item>
        <el-form-item label="设备名称" prop="instrumentName">
          <el-input v-model="form.instrumentName" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="工作量" prop="workload">
          <el-input v-model="form.workload" placeholder="请输入工作量" />
        </el-form-item>

        <el-form-item label="开始时间年份" prop="startYear">
          <el-date-picker prop="startYear" v-model="form.startYear" type="year" placeholder="请输入开始时间年份"
            :editable="false">
          </el-date-picker>

        </el-form-item>

        <el-form-item label="设备厂家型号" prop="instrumentFactoryModel">
          <el-input v-model="form.instrumentFactoryModel" placeholder="请输入设备厂家型号" />
        </el-form-item>
        <el-form-item label="质保时间">
          <el-date-picker v-model="form.warranty" type="date" placeholder="选择质保时间" :clearable="false">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="运维状态" prop="checkStatus">
          <el-select v-model="form.checkStatus" placeholder="请选择运维状态">
            <el-option label="不需要运维" :value="0" />
            <el-option label="需要运维" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="设备唯一码" prop="instrumentCode">
          <el-input v-model="form.instrumentCode" placeholder="请输入设备唯一码" />
        </el-form-item>
        <div style="text-align:center;margin-top:80px">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="editSubmit">更 新</el-button>
        </div>
      </el-form>
    </el-dialog>


    <!-- 设备类型 -->

    <el-dialog v-if="sdType" title="设备类型" :append-to-body="true" :visible="sdType" width="60%"
      :close-on-click-modal="false" @close="sdType = false">
      <shebeiZhonglei></shebeiZhonglei>

    </el-dialog>
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import shebeiZhonglei from './component/shebeiZhonglei.vue'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

import {
  listInstrumentPage,
  updateInstrument,
  listCompanySel,
  listShortPointSel,
  listInstrumentTypeSel,
  addInstrument,
  deleteInstrument,
  getInstrumentById,
  exportInstrument
} from '@/api/table'
import {
  mapGetters
} from 'vuex'
import moment from 'moment'
// import moment from 'moment'
export default {
  name: 'Instrument',
  components: {
    Treeselect,
    shebeiZhonglei
  },
  data() {
    return {
      pageIndex: 1,
      pageSize: 10,
      companyId: null,
      groupId: null,
      pointId: null,
      total: 0,
      records: [],
      comlist: [],
      groupList: [],
      pointStatus: '',

      comName: '',
      existInstrument: '',
      pointName: '',
      status: '',
      pollutionType: '',
      addVisible: false,
      editVisible: false,
      listLoading: false,
      sdType: false,
      form: {},
      allyjList: [], // 全部药剂列表
      yaojiChoose: [], // 全部药剂列表
      shebeilist: [], // 全部药剂列表
      dianweiList: [], // 全部药剂列表
      dianweiList2: [], // 全部药剂列表
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

        instrumentType: [{
          required: true,
          message: '请输入设备类型',
          trigger: 'change'
        }],
        correlationCoefficientK: [{
          required: true,
          message: '请输入相关性系数-K',
          trigger: 'input'
        }],
        correlationCoefficientB: [{
          required: true,
          message: '请输入相关性系数-B',
          trigger: 'input'
        }],

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
        checkStatus: [{
          required: true,
          message: '请输入运维状态',
          trigger: 'change'
        }],
        startYear: [{
          required: true,
          message: '请输入开始时间年份',
          trigger: 'change'
        }],
        instrumentName: [{
          required: true,
          message: '运维时设备名称',
          trigger: 'blur'
        }],
        instrumentRealName: [{
          required: true,
          message: '设备名称',
          trigger: 'blur'
        }],
        instrumentFactoryModel: [{
          required: true,
          message: '设备厂家型号',
          trigger: 'blur'
        }],
        workload: [{
          required: true,
          type: 'number',
          message: '必须为数字',
          transform: value =>
            this.$options.filters.formValidateFun(value, 'number')
        }],
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
        this.listInstrumentPage()
      }, 1000)
    } else {
      this.listInstrumentPage()
    }
  },
  mounted() {
    this.listCompanySel()
    // this.listShortPointSel2()
    this.listInstrumentTypeSel()
    // this.listShortPointSel()
  },
  methods: {
    daochu(){
      exportInstrument({
        companyId: this.companyId || '',
        pointId: this.pointId || '',
        instrumentType: this.pointStatus,
        pollutionType: this.pollutionType,
        existInstrument: this.existInstrument,
        roleId: this.roleId,
        groupId: this.userGroupId,
      }).then(res=>{
        console.log(res)
        window.open(res.retData, "_self")
      })
    },
    computedNull(val) {
      if (val === undefined || val === null || val === '' || val === ' ') {
        return '-'
      } else {
        return val
      }
    },
    // 表格合并方法
    arraySpanMethod({
      row,
      column,
      rowIndex,
      columnIndex
    }) {
      if (columnIndex === 0 || columnIndex === 1) {
        if (row.comIndex) { // 如果有值,说明需要合并
          return [row.comIndex, 1]
        } else return [0, 0]
      }
      if (columnIndex === 2) {
        if (row.pointIndex) { // 如果有值,说明需要合并
          return [row.pointIndex, 1]
        } else return [0, 0]
      }
    },
    tableRowClassName({
      row,
      rowIndex
    }) {
      // console.log('row', row)
      if (row.index % 2 === 0) {
        return 'bkred'
      } else {
        return 'bkgreen'
      }
    },
    toggleInstrumentType(e) {
      console.log(e)
      var findObj = this.shebeilist.find(i => {
        return i.instrumentType === e
      })
      console.log(findObj)
      this.$set(this.form, 'instrumentName', findObj.instrumentTypeName);
      this.$set(this.form, 'instrumentRealName', findObj.instrumentTypeName);
      this.form.workload = findObj.workload
    },
    riskPersonDeptChangeValue() {
      // form是表单名 riskPersonDept是prop名

      this.$refs['form1'].validateField('pointId')
    },
    remove(e) {
      this.$confirm('此操作将永久删除该设备, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteInstrument({
          instrumentId: e.instrumentId
        }).then(res => {
          this.$notify({
            type: 'success',
            message: res.retMsg
          })
          this.listInstrumentPage()
        })
      })
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
    listInstrumentTypeSel() { // 设备类型
      listInstrumentTypeSel({}).then(res => {
        this.shebeilist = res.retData
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
    listInstrumentPage() {
      listInstrumentPage({
        companyId: this.companyId || '',
        pointId: this.pointId || '',
        instrumentType: this.pointStatus,
        pollutionType: this.pollutionType,
        existInstrument: this.existInstrument,
        roleId: this.roleId,
        groupId: this.userGroupId,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }).then(res => {
        console.log(res)
        var temp = res.retData.records
        // this.records = res.retData.records
        var newRecords = []

        const comIndex = [] // 公司行数
        const pointIndex = [] // 点位行数
        var comNum = 0 // 公司基数
        var pointNum = 0 // 点位基数

        temp.forEach((e, index) => {
          comNum = 0
          if (e.points.length === 0) { // 企业没有点位
            newRecords.push({
              comName: e.comName,
              companyId: e.companyId,
              index: index,
              pointName: '-',
              pointId: '-',
              instrumentName: '-',
              instrumentId: '-',
              checkStatusName: '-',
              checkStatus: '-',
              workload: '-',
              warranty: '-',
              startYear: '-',
            })
            comNum++
            pointIndex.push(1)
          } else {
            e.points.forEach(i => {
              // console.log(i)
              if (i.instruments.length === 0) { // 点位没有点位设备
                newRecords.push({
                  comName: e.comName,
                  companyId: e.companyId,
                  index: index,
                  pointName: i.pointName,
                  pointId: i.pointId,
                  instrumentName: '-',
                  instrumentId: '-',
                  checkStatusName: '-',
                  checkStatus: '-',
                  workload: '-',
                  warranty: '-',
                  startYear: '-',
                })
                comNum++
                pointIndex.push(1)
              } else {
                pointNum = 0
                i.instruments.forEach(iiner => {
                  newRecords.push({
                    comName: e.comName,
                    companyId: e.companyId,
                    index: index,
                    pointName: i.pointName,
                    pointId: i.pointId,
                    instrumentName: iiner.instrumentName,
                    instrumentId: iiner.instrumentId,
                    checkStatusName: iiner.checkStatusName,
                    checkStatus: iiner.checkStatus,
                    workload: iiner.workload,
                    warranty: iiner.warranty,
                    startYear: iiner.startYear,
                  })
                  comNum++
                  pointNum++
                })
                pointIndex.push(pointNum)
              }
            })
          }
          comIndex.push(comNum)
        })
        console.log('comIndex', comIndex)
        console.log('pointIndex', pointIndex)

        let com = 1
        for (let i = 0; i < comIndex.length; i++) {
          newRecords[com - 1].comIndex = comIndex[i]
          com += comIndex[i]
        }

        com = 1
        for (let i = 0; i < pointIndex.length; i++) {
          newRecords[com - 1].pointIndex = pointIndex[i]
          com += pointIndex[i]
        }

        this.records = newRecords
        console.log(newRecords)
        this.total = res.retData.total
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.listInstrumentPage()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.listInstrumentPage()
    },
    seach() {
      this.pageIndex = 1
      this.listInstrumentPage()
    },
    editPoint(e) {
      console.log(e)
      getInstrumentById({
        instrumentId: e.instrumentId
      }).then(res => {
        console.log(res)
        this.editVisible = true
        this.form = res.retData
        this.form.startYear = this.form.startYear.toString()

        if (res.retData.warranty) {
          this.form.warranty = moment(res.retData.warranty).format("YYYY-MM-DD")
        }
      })

      console.log('🚀 ~ editPoint ~   this.form:', this.form)
    },
    addShebei(e) {
      this.addVisible = true
      this.form = {
        companyId: null,
        pointId: null,
        checkStatus: 1,
        startYear: '',
        warranty: '',
        instrumentCode:""
      }
      if (this.companyId) {
        this.form.companyId = this.companyId
      }
      if (this.pointId) {
        this.form.pointId = this.pointId
      }
      this.listShortPointSel2()
    },
    sumbitPoint() {
      // if (this.form.pointId == null || this.form.pointId == undefined || this.form.pointId == '') {
      //   this.$notify({
      //     type: 'error',
      //     message: '请选择点位名称'
      //   })
      //   return
      // }
      this.$refs.form1.validate((valid) => {
        if (valid) {
          this.form.startYear = moment(this.form.startYear).format("YYYY")
          if (this.form.warranty) {
            this.form.warranty = moment(this.form.warranty).format("YYYY-MM-DD")
          }

          addInstrument(this.form).then(res => {
            console.log(res)
            this.$notify({
              type: 'success',
              message: res.retMsg
            })
            this.addVisible = false
            this.listInstrumentPage()
          })
        }
      })
    },
    editSubmit() {
      this.$refs.form1.validate((valid) => {
        if (valid) {
          this.form.startYear = moment(this.form.startYear).format("YYYY")
          if (this.form.warranty) {
            this.form.warranty = moment(this.form.warranty).format("YYYY-MM-DD")
          }
          updateInstrument(this.form).then(res => {
            console.log(res)
            this.$notify({
              type: 'success',
              message: res.retMsg
            })
            this.editVisible = false
            this.listInstrumentPage()
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

.fulabel {
  text-align: right;
  vertical-align: middle;
  float: right;
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 0;
  box-sizing: border-box;
}
</style>
<style>
.el-table .bkred {
  background: #ffffff;
}

.el-table .bkgreen {
  background: #fafafa
}
</style>
