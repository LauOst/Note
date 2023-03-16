<template>
  <component
    v-if="column.search?.el"
    :is="`schema-form-${column.search.el}`"
    v-bind="column.search.props"
    v-model="searchParam[column.search.key ?? handleProp(column.prop)]"
    :data="column.search?.el === 'tree-select' ? columnEnum : []"
    :options="column.search?.el === 'cascader' || 'select' ? columnEnum : []"
    :placeholder="placeholder(column)"
    :clearable="clearable(column)"
    range-separator="至"
    start-placeholder="开始时间"
    end-placeholder="结束时间"
  >
    <template #default="{ data }" v-if="column.search.el === 'cascader'">
      <span>{{ data[fieldNames().label] }}</span>
    </template>
    <!--    <template v-if="column.search.el === 'select'">-->
    <!--      <component-->
    <!--        :is="`el-option`"-->
    <!--        v-for="(col, index) in columnEnum"-->
    <!--        :key="index"-->
    <!--        :label="col[fieldNames().label]"-->
    <!--        :value="col[fieldNames().value]"-->
    <!--      ></component>-->
    <!--    </template>-->
    <slot></slot>
  </component>
</template>

<script lang="ts">
import modules from '../modules'

export default defineComponent({
  components: { ...modules },
})
</script>
<script lang="ts" setup name="searchFormItem">
import { handleProp } from '@/utils/util'
import { ColumnProps } from '@/components/SimpleTable/interface'

interface SearchFormItem {
  column: ColumnProps // 具体每一个搜索项的配置
  searchParam: { [key: string]: any } // 搜索参数
}
const props = defineProps<SearchFormItem>()

// 接受 enumMap
const enumMap = inject('enumMap', ref(new Map()))

const columnEnum = computed(() => {
  if (!enumMap.value.get(props.column.prop)) return []
  return enumMap.value.get(props.column.prop)
})

// 判断 fieldNames 设置 label && value 的 key 值
const fieldNames = () => {
  return {
    label: props.column.fieldNames?.label ?? 'label',
    value: props.column.fieldNames?.value ?? 'value',
  }
}

// 判断 placeholder
const placeholder = (column: ColumnProps) => {
  return (
    column.search?.props?.placeholder ??
    (column.search?.el === 'input' ? `${props.column.label}` : `${props.column.label}`)
  )
}

// 是否有清除按钮 (当搜索项有默认值时，清除按钮不显示)
const clearable = (column: ColumnProps) => {
  return (
    column.search?.props?.clearable ??
    (column.search?.defaultValue === null || column.search?.defaultValue === undefined)
  )
}
</script>

<style lang="scss" scoped></style>
