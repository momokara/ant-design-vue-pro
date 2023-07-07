<template>
  <page-header-wrapper>
    <a-card :title="`欢迎登录驾驶人自助拍照体检系统，当前登录人数: ${user.onlineNum}人`" :headStyle="{ background: '#1890ff', color: '#fff' }">
      <a-row>
        <a-col :span="12">
          <a-descriptions title="登录信息" :column="2">
            <a-descriptions-item label="当前用户状态">
              {{ user.account }}
            </a-descriptions-item>
            <a-descriptions-item label="当前登录终端">
              {{ user.ip }}
            </a-descriptions-item>
            <a-descriptions-item label="上次用户状态">
              {{ user.account }}
            </a-descriptions-item>
            <a-descriptions-item label="上次登录终端">
              {{ user.lastIP }}
            </a-descriptions-item>
            <a-descriptions-item label="用户有效期">
              {{ user.accountValidDays }} 天
            </a-descriptions-item>
            <a-descriptions-item label="密码有效期">
              {{ user.passWordValidDays }} 天
            </a-descriptions-item>
            <a-descriptions-item label="当前登录时间">
              {{ user.loginTime }}
            </a-descriptions-item>
            <a-descriptions-item label="上次登录时间">
              {{ user.lastLoginTime }}
            </a-descriptions-item>
          </a-descriptions>
        </a-col>
        <a-col :span="12">
          <a-descriptions title="用户状态" :column="2">
            <a-descriptions-item label="登录账号">
              {{ user.account }}
            </a-descriptions-item>
            <a-descriptions-item label="用户名称">
              {{ user.userName }}
            </a-descriptions-item>
            <a-descriptions-item label="身份证号">
              {{ user.idCardNo }}
            </a-descriptions-item>
            <a-descriptions-item label="联系电话">
              {{ user.phone }}
            </a-descriptions-item>
            <a-descriptions-item label="所属角色">
              {{ user.roleName }}
            </a-descriptions-item>
            <a-descriptions-item label="是否警员">
              {{ user.isPolice ? '是' : '否' }}
            </a-descriptions-item>
            <a-descriptions-item label="编号">
              {{ user.personNum }}
            </a-descriptions-item>
          </a-descriptions>
        </a-col>
      </a-row>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { mapState } from 'vuex'
import { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import { Radar } from '@/components'
import { USERINFO } from '@/store/mutation-types'
import storage from 'store'

export default {
  name: 'Workplace',
  components: {
    PageHeaderWrapper,
    Radar
  },
  data () {
    return {
      user: ''
    }
  },
  computed: {
    ...mapState({
      nickname: state => state.user.nickname,
      welcome: state => state.user.welcome
    }),
    currentUser () {
      return {
        name: 'Serati Ma',
        avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'
      }
    },
    userInfo () {
      return this.$store.getters.userInfo
    }
  },
  created () {
    this.user = storage.get(USERINFO)
  }
}
</script>

<style lang="less" scoped>
@import './Workplace.less';

</style>
