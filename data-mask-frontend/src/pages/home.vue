<template>
  <el-container>
    <el-header style="height: auto">
      <myHeader></myHeader>
    </el-header>
    <el-main >
      <el-row :gutter="5" type="flex" justify="center">
        <el-col :span="8">
          <el-card style="margin: 10px; height: 200px">
            <div slot="header">
              <!--<i class="fa fa-users fa-lg"/>-->
              <span class="hidden-md-and-down">&nbsp;离线数据脱敏</span>
              <el-button style="float: right; padding: 3px 0" type="text">
                <router-link to="/offline">进入</router-link>
              </el-button>
            </div>
            <div>
              进行离线数据脱敏操作
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card style="margin: 10px; height: 200px">
            <div slot="header">
              <!--<i class="fa fa-book fa-lg"/>-->
              <span class="hidden-md-and-down">&nbsp;实时流数据脱敏</span>
              <el-button style="float: right; padding: 3px 0" type="text">
                <router-link to="/stream">进入</router-link>
              </el-button>
            </div>
            <div>
              进行实时流数据脱敏操作
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="5" type="flex" justify="center">
        <el-col :span="8">
          <el-card style="margin: 10px; height: 200px">
            <div slot="header">
              <!--<i class="fa fa-users fa-lg"/>-->
              <span class="hidden-md-and-down">&nbsp;数据同步</span>
              <el-button style="float: right; padding: 3px 0" type="text">
                <router-link to="/data_sync">进入</router-link>
              </el-button>
            </div>
            <div>
              进行数据同步操作
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card style="margin: 10px; height: 200px">
            <div slot="header">
              <!--<i class="fa fa-book fa-lg"/>-->
              <span class="hidden-md-and-down">&nbsp;历史数据查看</span>
              <el-button style="float: right; padding: 3px 0" type="text">
                <router-link to="/history">进入</router-link>
              </el-button>
            </div>
            <div>
              用户可对自己的历史完成的脱敏数据进行导出操作
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import myHeader from '../components/header.vue'
export default {
  components: {myHeader},
  data () {
    return {
      // name: 'xxx'
      loginStatus: 'logout'
    }
  },
  created () {
    // this.name = this.$cookie.get('name')
    this.loginStatus = this.$cookie.get('loginStatus')
    // this.$root.Bus.$emit('updateIndex', '/')
    this.$cookie.set('updateIndex', '/', 0.25)
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
