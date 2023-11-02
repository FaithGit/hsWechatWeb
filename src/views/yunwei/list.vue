<template>
  <div class="testPaper">
    <!-- 条件栏 -->
    <div class="headClass">
      点位名称：
      <el-input v-model="pointName" class="seachInput" placeholder="请选择输入点位名称" clearable />
      运维人员：
      <el-input v-model="username" class="seachInput" placeholder="请选择输入运维人员" clearable />
      运维组：
      <treeselect
        v-model="groupId"
        :multiple="false"
        :options="groupList"
        :normalizer="normalizer2"
        placeholder="请选择运维组"
        class="seachInput"
      />
      时间范围：
      <el-date-picker
        v-model="time"
        type="datetimerange"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
      />

      <el-button type="primary" style="margin-left:10px" @click="seach">搜索</el-button>
    </div>

    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="records"
      element-loading-text="加载中"
      border
      fit
      highlight-current-row
      stripe
      style="margin-top:1.04vw"
    >
      <el-table-column align="center" label="#" width="95">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="点位名称">
        <template slot-scope="scope">
          {{ computedNull(scope.row.pointName) }}
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="异常内容">
        <template slot-scope="scope">
          {{ computedNull(scope.row.exceptionContent) }}
        </template>
      </el-table-column> -->
      <el-table-column align="center" label="运维人员">
        <template slot-scope="scope">
          {{ computedNull(scope.row.operateUsers) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="运维时间">
        <template slot-scope="scope">
          {{ computedNull(scope.row.completeTime) }}
        </template>
      </el-table-column>

      <!-- <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button @click="editPoint(scope.row)">编辑</el-button>
        </template>
      </el-table-column> -->
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

  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {
  listGroupSel,
  listOperateTaskPageOnPC
} from '@/api/table'
import moment from 'moment'

import {
  mapGetters
} from 'vuex'
export default {
  name: 'YunweiList',
  components: {
    Treeselect
  },
  data() {
    return {
      factorCode: '',
      pointName: '',
      username: '',
      pageIndex: 1,
      groupId: null,
      pageSize: 10,
      listLoading: false,
      addVisible: false,
      total: 0,
      records: [],
      groupList: [],
      time: [],

      normalizer2(node) {
        return {
          id: node.groupId,
          label: node.groupName,
          children: node.children && node.children.length ? node.children : 0
        }
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近半年',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 180)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'userId'
    ])
  },
  mounted() {
    listGroupSel({}).then(res => {
      console.log(res)
      this.groupList = res.retData
    })
    this.seach()
  },
  methods: {
    listOperateTaskPageOnPC() {
      console.log('this.time', this.time)
      var startTime = ''
      var endTime = ''
      if (this.time == null) {
        startTime = ''
        endTime = ''
      } else if (this.time.length === 0) {
        startTime = ''
        endTime = ''
      } else {
        startTime = moment(this.time[0]).format('YYYY-MM-DD')
        endTime = moment(this.time[1]).format('YYYY-MM-DD')
      }
      listOperateTaskPageOnPC({
        pointName: this.pointName,
        username: this.username,
        startTime: startTime,
        endTime: endTime,
        exceptionStatus: '', // 异常状态 1正常2异常未处理3异常已处理
        groupId: this.groupId || '',
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
      this.listOperateTaskPageOnPC()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.listOperateTaskPageOnPC()
    },
    seach() {
      this.pageIndex = 1
      this.listOperateTaskPageOnPC()
    },
    computedNull(val) {
      if (val === undefined || val === null || val === '' || val === ' ') {
        return '-'
      } else {
        return val
      }
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
