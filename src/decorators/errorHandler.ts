import { logger } from "../initOutputChannel";

export function errorHandler(this: unknown): MethodDecorator {
  return (
    target: unknown,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) => {
    const originalMethod = descriptor.value;

    descriptor.value = errorHandlerWrapper.bind(this)(
      target,
      propertyKey.toString(),
      originalMethod
    );
    return descriptor;
  };
}

export function errorHandlerWrapper(
  target: unknown,
  propertyKey: string,
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

async function handleError(target: unknown, propertyKey: string, err: unknown) {
  logger.error(`error in ${target}.${propertyKey}:`, err);
}
export function isPromise(obj: unknown): obj is Promise<unknown> {
  const guard = obj as Promise<unknown>;
  return guard && !!guard.then;
}
