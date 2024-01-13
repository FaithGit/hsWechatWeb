<template>
  <div class="testPaper">
    <!-- 条件栏 -->
    <div class="headClass">
      运维组：
      <treeselect v-model="groupId" :multiple="false" :options="groupList" :normalizer="normalizer2"
        placeholder="请选择运维组" :clearable="true" class="seachInput" />
      <el-button type="primary" @click="seach">搜索</el-button>
      <el-button plain :type="mode==1?'primary':''" @click="toggleMode(1)">简略</el-button>
      <el-button plain :type="mode==2?'primary':''" @click="toggleMode(2)">详细(点位)</el-button>
      <el-button plain :type="mode==3?'primary':''" @click="toggleMode(3)">详细(设备)</el-button>

    </div>

    <!-- 表格 -->
    <el-table v-if="listLoading" :data="newRecords" element-loading-text="加载中" border fit :span-method="arraySpanMethod"
      :row-class-name="tableRowClassName" style="margin-top:1.04vw"
      height="calc(100vh - 84px - 60px - 40px  - 1.04vw )">

      <el-table-column v-if="mode==1||mode==2||mode==3" align="center" label="组名称" prop="groupName" />
      <el-table-column v-if="mode==1||mode==2||mode==3" align="center" label="组成员" prop="groupUserNames" />
      <el-table-column v-if="mode==1||mode==2||mode==3" align="center" label="总工作量(无系数)" prop="allWorkload" />
      <el-table-column v-if="mode==1||mode==2||mode==3" align="center" label="总工作量(系数)" prop="zsAllWorkload" />

      <el-table-column v-if="mode==2||mode==3" align="center" label="点位名称" prop="pointName" />
      <el-table-column v-if="mode==2||mode==3" align="center" label="点位工作量(无系数)" prop="pointWorkload" />
      <el-table-column v-if="mode==2||mode==3" align="center" label="点位系数">
        <template slot-scope="scope">
          <div class="editFont" @click="editPointxs(scope.row)">
            {{ scope.row.workloadCoefficient }}
          </div>

        </template>
      </el-table-column>

      <el-table-column v-if="mode==2||mode==3" align="center" label="点位工作量(系数)" prop="zsPointWorkload" />


      <el-table-column v-if="mode==3" align="center" label="设备名称" prop="instrumentName" />
      <el-table-column v-if="mode==3" align="center" label="设备工作量(无系数)">
        <template slot-scope="scope">
          <div class="editFont" @click="editsbxs(scope.row)">
            {{ scope.row.instrumentWorkload }}
          </div>

        </template>
      </el-table-column>

      <el-table-column v-if="mode==3" align="center" label="设备工作量(系数)" prop="zsInstrumentWorkload" />

      <!-- <el-table-column align="center" label="是否需要维护">
        <template slot-scope="scope">
          {{ computedNull(scope.row.checkStatusName) }}
        </template>
      </el-table-column> -->
    </el-table>

    <el-dialog :title="editTitle" :visible.sync="editPointVisible" :append-to-body="true" :close-on-click-modal="false"
      width="30%" center>
      <el-form ref="form1" :model="form" label-width="140px" :rules="rules">

        <el-form-item label="旧值" prop="oldValue">
          <el-input v-model="form.oldValue" placeholder="请输入旧值" disabled />
        </el-form-item>

        <el-form-item label="修改值" prop="newValue">
          <el-input v-model="form.newValue" placeholder="请输入修改值" />
        </el-form-item>

        <div style="text-align:center;margin-top:80px">
          <el-button @click="editPointVisible=false">取 消</el-button>
          <el-button type="primary" @click="updata">更 新</el-button>
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
    listGroupSel,
    listWorkload,
    updateWorkloadCoefficient,
    updateInstrumentWorkload
  } from '@/api/table'
  import {
    mapGetters
  } from 'vuex'
  // import moment from 'moment'
  export default {
    name: 'WorkLoad',
    components: {
      Treeselect
    },
    data() {
      return {
        mode: 1, //1 简约  2详情
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
        editTitle: '',
        newRecords: [],
        comName: '',
        pointName: '',
        status: '',
        pollutionType: '',
        newValue: "",
        addVisible: false,
        editVisible: false,
        listLoading: false,
        editPointVisible: false,
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
          oldValue: [{
            required: true,
            type: 'number',
            message: '必须为数字',
            transform: value =>
              this.$options.filters.formValidateFun(value, 'number')
          }],
          newValue: [{
            required: true,
            type: 'number',
            message: '必须为数字',
            transform: value =>
              this.$options.filters.formValidateFun(value, 'number')
          }],

        },
        normalizer2(node) {
          return {
            id: node.groupId,
            label: node.groupName,
            children: node.children && node.children.length ? node.children : 0
          }
        },

      }
    },
    computed: {
      ...mapGetters([
        'userId', 'roleId', 'userGroupId'
      ])
    },
    mounted() {
      listGroupSel({}).then(res => {
        console.log(res)
        this.groupList = res.retData
      })


      // this.listCompanySel()
      // this.listShortPointSel2()
      // this.listInstrumentTypeSel()
      // this.listShortPointSel()
      this.listWorkload()
    },
    methods: {
      updata() {
        console.log("提交")
        console.log(this.form)

        if (this.form.type == 1) {
          updateWorkloadCoefficient({
            pointId: this.form.pointId,
            workloadCoefficient: this.form.newValue
          }).then(res => {
            console.log(res)
            this.$notify({
              type: "success",
              message: "操作成功"
            })

            this.editPointVisible = false
            this.listWorkload()
          })
        } else {
          updateInstrumentWorkload({
            instrumentId: this.form.instrumentId,
            workload: this.form.newValue,

          }).then(res => {
            console.log(res)
            this.$notify({
              type: "success",
              message: "操作成功"
            })

            this.editPointVisible = false
            this.listWorkload()
          })

        }

      },
      editPointxs(row) {
        console.log(row)
        console.log(row.pointId)
        console.log(row.workloadCoefficient)
        this.editTitle = row.pointName

        this.form = {
          oldValue: row.workloadCoefficient,
          newValue: '',
          pointId: row.pointId,
          type: 1 //点位
        }

        this.editPointVisible = true

      },
      editsbxs(row) {
        console.log(row)
        console.log(row.pointId)
        console.log(row.workloadCoefficient)
        this.editTitle = row.pointName

        this.form = {
          oldValue: row.instrumentWorkload,
          newValue: '',
          instrumentId: row.instrumentId,
          type: 2 //点位
        }

        this.editPointVisible = true

      },
      toggleMode(value) {
        this.listLoading = false
        this.mode = value
        this.$nextTick(() => {
          this.listLoading = true
        })

      },
      listWorkload() {
        listWorkload({
          groupId: this.groupId
        }).then(res => {
          console.log(res)

          var temp = res.retData
          var newRecords = []
          const comIndex = [] // 公司行数
          const pointIndex = [] // 点位行数

          var comNum = 0
          var pointNum = 0

          temp.forEach((e, index) => {
            comNum = 0


            if (e.points.length === 0) { // 该组没有点位
              newRecords.push({
                groupName: this.computedNull(e.groupName),
                groupUserNames: this.computedNull(e.groupUserNames),
                allWorkload: this.computedNull(e.allWorkload),
                zsAllWorkload: this.computedNull(e.zsAllWorkload),
                pointName: "-",
                pointWorkload: "-",
                workloadCoefficient: "-",
                zsPointWorkload: "-",
                instrumentName: "-",
                instrumentWorkload: "-",
                zsInstrumentWorkload: "-",
                index: index
              })
              comNum++
              pointIndex.push(1)
            } else {
              e.points.forEach(i => { // 有点位
                if (i.instruments.length === 0) { // 该组没有设备

                  newRecords.push({
                    groupName: this.computedNull(e.groupName),
                    groupUserNames: this.computedNull(e.groupUserNames),
                    allWorkload: this.computedNull(e.allWorkload),
                    zsAllWorkload: this.computedNull(e.zsAllWorkload),
                    pointName: this.computedNull(i.pointName),
                    pointId: this.computedNull(i.pointId),
                    pointWorkload: this.computedNull(i.pointWorkload),
                    workloadCoefficient: this.computedNull(i.workloadCoefficient),
                    zsPointWorkload: this.computedNull(i.zsPointWorkload),
                    instrumentName: "-",
                    instrumentWorkload: "-",
                    zsInstrumentWorkload: "-",
                    index: index
                  })
                  comNum++
                  pointIndex.push(1)
                } else {
                  pointNum = 0
                  // 有设备
                  i.instruments.forEach(ii => {
                    pointNum++
                    newRecords.push({
                      groupName: this.computedNull(e.groupName),
                      groupUserNames: this.computedNull(e.groupUserNames),
                      allWorkload: this.computedNull(e.allWorkload),
                      zsAllWorkload: this.computedNull(e.zsAllWorkload),
                      pointId: this.computedNull(i.pointId),
                      pointName: this.computedNull(i.pointName),
                      pointWorkload: this.computedNull(i.pointWorkload),
                      workloadCoefficient: this.computedNull(i.workloadCoefficient),
                      zsPointWorkload: this.computedNull(i.zsPointWorkload),
                      instrumentId: this.computedNull(ii.instrumentId),
                      instrumentName: this.computedNull(ii.instrumentName),
                      instrumentWorkload: this.computedNull(ii.instrumentWorkload),
                      zsInstrumentWorkload: this.computedNull(ii.zsInstrumentWorkload),
                      index: index
                    })
                    comNum++
                  })

                  pointIndex.push(pointNum)
                }

              })


            }
            comIndex.push(comNum)


          })

          console.log(pointIndex)
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
          this.newRecords = newRecords
          this.listLoading = true
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
        if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2 || columnIndex === 3) {
          if (row.comIndex) { // 如果有值,说明需要合并
            return [row.comIndex, 1]
          } else return [0, 0]
        }
        if (columnIndex === 4 || columnIndex === 5 || columnIndex === 6 || columnIndex === 7) {
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
        this.form.instrumentName = findObj.instrumentTypeName
        this.form.instrumentRealName = findObj.instrumentTypeName
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


      seach() {
        this.listWorkload()
      },
      editPoint(e) {
        console.log(e)
        getInstrumentById({
          instrumentId: e.instrumentId
        }).then(res => {
          console.log(res)
          this.editVisible = true
          this.form = res.retData
        })

        console.log('🚀 ~ editPoint ~   this.form:', this.form)
      },
      addShebei(e) {
        this.addVisible = true
        this.form = {
          companyId: null,
          pointId: null,
          checkStatus: 1,
          startYear: ''
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

  .editFont {
    color: blueviolet;
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
