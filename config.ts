export const config: {
    launchBackup: boolean  //起動時にバックアップを行うか
    githubUrl: string,  //GitHubのリポジトリURL(サーバーからアクセスするため,SSHでの認証が使いやすい.)
    worldName: string,  // bedrock_server/worlds/以下の,対象level
    noticeToPlayer: boolean,  //バックアップ開始/終了をプレイヤー全員に通知するか
    backupSettings: {
        checkSec: number,  //バックアップができるかを確認する間隔(backupIntervalSecの3分の1程度を推奨)
        backupIntervalSec: number,  //バックアップ同士の間隔
        checkJoinedPlayer: boolean  //プレイヤーが入っていたワールドのみバックアップを行うか
    },
    platform?: "windows" | "linux",  //サーバーのplatformを指定(default:"windows")
    gitPath?: string  //platform == "linux"のとき,gitのPathを指定(設定がない場合,default:"Z:\usr\bin\git")
} = {
    launchBackup: true,
    githubUrl: "",
    worldName: "",
    noticeToPlayer: true,
    backupSettings: {
        checkSec: 60 * 3,
        backupIntervalSec: 60 * 60,
        checkJoinedPlayer: true
    },
    platform: "windows",
    gitPath: undefined
}
