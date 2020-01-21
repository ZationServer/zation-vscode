import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('zation.NewProject', () => {
		vscode.window.showInformationMessage('This feature is in development.');
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
