<template>
  <el-container>
    <el-header style="height: auto">
      <myHeader></myHeader>
    </el-header>

    <el-main class=" row-col-center">
      <el-card v-show="fileUploadVisible" class="box-card" style="width: 70%">
        <div slot="header" class="clearfix">
          <span class="row-col-left">离线数据文件上传</span>
        </div>
        <div>
          <!--accept="text/plain,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"-->
          <!--:on-success="handleSuccess"-->
          <el-upload
            class="upload-demo"
            action="http://localhost:8080/offline/file"
            :before-upload="handleBeforeUpload">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传txt/csv/excel文件，且数据格式完整</div>
          </el-upload>
        </div>
      </el-card>

      <div v-show="maskConfigVisible" style="width: 80%">
        <el-card class="box-card" >
          <div slot="header" class="clearfix">
            <span class="row-col-left">数据脱敏配置</span>
          </div>
          <div>
            <el-form v-for="maskConfig in maskConfigs" :key="maskConfig.id" :inline="true" class="demo-form-inline">
              <el-form-item label="脱敏字段">
                <el-select v-model="maskConfig.selectField" placeholder="请选择脱敏字段">
                  <el-option
                    v-for="field in fields"
                    :key="field"
                    :lable="field"
                    :value="field">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="脱敏方法">
                <el-select v-on:change="maskMethodChange(maskConfig)" v-model="maskConfig.selectMethod" placeholder="请选择脱敏方法">
                  <el-option
                    v-for="maskMethod in maskMethods"
                    :key="maskMethod"
                    :lable="maskMethod"
                    :value="maskMethod">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="参数" >
                <el-input v-model="maskConfig.parameter"
                          :disabled="!maskConfig.showParameter" placeholder="请输入脱敏方法参数"></el-input>
              </el-form-item>
              <el-form-item >
                <span v-if="maskConfig.id!==maskConfigs.length">&emsp;&emsp;&emsp;</span>
                <el-button v-if="maskConfig.id===maskConfigs.length" type="primary" icon="el-icon-plus" circle @click="addMaskConfig"></el-button>
              </el-form-item>
            </el-form>

            <el-form>
              <el-form-item>
                <el-button type="primary" @click="dataMaskExecute">脱敏执行</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
        <br/>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="row-col-left">部分原始数据展示（不超过10条）</span>
          </div>
          <div>
            <el-table :data="subOriginDataList" stripe border style="width: 100%">
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
// import axios from '../utils/api'
export default {
  components: {
    myHeader
  },
  data () {
    return {
      fileList: [],
      fields: [],
      maskMethods: [],
      subOriginDataList: [],
      maskConfigVisible: false,
      fileUploadVisible: true,
      loginStatus: '',
      maskConfigs: [{
        id: 1,
        showParameter: false,
        selectField: '',
        selectMethod: '',
        parameter: ''
      }],
      maskConfig: {
        selectField: '',
        selectMethod: '',
        parameter: ''
      }
    }
  },
  created () {
    // this.$root.Bus.$emit('updateIndex', '/offline')
    this.$cookie.set('updateIndex', '/offline', 0.25)
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
    },
    handleBeforeUpload (file) {
      let param = new FormData() // 创建form对象
      param.append('file', file) // file对象是 beforeUpload参数
      /* let config = {
        headers: {'Content-Type': 'multipart/form-data'}
      } */
      this.$api.post(
        '/offline/file',
        param,
        response => { // status
          if (response.status === 'success') {
            this.fields = response.fields
            this.maskMethods = response.maskMethods
            this.subOriginDataList = response.subOriginDataList
            this.maskConfigVisible = true
            this.fileUploadVisible = false
          } else if (response.status === 'noUserFail') {
            this.$message({
              message: '用户处于非登录状态，请登录！',
              type: 'error'
            })
            this.loginStatus = this.$cookie.get('loginStatus')
            this.userValidate()
          } else {
            this.$message({
              message: '文件数据解析失败！',
              type: 'error'
            })
          }
        }
      )
      // 添加请求头
      /* axios.post('http://localhost:8080/offline/file', param, config)
        .then(response => {
          if (response.status === 'success') {
            this.fields = response.fields
            this.maskMethods = response.maskMethods
            this.maskConfigVisible = true
            this.fileUploadVisible = false
          } else {
            this.$message({
              message: '文件数据解析失败！',
              type: 'info'
            })
          }
        }) */
      return false
    },
    /* handleSuccess (res) {
      if (res.status === 'success') {
        this.fields = res.fields
        this.maskMethods = res.maskMethods
        this.maskConfigVisible = true
        this.fileUploadVisible = false
      } else {
        this.$message({
          message: '文件数据解析失败！',
          type: 'info'
        })
      }
    }, */
    maskMethodChange (maskConfig) {
      let selectMethod = maskConfig.selectMethod
      if (selectMethod === '可逆置换-凯撒' ||
        selectMethod === '可逆置换-栅栏' ||
        selectMethod === '差分隐私' || selectMethod === 'k匿名') {
        maskConfig.showParameter = true
      } else {
        maskConfig.showParameter = false
      }
    },
    addMaskConfig () { // 点击页面上增加配置栏的按钮，执行这个方法
      var id = this.maskConfigs.length + 1
      this.maskConfigs.push(
        {
          id: id,
          showParameter: false,
          selectField: '',
          selectMethod: '',
          parameter: ''
        }
      )
    },
    dataMaskExecute () { // 脱敏执行按钮执行的方法
      let maskConfigList = []
      for (var index = 0; index < this.maskConfigs.length; index++) {
        maskConfigList.push({
          selectField: this.maskConfigs[index].selectField,
          selectMethod: this.maskConfigs[index].selectMethod,
          parameter: this.maskConfigs[index].parameter
        })
      }
      this.$api.post(
        '/offline/masking',
        {
          maskConfigs: maskConfigList
        },
        response => { // status
          if (response.status === 'success') {
            this.$message({
              message: '成功提交脱敏配置，后台正在对数据进行脱敏。',
              type: 'success'
            })
            // 成功的话，表示已经启动后台的脱敏执行异步线程，前台转到 脱敏执行过程展示页面 /masking。
            this.$router.push({
              path: '/masking'
            })
          } else if (response.status === 'noMaskConfig') {
            this.$message({
              message: '正确的脱敏配置为空，请重新配置！',
              type: 'error'
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
              message: '未知错误！',
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
