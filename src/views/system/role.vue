<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="6" :sm="24">
              <a-form-item label="角色名">
                <a-input v-model="queryParam.roleName" placeholder="请输入"/>
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
        rowKey="id"
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
            <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical" />
            <a @click="handleDelete(record)">删除</a>
          </template>
        </span>
      </s-table>

      <a-modal
        ref="form"
        title="角色信息"
        :width="1200"
        :visible="visible"
        :confirmLoading="loading"
        @ok="handleOk"
        @cancel="() => { visible = false }"
      >
        <a-spin :spinning="loading">
          <a-form-model :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
            <a-form-model-item required label="角色名称">
              <a-input :maxLength="18" v-model="form.roleName" @blur="() => { $refs.roleName.onFieldBlur() }"/>
            </a-form-model-item>
            <a-form-model-item label="备注">
              <a-textarea v-model="form.remark" :auto-size="{ minRows: 5, maxRows: 8 }" />
            </a-form-model-item>
            <a-form-model-item>
              <a-row v-for="item of permission" :key="item.id" :style="{ borderBottom: '1px solid #e9e9e9' }">
                <a-col :span="5">
                  <a-checkbox :indeterminate="item.indeterminate" :checked="item.checked" @change="onCheckAllChange(item)">
                    {{ item.title }}
                  </a-checkbox>
                </a-col>
                <a-col :span="19">
                  <a-checkbox v-for="child of item.children" :key="child.value" :checked="child.defaultCheck" @change="onChangeChecked(item.id, child.value)">
                    {{ child.title }}
                  </a-checkbox>
                </a-col>
              </a-row>
            </a-form-model-item>
          </a-form-model>
        </a-spin>
      </a-modal>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable, Ellipsis } from '@/components'
// import { getRoleList } from '@/api/manage'
import { request } from '@/utils/request'

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
  title: '角色名',
  dataIndex: 'name'
},
{
  title: '创建时间',
  dataIndex: 'createTime'
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
      Ellipsis
  },
  data () {
      this.columns = columns
      return {
        permission: [
        {
          id: 1,
          title: '系统管理',
          checked: false,
          indeterminate: false,
          children: [
            {
              value: 11,
              title: '后台管理员',
              defaultCheck: false
            },
            {
              value: 12,
              title: '角色管理',
              defaultCheck: false
            },
            {
              value: 13,
              title: '安全策略设置',
              defaultCheck: false
            },
            {
              value: 14,
              title: '黑名单设置',
              defaultCheck: false
            }
          ]
        },
        {
          id: 2,
          title: '系统管理',
          checked: false,
          indeterminate: false,
          children: [
            {
              value: 21,
              title: '后台管理员',
              defaultCheck: false
            },
            {
              value: 22,
              title: '角色管理',
              defaultCheck: false
            },
            {
              value: 23,
              title: '安全策略设置',
              defaultCheck: false
            },
            {
              value: 24,
              title: '黑名单设置',
              defaultCheck: false
            }
          ]
        },
        {
          id: 3,
          title: '系统管理',
          checked: false,
          indeterminate: false,
          children: [
            {
              value: 31,
              title: '后台管理员',
              defaultCheck: false
            },
            {
              value: 32,
              title: '角色管理',
              defaultCheck: false
            },
            {
              value: 33,
              title: '安全策略设置',
              defaultCheck: false
            },
            {
              value: 34,
              title: '黑名单设置',
              defaultCheck: false
            }
          ]
        },
        {
          id: 4,
          title: '系统管理',
          checked: false,
          indeterminate: false,
          children: [
            {
              value: 41,
              title: '后台管理员',
              defaultCheck: false
            },
            {
              value: 42,
              title: '角色管理',
              defaultCheck: false
            },
            {
              value: 43,
              title: '安全策略设置',
              defaultCheck: false
            },
            {
              value: 44,
              title: '黑名单设置',
              defaultCheck: false
            }
          ]
        }
        ],
        checkedList: [],
        // create model
        visible: false,
        loading: false,
        confirmLoading: false,
        form: {
          name: '',
          createTime: ''
        },
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
        selectedRows: []
      }
  },
  created () {
    // getRoleList({ t: new Date() })
  },
  computed: {
      rowSelection () {
      return {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
      }
      }
  },
  // eslint-disable-next-line no-dupe-keys
  // created () {
  // },
  methods: {
    handleEdit (item) {
      console.log(item, 'haedit')
      this.form = item
      this.form.roleName = item.name
      this.visible = true
      this.getPermission(item.id)
    },
    handleAdd () {
      this.form = {}
      this.visible = true
      this.getPermission()
    },
    async getPermission (id) {
      const res = await request('GetMenuRole', { roleID: id || 0 })
      if (res.isSuccess) {
        this.permission = res.data.menu
        if (id > 0) {
          this.checkedList = []
          for (const parent of res.data.menu) {
            if (parent.checked) {
              this.checkedList.push(parent.id)
              for (const child of parent.children) {
                this.checkedList.push(child.value)
              }
            } else if (parent.children.length > 0) {
              console.log(parent)
              for (const child of parent.children) {
                if (child.defaultCheck) {
                  this.checkedList.push(child.value)
                }
              }
            }
          }
        }
      } else {
        this.permission = []
      }
    },
    // 权限单选
    onChangeChecked (itemID, childID) {
      console.log(this.checkedList, itemID, childID, this.checkedList.includes(childID), this.checkedList.indexOf(childID), 'onChangeChecked')
      this.checkedList.includes(childID) ? this.checkedList.splice(this.checkedList.indexOf(childID), 1) : this.checkedList.push(childID)
      for (var parent of this.permission) {
        if (parent.id === itemID) {
          console.log(this.checkedList, 'is this')
          const checkedList = parent.children.filter(
            childItem => this.checkedList.some(
              checked => checked === childItem.value
          )).length
          console.log(checkedList, 'what happened')
          parent.indeterminate = checkedList > 0 && checkedList !== parent.children.length
          parent.checked = checkedList === parent.children.length
          for (var child of parent.children) {
            if (child.value === childID) {
              child.defaultCheck = !child.defaultCheck
            }
          }
        }
      }

      console.log(this.checkedList, this.permission)
    },
    // 权限全选
    onCheckAllChange (e) {
      for (var i of this.permission) {
        if (i.id === e.id) {
          const children = i.children.map(item => item.value)
          i.checked = !i.checked
          i.indeterminate = false
          if (i.checked) {
            this.checkedList = this.checkedList.concat(children, [i.id])
            i.children.map(j => (j.defaultCheck = true))
          } else {
            this.checkedList = this.checkedList.filter(
              item => !children.includes(item) && item !== i.id
            )
            i.children.map(j => (j.defaultCheck = false))
          }
        }
      }
      console.log(this.checkedList)
    },
    handleOk () {
      const form = this.form
      form.menuidList = this.checkedList
      console.log('values', form)
      this.confirmLoading = true
      if (form.roleName && form.menuidList) {
          if (form.id > 0) {
              // 修改 e.g.
              request('EditRole', form)
              .then(res => {
                this.visible = false
                this.confirmLoading = false
                // 重置表单数据
                // form.resetFields()
                // 刷新表格
                this.$refs.table.refresh()
                this.$message.info('修改成功')
              })
          } else {
              // 新增
              request('AddRole', form)
              .then(res => {
                this.visible = false
                this.confirmLoading = false
                // 重置表单数据
                // this.$refs.form.resetFields()
                // 刷新表格
                this.$refs.table.refresh()
                this.$message.info('新增成功')
              })
          }
      } else {
        this.$notification.error({
          message: '提示',
          description: '不能有空值'
        })
        this.confirmLoading = false
      }
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
