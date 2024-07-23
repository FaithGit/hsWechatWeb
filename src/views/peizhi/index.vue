<template>
  <div class="testPaper">



    <el-tabs v-model="activeType" @tab-click="handleClick">
      <el-tab-pane label="试剂配制过程" name="1">
        <div>
          试剂名称：
          <el-input v-model="reagentName" class="seachInput" placeholder="请输入关键字" clearable />
          日期选择：
          <el-date-picker v-model="time" type="date" class="seachInput" placeholder="选择日期">
          </el-date-picker>
          <el-button type="primary" @click="seach">搜索</el-button>
        </div>

        <!-- 表格 -->
        <el-table :data="records" element-loading-text="加载中" border fit style="margin-top:1.04vw"
          :span-method="arraySpanMethod" :row-class-name="tableRowClassName"
          height="calc(100vh - 84px - 60px - 40px - 32px - 1.04vw - 17px - 40px - 15px)">
          <el-table-column align="center" label="序号" width="95">
            <template slot-scope="scope">
              {{scope.row.index}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="试剂名称" prop="reagentName" />
          <el-table-column align="center" label="试剂编号" prop="number" />
          <el-table-column align="center" label="配制日期" prop="preparationTime" />
          <el-table-column align="center" label="药剂名称" prop="pharmaceuticalName" />
          <el-table-column align="center" label="单位" prop="unit" />
          <el-table-column align="center" label="理论使用量" prop="theoryQuantityWeighed" />
          <el-table-column align="center" label="试剂称重过程量">
            <template slot-scope="scope">



              <div v-if="scope.row.updateStatus==1" class="xiahuaxian" @click="clickDiag(scope.row)">
                {{scope.row.actualQuantityWeighed}}
              </div>

              <div v-else>
                {{scope.row.actualQuantityWeighed}}
              </div>

            </template>
          </el-table-column>

        </el-table>
        <!-- 分页 -->
        <div class="buttonPagination">
          <el-pagination :current-page="pageIndex" :page-sizes="[10,20,30,40,50]" :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />
        </div>


      </el-tab-pane>
      <el-tab-pane label="标液配制过程" name="2">
        <div>
          标液名称：
          <el-input v-model="standardSolutionName" class="seachInput" placeholder="请输入关键字" clearable />
          日期选择：
          <el-date-picker v-model="time2" type="date" class="seachInput" placeholder="选择日期">
          </el-date-picker>
          <el-button type="primary" @click="seach2">搜索</el-button>
        </div>

        <!-- 表格 -->
        <el-table :data="records2" element-loading-text="加载中" border fit style="margin-top:1.04vw"
          :span-method="arraySpanMethod" :row-class-name="tableRowClassName"
          height="calc(100vh - 84px - 60px - 40px - 32px - 1.04vw - 17px - 40px - 15px)">
          <el-table-column align="center" label="序号" width="95">
            <template slot-scope="scope">
              {{scope.row.index}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="标液名称" prop="standardSolutionName" />
          <el-table-column align="center" label="试剂编号" prop="number" />
          <el-table-column align="center" label="配制日期" prop="preparationTime" />
          <el-table-column align="center" label="单位" prop="unit" />
          <el-table-column align="center" label="母液名称" prop="motherLiquorName" />
          <el-table-column align="center" label="理论使用量" prop="samplingQuantity" />
          <el-table-column align="center" label="标液称重过程量">
            <template slot-scope="scope">



              <div v-if="scope.row.updateStatus==1" class="xiahuaxian" @click="clickDiag2(scope.row)">
                {{scope.row.realSamplingQuantity}}
              </div>

              <div v-else>
                {{scope.row.realSamplingQuantity}}
              </div>

            </template>
          </el-table-column>

        </el-table>
        <!-- 分页 -->
        <div class="buttonPagination">
          <el-pagination :current-page="pageIndex2" :page-sizes="[10,20,30,40,50]" :page-size="pageSize2"
            layout="total, sizes, prev, pager, next, jumper" :total="total2" @size-change="handleSizeChange2"
            @current-change="handleCurrentChange2" />
        </div>

      </el-tab-pane>

    </el-tabs>

    <el-dialog v-if="czVisible" title="修改称重过程" :append-to-body="true" :visible="czVisible" width="40%"
      :close-on-click-modal="false" @close="czVisible=false">
      <el-form ref="form1" :model="form" label-width="160px">
        <el-form-item label="试剂名称">
          <el-input v-model="form.reagentName" disabled />
        </el-form-item>
        <el-form-item label="药剂名称">
          <el-input v-model="form.pharmaceuticalName" disabled />
        </el-form-item>
        <el-form-item label="原称重过程量">
          <el-input v-model="form.old" disabled />
        </el-form-item>
        <el-form-item label="新称重过程量">
          <el-input v-model="form.actualQuantityWeighed" placeholder="请输入新称重过程量" />
        </el-form-item>

        <div style="text-align:center;margin-top:80px">
          <el-button @click="czVisible=false">取 消</el-button>
          <el-button type="primary" @click="sumbiEidt">确 定</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog v-if="czVisible2" title="修改称重过程" :append-to-body="true" :visible="czVisible2" width="40%"
      :close-on-click-modal="false" @close="czVisible2=false">
      <el-form ref="form1" :model="form" label-width="160px">

        <el-form-item label="标液名称">
          <el-input v-model="form.standardSolutionName" disabled />
        </el-form-item>
        <el-form-item label="母液名称">
          <el-input v-model="form.motherLiquorName" disabled />
        </el-form-item>
        <el-form-item label="原称重过程量">
          <el-input v-model="form.old" disabled />
        </el-form-item>
        <el-form-item label="新称重过程量">
          <el-input v-model="form.realSamplingQuantity" placeholder="请输入新称重过程量" />
        </el-form-item>

        <div style="text-align:center;margin-top:80px">
          <el-button @click="czVisible2=false">取 消</el-button>
          <el-button type="primary" @click="sumbiEidt2">确 定</el-button>
        </div>
      </el-form>
    </el-dialog>


  </div>
</template>

<script>
  import {
    listReagentConfigurationProcess,
    listStandardSolutionProcess,
    updateActualQuantity,
    updateRealSamplingQuantity
  } from '@/api/table'
  import {
    mapGetters
  } from 'vuex'
  import moment from 'moment'
  export default {
    name: 'Peizhi',
    computed: {
      ...mapGetters([
        'userId'
      ])
    },
    data() {
      return {
        pageIndex: 1,
        pageSize: 10,
        listLoading: false,
        czVisible2: false,
        czVisible: false,
        total: 0,
        reagentName: "",
        records: [],
        time: "",
        activeType: "1",
        form: {},

        standardSolutionName: '',
        time2: "",
        records2: [],
        pageIndex2: 1,
        pageSize2: 20,
        total2: 0,


      }
    },
    mounted() {
      this.listReagentConfigurationProcess()
      this.listStandardSolutionProcess()
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      },
      clickDiag(row) {
        console.log(row)
        this.form = {
          reagentName: row.reagentName,
          pharmaceuticalName: row.pharmaceuticalName,
          old: row.actualQuantityWeighed,
          applyId: row.applyId,
          pharmaceuticalId: row.pharmaceuticalId,
          actualQuantityWeighed: ""
        }
        this.czVisible = true
      },
      clickDiag2(row) {
        console.log(row)
        this.form = {
          standardSolutionName: row.standardSolutionName,
          motherLiquorName: row.motherLiquorName,
          old: row.realSamplingQuantity,
          applyId: row.applyId,
          standardSolutionId: row.standardSolutionId,
          realSamplingQuantity: ""
        }
        this.czVisible2 = true
      },
      sumbiEidt() {
        console.log("提交修改", this.form)
        updateActualQuantity({
          applyId: this.form.applyId,
          pharmaceuticalId: this.form.pharmaceuticalId,
          actualQuantityWeighed: this.form.actualQuantityWeighed,
        }).then(res => {
          this.$notify({
            title: '',
            message: '操作成功',
            type: 'success'
          });
          this.czVisible = false
          this.listReagentConfigurationProcess()
        })
      },
      sumbiEidt2() {
        console.log("提交修改", this.form)
        updateRealSamplingQuantity({
          applyId: this.form.applyId,
          standardSolutionId: this.form.standardSolutionId,
          realSamplingQuantity: this.form.realSamplingQuantity,
        }).then(res => {
          this.$notify({
            title: '',
            message: '操作成功',
            type: 'success'
          });
          this.czVisible2 = false
          this.listStandardSolutionProcess()
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
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.listReagentConfigurationProcess()

      },
      handleCurrentChange(val) {
        this.pageIndex = val
        this.listReagentConfigurationProcess()

      },
      seach() {
        this.pageIndex = 1
        this.listReagentConfigurationProcess()
      },


      handleSizeChange2(val) {
        this.pageSize2 = val
        this.listStandardSolutionProcess()

      },
      handleCurrentChange2(val) {
        this.pageIndex2 = val
        this.listStandardSolutionProcess()

      },
      seach2() {
        this.pageIndex2 = 1
        this.listStandardSolutionProcess()
      },



      listReagentConfigurationProcess() { // 全部试剂 新增使用
        listReagentConfigurationProcess({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          reagentName: this.reagentName,
          preparationTime: this.time == '' || this.time == null ? '' : moment(this.time).format(
            "YYYY-MM-DD 00:00:00")
        }).then(res => {
          console.log(res)

          var temp = res.retData.data
          var newArr = []
          const comIndex = [] // 公司行数
          var comNum = 0 // 公司基数
          temp.forEach((e, index) => {
            comNum = 0
            if (e.reagentConfigurationProcessDetailList.length == 0) { //如果没有子项
              newArr.push({
                applyId: e.id,
                reagentName: this.computedNull(e.reagentName),
                number: this.computedNull(e.number),
                preparationTime: this.computedNull(e.preparationTime),
                pharmaceuticalName: '-',
                unit: '-',
                theoryQuantityWeighed: '-',
                updateStatus: '',
                pharmaceuticalId: '',
                actualQuantityWeighed: '-',
                index: (this.pageIndex - 1) * 10 + index + 1
              })
              comIndex.push(1)

            } else {
              var comNum = 0 // 公司基数
              e.reagentConfigurationProcessDetailList.forEach(i => {
                newArr.push({
                  applyId: e.id,
                  reagentName: this.computedNull(e.reagentName),
                  number: this.computedNull(e.number),
                  preparationTime: this.computedNull(e.preparationTime),
                  pharmaceuticalName: this.computedNull(i.pharmaceuticalName),
                  unit: this.computedNull(i.unit),
                  theoryQuantityWeighed: this.computedNull(i.theoryQuantityWeighed),
                  updateStatus: i.updateStatus,
                  pharmaceuticalId: i.pharmaceuticalId,
                  actualQuantityWeighed: this.computedNull(i.actualQuantityWeighed),
                  index: (this.pageIndex - 1) * 10 + index + 1
                })

                comNum++
              })

              comIndex.push(comNum)
            }

          });
          console.log("comIndex", comIndex)

          let com = 1
          for (let i = 0; i < comIndex.length; i++) {
            newArr[com - 1].comIndex = comIndex[i]
            com += comIndex[i]
          }

          this.records = newArr
          console.log("🚀 ~ listReagentConfigurationProcess ~ records:", newArr)
          this.total = res.retData.total
        })
      },
      listStandardSolutionProcess() { // 全部试剂 新增使用
        listStandardSolutionProcess({
          pageIndex: this.pageIndex2,
          pageSize: this.pageSize2,
          standardSolutionName: this.standardSolutionName,
          preparationTime: this.time2 == '' || this.time2 == null ? '' : moment(this.time2).format(
            "YYYY-MM-DD 00:00:00")
        }).then(res => {
          console.log(res)

          var temp = res.retData.data
          var newArr = []
          const comIndex = [] // 公司行数
          var comNum = 0 // 公司基数
          temp.forEach((e, index) => {
            comNum = 0
            if (e.standardSolutionProcessDetailList.length == 0) { //如果没有子项
              newArr.push({
                applyId: e.id,
                standardSolutionName: this.computedNull(e.standardSolutionName),
                number: this.computedNull(e.number),
                preparationTime: this.computedNull(e.preparationTime),
                pharmaceuticalName: '-',
                unit: '-',
                samplingQuantity: '-',
                updateStatus: '',
                standardSolutionId: '',
                realSamplingQuantity: '-',
                motherLiquorName: '-',
                index: (this.pageIndex2 - 1) * 10 + index + 1
              })
              comIndex.push(1)

            } else {
              var comNum = 0 // 公司基数
              e.standardSolutionProcessDetailList.forEach(i => {
                newArr.push({
                  applyId: e.id,
                  standardSolutionName: this.computedNull(e.standardSolutionName),
                  number: this.computedNull(e.number),
                  preparationTime: this.computedNull(e.preparationTime),
                  pharmaceuticalName: this.computedNull(i.pharmaceuticalName),
                  unit: this.computedNull(i.unit),
                  samplingQuantity: this.computedNull(i.samplingQuantity),
                  updateStatus: i.updateStatus,
                  standardSolutionId: i.standardSolutionId,
                  realSamplingQuantity: this.computedNull(i.realSamplingQuantity),
                  motherLiquorName: this.computedNull(i.motherLiquorName),
                  index: (this.pageIndex2 - 1) * 10 + index + 1
                })

                comNum++
              })

              comIndex.push(comNum)
            }

          });
          console.log("comIndex", comIndex)

          let com = 1
          for (let i = 0; i < comIndex.length; i++) {
            newArr[com - 1].comIndex = comIndex[i]
            com += comIndex[i]
          }

          this.records2 = newArr
          console.log("🚀 ~ listReagentConfigurationProcess ~ records:", newArr)
          this.total2 = res.retData.total
        })
      },

      computedNull(val) {
        if (val === undefined || val === null || val === '' || val === ' ') {
          return '-'
        } else {
          return val
        }
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

  .xiahuaxian {
    text-decoration: underline;
    text-decoration-color: #660fe8;
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
