// * 用户管理模块
export namespace User {
    export interface ReqUserParams extends ReqPage {
        username: string;
        gender: number;
        idCard: string;
        email: string;
        address: string;
        createTime: string[];
        status: number;
    }
    export interface ResUserList {
        avatar: string | null
        createBy: string
        createTime: string
        departName: string
        orgCode: string
        realname: string
        status: number
        statusName: string | null
        updateBy: string | null
        updateTime: string
        useOrgCode: string
        userId: string
        username: string
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
