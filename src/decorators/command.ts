import * as vscode from "vscode";

export function command(
  subscriptions: Array<vscode.Disposable>
): MethodDecorator {
  return (
    target: unknown,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) => {
    const method = descriptor.value;

    if (typeof propertyKey !== "string") {
      return;
    }

    const disposable = vscode.commands.registerCommand(
      `mani.${propertyKey}`,
      method,
      target
    );
    subscriptions?.push(disposable);

    return descriptor;
  };
}
