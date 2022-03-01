import { bind, camleCase, invokeSafe, join } from "./helpers";
/**
 * 🟢 Wrapper for class
 * 🟢 Wrapper for an object
 * 🔴 Decorator for a class [soon]
 * 🔴 custome names for before and after [soon]
 */
const InvokeMeProxyHandler = (options : invokeMeWrapperOptions) => ({
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

const InvokeMeProxyHandlerForClass = (options : invokeMeWrapperOptions) => ({
  construct(target ,args : any[]) {
    return invokeMeWrapper(new target(...args), options)
  }
})


interface invokeMeWrapperOptions {
  invokeAfterName: string;
  invokeBeforeName: string;
}

function invokeMeWrapper (object : Function | Object, options? : invokeMeWrapperOptions) {

  const defaultOptions : invokeMeWrapperOptions = {
    invokeAfterName : 'invokeAfter',
    invokeBeforeName: 'invokeBefore'
  }

  options = {...defaultOptions, ...options}

  const typeOfObject = typeof object
  
  if(typeOfObject === 'function') {
    return new Proxy(object, InvokeMeProxyHandlerForClass(options))
  } else if (typeOfObject === 'object'){
    return new Proxy(object, InvokeMeProxyHandler(options))
  }
}

export { invokeMeWrapper }