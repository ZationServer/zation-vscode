/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import * as path from "path";

export const isWin = /^win/.test(process.platform);
export const isMac = process.platform === "darwin";
export const isLinux = !isWin && !isMac;

export const templateDir = path.resolve(__dirname + '/../../templates');

export const serverTemplateDir = templateDir + "/server";
export const clientTemplateDir = templateDir + "/client";
