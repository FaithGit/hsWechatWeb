<template>
  <div class="table1">
    <el-table
      :data="listData4"
      style="width: 100%;margin-top:20px"
      height="19.8vw"
      :header-cell-style="{background:'rgba(26,144,254,0.3)',color:'#606266'}"
    >
      <el-table-column prop="userName" label="姓名" align="center" />
      <el-table-column prop="groupName" label="运维组" align="center" />
      <el-table-column prop="roleName" label="角色" align="center" />
      <el-table-column prop="userScores" label="成绩" align="center" />
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    listData4: {
      type: Array,
      required: true
    }
  },
  data() {
    return {

    }
  },

  mounted() {
    console.log('listData4', this.listData4)
  },
  methods: {

  }
}

</script>

<style lang="scss" scoped>
  .table1 {
    width: 50.68vw;
    height: 19.27vw;
    position: relative;
    top: 2.5vw;
    z-index: 99;
    overflow: auto;
  }

</style>
