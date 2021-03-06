import * as vscode from 'vscode';
import { AbortedCommandError } from '../../shared/abortedCommandError';
import { processFolderUri } from '../newProject/folderHelper';
import { gitClone } from '../../shared/gitCloner';
import * as fsExtra from "fs-extra";
import { zationClusterStateVersion, zationClusterBrokerVersion } from '../../versions';
import NpmRunner from '../../shared/npmRunner';
import { openProject } from '../../shared/vsCodeUtils';

enum ClusterComponent {
    State,Broker
}

function getClusterComponentPackageName(component : ClusterComponent): string {
    switch(component) {
        case ClusterComponent.State:
            return "zation-cluster-state";
        case ClusterComponent.Broker:
            return "zation-cluster-broker";
    }
}

function getClusterComponentName(component : ClusterComponent): string {
    switch(component) {
        case ClusterComponent.State:
            return "Zation Cluster State";
        case ClusterComponent.Broker:
            return "Zation Cluster Broker";
    }
}

function getClusterComponentVersion(component : ClusterComponent): string {
    switch(component) {
        case ClusterComponent.State:
            return zationClusterStateVersion;
        case ClusterComponent.Broker:
            return zationClusterBrokerVersion;
    }
}

function getClusterComponentHelperText(component : ClusterComponent): string {
    switch(component) {
        case ClusterComponent.State:
            return "You can start the zation-cluster-state server with 'npm start'.";
        case ClusterComponent.Broker:
            return "You can start the zation-cluster-broker server with 'STATE_SERVER_HOST=\"localhost\" node index.js'.";
    }
}

function getClusterComponentGitAddress(component : ClusterComponent) {
    return `direct:https://github.com/ZationServer/${
        getClusterComponentPackageName(component)}.git#${getClusterComponentVersion(component)}`;
}

export async function cloneClusterComponent() {

    const componentType = (await vscode.window.showQuickPick(
        [
            { label: 'State Server', description: 'Clones the zation-cluster-state server.', target: ClusterComponent.State},
            { label: 'Broker Server', description: 'Clones the zation-cluster-broker server.', target: ClusterComponent.Broker}
        ],{
            matchOnDescription: true,
            placeHolder: "Which type of cluster component do you want to clone?",
        },
    ))?.target;

    if(componentType === undefined) {
        throw new AbortedCommandError();
    }

    const [destUri,preprocessFolder] = (await processFolderUri(getClusterComponentPackageName(componentType)));
    const destFolder = destUri?.fsPath;
    if(destUri === undefined || destFolder === undefined) { throw new AbortedCommandError(); }


    const startTimeStamp = Date.now();
    await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: `Clone: ${getClusterComponentName(componentType)} `,
        cancellable: false
    },async (progress) => {
        await new Promise<void>(r => setInterval(() => r(),50));
        progress.report({message: "Prepare folder..." });
        preprocessFolder();
        fsExtra.ensureDirSync(destFolder);
        progress.report({increment : 10});

        progress.report({message: "Clone..." });
        try {
            await gitClone(getClusterComponentGitAddress(componentType),destFolder);
        }
        catch (e) {
            vscode.window.showErrorMessage(`Failed to clone repository: ${e.toString()}`);
            return;
        }
        progress.report({increment : 20});

        progress.report({ message: "Install dependencies..." });

        let installIncrement = 0;
        try {
            await NpmRunner.installDependencies(destFolder,() => {
                if(installIncrement < 70){
                    let addIncrement = Math.random() * 15;
                    installIncrement += addIncrement;
                    if(installIncrement > 70) { installIncrement = 70 - installIncrement; }
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
    vscode.window.showInformationMessage(`The ${getClusterComponentName(componentType)} cloned in ${timeSeconds}s. 🎉`);
    vscode.window.showInformationMessage(getClusterComponentHelperText(componentType));
    vscode.window.showInformationMessage("Open folder in 4 seconds...");

    await new Promise<void>(r => setInterval(() => r(),4000));

    openProject(destUri);
}