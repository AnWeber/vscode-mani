import * as vscode from "vscode";
export function createTerminal() {
  const terminal = vscode.window.terminals.find((obj) => obj.name === "mani");
  if (!terminal || terminal.exitStatus) {
    return vscode.window.createTerminal("mani");
  }
  return terminal;
}
