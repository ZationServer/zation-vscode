import * as vscode from 'vscode';
import { createNewProject } from './commands/newProject/createNewProject';
import { cloneClusterComponent } from './commands/cloneClusterComponent/cloneClusterComponent';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.commands.registerCommand('zation.NewProject',createNewProject));
	context.subscriptions.push(vscode.commands.registerCommand('zation.CloneClusterComponent',cloneClusterComponent));
}

export function deactivate() {}
