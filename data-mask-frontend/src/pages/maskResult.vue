<!--脱敏结果展示页面-->
<template>
  <el-container>
    <el-header style="height: auto">
      <myHeader></myHeader>
    </el-header>

    <el-main class=" row-col-center">
      <el-card class="box-card" style="width: 80%">
        <div slot="header" class="clearfix">
          <span class="row-col-left">数据脱敏结果</span>
          <el-button style="float: right; padding: 3px 0" type="text" v-on:click="gotoMaskResultExport">导出脱敏结果</el-button>
        </div>
        <div>
          <el-table :data="maskedData" stripe border style="width: 100%">
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
      userFileId: 0,
      fields: [],
      maskedData: []
    }
  },
  created () {
    this.loginStatus = this.$cookie.get('loginStatus')
    this.userFileId = this.$route.params.userFileId
    this.userValidate()
    this.allMaskedData()
  },
  methods: {
    userValidate () {
      if (this.loginStatus === null || this.loginStatus === 'logout') {
        this.$router.push({
          path: '/login'
        })
      }
    },
    allMaskedData () {
      this.$api.post(
        '/offline/masked_data',
        {
          userFileId: this.userFileId
        },
        response => { // status
          if (response.status === 'success') {
            this.userFileId = response.userFileId
            this.fields = response.fields
            this.maskedData = response.maskedData
          } else {
            this.$message({
              message: '查询所有脱敏后数据错误！',
              type: 'error'
            })
          }
        }
      )
    },
    gotoMaskResultExport () {
      this.$router.push({
        name: 'maskResultExport',
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
