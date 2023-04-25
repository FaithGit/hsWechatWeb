<template>
  <div class="testPaper">
    <!-- 条件栏 -->
    <div class="headClass">
      企业名称：
      <el-input v-model="comName" class="seachInput" placeholder="请选择输入关键字" clearable />
      区域code：
      <treeselect
        v-model="areaCode"
        :multiple="false"
        :options="allAreacode"
        :normalizer="normalizer"
        placeholder="请选择区域code"
        class="seachInput"
      />
      <el-button type="primary" @click="seach">搜索</el-button>
      <el-button type="primary" @click="addCom">新增企业</el-button>
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
      <el-table-column align="center" label="所属区域">
        <template slot-scope="scope">
          {{ scope.row.areaName==''?'-':scope.row.areaName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="社会信用代码">
        <template slot-scope="scope">
          {{ scope.row.socialCreditCode==''?'-':scope.row.socialCreditCode }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="环保负责人">
        <template slot-scope="scope">
          {{ scope.row.contact==''?'-':scope.row.contact }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="负责人联系电话">
        <template slot-scope="scope">
          {{ scope.row.contactMobile==''?'-':scope.row.contactMobile }}
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
            :options="allAreacode"
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
            :options="allAreacode"
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
  getAreaCodeTree,
  listCompanyPage,
  addCompany,
  updateCompany
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
      allAreacode: [],
      comName: '',
      areaCode: null,
      status: '',
      addVisible: false,
      editVisible: false,
      listLoading: false,
      form: {},
      allyjList: [], // 全部药剂列表
      yaojiChoose: [], // 全部药剂列表
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
          id: node.value,
          label: node.label,
          children: node.children
        }
      }

    }
  },
  mounted() {
    this.getAreaCodeTree()
    this.listCompanyPage()
  },
  methods: {
    getAreaCodeTree() {
      getAreaCodeTree({
        areaCode: 3304
      }).then(res => {
        console.log(res)
        this.allAreacode.push(res.retData)
      })
    },
    listCompanyPage() {
      listCompanyPage({
        comName: this.comName,
        areaCode: this.areaCode || '',
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
        //   this.listCompanyPage()
        // })
      })
    },
    addCom(e) {
      this.addVisible = true
      this.form = {
        areaCode: null
      }
    },
    sumbitCom() {
      if (this.form.areaCode == null || this.form.areaCode == undefined) {
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
            this.listCompanyPage()
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
            this.listCompanyPage()
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
