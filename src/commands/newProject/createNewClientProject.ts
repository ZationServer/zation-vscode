import * as vscode from 'vscode';
import { processFolderUri } from './folderHelper';
import { AbortedCommandError } from '../../shared/abortedCommandError';
import { askRequiredInput, askOptionalInput } from '../../shared/inputHelper';
import TemplateEngine from '../../shared/templateEngine';
import { versions } from '../../versions';
import * as fsExtra from "fs-extra";
import { copyDirRecursive } from '../../shared/fsUtils';
import { clientTemplateDir } from '../../shared/constants';
import NpmRunner from '../../shared/npmRunner';
import { openProject } from '../../shared/vsCodeUtils';
import {toPascalCase} from "../../shared/stringUtils";

enum ClientProjectType {
    Web,
    Node
}

function getClientTemplateDir(type : ClientProjectType) : string {
    switch(type) {
        case ClientProjectType.Node:
            return clientTemplateDir + "/node";
        case ClientProjectType.Web:
            return clientTemplateDir + "/web";
    }
}

export async function createNewClientProject() {

    const projectType = (await vscode.window.showQuickPick(
        [
            { label: 'Web', description: 'Creates an web client typescript project with webpack.', target: ClientProjectType.Web},
            { label: 'Node', description: 'Creates an client typescript project with gulp.', target: ClientProjectType.Node}
        ],{
            matchOnDescription: true,
            placeHolder: "Which type of client project do you want to create?",
        },
    ))?.target;
    if(projectType === undefined) { throw new AbortedCommandError(); }

    const name = await askRequiredInput("Enter a name for your new project");
    const pascalCaseName = toPascalCase(name);

    const [destUri,preprocessFolder] = (await processFolderUri(pascalCaseName));
    const destFolder = destUri?.fsPath;
    if(destUri === undefined || destFolder === undefined) { throw new AbortedCommandError(); }

    const description = await askOptionalInput("Enter a description",`The package ${pascalCaseName}...`);
    const author = await askOptionalInput("Enter author");
    const git = await askOptionalInput("Enter git repository");

    const serverHost = await askOptionalInput("Enter the server host","localhost");
    const serverPort = Number.parseInt(await askOptionalInput("Enter the server port","3000"))?.toString();

    const templateEngine = new TemplateEngine({
        name,
        description,
        author : author !== undefined ? `\n  "author" : "${author}", ` : '',
        git : git !== undefined ? `\n  "repository": {\n    "type": "git",\n    "url": "${git}"\n  },` : '',
        serverHost,
        serverPort,
        ...versions
    });

    const startTimeStamp = Date.now();
    await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: `Create Project: ${name} `,
        cancellable: false
    },async (progress) => {
        progress.report({message: "Prepare folder..." });
        preprocessFolder();
        fsExtra.ensureDirSync(destFolder);
        progress.report({increment : 5});

        progress.report({message: "Copy template files..." });
        try {
            copyDirRecursive(getClientTemplateDir(projectType),destFolder);
        }
        catch (e) {
            vscode.window.showErrorMessage(`Failed to copy template files: ${e.toString()}`);
            return;
        }
        progress.report({increment : 5});

        progress.report({ message: "Template files..." });

        await templateEngine.templateFiles([
            `${destFolder}/src/index.ts`,
            `${destFolder}/package.json`,
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
    vscode.window.showInformationMessage(`Zation client app: '${name}' created in ${timeSeconds}s. 🎉`);
    vscode.window.showInformationMessage("You can start the client with the command: 'npm start'.");
    vscode.window.showInformationMessage("Open project in 4 seconds...");

    await new Promise(r => setInterval(() => r(),4000));

    openProject(destUri);

}