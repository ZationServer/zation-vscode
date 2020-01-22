import * as vscode from 'vscode';
import * as fs from "fs";
import * as path from "path";
import { fsPath } from '../../shared/fsUtils';
import { AbortedCommandError } from '../../shared/abortedCommandError';

export async function processProjectFolderUri(projectName : string) : Promise<vscode.Uri | undefined> {
    const folders = await vscode.window.showOpenDialog({ canSelectFolders: true, openLabel: "Select a folder to create the project in" });
    if (!folders || folders.length !== 1) {
        throw new AbortedCommandError();
    }
    const folderUri = folders[0];
    const projectFolderUri = vscode.Uri.file(path.join(fsPath(folderUri), projectName));

    if (fs.existsSync(fsPath(projectFolderUri))) {
        vscode.window.showErrorMessage(`A folder named ${projectName} already exists in ${fsPath(folderUri)}`);
        throw new AbortedCommandError(true);
    }        
    return projectFolderUri;
}