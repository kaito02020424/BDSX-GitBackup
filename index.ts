import { events } from "bdsx/event";
import { config } from "./config";
import { copyWorld } from "./functions";
import { bedrockServer } from "bdsx/launcher";

let joinedPlayer: boolean = false
let lastBackup:number = 0
let timer:NodeJS.Timeout;
events.serverOpen.on(async () => {
    if (config.launchBackup) {
        await copyWorld()
        lastBackup = Date.now()
    }
    timer = setInterval(async () => {
        if (Date.now() - lastBackup > config.backupSettings.backupIntervalSec * 1000 && (!config.backupSettings.checkJoinedPlayer || (config.backupSettings.checkJoinedPlayer && joinedPlayer))) {
            await copyWorld()
            joinedPlayer = bedrockServer.level.getPlayers().length >= 1 ? true : false
            lastBackup = Date.now()
        }
    }, config.backupSettings.checkSec * 1000)
})

events.serverLeave.on(() => {
    clearInterval(timer)
})

events.playerJoin.on(() => {
    joinedPlayer = true;
})
