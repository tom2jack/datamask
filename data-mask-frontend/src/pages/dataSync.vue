<!--数据同步主页面-->
<template>
  <el-container>
    <el-header style="height: auto">
      <myHeader></myHeader>
    </el-header>

    <el-main class=" row-col-center">
      <span>数据同步页面</span>
    </el-main>
  </el-container>
</template>

<script>
import myHeader from '../components/header.vue'
export default {
  components: {
    myHeader
  },
  data () {
    return {
    }
  },
  created () {
    this.$cookie.set('updateIndex', '/data_sync', 0.25)
    this.loginStatus = this.$cookie.get('loginStatus')
    this.userValidate()
  },
  methods: {
    userValidate () {
      if (this.loginStatus === null || this.loginStatus === 'logout') {
        this.$router.push({
          path: '/login'
        })
      }
    }
  }
}
</script>

<style scoped>
  .row-col-center {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .row-col-left {
    display: flex;
    flex-direction: row;
    justify-content: left;
    align-items: left;
  }
</style>
