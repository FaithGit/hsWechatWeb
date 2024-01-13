<template>
  <div class="testPaper">
    <!-- 条件栏 -->
    <div class="headClass">
      签到主题：
      <el-input v-model="theme" class="seachInput" placeholder="请选择签到主题" clearable />
      <el-button type="primary" @click="seach">搜索</el-button>
      <el-button type="primary" @click="addCom">新增签到</el-button>
    </div>

    <!-- 表格 -->
    <el-table v-loading="listLoading" :data="records" element-loading-text="加载中" border fit highlight-current-row stripe
      style="margin-top:1.04vw">
      <el-table-column align="center" label="#" width="95">
        <template slot-scope="scope">
          {{ (pageIndex-1)*10+scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="签到主题">
        <template slot-scope="scope">
          {{ computedNull(scope.row.theme) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="签到发起人">
        <template slot-scope="scope">
          {{ computedNull(scope.row.operateUserName) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="签到地址">
        <template slot-scope="scope">
          {{ computedNull(scope.row.address) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="签到范围">
        <template slot-scope="scope">
          {{ computedNull(scope.row.distance) }}米
        </template>
      </el-table-column>
      <el-table-column align="center" label="开始时间">
        <template slot-scope="scope">
          {{ computedNull(scope.row.startTime) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="结束时间">
        <template slot-scope="scope">
          {{ computedNull(scope.row.endTime) }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="">
        <template slot-scope="scope">
          <el-button type="primary" @click="openimgVisible(scope.row)">签到二维码</el-button>

        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="buttonPagination">
      <el-pagination :current-page="pageIndex" :page-sizes="[10,20,30,40,50]" :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>

    <el-dialog title="签到二维码" :append-to-body="true" :visible="imgVisible" width="40%" :close-on-click-modal="false"
      @close="imgVisible=false">
      <div style="text-align:center">
        <img :src="qrCodeUrl" alt="" srcset="">
        <div>
          <el-button type="primary" @click="saveImg">下载</el-button>
        </div>
      </div>
    </el-dialog>


    <el-dialog v-if="visible" :title="visibleTitle" :append-to-body="true" :visible="visible" width="40%"
      :close-on-click-modal="false" @close="visible=false" top="5vh">
      <el-form ref="form1" :model="form" label-width="140px" :rules="rules">
        <el-form-item label="签到" prop="theme">
          <el-input v-model="form.theme" placeholder="请输入签到主题" />
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker v-model="form.startTime" type="date" placeholder="请选择开始时间" />
          <el-time-select v-model="form.startTimeHour" :picker-options="{start: '00:00',step: '01:00',end: '23:00'}"
            style="width:100px;margin-left:3px" :clearable="false" />
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker v-model="form.endTime" type="date" placeholder="请选择结束时间" />
          <el-time-select v-model="form.endTimeHour" :picker-options="{start: '00:00',step: '01:00',end: '23:00'}"
            style="width:100px;margin-left:3px" :clearable="false" />
        </el-form-item>
        <el-form-item label="签到距离">
          <el-input-number v-model="form.distance" :min="0" :step="1"></el-input-number> 米
        </el-form-item>
        <el-form-item label="签到地址">
          <el-input v-model="form.address" :disabled="true"></el-input>
        </el-form-item>
        <div id="container">

        </div>
        <div style="text-align:center;margin-top:20px">
          <el-button @click="visible=false">取 消</el-button>
          <el-button type="primary" @click="sumbitCom">确 定</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  window._AMapSecurityConfig = {
    securityJsCode: "aca87bfbe7628151c6127201869fdcf6",
  };

  // import the styles
  import {
    updateTraining,
    addTraining,
    deleteTraining,
    getTraining,
    listTrainingPage,
    listUserTree,
    listSignInPage,
    addSignIn
  } from '@/api/table'

  // import the styles
  import Treeselect from '@riophae/vue-treeselect'
  // import the styles
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import {
    mapGetters
  } from 'vuex'
  import AMapLoader from '@amap/amap-jsapi-loader';
  import moment from 'moment'
  // import moment from 'moment'
  export default {
    name: 'SignIn',
    components: {
      Treeselect
    },
    data() {
      return {
        pageIndex: 1,
        pageSize: 10,
        total: 0,
        records: [],
        allAreacode: [],
        certificateName: '',
        trainingTheme: '',
        visibleTitle: '',
        comName: '',
        qrCodeUrl: "",
        theme: '',
        areaCode: null,
        map: null,
        status: '',
        visible: false,
        editVisible: false,
        listLoading: false,
        imgVisible: false,
        form: {},
        allyjList: [], // 全部药剂列表
        yaojiChoose: [], // 全部药剂列表
        userlist: [], // 全部药剂列表
        rules: {
          trainingType: [{
            required: true,
            message: '请选择培训类型',
            trigger: 'change'
          }],
          trainer: [{
            required: true,
            message: '请选择培训人',
            trigger: 'blur'
          }],
          theme: [{
            required: true,
            message: '请输入签到主题',
            trigger: 'blur'
          }],
          trainingContent: [{
            required: true,
            message: '请输入培训内容',
            trigger: 'blur'
          }],
          startTime: [{
            required: true,
            message: '请选择开始时间',
            trigger: 'blur'
          }],
          endTime: [{
            required: true,
            message: '请选择结束时间',
            trigger: 'blur'
          }]
        },
        normalizer(node) {
          // if (!node.children.length) delete node.children
          return {
            id: node.value,
            label: node.label,
            children: node.children && node.children.length ? node.children : 0
          }
        },
        normalizer2(node) {
          // if (!node.children.length) delete node.children
          return {
            id: node.id,
            label: node.label,
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
      // this.listTrainingPage()
      // this.listUserTree()
      this.listSignInPage()
    },
    methods: {
      listSignInPage() {
        listSignInPage({
          userId: this.userId,
          signInPermission: 1,
          theme: this.theme,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }).then(res => {
          this.records = res.retData.records
          this.total = res.retData.total
        })
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.listSignInPage()
      },
      handleCurrentChange(val) {
        this.pageIndex = val
        this.listSignInPage()
      },
      seach() {
        this.pageIndex = 1
        this.listSignInPage()
      },

      remove(e) {
        this.$confirm('此操作将永久删除该培训, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteTraining({
            trainingId: e.trainingId
          }).then(res => {
            this.$notify({
              type: 'success',
              message: res.retMsg
            })
            this.listTrainingPage()
          })
        })
      },
      openimgVisible(e) {
        this.qrCodeUrl = ''
        console.log(e)
        this.imgVisible = true
        this.qrCodeUrl = e.qrCodeUrl
      },
      saveImg(e) {
        window.open(this.qrCodeUrl, "_self")
      },
      addCom(e) {
        this.visible = true
        this.form = {
          distance: 500,
          startTime: moment(),
          startTimeHour: moment().format("HH:00"),
          endTime: moment().add(2, 'hour'),
          endTimeHour: moment().add(2, 'hour').format("HH:00"),
          address: "",
          lng: "",
          lat: "",
        }
        this.visibleTitle = '新增签到'

        AMapLoader.load({
            key: "3f6109300572af16c6a831efbddd2c8c	", // 申请好的Web端开发者Key，首次调用 load 时必填
            version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
            plugins: ["AMap.Geocoder"], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
          })
          .then((AMap) => {
            var that = this
            this.map = new AMap.Map("container", {
              // 设置地图容器id
              viewMode: "3D", // 是否为3D地图模式
              zoom: 13, // 初始化地图级别
              center: [120.666969, 30.552588], // 初始化地图中心点位置
            });
            var marker = new AMap.Marker();;
            var geocoder = new AMap.Geocoder({
              city: "010", //城市设为北京，默认：“全国”
              radius: 1000 //范围，默认：500
            });

            function regeoCode(lng, lat) {
              that.form.lng = lng
              that.form.lat = lat
              that.map.clearMap();
              var circle = new AMap.Circle({
                center: [lng, lat],
                radius: that.form.distance, //半径
                borderWeight: 3,
                strokeColor: "#FF33FF",
                strokeOpacity: 1,
                strokeWeight: 1,
                strokeOpacity: 0.2,
                fillOpacity: 0.4,
                strokeStyle: 'dashed',
                strokeDasharray: [10, 10],
                // 线样式还支持 'dashed'
                fillColor: '#1791fc',
                zIndex: 50,
                bubble: true
              })


              that.map.add(marker);
              that.map.add(circle);
              marker.setPosition([lng, lat]);

              geocoder.getAddress([lng, lat], function (status, result) {
                console.log(status)
                console.log(result)
                if (status === 'complete' && result.regeocode) {
                  var address = result.regeocode.formattedAddress;
                  console.log(address)
                  that.form.address = address
                } else {
                  console.log("根据经纬度查询地址失败")
                }
              });
            }

            this.map.on('click', function (e) {
              console.log(e.lnglat.lng)
              console.log(e.lnglat.lat)
              regeoCode(e.lnglat.lng, e.lnglat.lat)
            })
          })
          .catch((e) => {
            console.log(e);
          });
      },
      sumbitCom() {

        console.log(this.form)
        var realStart = moment(this.form.startTime).format("YYYY-MM-DD ") + this.form.startTimeHour + ":00"
        var realEnd = moment(this.form.endTime).format("YYYY-MM-DD ") + this.form.endTimeHour + ":00"



        if (this.form.address == '') {
          this.$notify.warning('请点击地图选择签到地址')
          return

        }


        if (moment(realStart) - moment(realEnd) > 0) {
          this.$notify.warning('开始时间不能大于结束时间')
          return
        }

        this.$refs.form1.validate((valid) => {
          if (valid) {
            const newObj = {
              theme: this.form.theme,
              operateUserId: this.userId,
              startTime: realStart,
              endTime: realEnd,
              distance: this.form.distance,
              lng: this.form.lng,
              lat: this.form.lat,
              address: this.form.address,
            }
            console.log(newObj)
            addSignIn(newObj).then(res => {
              console.log(res)
              this.$notify({
                type: 'success',
                message: res.retMsg
              })
              this.visible = false
              this.listSignInPage()
            })
          }
        })
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

  .dialog-vertical {
    display: flex;
    padding: 20px;

    .el-dialog {
      margin: auto !important;
    }
  }

  #container {
    padding: 0px;
    margin: 0px;
    width: 100%;
    height: 40vh;
  }

</style>
