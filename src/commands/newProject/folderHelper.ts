/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import * as vscode from 'vscode';
import * as fs from "fs";
import * as path from "path";
import { fsPath } from '../../shared/fsUtils';
import { AbortedCommandError } from '../../shared/abortedCommandError';
import * as emptyDir from "empty-dir";
import { askYesOrNo } from '../../shared/inputHelper';
import * as fsExtra from "fs-extra";

export async function processFolderUri(projectName : string) : Promise<[vscode.Uri | undefined,() => void]> {
    const folders = await vscode.window.showOpenDialog({ canSelectFolders: true });
    if (!folders || folders.length !== 1) {
        throw new AbortedCommandError();
    }
    const folderUri = folders[0];

    const newFolder = await askYesOrNo('Do you want to create a new folder for the project?');
    const uri = vscode.Uri.file(newFolder ? path.join(fsPath(folderUri), projectName) : fsPath(folderUri));
    const folderPath = fsPath(uri);

    let emptyFolder = false;
    if(newFolder) {
        if (fs.existsSync(folderPath)) {
            if(await askYesOrNo(`A folder named ${projectName} already exists! Do you want to override the folder?`)) 
                emptyFolder = true;
            else throw new AbortedCommandError(true);
        }     
    }
    else {
        if(!emptyDir.sync(folderPath)) {
            if(await askYesOrNo('The folder is not empty! Do you want to empty it?')) 
                emptyFolder = true;
            else throw new AbortedCommandError(true);
        }
    }


    return [uri,emptyFolder ? () => {
        try {
            fsExtra.emptyDirSync(folderPath);
        }
        catch(_) {
            vscode.window.showErrorMessage(`Failed to empty existing directory at ${folderPath
                }.\nThis directory may be used by another program or you may not have the permission to empty it.`)
            throw new AbortedCommandError(true);
        }
    } : () => {}];
}