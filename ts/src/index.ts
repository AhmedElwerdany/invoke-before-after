import { DEFAULT_OPTIONS, OptionsI } from './constants';
import { bind, generateMethodName, invokeSafe } from './helpers';

const objectProxyHandler = (options: OptionsI): ProxyHandler<object> => ({
  get(target, propKey, reciver) {

    const value: unknown = target[propKey as keyof object]

    /**
    * [[get]] handler. invoke in getting properties too.
    * so we need to check the type
    */

    if (typeof value === "function") {
      /**
       * the return value is a function, because the
       * user tried to get a function in the first place.
       * pass the function all the arguments that the user
       * passed when he/she tried to call the method.
       */
      return function (...args: any[]) {
        /**
         * generating two strings based on the options.
         * the two strings are representing the name of
         * the methods that the user needs to invoke
         * after or before the original method.
         */
        const { invokeAfterName, invokeBeforeName } = generateMethodName(propKey as keyof object, options)
        
        /**
         * invoke before each
         */
        const bindedBeforeEach = bind(target[options.invokeBeforeName as keyof object], reciver, args)
        invokeSafe(bindedBeforeEach)

        /**
         * assuming these functions exist, passing them the arguments that
         * the original method received is the right thing to do.
         * if there is no function exists. the return value is
         * a function that throws an error. that will never be fired
         * because  we gonna invoke this function in a try-catch block.
         * with an empty catch block
         */
        const bindedBeforeFn = bind(target[invokeBeforeName as keyof object], reciver, args)

        /**
        * passing the name of the function to be invoked safely.
        * in a try-catch block, with an empty catch block.
        */
        invokeSafe(bindedBeforeFn)

        const result = value.apply(reciver, args)

        /**
         * invoke after each
         */
        const bindedAfterEach = bind(target[options.invokeAfterName as keyof object], reciver, args)
        invokeSafe(bindedAfterEach)

        /**
         * assuming these functions exist, passing them the arguments that
         * the original method received is the right thing to do.
         * if there is no function exists. the return value is
         * a function that throws an error. that will never be fired
         * because  we gonna invoke this function in a try-catch block.
         * with an empty catch block
         */
        const bindedAfterFn = bind(target[invokeAfterName as keyof object], reciver, args)

        /**
         * passing the name of the function to be invoked safely.
         * in a try-catch block, with an empty catch block.
         */
        invokeSafe(bindedAfterFn)

        return result;
      };
    } else {
      return value;
    }
  },
})

const classProxyHandler = (options: OptionsI): ProxyHandler<{ new(...args: unknown[]): object }> => ({
  construct(Target, args: unknown[]) {
    return invokeWrapper(new Target(...args), options)
  }
})

/**
 * invokeMeWrapper function will wrap your target (class/object) with a special proxy/wrapper
 * and provid it back to you as a class/object. the method inside your object or class
 * can invoke dynamically (without you calling them).
 * @param {Object | Function} target - A class or object that its methods should be proxied.
 * @param {typex} options - object contains options to customize the functionality wrapper.
 * @returns {Object} if the target is empty, it returns an empty object. otherwise a proxied target returned.
 *
 */
function invokeWrapper(target: { new(...args: unknown[]): object } | object, options?: OptionsI): object {

  const defaultOptions: OptionsI = DEFAULT_OPTIONS

  options = { ...defaultOptions, ...options }

  const typeOfObject = typeof target

  if (typeOfObject === 'function') {
    return new Proxy(target, classProxyHandler(options))
  } else if (typeOfObject === 'object') {
    return new Proxy(target, objectProxyHandler(options))
  }

  return {}

}

export default invokeWrapper
