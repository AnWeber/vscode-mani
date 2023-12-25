import {
  getCurrentFolder,
  iterateDirectoryTree,
  parseYaml,
} from "../fileUtils";
import { ManiFile, Project } from "./maniFile";
import { Uri } from "vscode";

export interface ManiConfig {
  uri: Uri;
  import?: Array<string>;
  projects: Array<ManiProject>;
}

export interface ManiProject {
  label: string;
  description?: string;
  uri: Uri;
  project: Project;
}

async function getManiConfig(uri: Uri) {
  const file = await parseYaml<ManiFile>(uri);

  const maniConfig: ManiConfig = {
    uri,
    projects: [],
  };

  if (file?.projects) {
    for (const [name, project] of Object.entries(file.projects)) {
      maniConfig.projects.push({
        label: name,
        description: project.desc,
        uri: Uri.joinPath(uri, "..", project?.path || name),
        project,
      });
    }
  }

  if (maniConfig?.import) {
    const importConfigs = await Promise.all(
      maniConfig.import.map((importFile) =>
        getManiConfig(Uri.joinPath(uri, "..", importFile))
      )
    );

    for (const config of importConfigs) {
      if (config.projects) {
        maniConfig.projects.push(...config.projects);
      }
    }
  }

  return maniConfig;
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
