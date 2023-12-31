import { homedir } from "os";
import { Uri } from "vscode";

import { getConfig } from "../utils";
import {
  getCurrentFolder,
  iterateDirectoryTree,
  parseYaml,
} from "../utils/fileUtils";
import { ManiConfig } from "./maniConfig";
import { ManiYaml } from "./maniYaml";

export const ManiConfigFiles = [
  "mani.yml",
  "mani.yaml",
  ".mani.yaml",
  ".mani.yml",
];

async function getManiConfig(uri: Uri, path?: string) {
  const file = await parseYaml<ManiYaml>(uri);

  if (!file) {
    return undefined;
  }
  const maniConfig = new ManiConfig(uri, file, path);
  await parseImports(file, uri, maniConfig);
  return maniConfig;
}

async function parseImports(
  file: ManiYaml | undefined,
  uri: Uri,
  maniConfig: ManiConfig
) {
  if (file?.import) {
    const importConfigs = await Promise.all(
      file.import.map(async (importFile) => {
        let importConfig = await getManiConfig(
          getImportUri(importFile, uri),
          importFile
        );
        if (!importConfig) {
          importConfig = await getManiConfig(Uri.file(importFile));
        }
        return importConfig;
      })
    );
    for (const importConfig of importConfigs) {
      importConfig && maniConfig.imports.push(importConfig);
    }
  }
}
function getImportUri(path: string, fileUri: Uri) {
  if (path.startsWith("~")) {
    return Uri.file(path.replace("~", homedir));
  }
  if (path.startsWith("/")) {
    return Uri.file(path);
  }
  if (/^[a-zA-Z]:\//gu.test(path)) {
    return Uri.file(path);
  }
  return Uri.joinPath(fileUri, "..", path);
}

export async function getRootManiConfig(): Promise<ManiConfig | undefined> {
  const configFile = getConfig().get("maniConfigFile");
  if (configFile) {
    return getManiConfig(Uri.parse(configFile));
  }
  const currentFolder = getCurrentFolder();

  const manifile = await iterateDirectoryTree(
    currentFolder,
    ...ManiConfigFiles
  );
  if (manifile) {
    return getManiConfig(manifile);
  }
  return undefined;
}
