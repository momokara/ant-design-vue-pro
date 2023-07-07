<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="6" :sm="24">
              <a-form-item label="账号">
                <a-input v-model="queryParam.ip" placeholder="请输入"/>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="状态">
                <a-select v-model="queryParam.status" placeholder="请选择" default-value="0">
                  <a-select-option value="0">全部</a-select-option>
                  <a-select-option value="1">关闭</a-select-option>
                  <a-select-option value="2">运行中</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="loadData">搜索</a-button>
                <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="handleAdd">新增</a-button>
        <a-dropdown v-action:edit v-if="selectedRowKeys.length > 0">
          <a-menu slot="overlay">
            <a-menu-item key="1"><a-icon type="delete" />冻结</a-menu-item>
            <a-menu-item key="1"><a-icon type="delete" />解冻</a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px">
            批量操作 <a-icon type="down" />
          </a-button>
        </a-dropdown>
      </div>

      <s-table
        ref="table"
        size="default"
        rowKey="key"
        :columns="columns"
        :data="loadData"
        :alert="true"
        :rowSelection="rowSelection"
        showPagination="auto"
      >
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <span slot="status" slot-scope="text">
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
        </span>
        <span slot="description" slot-scope="text">
          <ellipsis :length="4" tooltip>{{ text }}</ellipsis>
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleDelete(record)">编辑</a>
            <a-divider type="vertical" />
            <a @click="handleDelete(record)">冻结</a>
          </template>
        </span>
      </s-table>

      <a-modal width="1200px" title="信息" :visible="visible" :footer="null" @cancel="() => { visible = false }">
        <a-spin :spinning="loading">
          <a-form-model
            ref="ruleForm"
            :model="form"
            :rules="rules"
          >
            <a-row :gutter="20" type="flex" justify="center">
              <a-col :md="12">
                <a-form-model-item ref="account" label="登录账号" prop="loginID" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <a-input :maxLength="18" v-model="form.loginID" @blur="() => { $refs.account.onFieldBlur() }"/>
                </a-form-model-item>
              </a-col>
              <a-col :md="9">
                <a-form-model-item ref="name" label="用户名称" prop="loginName" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <a-input :maxLength="25" v-model="form.loginName" @blur="() => { $refs.name.onFieldBlur() }"/>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="20" type="flex" justify="center">
              <a-col :md="12">
                <a-form-model-item ref="account" label="登录密码" prop="passWord" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <a-input :maxLength="18" type="password" v-model="form.passWord" @blur="() => { $refs.account.onFieldBlur() }"/>
                </a-form-model-item>
              </a-col>
              <a-col :md="9">
                <a-form-model-item ref="name" label="身份证号" prop="idCardNo" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <a-input :maxLength="18" v-model="form.idCardNo" @blur="() => { $refs.name.onFieldBlur() }"/>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="20" type="flex" justify="center">
              <a-col :md="12">
                <a-form-model-item label="是否警员" prop="isPolice" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <a-radio-group v-model="form.isPolice">
                    <a-radio value="1">
                      否
                    </a-radio>
                    <a-radio value="2">
                      是
                    </a-radio>
                  </a-radio-group>
                </a-form-model-item>
              </a-col>
              <a-col :md="9">
                <a-form-model-item ref="name" label="员工编号" prop="PersonNum" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <a-input :maxLength="18" v-model="form.PersonNum" @blur="() => { $refs.name.onFieldBlur() }"/>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="20" type="flex" justify="center">
              <a-col :md="12">
                <a-form-model-item label="账号有效期" prop="accountvalidto" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <a-date-picker
                    v-model="form.accountvalidto"
                    type="date"
                    style="width: 100%;"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :md="9">
                <a-form-model-item ref="name" label="密码有效期" prop="passwordexpiretime" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <a-input :maxLength="3" suffix="天" v-model="form.passwordexpiretime" @blur="() => { $refs.name.onFieldBlur() }"/>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="20" type="flex" justify="center">
              <a-col :md="12">
                <a-form-model-item ref="name" label="IP地址" prop="iplist" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <!-- <a-input :maxLength="18" v-model="form.iplist" @blur="() => { $refs.name.onFieldBlur() }"/> -->
                  <a-input-number v-model="value" :min="0" :max="255" />
                  -
                  <a-input-number v-model="value" :min="0" :max="255" />
                  -
                  <a-input-number v-model="value" :min="0" :max="255" />
                  -
                  <a-input-number v-model="value" :min="0" :max="255" />
                </a-form-model-item>
              </a-col>
              <a-col :md="9">
                <a-form-model-item ref="name" label="手机号" prop="phone" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <a-input :maxLength="18" v-model="form.phone" @blur="() => { $refs.name.onFieldBlur() }"/>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="20" type="flex" justify="center">
              <a-col :md="12">
                <a-form-model-item label="是否医院（可选）" prop="isPolice" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <a-radio-group v-model="form.isPolice">
                    <a-radio value="1">
                      否
                    </a-radio>
                    <a-radio value="2">
                      是
                    </a-radio>
                  </a-radio-group>
                </a-form-model-item>
              </a-col>
              <a-col :md="9">
                <a-form-model-item ref="name" label="角色" prop="roleId" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <a-select v-model="form.roleId">
                    <a-select-option :value="1">
                      审计管理
                    </a-select-option>
                    <a-select-option :value="2">
                      菜单管理
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-form-model-item :wrapperCol="{ span: 12, offset: 12 }">
              <a-button type="primary" @click="onSubmit">
                保存
              </a-button>
            </a-form-model-item>
          </a-form-model>
        </a-spin>
      </a-modal>
      <step-by-step-modal ref="modal" @ok="handleOk"/>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { getRoleList } from '@/api/manage'

import StepByStepModal from '../list/modules/StepByStepModal'
import CreateForm from '../list/modules/CreateForm'
import { request } from '@/utils/request'
// 表格数据
const columns = [
  {
    title: '#',
    scopedSlots: { customRender: 'serial' }
  },
  {
    title: 'ID',
    dataIndex: 'id'
  },
  {
    title: '账号',
    dataIndex: 'key'
  },
  {
    title: '角色',
    dataIndex: 'no'
  },
  {
    title: '注册时间',
    dataIndex: ''
  },
  {
    title: '状态',
    dataIndex: 'callNo'
  },
  {
    title: '有效时间',
    dataIndex: 'updatedAt'
  },
  {
    title: '白名单IP',
    dataIndex: 'status'
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '150px',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'Blacklist',
  components: {
      STable,
      Ellipsis,
      CreateForm,
      StepByStepModal
  },
  data () {
      this.columns = columns
      return {
        // create model
        visible: false,
        loading: false,
        confirmLoading: false,
        mdl: null,
        // 查询参数
        queryParam: {},
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
            const requestParameters = Object.assign({}, parameter, this.queryParam)
            console.log('loadData request parameters:', requestParameters)
            return request('GetRoleList', requestParameters)
            .then(res => {
              // this.columns = res.data.list
              const totalPage = Math.ceil(res.data.total / requestParameters.pageCount)
              const key = (requestParameters.pageindex - 1) * requestParameters.pageCount
              const next = (requestParameters.pageindex >= totalPage ? (res.data.total % requestParameters.pageCount) : requestParameters.pageCount) + 1
              res.data.totalPage = totalPage
              res.data.key = key
              res.data.next = next
              console.log(res, this.columns, 'is this')
              return Object.assign(res.data, requestParameters)
            })
        },
        selectedRowKeys: [],
        selectedRows: [],

        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
        other: '',
        form: {
          account: '',
          password: '',
          region: undefined,
          date1: undefined,
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        rules: {
          name: [
            { required: true, message: 'Please input Activity name', trigger: 'blur' },
            { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' }
          ],
          region: [{ required: true, message: 'Please select Activity zone', trigger: 'change' }],
          date1: [{ required: true, message: 'Please pick a date', trigger: 'change' }],
          type: [
            {
              type: 'array',
              required: true,
              message: 'Please select at least one activity type',
              trigger: 'change'
            }
          ],
          resource: [
            { required: true, message: 'Please select activity resource', trigger: 'change' }
          ],
          desc: [{ required: true, message: 'Please input activity form', trigger: 'blur' }]
        }
      }
  },
  created () {
    getRoleList({ t: new Date() })
  },
  computed: {
      rowSelection () {
      return {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
      }
      }
  },
  methods: {
    handleS () {
      this.mdl = null
      this.visible = true
    },
    handleAdd () {
      this.form = {}
      this.visible = true
    },
    handleOk () {
    const form = this.$refs.createModal.form
    this.confirmLoading = true
    form.validateFields((errors, values) => {
        if (!errors) {
        console.log('values', values)
        if (values.id > 0) {
            // 修改 e.g.
            new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve()
            }, 1000)
            }).then(res => {
            this.visible = false
            this.confirmLoading = false
            // 重置表单数据
            form.resetFields()
            // 刷新表格
            this.$refs.table.refresh()

            this.$message.info('修改成功')
            })
        } else {
            // 新增
            new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve()
            }, 1000)
            }).then(res => {
            this.visible = false
            this.confirmLoading = false
            // 重置表单数据
            form.resetFields()
            // 刷新表格
            this.$refs.table.refresh()

            this.$message.info('新增成功')
            })
        }
        } else {
        this.confirmLoading = false
        }
    })
    },
    handleCancel () {
    this.visible = false

    const form = this.$refs.createModal.form
    form.resetFields() // 清理表单数据（可不做）
    },
    // 移除
    handleDelete (record) {
      console.log(record, '移除')
      if (record.status !== 0) {
        this.$message.info(`${record.no} 移除成功`)
      } else {
        this.$message.error(`${record.no} 移除失败`)
      }
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      console.log(this.selectedRowKeys, this.selectedRows, '批量')
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    onSubmit () {
      console.log(this.form)
      request('Addadmin', this.form)
      .then(async (res) => {
          console.log(res, ` request result`)
          if (res.isSuccess) {
          } else {
            this.$notification['error']({
              message: '错误',
              description: res.message || '请求出现错误，请稍后再试',
              duration: 4
            })
          }
      })
      // this.$refs.ruleForm.validate(valid => {
      //   if (valid) {
      //     alert('submit!')
      //   } else {
      //     console.log('error submit!!')
      //     return false
      //   }
      // })
    }
  }
}
</script>
