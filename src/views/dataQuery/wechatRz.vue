<template>
  <div class="testPaper">
    <!-- 条件栏 -->
    <div class="headClass">
      姓名：
      <el-input v-model="userName" class="seachInput" style="width:160px" clearable />
      手机号：
      <el-input v-model="telephone" class="seachInput" style="width:160px" clearable />
      发送内容：
      <el-input v-model="content" class="seachInput" style="width:160px" clearable />
      状态：
      <el-select v-model="status" clearable class="seachInput" style="width:120px">
        <el-option v-for="item in statuslist" :key="item.label" :label="item.label" :value="item.value" />
      </el-select>
      时间范围：
      <el-date-picker v-model="value1" type="datetimerange" range-separator="至" start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>

      <el-button type="primary" @click="seach" style="margin-left:10px">搜索</el-button>
    </div>

    <!-- 表格 -->
    <el-table v-loading="listLoading" :data="records" element-loading-text="加载中" border fit highlight-current-row stripe
      style="margin-top:1.04vw" height="calc(100vh - 84px - 60px - 40px - 32px - 1.04vw - 17px)">
      <el-table-column align="center" label="#" width="95">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="接收人姓名" prop="userName" width="120" />
      <el-table-column align="center" label="接收人手机号" prop="telephone" width="120" />
      <el-table-column align="center" label="发送数据" prop="data" />
      <el-table-column align="center" label="发送时间" prop="requestTime" width="100" />
      <el-table-column align="center" label="状态" width="120">
        <template slot-scope="scope">
          <div v-if="scope.row.statusName=='发送成功'" style="color:green">
            {{ scope.row.statusName }}
          </div>
          <div v-else>

            <el-popover placement="top-start"  trigger="hover">
              <div>
               {{ scope.row.result }}
              </div>

              <div slot="reference" style="color:red"> {{ scope.row.statusName }}<i class="el-icon-question"></i></div>
            </el-popover>


          </div>

        </template>
      </el-table-column>

      <!-- <el-table-column align="center" label="操作" width="280">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)">编辑</el-button>
          <el-button type="danger" @click="remove(scope.row)">删除</el-button>
        </template>
      </el-table-column> -->
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
  // import the styles
  import Treeselect from '@riophae/vue-treeselect'
  // import the styles
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import {
    listUser,
    listOplog,
    listWxMessageLog
  } from '@/api/table'
  import {
    mapGetters
  } from 'vuex'
  import moment from 'moment'
  // import moment from 'moment'
  // import moment from 'moment'
  export default {
    name: 'WechatRz',
    components: {
      Treeselect
    },
    data() {
      return {
        userName: "",
        telephone: "",
        content: "",
        value1: null,
        pageIndex: 1,
        pageSize: 10,
        total: 0,
        certificateId: null,
        userIdShow: null,
        records: [],
        allAreacode: [],
        certificateName: '',
        type: '',
        visibleTitle: '',
        comName: '',
        areaCode: null,
        status: '',
        visible: false,
        editVisible: false,
        listLoading: false,
        form: {},
        allyjList: [], // 全部药剂列表
        zhengshuList: [], // 全部药剂列表
        yaojiChoose: [], // 全部药剂列表
        userlist: [], // 全部药剂列表
        statuslist: [{
          label: '发送失败',
          value: 0
        }, {
          label: '发送成功',
          value: 1
        }], // 全部药剂列表
        rules: {
          userId: [{
            required: true,
            message: '请选择用户',
            trigger: 'change'
          }],
          rewardPunishType: [{
            required: true,
            message: '请选择奖惩类型',
            trigger: 'change'
          }],
          rewardPunishTime: [{
            required: true,
            message: '请选择奖惩时间',
            trigger: 'change'
          }],
          rewardPunishContent: [{
            required: true,
            message: '请输入奖惩内容',
            trigger: 'blur'
          }]
        },
        normalizer(node) {
          // if (!node.children.length) delete node.children
          return {
            id: node.certificateId,
            label: node.certificateName,
            children: node.children && node.children.length ? node.children : 0
          }
        },
        normalizer2(node) {
          // if (!node.children.length) delete node.children
          return {
            id: node.userId,
            label: node.userName,
            children: node.children && node.children.length ? node.children : 0
          }
        }

      }
    },
    computed: {
      ...mapGetters([
        'userId'
      ])
    },
    mounted() {
      this.listWxMessageLog()
    },
    methods: {
      listUser() {
        listUser({}).then(res => {
          console.log(res.retData)
          this.userlist = res.retData
        })
      },

      listWxMessageLog() {
        this.listLoading = true
        console.log(this.value1)
        var startTime = ""
        var endTime = ""
        if (this.value1 === null) {

        } else {
          startTime = moment(this.value1[0]).format("YYYY-MM-DD HH:mm:ss")
          endTime = moment(this.value1[1]).format("YYYY-MM-DD HH:mm:ss")
        }
        listWxMessageLog({
          userName: this.userName || '',
          telephone: this.telephone || '',
          content: this.content || '',
          status: this.status,
          startTime: startTime,
          endTime: endTime,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }).then(res => {
          console.log(res)
          this.records = res.retData.records
          this.total = res.retData.total
          this.listLoading = false
        })
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.listWxMessageLog()
      },
      handleCurrentChange(val) {
        this.pageIndex = val
        this.listWxMessageLog()
      },
      seach() {
        this.pageIndex = 1
        this.listWxMessageLog()
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
