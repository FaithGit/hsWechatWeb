<template>
  <div class="testPaper">
    <!-- 条件栏 -->
    <div class="headClass">
      企业名称：
      <treeselect v-model="companyId" :multiple="false" :options="comlist" :normalizer="normalizer" placeholder="请选择企业"
        class="seachInput" style="width:300px" @input="changeCom" :clearable="true">
        <label slot="option-label" slot-scope="{ node, labelClassName }" :class="labelClassName" :title="node.label">
          {{ node.label }}
        </label>
      </treeselect>
      点位名称：
      <treeselect v-model="pointId" :multiple="false" :options="dianweiList" :normalizer="normalizer2"
        placeholder="请选择点位" class="seachInput" style="width:200px" :clearable="true">
        <label slot="option-label" slot-scope="{ node, labelClassName }" :class="labelClassName" :title="node.label">
          {{ node.label }}
        </label>
      </treeselect>

      点位因子：

      <treeselect v-model="factorCode" :multiple="false" :options="factorList" :normalizer="normalizer3"
        placeholder="请选择点位因子" class="seachInput" style="width:220px" :clearable="true">
        <label slot="option-label" slot-scope="{ node, labelClassName }" :class="labelClassName" :title="node.label">
          {{ node.label }}
        </label>
      </treeselect>

      异常类型：
      <el-select v-model="eventCode" placeholder="请选择" clearable class="seachInput">
        <el-option v-for="item in eventList" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>


      <el-button type="primary" @click="seach">搜索</el-button>
    </div>

    <!-- 表格 -->
    <el-table v-loading="listLoading" :data="records" element-loading-text="加载中"  fit highlight-current-row stripe
      style="margin-top:1.04vw" height="calc(100vh - 84px - 60px - 40px - 32px - 1.04vw - 17px)">
      <el-table-column align="center" label="序号" width="95">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="点位名称" prop="pointName" />
      <el-table-column align="center" label="因子名称">
        <template slot-scope="scope">
          {{ computedNull(scope.row.factorName) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="异常类型">
        <template slot-scope="scope">
          {{ computedNull(scope.row.eventName) }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="事件开始-结束时间">
        <template slot-scope="scope">
          {{ scope.row.eventStartTime }} - {{scope.row.eventEndTime}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="持续时间">
        <template slot-scope="scope">
          {{ computedNull(scope.row.durationTransform) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="数据时间类型">
        <template slot-scope="scope">
          {{ computedNull(scope.row.dataTimeTypeName) }}
        </template>
      </el-table-column>
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
  import Treeselect from '@riophae/vue-treeselect'
  // import the styles
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'

  import {
    listCompanySel,
    listShortPointSel,
    listEventCodeChoose,
    listFactorSel,
    listOnlineEvent
  } from '@/api/table'
  import {
    mapGetters
  } from 'vuex'
  // import moment from 'moment'
  export default {
    name: 'ErrEvent',
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
        factorId: null,
        total: 0,
        records: [],
        comlist: [],
        groupList: [],
        dianweiList: [],
        pointStatus: '',
        eventCode: "",
        factorCode: null,
        comName: '',
        pointName: '',
        status: '',
        addVisible: false,
        editVisible: false,
        listLoading: false,
        alarmShow: false,
        factorList: [], // 全部药剂列表
        eventList: [],
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
        },
        normalizer3(node) {
          return {
            id: node.factorCode,
            label: node.factorName,
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
      this.listCompanySel()
      this.listFactorSel()
      this.listEventCodeChoose()
      setTimeout(() => {
        this.seach()
      }, 1000)

    },
    methods: {
      listFactorSel() { // 所有因子列表
        listFactorSel({}).then(res => {
          this.factorList = res.retData
        })
      },
      listEventCodeChoose() { //listEventCodeChoose
        listEventCodeChoose({

        }).then(res => {
          console.log('listEventCodeChoose', res.retData)
          this.eventList = res.retData

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
          console.log("清空")
          this.pointId = null
          this.dianweiList = null

        } else {
          listShortPointSel({
            companyId: this.companyId || ''
          }).then(res => {
            console.log(res)
            this.dianweiList = res.retData
            this.pointId = res.retData[0].pointId
          })
        }


      },
      listShortPointSel() { // 点位id
        listShortPointSel({
          companyId: this.companyId || ''
        }).then(res => {
          console.log(res)
          this.dianweiList = res.retData
        })
      },
      listCompanySel() { // 公司id
        listCompanySel({}).then(res => {
          console.log(res)
          this.comlist = res.retData
          this.companyId = res.retData[0].companyId

        })
      },
      listOnlineEvent() {
        listOnlineEvent({
          pointId: this.pointId || '',
          factorCode: this.factorCode || '',
          eventCode: this.eventCode || '',
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
        }).then(res => {
          console.log(res)
          this.records = res.retData.records
          this.total = res.retData.total
        })
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.listOnlineEvent()
      },
      handleCurrentChange(val) {
        this.pageIndex = val
        this.listOnlineEvent()
      },
      seach() {
        this.pageIndex = 1
        this.listOnlineEvent()
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

  .alarmShow {
    color: #F56C6C;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
  }

</style>
