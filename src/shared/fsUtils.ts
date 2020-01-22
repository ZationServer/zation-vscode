import * as path from "path";
import * as fsExtra from "fs-extra";
import { isWin } from "./constants";
import * as vscode from 'vscode';

export function fsPath(uri: { fsPath: string } | string) {
	return forceWindowsDriveLetterToUppercase(typeof uri === "string" ? uri : uri.fsPath);
}

export function forceWindowsDriveLetterToUppercase(p: string): string {
	if (p && isWin && path.isAbsolute(p) && p.charAt(0) === p.charAt(0).toLowerCase()) {
		p = p.substr(0, 1).toUpperCase() + p.substr(1);
	}
	return p;
}

export function copyDirRecursive(source : string,destination : string) {
    fsExtra.copySync(source,destination);
}