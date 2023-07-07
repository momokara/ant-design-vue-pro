<template>
  <page-header-wrapper>
    <a-card class="container" :bordered="false">
      <a-form-model :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
        <a-form-model-item label="高频访问">
          <a-input-group compact class="text_input">
            用户在单位时间内
            <a-col :md="2">
              <a-input-number v-model="form.frequencytimes" :min="1" :max="60" />
            </a-col>
            分钟内,连续登录次数超过
            <a-col :md="2">
              <a-input-number v-model="form.frequencycount" :min="1" :max="30" />
            </a-col>
            次,则视为高频访问
          </a-input-group>
        </a-form-model-item>

        <a-form-model-item label="账号过期">
          <a-input-group compact class="text_input">
            用户账号超过
            <a-col :md="2">
              <a-input-number v-model="form.accountexpiretimes" :min="1" :max="1500" />
            </a-col>
            天未登录，则视为长时间未使用
          </a-input-group>
        </a-form-model-item>

        <a-form-model-item label="密码过期">
          <a-input-group compact class="text_input">
            用户密码设置后超过
            <a-col :md="2">
              <a-input-number v-model="form.passwordexpiretimes" :min="1" :max="1500" />
            </a-col>
            天.将提示用户修改密码,才能再次进行业务操作
          </a-input-group>
        </a-form-model-item>

        <a-form-model-item label="登录限制">
          <a-input-group compact class="text_input">
            用户在规定时段
            <a-col :md="3">
              <a-time-picker v-model="form.allowloginstarttime" format="HH:mm" valueFormat="HH:mm" />
            </a-col>
            ~
            <a-col :md="3">
              <a-time-picker v-model="form.allowloginendtime" format="HH:mm" valueFormat="HH:mm" />
            </a-col>
            才允许登录
          </a-input-group>
        </a-form-model-item>

        <a-form-model-item label="用户鉴别">
          <a-input-group compact class="text_input">
            当用户鉴别失败
            <a-col :md="2">
              <a-input-number v-model="form.loginerrorcount" :min="1" :max="30" />
            </a-col>
            次,则登录账号将被锁定进行冻结
          </a-input-group>
        </a-form-model-item>

        <a-form-model-item label="终端鉴别 ">
          <a-input-group compact class="text_input">
            当终端鉴别失败
            <a-col :md="2">
              <a-input-number v-model="form.deviceloginerrorcount" :min="1" :max="30" />
            </a-col>
            次,则终端将被锁定进行冻结
          </a-input-group>
        </a-form-model-item>

        <a-form-model-item label="审计日志">
          <a-input-group compact class="text_input">
            存储期限
            <a-col :md="2">
              <a-input-number v-model="form.logsaveduration" :min="1" :max="10" />
            </a-col>
            年
          </a-input-group>
        </a-form-model-item>

        <a-form-model-item :wrapperCol="{ offset: 4 }">
          <a-button type="primary" html-type="submit" @click="handleSaved">保存</a-button>
        </a-form-model-item>
      </a-form-model>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { request } from '@/utils/request'

  export default {
    data () {
      return {
        form: {
          frequencytimes: 1,
          frequencycount: 1,
          accountexpiretimes: 1,
          passwordexpiretimes: 1,
          allowloginstarttime: '8:00',
          allowloginendtime: '23:00',
          loginerrorcount: 1,
          deviceloginerrorcount: 1,
          logsaveduration: 1
        }
      }
    },
    mounted () {
      this.getPolicy()
    },
    methods: {
      getPolicy () {
        request('GetSecuritypolicy')
        .then(res => {
          if (res.isSuccess) {
            this.form = res.data
          }
        })
      },
      handleSaved () {
        request('EditSecuritypolicy', this.form)
      }
    }
  }
</script>

<style lang="less" scoped>
.ant-form {
  font-size: 20px !important;
}
.text_input {
  display: flex !important;
  align-items: end;
  .ant-col {
    margin: auto 10px;
    padding-right: 0;
  }
}
.time_input {
  display: flex !important;
  align-items: end;
  .ant-col {
    margin: auto 10px;
    // padding-right: 0;
  }
}
</style>
