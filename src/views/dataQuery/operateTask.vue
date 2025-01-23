<template>
  <div class="testPaper">
    <!-- 条件栏 -->
    <div class="headClass">
      点位名称：
      <el-input v-model="pointName" class="seachInput" placeholder="请输入点位名称" clearable />
      运维人员：
      <el-input v-model="username" class="seachInput" placeholder="请输入运维人员" clearable />
      运维组：
      <treeselect v-model="groupId" :multiple="false" :options="groupList" :normalizer="normalizer2"
        placeholder="请选择运维组" class="seachInput">
        <label slot="option-label" slot-scope="{ node, labelClassName }" :class="labelClassName" :title="node.label">
          {{ node.label }}
        </label>
      </treeselect>
      时间范围：
      <el-date-picker v-model="time" type="datetimerange" :picker-options="pickerOptions" range-separator="至"
        start-placeholder="开始日期" end-placeholder="结束日期" align="right" />

      <el-button type="primary" style="margin-left:10px" @click="seach">搜索</el-button>
    </div>

    <!-- 表格 -->
    <el-table v-loading="listLoading" :data="records" element-loading-text="加载中" border fit highlight-current-row stripe
      style="margin-top:1.04vw" height="calc(100vh - 84px - 60px - 40px - 32px - 1.04vw - 17px)">
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
      <el-table-column align="center" label="运维人员">
        <template slot-scope="scope">
          {{ computedNull(scope.row.operateUsers) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="运维时间" width="180" >
        <template slot-scope="scope">
          {{ computedNull(scope.row.completeTime) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="完成状态" width="120">
        <template slot-scope="scope">
          {{ computedNull(scope.row.completeStatusName) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="异常状态">
        <template slot-scope="scope">
          {{ computedNull(scope.row.exceptionStatusName) }}
          <div v-if="scope.row.exceptionStatusName!='正常'">
               {{ computedNull(scope.row.exceptionContent) }}
          </div>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="openTaskIdDetails(scope.row)">详情</el-button>
          <el-button v-if="scope.row.completeStatus==2||scope.row.completeStatus==3" type="primary"
            @click="download(scope.row)" :loading="scope.row.downLoading">运维单pdf</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="buttonPagination">
      <el-pagination :current-page="pageIndex" :page-sizes="[10,20,30,40,50]" :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>

    <el-dialog v-if="chuVisible" :title="pointNameDig" :append-to-body="true" :visible="chuVisible" width="60%"
      :close-on-click-modal="false" @close="chuVisible=false">

      <!-- 表格 -->
      <el-table :data="tableData" element-loading-text="加载中" border fit highlight-current-row stripe height="30.46vw"
        style="margin-top:1.04vw">

        <el-table-column align="center" label="序号" width="95">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="设备名称">
          <template slot-scope="scope">
            {{ computedNull(scope.row.instrumentName) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="设备状态">
          <template slot-scope="scope">
            {{ scope.row.operateStatus==1?'未开始':scope.row.operateStatus==2?'维护过程中':'已完成' }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="120">
          <template slot-scope="scope">
            <el-button type="primary" :disabled="scope.row.operateStatus==1" @click="listStepTrees(scope.row)">详情
            </el-button>
          </template>
        </el-table-column>

      </el-table>
    </el-dialog>

    <el-dialog v-if="innerVisible" title="运维详情" :append-to-body="true" :visible="innerVisible" width="40%"
      :close-on-click-modal="false" @close="innerVisible=false">
      <ywStepAll :real-show-arr="realShowArr1" :instrumentName="instrumentName" />
    </el-dialog>

  </div>
</template>

<script>
  import Treeselect from '@riophae/vue-treeselect'
  import ywStepAll from './component/ywStepAll.vue'
  // import the styles
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import {
    listGroupSel,
    listOperateTaskPageOnPC,
    listOperate,
    listStepTrees
  } from '@/api/table'
  import moment from 'moment'
  import {
    getToken
  } from '@/utils/auth'
  import {
    mapGetters
  } from 'vuex'
  export default {
    name: 'YunweiList',
    components: {
      Treeselect,
      ywStepAll
    },
    data() {
      return {
        factorCode: '',
        pointName: '',
        pointNameDig: '',
        username: '',
        pageIndex: 1,
        groupId: null,
        pageSize: 10,
        listLoading: false,
        addVisible: false,
        chuVisible: false,
        innerVisible: false,
        total: 0,
        instrumentName: '',

        records: [],
        tableData: [],
        groupList: [],
        realShowArr1: [],
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
      async download(e) {
        e.downLoading = true

        try {
          const response = await fetch('https://operate.sea-splendor.com/haisheng/operate/generateOperateTaskPdf', {
            method: 'post',
            headers: {
              'token': getToken(),
              "content-type": "application/json"
            },
            body: '{"operateTaskId": "8814"}'

          });

          if (!response.ok) {
            throw new Error('网络响应失败');
          }

          const blob = await response.blob(); // 将响应数据转为 Blob
          const downloadUrl = URL.createObjectURL(blob); // 创建临时链接
          const link = document.createElement('a'); // 创建 <a> 元素
          link.href = downloadUrl;
          console.log("e", e)
          e.downLoading = false
          link.download = e.pointName + e.completeTime.substring(0, 13) + '.pdf';
          link.click(); // 触发下载
          URL.revokeObjectURL(downloadUrl); // 释放 URL
        } catch (error) {
          console.error('文件下载失败:', error);
        }
      },
      listStepTrees(e) {
        this.instrumentName = e.instrumentName
        console.log(e)
        listStepTrees({
          operateId: e.operateId
        }).then(res => {
          console.log(res.retData, 'res.retData')
          this.initArr(res.retData)
        })
      },
      initArr(retData) {
        /* eslint-disable */
        console.log('原始数组', retData)
        console.log('原始数组长度', retData.length)
        let realShowArr = []
        retData.forEach(e => {
          e.attributes.forEach(i => {
            console.log("i", i)
            console.log("i", i.label)
            console.log("i", i.data)
            if (i.controlCode == 'uploadImg') {
              if (i.data == '') { //初始化图片
                i.fileList = []
              } else { //有数据，分割图片数组
                let _fileList = i.data.split(',')
                let arr = []
                _fileList.forEach((y) => {
                  arr.push(y)
                })
                i.fileList = arr
              }
            } else if (i.controlCode == 'radio') { //避免隐式转化
              if (i.data !== '') {
                i.data = parseInt(i.data)
              }
              console.log("???", i.data)
            }

          })
          console.log('处理过upimg控件数据', e)

          if (e.childSteps.length == 0) {
            realShowArr.push(e)
          } else {
            realShowArr.push(e)
            if (e.judgeType == 1) {
              let _flag = false
              console.log("e.judgeType == 1")
              e.attributes.forEach(inner => {
                // console.log(inner)
                if (inner.data === '0') {
                  _flag = true
                }
              })
              console.log("是否有子步骤", _flag)

              if (_flag) {
                e.childSteps.forEach(innobj => {
                  innobj.orderNum = e.orderNum + '.' + innobj.orderNum
                  innobj.attributes.forEach(ziInner => {
                    if (ziInner.controlCode == 'uploadImg') {
                      if (ziInner.data == '') { //初始化图片
                        ziInner.fileList = []
                      } else { //有数据，分割图片数组
                        let _fileList = ziInner.data.split(',')
                        let arr = []
                        _fileList.forEach((y, yindex) => {
                          arr.push({
                            name: yindex,
                            url: y
                          })
                        })
                        ziInner.fileList = arr
                      }
                    }
                  })
                  realShowArr.push(innobj)
                })
              }
            } else if (e.judgeType == 2) {
              let _flag = false
              console.log("e.judgeType == 2")
              e.attributes.forEach(inner => {
                // console.log(inner)
                if (inner.data === '1') {
                  _flag = true
                }

              })
              console.log("是否有子步骤", _flag)
              if (_flag) {
                e.childSteps.forEach(innobj => {
                  console.log("innobj", innobj)
                  innobj.orderNum = e.orderNum + '.' + innobj.orderNum

                  innobj.attributes.forEach(ziInner => {
                    if (ziInner.controlCode == 'uploadImg') {
                      if (ziInner.data == '') { //初始化图片
                        ziInner.fileList = []
                      } else { //有数据，分割图片数组
                        let _fileList = ziInner.data.split(',')
                        let arr = []
                        _fileList.forEach((y, yindex) => {
                          arr.push({
                            name: yindex,
                            url: y
                          })
                        })
                        ziInner.fileList = arr
                      }
                    }
                  })
                  realShowArr.push(innobj)
                })
              }
            }

            //judgeType 判断类型 0不做判断 1存在否就走子流程 2存在是就走子流程

          }
        })

        console.log('打平后的数组', realShowArr)
        console.log('打平后的数组长度', realShowArr.length)
        this.realShowArr1 = realShowArr
        this.innerVisible = true
      },
      openTaskIdDetails(e) { // 打开运维详情
        console.log(e)
        this.pointNameDig = e.pointName
        listOperate({
          operateTaskId: e.operateTaskId
        }).then(res => {
          console.log(res)
          this.tableData = res.retData.operates
          this.chuVisible = true
        })
      },
      listOperateTaskPageOnPC() {
        console.log('this.time', this.time)
        var startTime = ''
        var endTime = ''
        if (this.time == null) {
          startTime = ''
          endTime = ''
        } else if (this.time.length == 0) {
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
          let temp = res.retData.records
          temp.forEach(e => {
            e.downLoading = false
          })
          this.records = temp
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
