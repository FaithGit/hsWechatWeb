<template>
  <div class="testPaper">
    <!-- 条件栏 -->
    <div>
      试剂名称：
      <el-input v-model="reagentName" class="seachInput" placeholder="请输入关键字" clearable />
      日期选择：
      <el-date-picker v-model="time" type="date" class="seachInput" placeholder="选择日期">
      </el-date-picker>
      <el-button type="primary" @click="seach">搜索</el-button>
    </div>

    <!-- 表格 -->
    <el-table v-loading="listLoading" :data="records" element-loading-text="加载中" border fit style="margin-top:1.04vw"
      :span-method="arraySpanMethod" :row-class-name="tableRowClassName"
      height="calc(100vh - 84px - 60px - 40px - 32px - 1.04vw - 17px)">
      <el-table-column align="center" label="序号" width="95">
        <template slot-scope="scope">
          {{scope.row.index}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="试剂名称" prop="reagentName" />
      <el-table-column align="center" label="试剂编号" prop="number" />
      <el-table-column align="center" label="配置日期" prop="preparationTime" />
      <el-table-column align="center" label="药剂名称" prop="pharmaceuticalName" />
      <el-table-column align="center" label="单位" prop="unit" />
      <el-table-column align="center" label="理论使用量" prop="theoryQuantityWeighed" />
      <el-table-column align="center" label="试剂称重过程量" prop="actualQuantityWeighed" />
    </el-table>
    <!-- 分页 -->
    <div class="buttonPagination">
      <el-pagination :current-page="pageIndex" :page-sizes="[10,20,30,40,50]" :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>

  </div>
</template>

<script>
  import {
    listReagentConfigurationProcess
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
        total: 0,
        reagentName: "",
        records: [],
        time: ""

      }
    },
    mounted() {
      this.listReagentConfigurationProcess()
    },
    methods: {
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

      listReagentConfigurationProcess() { // 全部试剂 新增使用
        listReagentConfigurationProcess({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          reagentName: this.reagentName,
          preparationTime:this.time==''||this.time==null?'': moment(this.time).format("YYYY-MM-DD 00:00:00")
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
                reagentName: this.computedNull(e.reagentName),
                number: this.computedNull(e.number),
                preparationTime: this.computedNull(e.preparationTime),
                pharmaceuticalName: '-',
                unit: '-',
                theoryQuantityWeighed: '-',
                actualQuantityWeighed: '-',
                index: (this.pageIndex - 1) * 10 + index + 1
              })
              comIndex.push(1)

            } else {
              var comNum = 0 // 公司基数
              e.reagentConfigurationProcessDetailList.forEach(i => {
                newArr.push({
                  reagentName: this.computedNull(e.reagentName),
                  number: this.computedNull(e.number),
                  preparationTime: this.computedNull(e.preparationTime),
                  pharmaceuticalName: this.computedNull(i.pharmaceuticalName),
                  unit: this.computedNull(i.unit),
                  theoryQuantityWeighed: this.computedNull(i.theoryQuantityWeighed),
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
          this.total = res.retData.total
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

</style>
<style>
  .el-table .bkred {
    background: #ffffff;
  }

  .el-table .bkgreen {
    background: #fafafa
  }

</style>
