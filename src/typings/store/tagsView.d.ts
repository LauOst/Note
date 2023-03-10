/* tagsView */
import {RouteLocationNormalized, RouteRecordName} from "vue-router";

export interface TagView extends Partial<RouteLocationNormalized> {
    title?: string
}
export interface TagsViewState {
    visitedViews: TagView[]
    cachedViews: RouteRecordName[]
}
