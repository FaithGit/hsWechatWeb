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
        @input="changeCom"
      />
      点位名称：
      <treeselect
        v-model="pointId"
        :multiple="false"
        :options="dianweiList"
        :normalizer="normalizer2"
        placeholder="请选择点位名称"
        class="seachInput"
        style="width:300px"
      />
      设备类型：
      <el-select v-model="pointStatus" placeholder="请选择设备类型" class="seachInput" clearable>
        <el-option
          v-for="item in shebeilist"
          :key="item.instrumentType+item.instrumentTypeName"
          :label="item.instrumentTypeName"
          :value="item.instrumentType"
        />
      </el-select>
      <el-button type="primary" @click="seach">搜索</el-button>
      <el-button type="primary" @click="addShebei">新增设备</el-button>
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
      <el-table-column align="center" label="设备名称">
        <template slot-scope="scope">
          {{ (scope.row.instrumentRealName==null||scope.row.instrumentRealName=='')?'-':scope.row.instrumentRealName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="设备类型">
        <template slot-scope="scope">
          {{ (scope.row.typeName==null||scope.row.typeName=='')?'-':scope.row.typeName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否需要维护">
        <template slot-scope="scope">
          {{ (scope.row.checkStatusName==null||scope.row.checkStatusName=='')?'-':scope.row.checkStatusName }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button @click="editPoint(scope.row)">编辑</el-button>
          <!-- <el-button @click="gotoPoint(scope.row)">设备管理</el-button>
          <el-button @click="gotoPoint(scope.row)">因子管理</el-button> -->
          <!-- <el-button type="danger" @click="remove(scope.row)"> 删除</el-button> -->
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
      title="新增设备"
      :append-to-body="true"
      :visible="addVisible"
      width="40%"
      :close-on-click-modal="false"
      @close="addVisible=false"
    >
      <el-form ref="form1" :model="form" label-width="140px" :rules="rules">
        <el-form-item label="企业名称">
          <treeselect
            v-model="form.companyId"
            :multiple="false"
            :options="comlist"
            :normalizer="normalizer"
            placeholder="请选择企业"
            @input="changeCom2"
          />
        </el-form-item>
        <el-form-item label="点位名称">
          <treeselect
            v-model="form.pointId"
            :multiple="false"
            :options="dianweiList2"
            :normalizer="normalizer2"
            placeholder="请选择点位名称"
          />
        </el-form-item>
        <el-form-item label="运维时设备名称" prop="instrumentName">
          <el-input v-model="form.instrumentName" placeholder="请输入运维时设备名称" />
        </el-form-item>
        <el-form-item label="设备名称" prop="instrumentRealName">
          <el-input v-model="form.instrumentRealName" placeholder="请输入设备名称" />
        </el-form-item>

        <el-form-item label="设备类型" prop="instrumentType">
          <el-select v-model="form.instrumentType" placeholder="请选择设备类型">
            <el-option
              v-for="item in shebeilist"
              :key="'3'+item.instrumentType+item.instrumentTypeName"
              :label="item.instrumentTypeName"
              :value="item.instrumentType"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间年份" prop="startYear">
          <el-input v-model="form.startYear" placeholder="请输入开始时间年份" />
        </el-form-item>

        <el-form-item label="设备厂家型号" prop="instrumentFactoryModel">
          <el-input v-model="form.instrumentFactoryModel" placeholder="请输入设备厂家型号" />
        </el-form-item>

        <el-form-item label="运维状态" prop="checkStatus">
          <el-select v-model="form.checkStatus" placeholder="请选择运维状态">
            <el-option label="不需要运维" :value="0" />
            <el-option label="需要运维" :value="1" />
          </el-select>
        </el-form-item>

        <div style="text-align:center;margin-top:80px">
          <el-button @click="addVisible=false">取 消</el-button>
          <el-button type="primary" @click="sumbitPoint">确 定</el-button>
        </div>
      </el-form>
    </el-dialog>

    <el-dialog
      v-if="editVisible"
      title="编辑设备"
      :append-to-body="true"
      :visible="editVisible"
      width="40%"
      :close-on-click-modal="false"
      @close="editVisible=false"
    >

      <el-form ref="form1" :model="form" label-width="140px" :rules="rules">
        <el-form-item label="运维时设备名称" prop="instrumentName">
          <el-input v-model="form.instrumentName" placeholder="请输入运维时设备名称" />
        </el-form-item>
        <el-form-item label="设备名称" prop="instrumentRealName">
          <el-input v-model="form.instrumentRealName" placeholder="请输入设备名称" />
        </el-form-item>

        <el-form-item label="设备类型" prop="instrumentType">
          <el-select v-model="form.instrumentType" placeholder="请选择设备类型">
            <el-option
              v-for="item in shebeilist"
              :key="'2'+item.instrumentType+item.instrumentTypeName"
              :label="item.instrumentTypeName"
              :value="item.instrumentType"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间年份" prop="startYear">
          <el-input v-model="form.startYear" placeholder="请输入开始时间年份" />
        </el-form-item>

        <el-form-item label="设备厂家型号" prop="instrumentFactoryModel">
          <el-input v-model="form.instrumentFactoryModel" placeholder="请输入设备厂家型号" />
        </el-form-item>

        <el-form-item label="运维状态" prop="checkStatus">
          <el-select v-model="form.checkStatus" placeholder="请选择运维状态">
            <el-option label="不需要运维" :value="0" />
            <el-option label="需要运维" :value="1" />
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
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

import {
  listInstrumentPage,
  updateInstrument,
  listCompanySel,
  listShortPointSel,
  listInstrumentTypeSel,
  addInstrument
} from '@/api/table'
import {
  mapGetters
} from 'vuex'
// import moment from 'moment'
export default {
  name: 'Shebei',
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

        checkStatus: [{
          required: true,
          message: '请输入运维状态',
          trigger: 'change'
        }],

        startYear: [{
          required: true,
          message: '请输入开始时间年份',
          trigger: 'blur'
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
    this.listShortPointSel2()
    this.listInstrumentTypeSel()
    this.listShortPointSel()
  },
  methods: {
    changeCom(node, instanceId) {
      console.log('🚀 ~ changeCom ~ node,instanceId:', node, instanceId)
      this.listShortPointSel()
      this.pointId = null
    },
    changeCom2(node, instanceId) {
      console.log('🚀 ~ changeCom ~ node,instanceId:', node, instanceId)
      this.listShortPointSel2()
      // this.form.pointId = null
      this.$set(this.form, 'pointId', null)
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
        instrumentType: this.pointStatus || '',
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
      this.editVisible = true
      this.form = Object.assign({}, e)
      console.log('🚀 ~ editPoint ~   this.form:', this.form)
    },
    // remove(e) {
    //   this.$confirm('此操作将永久删除该企业, 是否继续?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     // deletePharmaceutical({
    //     //   id: e.id
    //     // }).then(res => {
    //     //   this.$notify({
    //     //     type: "success",
    //     //     message: res.retMsg
    //     //   })
    //     //   this.listInstrumentPage()
    //     // })
    //   })
    // },
    addShebei(e) {
      this.addVisible = true
      this.form = {
        companyId: null,
        pointId: null,
        checkStatus: 1,
        startYear: ''
      }
    },
    sumbitPoint() {
      if (this.form.pointId == null || this.form.pointId == undefined || this.form.pointId == '') {
        this.$notify({
          type: 'error',
          message: '请选择点位名称'
        })
        return
      }
      this.$refs.form1.validate((valid) => {
        if (valid) {
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

</style>
