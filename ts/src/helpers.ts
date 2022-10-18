import { OptionsI } from './constants';


export type anonymousFunction = () => void

/**
 * Accept a potential function and try to invoke it safely.
 * @param {Function} fn - a function that needs to be invoked in a safe way
 */
export const invokeSafe = (fn: anonymousFunction): void => {
    try {
        fn()
    } catch {
        /**
         *
         */
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
export const bind = (fn: Function, reciver: object, args: any[] = []) => {
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

/**
 * 
 * @param args - a set of arguments that will be passed as array to be joined.
 * @returns {string}  joined string
 */
export const join = (...args: string[]): string => args.join('')

export const generateMethodName = (method_name: string, options: OptionsI): Omit<OptionsI, 'disableCamelCase'> => {

    if (options.disableCamelCase === false) {
        method_name = camleCase(method_name)
    }

    return ({
        invokeAfterName: join(options.invokeAfterName, method_name),
        invokeBeforeName: join(options.invokeBeforeName, method_name),
    })
}