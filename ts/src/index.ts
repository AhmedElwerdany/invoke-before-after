import { DEFAULT_OPTIONS, OptionsI } from "./constants";
import { bind, camleCase, generateMethodName, invokeSafe, join } from "./helpers";

const InvokeMeProxyHandler = (options : OptionsI) : ProxyHandler<object> => ({
  get(target, propKey: string, reciver) {
      const method = target[propKey];

      /* 
      * [[get]] handler invoke in getting properties too.
      * so we need to check the type
      */
      if (typeof method === "function") {
        return function (...args : any[]) {
          const {invokeAfterName, invokeBeforeName} = generateMethodName(propKey, options)

          const bindedBeforeFn = bind(target[invokeBeforeName], reciver , args)
          // ? passing the name of the function to be invoked in a safe way
          invokeSafe(bindedBeforeFn)

          const result = method.apply(reciver, args);

          const bindedAfterFn = bind(target[invokeAfterName], reciver , args)
          // ? passing the name of the function to be invoked in a safe way
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