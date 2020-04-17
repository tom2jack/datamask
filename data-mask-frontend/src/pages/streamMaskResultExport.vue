<template>
  <el-container>
    <el-header style="height: auto">
      <myHeader></myHeader>
    </el-header>
    <el-main class=" row-col-center">
      <el-card class="box-card" style="width: 60%">
        <div slot="header" class="clearfix">
          <span class="row-col-left">流数据脱敏结果导出</span>
        </div>
        <div>
          <el-form  v-show="!downLoadVisible" :inline="true" class="demo-form-inline">
            <el-form-item label="文件类型">
              <el-select v-model="fileType" placeholder="请选择导出的文件类型">
                <el-option label=".txt文件" value="txt"></el-option>
                <el-option label=".csv文件" value="csv"></el-option>
                <el-option label=".xls文件" value="xls"></el-option>
                <el-option label=".xlsx文件" value="xlsx"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="streamDataExportFile">导出文件</el-button>
            </el-form-item>
          </el-form>

          <el-form v-show="downLoadVisible" :inline="true" class="demo-form-inline">
            <el-form-item label="请点击链接下载">
              <a  :href="fileUrl" :download="fileName">{{fileName}}</a>
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
      userStreamId: null,
      fileType: null,
      userFileId: null,
      fileUrl: '',
      fileName: '',
      downLoadVisible: false
    }
  },
  created () {
    this.loginStatus = this.$cookie.get('loginStatus')
    this.userStreamId = this.$route.params.userStreamId
    this.userValidate()
  },
  methods: {
    userValidate () {
      if (this.loginStatus === null || this.loginStatus === 'logout') {
        this.$router.push({
          path: '/login'
        })
      }
    },
    streamDataExportFile () {
      if (this.fileType === null) {
        this.$alert('请选择导出文件类型', '警告', {
          confirmButtonText: '确定',
          callback: action => {
            this.$message({
              type: 'info',
              message: `action: ${action}`
            })
          }
        })
      }
      this.$api.post(
        '/stream/export_file',
        {
          userStreamId: this.userStreamId,
          fileType: this.fileType
        },
        response => { // status
          if (response.status === 'success') {
            this.fileUrl = response.fileUrl
            this.fileName = response.fileName
            this.downLoadVisible = true
          } else {
            this.$message({
              message: '数据导出出错！',
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
