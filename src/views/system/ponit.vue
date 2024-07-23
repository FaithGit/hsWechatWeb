<template>
  <div class="testPaper">
    <!-- 条件栏 -->
    <div class="headClass">
      企业名称：
      <treeselect v-model="companyId" :multiple="false" :options="comlist" :normalizer="normalizer" placeholder="请选择企业"
        class="seachInput" style="width:300px" />
      点位名称：
      <el-input v-model="pointName" class="seachInput" placeholder="请输入点位名称" clearable />

      站点状态：
      <el-select v-model="pointStatus" placeholder="请选择站点状态" class="seachInput" clearable>
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      污染源种类：
      <el-select v-model="pollutionType" placeholder="请选择污染源种类" clearable class="seachInput">
        <el-option label="废水" :value="1" />
        <el-option label="废气" :value="2" />
        <el-option label="vocs" :value="3" />
        <el-option label="地表水" :value="4" />
        <el-option label="其他" :value="5" />
      </el-select>

      <el-button type="primary" @click="seach">搜索</el-button>
      <el-button type="primary" @click="addPoint1">新增点位</el-button>
      <el-button type="primary" @click="daochu">导出</el-button>
    </div>
    <div class="headClass" style="margin-top:10px">
      区域：
      <treeselect v-model="areaCode" :multiple="false" :options="allAreacode" :normalizer="normalizer4"
        placeholder="请选择区域" class="seachInput" no-children-text="暂无数据" />
      <span v-if="!computedRoleBoolean">
        运维组：
      </span>
      <treeselect v-if="!computedRoleBoolean" v-model="groupId" :multiple="false" :options="groupList"
        :normalizer="normalizer2" placeholder="请选择运维组" class="seachInput" />

      是否传送数据：
      <el-select v-model="isDataSend" placeholder="是否传送数据" clearable class="seachInput">
        <el-option label="传送" :value="1" />
        <el-option label="不传送" :value="0" />
      </el-select>

    </div>

    <!-- 表格 -->
    <el-table v-loading="listLoading" :data="records" element-loading-text="加载中" border fit highlight-current-row stripe
      style="margin-top:1.04vw" height="calc(100vh - 84px - 60px - 40px - 32px - 1.04vw - 17px - 50px)">
      <el-table-column align="center" label="#" width="30">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="企业名称" prop="comName" />
      <!-- <el-table-column align="center" label="点位名称" prop="pointName" /> -->
      <el-table-column align="center" label="点位名称" prop="pointName" width="60" />
      <el-table-column align="center" label="点位状态" prop="pointStatusName" width="60" />
      <el-table-column align="center" label="运维组" width="100">
        <template slot-scope="scope">
          {{ computedNull(scope.row.groupName) }}
          <div> ({{ computedNull(scope.row.groupLeader) }})</div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="排放标准" width="200">
        <template slot-scope="scope">
          {{ computedNull(scope.row.standardName) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="关注程度" width="60">
        <template slot-scope="scope">
          {{ computedNull(scope.row.concernLevelName) }}

        </template>
      </el-table-column>
      <el-table-column align="center" label="数采仪编码(mn)" width="160">
        <template slot-scope="scope">
          {{ computedNull(scope.row.dciMn) }}
          <div class="xiaolvdian" v-if="scope.row.sendStatus===1"></div>
          <div class="xiaohongdian" v-if="scope.row.sendStatus===0"></div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="数采仪版本号">
        <template slot-scope="scope">
          {{ computedNull(scope.row.dciVersion) }}

        </template>
      </el-table-column>
      <el-table-column align="center" label="数采仪ip">
        <template slot-scope="scope">
          {{ computedNull(scope.row.dciIp) }}

        </template>
      </el-table-column>
      <el-table-column align="center" label="参数" width="220">
        <template slot-scope="scope">
          <div>烟道截面积：
            {{ computedNull(scope.row.flueCrossArea) }}

          </div>
          <div>速度场系数：
            {{ computedNull(scope.row.velocityFieldCoefficient) }}

          </div>
          <div>基准氧含量：
            {{ computedNull(scope.row.oxygenReferenceValue) }}

          </div>
          <div>过量空气系数：
            {{ computedNull(scope.row.excessAirFactor) }}
          </div>
        </template>
      </el-table-column>

      <el-table-column align="center" label="备案资料">
        <template slot-scope="scope">
          <div>
            <template v-for="item in scope.row.recordFiles">
              <img src="@/assets/file.png" alt="" srcset="" :title="item.name" style="width:20px" :key="item.fileId"
                @click="handlePreview(item)">
            </template>
          </div>
        </template>
      </el-table-column>

      <el-table-column align="center" label="二维码">
        <template slot-scope="scope">
          <div>
            <img :src="scope.row.pointUrl" alt="" srcset="" style="width:80px" @click="erweima(scope.row)">
          </div>
        </template>
      </el-table-column>

      <el-table-column align="center" label="相关性系数" width="220">
        <template slot-scope="scope">
          <div
            v-if="computedNull(scope.row.correlationCoefficientB)=='-'||computedNull(scope.row.correlationCoefficientK)=='-'"
            style="text-algin:center">
            -
          </div>
          <div v-else>COD=TOC* {{ computedNull(scope.row.correlationCoefficientK) }} +
            {{ computedNull(scope.row.correlationCoefficientB) }}


          </div>
        </template>
      </el-table-column>



      <el-table-column align="center" label="操作" width="230">
        <template slot-scope="scope">
          <el-button @click="editPoint(scope.row)">编辑</el-button>
          <!-- <el-button @click="erweima(scope.row)">二维码</el-button> -->
          <el-button @click="gotoShebei(scope.row)">设备管理</el-button>
          <el-button style="margin-top:5px" @click="gotoyinzi(scope.row)">因子管理</el-button>
          <el-button type="danger" style="margin-top:5px" @click="remove(scope.row)"> 删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="buttonPagination">
      <el-pagination :current-page="pageIndex" :page-sizes="[10,20,30,40,50,100,500,1000]" :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>

    <el-dialog v-if="addVisible" :title="futitle" :append-to-body="true" :visible="addVisible" width="41vw"
      :close-on-click-modal="false" @close="addVisible=false" top="2vh">
      <el-form ref="form1" :model="form" :inline="true" label-width="120px" :rules="rules" label-position="top">
        <el-form-item v-if="futitle=='新增点位'" label="企业名称" prop="companyId" class="formWidth2">
          <treeselect v-model="form.companyId" :multiple="false" :options="comlist" :normalizer="normalizer"
            placeholder="请选择企业" @input="riskPersonDeptChangeValue" />
        </el-form-item>
        <el-form-item v-if="futitle!='新增点位'" label="企业名称" prop="companyId" class="formWidth2">
          <el-input v-model="form.comName" placeholder="请输入点位名称" readonly="" />
        </el-form-item>
        <el-form-item label="点位名称" prop="pointName" class="formWidth2">
          <el-input v-model="form.pointName" placeholder="请输入点位名称" />
        </el-form-item>
        <!-- <el-form-item label="点位简称" prop="pointShortName" class="formWidth4">
          <el-input v-model="form.pointShortName" placeholder="请输入点位简称" />
        </el-form-item> -->

        <el-form-item label="污染源种类" prop="pollutionType" class="formWidth4">
          <el-select v-model="form.pollutionType" placeholder="请选择污染源种类" @change="lisDischargeStandard">
            <el-option label="废水" :value="1" />
            <el-option label="废气" :value="2" />
            <el-option label="vocs" :value="3" />
            <el-option label="地表水" :value="4" />
            <el-option label="其他" :value="5" />
          </el-select>
        </el-form-item>

        <el-form-item label="站点状态" prop="pointStatus" class="formWidth4">
          <el-select v-model="form.pointStatus" placeholder="请选择站点状态">
            <el-option v-for="item in options" :key="'内部'+item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="关注程度" prop="concernLevel" class="formWidth4">
          <el-select v-model="form.concernLevel" placeholder="请选择关注程度">
            <el-option v-for="item in concernLevelList" :key="'关注程度'+item.value" :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="排放口许可证" prop="dischargePortPermit" class="formWidth4">
          <el-input v-model="form.dischargePortPermit" placeholder="请输入排放口许可证" />
        </el-form-item>

        <el-form-item v-if="form.pollutionType" label="排放标准" prop="dischargeStandardId">
          <el-popover placement="right" title="" width="200" trigger="hover" :content="computedLabel">
            <treeselect slot="reference" v-model="form.dischargeStandardId" :multiple="false"
              :options="dischargeStandardIdList" :normalizer="normalizer3" placeholder="请选择排放标准" :clearable="false"
              class="fuSelect" @select="changeDischargeStandardId" />
          </el-popover>
        </el-form-item>

        <el-form-item label="点位企业联系人" prop="comContact" class="formWidth4">
          <el-input v-model="form.comContact" placeholder="请输入点位企业联系人" />
        </el-form-item>
        <el-form-item label="点位企业联系方式" prop="comContactMobile" class="formWidth4">
          <el-input v-model="form.comContactMobile" placeholder="请输入点位企业联系方式" />
        </el-form-item>
        <el-form-item label="紧急联系人" prop="emergencyContact" class="formWidth4">
          <el-input v-model="form.emergencyContact" placeholder="请输入紧急联系人" />
        </el-form-item>
        <el-form-item label="紧急联系人电话" prop="emergencyMobile" class="formWidth4">
          <el-input v-model="form.emergencyMobile" placeholder="请输入紧急联系人电话" />
        </el-form-item>

        <el-form-item label="经度" prop="lng" class="formWidth4">
          <el-input v-model="form.lng" placeholder="请输入经度" />
        </el-form-item>
        <el-form-item label="维度" prop="lat" class="formWidth4">
          <el-input v-model="form.lat" placeholder="请输入维度" />
        </el-form-item>

        <el-form-item label="数采仪系统类型" prop="dciType">
          <el-select v-model="form.dciType" placeholder="请选择" class="formWidth4">
            <el-option v-for="item in dciTypeList" :key="'数采仪系统类型'+item.value" :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="数采仪ip" prop="dciIp" class="formWidth4">
          <el-input v-model="form.dciIp" placeholder="请输入数采仪ip" />
        </el-form-item>

        <el-form-item label="数采仪编码mn号" prop="dciMn" class="formWidth2">
          <el-input v-model="form.dciMn" placeholder="请输入数采仪编码mn号  " />
        </el-form-item>
        <el-form-item label="视频Ip" prop="dciMn" class="formWidth2">
          <el-input v-model="form.spIp" placeholder="请输入视频Ip" />
        </el-form-item>
        <el-form-item label="门禁Ip" prop="dciMn" class="formWidth2">
          <el-input v-model="form.mjIp" placeholder="请输入门禁Ip" />
        </el-form-item>
        <el-form-item label="门禁账号" class="formWidth4">
          <el-input v-model="form.mjAccount" placeholder="请输入门禁账号" />
        </el-form-item>
        <el-form-item label="门禁密码" class="formWidth4">
          <el-input v-model="form.mjPassword" placeholder="请输入门禁密码" />
        </el-form-item>
        <el-form-item label="视频账号" class="formWidth4">
          <el-input v-model="form.spAccount" placeholder="请输入视频账号" />
        </el-form-item>
        <el-form-item label="视频密码" class="formWidth4">
          <el-input v-model="form.spPassword" placeholder="请输入视频密码" />
        </el-form-item>
        <el-form-item label="秘钥" class="formWidth4">
          <el-input v-model="form.secretKey" placeholder="请输入秘钥" />
        </el-form-item>
        <el-form-item label="是否传送数据" prop="isDataSend" class="formWidth4">
          <el-switch v-model="form.isDataSend" active-text="传送 " inactive-text="不传送" :active-value="1"
            :inactive-value="0" />
        </el-form-item>
        <el-form-item label="运维组" class="formWidth2">
          <treeselect v-model="form.groupId" :multiple="false" :options="groupList" :normalizer="normalizer2"
            placeholder="请选择运维组" />
        </el-form-item>

        <el-form-item label="烟道截面积" prop="flueCrossArea" class="formWidth4">
          <el-input v-model="form.flueCrossArea" placeholder="请输入烟道截面积" />
        </el-form-item>
        <el-form-item label="速度场系数" prop="velocityFieldCoefficient" class="formWidth4">
          <el-input v-model="form.velocityFieldCoefficient" placeholder="请输入速度场系数" />
        </el-form-item>
        <el-form-item label="基准氧含量" prop="oxygenReferenceValue" class="formWidth4">
          <el-input v-model="form.oxygenReferenceValue" placeholder="请输入基准氧含量" />
        </el-form-item>
        <el-form-item label="过量空气系数" prop="excessAirFactor" class="formWidth4">
          <el-input v-model="form.excessAirFactor" placeholder="请输入过量空气系数" />
        </el-form-item>

        <el-form-item label="工作量系数" prop="workloadCoefficient" class="formWidth4">
          <el-input v-model="form.workloadCoefficient" placeholder="请输入工作量系数" />
        </el-form-item>
        <el-form-item class="formWidth4">
          <div Slot="label">
            <div class="fuLabel">
              相关性系数-K
              <el-popover placement="top-start" width="200" trigger="hover" content="相关性系数使用计算说明: COD = TOC * K + B"> <i
                  class="el-icon-question" slot="reference"></i>
              </el-popover>
            </div>
          </div>
          <el-input v-model="form.correlationCoefficientK" placeholder="相关性系数-K" />
        </el-form-item>
        <el-form-item class="formWidth4">
          <div Slot="label">
            <div class="fuLabel">
              相关性系数-B
              <el-popover placement="top-start" width="200" trigger="hover" content="相关性系数使用计算说明: COD = TOC * K + B"> <i
                  class="el-icon-question" slot="reference"></i>
              </el-popover>
            </div>
          </div>

          <el-input v-model="form.correlationCoefficientB" placeholder="相关性系数-B" />
        </el-form-item>

        <el-form-item label="备案资料" prop="educationFiles">
          (点击列表查看附件)
          <el-upload action="#" :on-change="handleChangeID" :on-remove="handleRemoveID" :on-preview="handlePreview"
            :auto-upload="false" :file-list="IDList">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>


        <div style="text-align:center;margin-top:80px">
          <el-button @click="addVisible=false">取 消</el-button>
          <el-button v-if="futitle=='新增点位'" type="primary" @click="sumbitPoint">确 定</el-button>
          <el-button v-if="futitle=='编辑点位'" type="primary" @click="editSubmit">更 新</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import Treeselect from '@riophae/vue-treeselect'
  // import the styles
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import {
    moblie
  } from '@/utils/asyncValidator'

  import {
    listPointPage,
    updatePoint,
    listCompanySel,
    listGroupSel,
    addPoint,
    lisDischargeStandard,
    deletePoint,
    getAreaCodeTree,
    exportPoint,
    getPointById,
    getPointQRCode,
    listDictionarySel,
    getCompanyById

  } from '@/api/table'
  import {
    mapGetters
  } from 'vuex'
  import {
    getToken
  } from '@/utils/auth'
  import axios from 'axios'
  import setting from '@/settings'

  // import moment from 'moment'
  export default {
    name: 'Ponit',
    components: {
      Treeselect
    },
    data() {
      return {
        pageIndex: 1,
        pageSize: 10,
        companyId: null,
        groupId: null,
        areaCode: null,
        computedRoleBoolean: false,
        total: 0,
        isDataSend: '',
        records: [],
        comlist: [],
        allAreacode: [],
        IDList: [],
        dciTypeList: [],
        concernLevelList: [],
        groupList: [],
        pointStatus: '',
        futitle: '新增点位',
        computedLabel: '请选择排放标准',
        comName: '',
        pointName: '',
        status: '',
        pollutionType: '',
        addVisible: false,
        editVisible: false,
        listLoading: false,
        form: {},
        allyjList: [], // 全部药剂列表
        yaojiChoose: [], // 全部药剂列表
        dischargeStandardIdList: [], // 全部药剂列表
        options: [],
        rules: {
          pointName: [{
            required: true,
            message: '请输入点位名称',
            trigger: 'blur'
          }],
          pointShortName: [{
            required: true,
            message: '请输入点位名称',
            trigger: 'blur'
          }],
          emergencyMobile: [{
            required: true,
            validator: moblie,
            trigger: 'blur'
          }],
          comContactMobile: [{
            required: true,
            validator: moblie,
            trigger: 'blur'
          }],
          dciMn: [{
            required: false,
            message: '请输入数采仪编码 mn号',
            trigger: 'blur'
          }],
          dciIp: [{
            required: false,
            message: '请输入数采仪ip',
            trigger: 'blur'
          }],
          dciType: [{
            required: true,
            message: '请输入数采仪系统类型',
            trigger: 'change'
          }],
          companyId: [{
            required: true,
            message: '请选择企业名称',
            trigger: 'change'
          }],
          groupId: [{
            required: true,
            message: '请选择运维组',
            trigger: 'input'
          }],
          concernLevel: [{
            required: true,
            message: '请输入关注程度',
            trigger: 'change'
          }],
          pointStatus: [{
            required: true,
            message: '请输入站点状态',
            trigger: 'change'
          }],
          pollutionType: [{
            required: true,
            message: '请输入污染源种类',
            trigger: 'change'
          }],
          dischargePortPermit: [{
            required: false,
            message: '请输入排放口许可证',
            trigger: 'blur'
          }],
          dischargeStandardId: [{
            required: true,
            message: '请选择排放标准',
            trigger: 'change'
          }],
          emergencyContact: [{
            required: true,
            message: '请输入紧急联系人',
            trigger: 'blur'
          }],
          comContact: [{
            required: true,
            message: '请输入点位企业联系人',
            trigger: 'blur'
          }],
          lng: [{
            required: true,
            type: 'number',
            message: '必须为数字',
            transform: value =>
              this.$options.filters.formValidateFun(value, 'number')
          }],
          workloadCoefficient: [{
            required: true,
            type: 'number',
            message: '必须为数字',
            transform: value =>
              this.$options.filters.formValidateFun(value, 'number')
          }],

          lat: [{
            required: true,
            type: 'number',
            message: '必须为数字',
            transform: value =>
              this.$options.filters.formValidateFun(value, 'number')
          }]
          // socialCreditCode: [{
          //   required: true,
          //   message: '请输入统一社会信用代码',
          //   trigger: 'blur'
          // }, {
          //   len: 18,
          //   message: '请输入18位统一社会信用代码',
          //   trigger: 'blur'
          // }]
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
            id: node.groupId,
            label: node.groupName,
            children: node.children && node.children.length ? node.children : 0
          }
        },
        normalizer3(node) {
          return {
            id: node.id,
            label: node.standardName,
            children: node.children && node.children.length ? node.children : 0
          }
        },
        normalizer4(node) {
          return {
            id: node.value,
            label: node.label,
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
    activated() {
      console.log(this.$route.params)
      if (JSON.stringify(this.$route.params) !== '{}') {
        this.companyId = this.$route.params.companyId
        this.pointName = this.$route.params.pointName
        console.log('更新数据')
      }
      this.listPointPage()
    },
    mounted() {
      this.listGroupSel()
      this.listCompanySel()
      this.getAreaCodeTree()
      this.listDictionarySel()


      console.log("走这里了吗")

      if (this.roleId === 'ywybzz' || this.roleId === 'ywybfzz' || this.roleId === 'ywybzy') {
        this.computedRoleBoolean = true
      } else {
        this.computedRoleBoolean = false
      }
    },
    methods: {
      handlePreview(file) { // 预览
        console.log(file)
        window.open(file.url)
      },
      handleRemoveID(file, fileList) { // 身份附件删除
        console.log(file, fileList)
        this.IDList = fileList
      },
      handleChangeID(file, fileList) { // 身份附件上传
        var formData = new FormData()
        formData.append('file', file.raw)
        formData.append('type', 'education')
        axios.post(setting.baseUrl + '/sysSup/fileConvert', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'token': getToken()
            }
          })
          .then(res => {
            console.log(res.data)
            this.IDList.push(res.data.retData)
          })
      },

      listDictionarySel() {
        listDictionarySel({
          dicCode: "pointStatus"
        }).then(res => {
          console.log("pointStatus", res)
          this.options = res.retData
        })
        listDictionarySel({
          dicCode: "dciType"
        }).then(res => {
          console.log("dciType", res)
          this.dciTypeList = res.retData
        })
        listDictionarySel({
          dicCode: "concernLevel"
        }).then(res => {
          console.log("concernLevel", res)
          this.concernLevelList = res.retData
        })
      },
      computedNull(val) {
        if (val === undefined || val === null || val === '' || val === ' ') {
          return '-'
        } else {
          return val
        }
      },
      riskPersonDeptChangeValue() {
        // form是表单名 riskPersonDept是prop名
        this.$refs['form1'].validateField('companyId')

        getCompanyById({
          companyId: this.form.companyId
        }).then(res => {
          console.log('res.retData.contact', res.retData.contact)
          console.log('res.retData.contact', res.retData.contactMobile)
          this.$set(this.form, 'comContact', res.retData.contact)
          this.$set(this.form, 'comContactMobile', res.retData.contactMobile)
        })
      },
      daochu() {
        exportPoint({
          companyId: this.companyId || '',
          areaCode: this.areaCode || '',
          pointName: this.pointName,
          isDataSend: this.isDataSend,
          groupId: this.computedRoleBoolean ? this.roleId : this.groupId || '',
          pollutionType: this.pollutionType || '',
          roleId: this.roleId,
          pointStatus: this.pointStatus,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }).then(res => {
          console.log(res)
          window.open(res.retData)
        })
      },
      getAreaCodeTree() {
        getAreaCodeTree({

        }).then(res => {
          console.log(res)
          this.allAreacode.push(res.retData)
        })
      },
      remove(e) {
        this.$confirm('此操作将永久删除该点位, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deletePoint({
            pointId: e.pointId
          }).then(res => {
            this.$notify({
              type: 'success',
              message: res.retMsg
            })
            this.listPointPage()
          })
        })
      },
      changeDischargeStandardId(node, instanceId) {
        console.log(node, instanceId)
        this.computedLabel = node.standardName
        this.form.dischargeStandardId = node.id
      },
      lisDischargeStandard() {
        console.log('????')
        lisDischargeStandard({
          pollutionType: this.form.pollutionType
        }).then(res => {
          console.log(res)
          this.form.dischargeStandardId = null
          this.dischargeStandardIdList = res.retData
        })
      },
      listCompanySel() { // 公司列表
        listCompanySel({}).then(res => {
          console.log(res)
          this.comlist = res.retData
        })
      },
      listGroupSel() { // 运维列表
        listGroupSel({}).then(res => {
          console.log(res)
          this.groupList = res.retData
        })
      },
      listPointPage() {
        listPointPage({
          companyId: this.companyId || '',
          areaCode: this.areaCode || '',
          pointName: this.pointName,
          isDataSend: this.isDataSend,
          groupId: this.computedRoleBoolean ? this.roleId : this.groupId || '',
          pollutionType: this.pollutionType || '',
          roleId: this.roleId,
          pointStatus: this.pointStatus,
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
        this.listPointPage()
      },
      handleCurrentChange(val) {
        this.pageIndex = val
        this.listPointPage()
      },
      seach() {
        this.pageIndex = 1
        this.listPointPage()
      },
      editPoint(e) {
        this.addVisible = true
        this.futitle = '编辑点位'
        this.IDList = []
        // this.form = Object.assign({}, e)

        getPointById({
          pointId: e.pointId
        }).then(res => {
          console.log(res)
          this.form = res.retData
          this.IDList = res.retData.recordFiles

          lisDischargeStandard({
            pollutionType: this.form.pollutionType
          }).then(res => {
            console.log(res)
            // this.form.dischargeStandardId = null
            this.dischargeStandardIdList = res.retData
            const nameTemp = this.dischargeStandardIdList.find(e => {
              return e.id === this.form.dischargeStandardId
            })
            this.computedLabel = nameTemp.standardName
          })
        })

        console.log('🚀 ~ editPoint ~   this.form:', this.form)
      },
      addPoint1(e) {

        this.futitle = '新增点位'
        this.form = {
          companyId: null,
          groupId: null,
          isDataSend: 0
        }
        this.IDList = []
        if (this.companyId) {
          this.form.companyId = this.companyId

          getCompanyById({
            companyId: this.companyId
          }).then(res => {
            this.$set(this.form, 'comContact', res.retData.contact)
            this.$set(this.form, 'comContactMobile', res.retData.contactMobile)
          })
        }
        this.addVisible = true
      },
      sumbitPoint() {

        if (this.form.correlationCoefficientK) {
          console.log("correlationCoefficientK 不为空判断", isNaN(Number(this.form.correlationCoefficientK, 10)))
          if (isNaN(Number(this.form.correlationCoefficientK, 10))) {
            this.$notify({
              type: "info",
              message: '相关性系数-K 必须纯数字'
            })
            return
          }
        }
        if (this.form.correlationCoefficientB) {
          console.log("correlationCoefficientB 不为空判断", isNaN(Number(this.form.correlationCoefficientB, 10)))
          if (isNaN(Number(this.form.correlationCoefficientB, 10))) {
            this.$notify({
              type: "info",
              message: '相关性系数-B 必须纯数字'
            })
            return
          }
        }
        this.$refs.form1.validate((valid) => {
          if (valid) {
            this.form.recordFiles = this.IDList
            this.form.pointShortName = this.form.pointName
            addPoint(this.form).then(res => {
              console.log(res)
              this.$notify({
                type: 'success',
                message: res.retMsg
              })
              this.addVisible = false
              this.listPointPage()
            })
          }
        })
      },
      editSubmit() {
        if (this.form.correlationCoefficientK) {
          console.log("correlationCoefficientK 不为空判断", isNaN(Number(this.form.correlationCoefficientK, 10)))
          if (isNaN(Number(this.form.correlationCoefficientK, 10))) {
            this.$notify({
              type: "info",
              message: '相关性系数-K 必须纯数字'
            })
            return
          }
        }
        if (this.form.correlationCoefficientB) {
          console.log("correlationCoefficientB 不为空判断", isNaN(Number(this.form.correlationCoefficientB, 10)))
          if (isNaN(Number(this.form.correlationCoefficientB, 10))) {
            this.$notify({
              type: "info",
              message: '相关性系数-B 必须纯数字'
            })
            return
          }
        }
        this.$refs.form1.validate((valid) => {
          if (valid) {
            this.form.recordFiles = this.IDList
            this.form.pointShortName = this.form.pointName
            updatePoint(this.form).then(res => {
              console.log(res)
              this.$notify({
                type: 'success',
                message: res.retMsg
              })
              this.addVisible = false
              this.listPointPage()
            })
          }
        })
      },
      gotoShebei(e) {
        console.log(e)
        this.$router.push({
          name: 'Instrument',
          params: {
            companyId: e.companyId,
            pointId: e.pointId
          }
        })
      },
      gotoyinzi(e) {
        console.log(e)
        this.$router.push({
          name: 'PointFactor',
          params: {
            companyId: e.companyId,
            pointId: e.pointId
          }
        })
      },
      erweima(e) {
        console.log(e)
        getPointQRCode({
          pointId: e.pointId
        }).then(res => {
          console.log(res)
          fetch(res.retData.url).then(response => response.blob()).then(blob => {
            var downloadLink = document.createElement('a')
            downloadLink.href = URL.createObjectURL(blob)
            downloadLink.download = res.retData.filename + '.png'
            document.body.appendChild(downloadLink)
            downloadLink.click()
            URL.revokeObjectURL(downloadLink.href)
          })
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

  .fuSelect ::v-deep .vue-treeselect__label {
    min-height: 50px;
    line-height: 50px;
    word-wrap: break-word;
    word-break: break-all;
    white-space: pre-wrap;
    border-bottom: 1px solid #eee;
  }

  .formWidth2 {
    width: 18.2vw;
    margin-right: 0.6vw;
  }

  .formWidth3 {
    width: 11vw;
    margin-right: 0.6vw;
  }

  .formWidth4 {
    width: 8.8vw;
    margin-right: 0.6vw;
  }

  .xiaolvdian {
    width: 10px;
    height: 10px;
    background: green;
    border-radius: 50%;
    display: inline-block;
  }

  .xiaohongdian {
    width: 10px;
    height: 10px;
    background: red;
    border-radius: 50%;
    display: inline-block;
  }

  .fuLabel {
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 0 10px;
    font-weight: 700;
  }

</style>
