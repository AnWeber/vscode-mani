import {
  getCurrentFolder,
  iterateDirectoryTree,
  parseYaml,
} from "../fileUtils";
import { ManiConfig, ManiTask } from "./maniConfig";
import { ManiYaml } from "./maniYaml";
import { Uri } from "vscode";
import { homedir } from "os";
async function getManiConfig(uri: Uri) {
  const file = await parseYaml<ManiYaml>(uri);

  if (!file) {
    return undefined;
  }

  const maniConfig: ManiConfig = {
    uri,
    projects: [],
  };

  parseManiProjects(file, maniConfig, uri);
  parseManiTasks(file, maniConfig);

  await parseImports(file, uri, maniConfig);

  return maniConfig;
}

async function parseImports(
  file: ManiYaml | undefined,
  uri: Uri,
  maniConfig: ManiConfig
) {
  if (file?.import) {
    maniConfig.imports = (await Promise.all(
      file.import.map(async (importFile) => {
        const importConfig = await getManiConfig(getImportUri(importFile, uri));
        if (!importConfig) {
          return getManiConfig(Uri.file(importFile));
        }
        return importConfig;
      })
    )) as Array<ManiConfig>;
  }
}
function getImportUri(path: string, fileUri: Uri) {
  if (path.startsWith("~")) {
    return Uri.file(path.replace("~", homedir));
  }

  return Uri.joinPath(fileUri, "..", path);
}

function parseManiProjects(
  file: ManiYaml | undefined,
  maniConfig: ManiConfig,
  uri: Uri
) {
  if (file?.projects) {
    for (const [label, project] of Object.entries(file.projects)) {
      maniConfig.projects.push({
        label,
        description: project.desc || project.tags?.join(", "),
        detail: project.path,
        uri: Uri.joinPath(uri, "..", project?.path || label),
        raw: project,
        tags: project.tags || [],
        config: maniConfig,
      });
    }
  }
}

function parseManiTasks(file: ManiYaml | undefined, maniConfig: ManiConfig) {
  if (file?.tasks) {
    maniConfig.tasks = Object.entries(file.tasks).map(([label, task]) => {
      const maniTask: ManiTask = {
        label,
      };
      if (typeof task !== "string") {
        maniTask.description = task.desc;

        maniTask.detail =
          task.cmd || task.commands?.map((cmd) => cmd.name).join(", ");
      }
      return maniTask;
    });
  }
}

export async function getRootManiConfig(): Promise<ManiConfig | undefined> {
  const currentFolder = getCurrentFolder();

  const manifile = await iterateDirectoryTree(
    currentFolder,
    "mani.yml",
    "mani.yaml",
    ".mani.yaml",
    ".mani.yml"
  );
  if (manifile) {
    return getManiConfig(manifile);
  }
  return undefined;
}
