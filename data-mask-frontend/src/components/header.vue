<template>
  <el-row :gutter="5">
    <el-col :span="6" class="row-col-center">
      <img src="static/img/data-masking-logo.jpg" alt="data-masking-logo">
      <h3><span class="hidden-md-and-down">数据脱敏平台系统</span></h3>
    </el-col>

    <el-col :span="15">
      <!--router 为 true表示使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转-->
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" style="border-bottom: none" active-text-color="#409EFF" :router="true">
        <el-menu-item index="/">
          <!--<i class="fa fa-home fa-lg"/>-->
          <span class="hidden-md-and-down">&nbsp;首页</span>
        </el-menu-item>
        <el-menu-item index="/offline">
          <!--<i class="fa fa-users fa-lg"/>-->
          <span class="hidden-md-and-down">&nbsp;离线数据脱敏</span>
        </el-menu-item>
        <el-menu-item index="/stream">
          <!--<i class="fa fa-book fa-lg"/>-->
          <span class="hidden-md-and-down">&nbsp;实时流数据脱敏</span>
        </el-menu-item>
        <el-menu-item index="/data_sync">
          <!--<i class="fa fa-list-ol fa-lg"/>-->
          <span class="hidden-md-and-down">&nbsp;数据同步</span>
        </el-menu-item>
        <el-menu-item index="/history">
          <!--<i class="fa fa-hospital-o fa-lg"/>-->
          <span class="hidden-md-and-down">&nbsp;历史数据查看</span>
        </el-menu-item>
        <el-menu-item index="/login">
          <!-- <i class="fa fa-home fa-lg"/>-->
          <span class="hidden-md-and-down">&nbsp;{{loginVisible}}</span>
        </el-menu-item>
      </el-menu>
    </el-col>

  </el-row>
</template>

<script>
export default {
  data () {
    return {
      loginVisible: '登录',
      activeIndex: '/',
      username: ''
    }
  },
  created () {
    /* this.$root.Bus.$on('userName', value => {
      // console.log('value ' + value)
      this.username = value
    }) */
    /* this.$root.Bus.$on('updateIndex', (value) => {
      vm.activeIndex = value
      console.log(vm.activeIndex)
    }) */
    /* let _this = this
    _this.$root.Bus.$on('updateIndex', function (value) {
      _this.activeIndex = value
      console.log('_this', _this)
    })
    console.log('this.activeIndex', _this) */
    this.changeActiveIndex()
    this.showUserName()
  },
  methods: {
    changeActiveIndex () {
      let currentIndex = this.$cookie.get('updateIndex')
      if (currentIndex !== '' && currentIndex !== null) {
        this.activeIndex = currentIndex
      }
    },
    showUserName () {
      this.username = this.$cookie.get('username')
      if (this.username === '' || this.username === null) {
        this.loginVisible = '登录'
      } else {
        this.loginVisible = this.username
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
    height: 60px;
  }
</style>
