
// * 登录模块


export namespace Login {
    export interface ReqLoginForm {
        username: string
        password: string
    }
    export interface ResLogin {
        access_token: string
    }
    export interface ResAuthButtons {
        [key: string]: string[]
    }
}

// * Menu
declare namespace Menu {
    interface MenuOptions {
        path: string;
        name: string;
        component?: string | (() => Promise<any>);
        redirect?: string;
        meta: MetaProps;
        children?: MenuOptions[];
    }
    interface MetaProps {
        icon: string;
        title: string;
        link?: string;
        hidden: boolean;
        noCache: boolean;
    }
}
