import { bedrockServer } from "bdsx/launcher"
import { config } from "./config"
import * as fs from "fs-extra"
import * as path from "path"
import { exec } from "child_process"
import { CommandResultType } from "bdsx/commandresult"
import * as rimraf from "rimraf"

export const copyWorld = async () => {
    if (config.noticeToPlayer) bedrockServer.level.getPlayers().forEach(player => player.sendMessage("§lStart Backup..."))
    bedrockServer.executeCommand("save hold")
    console.log(`[Git-Backup][${getDate()}] Start Backup...(0/3)`)
    await queryPromise()
    console.log(`[Git-Backup][${getDate()}] Finish query(1/3)`)
    console.log(`[Git-Backup][${getDate()}] Start to copy the world...(1/3)`)
    if (fs.existsSync(path.resolve(__dirname, "./backup/Bedrock level"))) {
        await rmDir(path.resolve(__dirname, "./backup/Bedrock level"))
    }
    await fs.copy(path.resolve(__dirname, `../../bedrock_server/worlds/${config.worldName}`), path.resolve(__dirname, "./backup/Bedrock level/"))
    console.log(`[Git-Backup][${getDate()}] Finish copying(2/3)`)
    console.log(`[Git-Backup][${getDate()}] Start adding to Git...(2/3)`)
    if (!fs.existsSync(path.resolve(__dirname, "./backup/.git"))) {
        await execPromise(`cd ${path.resolve(__dirname, "./backup")} && git init && git remote add origin ${config.githubUrl} && git branch -M main`)
    }
    try {
        await execPromise(`cd ${path.resolve(__dirname, "./backup")} && git add . && git commit -m "[AutoBackup] ${getDate()}" && git push origin main`)
    } catch (e) {
        console.log(e)
    }
    bedrockServer.executeCommand("save resume")
    console.log(`[Git-Backup][${getDate()}] Finish ALL Backup!(3/3)`)
    if (config.noticeToPlayer) bedrockServer.level.getPlayers().forEach(player => player.sendMessage("§lFinish Backup!"))
}

const queryPromise = (waitMs: number = 100): Promise<void> => {
    return new Promise(r => {
        const timer = setInterval(() => {
            const result = bedrockServer.executeCommand("save query", CommandResultType.Data)
            if (result.data.statusCode === 0) {
                clearInterval(timer)
                r()
            }
        }, waitMs)
    })
}

const execPromise = (cmd: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        exec(cmd, (err, stdout, stderr) => {
            if (err) {
                reject(stderr)
            } else {
                resolve(stdout)
            }
        })
    })
}

const getDate = () => {
    const date = new Date()
    const y = date.getFullYear()
    const m = date.getMonth() + 1
    const d = date.getDate()
    const h = date.getHours()
    const min = date.getMinutes()
    const s = date.getSeconds()

    return `${y}${m.toString().length == 1 ? "0" : ""}${m}${d.toString().length == 1 ? "0" : ""}${d}-${h.toString().length == 1 ? "0" : ""}${h}${min.toString().length == 1 ? "0" : ""}${min}${s.toString().length == 1 ? "0" : ""}${s}`
}

const rmDir = (path: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        rimraf(path, (err) => {
            if (err) reject(err)
            else resolve()
        })
    })
} 
