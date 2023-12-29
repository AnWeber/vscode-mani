import { Command } from "vscode";
import { ManiConfig, ManiProject, ManiTask } from "../mani";

export type EnumTreeItemType = {
  name: string;
  icon: string;
  command?: Command;
};
export const enumTreeItem = {
  Init: {
    name: "Please Initialize Mani Config",
    icon: "new-file",
    command: {
      command: "mani.init",
      title: "init",
    },
  },
  All: {
    name: "All",
    icon: "project",
  },
  Tags: {
    name: "Tags",
    icon: "tag",
  },
  Configs: {
    name: "Config",
    icon: "gear",
  },
  Tasks: {
    name: "Tasks",
    icon: "tasklist",
  },
  Branches: {
    name: "Branches",
    icon: "git-branch",
  },
};

export type ManiTreeItem =
  | ManiProject
  | ManiTask
  | ManiConfig
  | string
  | EnumTreeItemType;
