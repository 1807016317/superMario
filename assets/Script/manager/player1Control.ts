
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
    private _dir_1: dataConst = dataConst.RIGHT;   //玩家2当前方向
    private _moveState_1: dataConst = dataConst.STOP; //玩家2当前运动状态
    private _state_1: dataConst = dataConst.SMALL; //玩家身体形态
    private _animation = null;
    private _isJump = false;

    //玩家2
    //private _score_2: number = 0; //玩家2分数
    //private _dir_2: dataConst = dataConst.LEFT;   //玩家2当前方向
    //private _moveState_2: dataConst = dataConst.STOP; //玩家2当前运动状态
    //private _state_2: dataConst = dataConst.SMALL; //玩家身体形态

    onEnable() {
        this.node.on('size-changed', this.changeBoxCollider, this);
        EventManager.getInstance().on(EventConst.LISTEN_COLLSION, this.onCollisionMapLayer.bind(this));
        EventManager.getInstance().on(EventConst.PLAYER_FALL, this.fall.bind(this));
    }

    onDisable() {
        this.node.off('size-changed', this.changeBoxCollider, this);
        EventManager.getInstance().off(EventConst.LISTEN_COLLSION);
        EventManager.getInstance().off(EventConst.PLAYER_FALL);
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
        this.changeMap();
        if (this._moveState_1 == data) {
            return;
        }
        this._moveState_1 = data;
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
        if (this._state_1 == dataConst.BIG) {
            console.log("changeBoxCollider big");
        } else if (this._state_1 == dataConst.SMALL) {
            console.log("changeBoxCollider small");
        }
    }

    animationPlay() {
        if (this._moveState_1 == dataConst.STOP || !this._isJump) {
            this._animation.pause();
        } else if (this._moveState_1 == dataConst.MOVE) {
            if (UIUtil.checkDataIsNull(this._animation._currentClip)) {
                this._animation.resume();
                return;
            }
            if (this._state_1 == dataConst.BIG) {
                this._animation.play(animationData.player[1003].name);
            } else if (this._state_1 == dataConst.SMALL) {
                this._animation.play(animationData.player[1001].name);
            }
        }
    }

    jumpAnimate() {
        this._animation.stop();
        if (this._state_1 == dataConst.BIG) {
            UIUtil.loaderRes(playerImgData.data[211].name, cc.SpriteFrame, (sp) => {
                if (UIUtil.checkNodeisLive(this.node)) {
                    this.node.getComponent(cc.Sprite).spriteFrame = sp;
                }
            });
        } else if (this._state_1 == dataConst.SMALL) {
            UIUtil.loaderRes(playerImgData.data[111].name, cc.SpriteFrame, (sp) => {
                if (UIUtil.checkNodeisLive(this.node)) {
                    this.node.getComponent(cc.Sprite).spriteFrame = sp;
                }
            });
        }
    }

    playerMove() {
        this.unscheduleAllCallbacks();
        if (this.moveState_1 != dataConst.MOVE) {
            return;
        }
        switch (this._dir_1) {
            case dataConst.UP:
                this.jumpAnimate();
                let pos = cc.v2(0, dataConst.JUMP_HIGHT);
                let jumpUp = cc.moveBy(0.3, pos);
                let seq = cc.sequence(jumpUp, cc.delayTime(0.1), cc.callFunc(() => {
                    this.moveState_1 = dataConst.STOP;
                    this._isJump = false;
                }));
                this.node.runAction(seq);
                break;
            case dataConst.LEFT:
                this.animationPlay();
                this.schedule(() => {
                    this.node.scaleX = -1;
                    //this.node.x -= dataConst.MOVE_SPEED;
                    this.node.x -= myApp.getInstance().moveSpeed;
                }, 0);
                break;
            case dataConst.RIGHT:
                this.animationPlay();
                this.schedule(() => {
                    this.node.scaleX = 1;
                    //this.node.x += dataConst.MOVE_SPEED;
                    this.node.x += myApp.getInstance().moveSpeed;
                }, 0);
                break;
        }
    }

    onCollisionStay(other, self) {
        //马里奥撞边界墙
        this.moveState_1 = dataConst.STOP;
        switch (this.direction_1) {
            case dataConst.LEFT:
                this.node.x += dataConst.MOVE_SPEED;
                break;
            case dataConst.RIGHT:
                this.node.x -= dataConst.MOVE_SPEED;
                break;
            case dataConst.UP:
                break;
            default:
                break;
        }
    }

    onCollisionMapLayer(pos) {
        //马里奥地图内的碰撞
        this.moveState_1 = dataConst.STOP;
        this.node.position = pos[0];
        switch (this.direction_1) {
            case dataConst.LEFT:
                break;
            case dataConst.RIGHT:
                break;
            case dataConst.UP:
                break;
            case dataConst.DOWN:
                if (this._state_1 == dataConst.BIG) {
                    UIUtil.loaderRes(playerImgData.data[201].name, cc.SpriteFrame, (sp) => {
                        this.node.getComponent(cc.Sprite).spriteFrame = sp;
                    });
                } else if (this._state_1 == dataConst.SMALL) {
                    UIUtil.loaderRes(playerImgData.data[101].name, cc.SpriteFrame, (sp) => {
                        this.node.getComponent(cc.Sprite).spriteFrame = sp;
                    });
                }
                break;
        }
    }

    fall() {
        //下落
        if (this.direction_1 == dataConst.DOWN) {
            this.jumpAnimate();
            let downSpeed = 0;
            downSpeed -= dataConst.G_SPEED;
            this.node.y += downSpeed;
        }
    }

    changeMap() {
        EventManager.getInstance().emit(EventConst.CHANGE_MAP);
    }

    update(dt) {
        // if(this._moveState_1 == dataConst.MOVE) {
        //     this.playerMove();
        // }
    }
}
