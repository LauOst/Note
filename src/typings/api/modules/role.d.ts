// * 角色管理模块
export namespace Role {
    export interface ReqRoleParams extends ReqPage {
        roleName: string;
        roleCode: string;
        permissionId: string[];
        status: number;
    }
    export interface ResRoleList {
        basicsRole: number
        createBy: string
        createTime: string
        departId: string | null
        description: string | null
        disabled: boolean | null
        orgCode: string
        roleCode: string | null
        roleId: string
        roleName: string
        status: number
    }
    export interface ResStatus {
        userLabel: string;
        userValue: number;
    }
    export interface ResGender {
        genderLabel: string;
        genderValue: number;
    }
    export interface ResDepartment {
        id: string;
        name: string;
        children?: ResDepartment[];
    }
}
