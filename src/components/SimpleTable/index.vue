<template>
  <!-- 查询表单 card -->
  <SearchForm
    v-show="isShowSearch"
    :search="search"
    :reset="reset"
    :search-param="searchParam"
    :columns="searchColumns"
    :search-col="searchCol"
  />
  <!-- 表格内容 card -->
  <div class="card table">
    <!-- 表格头部 操作按钮 -->
    <div class="table-header">
      <div class="header-button-lf">
        <slot name="tableHeader"></slot>
      </div>
    </div>
    <!-- 表格主体 -->
    <el-table
      ref="tableRef"
      v-bind="$attrs"
      :data="tableData"
      :border="border"
      v-loading="loading"
      :header-cell-style="{ background: '#e1e1e1' }"
    >
      <!-- 默认插槽 -->
      <slot></slot>
      <template v-for="item in tableColumns" :key="item">
        <!-- selection || index -->
        <el-table-column
          v-if="item.type === 'selection' || item.type === 'index'"
          v-bind="item"
          :align="item.align ?? 'center'"
          :reserve-selection="item.type === 'selection'"
        >
        </el-table-column>

        <!-- expand 支持 tsx 语法 && 作用域插槽 (tsx > slot) -->
        <el-table-column v-if="item.type === 'expand'" v-slot="scope" v-bind="item" :align="item.align ?? 'center'">
          <component :is="item.render" v-if="item.render" :row="scope.row"> </component>
          <slot v-else :name="item.type" :row="scope.row"></slot>
        </el-table-column>

        <!-- other 循环递归 -->
        <TableColumn v-if="!item.type && item.prop && item.isShow" :column="item">
          <template v-for="slot in Object.keys($slots)" #[slot]="scope">
            <slot :name="slot" :row="scope.row"></slot>
          </template>
        </TableColumn>
      </template>
      <!-- 插入表格最后一行之后的插槽 -->
      <template #append>
        <slot name="append"> </slot>
      </template>
      <!-- 无数据 -->
      <template #empty>
        <div class="table-empty">
          <slot name="empty" v-if="tableData.length">
            <img src="@/assets/images/notData.png" alt="notData" />
            <div>暂无数据</div>
          </slot>
        </div>
      </template>
    </el-table>
    <!-- 分页组件 -->
    <Pagination
      v-if="pagination"
      :pageable="pageable"
      :handle-size-change="handleSizeChange"
      :handle-current-change="handleCurrentChange"
    />
  </div>
</template>

<script lang="ts" setup>
import { ElTable, TableProps } from 'element-plus'
import { ColumnProps } from '@/components/SimpleTable/interface'
import { BreakPoint } from '@/components/Grid/interface'
import { useTable } from '@/hooks/useTable'
import Pagination from './components/Pagination.vue'
import TableColumn from './components/TableColumn.vue'
import { handleProp } from '@/utils/util'

// 表格 DOM 元素
const tableRef = ref<InstanceType<typeof ElTable>>()

// 是否显示搜索模块
const isShowSearch = ref<boolean>(true)

interface ProTableProps extends Partial<Omit<TableProps<any>, 'data'>> {
  columns: ColumnProps[] // 列配置项
  requestApi: (params: any) => Promise<any> // 请求表格数据的api ==> 必传
  dataCallback?: (data: any) => any // 返回数据的回调函数，可以对数据进行处理 ==> 非必传
  title?: string // 表格标题，目前只在打印的时候用到 ==> 非必传
  pagination?: boolean // 是否需要分页组件 ==> 非必传（默认为true）
  initParam?: any // 初始化请求参数 ==> 非必传（默认为{}）
  border?: boolean // 是否带有纵向边框 ==> 非必传（默认为true）
  toolButton?: boolean // 是否显示表格功能按钮 ==> 非必传（默认为true）
  selectId?: string // 当表格数据多选时，所指定的 id ==> 非必传（默认为 id）
  searchCol?: number | Record<BreakPoint, number> // 表格搜索项 每列占比配置 ==> 非必传 { xs: 1, sm: 2, md: 2, lg: 3, xl: 4 }
}

// 接受父组件参数，配置默认值
const props = withDefaults(defineProps<ProTableProps>(), {
  columns: () => [],
  pagination: true,
  initParam: {},
  border: true,
  toolButton: true,
  selectId: 'id',
  searchCol: () => ({ xs: 1, sm: 2, md: 2, lg: 3, xl: 7 }),
})

// 表格操作 Hooks
const {
  tableData,
  pageable,
  loading,
  searchParam,
  searchInitParam,
  getTableList,
  search,
  reset,
  handleSizeChange,
  handleCurrentChange,
} = useTable(props.requestApi, props.initParam, props.pagination, props.dataCallback)

// 清空选中数据列表
const clearSelection = () => tableRef.value!.clearSelection()

// 监听页面 initParam 改化，重新获取表格数据
watch(
  () => props.initParam,
  () => {
    getTableList()
  },
  { deep: true },
)

// 接收 columns 并设置为响应式
const tableColumns = ref<ColumnProps[]>(props.columns)
// 定义 enumMap 存储 enum 值（避免异步请求无法格式化单元格内容 || 无法填充搜索下拉选择）
const enumMap = ref(new Map<string, { [key: string]: any }[]>())
provide('enumMap', enumMap)

// 扁平化 columns && 处理 tableColumns 数据
const flatColumnsFunc = (columns: ColumnProps[], flatArr: ColumnProps[] = []) => {
  columns.forEach(async (col: any) => {
    if (col._children?.length) flatArr.push(...flatColumnsFunc(col._children))
    flatArr.push(col)

    // 给每一项 column 添加 isShow && isFilterEnum 属性
    col.isShow = col.isShow ?? true
    col.isFilterEnum = col.isFilterEnum ?? true

    if (!col.enum) return
    // 如果当前 enum 为后台数据需要请求数据，则调用该请求接口，并存储到 enumMap
    // eslint-disable-next-line consistent-return
    if (typeof col.enum !== 'function') return enumMap.value.set(col.prop!, col.enum)
    const { data } = await col.enum()
    enumMap.value.set(col.prop!, data)
  })
  return flatArr.filter((item) => !item._children?.length)
}
// 扁平 columns
const flatColumns = ref<ColumnProps[]>()

flatColumns.value = flatColumnsFunc(tableColumns.value as any)

// 过滤需要搜索的配置项 && 处理搜索排序
const searchColumns = flatColumns.value
  .filter((item) => item.search?.el)
  .sort((a, b) => (b.search?.order ?? 0) - (a.search?.order ?? 0))

// 设置搜索表单的默认值
searchColumns.forEach((column) => {
  if (column.search?.defaultValue !== undefined && column.search?.defaultValue !== null) {
    searchInitParam.value[column.search.key ?? handleProp(column.prop!)] = column.search?.defaultValue
  }
})

// 列设置 ==> 过滤掉不需要设置显隐的列
// const colRef = ref()
// const colSetting = tableColumns.value!.filter((item) => {
//   return (
//     item.isShow &&
//     item.type !== 'selection' &&
//     item.type !== 'index' &&
//     item.type !== 'expand' &&
//     item.prop !== 'operation'
//   )
// })
// const openColSetting = () => {
//   colRef.value.openColSetting()
// }

// 暴露给父组件的参数和方法(外部需要什么，都可以从这里暴露出去)
defineExpose({ element: tableRef, tableData, pageable, getTableList, clearSelection, enumMap })
</script>

<style lang="scss" scoped></style>
