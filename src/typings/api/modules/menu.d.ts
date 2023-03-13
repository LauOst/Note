// * 菜单管理模块
export namespace Menu {
    export interface ReqMenuParams extends ReqPage {
        roleName: string;
        roleCode: string;
        permissionId: string[];
        status: number;
    }
    export interface ResMenuList {
        alwaysShow: boolean | null
        children: any[]
        component?: string
        createTime: string
        description: any
        hidden: number
        icon: string | null
        isRoute: boolean | null
        menuId: string
        menuName: string
        menuType: string
        name: string
        orderNo: string | null
        parentId: string
        path: string
        perms: string
        redirect: string
        sortNo: number
        status: number
    }
}
