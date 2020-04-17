<template>
  <el-container>
    <el-header style="height: auto">
      <myHeader></myHeader>
    </el-header>
    <el-main class=" row-col-center">
      <el-card class="box-card" style="width: 80%">
        <div slot="header" class="clearfix">
          <span class="row-col-left">数据脱敏结果</span>
          <el-button v-show="enableExport" style="float: right; padding: 3px 0" type="text" v-on:click="gotoStreamMaskResultExport">导出脱敏结果</el-button>
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
      enableExport: true,
      fields: [],
      streamMaskedData: []
    }
  },
  created () {
    this.loginStatus = this.$cookie.get('loginStatus')
    this.userStreamId = this.$route.params.userStreamId
    this.userValidate()
    this.queryAllMaskedData()
  },
  methods: {
    userValidate () {
      if (this.loginStatus === null || this.loginStatus === 'logout') {
        this.$router.push({
          path: '/login'
        })
      }
    },
    queryAllMaskedData () {
      this.$api.post(
        '/stream/masked_data',
        {
          userStreamId: this.userStreamId
        },
        response => { // status
          if (response.status === 'success') {
            this.fields = response.fields
            this.streamMaskedData = response.streamMaskedData
            if (this.fields.length < 1) {
              this.enableExport = false
            }
          } else {
            this.$message({
              message: '查询所有脱敏后数据错误！',
              type: 'error'
            })
          }
        }
      )
    },
    gotoStreamMaskResultExport () {
      this.$router.push({
        name: 'streamMaskResultExport',
        params: {userStreamId: this.userStreamId}
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
