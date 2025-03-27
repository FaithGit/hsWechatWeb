<template>
  <div class="testPaper">
    <!-- 条件栏 -->
    <div class="headClass">
      主题：
      <el-input v-model="theme" class="seachInput" clearable />
      推送类型：
      <el-select v-model="expireStatus" class="seachInput" clearable>
        <el-option label="每日答题" :value="1" />
        <el-option label="案例分析" :value="2" />
      </el-select>
      <el-button type="primary" @click="seach">搜索</el-button>
      <el-button type="primary" @click="add">新增</el-button>
    </div>

    <!-- 表格 -->
    <el-table v-loading="listLoading" :data="records" element-loading-text="加载中" border fit highlight-current-row
      style="margin-top: 1.04vw" height="calc(100vh - 84px - 60px - 40px - 32px - 1.04vw - 17px)">
      <el-table-column align="center" label="序号" width="95" type="index" />
      <el-table-column align="center" label="主题" prop="theme" />
      <el-table-column align="center" label="创建人" prop="createUser" />
      <el-table-column align="center" label="开始时间" prop="startTime" />
      <el-table-column align="center" label="结束时间" prop="endTime" />
      <el-table-column align="center" label="推送角色">
        <template slot-scope="scope">
          <div v-for="item in scope.row.roles" :key="item.roleId">
            {{ item.roleName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="280">
        <template slot-scope="scope">
          <el-button v-if="scope.row.userCertificateId != ''" @click="edit(scope.row)">编辑</el-button>
          <el-button v-if="scope.row.userCertificateId != ''" type="danger" @click="remove(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="buttonPagination">
      <el-pagination :current-page="pageIndex" :page-sizes="[10, 20, 30, 40, 50]" :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>

    <el-dialog v-if="visible" :title="visibleTitle" :append-to-body="true" :visible="visible" width="40%"
      :close-on-click-modal="false" @close="visible = false">
      <el-form ref="form1" :model="form" label-width="140px" :rules="rules">
        <el-form-item label="推送角色" prop="userId">
          <treeselect v-model="form.userId" :multiple="true" :options="roleList" :normalizer="normalizer"
            placeholder="请选择用户" no-children-text="暂无数据" :disabled="visibleTitle != '新增推送'">
            <label slot="option-label" slot-scope="{ node, labelClassName }" :class="labelClassName"
              :title="node.label">
              {{ node.label }}
            </label>
          </treeselect>
        </el-form-item>
        <el-form-item label="推送类型">
          <el-select v-model="form.type" :disabled="visibleTitle != '新增推送'" @change="changeType">
            <el-option label="每日答题" :value="1" />
            <el-option label="案例分析" :value="2" />
          </el-select>
        </el-form-item>

        <el-form-item label="主题">
          <el-input v-model="form.theme" placeholder="请填写主题" />
        </el-form-item>

        <el-form-item label="开始日期" prop="startTime">
          <el-date-picker v-model="form.startTime" type="date" placeholder="请选择开始日期" />
        </el-form-item>
        <el-form-item label="结束日期" prop="endTime">
          <el-date-picker v-model="form.endTime" type="date" placeholder="请选择结束日期" />
        </el-form-item>

        <el-form-item v-if="form.type == 2 && visibleTitle == '新增推送'" label="案例图片">
          <el-upload action="#" accept=".jpg,.jpeg,.png" :on-change="handleChangeID" :on-remove="handleRemoveID"
            :auto-upload="false" :file-list="zhiweiList" list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item v-if="form.type == 2 && visibleTitle == '查看详情'" label="案例图片">
          <viewer>
            <img v-for="item in form.fileList" :key="item.fileId" :src="item.url" alt=""
              style="width: 100px; height: 100px" />
          </viewer>
        </el-form-item>

        <div style="text-align: center; margin-top: 80px">
          <el-button @click="cancel">取 消</el-button>
          <el-button v-if="visibleTitle == '新增推送'" type="primary" @click="sumbitCom">确 定</el-button>
          <el-button v-if="visibleTitle == '查看详情'" type="primary" @click="update(form)">更 新</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
// import the styles
import Treeselect from "@riophae/vue-treeselect";
// import the styles
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import axios from "axios";
import setting from "@/settings";
import {
  pagePushResultVO,
  listRoleSel,
  savePushRecord,
  removePushRecord,
  updatePushRecord,
} from "@/api/table";
import { mapGetters } from "vuex";
import moment from "moment";
import { getToken } from "@/utils/auth";
// import moment from 'moment'
export default {
  name: "UserCertificate",
  components: {
    Treeselect,
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
      certificateName: "",
      theme: "",
      expireStatus: "",
      visibleTitle: "",
      comName: "",
      areaCode: null,
      status: "",
      visible: false,
      editVisible: false,
      listLoading: false,
      form: {},
      allyjList: [],
      yaojiChoose: [],
      roleList: [],
      zhiweiList: [],
      rules: {
        certificateId: [
          {
            required: true,
            message: "请选择证书名称",
            trigger: "blur",
          },
        ],
        userId: [
          {
            required: true,
            message: "请选择用户",
            trigger: "change",
          },
        ],
        startTime: [
          {
            required: true,
            message: "请选择开始时间",
            trigger: "change",
          },
        ],
        endTime: [
          {
            required: true,
            message: "请选择结束时间",
            trigger: "change",
          },
        ],
      },
      normalizer(node) {
        // if (!node.children.length) delete node.children
        return {
          id: node.roleId,
          label: node.roleName,
          children: node.children && node.children.length ? node.children : 0,
        };
      },
    };
  },
  computed: {
    ...mapGetters(["userName"]),
  },
  mounted() {
    console.log();
    this.listRoleSel();
    this.pagePushResultVO();
  },

  methods: {
    cancel() {
      this.visible = false;
      this.pagePushResultVO();
    },
    listRoleSel() {
      listRoleSel({}).then((res) => {
        console.log(res);
        this.roleList = res.retData;
      });
    },
    pagePushResultVO() {
      pagePushResultVO({
        theme: "",
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
      }).then((res) => {
        console.log(res);
        this.records = res.retData.records;
        this.total = res.retData.total;
      });
    },
    handleChangeID(file, fileList) {
      // 身份附件上传
      var formData = new FormData();
      formData.append("file", file.raw);
      formData.append("type", "certificate");
      axios
        .post(setting.baseUrl + "/pushRecord/imageConvert", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            token: getToken(),
          },
        })
        .then((res) => {
          console.log(res.data);
          const name = res.data.retData;
          const temp = name.split("/");
          temp[temp.length - 1];
          this.zhiweiList.push({
            name: temp[temp.length - 1],
            url: res.data.retData,
          });
        });
    },
    handleRemoveID(file, fileList) {
      // 身份附件删除
      console.log(file, fileList);
      this.zhiweiList = fileList;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.pagePushResultVO();
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.pagePushResultVO();
    },
    seach() {
      this.pageIndex = 1;
      this.pagePushResultVO();
    },
    remove(e) {
      console.log(e);
      this.$confirm("此操作将永久删除该推送?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        removePushRecord({
          id: e.id,
        }).then((res) => {
          this.$notify({
            type: "success",
            message: res.retMsg,
          });
          this.pagePushResultVO();
        });
      });
    },
    edit(e) {
      this.zhiweiList = [];
      console.log(e);
      this.visible = true;
      this.form = e;
      const userId = [];
      e.roles.forEach((i) => {
        userId.push(i.roleId);
      });
      this.form.userId = userId;
      this.visibleTitle = "查看详情";
    },
    add(e) {
      this.visible = true;
      this.form = {
        type: 1,
        theme: "每日答题",
      };
      this.visibleTitle = "新增推送";
      this.zhiweiList = [];
    },
    changeType() {
      if (this.form.type == 1) {
        this.form.theme = "每日答题";
      } else {
        this.form.theme = "案例分析";
      }
    },
    sumbitCom() {
      this.$refs.form1.validate((valid) => {
        if (valid) {
          var _zhiweiList = [];
          if (this.form.type == 1) {
            console.log("答题不做处理");
          } else {
            this.zhiweiList.forEach((e) => {
              _zhiweiList.push({
                fileName: e.name,
                fileUrl: e.url,
              });
            });
          }
          console.log(this.form);
          console.log(this.zhiweiList);
          console.log(_zhiweiList);
          savePushRecord({
            createUser: this.userName,
            roleIds: this.form.userId,
            type: this.form.type,
            theme: this.form.theme,
            startTime: moment(this.form.startTime).format("YYYY-MM-DD"),
            endTime: moment(this.form.endTime).format("YYYY-MM-DD"),
            fileList: _zhiweiList,
          }).then((res) => {
            this.$notify({
              message: "操作成功",
              type: "success",
            });
            this.visible = false;
            this.pagePushResultVO();
          });
        }
      });
    },
    update(e) {
      console.log("更新", e);
      updatePushRecord({
        id: e.id,
        theme: e.theme,
        startTime: moment(e.startTime).format("YYYY-MM-DD"),
        endTime: moment(e.endTime).format("YYYY-MM-DD"),
      }).then((res) => {
        this.$notify({
          message: "更新成功",
          type: "success",
        });
        this.visible = false;
        this.pagePushResultVO();
      });
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

.guoqi {
  color: red;
  font-weight: bold;
}

.jijiang {
  color: rgb(255, 136, 0);
  font-weight: bold;
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
