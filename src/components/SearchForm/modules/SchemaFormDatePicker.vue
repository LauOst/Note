<template>
  <el-date-picker
    v-bind="$attrs"
    v-model:modelValue="localDateValue"
    style="width: 100%"
    @change="changeHandler"
  ></el-date-picker>
</template>
<script lang="ts">
export default defineComponent({
  inheritAttrs: false,
})
</script>
<script lang="ts" setup>
import _ from 'lodash'

const props = defineProps({
  modelValue: {
    type: [Object, Array, String],
    default: () => {
      return ''
    },
  },
})
const emit = defineEmits(['update:modelValue'])
const localDateValue = ref<any>(null)
const changeHandler = (e: any) => {
  emit('update:modelValue', e)
}
watch(
  () => props.modelValue,
  (newVal, oldVal) => {
    if (!_.isEqual(newVal, oldVal)) {
      localDateValue.value = newVal
    }
  },
)

onMounted(() => {
  localDateValue.value = props.modelValue
})
</script>

<style lang="scss" scoped></style>
