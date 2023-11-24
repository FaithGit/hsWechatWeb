<template>
  <div class="mainAll">
    <div class="labelBox instrumentNameBox">
      <div class="labelFlag2" />
      <div class="labelTitle instrumentName">
        {{ instrumentName }}
      </div>
    </div>

    <div v-for="(Fitem,Findex) in realShowArr" :key="Fitem.label+Findex" class="zhengtiCard">
      <div class="labelBox">
        <div class="labelFlag" />
        <div class="labelTitle">
          第 {{ Fitem.orderNum }} 步：{{ Fitem.label }}
        </div>
      </div>

      <div v-for="item in Fitem.attributes" :key="item.label">

        <div v-if="item.controlCode=='radio'">
          <div class="AttrCard">
            <div class="AttrLabel">
              {{ item.label }}
            </div>
            <div class="AttrConent">

              <el-radio v-model="item.data" :label="1" disabled>是</el-radio>
              <el-radio v-model="item.data" :label="0" disabled>否</el-radio>
            </div>
          </div>
        </div>

        <div v-if="item.controlCode=='uploadImg'">
          <div class="AttrCard">
            <div class="AttrLabel">
              {{ item.label }}
            </div>
          </div>
          <div style="margin-top: 0.3vw;">
            <template v-for="itm in item.fileList">
              <el-image style="width: 100px; height: 100px;margin-right: 0.3vw;" :src="itm"
                :preview-src-list="item.fileList" :key="itm">
              </el-image>
            </template>
          </div>
        </div>

        <div v-if="item.controlCode=='scan'">
          <div class="AttrCard">
            <div class="AttrLabel">
              {{ item.label }}
            </div>
          </div>
          <div class="AttrCard">
            <div style="width: 100vw;margin-left: 3.067vw;">
              {{ item.data }}
            </div>
          </div>
        </div>

        <div v-if="item.controlCode=='date'">
          <div class="AttrCard">
            <div class="AttrLabel">
              {{ item.label }}
            </div>
            <div style="width: 100vw;padding-right: 3.067vw;text-align: right;">
              {{ item.data }}
            </div>
          </div>
        </div>


        <div v-if="item.controlCode=='text'">
          <div class="AttrCard">
            <div class="AttrLabel">
              {{ item.label }}
            </div>
            <div style="width: 100vw;padding-right: 3.067vw;text-align: right;">
              {{ item.data }}
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    props: {
      realShowArr: {
        type: Array,
        required: true
      },
      instrumentName:{
                type: String,
        required: true
      }
    },
    data() {
      return {

      }
    },
    destroyed() {

    },
    mounted() {

    },
    methods: {

    }
  }

</script>

<style lang="scss" scoped>
  .mainAll {
    position: relative;
    width: 100%;
    height: 70vh;
    overflow: auto;
  }

  .jieshaoTitle {
    width: 35.47vw;
    font-size: 1.25vw;
    font-family: Microsoft YaHei UI;
    font-weight: 400;
    line-height: 2.19vw;
    color: #AAAAAA;
    margin-left: 1.67vw;
  }

  .main {
    height: calc(100vh - constant(safe-area-inset-bottom));
    height: calc(100vh - env(safe-area-inset-bottom));
    background: #f2f4f6;
    overflow: auto;
  }

  .labelBox {
    width: 100%;
    height: 2vw;
    position: relative;
    display: flex;
    align-items: center;

  }

  .labelFlag {
    width: 0.21vw;
    height: 1vw;
    background: #427AFF;
    border-radius: 0.1vw;
    margin-left: 1vw;
  }

  .labelTitle {
    font-size: 0.8vw;
    font-family: Microsoft YaHei UI;
    font-weight: bold;
    color: #333333;
    margin-left: 0.3vw;
  }

  .AttrCard {
    min-height: 1.79vw;
    background: #FFFFFF;
    display: flex;
    align-items: center;
    margin-bottom: 0.133vw;
  }

  .AttrLabel {
    width: 25vw;
    margin-left: 1.2vw;
    flex-grow: 1;
    flex-shrink: 1;
    word-wrap: break-word;
  }

  .AttrConent {
    width: 19.53vw;
    display: flex;
    justify-content: flex-end;
    margin-right: 1.04vw;
    flex-shrink: 0;
  }

  .bottomButton {
    height: 6.25vw;
    display: flex;
    justify-content: space-evenly;
    background: #f2f4f6;
    padding-top: 0.78vw;
  }

  .stepMode1 {
    height: calc(100vh - constant(safe-area-inset-bottom));
    height: calc(100vh - env(safe-area-inset-bottom));
    background: #f2f4f6;
    overflow: auto;
    position: relative;
  }

  .stepMode1Button {
    height: 6.25vw;
    display: flex;
    justify-content: space-evenly;
    background: #f2f4f6;
    align-items: center;
  }

  .stepMode3Button {
    width: 39.06vw;
    height: 6.25vw;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    background: #f2f4f6;
    position: absolute;
    bottom: 0;
  }

  .ywDefault {
    width: 12.29vw;
    height: 13.8vw;
    margin-top: 12.4vw;
    margin-left: 13.39vw;
  }

  .ywSubmitTitle {
    width: 39.06vw;
    font-size: 1.56vw;
    font-family: Microsoft YaHei UI;
    font-weight: bold;
    color: #FF8C58;
    text-align: center;
    margin-top: 3.59vw;
  }

  .zhengtiCard {
    margin-bottom: 1.17vw;
  }

  .instrumentName {
    font-size: 1vw;
  }

  .instrumentNameBox {
    display: flex;
    align-items: center;
    margin-bottom: 1vw;
  }

  .labelFlag2 {
    width: 0.31vw;
    height: 1.56vw;
    background: #427AFF;
    border-radius: 0.1vw;
    margin-left: 1vw;
  }

</style>
