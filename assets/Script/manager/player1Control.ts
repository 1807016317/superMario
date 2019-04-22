
/********************
 * @Name：player1Control
 * @Describe：玩家1控制中心
 * @Author：王全由
 * @Date：2019.03.29
 ********************/
import dataConst from "../data/dataConst";
import UIUtil from "../util/uiUtil";
import animationData from "../data/animationData";
import EventManager from "./EventManager";
import EventConst from "../data/EventConst";
import myApp from "../myApp";
import playerImgData from "../data/playerImgData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class player1Control extends cc.Component {

    //玩家1
    private _score_1: number = 0; //玩家1分数
    private _dir_1: dataConst = dataConst.DIR.NONE;   //玩家2当前方向
    private _moveState_1: dataConst = dataConst.MOVESTATE.STOP; //玩家2当前运动状态
    private _state_1: dataConst = dataConst.BODYSTATE.SMALL; //玩家身体形态
    private _animation = null;
    private _isJump = false;
    private _downSpeed = 2;
    private _jumpSpeed = dataConst.JUMP_SPEED;

    onEnable() {
        this.node.on('size-changed', this.changeBoxCollider, this);
        EventManager.getInstance().on(EventConst.LISTEN_COLLSION, this.onCollisionMapLayer.bind(this));
        EventManager.getInstance().on(EventConst.ANIMATION_PLAY, this.animationPlay.bind(this));
    }

    onDisable() {
        this.node.off('size-changed', this.changeBoxCollider, this);
        EventManager.getInstance().off(EventConst.LISTEN_COLLSION);
        EventManager.getInstance().off(EventConst.ANIMATION_PLAY);
    }

    start() {
        this._animation = this.node.getComponent(cc.Animation);
    }

    //玩家1
    set score_1(data: number) {
        this._score_1 = data;
    }

    get score_1(): number {
        return this._score_1;
    }

    set direction_1(data: dataConst) {
        this.fall();
        if (this._dir_1 == data) {
            return;
        }
        this._dir_1 = data;
    }

    get direction_1(): dataConst {
        return this._dir_1;
    }

    set moveState_1(data: dataConst) {
        this._moveState_1 = data;
        this.changeMap();
        this.playerMove();
    }

    get moveState_1(): dataConst {
        return this._moveState_1;
    }

    set state_1(data: dataConst) {
        if (this._state_1 == data) {
            return;
        }
        this._animation.stop();
        this._state_1 = data;
    }

    get state_1(): dataConst {
        return this._state_1;
    }

    set isJump(data: boolean) {
        this._isJump = data;
    }

    get isJump(): boolean {
        return this._isJump;
    }

    changeBoxCollider() {
        //修改碰撞体的大小
        this.node.getComponent(cc.BoxCollider).size = this.node.getContentSize();
        if (this._state_1 == dataConst.BODYSTATE.BIG) {
            console.log("changeBoxCollider STATE.BIG");
        } else if (this._state_1 == dataConst.BODYSTATE.SMALL) {
            console.log("changeBoxCollider STATE.SMALL");
        }
    }

    animationPlay() {
        if (this.moveState_1 == dataConst.MOVESTATE.STOP || this._isJump) {
            this._animation.pause();
        } else if (this.moveState_1 == dataConst.MOVESTATE.MOVE) {
            // if (UIUtil.checkDataIsNull(this._animation._currentClip)) {
            //     this._animation.resume();
            //     return;
            // }
            if (this._state_1 == dataConst.BODYSTATE.BIG) {
                this._animation.play(animationData.player[1003].name);
            } else if (this._state_1 == dataConst.BODYSTATE.SMALL) {
                this._animation.play(animationData.player[1001].name);
            }
        }
    }

    jumpAnimate() {
        this._animation.stop();
        if (this._state_1 == dataConst.BODYSTATE.BIG) {
            this._animation.play(animationData.player[1007].name);
        } else if (this._state_1 == dataConst.BODYSTATE.SMALL) {
            this._animation.play(animationData.player[1006].name);
        }
    }

    stopJumpAnimate() {
        if (this._state_1 == dataConst.BODYSTATE.BIG) {
            this._animation.stop(animationData.player[1007].name);
        } else if (this._state_1 == dataConst.BODYSTATE.SMALL) {
            this._animation.stop(animationData.player[1006].name);
        }
        if (this._state_1 == dataConst.BODYSTATE.BIG) {
            UIUtil.loaderRes(playerImgData.data[201].name, cc.SpriteFrame, (sp) => {
                if (UIUtil.checkNodeisLive(this.node)) {
                    this.node.getComponent(cc.Sprite).spriteFrame = sp;
                }
            });
        } else if (this._state_1 == dataConst.BODYSTATE.SMALL) {
            UIUtil.loaderRes(playerImgData.data[101].name, cc.SpriteFrame, (sp) => {
                if (UIUtil.checkNodeisLive(this.node)) {
                    this.node.getComponent(cc.Sprite).spriteFrame = sp;
                }
            });
        }
    }

    playerMove() {
        //this.unscheduleAllCallbacks();
        if (this.moveState_1 != dataConst.MOVESTATE.MOVE) {
            this._animation.stop();
            return;
        }
        switch (this._dir_1) {
            case dataConst.DIR.UP:
                //this._isJump = true;
                // let pos = cc.v2(0, dataConst.JUMP_HIGHT);
                // let jumpUp = cc.moveBy(0.3, pos);
                // let seq = cc.sequence(jumpUp, cc.delayTime(0.1), cc.callFunc(() => {
                //     //this.moveState_1 = dataConst.MOVESTATE.STOP;
                //     this._isJump = false;
                // }));
                // this.node.runAction(seq);
                //this.schedule(this.jump.bind(this), 0);
                break;
            case dataConst.DIR.LEFT:
                this.node.scaleX = -1;
                //this.node.x -= dataConst.MOVESTATE.MOVE_SPEED;
                this.node.x -= myApp.getInstance().moveSpeed;
                break;
            case dataConst.DIR.RIGHT:
                this.node.scaleX = 1;
                this.node.x += myApp.getInstance().moveSpeed;
                break;
        }
    }

    onCollisionStay(other, self) {
        //马里奥撞边界墙
        this.moveState_1 = dataConst.MOVESTATE.STOP;
        switch (this.direction_1) {
            case dataConst.DIR.LEFT:
                this.node.x += dataConst.MOVE_SPEED
                break;
            case dataConst.DIR.RIGHT:
                this.node.x -= dataConst.MOVE_SPEED;
                break;
            case dataConst.DIR.UP:
                break;
        }
    }

    onCollisionMapLayer(arg) {
        //马里奥地图内的碰撞
        //this.moveState_1 = dataConst.MOVESTATE.STOP;
        switch (arg[1]) {
            case dataConst.DIR.LEFT:
                console.log("collsion left");
                this.node.x = arg[0].x + myApp.getInstance().tileSize.height;
                break;
            case dataConst.DIR.RIGHT:
                console.log("collsion right");
                this.node.x = arg[0].x - myApp.getInstance().tileSize.height;
                break;
            case dataConst.DIR.UP:
                console.log("collsion up");
                this.node.y = arg[0].y - myApp.getInstance().tileSize.height * 2;
                break;
            case dataConst.DIR.DOWN:
                if (this.isJump == false) {
                    this._downSpeed = 2;
                    this._jumpSpeed = dataConst.JUMP_SPEED;
                    this.node.y = arg[0].y;
                    this.direction_1 = dataConst.DIR.NONE;
                }
                if (this.direction_1 == dataConst.DIR.NONE) {
                    this.stopJumpAnimate();
                }
                break;
        }
    }

    jump() {
        if (this.isJump === true) {
            this.jumpAnimate();
            this._jumpSpeed -= dataConst.G_SPEED;
            this.node.y += this._jumpSpeed;
            if (this._jumpSpeed <= 0) {
                this._isJump = false;
            }
        }
    }

    fall() {
        //下落
        if (this.direction_1 == dataConst.DIR.DOWN) {
            this.jumpAnimate();
            this._downSpeed -= dataConst.G_SPEED;
            this.node.y += this._downSpeed;
        }
    }

    changeMap() {
        EventManager.getInstance().emit(EventConst.CHANGE_MAP);
    }

    update(dt) {
        this.jump();
        // if(this._MOVESTATE.moveState_1 == dataConst.MOVESTATE.MOVE) {
        //     this.playerMOVESTATE.MOVE();
        // }
    }
}