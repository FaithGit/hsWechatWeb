<template>
  <div class="testPaper">
    <!-- 条件栏 -->
    <div>
      试剂名称：
      <el-input v-model="reagentName" class="seachInput" placeholder="请输入试剂名称" clearable />
      设备品牌名称：
      <el-input v-model="deviceName" class="seachInput" placeholder="请输入设备品牌名称" clearable />
      仪器名称：
      <el-input v-model="instrumentName" class="seachInput" placeholder="请输入仪器名称" clearable />
      <el-button type="primary" @click="seach">搜索</el-button>
      <el-button type="primary" @click="addShiji">新增试剂</el-button>
      <el-button v-loading="downloading" type="primary" plain @click="xlsxDownload">试剂记录</el-button>
    </div>

    <!-- 表格 -->
    <el-table v-loading="listLoading" :data="records" element-loading-text="加载中" border fit stripe highlight-current-row
      style="margin-top:1.04vw" height="calc(100vh - 84px - 60px - 40px - 32px - 1.04vw - 17px)">
      <el-table-column align="center" label="#" width="95">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="试剂名称" prop="reagentName" />
      <el-table-column align="center" label="体积每瓶次(ml)">
        <template slot-scope="scope">
          {{ computedNull(scope.row.volumesBottle) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="设备品牌名称" prop="deviceName" />
      <el-table-column align="center" label="仪器名称" prop="instrumentName" />
      <el-table-column align="center" label="有效时间" prop="effectTime" />
      <el-table-column align="center" label="主要药剂浓度" prop="concentration" />
      <el-table-column align="center" label="主要含药剂名称" prop="concentrationName" />
      <el-table-column align="center" label="操作" width="400">
        <template slot-scope="scope">
          <el-button @click="editShiji(scope.row)">编辑信息</el-button>
          <el-button type="success" @click="bangding(scope.row)">药剂配方</el-button>
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

    <el-dialog v-if="addVisible" title="新增试剂" :append-to-body="true" :visible="addVisible" width="50%"
      :close-on-click-modal="false" @close="addVisible=false">
      <el-form ref="form1" :model="form" label-width="140px" :rules="rules">
        <el-form-item label="试剂名称" prop="reagentName">
          <el-input v-model="form.reagentName" placeholder="请输入试剂名称" />
        </el-form-item>
        <el-form-item label="体积每瓶次(ml)" prop="volumesBottle">
          <el-input v-model="form.volumesBottle" placeholder="请输入体积每瓶次(ml)" />
        </el-form-item>
        <el-form-item label="设备品牌名称" prop="deviceName">
          <el-input v-model="form.deviceName" placeholder="请输入设备品牌名称" />
        </el-form-item>
        <el-form-item label="仪器名称" prop="instrumentName">
          <el-input v-model="form.instrumentName" placeholder="请输入仪器名称" />
        </el-form-item>
        <el-form-item label="有效时间" prop="effectTime">
          <el-input v-model="form.effectTime" placeholder="请输入有效时间" />
        </el-form-item>
        <el-form-item label="主要药剂浓度" prop="concentration">
          <el-input v-model="form.concentration" placeholder="请输入主要药剂浓度" />
        </el-form-item>
        <el-form-item label="主要含药剂名称" prop="concentrationName">
          <el-input v-model="form.concentrationName" placeholder="请输入主要含药剂名称" />
        </el-form-item>
        <el-form-item label="选择药剂">
          <treeselect v-model="yaojiChoose" :multiple="true" :options="allyjList" :normalizer="normalizer"
            placeholder="请选择药剂" @input="ShijiChoonseInput">
            <label slot="option-label" slot-scope="{ node, labelClassName }" :class="labelClassName"
              :title="node.label">
              {{ node.label }}
            </label>
          </treeselect>
        </el-form-item>
        <div style="padding-left:140px">
          <div v-for="item in form.reagentPharmaceuticalList" :key="item.pharmaceuticalId" class="card">
            <span style="min-width:180px"> {{ item.pharmaceuticalName }}( {{ item.unit }})</span>
            <el-input-number v-model="item.pharmaceuticalNum" placeholder="请输入药剂量" />
          </div>
        </div>
        <div style="text-align:center">
          <el-button @click="addVisible=false">取 消</el-button>
          <el-button type="primary" @click="sumbitShiji">确 定</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog v-if="editVisible" title="编辑试剂" :append-to-body="true" :visible="editVisible" width="50%"
      :close-on-click-modal="false" @close="editVisible=false">
      <el-form ref="form1" :model="form" label-width="140px" :rules="rules">
        <el-form-item label="试剂名称" prop="reagentName">
          <el-input v-model="form.reagentName" placeholder="请输入试剂名称" />
        </el-form-item>
        <el-form-item label="体积每瓶次(ml)" prop="volumesBottle">
          <el-input v-model="form.volumesBottle" placeholder="请输入体积每瓶次(ml)" />
        </el-form-item>
        <el-form-item label="设备品牌名称" prop="deviceName">
          <el-input v-model="form.deviceName" placeholder="请输入设备品牌名称" />
        </el-form-item>
        <el-form-item label="仪器名称" prop="instrumentName">
          <el-input v-model="form.instrumentName" placeholder="请输入仪器名称" />
        </el-form-item>
        <el-form-item label="有效时间" prop="effectTime">
          <el-input v-model="form.effectTime" placeholder="请输入有效时间" />
        </el-form-item>
        <el-form-item label="主要药剂浓度" prop="concentration">
          <el-input v-model="form.concentration" placeholder="请输入主要药剂浓度" />
        </el-form-item>
        <el-form-item label="主要含药剂名称" prop="concentrationName">
          <el-input v-model="form.concentrationName" placeholder="请输入主要含药剂名称" />
        </el-form-item>
        <div style="text-align:center">
          <el-button @click="editVisible=false">取 消</el-button>
          <el-button type="primary" @click="editSumbit">确 定</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog v-if="bangdingVisible" title="药剂绑定" :append-to-body="true" :visible="bangdingVisible" width="50%"
      :close-on-click-modal="false" @close="bangdingVisible=false">
      <el-form ref="form1" :model="form" label-width="140px" :rules="rules">
        <el-form-item label="试剂名称" prop="reagentName">
          <el-input v-model="form.reagentName" placeholder="请输入试剂名称" :readonly="true" />
        </el-form-item>
        <div style="padding-left:140px">
          <div v-for="(item,index) in form.reagentPharmaceuticalInfoList" :key="item.pharmaceuticalId" class="card">
            <span style="min-width:180px"> {{ item.pharmaceuticalName }} ({{ item.unit }})</span>
            <span>
              <el-input-number v-model="item.pharmaceuticalNum" placeholder="请输入药剂量" />
              <el-button type="success" style="margin-left:10px" @click="bangdingEdit(item)">更新药剂</el-button>
              <el-button type="danger" @click="bangdingremove(item,index)"> 删除</el-button>
            </span>
          </div>
        </div>
        <div style="text-align:center">
          <el-button type="primary" @click="addguanlian">新增关联</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog v-if="addbdVisible" title="药剂绑定" :append-to-body="true" :visible="addbdVisible" width="50%"
      :close-on-click-modal="false" @close="addbdVisible=false">
      <el-form ref="form1" :model="form" label-width="140px" :rules="rules">
        <el-form-item label="试剂名称" prop="reagentName">
          <el-input v-model="form.reagentName" placeholder="请输入试剂名称" :readonly="true" />
        </el-form-item>
        <el-form-item label="药剂名称">
          <treeselect v-model="pharmaceuticalId" :multiple="false" :options="allyjList" :normalizer="normalizer"
            placeholder="请选择药剂">
            <label slot="option-label" slot-scope="{ node, labelClassName }" :class="labelClassName"
              :title="node.label">
              {{ node.label }}
            </label>
          </treeselect>
        </el-form-item>
        <el-form-item label="所需药剂数量">
          <el-input v-model="pharmaceuticalNum" placeholder="请输入所需药剂数量" />
        </el-form-item>
        <div style="text-align:center">
          <el-button @click="addbdVisible=false">取 消</el-button>
          <el-button type="primary" @click="addbdSumbit">确 定</el-button>
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
    reagentList,
    listPharmaceuticalPage,
    addReagent,
    removeReagent,
    getReagent,
    updateReagent,
    updateReagentPharmaceutical,
    removeReagentPharmaceutical,
    addReagentPharmaceutical,
    exportPreparationReagent
  } from '@/api/table'
  import {
    mapGetters
  } from 'vuex'
  // import moment from 'moment'
  export default {
    name: 'Shiji',
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
        reagentName: '',
        bangdingId: '',
        deviceName: '',
        instrumentName: '',
        addVisible: false,
        editVisible: false,
        listLoading: false,
        bangdingVisible: false,
        addbdVisible: false,
        downloading: false,
        form: {},
        allyjList: [], // 全部药剂列表
        yaojiChoose: [], // 全部药剂列表
        rules: {
          reagentName: [{
            required: true,
            message: '请输入试剂名称',
            trigger: 'blur'
          }],
          deviceName: [{
            required: true,
            message: '请输入设备品牌名称',
            trigger: 'blur'
          }],
          instrumentName: [{
            required: true,
            message: '请输入仪器名称',
            trigger: 'blur'
          }],
          effectTime: [{
            required: true,
            message: '请输入有效时间',
            trigger: 'blur'
          }],
          concentration: [{
            required: true,
            message: '请输入主要药剂浓度',
            trigger: 'blur'
          }],
          concentrationName: [{
            required: true,
            message: '请输入主要含药剂名称',
            trigger: 'blur'
          }],
          startTime: [{
            required: true,
            message: '请选择视频学习开始时间',
            trigger: 'change'
          }]

        },
        pharmaceuticalId: '',
        pharmaceuticalNum: '',
        normalizer(node) {
          return {
            id: node.id,
            label: node.pharmaceuticalName,
            children: node.subOptions && node.subOptions.length ? node.subOptions : 0
          }
        }
      }
    },
    mounted() {
      this.reagentList()
      this.listPharmaceutical()
    },
    methods: {
      computedNull(val) {
        if (val === undefined || val === null || val === '' || val === ' ') {
          return '-'
        } else {
          return val
        }
      },
      reagentList() {
        reagentList({
          reagentName: this.reagentName,
          deviceName: this.deviceName,
          instrumentName: this.instrumentName,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }).then(res => {
          console.log('🚀 ~ listVideo ~ res', res)
          this.records = res.retData.records
          this.total = res.retData.total
        })
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.reagentList()
      },
      handleCurrentChange(val) {
        this.pageIndex = val
        this.reagentList()
      },
      seach() {
        this.pageIndex = 1
        this.reagentList()
      },
      editShiji(e) {
        console.log('?', e.id)
        getReagent({
          id: e.id
        }).then(res => {
          this.editVisible = true
          this.form = res.retData
        })
      },
      remove(e) {
        this.$confirm('此操作将永久删除该试剂, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          removeReagent({
            id: e.id
          }).then(res => {
            this.$notify({
              type: 'success',
              message: res.retMsg
            })
            this.reagentList()
          })
        })
      },
      addShiji() { // 新增试剂
        this.addVisible = true
        this.form = {
          reagentName: '',
          deviceName: '',
          instrumentName: '',
          effectTime: '',
          concentration: '',
          concentrationName: '',
          reagentPharmaceuticalList: []
        }
        this.yaojiChoose = []
      },
      listPharmaceutical() { // 全部试剂 新增使用
        listPharmaceuticalPage({
          pageIndex: 1,
          pageSize: 9999999,
          pharmaceuticalName: '',
          status: ''
        }).then(res => {
          console.log(res)
          this.allyjList = res.retData.records
          console.log('🚀 ~ listPharmaceutical ~ this.allyjList:', this.allyjList)
        })
      },
      sumbitShiji() { // 提交试剂
        this.$refs.form1.validate((valid) => {
          if (valid) {
            if (this.yaojiChoose.length == 0) {
              this.$notify({
                type: 'warning',
                message: '请选择药剂'
              })
              return
            }
            addReagent(this.form).then(res => {
              console.log(res)
              this.$notify({
                type: 'success',
                message: res.retMsg
              })
              this.addVisible = false
              this.reagentList()
            })
          }
        })
      },
      editSumbit() {
        this.$refs.form1.validate((valid) => {
          if (valid) {
            updateReagent({
              id: this.form.id,
              reagentName: this.form.reagentName,
              deviceName: this.form.deviceName,
              instrumentName: this.form.instrumentName,
              effectTime: this.form.effectTime,
              concentration: this.form.concentration,
              concentrationName: this.form.concentrationName,
              volumesBottle: this.form.volumesBottle
            }).then(res => {
              console.log(res)
              this.$notify({
                type: 'success',
                message: res.retMsg
              })
              this.editVisible = false
              this.reagentList()
            })
          }
        })
      },
      ShijiChoonseInput(arr) { // 去匹配 reagentPharmaceuticalList 核心
        const has = this.form.reagentPharmaceuticalList
        arr.forEach(e => { // 先新增没有的
          // console.log("🚀 ~新数组id:", e)
          const hasIndex = has.findIndex(h => { //
            // console.log("🚀 ~ 循环已有的id", h.pharmaceuticalId)
            return h.pharmaceuticalId == e
          })
          // console.log("🚀 ~ hasIndex ~ hasIndex:", hasIndex)
          if (hasIndex == -1) {
            const _findex = this.allyjList.findIndex(i => {
              return i.id == e
            })
            has.push({
              unit: this.allyjList[_findex].unit,
              pharmaceuticalName: this.allyjList[_findex].pharmaceuticalName,
              pharmaceuticalId: this.allyjList[_findex].id,
              pharmaceuticalNum: 1
            })
          }
        })
        const newarr = []
        arr.forEach(e => { // 匹配已有的新增,没有的剔除
          const hIndex = has.findIndex(h => {
            return h.pharmaceuticalId == e
          })
          if (hIndex != -1) {
            newarr.push(has[hIndex])
          }
        })
        this.form.reagentPharmaceuticalList = newarr
      },
      bangding(e) {
        this.bangdingId = e.id
        getReagent({
          id: this.bangdingId
        }).then(res => {
          this.bangdingVisible = true
          this.form = res.retData
        })
      },
      bangdingEdit(e) {
        console.log(e)
        updateReagentPharmaceutical({
          reagentId: e.reagentId,
          pharmaceuticalId: e.pharmaceuticalId,
          pharmaceuticalNum: e.pharmaceuticalNum
        }).then(res => {
          console.log(res)
          this.$notify({
            type: 'success',
            message: res.retMsg
          })
        })
      },
      bangdingremove(e, index) {
        this.$confirm('此操作将永久移除关联, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          removeReagentPharmaceutical({
            reagentId: e.reagentId,
            pharmaceuticalId: e.pharmaceuticalId
          }).then(res => {
            this.form.reagentPharmaceuticalInfoList.splice(index, 1)
            this.$notify({
              type: 'success',
              message: res.retMsg
            })
          })
        })
      },
      addguanlian() {
        console.log('添加关联')
        this.addbdVisible = true
        this.pharmaceuticalId = null
        this.pharmaceuticalNum = ''
      },
      addbdSumbit() {
        if (!this.pharmaceuticalId || this.pharmaceuticalNum == '') {
          this.$notify({
            type: 'warning',
            message: '选项不能为空'
          })
          return
        }
        addReagentPharmaceutical({
          reagentId: this.form.id,
          pharmaceuticalId: this.pharmaceuticalId,
          pharmaceuticalNum: this.pharmaceuticalNum
        }).then(res => {
          this.$notify({
            type: 'success',
            message: res.retMsg
          })

          getReagent({
            id: this.form.id
          }).then(res => {
            this.form = res.retData
            this.addbdVisible = false
          })
        })
      },
      xlsxDownload() {
        this.downloading = true
        exportPreparationReagent({}).then(res => {
          console.log(res)
          this.downloading = false
          window.open(res.retData)
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

</style>
