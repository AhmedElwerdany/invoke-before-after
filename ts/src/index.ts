import { bind, camleCase, invokeSafe, join } from "./helpers";
/**
 * 🟢 Wrapper for class
 * 🟢 Wrapper for an object
 * 🔴 Decorator for a class [soon]
 * 🔴 custome names for before and after [soon]
 */
const InvokeMeProxyHandler : ProxyHandler<Object> = {
  get(target, propKey: string, reciver) {
      const method = target[propKey];
      propKey = camleCase(propKey)
      // 🤨 [get] handler invoke in getting properties too.
      // 🙂 so we need to check the type
      if (typeof method === "function") {
        return function (...args : any[]) {
          // ? passing the name of the function to be invoked in a safe way
          const beforeFnName = join('invokeBefore', propKey)
          const bindedBeforeFn = bind(target[beforeFnName], reciver , args)
          invokeSafe(bindedBeforeFn)

          const result = method.apply(reciver, args);

          // ? passing the name of the function to be invoked in a safe way
          const afterFnName = join('invokeAfter', propKey)
          const bindedAfterFn = bind(target[afterFnName], reciver , args)
          invokeSafe(bindedAfterFn)
          return result;
        };
      }

      return method;
    },
}

const InvokeMeProxyHandlerForClass = {
  construct(target ,args : any[]) {
    return invokeMeWrapper(new target(...args))
  }
}

/**
 * options should tell the beforeInvoke Name [soon]
 * options should tell the afterInvoke Name [soon]
 * options should tell the beforeEach Name [soon]
 * options should tell the afterEach Name [soon]
 */
function invokeMeWrapper (object : Function | Object, options?) {
  const typeOfObject = typeof object
  if(typeOfObject === 'function') {
    return new Proxy(object, InvokeMeProxyHandlerForClass)
  } else if (typeOfObject === 'object'){
    return new Proxy(object, InvokeMeProxyHandler)
  }
}

export { invokeMeWrapper }