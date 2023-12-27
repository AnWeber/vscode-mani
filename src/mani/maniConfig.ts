import { Uri } from "vscode";
import { ManiYaml, Project } from "./maniYaml";

export interface ManiConfig {
  uri: Uri;
  raw: ManiYaml;
  path?: string;

  imports?: Array<ManiConfig>;
  projects: Array<ManiProject>;
  tasks?: Array<ManiTask>;
}

export interface ManiProject {
  label: string;
  description?: string;
  detail?: string;
  uri: Uri;
  raw: Project;
  config: ManiConfig;
  tags: Array<string>;
}

export interface ManiTask {
  label: string;
  description?: string;
  detail?: string;
}
