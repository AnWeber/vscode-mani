import { logError } from "../initOutputChannel";

export function errorHandler(this: unknown): MethodDecorator {
  return (
    target: unknown,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) => {
    const originalMethod = descriptor.value;

    descriptor.value = errorHandlerWrapper.bind(this)(
      target,
      propertyKey,
      originalMethod
    );
    return descriptor;
  };
}

export function errorHandlerWrapper(
  target: unknown,
  propertyKey: string | symbol,
  method: (...args: unknown[]) => unknown
) {
  return function (this: unknown, ...args: unknown[]): unknown {
    try {
      const result = method.apply(this, args);
      if (isPromise(result)) {
        return result.catch((err) => handleError(target, propertyKey, err));
      }
      return result;
    } catch (err) {
      handleError(target, propertyKey, err);
    }
    return undefined;
  };
}

async function handleError(
  _target: unknown,
  _propertyKey: string | symbol,
  err: unknown
) {
  logError(err);
}
export function isPromise(obj: unknown): obj is Promise<unknown> {
  const guard = obj as Promise<unknown>;
  return guard && !!guard.then;
}
