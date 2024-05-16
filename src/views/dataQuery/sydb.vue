<template>
  <div class="testPaper">
    <!-- 条件栏 -->
    <div class="headClass">
      企业名称：
      <treeselect v-model="companyId" :multiple="false" :options="comlist" :normalizer="normalizer" placeholder="请选择企业"
        class="seachInput" style="width:300px" @input="changeCom" />
      点位名称：
      <treeselect v-model="pointId" :multiple="false" :options="dianweiList" :normalizer="normalizer2"
        placeholder="请选择点位" class="seachInput" style="width:200px" />

      是否已登记：
      <el-select v-model="isRegistered" placeholder="请选择" clearable class="seachInput" style="width:100px">
        <el-option label="未登记" :value="0"></el-option>
        <el-option label="已登记" :value="1"></el-option>
      </el-select>
      <span v-if="activeName=='first'">
        时间范围：
        <el-date-picker v-model="value1" type="daterange" range-separator="至" start-placeholder="开始日期"
          end-placeholder="结束日期" :clearable="true" :picker-options="pickerOptions">
        </el-date-picker>
      </span>


      <el-button type="primary" @click="seach">搜索</el-button>

    </div>
    <el-tabs v-model="activeName" type="card" style="margin-top:10px" @tab-click="handleClick">
      <el-tab-pane label="历史记录" name="first"></el-tab-pane>
      <el-tab-pane label="最新数据" name="second"></el-tab-pane>
    </el-tabs>

    <!-- 表格 -->
    <el-table v-loading="listLoading" :data="records" element-loading-text="加载中" border fit highlight-current-row stripe
      height="calc(100vh - 84px - 60px - 40px - 32px  - 17px - 66px)">

      <el-table-column align="center" label="点位名称" prop="pointName" />
      <el-table-column align="center" label="采样时间" width="100">
        <template slot-scope="scope">
          {{ computedNull(scope.row.sampleTime) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="采样填报人" width="120">
        <template slot-scope="scope">
          {{ computedNull(scope.row.operateUserName) }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="登记时间" width="100">
        <template slot-scope="scope">
          {{ computedNull(scope.row.registerTime) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="登记人" width="100">
        <template slot-scope="scope">
          {{ computedNull(scope.row.registerUserName) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="数据照片">
        <template slot-scope="scope">
          <div v-if="scope.row.fileList.length==0">
            -
          </div>
          <div v-else>
            <el-image class="imgPre" v-for="item in scope.row.fileList" :key="item.url" :src="item.url"
              :preview-src-list="fileLists" @click="clickevaluatePicture(scope.row)">
            </el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200px">
        <template slot-scope="scope">
          <el-button v-if="scope.row.fileList.length!=0" type="primary" @click="plxz(scope.row)">批量下载</el-button>
          <div v-else>
            -
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

  </div>
</template>

<script>
  import Treeselect from '@riophae/vue-treeselect'
  // import the styles
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'

  import {
    listHisComparisonPage,
    listCompanySel,
    listShortPointSel,
    listLatestComparisonByPointPage
  } from '@/api/table'
  import moment from 'moment'
  import {
    mapGetters
  } from 'vuex'
  import axios from "axios"
  import {
    getToken
  } from '@/utils/auth'
  export default {
    name: 'Sydb',
    components: {
      Treeselect
    },
    data() {
      return {
        isRegistered: "",
        pageIndex: 1,
        pageSize: 10,
        companyId: null,
        pointId: null,
        total: 0,
        records: [],
        comlist: [],
        comName: '',
        value1: '',
        activeName: "first",
        listLoading: false,
        dianweiList: [], // 全部药剂列表
        fileLists: [], // 全部药剂列表
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
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

      }
    },
    computed: {
      ...mapGetters([
        'userId', 'roleId', 'userGroupId'
      ])
    },
    mounted() {
      this.value1 = [moment().subtract(1, 'months'), moment()]
      this.listCompanySel()
      this.listHisComparisonPage()
    },
    methods: {
      handleClick(tab, event) {
        console.log(this.activeName);
        this.pageIndex = 1
        if (this.activeName == "first") {
          this.listHisComparisonPage()
        } else {
          this.listLatestComparisonByPointPage()
        }
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
        })
      },
      listHisComparisonPage() {
        this.listLoading = true
        var startTime = ""
        var endTime = ""
        if (this.value1 === null) {

        } else {
          startTime = moment(this.value1[0]).format("YYYY-MM-DD HH:mm:ss")
          endTime = moment(this.value1[1]).format("YYYY-MM-DD HH:mm:ss")
        }

        listHisComparisonPage({
          companyId: this.companyId || '',
          pointId: this.pointId || '',
          isRegistered: this.isRegistered,
          "startTime": startTime,
          "endTime": endTime,
          "pageIndex": this.pageIndex,
          "pageSize": this.pageSize
        }).then(res => {
          console.log(res)


          let _temp = res.retData.records
          _temp.forEach(e => {
            let fileLists = []
            e.fileList.forEach(i => {
              fileLists.push(i.url)
            })
            e.fileLists = fileLists
          })
          this.records = _temp
          console.log("🚀 ~ listHisComparisonPage ~ this.records:", this.records)
          this.total = res.retData.total
          this.listLoading = false
        })
      },
      listLatestComparisonByPointPage() {
        this.listLoading = true
        listLatestComparisonByPointPage({
          companyId: this.companyId || '',
          pointId: this.pointId || '',
          isRegistered: this.isRegistered,
          "pageIndex": this.pageIndex,
          "pageSize": this.pageSize
        }).then(res => {
          console.log(res)
          let _temp = res.retData.records
          _temp.forEach(e => {
            let fileLists = []
            e.fileList.forEach(i => {
              fileLists.push(i.url)
            })
            e.fileLists = fileLists
          })
          this.records = _temp
          console.log("🚀 ~ listHisComparisonPage ~ this.records:", this.records)
          this.total = res.retData.total

          this.listLoading = false
        })
      },
      clickevaluatePicture(row) {
        this.fileLists = row.fileLists
      },
      handleSizeChange(val) {
        this.pageSize = val
        if (this.activeName == "first") {
          this.listHisComparisonPage()
        } else {
          this.listLatestComparisonByPointPage()
        }
      },
      handleCurrentChange(val) {
        this.pageIndex = val
        if (this.activeName == "first") {
          this.listHisComparisonPage()
        } else {
          this.listLatestComparisonByPointPage()
        }
      },
      seach() {
        this.pageIndex = 1
        if (this.activeName == "first") {
          this.listHisComparisonPage()
        } else {
          this.listLatestComparisonByPointPage()
        }
      },
      plxz(row) {
        console.log(row.fileLists)
        axios({
            url: 'https://operate.sea-splendor.com/haisheng/file/downloadZip',
            method: 'post',
            responseType: 'blob', // 响应类型为blob
            data: row.fileList,
            headers: {
              token: getToken()
            }
          })
          .then(response => {
            const blob = new Blob([response.data])
            const link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            link.download = '打包文件.zip' // 下载文件名称
            link.click()
          })
          .catch(error => {
            console.error(error)
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

  .imgPre {
    width: 100px;
    height: 100px;
    margin: 5px;
  }

</style>
