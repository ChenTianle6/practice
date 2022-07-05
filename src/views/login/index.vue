<template>
  <div class="login-container">
    <el-form
      ref="LoginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
    >
      <div class="title-container">
        <h3 class="title">欢迎来到VueAdmin</h3>
      </div>
      <div>
        <span>用户名</span>
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" />
        </el-form-item>
      </div>
      <div class="title-input">
        <span>密码</span>
        <el-form-item prop="password">
          <el-input :type="inputType" v-model="loginForm.password"></el-input>
        </el-form-item>
      </div>
      <el-button
        class="login-button"
        type="primary"
        @click="handleLoginSubmit(LoginForm)"
        >提交</el-button
      >
    </el-form>
  </div>
</template>

<script setup>
import util from '../../utils/util'
import { useStore } from 'vuex'
import { reactive, ref } from 'vue'
import { validatePassword } from './rule'
import md5 from 'md5'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const inputType = ref('password')
const LoginForm = ref()
const loginForm = reactive({
  username: 'test',
  password: '123456'
})
const loginRules = reactive({
  username: [
    {
      required: true,
      trigger: 'blur',
      message: '用户名为必填项'
    }
  ],
  password: [
    {
      required: true,
      trigger: 'blur',
      validator: validatePassword
    }
  ]
})
// 登录方式
const handleLoginSubmit = async () => {
  if (!LoginForm.value) return
  await LoginForm.value.validate(async valid => {
    if (valid) {
      const newLoginForm = util.deepCopy(loginForm)
      newLoginForm.password = md5(newLoginForm.password)

      const response = await store.dispatch('user/login', newLoginForm)

      if (response.token) router.push('/')
    }
  })
}
</script>

<style scoped lang="scss">
.login-container {
  position: relative;
  height: 100%;
}
.login-form {
  width: 300px;
  padding: 0 80px;
  position: absolute;
  left: 50%;
  margin-left: -260px;
  top: 160px;
  overflow: hidden;
  ::v-deep .el-form-item {
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    height: 40px;
    line-height: 40px;
    outline: 0;
    margin-left: 20px;
  }
  ::v-deep .el-input {
    display: inline-block;
    height: 40px;
    width: 85%;
    .el-input__wrapper {
      background: transparent !important;
      box-shadow: none;
    }
    .el-input__wrapper.is-focus {
      box-shadow: none;
    }
    input {
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 8px 5px 12px 15px;
      height: 40px;
    }
  }
  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      text-align: center;
      font-weight: bold;
      margin-bottom: 40px;
    }
  }
  .login-button {
    width: 80px;
    height: 40px;
    margin-bottom: 30px;
  }
}
.title-input {
  margin-left: 17px;
}
</style>
