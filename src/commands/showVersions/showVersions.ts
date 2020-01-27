import * as vscode from 'vscode';
import { zationServerVersion, zationClientVersion, zationAssuredVersion, zationClusterStateVersion, zationClusterBrokerVersion } from '../../versions';

export function showVersions() {
    vscode.window.showInformationMessage(
   `Zation Server Version: ${zationServerVersion}, Zation Client Version: ${zationClientVersion}, Zation Assured version: ${zationAssuredVersion}, Zation Cluster State version: ${zationClusterStateVersion}, Zation Cluster Broker version: ${zationClusterBrokerVersion}`);
}