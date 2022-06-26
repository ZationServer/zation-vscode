/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import * as vscode from 'vscode';
import { ProjectType } from './projectDefinitions';
import { createNewServerProject } from './createNewServerProject';
import { createNewClientProject } from './createNewClientProject';
import { AbortedCommandError } from '../../shared/abortedCommandError';

export async function createNewProject(): Promise<void> {

    const projectType = (await vscode.window.showQuickPick(
        [
            { label: 'Server', description: 'Creates a new Zation server project.', target: ProjectType.Server},
            { label: 'Client', description: 'Creates a new Zation client project.', target: ProjectType.Client}
        ],{
            matchOnDescription: true,
            placeHolder: "Which type of project do you want to create?",
        },
    ))?.target;

    switch(projectType){
        case ProjectType.Server:
            await createNewServerProject();
        break;
        case ProjectType.Client:
            await createNewClientProject();
        break;
        default: throw new AbortedCommandError();
    }
}