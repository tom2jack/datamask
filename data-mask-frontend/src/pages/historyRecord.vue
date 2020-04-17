<!--历史脱敏记录主页面-->
<template>
  <el-container>
    <el-header style="height: auto">
      <myHeader></myHeader>
    </el-header>

    <el-main class=" row-col-center">
      <el-card v-show="fileDataVisible" class="box-card" style="width: 70%">
        <div slot="header" class="clearfix">
          <span class="row-col-left">文件数据历史脱敏记录</span>
          <el-button style="float: right; padding: 0px 0" type="text" v-on:click="gotoStreamHistory">Kafka流数据历史脱敏记录</el-button>
        </div>
        <div>
          <el-table :data="fileDataRecords" stripe style="flex: inherit">
            <el-table-column prop="id" label="ID">
            </el-table-column>
            <el-table-column prop="tableName" label="数据库表名">
            </el-table-column>
            <el-table-column prop="fileName" label="原文件名">
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="150px">
              <template slot-scope="scope">
                <el-button @click="viewFileRecordData(scope.row.id)" type="primary" size="small" icon="el-icon-view">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>

      <el-card v-show="!fileDataVisible" class="box-card" style="width: 70%">
        <div slot="header" class="clearfix">
          <span class="row-col-left">Kafka流数据历史脱敏记录</span>
          <el-button style="float: right; padding: 0px 0" type="text" v-on:click="gotoFileHistory">文件数据历史脱敏记录</el-button>
        </div>
        <div>
          <el-table :data="streamDataRecords" stripe style="flex: inherit">
            <el-table-column prop="id" label="ID">
            </el-table-column>
            <el-table-column prop="collectionName" label="集合名">
            </el-table-column>
            <el-table-column prop="topic" label="Kafka Topic">
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="150px">
              <template slot-scope="scope">
                <el-button  @click="viewStreamRecordData(scope.row.id)" type="primary" size="small" icon="el-icon-view">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
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
      fileDataRecords: [],
      streamDataRecords: [],
      fileDataVisible: true
    }
  },
  created () {
    this.$cookie.set('updateIndex', '/history', 0.5)
    this.loginStatus = this.$cookie.get('loginStatus')
    this.userValidate()
    this.queryAllFileDataRecord()
    this.queryAllStreamDataRecord()
  },
  methods: {
    userValidate () {
      if (this.loginStatus === null || this.loginStatus === 'logout') {
        this.$router.push({
          path: '/login'
        })
      }
    },
    gotoStreamHistory () {
      this.fileDataVisible = false
    },
    gotoFileHistory () {
      this.fileDataVisible = true
    },
    queryAllFileDataRecord () {
      this.$api.post(
        '/history/file_data',
        null,
        response => {
          if (response.status === 'success') {
            this.fileDataRecords = response.fileDataRecords
          } else if (response.status === 'noUserFail') {
            this.$message({
              message: '用户处于非登录状态，请登录！',
              type: 'error'
            })
            this.loginStatus = this.$cookie.get('loginStatus')
            this.userValidate()
          } else {
            this.$message({
              message: '获取文件历史脱敏记录发生未知错误！',
              type: 'error'
            })
          }
        }
      )
    },
    queryAllStreamDataRecord () {
      this.$api.post(
        '/history/stream_data',
        null,
        response => {
          if (response.status === 'success') {
            this.streamDataRecords = response.streamDataRecords
          } else if (response.status === 'noUserFail') {
            this.$message({
              message: '用户处于非登录状态，请登录！',
              type: 'error'
            })
            this.loginStatus = this.$cookie.get('loginStatus')
            this.userValidate()
          } else {
            this.$message({
              message: '获取流历史脱敏记录发生未知错误！',
              type: 'error'
            })
          }
        }
      )
    },
    viewFileRecordData (id) {
      this.$router.push({
        name: 'maskResult',
        params: {userFileId: id}
      })
    },
    viewStreamRecordData (id) {
      this.$router.push({
        name: 'streamMaskResult',
        params: {userStreamId: id}
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
