<template>
  <div class="testPaper">
    <!-- 条件栏 -->
    <div class="headClass">
      企业名称：
      <treeselect v-model="companyId" :multiple="false" :options="comlist" :normalizer="normalizer" placeholder="请选择企业"
        class="seachInput" style="width:360px" @input="changeCom">
        <label slot="option-label" slot-scope="{ node, labelClassName }" :class="labelClassName" :title="node.label">
          {{ node.label }}
        </label>
      </treeselect>
      点位名称：
      <treeselect v-model="pointId" :multiple="false" :options="dianweiList" :normalizer="normalizer2"
        placeholder="请选择点位名称" class="seachInput" style="width:150px" @input="changePoint">
        <label slot="option-label" slot-scope="{ node, labelClassName }" :class="labelClassName" :title="node.label">
          {{ node.label }}
        </label>
      </treeselect>
      <!-- 运维组：
      <el-select v-model="pointStatus" placeholder="运维组" class="seachInput" clearable>
        <el-option v-for="item in groupList" :key="item.groupId" :label="item.groupName" :value="item.groupId" />
      </el-select> -->
      时间类型：
      <el-select v-model="timeType" placeholder="时间类型" clearable class="seachInput" style="width:120px">
        <el-option label="分钟均值" :value="1" />
        <el-option label="小时" :value="2" />
        <el-option label="天" :value="3" />
      </el-select>

      时间范围：
      <el-date-picker v-model="time" type="datetimerange" range-separator="至" start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>



      <!-- 地区：
      <el-select v-model="pointStatus" placeholder="运维组" class="seachInput" clearable>
        <el-option v-for="item in areaList" :key="item.value" :label="item.label" :value="item.value" />
      </el-select> -->
      <el-button type="primary" @click="seach" style="margin-left:10px">搜索</el-button>
    </div>

    <!-- 表格 -->
    <div style="margin-top:10px">
      <span class="leftClass">N:工作正常</span>
      <span class="leftClass">Md:缺失数据</span>
      <span class="leftClass">O:数据超标</span>
      <span class="leftClass">Z:平台计算结果数据</span>
      <span class="leftClass">U:有效数据不到75％</span>
      <span class="leftClass">F:仪表停运</span>
      <span class="leftClass">M:维护期间产生的数据</span>
      <span class="leftClass">S:手工输入的设定值</span>
      <span class="leftClass">D:仪器仪表故障</span>
      <span class="leftClass">C:处于校准状态</span>
      <span class="leftClass">T:采样数值超过测量上限</span>
      <span class="leftClass">B:与数采仪通讯异常</span>
    </div>
    <el-table :data="tableData" border fit style="margin-top:1.04vw"
      height="calc(100vh - 84px - 60px - 40px - 32px - 1.04vw - 17px)">


      <el-table-column v-for="item in tableHead" :key="item.id" :prop="item.id" :label="item.name">
        <template slot-scope="scope">
          <div>
            {{scope.row[item.id]}}
          </div>

          <!-- <div v-if="item.id!='dataTime'">
            {{scope.row[item.id]}}
          </div> -->

        </template>

      </el-table-column>
    </el-table>



  </div>
</template>

<script>
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'

  import {
    listCompanySel,
    listShortPointSel,
    listInstrumentTypeSel,
    listOperateGroupSel,
    listAreaMap,
    listOnlineData
  } from '@/api/table'
  import {
    mapGetters
  } from 'vuex'
  import moment from 'moment'
  export default {
    name: 'OnlineData',
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
        time: null,
        total: 0,
        tableHead: [],
        tableData: [],
        comlist: [],
        groupList: [],
        areaList: [],
        pointStatus: '',
        timeType: 2,
        comName: '',
        existInstrument: '',
        pointName: '',
        status: '',
        listLoading: false,
        dciMn: "",
        form: {},
        allyjList: [], // 全部药剂列表
        yaojiChoose: [], // 全部药剂列表
        shebeilist: [], // 全部药剂列表
        dianweiList: [], // 全部药剂列表
        dianweiList2: [], // 全部药剂列表
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
      this.time = [moment().subtract(1, 'days'), moment()]
      this.listCompanySel()
      this.listInstrumentTypeSel()
      // this.listAreaMap()
      // this.listOperateGroupSel()

    },
    methods: {
      listAreaMap() {
        listAreaMap({}).then(res => {
          console.log("所有地区", res.retData)
          this.areaList = res.retData
          this.areaList.shift()
        })
      },
      listOperateGroupSel() {
        listOperateGroupSel({

          userId: this.userId
        }).then(res => {
          console.log("所有运维组", res.retData)
          this.groupList = res.retData
          this.groupList.shift()
        })
      },
      computedNull(val) {
        if (val === undefined || val === null || val === '' || val === ' ') {
          return '-'
        } else {
          return val
        }
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
      changePoint(node, instanceId) {
        console.log('🚀 ~ changePoint', node, instanceId)

        if (node) {
          var findobj = this.dianweiList.find(e => {
            return e.pointId == node
          })

          console.log(findobj)
          this.pointId = findobj.pointId
          this.dciMn = findobj.dciMn
        } else {
          this.pointId = null
          this.dciMn = ''
        }


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
          this.pointId = res.retData[0].pointId
          this.dciMn = res.retData[0].dciMn
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
        listCompanySel({
          dataSendStatus: 1
        }).then(res => {
          console.log(res)
          this.comlist = res.retData
          this.companyId = res.retData[0].companyId


          listShortPointSel({
            companyId: this.companyId || ''
          }).then(res => {
            console.log(res)
            this.pointId = res.retData[0].pointId
            this.dciMn = res.retData[0].dciMn
            this.listOnlineData()
          })


        })
      },
      listOnlineData() {

        var startTime = ''
        var endTime = ''

        if (this.time !== null) {
          startTime = moment(this.time[0]).format("YYYY-MM-DD HH:mm:ss")
          endTime = moment(this.time[1]).format("YYYY-MM-DD HH:mm:ss")
        }




        listOnlineData({
          "pointId": this.pointId,
          "dciMn": this.dciMn,
          "timeType": this.timeType,
          "startTime": startTime,
          "endTime": endTime
        }).then(res => {
          // console.log(res)
          let tableHead = [{
            id: 'dataTime',
            name: '时间',
            concentrationUnit: ''
          }, ]


          let tableData = []

          //处理
          res.retData[0].dataList.forEach(i => {
            tableData.push({
              dataTime: i.dataTime
            })
          })



          res.retData.forEach(e => {
            tableHead.push({
              id: e.factorCode,
              name: e.factorName + (e.concentrationUnit ? `(${e.concentrationUnit})` : ''),
            })
          });

          // console.log(tableHead)
          this.tableHead = tableHead

          let temp = res.retData


          for (let i = 0; i < temp.length; i++) {
            // console.log('iiii', temp[i])

            for (let j = 0; j < temp[i].dataList.length; j++) {
              // console.log("j", temp[i].dataList[j])


              if (temp[i].dataList[j].signalCode == "w00000") {
                if (temp[i].dataList[j].flag == '' || temp[i].dataList[j].flag == null) { //处理空null
                  tableData[j][temp[i].factorCode] = temp[i].dataList[j].signalAvgValue
                } else {
                  tableData[j][temp[i].factorCode] = temp[i].dataList[j].signalAvgValue + '(' + temp[i].dataList[j]
                    .flag + ')'
                }



              } else {
                if (temp[i].dataList[j].flag == '' || temp[i].dataList[j].flag == null) { //处理空null
                  tableData[j][temp[i].factorCode] = temp[i].dataList[j].signalAvgValue
                } else {
                  tableData[j][temp[i].factorCode] = temp[i].dataList[j].signalAvgValue + '(' + temp[i].dataList[j]
                    .flag + ')'
                }
              }
            }

          }





          this.tableData = tableData.reverse()
          console.log("tableData", tableData)



          // this.tableData = [{
          //     dataTime: "123",
          //     w01001: 123
          //   },
          //   {
          //     dataTime: "654",

          //   }
          // ]

        })

      },
      handleSizeChange(val) {
        this.pageSize = val
        this.listOnlineData()
      },
      handleCurrentChange(val) {
        this.pageIndex = val
        this.listOnlineData()
      },
      seach() {
        if (!this.pointId) {
          this.$message({
            message: '请选择点位',
            type: 'warning'
          });
          return
        }
        this.listOnlineData()
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

  .leftClass {
    margin-right: 15px;
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
