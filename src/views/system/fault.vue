<template>
  <div class="testPaper">
    <div class="leftChooseBox">
      <div class="boxTitle">
        设备类型
      </div>
      <div class="chooseBox">
        <div v-for="(item,index) in shebeilist" :key="'shbei'+item.instrumentType"
          :class="['chooseItem',index==chooseIndex?'choosed':'']" @click="changeChooseIndex(index)">
          {{item.instrumentTypeName}}
        </div>
      </div>
    </div>
    <div class="rightChooseBox">
      <div class="boxTitle">
        故障处理 <el-button type="primary" style="margin-left:20px" @click="addTree">添加</el-button>
      </div>
      <div class="chooseBox" style="padding-top:20px">
        <el-tree :data="treeList" node-key="id" default-expand-all :expand-on-click-node="false" :show-checkbox="false"
          draggable>
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <el-input v-model="node.data.content" placeholder="请输入内容"></el-input>
            <span>
              <el-button type="text" size="mini" @click="() => edit(data)">
                编辑
              </el-button>
              <el-button type="text" size="mini" @click="() => remove(node, data)">
                删除
              </el-button>
            </span>
          </span>
        </el-tree>
      </div>
    </div>

    <el-dialog :title="treeTitle" :visible.sync="treeVisble" width="30%">
      <el-form ref="form1" :model="form" label-width="140px" :rules="rules">
        <el-form-item label="内容" prop="content">
          <el-input v-model="form.content" placeholder="请输入内容" :rows="4" type="textarea" />
        </el-form-item>
        <el-form-item label="父级">
          <treeselect v-model="form.pid" :multiple="false" :options="treeList" :normalizer="normalizer"
            :defaultExpandLevel='2' placeholder="请选择父级" class="seachInput">

            <label slot="option-label" slot-scope="{ node, labelClassName }" :class="labelClassName"
              :title="node.label">
              {{ node.label }}
            </label>
          </treeselect>
        </el-form-item>
        <el-form-item label="排序号" prop="orderNum">
          <el-input v-model="form.orderNum" placeholder="请输入排序号" />
        </el-form-item>
      </el-form>
      <div style="text-align:center;margin-top:20px">
        <el-button @click="treeVisble = false">取 消</el-button>
        <el-button v-if="treeTitle=='新增故障处理'" type="primary" @click="addFaultHandle">确 定</el-button>
        <el-button v-else type="primary" @click="updateFaultHandle">更 新</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    listInstrumentTypeSel,
    listFaultHandleByInstrumentType,
    addFaultHandle,
    updateFaultHandle,
    deleteFaultHandle
  } from '@/api/table'

  import Treeselect from '@riophae/vue-treeselect'
  // import the styles
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'

  import {
    mapGetters
  } from 'vuex'
  // import moment from 'moment'

  export default {
    name: 'Fault',
    components: {
      Treeselect
    },
    data() {
      return {
        shebeilist: [],
        chooseIndex: 0,
        treeList: [],
        treeVisble: false,
        treeTitle: "新增故障处理",
        rules: {
          orderNum: [{
            required: true,
            type: 'number',
            message: '必须为数字',
            transform: value =>
              this.$options.filters.formValidateFun(value, 'number')
          }],
          content: [{
            required: true,
            message: '请输入内容',
            trigger: 'blur'
          }]
        },
        form: {},
        normalizer(node) {
          // if (!node.children.length) delete node.children
          return {
            id: node.id,
            label: node.content,
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
      this.listInstrumentTypeSel()
    },
    methods: {
      listInstrumentTypeSel() { // 设备类型
        listInstrumentTypeSel({}).then(res => {
          this.shebeilist = res.retData
          this.listFaultHandleByInstrumentType()
        })
      },
      changeChooseIndex(index) {
        this.chooseIndex = index
        this.listFaultHandleByInstrumentType()
      },
      listFaultHandleByInstrumentType() {
        listFaultHandleByInstrumentType({
          instrumentType: this.shebeilist[this.chooseIndex].instrumentType
        }).then(res => {
          console.log(res)
          this.treeList = res.retData
        })
      },
      edit(node) {
        console.log(node)
        this.treeVisble = true
        this.treeTitle = '编辑故障处理'
        this.form = {
          id: node.id,
          orderNum: node.orderNum,
          pid: node.pid,
          content: node.content
        }

      },
      remove(node, data) {
        console.log(node, data)

        this.$confirm('此操作将永久删除该内容, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          deleteFaultHandle({
            faultHandleId: data.id
          }).then(res => {
            console.log(res)
            this.$notify({
              type: 'success',
              message: res.retMsg
            })
            this.listFaultHandleByInstrumentType()
          })
        })



      },
      addFaultHandle() {
        this.$refs.form1.validate((valid) => {
          if (valid) {
            addFaultHandle(this.form).then(res => {
              console.log(res)
              this.$notify({
                type: 'success',
                message: res.retMsg
              })
              this.treeVisble = false
              this.listFaultHandleByInstrumentType()
            })
          }
        })
      },
      updateFaultHandle() {
        this.$refs.form1.validate((valid) => {
          if (valid) {
            updateFaultHandle(this.form).then(res => {
              console.log(res)
              this.$notify({
                type: 'success',
                message: res.retMsg
              })
              this.treeVisble = false
              this.listFaultHandleByInstrumentType()
            })
          }
        })
      },
      addTree() {
        this.treeVisble = true
        this.treeTitle = '新增故障处理'
        this.form = {
          instrumentType: this.shebeilist[this.chooseIndex].instrumentType
        }
      }
    }
  }

</script>

<style lang="scss" scoped>
  .testPaper {
    display: flex;
    margin: 20px;
  }

  .leftChooseBox {
    width: 20%;
    margin-right: 20px;
  }

  .rightChooseBox {
    width: 80%;
  }

  .boxTitle {
    height: 30px;
    line-height: 30px;
    font-size: 22px;
    font-weight: bolder;
  }

  .chooseBox {
    border-radius: 15px;
    height: calc(100vh - 84px - 40px - 30px - 15px);
    border: 1px solid #333;
    margin-top: 15px;
    overflow: auto;
  }



  .chooseItem {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #333;
    padding-left: 30px;
    cursor: pointer;
  }

  .choosed {
    background: #409eff;
    color: white;
    font-weight: bold;
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

</style>
