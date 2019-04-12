/********************
 * @Name：menu_scene
 * @Describe：游戏菜单
 * @Author：王全由
 * @Date：2019.03.28
 ********************/

import myApp from "../myApp";
import dataConst from "../data/dataConst";
import AudioManager from "../manager/audioManager";
import audioData from "../data/audioData";
const { ccclass, property } = cc._decorator;

@ccclass
export default class menuScene extends cc.Component {

    @property(cc.Prefab)
    marioJunp: cc.Prefab = null;

    @property([cc.Node])
    select: cc.Node[] = [];

    @property(cc.Node)
    audioManager: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.select[0].active = true;
        this.select[1].active = false;
        let AudioManager:AudioManager = this.audioManager.getComponent("audioManager");
        AudioManager.playMusic(audioData.data[0].id);
    }

    start() {
        this.loadDongXiao();
    }

    btnDir() {
        this.select[0].active = !this.select[0].active;
        this.select[1].active = !this.select[1].active;
    }

    loadDongXiao() {
        //加载循环预制
        cc.loader.loadRes("uiPrefab/tx_menu", cc.Prefab, (error: Error, prefab) => {
            let ui = cc.instantiate(prefab);
            ui.parent = this.node;
            let height = -(this.node.height * 0.32/*0.3515625*/);
            ui.setPosition(cc.v2(-210, height));
        });
    }

    changeScene(event) {
        //切换场景，开始游戏
        myApp.getInstance().checkStr = dataConst.CHECK[0].checkStr;
        myApp.getInstance().checkNum = dataConst.CHECK[0].checkNum;
        if (this.select[0].active) {
            myApp.getInstance().playerNum = dataConst.ONE_PLAYER;
            cc.director.loadScene("game_scene");
        }
        if (this.select[1].active) {
            myApp.getInstance().playerNum = dataConst.TWO_PLAYER;
            console.log("开发中");
        }
    }

    exitGame(event) {
        //B，退出游戏
        cc.game.end();
    }
    // update (dt) {}
}
