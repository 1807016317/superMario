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
import audioData from "../data/audioData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class player1Control extends cc.Component {

    //玩家1
    private _score_1: number = 0; //玩家1分数
    private _dir_1: dataConst = dataConst.DIR.NONE;   //玩家当前方向
    private _moveState_1: dataConst = dataConst.MOVESTATE.STOP; //玩家当前运动状态
    private _state_1: dataConst = dataConst.BODYSTATE.SMALL; //玩家身体形态
    private _animation = null;
    private _isJump = false;//是否处于跳跃状态
    private _downSpeed = dataConst.DOWN_SPEED;//下落速度
    private _jumpSpeed = dataConst.JUMP_SPEED;//起跳速度

    onLoad() {
        this.node["state_1"] = dataConst.BODYSTATE.SMALL;
    }

    onEnable() {
        this.node.on('size-changed', this.changeBoxCollider, this);
        EventManager.getInstance().on(EventConst.COLLSION_HANDLE, this.onCollisionMapLayer.bind(this));
        EventManager.getInstance().on(EventConst.ANIMATION_PLAY, this.animationPlay.bind(this));
        EventManager.getInstance().on(EventConst.CHECK_FALL, this.chackFallDown.bind(this));
    }

    onDisable() {
        this.node.off('size-changed', this.changeBoxCollider, this);
        EventManager.getInstance().off(EventConst.COLLSION_HANDLE);
        EventManager.getInstance().off(EventConst.ANIMATION_PLAY);
        EventManager.getInstance().off(EventConst.CHECK_FALL);
    }

    start() {
        this._animation = this.node.getComponent(cc.Animation);
        EventManager.getInstance().emit(EventConst.CHECK_COLLSION, this.node, this.onCollisionMapLayer.bind(this), this.chackFallDown.bind(this));
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
        this.node["state_1"] = data;
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
            if (this.state_1 == dataConst.BODYSTATE.BIG) {
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

    onCollisionEnter(other, self) {
        //碰撞产生
        if (other.node.group === dataConst.GROUP.monster) {
            if (this.state_1 == dataConst.BODYSTATE.SMALL) {
                EventManager.getInstance().emit(EventConst.GAMEOVER);
            } else {
                this.state_1 = dataConst.BODYSTATE.SMALL;
            }
        } else if (other.node.group === dataConst.GROUP.prop) {
            EventManager.getInstance().emit(EventConst.MUSIC_PLAY, audioData.data[5].id);
        }
        if(other.node.group === dataConst.GROUP.prop) {
            if(other.node.type == dataConst.propType.mushroom) {
                this.state_1 = dataConst.BODYSTATE.BIG;
                this._animation.play(animationData.player[1005].name);
            }
            if(other.node.type == dataConst.propType.flower) {
                this.state_1 = dataConst.BODYSTATE.COMBATABLE;
            }
            if(other.node.type == dataConst.propType.star) {
                this.state_1 = dataConst.BODYSTATE.INVINCIBLE;
                //this._animation.play(animationData.player[1005].name);
            }
            other.node.destroy();
        }

    }

    onCollisionStay(other, self) {
        //正在碰撞，马里奥撞边界墙
        if (other.node.group != dataConst.GROUP.wall) {
            return;
        }
        this.moveState_1 = dataConst.MOVESTATE.STOP;
        switch (this.direction_1) {
            case dataConst.DIR.LEFT:
                this.node.x += dataConst.MOVE_SPEED;
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
                this.node.x = arg[0].x + myApp.getInstance().tileSize.width;
                break;
            case dataConst.DIR.RIGHT:
                this.node.x = arg[0].x - myApp.getInstance().tileSize.width;
                break;
            case dataConst.DIR.UP:
                this.node.y = arg[0].y - myApp.getInstance().tileSize.height * 2;
                if (UIUtil.checkDataIsNull(arg[2])) {
                    if (arg[2] === dataConst.rewardType.coin) {
                        this.score_1 = this.score_1 + 10;
                        EventManager.getInstance().emit(EventConst.UPDATE_UI);
                    }
                } else {
                    EventManager.getInstance().emit(EventConst.MUSIC_PLAY, audioData.data[3].id);
                }
                break;
            case dataConst.DIR.DOWN:
                if (this.isJump == false) {
                    this._downSpeed = dataConst.DOWN_SPEED;
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

    chackFallDown(dir) {
        if (dir === dataConst.DIR.DOWN && !this.isJump) {
            this.direction_1 = dataConst.DIR.DOWN;
            //player1Control.moveState_1 = dataConst.MOVESTATE.MOVE;
        }
    }

    jump() {
        if (this.isJump === true) {
            this.jumpAnimate();
            EventManager.getInstance().emit(EventConst.MUSIC_PLAY, audioData.data[7].id);            
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
    }
}