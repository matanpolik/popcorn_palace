declare const _default: (() => {
    port: number;
    database: {
        host: string;
        port: number;
        username: string;
        password: string;
        name: string;
    };
    swagger: {
        enabled: true;
        title: string;
        description: string;
        version: string;
        path: string;
    };
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    port: number;
    database: {
        host: string;
        port: number;
        username: string;
        password: string;
        name: string;
    };
    swagger: {
        enabled: true;
        title: string;
        description: string;
        version: string;
        path: string;
    };
}>;
export default _default;
