/* app */
export enum DeviceType {
    Mobile,
    Desktop,
}
export interface Sidebar {
    opened: boolean
    withoutAnimation: boolean
}
export interface AppState {
    sidebar: Sidebar
    device: DeviceType
    size: string
}
