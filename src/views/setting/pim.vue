<template>
  <div class="app">
    <div class="leftDepartmentId">
      <div class="HeadTitle">申请部门 </div>
      <div class="departmentList">
        <div v-for="(item,index) in departmentList" :key="item.id" class="depCard" @click="toggleIndex(index)">
          <img v-if="index==depIndex" src="@/assets/depChoEd.png" class="depChoEd" alt="" srcset="">
          <img v-if="index!=depIndex" src="@/assets/depNo.png" class="depChoEd" alt="" srcset="">
          <span v-if="index==depIndex" class="chooseEd"> {{item.name}}</span>
          <span v-if="index!=depIndex"> {{item.name}}</span>
        </div>
      </div>
    </div>
    <div class="rightYaoji" v-loading="loading">
      <div class="HeadTitle">药剂提供方式</div>
      <div class="yaojiName">
        药剂名称
        <el-input v-model="pharmaceuticalName" placeholder="请输入检索的药剂名称" style="width:10vw;margin-left:0.73vw"
          size="small" clearable>
        </el-input>
        <el-button type="primary" size="small" style="margin-left:0.73vw" icon="el-icon-search"
          @click="listPharmaceuticalProvideVO">搜索
        </el-button>
        <el-button type="primary" size="small" style="margin-left:0.73vw" icon="el-icon-finished" @click="save">保存
        </el-button>
      </div>
      <div class="gradBox" v-if="pharList.length!=0">
        <div v-for="(item,index) in pharList" :key="item.id" :class="[item.provideMethod==1?'yaojiCard1':'yaojiCard2']"
          @click="toggleMethod(index)">
          <span> {{item.pharmaceuticalName}}</span>
          <div class="rightShow">
            <img v-if="item.provideMethod==1" src="@/assets/provideMethod1.png" class="provideMethod" alt="" srcset="">
            <img v-else src="@/assets/provideMethod2.png" class="provideMethod" alt="" srcset="">
            {{item.provideMethod==1?'海晟提供':'申领方提供'}}
          </div>
        </div>

      </div>
      <el-empty v-if="pharList.length==0" description="暂无数据" style="margin-top:20vh"></el-empty>



    </div>
  </div>
</template>

<script>
  import {
    listReagentDepartment,
    listPharmaceuticalProvideVO,
    updatePharmaceuticalProvide
  } from '@/api/table'
  export default {
    name: 'Pim',
    data() {
      return {
        departmentList: [],
        pharList: [],
        depIndex: 0,
        pharmaceuticalName: "",
        loading: false
      }
    },
    mounted() {
      this.listReagentDepartment()

    },
    methods: {
      listReagentDepartment() {
        listReagentDepartment({}).then(res => {
          console.log(res)
          this.departmentList = res.retData
          this.listPharmaceuticalProvideVO()
        })
      },
      listPharmaceuticalProvideVO() {
        this.loading = true
        listPharmaceuticalProvideVO({
          pharmaceuticalName: this.pharmaceuticalName,
          departmentId: this.departmentList[this.depIndex].id,
        }).then(res => {
          console.log('listPharmaceuticalProvideVO', res)
          let temp = res.retData
          temp.forEach(e => {
            e.departmentId = this.departmentList[this.depIndex].id
          });
          this.pharList = temp
          setTimeout(() => {
            this.loading = false
          }, 500)
        })
      },
      toggleIndex(index) {
        this.depIndex = index
        this.listPharmaceuticalProvideVO()
      },
      toggleMethod(index) {
        this.pharList[index].provideMethod = this.pharList[index].provideMethod == 1 ? 2 : 1
      },
      save() {
        let temp = this.pharList
        let newArr = []
        temp.forEach(e => {
          newArr.push({
            id: e.pharmaceuticalProvideId,
            pharmaceuticalId: e.pharmaceuticalId,
            provideMethod: e.provideMethod,
            departmentId: this.departmentList[this.depIndex].id
          })
        });

        updatePharmaceuticalProvide(newArr).then(res => {
          this.$notify({
            type: "success",
            message: "操作成功"
          })
        })
      }
    }

  }

</script>
<style lang="scss" scoped>
  .app {
    margin: 1.04vw;
    display: flex;

  }

  .leftDepartmentId {
    width: 15vw;
    height: calc(100vh - 50px - 34px - 40px);
    overflow: auto;
  }

  .rightYaoji {
    width: 80vw;
    height: calc(100vh - 50px - 34px - 40px);
    overflow: auto;
  }

  .HeadTitle {
    font-size: 0.83vw;
    height: 1vw;
    line-height: 1vw;
    font-weight: 500;
    color: #000000;
  }

  .departmentList {
    width: 11.46vw;
    background: #FFFFFF;
    border-radius: 0.1vw 0.1vw 0.1vw 0.1vw;
    opacity: 1;
    border: 1px solid #EEEEEE;
    margin-top: 1.3vw;
    padding: 1.41vw 0 1.03vw 1.46vw;
  }

  .depCard {
    display: flex;
    align-items: center;
    font-size: 0.73vw;
    font-weight: 500;
    color: #333333;
    cursor: pointer;
    margin-bottom: 1.15vw;
  }

  .depChoEd {
    width: 1.67vw;
    height: 1.67vw;
    margin-right: 1.04vw;
  }

  .chooseEd {
    color: #3A8DFD;
  }

  .yaojiName {
    font-size: 0.73vw;
    margin-top: 1.3vw;
    display: flex;
    align-items: center;
  }

  .gradBox {
    display: grid;
    grid-template-columns: 33.33% 33.33% 33.33%;
    margin-top: 2.03vw;
    height: calc(100vh - 50px - 34px - 40px - 1vw - 1.3vw - 33px - 2.03vw);
    overflow: auto;
  }

  .yaojiCard1,
  .yaojiCard2 {
    display: flex;
    align-items: center;
    font-size: 0.73vw;
    font-weight: 500;
    color: #333333;
    cursor: pointer;
    width: 18.75vw;
    height: 2.81vw;
    background: #f1f8fe;
    border-radius: 0.31vw 0.31vw 0.31vw 0.31vw;
    margin-bottom: 0.99vw;
    padding-left: 1.2vw;
    position: relative;
  }

  .yaojiCard2 {
    background: #f1f9f0;
  }

  .provideMethod {
    width: 0.52vw;
    height: 0.6vw;
    margin-right: 0.66vw;
  }

  .rightShow {
    position: absolute;
    left: 12.76vw;
  }

</style>
