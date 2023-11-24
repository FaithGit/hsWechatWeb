<template>
  <div class="testPaper">
    <!-- 条件栏 -->
    <div class="headClass">
      日期：
      <el-select v-model="statisticalTime">
        <el-option v-for="item in chooseList" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>

      <el-button type="primary" style="margin-left:10px" @click="seach">搜索</el-button>
      <el-button type="primary" style="margin-left:10px" @click="openDaoru">导入</el-button>
      <el-button type="primary" style="margin-left:10px" @click="daochu">导出模板</el-button>
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

      <el-table-column align="center" label="序号" width="95">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="车牌号" width="160">
        <template slot-scope="scope">
          {{ computedNull(scope.row.licensePlate) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="车辆分组">
        <template slot-scope="scope">
          {{ computedNull(scope.row.groupName) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="组负责人" width="100">
        <template slot-scope="scope">
          {{ computedNull(scope.row.groupLeader) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="油耗计算日期">
        <template slot-scope="scope">
          {{ computedNull(scope.row.statisticalTime) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="里程(公里)">
        <template slot-scope="scope">
          {{ computedNull(scope.row.distance) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="油费（元）">
        <template slot-scope="scope">
          {{ computedNull(scope.row.oilCost) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="油耗（元/公里）">
        <template slot-scope="scope">
          {{ computedNull(scope.row.fuelConsumption) }}
        </template>
      </el-table-column>
    </el-table>

    <!-- 导入题目 -->
    <el-dialog
      v-if="youfeiVisible"
      title="导入油费"
      :append-to-body="true"
      :visible="youfeiVisible"
      width="30%"
      :close-on-click-modal="false"
      @close="youfeiVisible=false"
    >

      <el-form ref="form" label-width="80px">
        <el-form-item label="附件">
          <el-upload
            class="upload-demo"
            action="#"
            :on-remove="upRemove"
            :on-change="upChangeFile"
            :limit="1"
            :file-list="uplist"
            accept=".xlsx"
            :auto-upload="false"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">限单个xlsx文件</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div style="text-align:center">
        <el-button @click="youfeiVisible=false">取消</el-button>
        <el-button type="primary" :loading="loading" @click="upFile">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listOilFeeTreeList,
  listDriveOilCost,
  oilFeeexportExcelDemo
} from '@/api/table'
// import moment from 'moment'
import axios from 'axios'
import setting from '@/settings'
import {
  getToken
} from '@/utils/auth'

import {
  mapGetters
} from 'vuex'

export default {
  name: 'Yfgl',
  data() {
    return {
      time: new Date(),
      listLoading: false,
      loading: false,
      youfeiVisible: false,
      records: [],
      uplist: [],
      chooseList: [],
      statisticalTime: ''
    }
  },
  computed: {
    ...mapGetters([
      'userId'
    ])
  },
  mounted() {
    listOilFeeTreeList({}).then(res => {
      console.log(res)
      this.chooseList = res.retData
      this.statisticalTime = res.retData[res.retData.length - 1].value
      this.seach()
    })
  },
  methods: {
    openDaoru() {
      this.youfeiVisible = true
      this.uplist = []
    },
    upChangeFile(file, fileList) { // 导入题目 更改文件
      this.uplist = fileList
    },
    upRemove(file, fileList) { // 导入题目 删除上传文件
      console.log(file, fileList)
      this.uplist = fileList
    },
    upFile() { // look youfei
      console.log(this.uplist)
      if (this.uplist.length === 0) {
        this.$notify({
          type: 'warning',
          message: '附件不能为空'
        })
        return
      }
      this.loading = true
      var formData = new FormData()
      formData.append('file', this.uplist[0].raw)
      formData.append('userId', this.userId)

      axios.post(setting.baseUrl + '/oilFee/importExcel', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'token': getToken()
        }
      })
        .then(res => {
          console.log(res)
          if (res.retCode === 1000) {
            this.loading = false
            this.youfeiVisible = false
            this.$notify({
              type: 'success',
              message: '操作成功'
            })
            this.listDriveOilCost()
          } else {
            this.loading = false
            this.$notify({
              type: 'warning',
              message: res.retMsg
            })
          }
        }).catch((e) => {
          console.log(e)
          this.loading = false
        })
    },
    listDriveOilCost() {
      listDriveOilCost({
        'statisticalTime': this.statisticalTime
      }).then(res => {
        console.log(res)
        this.records = res.retData
      })
    },

    seach() {
      this.listDriveOilCost()
    },
    computedNull(val) {
      if (val === undefined || val === null || val === '' || val === ' ') {
        return '-'
      } else {
        return val
      }
    },
    daochu() {
      oilFeeexportExcelDemo({}).then(res => {
        console.log('xxx')
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

  .headClass {
    display: flex;
    align-items: center;

  }

  .boxcss {
    width: 100%;
    height: 80px;
    display: flex;
    border: 1px solid #eee;
    margin: 10px 0 20px 0;
    align-items: center;
  }

  .boxITem {
    width: 25%;
    font-size: 1.0vw;
    color: #9ba4af;
    text-align: center;

  }

</style>
