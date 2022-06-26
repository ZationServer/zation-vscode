/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import * as vscode from 'vscode';

export function openProject(workspacePath : vscode.Uri) {
    const hasFoldersOpen = !!(vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length);
    vscode.commands.executeCommand("vscode.openFolder", workspacePath, hasFoldersOpen);
}