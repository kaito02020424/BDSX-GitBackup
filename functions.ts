import { bedrockServer } from "bdsx/launcher"
import { config } from "./config"
import * as fs from "fs-extra"
import * as path from "path"
import { exec } from "child_process"
import { CommandResultType } from "bdsx/commandresult"

export const copyWorld = async () => {
    if (config.noticeToPlayer) bedrockServer.level.getPlayers().forEach(player => player.sendMessage("§lStart Backup..."))
    bedrockServer.executeCommand("save hold")
    await queryPromise()
    if (fs.existsSync(path.resolve(__dirname, "./backup/Bedrock level"))) {
        fs.rmdir(path.resolve(__dirname, "./backup/Bedrock level"))
    }
    fs.mkdirSync(path.resolve(__dirname, "./backup/Bedrock level"))
    fs.copySync(path.resolve(__dirname, `../../bedrock_server/worlds/${config.worldName}`), path.resolve(__dirname, "./backup/Bedrock level"))
    if (!fs.existsSync(path.resolve(__dirname, "./backup/.git"))) {
        await exec(`cd ${path.resolve(__dirname, "./backup")} && git init && git remote add origin ${config.githubUrl} && git branch -M main`)
    }
    await exec(`cd ${path.resolve(__dirname, "./backup")} && git add . && git commit -m "[AutoBackup] ${getDate()}" && git push origin main`)
    bedrockServer.executeCommand("save resume")
    if (config.noticeToPlayer) bedrockServer.level.getPlayers().forEach(player => player.sendMessage("§lFinish Backup!"))
}

export const queryPromise = (waitMs: number = 100): Promise<void> => {
    return new Promise(r => {
        const timer = setInterval(() => {
            const result = bedrockServer.executeCommand("save query",CommandResultType.Data)
            if (result.data.statusCode === 0) {
                clearInterval(timer)
                r()
            }
        }, waitMs)
    })
}

export const execPromise = (cmd: string): Promise<string> => {
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

export const getDate = () => {
    const date = new Date()
    const y = date.getFullYear()
    const m = date.getMonth() + 1
    const d = date.getDate()
    const h = date.getHours()
    const min = date.getMinutes()
    const s = date.getSeconds()

    return `${y}${m}${d}-${h}${min}${s}`
}
