import * as vscode from 'vscode';
import { AbortedCommandError } from './abortedCommandError';

export async function askYesOrNo(msg: string): Promise<boolean> {
    return (await vscode.window.showQuickPick(['Yes','No'],{placeHolder: msg})) === 'Yes';
}

export async function askRequiredInput(prompt : string,placeHolder : string = "...") : Promise<string> {
    let value : string | undefined = "";
    while(value === "") {
        value = await vscode.window.showInputBox({ prompt: prompt + " (Required)", placeHolder});
        if(value === undefined) { throw new AbortedCommandError(); }
    }
    return value;
}

export async function askOptionalInput(prompt : string,defaultValue : string,placeHolder ?: string) : Promise<string>;
export async function askOptionalInput(prompt : string,defaultValue ?: undefined,placeHolder ?: string) : Promise<string | undefined>;
export async function askOptionalInput(prompt : string,defaultValue : string | undefined,placeHolder : string = "...") : Promise<string | undefined> {
    let value = await vscode.window.showInputBox({ 
            prompt: prompt + " (Optional)",
            placeHolder : defaultValue !== undefined ? defaultValue : placeHolder
        });
    if(value === undefined) {
        throw new AbortedCommandError();
    }
    return value === "" ? defaultValue : value;
}
