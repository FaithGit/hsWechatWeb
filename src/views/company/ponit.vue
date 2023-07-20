<template>
  <div class="testPaper">
    <!-- 条件栏 -->
    <div class="headClass">
      企业名称：
      <treeselect
        v-model="companyId"
        :multiple="false"
        :options="comlist"
        :normalizer="normalizer"
        placeholder="请选择企业"
        class="seachInput"
        style="width:300px"
      />
      点位名称：
      <el-input v-model="pointName" class="seachInput" placeholder="请选择输入点位名称" clearable />

      站点状态：
      <el-select v-model="pointStatus" placeholder="请选择站点状态" class="seachInput" clearable>
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>

      <el-button type="primary" @click="seach">搜索</el-button>
      <el-button type="primary" @click="addPoint1">新增点位</el-button>
    </div>
    <div class="headClass" style="margin-top:10px">
      区域：
      <treeselect
        v-model="areaCode"
        :multiple="false"
        :options="allAreacode"
        :normalizer="normalizer4"
        placeholder="请选择区域"
        class="seachInput"
        no-children-text="暂无数据"
      />
      运维组：
      <treeselect
        v-model="groupId"
        :multiple="false"
        :options="groupList"
        :normalizer="normalizer2"
        placeholder="请选择运维组"
        class="seachInput"
      />
      <el-button type="primary" @click="daochu">导出</el-button>
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
    >
      <el-table-column align="center" label="#" width="95">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="企业名称" prop="comName" />
      <el-table-column align="center" label="点位名称" prop="pointName" />
      <el-table-column align="center" label="点位简称" prop="pointShortName" />
      <el-table-column align="center" label="站点状态" prop="pointStatusName" width="80" />
      <el-table-column align="center" label="运维组">
        <template slot-scope="scope">
          {{ (scope.row.groupName==null||scope.row.groupName=='')?'-':scope.row.groupName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="排放标准" width="200">
        <template slot-scope="scope">
          {{ (scope.row.standardName==null||scope.row.standardName=='')?'-':scope.row.standardName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="关注程度" width="80">
        <template slot-scope="scope">
          {{ (scope.row.concernLevelName==null||scope.row.concernLevelName=='')?'-':scope.row.concernLevelName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="数采仪编码(mn)">
        <template slot-scope="scope">
          {{ (scope.row.dciMn==null||scope.row.dciMn=='')?'-':scope.row.dciMn }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="数采仪ip">
        <template slot-scope="scope">
          {{ (scope.row.dciIp==null||scope.row.dciIp=='')?'-':scope.row.dciIp }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="400">
        <template slot-scope="scope">
          <el-button @click="editPoint(scope.row)">编辑</el-button>
          <el-button @click="gotoShebei(scope.row)">设备管理</el-button>
          <el-button @click="gotoyinzi(scope.row)">因子管理</el-button>
          <el-button type="danger" @click="remove(scope.row)"> 删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="buttonPagination">
      <el-pagination
        :current-page="pageIndex"
        :page-sizes="[10,20,30,40,50,100,500,1000]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog
      v-if="addVisible"
      title="新增点位"
      :append-to-body="true"
      :visible="addVisible"
      width="40%"
      :close-on-click-modal="false"
      @close="addVisible=false"
    >
      <el-form ref="form1" :model="form" label-width="140px" :rules="rules">
        <el-form-item label="企业名称" prop="companyId">
          <treeselect
            v-model="form.companyId"
            :multiple="false"
            :options="comlist"
            :normalizer="normalizer"
            placeholder="请选择企业"
            @input="riskPersonDeptChangeValue"
          />
        </el-form-item>
        <el-form-item label="点位名称" prop="pointName">
          <el-input v-model="form.pointName" placeholder="请输入点位名称" />
        </el-form-item>
        <el-form-item label="点位简称" prop="pointShortName">
          <el-input v-model="form.pointShortName" placeholder="请输入点位简称" />
        </el-form-item>
        <el-form-item label="数采仪编码mn号" prop="dciMn">
          <el-input v-model="form.dciMn" placeholder="请输入数采仪编码mn号  " />
        </el-form-item>
        <el-form-item label="数采仪ip" prop="dciIp">
          <el-input v-model="form.dciIp" placeholder="请输入数采仪ip" />
        </el-form-item>
        <el-form-item label="数采仪系统类型" prop="dciType">
          <el-select v-model="form.dciType" placeholder="请选择">
            <el-option label="海晟数采仪" :value="1" />
            <el-option label="其他" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="关注程度" prop="concernLevel">
          <el-select v-model="form.concernLevel" placeholder="请选择关注程度">
            <el-option label="重点" :value="1" />
            <el-option label="非重点" :value="2" />
            <el-option label="非污染源" :value="3" />
            <el-option label="企业自测" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="排放口许可证" prop="dischargePortPermit">
          <el-input v-model="form.dischargePortPermit" placeholder="请输入排放口许可证" />
        </el-form-item>

        <el-form-item label="站点状态" prop="pointStatus">
          <el-select v-model="form.pointStatus" placeholder="请选择站点状态">
            <el-option label="在用" :value="1" />
            <el-option label="停运" :value="2" />
            <el-option label="建设(调试)" :value="3" />
            <el-option label="合同转包" :value="4" />
            <el-option label="合同终止" :value="5" />
            <el-option label="拆除" :value="6" />
          </el-select>
        </el-form-item>

        <el-form-item label="污染源种类" prop="pollutionType">
          <el-select v-model="form.pollutionType" placeholder="请选择污染源种类" @change="lisDischargeStandard">
            <el-option label="废水" :value="1" />
            <el-option label="废气" :value="2" />
            <el-option label="vocs" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.pollutionType" label="排放标准" prop="dischargeStandardId">

          <el-popover placement="right" title="" width="200" trigger="hover" :content="computedLabel">
            <treeselect
              slot="reference"
              v-model="form.dischargeStandardId"
              :multiple="false"
              :options="dischargeStandardIdList"
              :normalizer="normalizer3"
              placeholder="请选择排放标准"
              :clearable="false"
              class="fuSelect"
              @select="changeDischargeStandardId"
            />
          </el-popover>

        </el-form-item>
        <el-form-item label="紧急联系人" prop="emergencyContact">
          <el-input v-model="form.emergencyContact" placeholder="请输入紧急联系人" />
        </el-form-item>
        <el-form-item label="紧急联系人电话" prop="emergencyMobile">
          <el-input v-model="form.emergencyMobile" placeholder="紧急联系人电话" />
        </el-form-item>
        <el-form-item label="经度" prop="lng">
          <el-input v-model="form.lng" placeholder="请输入经度" />
        </el-form-item>
        <el-form-item label="维度" prop="lat">
          <el-input v-model="form.lat" placeholder="请输入维度" />
        </el-form-item>
        <el-form-item label="运维组">
          <treeselect
            v-model="form.groupId"
            :multiple="false"
            :options="groupList"
            :normalizer="normalizer2"
            placeholder="请选择运维组"
          />
        </el-form-item>
        <div style="text-align:center;margin-top:80px">
          <el-button @click="addVisible=false">取 消</el-button>
          <el-button type="primary" @click="sumbitPoint">确 定</el-button>
        </div>
      </el-form>
    </el-dialog>

    <el-dialog
      v-if="editVisible"
      title="编辑点位"
      :append-to-body="true"
      :visible="editVisible"
      width="40%"
      :close-on-click-modal="false"
      @close="editVisible=false"
    >

      <el-form ref="form1" :model="form" label-width="140px" :rules="rules">
        <el-form-item label="企业名称" prop="comName">
          <el-input v-model="form.comName" placeholder="请输入点位名称" readonly="" />
        </el-form-item>
        <el-form-item label="点位名称" prop="pointName">
          <el-input v-model="form.pointName" placeholder="请输入点位名称" />
        </el-form-item>
        <el-form-item label="点位简称" prop="pointShortName">
          <el-input v-model="form.pointShortName" placeholder="请输入点位简称" />
        </el-form-item>
        <el-form-item label="数采仪编码mn号" prop="dciMn">
          <el-input v-model="form.dciMn" placeholder="请输入数采仪编码mn号  " />
        </el-form-item>
        <el-form-item label="数采仪ip" prop="dciIp">
          <el-input v-model="form.dciIp" placeholder="请输入数采仪ip" />
        </el-form-item>
        <el-form-item label="数采仪系统类型" prop="dciType">
          <el-select v-model="form.dciType" placeholder="请选择">
            <el-option label="海晟数采仪" :value="1" />
            <el-option label="其他" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="关注程度" prop="concernLevel">
          <el-select v-model="form.concernLevel" placeholder="请选择关注程度">
            <el-option label="重点" :value="1" />
            <el-option label="非重点" :value="2" />
            <el-option label="非污染源" :value="3" />
            <el-option label="企业自测" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="排放口许可证" prop="dischargePortPermit">
          <el-input v-model="form.dischargePortPermit" placeholder="请输入排放口许可证" />
        </el-form-item>
        <el-form-item label="站点状态" prop="pointStatus">
          <el-select v-model="form.pointStatus" placeholder="请选择站点状态">
            <el-option label="在用" :value="1" />
            <el-option label="停运" :value="2" />
            <el-option label="建设(调试)" :value="3" />
            <el-option label="合同转包" :value="4" />
            <el-option label="合同终止" :value="5" />
            <el-option label="拆除" :value="6" />
          </el-select>
        </el-form-item>
        <el-form-item label="污染源种类" prop="pollutionType">
          <el-select v-model="form.pollutionType" placeholder="请选择污染源种类" @change="lisDischargeStandard">
            <el-option label="废水" :value="1" />
            <el-option label="废气" :value="2" />
            <el-option label="vocs" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.pollutionType" label="排放标准" prop="dischargeStandardId">
          <!-- <treeselect v-model="form.dischargeStandardId" :multiple="false" :options="dischargeStandardIdList"
            :normalizer="normalizer3" placeholder="请选择排放标准" /> -->

          <el-popover placement="right" title="" width="200" trigger="hover" :content="computedLabel">
            <treeselect
              slot="reference"
              v-model="form.dischargeStandardId"
              :multiple="false"
              :options="dischargeStandardIdList"
              :normalizer="normalizer3"
              placeholder="请选择排放标准"
              :clearable="false"
              class="fuSelect"
              @select="changeDischargeStandardId"
            />
          </el-popover>

        </el-form-item>
        <el-form-item label="紧急联系人" prop="emergencyContact">
          <el-input v-model="form.emergencyContact" placeholder="请输入紧急联系人" />
        </el-form-item>
        <el-form-item label="紧急联系人电话" prop="emergencyMobile">
          <el-input v-model="form.emergencyMobile" placeholder="紧急联系人电话" />
        </el-form-item>
        <el-form-item label="经度" prop="lng">
          <el-input v-model="form.lng" placeholder="请输入经度" />
        </el-form-item>
        <el-form-item label="维度" prop="lat">
          <el-input v-model="form.lat" placeholder="请输入维度" />
        </el-form-item>
        <el-form-item label="运维组">
          <treeselect
            v-model="form.groupId"
            :multiple="false"
            :options="groupList"
            :normalizer="normalizer2"
            placeholder="请选择运维组"
          />
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
  listPointPage,
  updatePoint,
  listCompanySel,
  listGroupSel,
  addPoint,
  lisDischargeStandard,
  deletePoint,
  getAreaCodeTree,
  exportPoint
} from '@/api/table'
import {
  mapGetters
} from 'vuex'
// import moment from 'moment'
export default {
  name: 'Ponit',
  components: {
    Treeselect
  },
  data() {
    return {
      pageIndex: 1,
      pageSize: 10,
      companyId: null,
      groupId: null,
      areaCode: null,
      total: 0,
      records: [],
      comlist: [],
      allAreacode: [],
      groupList: [],
      pointStatus: '',
      computedLabel: '请选择排放标准',
      comName: '',
      pointName: '',
      status: '',
      addVisible: false,
      editVisible: false,
      listLoading: false,
      form: {},
      allyjList: [], // 全部药剂列表
      yaojiChoose: [], // 全部药剂列表
      dischargeStandardIdList: [], // 全部药剂列表
      options: [{
        value: 1,
        label: '在用'
      }, {
        value: 2,
        label: '停运'
      }, {
        value: 3,
        label: '建设(调试)'
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
        pointName: [{
          required: true,
          message: '请输入点位名称',
          trigger: 'blur'
        }],
        pointShortName: [{
          required: true,
          message: '请输入点位名称',
          trigger: 'blur'
        }],
        emergencyMobile: [{
          required: true,
          validator: moblie,
          trigger: 'blur'
        }],
        dciMn: [{
          required: false,
          message: '请输入数采仪编码 mn号',
          trigger: 'blur'
        }],
        dciIp: [{
          required: false,
          message: '请输入数采仪ip',
          trigger: 'blur'
        }],
        dciType: [{
          required: true,
          message: '请输入数采仪系统类型',
          trigger: 'change'
        }],
        companyId: [{
          required: true,
          message: '请选择企业名称',
          trigger: 'change'
        }],
        groupId: [{
          required: true,
          message: '请选择运维组',
          trigger: 'input'
        }],
        concernLevel: [{
          required: true,
          message: '请输入关注程度',
          trigger: 'change'
        }],
        pointStatus: [{
          required: true,
          message: '请输入站点状态',
          trigger: 'change'
        }],
        pollutionType: [{
          required: true,
          message: '请输入污染源种类',
          trigger: 'change'
        }],
        dischargePortPermit: [{
          required: false,
          message: '请输入排放口许可证',
          trigger: 'blur'
        }],
        dischargeStandardId: [{
          required: true,
          message: '请选择排放标准',
          trigger: 'change'
        }],
        emergencyContact: [{
          required: true,
          message: '请输入紧急联系人',
          trigger: 'blur'
        }],
        lng: [{
          required: true,
          type: 'number',
          message: '必须为数字',
          transform: value =>
            this.$options.filters.formValidateFun(value, 'number')
        }],
        lat: [{
          required: true,
          type: 'number',
          message: '必须为数字',
          transform: value =>
            this.$options.filters.formValidateFun(value, 'number')
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
          id: node.groupId,
          label: node.groupName,
          children: node.children && node.children.length ? node.children : 0
        }
      },
      normalizer3(node) {
        return {
          id: node.id,
          label: node.standardName,
          children: node.children && node.children.length ? node.children : 0
        }
      },
      normalizer4(node) {
        return {
          id: node.value,
          label: node.label,
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
  activated() {
    console.log(this.$route.params)
    if (JSON.stringify(this.$route.params) !== '{}') {
      this.companyId = this.$route.params.companyId
      this.pointName = this.$route.params.pointName
      console.log('更新数据')
    }
    this.listPointPage()
  },
  mounted() {
    this.listGroupSel()
    this.listCompanySel()
    this.getAreaCodeTree()
  },
  methods: {
    riskPersonDeptChangeValue() {
      // form是表单名 riskPersonDept是prop名
      this.$refs['form1'].validateField('companyId')
    },
    daochu() {
      exportPoint({
        companyId: this.companyId || '',
        areaCode: this.areaCode || '',
        pointName: this.pointName,
        groupId: this.groupId || '',
        pointStatus: this.pointStatus,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }).then(res => {
        console.log(res)
        window.open(res.retData)
      })
    },
    getAreaCodeTree() {
      getAreaCodeTree({
        areaCode: 3304
      }).then(res => {
        console.log(res)
        this.allAreacode.push(res.retData)
      })
    },
    remove(e) {
      this.$confirm('此操作将永久删除该点位, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletePoint({
          pointId: e.pointId
        }).then(res => {
          this.$notify({
            type: 'success',
            message: res.retMsg
          })
          this.listPointPage()
        })
      })
    },
    changeDischargeStandardId(node, instanceId) {
      console.log(node, instanceId)
      this.computedLabel = node.standardName
      this.form.dischargeStandardId = node.id
    },
    lisDischargeStandard() {
      console.log('????')
      lisDischargeStandard({
        pollutionType: this.form.pollutionType
      }).then(res => {
        console.log(res)
        this.form.dischargeStandardId = null
        this.dischargeStandardIdList = res.retData
      })
    },
    listCompanySel() { // 公司列表
      listCompanySel({}).then(res => {
        console.log(res)
        this.comlist = res.retData
      })
    },
    listGroupSel() { // 运维列表
      listGroupSel({}).then(res => {
        console.log(res)
        this.groupList = res.retData
      })
    },
    listPointPage() {
      listPointPage({
        companyId: this.companyId || '',
        areaCode: this.areaCode || '',
        pointName: this.pointName,
        groupId: this.groupId || '',
        pointStatus: this.pointStatus,
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
      this.listPointPage()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.listPointPage()
    },
    seach() {
      this.pageIndex = 1
      this.listPointPage()
    },
    editPoint(e) {
      this.editVisible = true
      this.form = Object.assign({}, e)

      lisDischargeStandard({
        pollutionType: this.form.pollutionType
      }).then(res => {
        console.log(res)
        // this.form.dischargeStandardId = null
        this.dischargeStandardIdList = res.retData
        const nameTemp = this.dischargeStandardIdList.find(e => {
          return e.id === this.form.dischargeStandardId
        })
        this.computedLabel = nameTemp.standardName
      })

      console.log('🚀 ~ editPoint ~   this.form:', this.form)
    },
    addPoint1(e) {
      this.addVisible = true
      this.form = {
        companyId: null,
        groupId: null
      }
      if (this.companyId) {
        this.form.companyId = this.companyId
      }
    },
    sumbitPoint() {
      this.$refs.form1.validate((valid) => {
        if (valid) {
          addPoint(this.form).then(res => {
            console.log(res)
            this.$notify({
              type: 'success',
              message: res.retMsg
            })
            this.addVisible = false
            this.listPointPage()
          })
        }
      })
    },
    editSubmit() {
      this.$refs.form1.validate((valid) => {
        if (valid) {
          updatePoint(this.form).then(res => {
            console.log(res)
            this.$notify({
              type: 'success',
              message: res.retMsg
            })
            this.editVisible = false
            this.listPointPage()
          })
        }
      })
    },
    gotoShebei(e) {
      console.log(e)
      this.$router.push({
        name: 'Shebei',
        params: {
          companyId: e.companyId,
          pointId: e.pointId
        }
      })
    },
    gotoyinzi(e) {
      console.log(e)
      this.$router.push({
        name: 'YinziList',
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

  .fuSelect ::v-deep .vue-treeselect__label {
    min-height: 50px;
    line-height: 50px;
    word-wrap: break-word;
    word-break: break-all;
    white-space: pre-wrap;
    border-bottom: 1px solid #eee;
  }

</style>
