<!--脱敏过程展示的页面。-->
<template>
  <el-container>
    <el-header style="height: auto">
      <myHeader></myHeader>
    </el-header>

    <el-main class=" row-col-center">
      <el-card v-show="maskProcessVisible" class="box-card" style="width: 50%">
        <div slot="header" class="clearfix">
          <span class="row-col-left">数据脱敏执行过程</span>
          <el-button v-if="maskResultVisible" style="float: right; padding: 3px 0" type="text" v-on:click="gotoMaskResult">脱敏完成，查看已脱敏数据</el-button>
        </div>
        <div>
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item>
              <span>脱敏字段</span>
            </el-form-item>
            <el-form-item>
              <span>字段脱敏状态</span>
            </el-form-item>
          </el-form>
          <el-form v-for="(item, index) in selectFields" :key="index" :inline="true" class="demo-form-inline">
            <el-form-item>
            <span>{{item}}</span>
            </el-form-item>
            <el-form-item>
              <span>{{maskStatus[index]}}</span>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
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
      interval: '',
      maskProcessVisible: true,
      maskResultVisible: false,
      userFileId: 0,
      selectFields: [],
      maskStatus: []
    }
  },
  created () {
    this.loginStatus = this.$cookie.get('loginStatus')
    this.userValidate()
    this.getSelectFields()
  },
  methods: {
    userValidate () {
      if (this.loginStatus === null || this.loginStatus === 'logout') {
        this.$router.push({
          path: '/login'
        })
      }
    },
    getSelectFields () {
      this.$api.post(
        '/offline/processing',
        null,
        response => { // status
          if (response.status === 'success') {
            this.userFileId = response.userFileId
            this.selectFields = response.selectFields
            // 启动轮询函数， ms
            this.interval = setInterval(() => {
              this.getMaskStatus()
            }, 500)
          } else {
            this.$message({
              message: '未知错误！',
              type: 'error'
            })
            this.$router.push({
              path: '/offline'
            })
          }
        }
      )
    },
    getMaskStatus () {
      let userFileId = this.userFileId
      this.$api.post(
        '/offline/mask_status',
        {
          userFileId: userFileId
        },
        response => { // status, maskStatus
          if (response.status === 'success') {
            this.maskStatus = response.maskStatus
            // 调用方法判断是否所有的字段都已经完成脱敏
            this.judgeAllComplete()
          } else {
            this.$message({
              message: '轮询状态错误！',
              type: 'error'
            })
          }
        }
      )
    },
    judgeAllComplete () {
      let maskStatusList = this.maskStatus
      let allComplete = true
      let size = maskStatusList.length
      for (var index = 0; index < size; index++) {
        if (maskStatusList[index] === 'initialize' || maskStatusList[index] === 'processing') {
          allComplete = false
          break
        }
      }
      if (allComplete) {
        // 显示能够跳往 maskResult 界面的按钮。
        this.maskResultVisible = true
        // 停止轮询
        clearInterval(this.interval)
      }
    },
    gotoMaskResult () {
      this.$router.push({
        name: 'maskResult',
        params: {userFileId: this.userFileId}
      })
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
