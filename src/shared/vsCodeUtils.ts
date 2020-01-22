import * as vscode from 'vscode';

export function openProject(workspacePath : vscode.Uri) {
    const hasFoldersOpen = !!(vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length);
    vscode.commands.executeCommand("vscode.openFolder", workspacePath, hasFoldersOpen);
}