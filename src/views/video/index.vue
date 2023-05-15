<template>
  <div class="testPaper">
    <!-- 条件栏 -->
    <div>
      视频名称：
      <el-input v-model="videoName" class="seachInput" placeholder="请选择输入关键字" clearable />
      状态：
      <el-select v-model="status" placeholder="请选择状态" class="seachInput" clearable>
        <el-option v-for="item in statusoptions" :key="item.value+'状态'" :label="item.label" :value="item.value" />
      </el-select>
      <el-button type="primary" @click="seach">搜索</el-button>
      <el-button type="primary" @click="openShijuan">导入视频</el-button>
    </div>

    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="records"
      element-loading-text="加载中"
      border
      fit
      highlight-current-row
      style="margin-top:1.04vw"
    >
      <el-table-column align="center" label="#" width="95">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="视频名称" prop="videoName" />

      <el-table-column align="center" label="开始时间" prop="startTime" />
      <el-table-column align="center" label="结束时间" prop="endTime" />
      <el-table-column align="center" label="状态" prop="status" />
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button @click="checkVideo(scope.row)"> 查看</el-button>
          <el-button type="danger" @click="remove(scope.row)"> 删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="buttonPagination">
      <el-pagination
        :current-page="pageNo"
        :page-sizes="[10,20,30,40,50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 导入视频 -->
    <el-dialog
      v-if="shijuanVisible"
      title="导入视频"
      :append-to-body="true"
      :visible="shijuanVisible"
      width="50%"
      :close-on-click-modal="false"
      @close="shijuanVisible=false"
    >
      <el-form ref="form1" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="视频名称" prop="videoName">
          <el-input v-model="form.videoName" placeholder="请输入视频名称" />
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker v-model="form.startTime" type="datetime" placeholder="选择发布时间" />
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker v-model="form.endTime" type="datetime" placeholder="选择截止时间" />
        </el-form-item>
        <el-form-item label="视频简介" prop="introduction">
          <el-input v-model="form.introduction" type="textarea" placeholder="请输入视频简介" rows="4" />
        </el-form-item>
        <el-form-item label="封面照片">
          <el-upload
            style="width:30%"
            class="upload-demo"
            action="#"
            list-type="picture"
            :on-remove="upRemove2"
            :limit="1"
            :file-list="uplist2"
            accept=".jpg,.jpeg"
            :auto-upload="false"
            :on-change="upChangeFile2"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">限单个jpg/jpeg文件</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="视频附件">
          <el-upload
            style="width:30%"
            class="upload-demo"
            action="#"
            :on-remove="upRemove"
            :limit="1"
            :file-list="uplist"
            accept=".mp4"
            :auto-upload="false"
            :on-change="upChangeFile"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">限单个mp4文件</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div style="text-align:center">
        <el-button :loading="loading" @click="shijuanVisible=false">取消</el-button>
        <el-button type="primary" :loading="loading" @click="upVedio">确认</el-button>
      </div>
    </el-dialog>

    <el-dialog
      v-if="checkVisible"
      title="查看视频"
      :append-to-body="true"
      :visible="checkVisible"
      width="50%"
      :close-on-click-modal="false"
      @close="checkVisible=false"
    >
      <el-form ref="form1" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="视频名称" prop="videoName">
          <el-input v-model="form.videoName" placeholder="请输入视频名称" :readonly="true" />
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker v-model="form.startTime" :readonly="true" type="datetime" placeholder="选择发布时间" />
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker v-model="form.endTime" :readonly="true" type="datetime" placeholder="选择截止时间" />
        </el-form-item>
        <el-form-item label="视频简介" prop="introduction">
          <el-input v-model="form.introduction" type="textarea" placeholder="请输入视频简介" :readonly="true" rows="4" />
        </el-form-item>
        <el-form-item label="封面照片">
          <img :src="form.coverUrl" style="width:100px" alt="" srcset="">
        </el-form-item>
        <el-form-item label="视频附件">
          <div id="dplayer" ref="player" />
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import DPlayer from 'dplayer'
import {
  listVideo,
  removeVideo
} from '@/api/table'
import {
  mapGetters
} from 'vuex'
import moment from 'moment'

import axios from 'axios'
import setting from '@/settings'
import {
  getToken
} from '@/utils/auth'

export default {
  name: 'Video',
  computed: {
    ...mapGetters([
      'userId'
    ])
  },
  data() {
    return {
      pageNo: 1,
      pageSize: 10,
      total: 0,
      records: [],
      licensedStatusoptions: [{
        value: 1,
        label: '组长'
      }, {
        value: 2,
        label: '组员'
      }, {
        value: 3,
        label: '全部'
      }],
      statusoptions: [{
        value: 1,
        label: '未开始'
      }, {
        value: 2,
        label: '已开始'
      }, {
        value: 3,
        label: '已过期失效'
      }],
      examDifficultyCodeList: [{
        value: 1,
        label: '易'
      }, {
        value: 2,
        label: '较易'
      }, {
        value: 3,
        label: '中等'
      }, {
        value: 4,
        label: '较难'
      }, {
        value: 5,
        label: '难'
      }

      ],
      licensedStatus: '',
      status: '',
      videoName: '',
      search1: '',
      listLoading: false,
      loading: false, // 上传题目的loading
      examVisible: false,
      shijuanVisible: false,
      checkVisible: false,
      dp: null,
      examObj: {},
      uplist: [], // 视频文件
      uplist2: [], // 封面文件
      form: {
        videoName: '',
        licensedStatus: '',
        startTime: '',
        endTime: '',
        introduction: ''
      },
      rules: {
        videoName: [{
          required: true,
          message: '请输入视频名称',
          trigger: 'blur'
        }],
        introduction: [{
          required: true,
          message: '请输入视频简介',
          trigger: 'blur'
        }],
        licensedStatus: [{
          required: true,
          message: '请选择学习人员',
          trigger: 'change'
        }],
        startTime: [{
          required: true,
          message: '请选择视频学习开始时间',
          trigger: 'change'
        }],
        endTime: [{
          required: true,
          message: '请选择视频学习结束时间',
          trigger: 'change'
        }]
      }
    }
  },
  mounted() {
    this.listVideo()
  },
  methods: {
    listVideo() {
      listVideo({
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        licensedStatus: '',
        status: this.status,
        videoName: this.videoName
      }).then(res => {
        console.log('🚀 ~ listVideo ~ res', res)
        this.records = res.retData.records
        this.total = res.retData.total
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.listVideo()
    },
    handleCurrentChange(val) {
      this.pageNo = val
      this.listVideo()
    },
    seach() {
      this.pageNo = 1
      this.listVideo()
    },

    upChangeFile(file, fileList) { // 更改图片
      this.uplist = fileList
      console.log('🚀 ~ upChangeFile ~  this.uplist', this.uplist)
    },
    upChangeFile2(file, fileList) { // 更改图片
      this.uplist2 = fileList
      console.log('🚀 ~ upChangeFile ~  this.uplist', this.uplist)
    },
    upRemove(file, fileList) { // 删除视频
      console.log(file, fileList)
      this.uplist = fileList
    },
    upRemove2(file, fileList) { // 删除封面
      console.log(file, fileList)
      this.uplist2 = fileList
    },
    openShijuan() { // 新建视频
      this.uplist = []
      this.uplist2 = []
      this.loading = false
      this.shijuanVisible = true
      this.form = {
        videoName: '',
        licensedStatus: '',
        examDifficultyCode: '',
        startTime: '',
        endTime: ''
      }
    },
    upVedio() { // 上传题目
      this.$refs.form1.validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.uplist2.length === 0) {
            this.$notify({
              type: 'warning',
              message: '没有上传封面'
            })
            this.loading = false
            return
          }

          if (this.uplist.length === 0) {
            this.$notify({
              type: 'warning',
              message: '没有上传视频'
            })
            this.loading = false
            return
          } else {
            var formData = new FormData()
            formData.append('file', this.uplist[0].raw)
            formData.append('cover', this.uplist2[0].raw)
            formData.append('videoName', this.form.videoName)
            formData.append('licensedStatus', '')
            formData.append('startTime', moment(this.form.startTime).format('YYYY-MM-DD HH:mm:ss'))
            formData.append('endTime', moment(this.form.endTime).format('YYYY-MM-DD HH:mm:ss'))
            formData.append('introduction', this.form.introduction)
            // return
            axios.post(setting.baseUrl + '/video/uploadVideo', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                'token': getToken()
              }
            })
              .then(res => {
                console.log(res.data)
                if (res.data.retCode === 1000) {
                  this.$notify({
                    type: 'success',
                    message: '上传成功'
                  })
                  this.shijuanVisible = false
                  this.loading = false
                  this.seach()
                } else {
                  this.$notify({
                    type: 'warning',
                    message: res.data.retMsg
                  })
                }
                this.loading = false
              }).catch((e) => {
                console.log('🚀 ~ this.$refs.fuform.validate ~ e', e)
                this.loading = false
              })
          }
        }
      }

      )
    },
    checkVideo(item) { // 查看试卷
      console.log(item)
      this.checkVisible = true
      this.form = item
      setTimeout(() => {
        this.dp = new DPlayer({
          container: this.$refs.player,
          video: {
            url: item.videoUrl,
            type: 'auto'
          }
        })
      }, 500)
    },
    remove(item) {
      console.log(item)
      this.$confirm('此操作将永久删除该试卷, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeVideo({
          videoId: item.videoId
        }).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.listVideo()
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

</style>
