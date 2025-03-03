<template>
  <div class="testPaper">
    <!-- 条件栏 -->
    <div class="headClass">
      运维组：
      <treeselect
        v-model="groupId"
        :multiple="false"
        :options="groupList"
        :normalizer="normalizer2"
        placeholder="请选择运维组"
        :clearable="true"
        class="seachInput"
      >
        <label
          slot="option-label"
          slot-scope="{ node, labelClassName }"
          :class="labelClassName"
          :title="node.label"
        >
          {{ node.label }}
        </label>
      </treeselect>

      月份：
      <el-date-picker
        v-model="month"
        type="month"
        placeholder="选择月"
        :picker-options="pickerOptions"
        class="seachInput"
      >
      </el-date-picker>

      <el-button type="primary" @click="seach">搜索</el-button>
      <el-button plain :type="mode == 1 ? 'primary' : ''" @click="toggleMode(1)"
        >简略</el-button
      >
      <el-button plain :type="mode == 2 ? 'primary' : ''" @click="toggleMode(2)"
        >详细(点位)</el-button
      >
      <el-button plain :type="mode == 3 ? 'primary' : ''" @click="toggleMode(3)"
        >详细(设备)</el-button
      >

      <el-button
        type="primary"
        @click="exportWorkload"
        v-loading="loading"
        style="margin-left: 10px"
        icon="el-icon-download"
        >导出</el-button
      >
      <el-button type="primary" @click="openGzl" style="margin-left: 10px"
        >查看工作量记分规则</el-button
      >
      <el-button type="primary" @click="openXiugai" style="margin-left: 10px"
        >上传记分规则</el-button
      >
    </div>

    <!-- 表格 -->
    <el-table
      v-if="listLoading"
      :data="newRecords"
      element-loading-text="加载中"
      border
      fit
      :span-method="arraySpanMethod"
      :row-class-name="tableRowClassName"
      style="margin-top: 1.04vw"
      height="calc(100vh - 84px - 60px - 40px  - 1.04vw )"
    >
      <el-table-column
        v-if="mode == 1 || mode == 2 || mode == 3"
        align="center"
        label="组名称"
        prop="groupName"
      />
      <el-table-column
        v-if="mode == 1 || mode == 2 || mode == 3"
        align="center"
        label="组成员"
        prop="groupUserNames"
      />
      <el-table-column
        v-if="mode == 1 || mode == 2 || mode == 3"
        align="center"
        label="总工作量(无系数)"
        prop="allWorkload"
      />
      <el-table-column
        v-if="mode == 1 || mode == 2 || mode == 3"
        align="center"
        label="总工作量(系数)"
        prop="zsAllWorkload"
      />

      <el-table-column
        v-if="mode == 2 || mode == 3"
        align="center"
        label="点位名称"
        prop="pointName"
      />
      <el-table-column
        v-if="mode == 2 || mode == 3"
        align="center"
        label="点位工作量(无系数)"
        prop="pointWorkload"
      />
      <el-table-column
        v-if="mode == 2 || mode == 3"
        align="center"
        label="点位系数"
      >
        <template slot-scope="scope">
          <div class="editFont" @click="editPointxs(scope.row)">
            {{ scope.row.workloadCoefficient }}
          </div>
        </template>
      </el-table-column>

      <el-table-column
        v-if="mode == 2 || mode == 3"
        align="center"
        label="点位工作量(系数)"
        prop="zsPointWorkload"
      />

      <el-table-column
        v-if="mode == 3"
        align="center"
        label="设备名称"
        prop="instrumentName"
      />
      <el-table-column
        v-if="mode == 3"
        align="center"
        label="设备工作量(无系数)"
      >
        <template slot-scope="scope">
          <div class="editFont" @click="editsbxs(scope.row)">
            {{ scope.row.instrumentWorkload }}
          </div>
        </template>
      </el-table-column>

      <el-table-column
        v-if="mode == 3"
        align="center"
        label="设备工作量(系数)"
        prop="zsInstrumentWorkload"
      />

      <!-- <el-table-column align="center" label="是否需要维护">
        <template slot-scope="scope">
          {{ computedNull(scope.row.checkStatusName) }}
        </template>
      </el-table-column> -->
    </el-table>

    <el-dialog
      :title="editTitle"
      :visible.sync="editPointVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      width="30%"
      center
    >
      <el-form ref="form1" :model="form" label-width="140px" :rules="rules">
        <el-form-item label="旧值" prop="oldValue">
          <el-input v-model="form.oldValue" placeholder="请输入旧值" disabled />
        </el-form-item>

        <el-form-item label="修改值" prop="newValue">
          <el-input v-model="form.newValue" placeholder="请输入修改值" />
        </el-form-item>

        <div style="text-align: center; margin-top: 80px">
          <el-button @click="editPointVisible = false">取 消</el-button>
          <el-button type="primary" @click="updata">更 新</el-button>
        </div>
      </el-form>
    </el-dialog>

    <el-dialog
      v-if="pdfVisible"
      title="预览pdf"
      :append-to-body="true"
      :visible.sync="pdfVisible"
      width="70%"
      :close-on-click-modal="true"
      @close="pdfVisible = false"
    >
      <div style="height: 70vh; overflow: auto">
        <pdf v-for="item in pageTotal" :src="pdfUrl" :key="item" :page="item">
        </pdf>
      </div>
      <img
        src="@/assets/dwfile.png"
        class="dwfile"
        alt=""
        srcset=""
        @click="dwFile"
      />
    </el-dialog>

    <!-- 导入题目 -->
    <el-dialog
      v-if="jifenVisible"
      title="导入计分规则"
      :append-to-body="true"
      :visible="jifenVisible"
      width="30%"
      :close-on-click-modal="false"
      @close="jifenVisible = false"
    >
      <el-form ref="form" label-width="80px">
        <el-form-item label="文件">
          <el-upload
            class="upload-demo"
            action="#"
            :on-remove="upRemove"
            :limit="1"
            :file-list="uplist"
            accept=".pdf"
            :auto-upload="false"
            :on-change="upChangeFile"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">限单个pdf文件</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div style="text-align: center">
        <el-button @click="jifenVisible = false">取消</el-button>
        <el-button type="primary" :loading="loading2" @click="upFile"
          >确认</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
// import the styles
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

import {
  listInstrumentPage,
  updateInstrument,
  listCompanySel,
  listShortPointSel,
  listInstrumentTypeSel,
  addInstrument,
  deleteInstrument,
  getInstrumentById,
  listGroupSel,
  listWorkload,
  updateWorkloadCoefficient,
  updateInstrumentWorkload,
  getWorkloadPdf,
  uploadWorkloadPdf,
} from "@/api/table";
import { mapGetters } from "vuex";

import pdf from "vue-pdf";
import axios from "axios";
import setting from "@/settings";
import { getToken } from "@/utils/auth";
import moment from "moment";

// import moment from 'moment'
export default {
  name: "WorkLoad",
  components: {
    Treeselect,
    pdf,
  },
  data() {
    return {
      jifenVisible: false,
      loading2: false,
      pdfVisible: false,
      pageTotal: 0,
      realUrl: "",
      pdfUrl: "",
      mode: 1, //1 简约  2详情
      pageIndex: 1,
      pageSize: 10,
      companyId: null,
      groupId: null,
      pointId: null,
      total: 0,
      records: [],
      comlist: [],
      groupList: [],
      pointStatus: "",
      editTitle: "",
      newRecords: [],
      uplist: [],
      comName: "",
      pointName: "",
      status: "",
      pollutionType: "",
      newValue: "",
      addVisible: false,
      editVisible: false,
      loading: false,
      listLoading: false,
      editPointVisible: false,
      form: {},
      allyjList: [], // 全部药剂列表
      yaojiChoose: [], // 全部药剂列表
      shebeilist: [], // 全部药剂列表
      dianweiList: [], // 全部药剂列表
      dianweiList2: [], // 全部药剂列表
      month: new Date(),
      options: [
        {
          value: 1,
          label: "在用",
        },
        {
          value: 2,
          label: "停运",
        },
        {
          value: 3,
          label: "建设",
        },
        {
          value: 4,
          label: "合同转包",
        },
        {
          value: 5,
          label: "合同终止",
        },
        {
          value: 6,
          label: "拆除",
        },
      ],
      rules: {
        oldValue: [
          {
            required: true,
            type: "number",
            message: "必须为数字",
            transform: (value) =>
              this.$options.filters.formValidateFun(value, "number"),
          },
        ],
        newValue: [
          {
            required: true,
            type: "number",
            message: "必须为数字",
            transform: (value) =>
              this.$options.filters.formValidateFun(value, "number"),
          },
        ],
      },
      normalizer2(node) {
        return {
          id: node.groupId,
          label: node.groupName,
          children: node.children && node.children.length ? node.children : 0,
        };
      },
      pickerOptions: {
        disabledDate(time) {
          // 初始时限制可选月份在当前月份及之后3个月
          const startTime = new Date("2025-02").getTime();
          const nowTime = new Date().getTime();
          return time.getTime() < startTime || time.getTime() > nowTime;
        },
      },
    };
  },
  computed: {
    ...mapGetters(["userId", "roleId", "userGroupId"]),
  },
  mounted() {
    listGroupSel({}).then((res) => {
      console.log(res);
      this.groupList = res.retData;
    });

    // this.listCompanySel()
    // this.listShortPointSel2()
    // this.listInstrumentTypeSel()
    // this.listShortPointSel()
    this.listWorkload();
  },
  methods: {
    upChangeFile(file, fileList) {
      // 更改图片
      this.uplist = fileList;
    },
    upRemove(file, fileList) {
      // 删除上传题目
      console.log(file, fileList);
      this.uplist = fileList;
    },
    upFile() {
      // look youfei
      console.log(this.uplist);
      if (this.uplist.length === 0) {
        this.$notify({
          type: "warning",
          message: "附件不能为空",
        });
        return;
      }
      this.loading2 = true;
      var formData = new FormData();
      formData.append("file", this.uplist[0].raw);
      formData.append("type", "");

      axios
        .post(setting.baseUrl + "/sysSup/fileConvert", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            token: getToken(),
          },
        })
        .then((res) => {
          console.log(res);
          if (res.data.retCode === 1000) {
            uploadWorkloadPdf(res.data.retData).then((res) => {
              console.log(res);
              this.loading2 = false;
              this.$notify({
                type: "Success",
                message: "操作成功",
              });
              this.jifenVisible = false;
            });
          } else {
            this.loading2 = false;
            this.$notify({
              type: "warning",
              message: res.data.retMsg,
            });
          }
        })
        .catch((e) => {
          console.log(e);
          this.loading2 = false;
        });
    },

    openXiugai() {
      //打开修改文件
      this.jifenVisible = true;
      this.uplist = [];
    },
    openPdfEdit() {
      uploadWorkloadPdf();
    },
    openGzl() {
      getWorkloadPdf({}).then((res) => {
        console.log(res);
        this.realUrl = res.retData;
        this.pdfUrl = pdf.createLoadingTask(this.realUrl);
        this.pdfUrl.promise
          .then((pdf) => {
            this.pageTotal = pdf.numPages;
            this.pdfVisible = true;
          })
          .catch((error) => {});
      });
    },
    dwFile() {
      console.log(this.realUrl);
      window.open(this.realUrl.url);
    },
    exportWorkload() {
      this.loading = true;
      exportWorkload({}).then((res) => {
        console.log(res);
        this.loading = false;
        window.open(res.retData);
      });
    },
    updata() {
      console.log("提交");
      console.log(this.form);

      if (this.form.type == 1) {
        updateWorkloadCoefficient({
          pointId: this.form.pointId,
          workloadCoefficient: this.form.newValue,
        }).then((res) => {
          console.log(res);
          this.$notify({
            type: "success",
            message: "操作成功",
          });

          this.editPointVisible = false;
          this.listWorkload();
        });
      } else {
        updateInstrumentWorkload({
          instrumentId: this.form.instrumentId,
          workload: this.form.newValue,
        }).then((res) => {
          console.log(res);
          this.$notify({
            type: "success",
            message: "操作成功",
          });

          this.editPointVisible = false;
          this.listWorkload();
        });
      }
    },
    editPointxs(row) {
      console.log(row);
      console.log(row.pointId);
      console.log(row.workloadCoefficient);
      this.editTitle = row.pointName;

      this.form = {
        oldValue: row.workloadCoefficient,
        newValue: "",
        pointId: row.pointId,
        type: 1, //点位
      };

      this.editPointVisible = true;
    },
    editsbxs(row) {
      console.log(row);
      console.log(row.pointId);
      console.log(row.workloadCoefficient);
      this.editTitle = row.pointName;

      this.form = {
        oldValue: row.instrumentWorkload,
        newValue: "",
        instrumentId: row.instrumentId,
        type: 2, //点位
      };

      this.editPointVisible = true;
    },
    toggleMode(value) {
      this.listLoading = false;
      this.mode = value;
      this.$nextTick(() => {
        this.listLoading = true;
      });
    },
    listWorkload() {
      listWorkload({
        groupId: this.groupId,
        month: moment(this.month).format("YYYY-MM"),
      }).then((res) => {
        console.log(res);

        var temp = res.retData;
        var newRecords = [];
        const comIndex = []; // 公司行数
        const pointIndex = []; // 点位行数

        var comNum = 0;
        var pointNum = 0;

        temp.forEach((e, index) => {
          comNum = 0;

          if (e.points.length === 0) {
            // 该组没有点位
            newRecords.push({
              groupName: this.computedNull(e.groupName),
              groupUserNames: this.computedNull(e.groupUserNames),
              allWorkload: this.computedNull(e.allWorkload),
              zsAllWorkload: this.computedNull(e.zsAllWorkload),
              pointName: "-",
              pointWorkload: "-",
              workloadCoefficient: "-",
              zsPointWorkload: "-",
              instrumentName: "-",
              instrumentWorkload: "-",
              zsInstrumentWorkload: "-",
              index: index,
            });
            comNum++;
            pointIndex.push(1);
          } else {
            e.points.forEach((i) => {
              // 有点位
              if (i.instruments.length === 0) {
                // 该组没有设备

                newRecords.push({
                  groupName: this.computedNull(e.groupName),
                  groupUserNames: this.computedNull(e.groupUserNames),
                  allWorkload: this.computedNull(e.allWorkload),
                  zsAllWorkload: this.computedNull(e.zsAllWorkload),
                  pointName: this.computedNull(i.pointName),
                  pointId: this.computedNull(i.pointId),
                  pointWorkload: this.computedNull(i.pointWorkload),
                  workloadCoefficient: this.computedNull(i.workloadCoefficient),
                  zsPointWorkload: this.computedNull(i.zsPointWorkload),
                  instrumentName: "-",
                  instrumentWorkload: "-",
                  zsInstrumentWorkload: "-",
                  index: index,
                });
                comNum++;
                pointIndex.push(1);
              } else {
                pointNum = 0;
                // 有设备
                i.instruments.forEach((ii) => {
                  pointNum++;
                  newRecords.push({
                    groupName: this.computedNull(e.groupName),
                    groupUserNames: this.computedNull(e.groupUserNames),
                    allWorkload: this.computedNull(e.allWorkload),
                    zsAllWorkload: this.computedNull(e.zsAllWorkload),
                    pointId: this.computedNull(i.pointId),
                    pointName: this.computedNull(i.pointName),
                    pointWorkload: this.computedNull(i.pointWorkload),
                    workloadCoefficient: this.computedNull(
                      i.workloadCoefficient
                    ),
                    zsPointWorkload: this.computedNull(i.zsPointWorkload),
                    instrumentId: this.computedNull(ii.instrumentId),
                    instrumentName: this.computedNull(ii.instrumentName),
                    instrumentWorkload: this.computedNull(
                      ii.instrumentWorkload
                    ),
                    zsInstrumentWorkload: this.computedNull(
                      ii.zsInstrumentWorkload
                    ),
                    index: index,
                  });
                  comNum++;
                });

                pointIndex.push(pointNum);
              }
            });
          }
          comIndex.push(comNum);
        });

        console.log(pointIndex);
        let com = 1;
        for (let i = 0; i < comIndex.length; i++) {
          newRecords[com - 1].comIndex = comIndex[i];
          com += comIndex[i];
        }

        com = 1;
        for (let i = 0; i < pointIndex.length; i++) {
          newRecords[com - 1].pointIndex = pointIndex[i];
          com += pointIndex[i];
        }
        this.newRecords = newRecords;
        this.listLoading = true;
      });
    },

    computedNull(val) {
      if (val === undefined || val === null || val === "" || val === " ") {
        return "-";
      } else {
        return val;
      }
    },
    // 表格合并方法
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (
        columnIndex === 0 ||
        columnIndex === 1 ||
        columnIndex === 2 ||
        columnIndex === 3
      ) {
        if (row.comIndex) {
          // 如果有值,说明需要合并
          return [row.comIndex, 1];
        } else return [0, 0];
      }
      if (
        columnIndex === 4 ||
        columnIndex === 5 ||
        columnIndex === 6 ||
        columnIndex === 7
      ) {
        if (row.pointIndex) {
          // 如果有值,说明需要合并
          return [row.pointIndex, 1];
        } else return [0, 0];
      }
    },
    tableRowClassName({ row, rowIndex }) {
      // console.log('row', row)
      if (row.index % 2 === 0) {
        return "bkred";
      } else {
        return "bkgreen";
      }
    },
    toggleInstrumentType(e) {
      console.log(e);
      var findObj = this.shebeilist.find((i) => {
        return i.instrumentType === e;
      });
      console.log(findObj);
      this.form.instrumentName = findObj.instrumentTypeName;
      this.form.instrumentRealName = findObj.instrumentTypeName;
    },
    riskPersonDeptChangeValue() {
      // form是表单名 riskPersonDept是prop名

      this.$refs["form1"].validateField("pointId");
    },
    remove(e) {
      this.$confirm("此操作将永久删除该设备, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteInstrument({
          instrumentId: e.instrumentId,
        }).then((res) => {
          this.$notify({
            type: "success",
            message: res.retMsg,
          });
          this.listInstrumentPage();
        });
      });
    },
    changeCom(node, instanceId) {
      console.log("🚀 ~ changeCom ~ node,instanceId:", node, instanceId);
      if (node === undefined) {
        this.dianweiList = [];
      } else {
        this.listShortPointSel();
      }
      this.pointId = null;
    },
    changeCom2(node, instanceId) {
      console.log("🚀 ~ changeCom ~ node,instanceId:", node, instanceId);
      this.listShortPointSel2();
      // this.form.pointId = null
      this.$set(this.form, "pointId", null);
      this.$refs["form1"].validateField("companyId");
    },
    listInstrumentTypeSel() {
      // 设备类型
      listInstrumentTypeSel({}).then((res) => {
        this.shebeilist = res.retData;
      });
    },
    listShortPointSel() {
      // 点位id
      listShortPointSel({
        companyId: this.companyId || "",
      }).then((res) => {
        console.log(res);
        this.dianweiList = res.retData;
      });
    },
    listShortPointSel2() {
      // 点位id
      listShortPointSel({
        companyId: this.form.companyId || "",
      }).then((res) => {
        console.log(res);
        this.dianweiList2 = res.retData;
      });
    },
    listCompanySel() {
      // 公司id
      listCompanySel({}).then((res) => {
        console.log(res);
        this.comlist = res.retData;
      });
    },

    seach() {
      this.listWorkload();
    },
    editPoint(e) {
      console.log(e);
      getInstrumentById({
        instrumentId: e.instrumentId,
      }).then((res) => {
        console.log(res);
        this.editVisible = true;
        this.form = res.retData;
      });

      console.log("🚀 ~ editPoint ~   this.form:", this.form);
    },
    addShebei(e) {
      this.addVisible = true;
      this.form = {
        companyId: null,
        pointId: null,
        checkStatus: 1,
        startYear: "",
      };
      if (this.companyId) {
        this.form.companyId = this.companyId;
      }
      if (this.pointId) {
        this.form.pointId = this.pointId;
      }
      this.listShortPointSel2();
    },
    sumbitPoint() {
      // if (this.form.pointId == null || this.form.pointId == undefined || this.form.pointId == '') {
      //   this.$notify({
      //     type: 'error',
      //     message: '请选择点位名称'
      //   })
      //   return
      // }
      this.$refs.form1.validate((valid) => {
        if (valid) {
          addInstrument(this.form).then((res) => {
            console.log(res);
            this.$notify({
              type: "success",
              message: res.retMsg,
            });
            this.addVisible = false;
            this.listInstrumentPage();
          });
        }
      });
    },
    editSubmit() {
      this.$refs.form1.validate((valid) => {
        if (valid) {
          updateInstrument(this.form).then((res) => {
            console.log(res);
            this.$notify({
              type: "success",
              message: res.retMsg,
            });
            this.editVisible = false;
            this.listInstrumentPage();
          });
        }
      });
    },
    gotoPoint(e) {
      console.log(e);
    },
  },
};
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

.editFont {
  color: blueviolet;
  cursor: pointer;
}

.dwfile {
  position: absolute;
  right: -3vw;
  bottom: 0vw;
  z-index: 9999;
  width: 50px;
  cursor: pointer;
}
</style>
<style>
.el-table .bkred {
  background: #ffffff;
}

.el-table .bkgreen {
  background: #fafafa;
}
</style>
