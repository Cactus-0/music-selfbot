export interface IConfig {
    token?: string;
    logTo?: string;
    prefix?: string;
};

export interface ICliOptions {
    token?: string;
    noSave?: boolean;
    noLoad?: boolean;
}
