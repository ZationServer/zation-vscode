import * as vscode from 'vscode';
import { createNewProject } from './commands/newProject/createNewProject';

export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('zation.NewProject',createNewProject);

	context.subscriptions.push(disposable);
}

export function deactivate() {}
