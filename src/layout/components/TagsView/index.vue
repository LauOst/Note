<template>
  <div id="tags-view-container" class="tags-view-container">
    <ScrollPane ref="scrollPaneRef" class="tags-view-wrapper" @scroll="handleScroll">
      <router-link
        v-for="tag in visitedViews"
        :key="tag.path"
        :data-path="tag.path"
        :class="isActive(tag) ? 'active' : ''"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        class="tags-view-item"
        @click.middle="!isAffix(tag) ? closeSelectedTag(tag) : ''"
        @contextmenu.prevent="openMenu(tag, $event)"
      >
        {{ tag.title }}
        <span v-if="!isAffix(tag)" @click.prevent.stop="closeSelectedTag(tag)">
          <Close class="el-icon-close" />
        </span>
      </router-link>
    </ScrollPane>
    <ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag)">刷新页面</li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">关闭当前</li>
      <li @click="closeOthersTags">全部其它</li>
      <li @click="closeAllTags(selectedTag)">全部关闭</li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import path from 'path-browserify'
import { RouteRecordRaw } from 'vue-router'
import ScrollPane from './ScrollPane.vue'
import { PermissionStore } from '@/store/modules/permission'
import { TagsViewStore } from '@/store/modules/tagsView'
import { TagView } from '@/typings/store/tagsView'

const tagsViewStore = TagsViewStore()
const permissionStore = PermissionStore()

const currentRoute = useRoute()
const routes = computed(() => permissionStore.routes)
const visitedViews = computed(() => tagsViewStore.visitedViews)
const isActive = (route: TagView) => {
  return route.path === currentRoute.path
}
const isAffix = (tag: TagView) => {
  return tag.meta && tag.meta.affix
}

// 右键点击事件
const instance = getCurrentInstance()
const { ctx } = instance as any
const selectedTag = ref<TagView>({})
const visible = ref(false)
const left = ref(0)
const top = ref(0)
const openMenu = (tag: TagView, e: MouseEvent) => {
  const menuMinWidth = 105
  const offsetLeft = ctx.$el.getBoundingClientRect().left // container margin left
  const { offsetWidth } = ctx.$el // container width
  const maxLeft = offsetWidth - menuMinWidth
  const l = e.clientX - offsetLeft
  if (l > maxLeft) {
    left.value = maxLeft
  } else {
    left.value = l
  }
  top.value = e.clientY
  visible.value = true
  selectedTag.value = tag
}
// 跳转
const router = useRouter()
const toLastView = (visitedViews: TagView[], view: TagView) => {
  const latestView = visitedViews.slice(-1)[0]
  if (latestView && latestView.fullPath !== undefined) {
    router.push(latestView.fullPath).catch((err) => console.warn(err))
  } else if (view.name === 'Dashboard') {
    router.push({ path: `/redirect${view.fullPath}` }).catch((err) => console.warn(err))
  } else {
    router.push('/').catch((err) => console.warn(err))
  }
}
// 关闭弹出层
const closeMenu = () => {
  visible.value = false
}
// 滚动时关闭弹出层
const handleScroll = () => {
  closeMenu()
}
// 关闭tag
const closeSelectedTag = (view: TagView) => {
  tagsViewStore.delView(view).then(({ visitedViews }: any) => {
    if (isActive(view)) {
      toLastView(visitedViews, view)
    }
  })
}
const filterAffixTags = (routes: RouteRecordRaw[], basePath = '/') => {
  let tags: TagView[] = []
  routes.forEach((route) => {
    if (route.meta && route.meta.affix) {
      const tagPath = path.resolve(basePath, route.path)
      tags.push({
        fullPath: tagPath,
        path: tagPath,
        name: route.name,
        meta: { ...route.meta },
      })
    }
    if (route.children) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const childTags = filterAffixTags(route.children, route.path)
      if (childTags.length >= 1) {
        tags = tags.concat(childTags)
      }
    }
  })
  return tags
}
// 初始化tag
const affixTags = ref<TagView[]>([])
const initTags = () => {
  affixTags.value = filterAffixTags(routes.value)
  for (const tag of affixTags.value) {
    if (tag.name) {
      tagsViewStore.addVisitedView(tag as TagView)
    }
  }
}
// 新增tag
const addTags = () => {
  if (currentRoute.name) {
    tagsViewStore.addView(currentRoute)
  }
}

// 删除tag相关
const scrollPaneRef = ref(null)
const moveToCurrentTag = () => {
  const tags = instance?.refs.tag as any[]
  nextTick(() => {
    if (tags === null || tags === undefined) return
    for (const tag of tags) {
      if ((tag.to as TagView).path === currentRoute.path) {
        ;(scrollPaneRef.value as any).moveToCurrentTag(tag)
        if ((tag.to as TagView).fullPath !== currentRoute.fullPath) {
          tagsViewStore.updateVisitedView(currentRoute)
        }
      }
    }
  })
}
// 刷新tag
const refreshSelectedTag = (view: TagView) => {
  tagsViewStore.delCachedView(view).then(() => {
    const { fullPath } = view
    nextTick(() => {
      router.replace({ path: `/redirect${fullPath}` }).catch((err) => {
        console.warn(err)
      })
    })
  })
}
// 关闭其它
const closeOthersTags = () => {
  if (selectedTag.value.fullPath !== currentRoute.path && selectedTag.value.fullPath !== undefined) {
    router.push(selectedTag.value.fullPath).catch((err) => console.warn(err))
  }
  tagsViewStore.delOthersViews(selectedTag.value).then(() => {
    moveToCurrentTag()
  })
}
// 关闭所有
const closeAllTags = (view: TagView) => {
  tagsViewStore.delAllViews().then(({ visitedViews }: any) => {
    if (affixTags.value.some((tag) => tag.path === view.path)) return
    toLastView(visitedViews, view)
  })
}

watch(currentRoute, () => {
  addTags()
  moveToCurrentTag()
})
watch(visible, (value) => {
  if (value) {
    document.body.addEventListener('click', closeMenu)
  } else {
    document.body.removeEventListener('click', closeMenu)
  }
})
onMounted(() => {
  initTags()
  addTags()
})
</script>

<style lang="scss" scoped>
.tags-view-container {
  height: 32px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);

  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 27px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 3px;

      &:first-of-type {
        margin-left: 15px;
      }

      &:last-of-type {
        margin-right: 15px;
      }

      &.active {
        background-color: #4caf50;
        //background-color: #5c90d2;
        color: #fff;
        border-color: #4caf50;
        //border-color: #5c90d2;

        &::before {
          content: '';
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }

    .count-click {
      width: 50px;
      height: 30px;
      background: transparent;
      float: right;
    }
  }

  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);

    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;

      &:hover {
        background: #eee;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    border-radius: 3px;
    .el-icon-close {
      display: inline-block;
      border-radius: 6px;
      width: 12px;
      height: 12px;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;
      vertical-align: -2px;
      &:before {
        transform: scale(0.6);
        display: inline-block;
        vertical-align: -3px;
      }
      &:hover {
        background-color: #b4bccc;
        color: #fff;
        width: 12px !important;
        height: 12px !important;
      }
    }
  }
}
</style>
