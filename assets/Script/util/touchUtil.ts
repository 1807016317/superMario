import dataConst from "../data/dataConst";
import myApp from "../myApp";
import EventManager from "../manager/EventManager";
import UIUtil from "./uiUtil";

/********************
 * @Name：btnUtil
 * @Describe：游戏界面按键操作
 * @Author：王全由
 * @Date：2019.03.29
 ********************/

const { ccclass, property } = cc._decorator;

@ccclass
export default class btnUtil extends cc.Component {

    @property([cc.Node])
    touchNode: cc.Node[] = [];

    // LIFE-CYCLE CALLBACKS:
    private _player1Control: any = null;

    // onLoad () {}

    onEnable() {
        this.touchNode[0].on(cc.Node.EventType.TOUCH_START, this.dirUp, this);//上
        this.touchNode[1].on(cc.Node.EventType.TOUCH_START, this.dirDown, this);//下
        this.touchNode[2].on(cc.Node.EventType.TOUCH_START, this.dirLeft, this);//左
        this.touchNode[3].on(cc.Node.EventType.TOUCH_START, this.dirRight, this);//右
        this.touchNode[4].on(cc.Node.EventType.TOUCH_START, this.btnA, this);//A
        this.touchNode[5].on(cc.Node.EventType.TOUCH_START, this.btnB, this);//B

        this.node.on(cc.Node.EventType.TOUCH_END, this.changePlayerState, this, true);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.changePlayerState, this, true);
    }

    start() {
        let player1: cc.Node = myApp.getInstance().player1Node;
        this._player1Control = player1.getComponent("player1Control");
    }

    /**
     * 打开控制台
     */
    gameControl() {
        UIUtil.loadGM();
    }

    changePlayerState() {
        this._player1Control.moveState_1 = dataConst.STOP;
        console.log(this._player1Control.moveState_1);
    }

    gamePause() {
        //游戏暂停
        if (cc.game.isPaused()) {
            cc.game.resume();
            return;
        }
        cc.game.pause();
    }

    exitGame(event) {
        //退出游戏
        EventManager.getInstance().deleteAllEvent();
        cc.game.restart();
    }

    dirUp() {
        if (this._player1Control.isJump == true) {
            return;
        }
        this._player1Control.isJump = true;
        this._player1Control.direction_1 = dataConst.UP;
        this._player1Control.moveState_1 = dataConst.MOVE;
        console.log(this._player1Control.moveState_1);
    }

    dirDown() {
        //this._player1Control.direction_1 = dataConst.DOWN;
        this._player1Control.moveState_1 = dataConst.MOVE;

    }

    dirLeft() {
        this._player1Control.direction_1 = dataConst.LEFT;
        this._player1Control.moveState_1 = dataConst.MOVE;
    }

    dirRight() {
        this._player1Control.direction_1 = dataConst.RIGHT;
        this._player1Control.moveState_1 = dataConst.MOVE;
    }

    btnA() {
        //攻击
        if (this._player1Control.state_1 == dataConst.COMBATABLE) {

        }
    }

    btnB() {
        //跳跃
        if (this._player1Control.isJump == true) {
            return;
        }
        this._player1Control.isJump = true;
        this._player1Control.direction_1 = dataConst.UP;
        this._player1Control.moveState_1 = dataConst.MOVE;
    }

    // update (dt) {}
}
