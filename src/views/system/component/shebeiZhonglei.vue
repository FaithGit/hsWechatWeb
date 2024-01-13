<template>
  <div class="testPaper">


    <!-- 表格 -->
    <el-table v-loading="listLoading" :data="records" element-loading-text="加载中" border fit style="margin-top:1.04vw"
      height="calc(100vh - 84px - 60px - 40px - 32px - 1.04vw - 17px - 10vw)">

      <el-table-column align="center" label="排序号" prop="orderNum" />

      <el-table-column align="center" label="设备类型名称">
        <template slot-scope="scope">
          {{ computedNull(scope.row.typeName) }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="所属大类">
        <template slot-scope="scope">
          {{ computedNull(scope.row.mainTypeName) }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="工作量">
        <template slot-scope="scope">
          {{ computedNull(scope.row.workload) }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button @click="editPoint(scope.row)">编辑</el-button>
          <!-- <el-button type="danger" @click="remove(scope.row)"> 删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-if="editVisible" title="修改设备类型" :append-to-body="true" :visible="editVisible" width="40%"
      :close-on-click-modal="false" @close="editVisible=false">

      <el-form ref="form1" :model="form" label-width="140px" :rules="rules">


        <!-- <el-form-item label="设备类型" prop="instrumentType">
          <el-select v-model="form.instrumentType" placeholder="请选择设备类型" @change="toggleInstrumentType">
            <el-option v-for="item in shebeilist" :key="'2'+item.instrumentType+item.instrumentTypeName"
              :label="item.instrumentTypeName" :value="item.instrumentType" />
          </el-select>
        </el-form-item> -->
        <el-form-item label="设备类型名称" prop="typeName">
          <el-input v-model="form.typeName" placeholder="请输入设备类型名称" />
        </el-form-item>

        <el-form-item label="排序号" prop="orderNum">
          <el-input v-model="form.orderNum" placeholder="请输入排序号" />
        </el-form-item>

        <el-form-item label="主类型" prop="mainType">
          <el-select v-model="form.mainType" placeholder="请选择主类型" disabled>
            <el-option label="废水" :value="1" />
            <el-option label="废气" :value="2" />
            <el-option label="VOCs" :value="3" />
            <el-option label="其他" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="工作量" prop="workload">
          <el-input v-model="form.workload" placeholder="请输入工作量" />
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
    addInstrument,
    deleteInstrument,
    getInstrumentById,
    listInstrumentType,
    getInstrumentType,
    updateInstrumentType
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
        pollutionType: '',
        addVisible: false,
        editVisible: false,
        listLoading: false,
        form: {},
        allyjList: [], // 全部药剂列表
        yaojiChoose: [], // 全部药剂列表
        shebeilist: [], // 全部药剂列表
        dianweiList: [], // 全部药剂列表
        dianweiList2: [], // 全部药剂列表
        rules: {
          typeName: [{
            required: true,
            message: '请输入设备类型名称',
            trigger: 'blur'
          }],
          workload: [{
            required: true,
            type: 'number',
            message: '必须为数字',
            transform: value =>
              this.$options.filters.formValidateFun(value, 'number')
          }],
          orderNum: [{
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
    mounted() {
      this.listInstrumentType()
    },
    methods: {

      listInstrumentType() {
        listInstrumentType({}).then(res => {
          console.log(res)
          this.records = res.retData
        })
      },
      computedNull(val) {
        if (val === undefined || val === null || val === '' || val === ' ') {
          return '-'
        } else {
          return val
        }
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

      editPoint(e) {
        console.log(e)

        getInstrumentType({
          instrumentType: e.type
        }).then(res => {
          console.log(res)
          this.editVisible = true
          this.form = res.retData
        })

        console.log('🚀 ~ editPoint ~   this.form:', this.form)
      },
      editSubmit() {
        this.$refs.form1.validate((valid) => {
          if (valid) {
            updateInstrumentType(this.form).then(res => {
              console.log(res)
              this.$notify({
                type: 'success',
                message: res.retMsg
              })
              this.editVisible = false
              this.listInstrumentType()
            })
          }
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

  .headClass {
    display: flex;
    align-items: center;
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
