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
      运维组：
      <treeselect
        v-model="groupId"
        :multiple="false"
        :options="groupList"
        :normalizer="normalizer2"
        placeholder="请选择运维组"
        class="seachInput"
      />
      站点状态：
      <el-select v-model="pointStatus" placeholder="请选择站点状态" class="seachInput" clearable>
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-button type="primary" @click="seach">搜索</el-button>
      <el-button type="primary" @click="addPoint">新增点位</el-button>
    </div>

    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="records"
      element-loading-text="加载中"
      border
      fit
      highlight-current-row
      style="margin-top:1.04vw"
    >
      <el-table-column align="center" label="#" width="95">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="企业名称" prop="comName" />
      <el-table-column align="center" label="点位名称" prop="pointName" />
      <el-table-column align="center" label="站点状态" prop="pointStatusName" />
      <el-table-column align="center" label="运维组">
        <template slot-scope="scope">
          {{ (scope.row.groupName==null||scope.row.groupName=='')?'-':scope.row.groupName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="排放标准">
        <template slot-scope="scope">
          {{ (scope.row.dischargeStandard==null||scope.row.dischargeStandard=='')?'-':scope.row.dischargeStandard }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="关注程度">
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

      <el-table-column align="center" label="操作" width="280">
        <template slot-scope="scope">
          <el-button @click="editShiji(scope.row)">编辑</el-button>
          <el-button @click="gotoPoint(scope.row)">点位管理</el-button>
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
      title="新增企业"
      :append-to-body="true"
      :visible="addVisible"
      width="40%"
      :close-on-click-modal="false"
      @close="addVisible=false"
    >
      <el-form ref="form1" :model="form" label-width="140px" :rules="rules">
        <el-form-item label="企业名称" prop="comName">
          <el-input v-model="form.comName" placeholder="请输入企业名称" />
        </el-form-item>
        <el-form-item label="社会信用代码" prop="socialCreditCode">
          <el-input v-model="form.socialCreditCode" placeholder="请输入社会信用代码" />
        </el-form-item>
        <el-form-item label="区域code" prop="unit">
          <treeselect
            v-model="form.areaCode"
            :multiple="false"
            :options="comlist"
            :normalizer="normalizer"
            placeholder="请选择区域code"
            class="seachInput"
            style="margin:0"
          />
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

    <el-dialog
      v-if="editVisible"
      title="编辑药剂"
      :append-to-body="true"
      :visible="editVisible"
      width="40%"
      :close-on-click-modal="false"
      @close="editVisible=false"
    >

      <el-form ref="form1" :model="form" label-width="140px" :rules="rules">
        <el-form-item label="企业名称" prop="comName">
          <el-input v-model="form.comName" placeholder="请输入企业名称" />
        </el-form-item>
        <el-form-item label="社会信用代码" prop="socialCreditCode">
          <el-input v-model="form.socialCreditCode" placeholder="请输入社会信用代码" />
        </el-form-item>
        <el-form-item label="区域code" prop="unit">
          <treeselect
            v-model="form.areaCode"
            :multiple="false"
            :options="comlist"
            :normalizer="normalizer"
            placeholder="请选择区域code"
            class="seachInput"
            style="margin:0"
          />
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
  listPointPage,
  addCompany,
  updateCompany,
  listCompanySel,
  listGroupSel
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
      total: 0,
      records: [],
      comlist: [],
      groupList: [],
      pointStatus: '',

      comName: '',
      pointName: '',
      status: '',
      addVisible: false,
      editVisible: false,
      listLoading: false,
      form: {},
      allyjList: [], // 全部药剂列表
      yaojiChoose: [], // 全部药剂列表
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
        comName: [{
          required: true,
          message: '请输入环保负责人',
          trigger: 'blur'
        }],
        contactMobile: [{
          required: true,
          validator: moblie,
          trigger: 'blur'
        }],
        contact: [{
          required: true,
          message: '请输入企业名称',
          trigger: 'blur'
        }],
        lng: [{
          required: true,
          message: '请输入经度',
          trigger: 'blur'
        }],
        lat: [{
          required: true,
          message: '请输入维度',
          trigger: 'blur'
        }],
        socialCreditCode: [{
          required: true,
          message: '请输入统一社会信用代码',
          trigger: 'blur'
        }, {
          len: 18,
          message: '请输入18位统一社会信用代码',
          trigger: 'blur'
        }]
      },
      normalizer(node) {
        return {
          id: node.companyId,
          label: node.comName,
          children: node.children
        }
      },
      normalizer2(node) {
        return {
          id: node.groupId,
          label: node.groupName,
          children: node.children
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
    this.listGroupSel()
    this.listPointPage()
    this.listCompanySel()
  },
  methods: {
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
    editShiji(e) {
      this.editVisible = true
      if (e.areaCode === 0) {
        e.areaCode = null
      }
      this.form = e
      console.log('🚀 ~ editShiji ~   this.form:', this.form)
    },
    remove(e) {
      this.$confirm('此操作将永久删除该企业, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // deletePharmaceutical({
        //   id: e.id
        // }).then(res => {
        //   this.$notify({
        //     type: "success",
        //     message: res.retMsg
        //   })
        //   this.listPointPage()
        // })
      })
    },
    addPoint(e) {
      this.addVisible = true
      this.form = {
        companyId: null,
        groupId: null
      }
    },
    sumbitCom() {
      if (this.form.areaCode === null || this.form.areaCode === undefined) {
        this.$notify({
          type: 'error',
          message: '请选择地区code'
        })
        return
      }
      this.$refs.form1.validate((valid) => {
        if (valid) {
          addCompany(this.form).then(res => {
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
      if (this.form.areaCode == null || this.form.areaCode == undefined) {
        this.$notify({
          type: 'error',
          message: '请选择地区code'
        })
        return
      }
      this.$refs.form1.validate((valid) => {
        if (valid) {
          updateCompany(this.form).then(res => {
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

</style>
