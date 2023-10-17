<template>
  <div class="testPaper">
    <!-- 条件栏 -->
    <div class="headClass">
      操作内容：
      <el-input v-model="content" class="seachInput" clearable />
      用户名称：
      <treeselect
        v-model="userIdShow"
        :multiple="false"
        :options="userlist"
        :normalizer="normalizer2"
        placeholder="请选择用户"
        class="seachInput"
        no-children-text="暂无数据"
      />
      操作种类：
      <el-select v-model="type" clearable class="seachInput">
        <el-option v-for="item in rewardPunishTypeList" :key="item.label" :label="item.label" :value="item.value" />
      </el-select>
      <el-button type="primary" @click="seach">搜索</el-button>
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
      <el-table-column align="center" label="操作人" prop="operateUserName" width="120" />
      <el-table-column align="center" label="操作时间" prop="operateTime" width="200" />
      <el-table-column align="center" label="操作内容" prop="remark" />

      <!-- <el-table-column align="center" label="操作" width="280">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)">编辑</el-button>
          <el-button type="danger" @click="remove(scope.row)">删除</el-button>
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
// import the styles
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {
  listUser,
  listOplog

} from '@/api/table'
import {
  mapGetters
} from 'vuex'
// import moment from 'moment'
// import moment from 'moment'
export default {
  name: 'Jiangcheng',
  components: {
    Treeselect
  },
  data() {
    return {
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      certificateId: null,
      userIdShow: null,
      records: [],
      allAreacode: [],
      certificateName: '',
      type: '',
      content: '',
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
      rewardPunishTypeList: [{
        label: '修改',
        value: 1
      }, {
        label: '新增',
        value: 2
      }, {
        label: '删除',
        value: 3
      }, {
        label: '登录',
        value: 4
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
    this.listUser()
    this.listOplog()
  },
  methods: {
    listUser() {
      listUser({}).then(res => {
        console.log(res.retData)
        this.userlist = res.retData
      })
    },

    listOplog() {
      listOplog({
        userId: this.userIdShow || '',
        type: this.type || '',
        content: this.content || '',
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
      this.listOplog()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.listOplog()
    },
    seach() {
      this.pageIndex = 1
      this.listOplog()
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
