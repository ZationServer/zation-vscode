import * as vscode from 'vscode';
import { processProjectFolderUri } from './folderHelper';
import { AbortedCommandError } from '../../shared/abortedCommandError';
import TemplateEngine from '../../shared/templateEngine';
import { copyDirRecursive } from '../../shared/fsUtils';
import { serverTemplateDir } from '../../shared/constants';
import * as fsExtra from "fs-extra";
import {versions} from "../../versions";
import NpmRunner from "./../../shared/npmRunner";
import { askRequiredInput, askOptionalInput } from '../../shared/inputHelper';
import { openProject } from '../../shared/vsCodeUtils';
import {toPascalCase} from "../../shared/stringUtils";

export async function createNewServerProject() {

    const name = await askRequiredInput("Enter a name for your new project");

    const destUri = (await processProjectFolderUri(name));
    const destFolder = destUri?.fsPath;
    if(destUri === undefined || destFolder === undefined) { throw new AbortedCommandError(); }

    const description = await askOptionalInput("Enter a description",`The package ${toPascalCase(name)}...`);
    const author = await askOptionalInput("Enter author");
    const port = Number.parseInt(await askOptionalInput("Enter a port","3000"))?.toString();
    const git = await askOptionalInput("Enter git repository");

    const templateEngine = new TemplateEngine({
        name,
        description,
        author : author !== undefined ? `\n  "author" : "${author}", ` : '',
        port,
        git : git !== undefined ? `\n  "repository": {\n    "type": "git",\n    "url": "${git}"\n  },` : '',
        ...versions
    });

    const startTimeStamp = Date.now();
    await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: `Create Project: ${name} `,
        cancellable: false
    },async (progress) => {
        progress.report({message: "Create folder..." });
        fsExtra.ensureDirSync(destFolder);
        progress.report({increment : 5});

        progress.report({message: "Copy template files..." });
        try {
            copyDirRecursive(serverTemplateDir,destFolder);
        }
        catch (e) {
            vscode.window.showErrorMessage(`Failed to copy template files: ${e.toString()}`);
            return;
        }
        progress.report({increment : 5});

        progress.report({ message: "Template files..." });

        await templateEngine.templateFiles([
            `${destFolder}/src/configs/main.config.ts`,
            `${destFolder}/src/configs/starter.config.ts`,
            `${destFolder}/src/index.ts`,
            `${destFolder}/package.json`,
            `${destFolder}/Dockerfile`
        ],async (i,length) => {
            progress.report({ increment: 30 / length, message: `Template file (${i}/${length})` });
        });

        progress.report({ message: "Install dependencies..." });

        let installIncrement = 0;
        try {
            await NpmRunner.installDependencies(destFolder,() => {
                if(installIncrement < 60){
                    let addIncrement = Math.random() * 10;
                    installIncrement += addIncrement;
                    if(installIncrement > 60) { installIncrement = 60 - installIncrement; }
                    progress.report({ increment : addIncrement});
                }
            });
        }
        catch(e) {
            vscode.window.showErrorMessage(`Failed to install dependencies: ${e.toString()}`);
            return;
        }
    });

    const timeSeconds = ((Date.now() - startTimeStamp) / 1000).toFixed(1);
    vscode.window.showInformationMessage(`Zation server app: '${name}' created in ${timeSeconds}s. 🎉`);
    vscode.window.showInformationMessage("You can start the server with the command: 'npm start'.");
    vscode.window.showInformationMessage("Open project in 4 seconds...");

    await new Promise(r => setInterval(() => r(),4000));

    openProject(destUri);
}