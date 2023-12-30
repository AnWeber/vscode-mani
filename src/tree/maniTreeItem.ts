import { Command } from "vscode";

import { ManiConfig, ManiProject, ManiTask } from "../mani";

export type EnumTreeItemType = {
  label: string;
  icon: string;
  command?: Command;
};
export const enumTreeItem = {
  Init: {
    label: "Please Initialize Mani Config",
    icon: "new-file",
    command: {
      command: "mani.init",
      title: "init",
    },
  },
  All: {
    label: "All",
    icon: "project",
  },
  Projects: {
    label: "Projects",
    icon: "project",
  },
  Tags: {
    label: "Tags",
    icon: "tag",
  },
  Configs: {
    label: "Config",
    icon: "gear",
  },
  Tasks: {
    label: "Tasks",
    icon: "tasklist",
  },
  Branches: {
    label: "Branches",
    icon: "git-branch",
  },
  NoTags: {
    label: "<no-tags>",
    icon: "tag",
  },
};

export type ManiTreeItem =
  | ManiProject
  | ManiTask
  | ManiConfig
  | string
  | EnumTreeItemType;
