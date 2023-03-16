<template>
  <el-select style="width: 100%" v-bind="$attrs" :model-value="props.modelValue" @change="changeHandler">
    <template v-for="(item, index) in localOptions" :key="index">
      <el-option :label="item.label" :value="item.value" :disabled="item.disabled">{{
        item.customLabel || item.label
      }}</el-option>
    </template>
  </el-select>
</template>

<script></script>

<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: () => {
      return ''
    },
  },
  options: {
    type: Array,
    default: () => {
      return []
    },
  },
})
const emit = defineEmits(['update:modelValue'])
const changeHandler = (e: any) => {
  emit('update:modelValue', e)
}
const localOptions = computed(() => props.options)
</script>
