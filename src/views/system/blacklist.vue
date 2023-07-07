<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="6" :sm="24">
              <a-form-item label="终端IP">
                <a-input v-model="queryParam.ip" placeholder="请输入"/>
              </a-form-item>
            </a-col>

            <template>
              <a-col :md="6" :sm="24">
                <a-form-item label="账号">
                  <a-input v-model="queryParam.account" placeholder="请输入"/>
                </a-form-item>
              </a-col>
            </template>

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
            <a-menu-item key="1"><a-icon type="delete" />删除</a-menu-item>
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
            <a @click="handleDelete(record)">移除</a>
          </template>
        </span>
      </s-table>

      <a-modal
        title="新增黑名单"
        :width="640"
        :visible="visible"
        :confirmLoading="loading"
        @ok="() => { $emit('ok') }"
        @cancel="() => { visible = false }"
      >
        <a-spin :spinning="loading">
          <a-form-model :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
            <a-form-model-item label="终端IP">
              <a-input :maxLength="18" v-model="form.ip" @blur="() => { $refs.account.onFieldBlur() }"/>
            </a-form-model-item>
            <a-form-model-item label="原因">
              <a-textarea v-model="form.reason" :auto-size="{ minRows: 3, maxRows: 5 }" />
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
import { getRoleList, getServiceList } from '@/api/manage'

import StepByStepModal from '../list/modules/StepByStepModal'
import CreateForm from '../list/modules/CreateForm'

const columns = [
{
    title: '#',
    scopedSlots: { customRender: 'serial' }
},
{
    title: '终端IP',
    dataIndex: 'no'
},
{
    title: '登录账号',
    dataIndex: 'id'
},
{
    title: '原因',
    dataIndex: 'description',
    scopedSlots: { customRender: 'description' }
},
{
    title: '操作时间',
    dataIndex: 'updatedAt'
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
            return getServiceList(requestParameters)
            .then(res => {
                return res.result
            })
        },
        selectedRowKeys: [],
        selectedRows: [],
        form: {
          ip: '',
          reason: ''
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
      this.mdl = null
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
    }
  }
}
</script>
