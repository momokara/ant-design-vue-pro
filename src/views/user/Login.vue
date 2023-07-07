<template>
  <div class="main">
    <a-form
      id="formLogin"
      class="user-layout-login"
      ref="formLogin"
      :form="form"
      @submit="handleSubmit"
    >
      <a-alert v-if="isLoginError" type="error" showIcon style="margin-bottom: 24px;" message="用户名或密码错误" />
      <a-form-item>
        <a-input
          size="large"
          type="text"
          placeholder="用户名"
          :maxLength="18"
          v-decorator="[
            'username',
            {rules: [{ required: true, message: '用户名不能为空' }, { validator: handleUsernameOrEmail }], validateTrigger: 'change'}
          ]"
        >
          <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input>
      </a-form-item>

      <a-form-item>
        <a-input-password
          size="large"
          placeholder="密码"
          :maxLength="18"
          v-decorator="[
            'password',
            {rules: [{ required: true, message: '密码不能为空' }], validateTrigger: 'blur'}
          ]"
        >
          <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input-password>
      </a-form-item>

      <a-form-item style="margin-top:24px">
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="login-button"
          :loading="state.loginBtn"
          :disabled="state.loginBtn"
        >登入</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import md5 from 'md5'
import { mapActions } from 'vuex'
import { request } from '@/utils/request'
import storage from 'store'
import { ACCESS_TOKEN, LOGIN_ID, USERINFO } from '@/store/mutation-types'

export default {
  data () {
    return {
      loginBtn: false,
      isLoginError: false,
      form: this.$form.createForm(this),
      state: {
        loginBtn: false
      }
    }
  },
  methods: {
    ...mapActions(['Login', 'Logout']),
    // 获取浏览器版本
    getBrowser () {
      const appVersion = window.navigator.userAgent.split(' ')
      const localVersion = appVersion.filter(item =>
        item.indexOf('edg') > -1 ||
        item.indexOf('Opera') > -1 ||
        item.indexOf('FireFox') > -1 ||
        item.indexOf('UBrowser') > -1 ||
        item.indexOf('QQBrowser') > -1 ||
        item.indexOf('2345Explorer') > -1 ||
        item.indexOf('Chrome') > -1 ||
        item.indexOf('Safari') > -1
      )
      return localVersion
    },
    // handler
    handleUsernameOrEmail (rule, value, callback) {
      const { state } = this
      const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
      if (regex.test(value)) {
        state.loginType = 0
      } else {
        state.loginType = 1
      }
      callback()
    },
    handleSubmit (e) {
      e.preventDefault()
      const {
        form: { validateFields },
        state
      } = this

      state.loginBtn = true

      const validateFieldsKey = ['username', 'password']

      validateFields(validateFieldsKey, { force: true }, async (err, values) => {
        if (!err) {
          console.log('login form', values)
          const loginParams = { ...values }
          loginParams.LoginID = loginParams.username
          loginParams.password = md5(values.password)
          loginParams.browser = (this.getBrowser())[0]
          loginParams.devicesystem = window.navigator.userAgentData.platform
          request('Login', loginParams)
          .then((res) => {
            this.loginSuccess(res, loginParams)
          })
          .finally(() => {
            state.loginBtn = false
          })
        } else {
          setTimeout(() => {
            state.loginBtn = false
          }, 600)
        }
      })
    },
    loginSuccess (res, loginParams) {
      console.log(res)
      const { loginSuccess } = this
      if (res.isSuccess) {
        storage.set(ACCESS_TOKEN, res.data.token, new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
        storage.set(LOGIN_ID, res.data.userinfo.userName)
        storage.set(USERINFO, res.data.userinfo)
        console.log(storage.get(ACCESS_TOKEN), storage.get(LOGIN_ID))
        this.$router.push({ path: '/' })
        this.isLoginError = false
      } else {
        if (res.data && res.data.code === 201) {
          this.$confirm({
            title: '信息?',
            content: res.message,
            okText: '强制下线',
            cancelText: '取消登录',
            onOk () {
              loginParams.Isforce = true
              request('Login', loginParams)
              .then((res) => {
                loginSuccess(res, loginParams)
              })
            },
            onCancel () {}
          })
        }
        // this.isLoginError = true
      }
    }
  }
}
</script>

<style lang="less" scoped>
.user-layout-login {
  label {
    font-size: 14px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }

    .register {
      float: right;
    }
  }
}
</style>
