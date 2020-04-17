<template>
  <el-container>
    <el-header style="height: auto">
      <myHeader></myHeader>
    </el-header>

    <el-main>
      <div class=" row-col-center">
        <el-card class="box-card" style="width: 65%" >
          <div slot="header" class="clearfix">
            <span class="row-col-left">Kafka 消费者参数配置</span>
          </div>
          <div>
            <el-form>
              <el-form-item label="Kafka 集群地址">
                <el-col :span="12">
                  <el-input v-model="brokers" placeholder="kafka集群地址（多个用英文逗号分隔）"></el-input>
                </el-col>
              </el-form-item>
              <el-form-item label="消息 topic 名字">
                <el-col :span="12">
                  <el-input v-model="topic" placeholder="消费的topic"></el-input>
                </el-col>
              </el-form-item>
              <el-form-item label="消费者 group名" >
                <el-col :span="12">
                  <el-input v-model="group" placeholder="消费者组名"></el-input>
                </el-col>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </div>
      <br/>
      <div class=" row-col-center">
        <el-card class="box-card" style="width: 65%">
          <div slot="header" class="clearfix">
            <span class="row-col-left">数据脱敏参数配置</span>
          </div>
          <div>
            <el-form v-for="maskConfig in maskConfigs" :key="maskConfig.id" :inline="true" class="demo-form-inline">
              <el-form-item label="脱敏字段">
                <el-input v-model="maskConfig.selectField"
                          placeholder="请输入脱敏字段"></el-input>
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
          </div>
        </el-card>
      </div>
      <br/>
      <el-form>
        <el-form-item>
          <el-button type="primary" @click="streamDataMaskExecute">脱敏执行</el-button>
        </el-form-item>
      </el-form>
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
      brokers: 'localhost:9092',
      topic: 'testInfo',
      group: 'group1',
      userStreamId: '',
      maskMethods: [],
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
    this.$cookie.set('updateIndex', '/stream', 0.25)
    this.loginStatus = this.$cookie.get('loginStatus')
    this.userValidate()
    this.queryMaskMethods()
  },
  methods: {
    userValidate () {
      if (this.loginStatus === null || this.loginStatus === 'logout') {
        this.$router.push({
          path: '/login'
        })
      }
    },
    queryMaskMethods () {
      // 请求所有脱敏方法服务接口
      this.$api.post(
        '/stream/mask_methods',
        null,
        response => {
          if (response.status === 'success') {
            this.maskMethods = response.maskMethods
          } else if (response.status === 'noUserFail') {
            this.$message({
              message: '用户处于非登录状态，请登录！',
              type: 'error'
            })
            this.loginStatus = this.$cookie.get('loginStatus')
            this.userValidate()
          } else {
            this.$message({
              message: '请求脱敏方法列表失败！',
              type: 'error'
            })
          }
        }
      )
    },
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
    streamDataMaskExecute () {
      let maskConfigList = []
      for (var index = 0; index < this.maskConfigs.length; index++) {
        maskConfigList.push({
          selectField: this.maskConfigs[index].selectField,
          selectMethod: this.maskConfigs[index].selectMethod,
          parameter: this.maskConfigs[index].parameter
        })
      }
      this.$api.post(
        '/stream/config',
        {
          brokers: this.brokers,
          topic: this.topic,
          group: this.group,
          maskConfigs: maskConfigList
        },
        response => {
          if (response.status === 'success') {
            this.userStreamId = response.userStreamId
            this.$router.push({
              name: 'streamMaskProcess',
              params: {userStreamId: this.userStreamId}
            })
          } else if (response.status === 'noUserFail') {
            this.$message({
              message: '用户处于非登录状态，请登录！',
              type: 'error'
            })
            this.loginStatus = this.$cookie.get('loginStatus')
            this.userValidate()
          } else if (response.status === 'propertiesError') {
            this.$message({
              message: 'Kafka消费者brokers配置不正确！',
              type: 'error'
            })
          } else if (response.status === 'noTopic') {
            this.$message({
              message: 'Kafka消费者topic配置不正确！',
              type: 'error'
            })
          } else if (response.status === 'encryptionError') {
            this.$message({
              message: '脱敏方法出错！',
              type: 'error'
            })
          } else {
            this.$message({
              message: '流数据参数配置失败！',
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
