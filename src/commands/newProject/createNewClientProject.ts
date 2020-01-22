import * as vscode from 'vscode';
import { processProjectFolderUri } from './folderHelper';
import { AbortedCommandError } from '../../shared/abortedCommandError';

enum ClientProjectType {
    Web,
    Node
}

export async function createNewClientProject() {

    const projectType = (await vscode.window.showQuickPick(
        [
            { label: 'Web', description: 'Creates an web client typescript project with webpack.', target: ClientProjectType.Web},
            { label: 'Node', description: 'Creates an client typescript project with gulp.', target: ClientProjectType.Node}
        ],{
            matchOnDescription: true,
            placeHolder: "What type of client project do you want to create?",
        },
    ))?.target;

    if(projectType === undefined) { throw new AbortedCommandError(); }

    const name = await vscode.window.showInputBox({ prompt: "Enter a name for your new project", placeHolder: "helloWorld"});    
    if (!name) { throw new AbortedCommandError(); }

    const projectUri = await processProjectFolderUri(name);

    


}