export interface OptionsI {
    invokeAfterName: string;
    invokeBeforeName: string;
    disableCamelCase: boolean;
}

export const DEFAULT_OPTIONS: OptionsI = {
    invokeAfterName: 'invokeAfter',
    invokeBeforeName: 'invokeBefore',
    disableCamelCase: false
}