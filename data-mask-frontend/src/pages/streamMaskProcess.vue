<!--流数据脱敏过程展示界面-->
<template>
  <el-container>
    <el-header style="height: auto">
      <myHeader></myHeader>
    </el-header>

    <el-main>
      <div class="row-col-center">
        <el-card class="box-card" style="width: 65%">
          <div slot="header" class="clearfix">
            <span class="row-col-left">实时流数据脱敏执行过程</span>
            <el-button style="float: right; padding: 0px 0" type="text" v-on:click="stopConsume">停止流数据消费</el-button>
          </div>
          <div>
            <div class="row-col-left">
              <el-form :inline="true" class="demo-form-inline">
                <span>&emsp;</span>
                <el-form-item label="topic" >
                  <el-input v-model="topic" :disabled="true"></el-input>
                </el-form-item>
              </el-form>
            </div>
            <div class="row-col-left">
              <el-form v-for="partitionOffsets in partitionStatus" :key="partitionOffsets.partition" :inline="true" class="demo-form-inline">
                <el-form-item label="partition">
                  <el-input v-model="partitionOffsets.partition" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="start offset">
                  <el-input v-model="partitionOffsets.startOffset" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="end offset" >
                  <el-input v-model="partitionOffsets.endOffset" :disabled="true"></el-input>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-card>
      </div>
      <br/>
      <div class=" row-col-center">
        <el-card class="box-card" style="width: 65%">
          <div slot="header" class="clearfix">
            <span class="row-col-left">最新脱敏结果数据展示（不超过10条）</span>
            <el-button style="float: right; padding: 3px 0" type="text" v-on:click="queryNewestMaskedData">刷新结果列表</el-button>
          </div>
          <div>
            <el-table :data="streamMaskedData" stripe border style="width: 100%">
              <el-table-column v-for="(item, index) in fields" :key="index" :label="item">
                <template slot-scope="scope">
                  <span>{{scope.row[index]}}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </div>
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
      userStreamId: null,
      interval: null,
      intervalOffset: null,
      topic: '',
      collectionName: '',
      fields: [],
      streamMaskedData: [],
      partitionStatus: [{
        partition: 0,
        startOffset: 0,
        endOffset: 0
      }]
    }
  },
  created () {
    this.loginStatus = this.$cookie.get('loginStatus')
    this.userStreamId = this.$route.params.userStreamId
    this.userValidate()
    this.queryUserStreamInfo()
    // 启动轮询函数查询数据库中最新的partition offset值 10s
    this.intervalOffset = setInterval(() => {
      this.queryStreamMaskStatus()
    }, 10000)
  },
  beforeDestroy () {
    if (this.interval) {
      clearInterval(this.interval)
    }
    if (this.intervalOffset) {
      clearInterval(this.intervalOffset)
    }
    this.stopConsume()
  },
  methods: {
    userValidate () {
      if (this.loginStatus === null || this.loginStatus === 'logout') {
        this.$router.push({
          path: '/login'
        })
      }
    },
    queryStreamMaskStatus () {
      this.$api.post(
        '/stream/partition_offset',
        {
          userStreamId: this.userStreamId
        },
        response => {
          if (response.status === 'success') {
            let partitionOffsets = response.partitionStatus
            if (partitionOffsets.length > 0) {
              this.partitionStatus = partitionOffsets
            }
          } else {
            this.$message({
              message: '查询集合名发生未知错误！',
              type: 'error'
            })
          }
        }
      )
    },
    queryUserStreamInfo () {
      this.$api.post(
        '/stream/stream_info',
        {
          userStreamId: this.userStreamId
        },
        response => {
          if (response.status === 'success') {
            this.topic = response.topic
            this.collectionName = response.collectionName
            // 启动轮询函数拿到字段值， ms
            this.interval = setInterval(() => {
              this.queryNewestMaskedData()
            }, 3000)
          } else {
            this.$message({
              message: '查询集合名发生未知错误！',
              type: 'error'
            })
          }
        }
      )
    },
    queryNewestMaskedData () {
      this.$api.post(
        '/stream/newest_masked_data',
        {
          collectionName: this.collectionName
        },
        response => {
          if (response.status === 'success') {
            this.fields = response.fields
            this.streamMaskedData = response.streamMaskedData
            // console.log('length' + this.fields.length)
            if (this.fields.length > 0) {
              // 如果拿到字段值，则停止轮询
              clearInterval(this.interval)
            }
          } else {
            this.$message({
              message: '轮询最新脱敏结果错误！',
              type: 'error'
            })
          }
        }
      )
    },
    stopConsume () {
      this.$api.post(
        '/stream/stop_consume',
        null,
        response => {
          if (response.status === 'success') {
            if (this.intervalOffset) {
              clearInterval(this.intervalOffset)
            }
            // 自动跳转到流数据脱敏结果展示页面
            this.$router.push({
              name: 'streamMaskResult',
              params: {userStreamId: this.userStreamId}
            })
          } else if (response.status === 'noUserFail') {
            this.$message({
              message: '用户处于非登录状态，请登录！',
              type: 'error'
            })
            this.loginStatus = this.$cookie.get('loginStatus')
            this.userValidate()
          } else {
            this.$message({
              message: '停止系统消费监听发生未知错误！',
              type: 'error'
            })
          }
        }
      )
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
