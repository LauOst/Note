import { RouteLocationNormalizedLoaded } from 'vue-router'
import { TagsViewState } from '@/typings/store/tagsView'

export const TagsViewStore = defineStore({
  id: 'TagsViewState',
  state: (): TagsViewState => ({
    visitedViews: [],
    cachedViews: [],
  }),
  actions: {
    addView(view: RouteLocationNormalizedLoaded) {
      this.addVisitedView(view)
      this.addCachedView(view)
    },
    addVisitedView(view: any) {
      if (this.visitedViews.some((v) => v.path === view.path)) return
      this.visitedViews.push({ ...view, title: view.meta?.title || 'no-name' })
    },
    addCachedView(view: RouteLocationNormalizedLoaded) {
      if (this.cachedViews.includes(view.name ?? '')) return
      if (!view.meta.noCache && view.name) {
        this.cachedViews.push(view.name)
      }
    },
    delView(view: RouteLocationNormalizedLoaded): Promise<any> {
      return new Promise((resolve) => {
        this.delVisitedView(view)
        this.delCachedView(view)
        resolve({
          visitedViews: [...this.visitedViews],
          cachedViews: [...this.cachedViews],
        })
      })
    },
    delVisitedView(view: RouteLocationNormalizedLoaded) {
      return new Promise((resolve) => {
        for (const [i, v] of this.visitedViews.entries()) {
          if (v.path === view.path) {
            this.visitedViews.splice(i, 1)
            break
          }
        }
        resolve([...this.visitedViews])
      })
    },
    delCachedView(view: RouteLocationNormalizedLoaded) {
      return new Promise((resolve) => {
        const index = this.cachedViews.indexOf(view.name ?? '')
        index > -1 && this.cachedViews.splice(index, 1)
        resolve([...this.cachedViews])
      })
    },

    delOthersViews(view: RouteLocationNormalizedLoaded) {
      return new Promise((resolve) => {
        this.delOthersVisitedViews(view)
        this.delOthersCachedViews(view)
        resolve({
          visitedViews: [...this.visitedViews],
          cachedViews: [...this.cachedViews],
        })
      })
    },
    delOthersVisitedViews(view: RouteLocationNormalizedLoaded) {
      return new Promise((resolve) => {
        this.visitedViews = this.visitedViews.filter((v) => {
          return v.meta?.affix || v.path === view.path
        })
        resolve([...this.visitedViews])
      })
    },
    delOthersCachedViews(view: RouteLocationNormalizedLoaded) {
      return new Promise((resolve) => {
        const index = this.cachedViews.indexOf(view.name ?? '')
        if (index > -1) {
          this.cachedViews = this.cachedViews.slice(index, index + 1)
        } else {
          this.cachedViews = []
        }
        resolve([...this.cachedViews])
      })
    },

    delAllViews(view?: RouteLocationNormalizedLoaded) {
      return new Promise((resolve) => {
        this.delAllVisitedViews(view)
        this.delAllCachedViews(view)
        resolve({
          visitedViews: [...this.visitedViews],
          cachedViews: [...this.cachedViews],
        })
      })
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
    delAllVisitedViews(view?: RouteLocationNormalizedLoaded) {
      return new Promise((resolve) => {
        this.visitedViews = this.visitedViews.filter((tag) => tag.meta?.affix)
        resolve([...this.visitedViews])
      })
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
    delAllCachedViews(view?: RouteLocationNormalizedLoaded) {
      return new Promise((resolve) => {
        this.cachedViews = []
        resolve([...this.cachedViews])
      })
    },
    updateVisitedView(view: RouteLocationNormalizedLoaded) {
      for (let v of this.visitedViews) {
        if (v.path === view.path) {
          v = Object.assign(v, view)
          break
        }
      }
    },
  },
})
