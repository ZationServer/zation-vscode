/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import * as vscode from 'vscode';
import {AbortedCommandError} from "./abortedCommandError";

export async function callCommandSafe<T extends (...args: any[]) => Promise<void> | void>(command: T, ...args: Parameters<T>) {
    try {
        await command(...args);
    }
    catch(e) {
        if(e instanceof AbortedCommandError) {
            if(!e.Silent) {
                vscode.window.showWarningMessage("Command aborted.");
            }
        }
        else {
            vscode.window.showErrorMessage("Unknown error: " + e.toString());
        }
    }
}