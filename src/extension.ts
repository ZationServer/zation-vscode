/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import * as vscode from 'vscode';
import { createNewProject } from './commands/newProject/createNewProject';
import { showVersions } from './commands/showVersions/showVersions';
import {callCommandSafe} from "./shared/commandCaller";

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.commands.registerCommand('zation.NewProject',
		() => callCommandSafe(createNewProject)));

	context.subscriptions.push(vscode.commands.registerCommand('zation.ShowVersions',
		() => callCommandSafe(showVersions)));
}

export function deactivate() {}
