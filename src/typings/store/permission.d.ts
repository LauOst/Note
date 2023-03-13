/* PermissionState */
import {RouteRecordRaw} from "vue-router";

export interface PermissionState {
    routes: RouteRecordRaw[]
    addRoutes: RouteRecordRaw[]
    sidebarRouters: RouteRecordRaw[]
}
