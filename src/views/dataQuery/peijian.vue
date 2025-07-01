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
      状态：
      <el-select v-model="comConfirmStatus" placeholder="状态" clearable class="seachInput" style="width:120px">
        <el-option label="企业未确认" :value="0" />
        <el-option label="企业已确认" :value="1" />
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
      <el-button
        type="primary"
        @click="daochu"
        style="margin-left: 10px"
        icon="el-icon-download"
        >导出</el-button
      >
    </div>

    <el-table :data="tableData" border fit style="margin-top:1.04vw"
      height="calc(100vh - 84px - 60px - 32px - 1.04vw - 17px)">

      <el-table-column type="index" label="#" align="center"></el-table-column>
      <el-table-column label="企业名称" prop="comName">
        <!-- <template slot-scope="scope">
          <div>
            {{scope.row[item.id]}}
          </div>
        </template> -->

      </el-table-column>
      <el-table-column label="点位名称" prop="pointName" align="center"></el-table-column>
      <el-table-column label="运维组" prop="addUserGroupName" align="center"></el-table-column>
      <el-table-column label="添加人员" prop="addUserName" align="center"></el-table-column>
      <el-table-column label="添加时间" prop="replaceTime" align="center"></el-table-column>
      <el-table-column label="企业确认人" prop="comConfirmUserName" align="center"></el-table-column>
      <el-table-column label="确认时间" prop="comConfirmTime" align="center"></el-table-column>
      <el-table-column label="更换配件" prop="partNames"></el-table-column>
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
  pagePartReplaceRecord,
  exportPartReplaceRecord
} from '@/api/table'
import {
  mapGetters
} from 'vuex'
import moment from 'moment'
export default {
  name: 'Peijian',
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
      comConfirmStatus: '',
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
    this.time = [moment().subtract(1, 'months'), moment()]
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
      this.listShortPointSel()
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
        listShortPointSel({
          companyId: this.companyId || ''
        }).then(res => {
          console.log(res)
          this.pagePartReplaceRecord()
        })


      })
    },
    daochu() {
      var startTime = ''
      var endTime = ''

      if (this.time !== null) {
        startTime = moment(this.time[0]).format("YYYY-MM-DD HH:mm:ss")
        endTime = moment(this.time[1]).format("YYYY-MM-DD HH:mm:ss")
      }
      exportPartReplaceRecord({
        "comId": this.companyId,
        "pointId": this.pointId,
        "comConfirmStatus": this.comConfirmStatus,
        "comConfirmStatus": '',
        "startTime": startTime,
        "endTime": endTime,
      }).then((res) => {
        console.log(res);
        window.open(res.retData, "_self");
      });
    },

    pagePartReplaceRecord() {

      var startTime = ''
      var endTime = ''

      if (this.time !== null) {
        startTime = moment(this.time[0]).format("YYYY-MM-DD HH:mm:ss")
        endTime = moment(this.time[1]).format("YYYY-MM-DD HH:mm:ss")
      }




      pagePartReplaceRecord({
        "comId": this.companyId,
        "pointId": this.pointId,
        "comConfirmStatus": this.comConfirmStatus,
        "comConfirmStatus": '',
        "startTime": startTime,
        "endTime": endTime,
        pageIndex: 1,
        pageSize: 9999

      }).then(res => {
        let temp = res.retData.records
        this.tableData = temp
      })

    },
    handleSizeChange(val) {
      this.pageSize = val
      this.pagePartReplaceRecord()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.pagePartReplaceRecord()
    },
    seach() {
      this.pagePartReplaceRecord()
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
