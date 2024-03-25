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

      <el-table-column align="center" label="作业指导手册">
        <template slot-scope="scope">
          <div>
            <template v-for="item in scope.row.manualFileList">
              <img src="@/assets/pdf.png" alt="" srcset="" :title="item.name" style="width:20px;margin-right:10px"
                :key="item.fileId" @click="handlePreview(item)">
            </template>

          </div>

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

        <el-form-item label="作业指导手册">
          (仅限上传pdf文件，点击列表查看附件)
          <el-upload action="#" :on-change="handleChangeID" :on-remove="handleRemoveID" :on-preview="handlePreview"
            :auto-upload="false" :file-list="zhiweiList" accept=".pdf">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>





        <div style="text-align:center;margin-top:80px">
          <el-button @click="editVisible=false">取 消</el-button>
          <el-button type="primary" @click="editSubmit" v-loading="loading">更 新</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog v-if="pdfVisible" title="预览pdf" :append-to-body="true" :visible.sync="pdfVisible" width="70%"
      :close-on-click-modal="true" @close="pdfVisible=false">
      <div style="height:70vh;overflow: auto;">
        <pdf v-for="item in pageTotal" :src="pdfUrl" :key="item" :page="item">
        </pdf>
      </div>


      <img src="@/assets/dwfile.png" class="dwfile" alt="" srcset="" @click="dwFile">
    </el-dialog>
  </div>
</template>

<script>
  import pdf from 'vue-pdf'
  import Treeselect from '@riophae/vue-treeselect'
  // import the styles
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import axios from 'axios'
  import setting from '@/settings'
  import {
    getToken
  } from '@/utils/auth'
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
    updateInstrumentType,
  } from '@/api/table'
  import {
    mapGetters
  } from 'vuex'
  // import moment from 'moment'
  export default {
    name: 'Shebei',
    components: {
      Treeselect,
      pdf
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
        zhiweiList: [], // 全部药剂列表
        pdfUrl: "",
        realUrl:"",
        pageTotal: 0,
        pointStatus: '',
        comName: '',
        pointName: '',
        status: '',
        pollutionType: '',
        addVisible: false,
        editVisible: false,
        listLoading: false,
        pdfVisible: false,
        loading: false,
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
      handleChangeID(file, fileList) { // 身份附件上传
        var formData = new FormData()
        this.loading = true
        formData.append('file', file.raw)
        formData.append('type', 'manual')
        axios.post(setting.baseUrl + '/sysSup/fileConvert', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'token': getToken()
            }
          })
          .then(res => {
            console.log(res.data)
            this.loading = false
            this.zhiweiList.push(res.data.retData)
          })
      },
      handleRemoveID(file, fileList) { // 身份附件删除
        console.log(file, fileList)
        this.zhiweiList = fileList
      },

      handlePreview(file) { // 预览
        console.log(file)
        this.realUrl=file.url
        this.pdfUrl = pdf.createLoadingTask(file.url)
        this.pdfUrl.promise.then(pdf => {
          this.pageTotal = pdf.numPages
          this.pdfVisible = true
        }).catch(error => {})

        // window.open(file.url)
      },
      dwFile() {
        window.open(this.realUrl)
      },
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
        this.zhiweiList = []
        getInstrumentType({
          instrumentType: e.type
        }).then(res => {
          console.log(res)
          this.editVisible = true
          this.form = res.retData
          this.zhiweiList = this.form.manualFileList
        })
        console.log('🚀 ~ editPoint ~   this.form:', this.form)
      },
      editSubmit() {
        this.$refs.form1.validate((valid) => {
          if (valid) {
            this.form.manualFileList = this.zhiweiList
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

  .dwfile {
    position: absolute;
    right: -3vw;
    bottom: 0vw;
    z-index: 9999;
    width: 50px;
    cursor: pointer;
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
