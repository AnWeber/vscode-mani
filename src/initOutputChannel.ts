import * as vscode from "vscode";

let outputChannel: vscode.OutputChannel | undefined;
export function initOutputChannel() {
  outputChannel = vscode.window.createOutputChannel("mani", "Log");

  return outputChannel;
}

export function logInfo(...messages: Array<unknown>) {
  appendToOutputChannel("log", ...messages);
}

export function logError(...messages: Array<unknown>) {
  appendToOutputChannel("error", ...messages);
}

function appendToOutputChannel(prefix: string, ...messages: Array<unknown>) {
  if (!outputChannel) {
    return;
  }
  outputChannel.append(prefix);
  for (const param of messages) {
    if (param !== undefined) {
      if (isError(param)) {
        outputChannel.appendLine(`${param.name} - ${param.message}`);
        if (param.stack) {
          outputChannel.appendLine(param.stack);
        }
      } else {
        outputChannel.appendLine(`${param}`);
      }
    }
  }
}
export function isError(val: unknown): val is Error & { handled?: boolean } {
  if (!val) {
    return false;
  }
  if (val instanceof Error) {
    return true;
  }
  const err = val as Error;
  return !!err.message && !!err.stack && !!err.name;
}
