import { DEFAULT_OPTIONS, OptionsI } from "./constants";
import { bind, camleCase, invokeSafe, join } from "./helpers";

/**
 * 🟢 Wrapper for class
 * 🟢 Wrapper for an object
 * 🟢 custome names for before and after
 * 🔴 Decorator for a class [soon]
 */

const InvokeMeProxyHandler = (options : OptionsI) : ProxyHandler<object> => ({
  get(target, propKey: string, reciver) {
      const method = target[propKey];

      propKey = camleCase(propKey)

      // 🤨 [get] handler invoke in getting properties too.
      // 🙂 so we need to check the type

      if (typeof method === "function") {
        return function (...args : any[]) {

          // ? passing the name of the function to be invoked in a safe way
          const beforeFnName = join(options.invokeBeforeName, propKey)
          const bindedBeforeFn = bind(target[beforeFnName], reciver , args)
          invokeSafe(bindedBeforeFn)

          const result = method.apply(reciver, args);

          // ? passing the name of the function to be invoked in a safe way
          const afterFnName = join(options.invokeAfterName, propKey)
          const bindedAfterFn = bind(target[afterFnName], reciver , args)
          invokeSafe(bindedAfterFn)
          return result;
        };
      }else {
        return method;
      }
    },
})

const InvokeMeProxyHandlerForClass = (options : OptionsI): ProxyHandler<{new (...args: any[])} > => ({
  construct(target, args : any[]) {
    return invokeMeWrapper(new target(...args), options)
  }
})


function invokeMeWrapper<T> (object : Function | Object, options? : OptionsI) : any{

  const defaultOptions : OptionsI = DEFAULT_OPTIONS

  options = {...defaultOptions, ...options}

  const typeOfObject = typeof object
  
  if(typeOfObject === 'function') {
    return new Proxy(object, InvokeMeProxyHandlerForClass(options))
  } else if (typeOfObject === 'object'){
    return new Proxy(object, InvokeMeProxyHandler(options))
  }
}

export { invokeMeWrapper }