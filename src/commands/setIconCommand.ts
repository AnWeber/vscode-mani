import * as vscode from "vscode";

import { errorHandler } from "../decorators";
import { ManiProject, ManiStore, SpecialTag } from "../mani";
import { writeTagsToYaml } from "./addTagsCommand";
import { BaseCommand } from "./baseCommand";
import { pickProject } from "./openFolderCommand";

export class SetIconCommand extends BaseCommand<ManiProject> {
  public constructor(private readonly maniStore: ManiStore) {
    super("mani.setIcon");
  }
  @errorHandler()
  protected async execute(p?: ManiProject): Promise<void> {
    const config = await this.maniStore.getManiConfig();
    if (!config) {
      return;
    }
    const project = p || (await pickProject(this.maniStore));

    if (!project) {
      return;
    }

    const icon = await vscode.window.showQuickPick(
      icons.map((i) => ({
        label: `$(${i}) ${i}`,
        icon: i,
      })),
      {
        matchOnDetail: true,
        matchOnDescription: true,
      }
    );
    if (icon) {
      const tags = project.tags.filter((t) => !SpecialTag.ICON.startsWith(t));
      tags.push(`${SpecialTag.ICON}${icon.icon}`);

      await writeTagsToYaml(project, tags, config);
    }
  }
}

// all Icons from https://code.visualstudio.com/api/references/icons-in-labels are supported
const icons = [
  "account",
  "activate-breakpoints",
  "add",
  "alert",
  "archive",
  "array",
  "arrow-both",
  "arrow-circle-down",
  "arrow-circle-left",
  "arrow-circle-right",
  "arrow-circle-up",
  "arrow-down",
  "arrow-left",
  "arrow-right",
  "arrow-small-down",
  "arrow-small-left",
  "arrow-small-right",
  "arrow-small-up",
  "arrow-swap",
  "arrow-up",
  "azure-devops",
  "azure",
  "beaker-stop",
  "beaker",
  "bell",
  "bell-dot",
  "bell-slash",
  "bell-slash-dot",
  "bold",
  "book",
  "bookmark",
  "bracket-dot",
  "bracket-error",
  "bracket",
  "briefcase",
  "broadcast",
  "browser",
  "bug",
  "calendar",
  "call-incoming",
  "call-outgoing",
  "case-sensitive",
  "check",
  "check-all",
  "checklist",
  "chevron-down",
  "chevron-left",
  "chevron-right",
  "chevron-up",
  "chip",
  "chrome-close",
  "chrome-maximize",
  "chrome-minimize",
  "chrome-restore",
  "circle-filled",
  "circle-large-filled",
  "circle-large-outline",
  "circle-outline",
  "circle-slash",
  "circuit-board",
  "clear-all",
  "clippy",
  "clock",
  "clone",
  "close",
  "close-all",
  "close-dirty",
  "cloud",
  "cloud-download",
  "cloud-upload",
  "code",
  "coffee",
  "collapse-all",
  "color-mode",
  "combine",
  "comment",
  "comment-add",
  "comment-discussion",
  "comment-draft",
  "comment-unresolved",
  "compare-changes",
  "compass-active",
  "compass-dot",
  "compass",
  "console",
  "copilot",
  "credit-card",
  "dash",
  "dashboard",
  "database",
  "debug-all",
  "debug",
  "debug-alt",
  "debug-alt-small",
  "debug-breakpoint",
  "debug-breakpoint-conditional",
  "debug-breakpoint-conditional-disabled",
  "debug-breakpoint-conditional-unverified",
  "debug-breakpoint-data",
  "debug-breakpoint-data-disabled",
  "debug-breakpoint-data-unverified",
  "debug-breakpoint-disabled",
  "debug-breakpoint-function",
  "debug-breakpoint-function-disabled",
  "debug-breakpoint-function-unverified",
  "debug-breakpoint-log",
  "debug-breakpoint-log-disabled",
  "debug-breakpoint-log-unverified",
  "debug-breakpoint-unsupported",
  "debug-breakpoint-unverified",
  "debug-console",
  "debug-continue-small",
  "debug-continue",
  "debug-coverage",
  "debug-disconnect",
  "debug-hint",
  "debug-line-by-line",
  "debug-pause",
  "debug-rerun",
  "debug-restart",
  "debug-restart-frame",
  "debug-reverse-continue",
  "debug-stackframe",
  "debug-stackframe-active",
  "debug-stackframe-dot",
  "debug-stackframe-focused",
  "debug-start",
  "debug-step-back",
  "debug-step-into",
  "debug-step-out",
  "debug-step-over",
  "debug-stop",
  "desktop-download",
  "device-camera",
  "device-camera-video",
  "device-desktop",
  "device-mobile",
  "diff",
  "diff-added",
  "diff-ignored",
  "diff-modified",
  "diff-removed",
  "diff-renamed",
  "discard",
  "edit",
  "editor-layout",
  "ellipsis",
  "empty-window",
  "error-small",
  "error",
  "exclude",
  "expand-all",
  "export",
  "extensions",
  "eye",
  "eye-closed",
  "eye-unwatch",
  "eye-watch",
  "feedback",
  "file",
  "file-add",
  "file-binary",
  "file-code",
  "file-directory",
  "file-directory-create",
  "file-media",
  "file-pdf",
  "file-submodule",
  "file-symlink-directory",
  "file-symlink-file",
  "file-text",
  "file-zip",
  "files",
  "filter-filled",
  "filter",
  "flame",
  "fold",
  "fold-down",
  "fold-up",
  "folder",
  "folder-active",
  "folder-library",
  "folder-opened",
  "game",
  "gather",
  "gear",
  "gift",
  "gist",
  "gist-fork",
  "gist-new",
  "gist-private",
  "gist-secret",
  "git-branch",
  "git-branch-create",
  "git-branch-delete",
  "git-commit",
  "git-compare",
  "git-fetch",
  "git-fork-private",
  "git-merge",
  "git-pull-request",
  "git-pull-request-abandoned",
  "git-pull-request-closed",
  "git-pull-request-create",
  "git-pull-request-draft",
  "git-pull-request-new-changes",
  "git-pull-request-go-to-changes",
  "github",
  "github-action",
  "github-alt",
  "github-inverted",
  "globe",
  "go-to-file",
  "grabber",
  "graph",
  "graph-left",
  "graph-line",
  "graph-scatter",
  "gripper",
  "group-by-ref-type",
  "heart",
  "history",
  "home",
  "horizontal-rule",
  "hubot",
  "inbox",
  "indent",
  "info",
  "insert",
  "inspect",
  "issue-closed",
  "issue-draft",
  "issue-opened",
  "issue-reopened",
  "issues",
  "italic",
  "jersey",
  "json",
  "kebab-horizontal",
  "kebab-vertical",
  "key",
  "keyboard",
  "law",
  "layers-active",
  "layers-dot",
  "layers",
  "layout-activitybar-left",
  "layout-activitybar-right",
  "layout-centered",
  "layout-menubar",
  "layout-panel-center",
  "layout-panel-justify",
  "layout-panel-left",
  "layout-panel-right",
  "layout-panel",
  "layout-sidebar-left",
  "layout-sidebar-right",
  "layout-statusbar",
  "layout",
  "library",
  "light-bulb",
  "lightbulb",
  "lightbulb-autofix",
  "link",
  "link-external",
  "list-filter",
  "list-flat",
  "list-ordered",
  "list-selection",
  "list-tree",
  "list-unordered",
  "live-share",
  "loading",
  "location",
  "lock-small",
  "lock",
  "log-in",
  "log-out",
  "logo-github",
  "magnet",
  "mail",
  "mail-read",
  "mail-reply",
  "mark-github",
  "markdown",
  "megaphone",
  "mention",
  "menu",
  "merge",
  "mic",
  "mic-filled",
  "microscope",
  "milestone",
  "mirror",
  "mirror-private",
  "mirror-public",
  "more",
  "mortar-board",
  "move",
  "multiple-windows",
  "music",
  "mute",
  "new-file",
  "new-folder",
  "newline",
  "no-newline",
  "note",
  "notebook",
  "notebook-template",
  "octoface",
  "open-preview",
  "organization",
  "organization-filled",
  "organization-outline",
  "output",
  "package",
  "paintcan",
  "pass",
  "pass-filled",
  "pencil",
  "person",
  "person-add",
  "person-filled",
  "person-follow",
  "person-outline",
  "pie-chart",
  "piano",
  "pin",
  "pinned",
  "pinned-dirty",
  "play",
  "play-circle",
  "plug",
  "plus",
  "preserve-case",
  "preview",
  "primitive-dot",
  "primitive-square",
  "project",
  "pulse",
  "question",
  "quote",
  "radio-tower",
  "reactions",
  "record",
  "record-keys",
  "record-small",
  "redo",
  "references",
  "refresh",
  "regex",
  "remote",
  "remote-explorer",
  "remove",
  "remove-close",
  "repl",
  "replace",
  "replace-all",
  "reply",
  "repo",
  "repo-clone",
  "repo-create",
  "repo-delete",
  "repo-force-push",
  "repo-forked",
  "repo-pull",
  "repo-push",
  "repo-sync",
  "report",
  "request-changes",
  "rocket",
  "root-folder",
  "root-folder-opened",
  "rss",
  "ruby",
  "run",
  "run-all",
  "run-above",
  "run-below",
  "run-errors",
  "save",
  "save-all",
  "save-as",
  "screen-full",
  "screen-normal",
  "search",
  "search-save",
  "search-stop",
  "search-fuzzy",
  "selection",
  "send",
  "server",
  "server-environment",
  "server-process",
  "settings",
  "settings-gear",
  "shield",
  "sign-in",
  "sign-out",
  "smiley",
  "sparkle",
  "sort-precedence",
  "source-control",
  "split-horizontal",
  "split-vertical",
  "squirrel",
  "star",
  "star-add",
  "star-delete",
  "star-empty",
  "star-full",
  "star-half",
  "stop",
  "stop-circle",
  "symbol-array",
  "symbol-boolean",
  "symbol-class",
  "symbol-color",
  "symbol-constant",
  "symbol-constructor",
  "symbol-enum",
  "symbol-enum-member",
  "symbol-event",
  "symbol-field",
  "symbol-file",
  "symbol-folder",
  "symbol-function",
  "symbol-interface",
  "symbol-key",
  "symbol-keyword",
  "symbol-method",
  "symbol-misc",
  "symbol-module",
  "symbol-namespace",
  "symbol-null",
  "symbol-number",
  "symbol-numeric",
  "symbol-object",
  "symbol-operator",
  "symbol-package",
  "symbol-parameter",
  "symbol-property",
  "symbol-reference",
  "symbol-ruler",
  "snake",
  "symbol-snippet",
  "symbol-string",
  "symbol-struct",
  "symbol-structure",
  "symbol-text",
  "symbol-type-parameter",
  "symbol-unit",
  "symbol-value",
  "symbol-variable",
  "sync",
  "sync-ignored",
  "tag-add",
  "tag-remove",
  "tag",
  "target",
  "tasklist",
  "telescope",
  "terminal-bash",
  "terminal-cmd",
  "terminal-debian",
  "terminal-linux",
  "terminal-powershell",
  "terminal-tmux",
  "terminal-ubuntu",
  "terminal",
  "text-size",
  "three-bars",
  "thumbsdown",
  "thumbsdown-filled",
  "thumbsup",
  "thumbsup-filled",
  "tools",
  "trash",
  "trashcan",
  "triangle-down",
  "triangle-left",
  "triangle-right",
  "triangle-up",
  "twitter",
  "type-hierarchy",
  "type-hierarchy-sub",
  "type-hierarchy-super",
  "unfold",
  "ungroup-by-ref-type",
  "unlock",
  "unmute",
  "unverified",
  "variable",
  "verified-filled",
  "verified",
  "versions",
  "vm",
  "vm-active",
  "vm-connect",
  "vm-outline",
  "vm-running",
  "vr",
  "warning",
  "watch",
  "whitespace",
  "whole-word",
  "window",
  "word-wrap",
  "workspace-trusted",
  "workspace-unknown",
  "workspace-untrusted",
  "wrench",
  "wrench-subaction",
  "x",
  "zap",
  "zoom-in",
  "zoom-out",
];
