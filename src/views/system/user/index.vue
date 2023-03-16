<template>
  <div class="table-box">
    <SimpleTable
      ref="simpleTable"
      title="用户列表"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" icon="plus" @click="openDialog('新增')">新增用户</el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" size="small" @click="openDialog('编辑', scope.row)">编辑</el-button>
        <el-button type="danger" size="small" @click="handleDelete">删除</el-button>
      </template>
    </SimpleTable>
  </div>
</template>

<script lang="tsx" setup>
import { userListApi } from '@/api/modules/user'
import { ColumnProps } from '@/components/SimpleTable/interface'
import { User } from '@/typings/api/modules/user'
import { useHandleData } from '@/hooks/useHandleData'

// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const simpleTable = ref()

// 初始化请求参数
const initParam = reactive({
  // dateRange: [],
})

const getTableList = (params: any) => {
  return userListApi(params)
}

// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 datalist && total && pageNum && pageSize 这些字段，那么你可以在这里进行处理成这些字段
const dataCallback = (data: any) => {
  console.log('dataCallback', data)
  return {
    datalist: data.data.list,
    total: data.data.page.total,
  }
}

// 表格配置项
const columns: ColumnProps[] = [
  { type: 'index', label: '#', width: 60 },
  { prop: 'username', label: '用户账号', search: { el: 'input' } },
  { prop: 'createBy', label: '创建人' },
  { prop: 'username', label: '用户昵称' },
  { prop: 'sex', label: '性别' },
  {
    prop: 'status',
    label: '用户状态',
    search: { el: 'select' },
    enum: [
      { label: '正常', value: 1 },
      { label: '停用', value: 0 },
    ],
    render: (scope: { row: User.ResUserList }) => {
      return (
        <>
          <el-switch
            model-value={scope.row.status}
            active-text={scope.row.status ? '启用' : '禁用'}
            active-value={1}
            inactive-value={0}
            onClick={() => changeStatus(scope.row)}
          />
        </>
      )
    },
  },
  {
    prop: 'createTime',
    label: '创建时间',
    search: {
      el: 'date-picker',
      span: 2,
      props: { type: 'daterange', valueFormat: 'YYYY-MM-DD' },
      defaultValue: ['2022-11-12 11:35:00', '2022-12-12 11:35:00'],
    },
  },

  { prop: 'operation', label: '操作', fixed: 'right', width: 200 },
]

// 删除用户信息
const handleDelete = async (row: User.ResUserList) => {
  await useHandleData('执行接口', { userId: row.userId, username: row.username }, `删除【${row.username}】角色`)
  simpleTable.value.getTableList()
}

// 切换用户状态
const changeStatus = async (row: User.ResUserList) => {
  await useHandleData(
    'api',
    { id: row.userId, username: row.username, status: row.status === 1 ? 0 : 1 },
    `切换【${row.username}】用户状态`,
  )
  simpleTable.value.getTableList()
}

// 打开 dialog(新增、查看、编辑)
const dialogRef = ref()
const openDialog = (title: string, rowData: Partial<User.ResUserList> = {}) => {
  let params = {
    title,
    rowData: { ...rowData },
    isView: title === '查看',
    api: title === '新增' ? '执行接口' : title === '编辑' ? '执行接口' : '',
    getTableList: simpleTable.value.getTableList,
  }
  dialogRef.value.acceptParams(params)
}
</script>

<style scoped></style>
