<template>
  <el-container>
    <el-header style="height: auto">
      <myHeader></myHeader>
    </el-header>

    <el-main class=" row-col-center">
      <el-card v-show="loginVisible" class="box-card" style="width: 500px" element-loading-text="正在登陆中" element-loading-spinner="el-icon-loading">
        <div slot="header" class="clearfix">
          <span class="row-col-left">用户登录</span>
          <el-button style="float: right; padding: 3px 0" type="text" v-on:click="changeToRegister">还没账号，去注册</el-button>
        </div>
        <div>
          <el-form :model="loginForm" label-width="80px" size="small" :rules="rule" ref="loginForm" label-position="left" style="padding-top: 10%">
            <el-form-item label="用户名" prop="name">
              <el-input placeholder="请输入用户名" v-model="loginForm.name" clearable></el-input>
            </el-form-item>

            <el-form-item label="密码" prop="pwd">
              <!-- <input type="password" v-model="loginForm.pwd"> -->
              <el-input placeholder="请输入密码" type="password" v-model="loginForm.pwd" clearable v-on:keyup.enter.native="loginSubmit"></el-input>
            </el-form-item>

            <el-form-item size="medium" class="row-col-center">
              <!-- <button v-on:click="submit">登录</button> -->
              <el-button v-on:click="resetLogin">重置</el-button>
              <el-button type="primary" @click="loginSubmit">登录</el-button>
            </el-form-item>
          </el-form>
        </div>

        <!--<div class="demo-input-suffix" style="display: flex">
          <span style="min-width: 60px; line-height: 40px">用户名</span>
          <el-input style="width: 300px" v-model="loginForm.name" clearable></el-input>
        </div>-->
      </el-card>

      <el-card v-show="registerVisible" class="box-card" style="width: 500px" element-loading-text="正在注册中" element-loading-spinner="el-icon-loading">
        <div slot="header" class="clearfix">
          <span class="row-col-left">用户注册</span>
          <el-button style="float: right; padding: 3px 0" type="text" v-on:click="changeToLogin">已有账号，去登录</el-button>
        </div>
        <div>
          <el-form :model="registerForm" label-width="80px" size="small" :rules="rule" ref="registerForm" label-position="left" style="padding-top: 10%">
            <el-form-item label="用户名" prop="name">
              <el-input placeholder="请输入用户名" v-model="registerForm.name" clearable></el-input>
            </el-form-item>

            <el-form-item label="密码" prop="pwd">
              <!-- <input type="password" v-model="loginForm.pwd"> -->
              <el-input placeholder="请输入密码" type="password" v-model="registerForm.pwd" clearable v-on:keyup.enter.native="registerSubmit"></el-input>
            </el-form-item>

            <el-form-item label="确认密码" prop="newPwd">
              <!-- <input type="password" v-model="loginForm.pwd"> -->
              <el-input placeholder="请再次输入密码" type="password" v-model="registerForm.newPwd" clearable v-on:keyup.enter.native="registerSubmit"></el-input>
            </el-form-item>

            <el-form-item size="medium" class="row-col-center">
              <!-- <button v-on:click="submit">登录</button> -->
              <el-button v-on:click="resetRegister">重置</el-button>
              <el-button type="primary" @click="registerSubmit">注册</el-button>
            </el-form-item>
          </el-form>
        </div>

        <!--<div class="demo-input-suffix" style="display: flex">
          <span style="min-width: 60px; line-height: 40px">用户名</span>
          <el-input style="width: 300px" v-model="loginForm.name" clearable></el-input>
        </div>-->
      </el-card>

      <el-card v-show="logoutVisible" class="box-card" style="width: 500px">
        <div slot="header" class="clearfix">
          <span class="row-col-left">用户登出</span>
        </div>
        <div>
          <el-form :model="registerForm" label-width="80px" size="small" :rules="rule" ref="registerForm" label-position="left" style="padding-top: 10%">
            <h2>{{username}}</h2>
            <br/>
            <el-button type="primary" v-on:click="logoutSubmit">退出登录</el-button>
          </el-form>
        </div>

        <!--<div class="demo-input-suffix" style="display: flex">
          <span style="min-width: 60px; line-height: 40px">用户名</span>
          <el-input style="width: 300px" v-model="loginForm.name" clearable></el-input>
        </div>-->
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
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.registerForm.pwd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      loginVisible: true,
      registerVisible: false,
      logoutVisible: false,
      username: '',
      loginForm: {
        name: '',
        pwd: ''
      },
      registerForm: {
        name: '',
        pwd: '',
        newPwd: ''
      },
      rule: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        pwd: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        newPwd: [
          { required: true, message: '请再次输入密码进行确认', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    // this.$root.Bus.$emit('updateIndex', '/login')
    this.$cookie.set('updateIndex', '/login', 0.25)
    this.showLogout()
  },
  methods: {
    changeToRegister () {
      this.loginVisible = false
      this.registerVisible = true
      this.logoutVisible = false
    },
    changeToLogin () {
      this.loginVisible = true
      this.registerVisible = false
      this.logoutVisible = false
    },
    showLogout () {
      let loginStatus = this.$cookie.get('loginStatus')
      if (loginStatus === 'login') {
        this.loginVisible = false
        this.registerVisible = false
        this.logoutVisible = true
        this.username = this.$cookie.get('username')
      }
    },
    getMD5 (key) {
      var md5 = this.$crypto.createHash('md5')
      md5.update(key)
      var a = md5.digest('hex')
      return a
    },
    resetLogin () {
      this.$refs['loginForm'].resetFields()
    },
    resetRegister () {
      this.$refs['registerForm'].resetFields()
    },
    loginSubmit () {
      this.$refs['loginForm'].validate((valid) => {
        if (valid) {
          var pwd = this.getMD5(this.loginForm.pwd)

          this.$api.post(
            '/user/login',
            { // name, password
              name: this.loginForm.name,
              password: pwd
            },
            response => { // status, name
              if (response.status === 'success') {
                // this.$cookie.set('username', response.name, 0.25)
                this.$root.Bus.$emit('userName', response.name)
                this.$router.push({
                  path: '/'
                })
              } else if (response.status === 'passwordError') {
                this.$notify.error({
                  title: '错误',
                  message: '密码错误'
                })
              } else if (response.status === 'noUserFail') {
                this.$notify.error({
                  title: '错误',
                  message: '用户名不存在'
                })
              } else if (response.status === 'inputFail') {
                this.$notify.error({
                  title: '错误',
                  message: '用户名或密码为空'
                })
              } else {
                this.$notify.error({
                  title: '错误',
                  message: '未知错误'
                })
              }
            }
          )
        }
      })
    },
    registerSubmit () {
      this.$refs['registerForm'].validate((valid) => {
        if (valid) {
          var pwd = this.getMD5(this.registerForm.pwd)

          this.$api.post(
            '/user/register',
            { // name, password
              name: this.registerForm.name,
              password: pwd
            },
            response => { // status, name
              if (response.status === 'success') {
                this.resetRegister()
                this.loginVisible = true
                this.registerVisible = false
                this.logoutVisible = false
                var username = this.$cookie.get('username')
                // console.log('cookie username' + username)
                this.loginForm.name = username
                // this.$cookie.set('username', response.name, 0.25)
                /* this.$router.push({
                  path: '/login'
                }) */
              } else if (response.status === 'duplicateFail') {
                this.$notify.error({
                  title: '错误',
                  message: '注册的用户名已经存在'
                })
              } else if (response.status === 'inputFail') {
                this.$notify.error({
                  title: '错误',
                  message: '用户名或密码为空'
                })
              } else {
                this.$notify.error({
                  title: '错误',
                  message: '未知错误'
                })
              }
            }
          )
        }
      })
    },
    logoutSubmit () {
      this.$api.post(
        '/user/logout',
        null,
        response => { // status
          if (response.status === 'success') {
            this.$cookie.delete('username')
            // this.$cookie.delete('id')
            this.changeToLogin()
            this.$notify.success({
              title: '成功',
              message: '登出成功'
            })
            /* this.$router.push({
              path: '/login'
            }) */
          } else {
            this.$notify.error({
              title: '错误',
              message: '登出失败'
            })
          }
        }
      )
    }
  }
}
</script>

<style>
  /* 全局设置：禁用IE10和edge设置“密码显示”的功能 */
  input[type=password]::-ms-reveal { display: none; }
</style>

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
