import { exec } from 'child_process';
import express from 'express'
import fs from "fs";
import path from "path";
import date from 'date-and-time'
import { getDataHome } from 'platform-folders'
import { getLocalCommitSha } from "../updater"

const dateFormat = "HH:mm:ss DD/MM/YYYY"
const fileDateFormat = "HH-mm-ss_DD-MM-YYYY"
const serverStartDate = new Date()

namespace server {
  export async function log (message: string, options?: {type?: "info" | "warn" | "error", name?: string}) {
    const appDataLoc = path.join(getDataHome(), `/micro-backend`);
    const logsDir = path.join(appDataLoc, "/logs")
    const callerLocArr = getCallerPath(1)?.split("\\") as Array<String>;
    const callerFile = callerLocArr[callerLocArr.length - 1] || "unknown";
    const callerName = options?.name;
    const type = options?.type || "info";
    const dateNow = new Date();
  
    if (!fs.existsSync(appDataLoc)) fs.mkdirSync(appDataLoc)
    if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir)
    const fullMessage = `[${type.toUpperCase()} | ${callerName ? callerName + "/" : ""}${callerFile}](${date.format(dateNow, `${dateFormat}`, true)}): ${message}`;
    const logLoc = path.join(logsDir, `/${date.format(serverStartDate, `[${(await getLocalCommitSha()).slice(0, 7)}] ${fileDateFormat}`, true)}.txt`);
  
    fs.appendFile(
      logLoc, 
      fullMessage + "\n", 
      (err) => {
        if (err) console.log(fullMessage + "\n", err)
        else console.log(fullMessage)
      }
    )
  }

  export async function error (res: express.Response, status: number, errors: String[]) {
    const error = {
      errors
    }
    res.status(status).json(error)
  }

  export async function sh(command: String): Promise<String> {
    return new Promise((res, rej) => {
      exec(`git --git-dir "${path.join(__dirname, '../../.git')}" rev-parse HEAD`, (err, stdOut, stdErr) => {
        if (err) rej(err);
        if (stdErr) rej(new Error(stdErr.trim()));
        res(stdOut.trim());
      });
    })
  }
}

export default server

function getCallerPath(depth: number) {
  let stack = new Error().stack?.split('\n') as Array<String>
  return stack[2 + depth].slice(
    stack[2 + depth].lastIndexOf('(') + 1, 
    stack[2 + depth].lastIndexOf('.ts') + 3
  )
}