<template>
  <div class="testPaper">
    <!-- 条件栏 -->
    <div class="headClass">
      企业名称：
      <el-input v-model="comName" class="seachInput" placeholder="请选择输入关键字" clearable />
      区域：
      <treeselect v-model="areaCode" :multiple="false" :options="allAreacode" :normalizer="normalizer"
        placeholder="请选择区域" class="seachInput" no-children-text="暂无数据" />

      污染源种类：
      <el-select v-model="pollutionType" placeholder="请选择污染源种类" clearable class="seachInput">
        <el-option label="废水" :value="1" />
        <el-option label="废气" :value="2" />
        <el-option label="vocs" :value="3" />
        <el-option label="地表水" :value="4" />
        <el-option label="其他" :value="5" />

      </el-select>
      因子名称：
      <treeselect v-model="factorId" :multiple="false" :options="factorList" :normalizer="normalizer3"
        placeholder="请选择因子" class="seachInput" />

      <el-button type="primary" @click="seach">搜索</el-button>
      <el-button type="primary" @click="addCom">新增企业</el-button>
    </div>

    <!-- 表格 -->
    <el-table v-loading="listLoading" :data="tableData" element-loading-text="加载中" border style="margin-top:1.04vw"
      :span-method="arraySpanMethod" :row-class-name="tableRowClassName"
      height="calc(100vh - 84px - 60px - 40px - 32px - 1.04vw - 17px)"
      >
      <el-table-column align="center" label="#" width="95">
        <template slot-scope="scope">
          {{ (scope.row.index+1)+(pageIndex-1)*pageSize }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="企业名称" prop="comName" />
      <el-table-column align="center" label="所属区域">
        <template slot-scope="scope">
          {{ computedNull(scope.row.areaName) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="点位名称">
        <template slot-scope="scope">
          <div :class="[scope.row.pointName!=='-'?'pointName':'']" @click="gotoPoint(scope.row)">
            {{ scope.row.pointName }}
          </div>

        </template>
      </el-table-column>
      <el-table-column align="center" label="点位状态">
        <template slot-scope="scope">
          {{ scope.row.pointStatusName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="运维组">
        <template slot-scope="scope">
          {{ scope.row.groupName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="关注程度">
        <template slot-scope="scope">
          {{ scope.row.concernLevelName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="数采仪ip">
        <template slot-scope="scope">
          {{ scope.row.dciIp }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="因子名称">
        <template slot-scope="scope">
          <div :class="[scope.row.factorName!=='-'?'pointName':'']" @click="gotoyinzi(scope.row)">
            {{ scope.row.factorName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="上下限值">
        <template slot-scope="scope">
          {{ scope.row.limit }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="180">
        <template slot-scope="scope">
          <el-button @click="editShiji(scope.row)">编辑</el-button>
          <!-- <el-button @click="gotoPoint(scope.row)">点位管理</el-button> -->
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

    <el-dialog v-if="addVisible" title="新增企业" :append-to-body="true" :visible="addVisible" width="40%"
      :close-on-click-modal="false" @close="addVisible=false">
      <el-form ref="form1" :model="form" label-width="140px" :rules="rules">
        <el-form-item label="企业名称" prop="comName">
          <el-input v-model="form.comName" placeholder="请输入企业名称" />
        </el-form-item>
        <el-form-item label="企业简称" prop="comShortName">
          <el-input v-model="form.comShortName" placeholder="请输入企业简称" />
        </el-form-item>
        <el-form-item label="社会信用代码" prop="socialCreditCode">
          <el-input v-model="form.socialCreditCode" placeholder="请输入社会信用代码" />
        </el-form-item>
        <el-form-item label="区域" prop="areaCode">
          <treeselect v-model="form.areaCode" :multiple="false" :options="allAreacode" :normalizer="normalizer"
            placeholder="请选择区域" class="seachInput" style="margin:0" @input="riskPersonDeptChangeValue" />
        </el-form-item>
        <el-form-item label="经度" prop="lng">
          <el-input v-model="form.lng" placeholder="请输入经度" />
        </el-form-item>
        <el-form-item label="维度" prop="lat">
          <el-input v-model="form.lat" placeholder="请输入维度" />
        </el-form-item>
        <el-form-item label="环保负责人" prop="contact">
          <el-input v-model="form.contact" placeholder="请输入环保负责人" />
        </el-form-item>
        <el-form-item label="负责人联系电话" prop="contactMobile">
          <el-input v-model="form.contactMobile" placeholder="负责人联系电话" />
        </el-form-item>
        <div style="text-align:center;margin-top:80px">
          <el-button @click="addVisible=false">取 消</el-button>
          <el-button type="primary" @click="sumbitCom">确 定</el-button>
        </div>
      </el-form>
    </el-dialog>

    <el-dialog v-if="editVisible" title="编辑企业" :append-to-body="true" :visible="editVisible" width="40%"
      :close-on-click-modal="false" @close="editVisible=false">

      <el-form ref="form1" :model="form" label-width="140px" :rules="rules">
        <el-form-item label="企业名称" prop="comName">
          <el-input v-model="form.comName" placeholder="请输入企业名称" />
        </el-form-item>
        <el-form-item label="企业简称" prop="comShortName">
          <el-input v-model="form.comShortName" placeholder="请输入企业简称" />
        </el-form-item>
        <el-form-item label="社会信用代码" prop="socialCreditCode">
          <el-input v-model="form.socialCreditCode" placeholder="请输入社会信用代码" />
        </el-form-item>
        <el-form-item label="区域" prop="areaCode">
          <treeselect v-model="form.areaCode" :multiple="false" :options="allAreacode" :normalizer="normalizer"
            placeholder="请选择区域" class="seachInput" style="margin:0" @input="riskPersonDeptChangeValue" />
        </el-form-item>
        <el-form-item label="经度" prop="lng">
          <el-input v-model="form.lng" placeholder="请输入经度" />
        </el-form-item>
        <el-form-item label="维度" prop="lat">
          <el-input v-model="form.lat" placeholder="请输入维度" />
        </el-form-item>
        <el-form-item label="环保负责人" prop="contact">
          <el-input v-model="form.contact" placeholder="请输入环保负责人" />
        </el-form-item>
        <el-form-item label="负责人联系电话" prop="contactMobile">
          <el-input v-model="form.contactMobile" placeholder="负责人联系电话" />
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
    moblie
  } from '@/utils/asyncValidator'

  import {
    getAreaCodeTree,
    listCompanyPage,
    addCompany,
    updateCompany,
    deleteCompany,
    getCompanyById,
    listFactorSel
  } from '@/api/table'
  import {
    mapGetters
  } from 'vuex'
  // import moment from 'moment'

  export default {
    name: 'Company',
    components: {
      Treeselect
    },
    data() {
      return {
        pageIndex: 1,
        pageSize: 10,
        total: 0,
        records: [],
        tableData: [],
        allAreacode: [],
        comName: '',
        areaCode: null,
        status: '',
        addVisible: false,
        editVisible: false,
        listLoading: false,
        pollutionType: "",
        factorId: null,
        factorList: [], // 全部药剂列表
        form: {},
        allyjList: [], // 全部药剂列表
        yaojiChoose: [], // 全部药剂列表
        rules: {
          comName: [{
            required: true,
            message: '请输入企业名称',
            trigger: 'blur'
          }],
          comShortName: [{
            required: true,
            message: '请输入企业简称',
            trigger: 'blur'
          }],
          contactMobile: [{
            required: true,
            validator: moblie,
            trigger: 'blur'
          }],
          contact: [{
            required: true,
            message: '请输入环保负责人',
            trigger: 'blur'
          }],
          // lng: [{
          //   required: false,
          //   type: 'number',
          //   message: '必须为数字',
          //   transform: value =>
          //     this.$options.filters.formValidateFun(value, 'number')
          // }],
          // lat: [{
          //   required: false,
          //   type: 'number',
          //   message: '必须为数字',
          //   transform: value =>
          //     this.$options.filters.formValidateFun(value, 'number')
          // }],
          socialCreditCode: [{
            required: true,
            message: '请输入统一社会信用代码',
            trigger: 'blur'
          }],
          areaCode: [{
            required: true,
            message: '请选择地区',
            trigger: 'input'
          }]
        },
        normalizer(node) {
          // if (!node.children.length) delete node.children
          return {
            id: node.value,
            label: node.label,
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
    mounted() {
      this.getAreaCodeTree()
      this.listFactorSel()
      this.listCompanyPage()
    },
    methods: {
      listFactorSel() { // 所有因子列表
        listFactorSel({}).then(res => {
          this.factorList = res.retData
        })
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
      riskPersonDeptChangeValue() {
        // form是表单名 riskPersonDept是prop名
        this.$refs['form1'].validateField('areaCode')
      },
      getAreaCodeTree() {
        getAreaCodeTree({}).then(res => {
          console.log(res)
          this.allAreacode.push(res.retData)
        })
      },
      listCompanyPage() {
        listCompanyPage({
          comName: this.comName,
          areaCode: this.areaCode || '',
          pollutionType: this.pollutionType || '',
          factorCode: this.factorId || '',
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          roleId: this.roleId,
          groupId: this.userGroupId
        }).then(res => {
          console.log(res)
          this.records = res.retData.records
          this.total = res.retData.total
          this.init()
        })
      },
      init() {
        const getDate = [] // 存储新表格数据
        const comIndex = [] // 公司行数
        const pointIndex = [] // 点位行数
        var comNum = 0 // 公司基数
        var pointNum = 0 // 点位基数
        this.records.forEach((v, index) => {
          comNum = 0 // 循环企业基数
          if (v.points && v.points.length) { // 如果有点位数
            v.points.forEach((p, pidx) => { // 点位数循环
              pointNum = 0
              if (p.pointFactors && p.pointFactors.length) { // 如果有因子的话
                p.pointFactors.forEach((y, yidx) => {
                  getDate.push({
                    comName: this.computedNull(v.comName),
                    index: index,
                    areaName: this.computedNull(v.areaName),
                    companyId: this.computedNull(v.companyId),
                    pointName: this.computedNull(p.pointName),
                    pointId: this.computedNull(p.pointId),
                    pointStatusName: this.computedNull(p.pointStatusName),
                    groupName: this.computedNull(p.groupName),
                    concernLevelName: this.computedNull(p.concernLevelName),
                    dciIp: this.computedNull(p.dciIp),
                    factorName: this.computedNull(y.factorName),
                    limit: this.computedNull(y.alarmLowerLimit) + ' / ' + this.computedNull(y
                      .alarmUpperLimit)
                  })
                  pointNum++
                  comNum++
                })
                pointIndex.push(pointNum)
              } else {
                getDate.push({
                  index: index,
                  comName: this.computedNull(v.comName),
                  areaName: this.computedNull(v.areaName),
                  companyId: this.computedNull(v.companyId),
                  pointName: this.computedNull(p.pointName),
                  pointId: this.computedNull(p.pointId),
                  pointStatusName: this.computedNull(p.pointStatusName),
                  groupName: this.computedNull(p.groupName),
                  concernLevelName: this.computedNull(p.concernLevelName),
                  dciIp: this.computedNull(p.dciIp)
                })
                comNum++
                pointIndex.push(1)
              }
            })
          } else { // #1如果没有点位数
            getDate.push({
              index: index,
              comName: this.computedNull(v.comName),
              areaName: this.computedNull(v.areaName),
              companyId: this.computedNull(v.companyId)
            })
            comNum++
            pointIndex.push(1) // 没有点位 自己占格
          }

          comIndex.push(comNum)
        })
        console.log('🚀 ~ this.records.forEach ~ comIndex:', comIndex)
        console.log('🚀 ~ this.records.forEach ~ pointIndex:', pointIndex)

        let com = 1
        for (let i = 0; i < comIndex.length; i++) {
          getDate[com - 1].comIndex = comIndex[i]
          com += comIndex[i]
        }

        com = 1
        for (let i = 0; i < pointIndex.length; i++) {
          getDate[com - 1].pointIndex = pointIndex[i]
          com += pointIndex[i]
        }
        this.tableData = getDate
        console.log('🚀 ~ init ~ this.tableData:', this.tableData)
      },
      // 表格合并方法
      arraySpanMethod({
        row,
        column,
        rowIndex,
        columnIndex
      }) {
        if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2 || columnIndex === 10) {
          if (row.comIndex) { // 如果有值,说明需要合并
            return [row.comIndex, 1]
          } else return [0, 0]
        }
        if (columnIndex === 3 || columnIndex === 4 || columnIndex === 5 || columnIndex === 6 || columnIndex === 7) {
          if (row.pointIndex) { // 如果有值,说明需要合并
            return [row.pointIndex, 1]
          } else return [0, 0]
        }
      },
      computedNull(val) {
        if (val === undefined || val === null || val === '' || val === ' ') {
          return '-'
        } else {
          return val
        }
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.listCompanyPage()
      },
      handleCurrentChange(val) {
        this.pageIndex = val
        this.listCompanyPage()
      },
      seach() {
        this.pageIndex = 1
        this.listCompanyPage()
      },
      editShiji(e) {
        getCompanyById({
          companyId: e.companyId
        }).then(res => {
          console.log(res)

          if (res.retData.areaCode === 0) {
            res.retData.areaCode = null
          }
          this.form = res.retData
        })

        this.editVisible = true

        // console.log('🚀 ~ editShiji ~   this.form:', this.form)
      },
      remove(e) {
        this.$confirm('此操作将永久删除该企业, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteCompany({
            companyId: e.companyId
          }).then(res => {
            this.$notify({
              type: 'success',
              message: res.retMsg
            })
            this.listCompanyPage()
          })
        })
      },
      addCom(e) {
        this.addVisible = true
        this.form = {
          areaCode: null
        }
      },
      sumbitCom() {
        this.$refs.form1.validate((valid) => {
          if (valid) {
            addCompany(this.form).then(res => {
              console.log(res)
              this.$notify({
                type: 'success',
                message: res.retMsg
              })
              this.addVisible = false
              this.listCompanyPage()
            })
          }
        })
      },
      editSubmit() {
        this.$refs.form1.validate((valid) => {
          if (valid) {
            updateCompany(this.form).then(res => {
              console.log(res)
              this.$notify({
                type: 'success',
                message: res.retMsg
              })
              this.editVisible = false
              this.listCompanyPage()
            })
          }
        })
      },
      gotoPoint(e) {
        console.log(e)
        if (e.pointName === '-') {
          return
        }
        this.$router.push({
          name: 'Ponit',
          params: {
            companyId: e.companyId,
            pointName: e.pointName
          }
        })
      },
      gotoyinzi(e) {
        console.log(e)
        if (e.factorName === '-') {
          return
        }
        this.$router.push({
          name: 'PointFactor',
          params: {
            companyId: e.companyId,
            pointId: e.pointId
          }
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

  .headClass {
    display: flex;
    align-items: center;
  }

  .pointName {
    text-decoration: underline;
    cursor: pointer;
  }

  .pointName:hover {
    color: #9100ff !important;
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
