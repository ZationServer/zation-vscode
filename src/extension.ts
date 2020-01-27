import * as vscode from 'vscode';
import { createNewProject } from './commands/newProject/createNewProject';
import { cloneClusterComponent } from './commands/cloneClusterComponent/cloneClusterComponent';
import { showVersions } from './commands/showVersions/showVersions';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.commands.registerCommand('zation.NewProject',createNewProject));
	context.subscriptions.push(vscode.commands.registerCommand('zation.CloneClusterComponent',cloneClusterComponent));
	context.subscriptions.push(vscode.commands.registerCommand('zation.ShowVersions',showVersions));
}

export function deactivate() {}
