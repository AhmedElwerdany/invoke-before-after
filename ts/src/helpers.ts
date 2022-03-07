import { OptionsI } from './constants';
export const invokeSafe = (fn: Function): void => {
    try {
        fn()
    } catch {
    }
}

export const bind = (fn: Function, reciver: Object, args: any[] = []): Function => {
    if (typeof fn === 'function') {
        return fn.bind(reciver, ...args)
    }
    else {
        return () => { throw new Error('expected a function, recived ' + typeof fn) }
    }
}

export const camleCase = (string: string): string => {
    const firstLetter = string[0].toUpperCase()
    const restOfTheWord = string.slice(1)

    return firstLetter + restOfTheWord
}

export const join = (...args: any[]): string => args.join('')

export const generateMethodName = (method_name: string, options: OptionsI): Omit<OptionsI, 'disableCamelCase'> => {
    
    if(options.disableCamelCase === false) {
        method_name = camleCase(method_name)
    }

    return ({
        invokeAfterName : join(options.invokeAfterName, method_name),
        invokeBeforeName : join(options.invokeBeforeName, method_name),
    })
}