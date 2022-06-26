/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import * as vscode from 'vscode';
import {
    zationServerVersion,
    zationClientVersion,
    zationAssuredVersion,
    zationStateVersion,
    zationBrokerVersion,
    zationBundleVersion
} from '../../versions';

export function showVersions() {
    vscode.window.showInformationMessage(
   `Zation bundle: ${zationBundleVersion}, Zation server: ${zationServerVersion}, Zation client: ${zationClientVersion}, Zation assured: ${zationAssuredVersion}, Zation state: ${zationStateVersion}, Zation broker: ${zationBrokerVersion}`);
}