<template>
  <el-input style="width: 100%" v-bind="$attrs" :model-value="props.modelValue" @input="inputHandler"></el-input>
</template>
<script lang="ts">
export default defineComponent({
  inheritAttrs: false,
})
</script>
<script lang="ts" setup>
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: () => {
      return ''
    },
  },
  formItem: {
    type: Object,
    default: () => {
      return {}
    },
  },
})
const emit = defineEmits(['update:modelValue'])
const inputHandler = (e: any) => {
  emit('update:modelValue', e)
}
</script>

<style lang="scss" scoped></style>
