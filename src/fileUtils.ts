import * as vscode from "vscode";
import { parse } from "yaml";

export async function parseYaml<T>(uri: vscode.Uri): Promise<T | undefined> {
  try {
    const content = await readFile(uri);
    return parse(content);
  } catch (err) {
    return undefined;
  }
}

export async function readFile(uri: vscode.Uri): Promise<string> {
  const content = await vscode.workspace.fs.readFile(uri);
  return new TextDecoder("utf-8").decode(content);
}

export function getCurrentFolder() {
  const fileUri = vscode.window.activeTextEditor?.document?.uri;
  if (fileUri) {
    return vscode.Uri.joinPath(fileUri, "..");
  }
  if (
    vscode.workspace.workspaceFolders &&
    vscode.workspace.workspaceFolders.length > 0
  ) {
    return vscode.workspace.workspaceFolders[0].uri;
  }

  return undefined;
}

export async function iterateDirectoryTree(
  currentDir: vscode.Uri | undefined,
  ...files: Array<string>
): Promise<vscode.Uri | undefined> {
  if (currentDir) {
    const dirFiles = await vscode.workspace.fs.readDirectory(currentDir);
    for (const [file, type] of dirFiles) {
      for (const searchFile of files) {
        if (type === vscode.FileType.File && searchFile === file) {
          return vscode.Uri.joinPath(currentDir, file);
        }
      }
    }

    const parentDir = vscode.Uri.joinPath(currentDir, "..");

    if (!equalsPath(parentDir, currentDir)) {
      return iterateDirectoryTree(parentDir, ...files);
    }
  }
  return undefined;
}

function equalsPath(uri1: vscode.Uri | undefined, uri2: vscode.Uri) {
  return uri1?.toString() === uri2?.toString();
}
