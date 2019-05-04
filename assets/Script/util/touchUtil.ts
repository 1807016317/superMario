/********************
 * @Name：btnUtil
 * @Describe：游戏界面按键操作
 * @Author：王全由
 * @Date：2019.03.29
 ********************/
import dataConst from "../data/dataConst";
import myApp from "../myApp";
import EventManager from "../manager/EventManager";
import UIUtil from "./uiUtil";
import EventConst from "../data/EventConst";
import nodePool from "./nodePool";

const { ccclass, property } = cc._decorator;

@ccclass
export default class btnUtil extends cc.Component {

    @property([cc.Node])
    touchNode: cc.Node[] = [];

    // LIFE-CYCLE CALLBACKS:
    private _player1Control: any = null;
    private _touchState: Array<boolean> = [];

    // onLoad () {}

    onEnable() {
        this.onTouchStart(this.touchNode[0], 0, this.dirUp, this);//上
        this.onTouchStart(this.touchNode[1], 1, this.dirDown, this);//下
        this.onTouchStart(this.touchNode[2], 2, this.dirLeft, this);//左
        this.onTouchStart(this.touchNode[3], 3, this.dirRight, this);//右
        this.onTouchStart(this.touchNode[4], 4, this.btnA, this);//A
        this.onTouchStart(this.touchNode[5], 5, this.btnB, this);//B

        this.touchEnd();

        //this.node.on(cc.Node.EventType.TOUCH_END, this.changePlayerState, this, true);
        //this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.changePlayerState, this, true);
    }

    touchEnd() {
        this.onTouchEnd(this.touchNode[0], this.changePlayerState, this, true);//上
        this.onTouchEnd(this.touchNode[1], this.changePlayerState, this, true);//下
        this.onTouchEnd(this.touchNode[2], this.changePlayerState, this, true);//左
        this.onTouchEnd(this.touchNode[3], this.changePlayerState, this, true);//右
        this.onTouchEnd(this.touchNode[4], this.changePlayerState, this, true);//A
        this.onTouchEnd(this.touchNode[5], this.changePlayerState, this, true);//B
    }

    onTouchStart(node: cc.Node, index, callBack: (event: cc.Event.EventCustom) => void, target?: any, useCapture?: boolean) {
        this._touchState[node.name] = false;
        node.on(cc.Node.EventType.TOUCH_START, callBack, target, useCapture);
    }

    onTouchEnd(node: cc.Node, callBack: (event: cc.Event.EventCustom) => void, target?: any, useCapture?: boolean) {
        node.on(cc.Node.EventType.TOUCH_END, callBack, target, useCapture);
        node.on(cc.Node.EventType.TOUCH_CANCEL, callBack, target, useCapture);
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

    changePlayerState(event) {
        this._touchState[event.currentTarget.name] = false;
        this._player1Control.moveState_1 = dataConst.MOVESTATE.STOP;
        this._player1Control.direction_1 = dataConst.DIR.NONE;
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

    dirUp(event) {
        if (this._player1Control.isJump == true || this._player1Control.direction_1 == dataConst.DIR.DOWN) {
            return;
        }
        this._player1Control.isJump = true;
        //this._player1Control.direction_1 = dataConst.DIR.UP;
        this._player1Control.moveState_1 = dataConst.MOVESTATE.MOVE;
    }

    dirDown(event) {
        //this._player1Control.direction_1 = dataConst.DOWN;
        this._player1Control.moveState_1 = dataConst.MOVESTATE.MOVE;

    }

    dirLeft(event) {
        this._touchState[event.currentTarget.name] = true;
        this._player1Control.direction_1 = dataConst.DIR.LEFT;
        this._player1Control.moveState_1 = dataConst.MOVESTATE.MOVE;
        EventManager.getInstance().emit(EventConst.ANIMATION_PLAY);
    }

    dirRight(event) {
        this._touchState[event.currentTarget.name] = true;
        this._player1Control.direction_1 = dataConst.DIR.RIGHT;
        this._player1Control.moveState_1 = dataConst.MOVESTATE.MOVE;
        EventManager.getInstance().emit(EventConst.ANIMATION_PLAY);
    }

    btnA(event) {
        //攻击
        if (this._player1Control.state_1 === dataConst.BODYSTATE.COMBATABLE) {
            nodePool.getInstance().onBulletInit(myApp.getInstance().player1Node);
        }
    }

    btnB(event) {
        //跳跃
        if (this._player1Control.isJump == true || this._player1Control.direction_1 == dataConst.DIR.DOWN) {
            return;
        }
        this._player1Control.isJump = true;
        //this._player1Control.direction_1 = dataConst.DIR.UP;
        this._player1Control.moveState_1 = dataConst.MOVESTATE.MOVE;
    }

    update () {
        if(this._touchState["dir_left"]) {
            this._player1Control.direction_1 = dataConst.DIR.LEFT;
            this._player1Control.moveState_1 = dataConst.MOVESTATE.MOVE;
        }
        if(this._touchState["dir_right"]) {
            this._player1Control.direction_1 = dataConst.DIR.RIGHT;
            this._player1Control.moveState_1 = dataConst.MOVESTATE.MOVE;
        }
    }
}
