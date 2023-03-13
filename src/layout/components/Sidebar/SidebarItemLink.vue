<template>
  <component :is="type" v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script lang="ts" setup>
import { isExternal } from '@/utils/validate'

const props = defineProps({
  to: {
    type: String,
    required: true,
  },
})
const isExternals = computed(() => isExternal(props.to))
const type = computed(() => {
  if (isExternals.value) {
    return 'a'
  }
  return 'router-link'
})
const linkProps = (to: string) => {
  if (isExternals.value) {
    return {
      href: to,
      target: '_blank',
      rel: 'noopener',
    }
  }
  return {
    to,
  }
}
</script>
