<p align="center">
<img src="https://raw.githubusercontent.com/AnWeber/vscode-mani/main/icon.png" alt="mani - Project Manager" />
</p>


# mani - Project Manager

Manage your local Projects using vscode and [mani](https://github.com/alajmo/mani).

## Features

- Manage Projects (Autodiscover Projects, Create `mani.yml`) 
- Organize your projects using Tags
- Open projects in the same or new window
- Add projects to workspace
- Execute Tasks and Commands in all or some projects
- View Git Branches of your Project and Open Workspace for Projects with same Branch Name 


![Preview](https://raw.githubusercontent.com/AnWeber/vscode-mani/main/docs/preview.png)

## How to Setup

If you already did use `mani`, you are ready to go. If not you need to create a `mani.yaml` using command `mani.init` in VSCode or using `mani init` in Shell. This commands let you create a new mani.yaml.

You also should install [mani](https://github.com/alajmo/mani?tab=readme-ov-file#installation) in a global path to use all Features.

> mani can be used to backup your local git projects setup. I would recommend putting the file [in a `.dotfiles` repo](https://www.atlassian.com/git/tutorials/dotfiles).


## Use Cases

### Open Project

![Open Project](https://raw.githubusercontent.com/AnWeber/vscode-mani/main/docs/openProject.gif)


### Open Workspace for Projects with same Branch or Tag

![Open Workspace for Projects with Tag](https://raw.githubusercontent.com/AnWeber/vscode-mani/main/docs/addToWorkspace.gif)

### Execute Command for all Projects with Tag

![Execute Command for Tag](https://raw.githubusercontent.com/AnWeber/vscode-mani/main/docs/executeCommandForTag.gif)

### Set Icon for Project

![Set Icon for Project](https://raw.githubusercontent.com/AnWeber/vscode-mani/main/docs/setIcon.gif)


## License
[MIT License](LICENSE)