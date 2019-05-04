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
    private _collision: dataConst = dataConst.DIR.NONE; ///是否碰撞

    onLoad() {
        this.node["state_1"] = dataConst.BODYSTATE.SMALL;
    }

    onEnable() {
        this.node.on('size-changed', this.changeBoxCollider, this);
        EventManager.getInstance().on(EventConst.COLLSION_HANDLE, this.onCollisionMapLayer.bind(this));
        EventManager.getInstance().on(EventConst.ANIMATION_PLAY, this.animationPlay.bind(this));
        EventManager.getInstance().on(EventConst.CHECK_FALL, this.chackFallDown.bind(this));
        EventManager.getInstance().on(EventConst.ADD_SCORE, this.addScore.bind(this));
    }

    onDisable() {
        this.node.off('size-changed', this.changeBoxCollider, this);
        EventManager.getInstance().off(EventConst.COLLSION_HANDLE);
        EventManager.getInstance().off(EventConst.ANIMATION_PLAY);
        EventManager.getInstance().off(EventConst.CHECK_FALL);
        EventManager.getInstance().off(EventConst.ADD_SCORE);
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
        // if (this._state_1 == data) {
        //     return;
        // }
        this._animation.stop();
        this._state_1 = data;
        this.changeBoxCollider();
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

    public get collision() {
        return this._collision;
    }
    public set collision(value) {
        this._collision = value;
    }

    changeBoxCollider() {
        //修改碰撞体的大小
        this.node.getComponent(cc.BoxCollider).size = this.node.getContentSize();
        this.toInvincible(dataConst.BODYSTATE.COMBATABLE);
    }

    /**
     * 无敌效果
     */
    toInvincible(state) {
        let changeOpacity = cc.callFunc(()=>{
            this.node.opacity = 0;
            this.node.getComponent(cc.BoxCollider).size = cc.Size.ZERO;
        });
        let toInvincible = cc.callFunc(()=>{
            this.node.opacity = 255;
            this.node.color = dataConst.purple;
            this.node.getComponent(cc.BoxCollider).size = cc.Size.ZERO;
        });
        let toNormal = cc.callFunc(()=>{
            this.node.color = cc.Color.WHITE;
            this.state_1 = state;
        });
        let seq = null;
        let twin_Seq = cc.sequence(changeOpacity, cc.delayTime(0.1), toInvincible, cc.delayTime(0.1));
        if(this.state_1 === dataConst.BODYSTATE.INVINCIBLE) {
            if(state === dataConst.BODYSTATE.COMBATABLE) {
                let twinkle = cc.repeat(twin_Seq, 30); //闪烁
                seq = cc.sequence(twinkle, toNormal);
            }
        } else if(state === dataConst.BODYSTATE.SMALL) {
            let twinkle = cc.repeat(twin_Seq, 2); //闪烁
            seq = cc.sequence(twinkle, toNormal);
        }
        if(UIUtil.checkDataIsNull(seq)) {
            this.node.runAction(seq);
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
            if (this._state_1 == dataConst.BODYSTATE.SMALL) {
                this._animation.play(animationData.player[1001].name);
            } else {//if (this.state_1 == dataConst.BODYSTATE.BIG) {
                this._animation.play(animationData.player[1003].name);
            }
        }
    }

    jumpAnimate() {
        this._animation.stop();
        if (this._state_1 != dataConst.BODYSTATE.SMALL) {
            this._animation.play(animationData.player[1007].name);
        } else if (this._state_1 == dataConst.BODYSTATE.SMALL) {
            this._animation.play(animationData.player[1006].name);
        }
    }

    stopJumpAnimate() {
        if (this._state_1 != dataConst.BODYSTATE.SMALL) {
            this._animation.stop(animationData.player[1007].name);
        } else if (this._state_1 == dataConst.BODYSTATE.SMALL) {
            this._animation.stop(animationData.player[1006].name);
        }
        if (this._state_1 != dataConst.BODYSTATE.SMALL) {
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

    /**
     * 移动
     */
    playerMove() {
        //this.unscheduleAllCallbacks();
        if (this.moveState_1 != dataConst.MOVESTATE.MOVE) {
            this._animation.stop();
            return;
        }
        switch (this._dir_1) {
            case dataConst.DIR.LEFT:
                if (this.collision === dataConst.DIR.LEFT) {
                    break;
                }
                this.collision = dataConst.DIR.NONE;
                this.node.scaleX = -1;
                //this.node.x -= dataConst.MOVESTATE.MOVE_SPEED;
                this.node.x -= myApp.getInstance().moveSpeed;
                break;
            case dataConst.DIR.RIGHT:
                if (this.collision === dataConst.DIR.RIGHT) {
                    break;
                }
                this.collision = dataConst.DIR.NONE;
                this.node.scaleX = 1;
                this.node.x += myApp.getInstance().moveSpeed;
                break;
        }
    }

    onCollisionEnter(other, self) {
        //碰撞产生
        //怪物碰撞
        if (other.node.group === dataConst.GROUP.monster) {
            console.log(this.node.getComponent(cc.BoxCollider).size);
            if (this.state_1 == dataConst.BODYSTATE.SMALL) {
                EventManager.getInstance().emit(EventConst.GAMEOVER);
            } else {
                if(this.state_1 != dataConst.BODYSTATE.INVINCIBLE) {
                    //this.state_1 = dataConst.BODYSTATE.SMALL;
                    this.toInvincible(dataConst.BODYSTATE.SMALL);
                }
            }
        } else if (other.node.group === dataConst.GROUP.prop) {
            //道具碰撞
            EventManager.getInstance().emit(EventConst.MUSIC_PLAY, audioData.data[5].id);
            if (other.node.type == dataConst.propType.mushroom) {
                this.state_1 = dataConst.BODYSTATE.BIG;
                this._animation.play(animationData.player[1005].name);
            }
            if (other.node.type == dataConst.propType.flower) {
                this.state_1 = dataConst.BODYSTATE.COMBATABLE;
            }
            if (other.node.type == dataConst.propType.star) {
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

    /**
     * 马里奥地图内的碰撞
     * @param arg 
     */
    onCollisionMapLayer(arg) {
        //this.moveState_1 = dataConst.MOVESTATE.STOP;
        switch (arg[1]) {
            case dataConst.DIR.LEFT:
                this.collision = dataConst.DIR.LEFT;
                this.node.x = arg[0].x;
                break;
            case dataConst.DIR.RIGHT:
                this.collision = dataConst.DIR.RIGHT;
                this.node.x = arg[0].x;
                break;
            case dataConst.DIR.UP:
                this.collision = dataConst.DIR.UP;
                this.isJump = false;
                this.node.y = arg[0].y;
                if (UIUtil.checkDataIsNull(arg[2])) {
                    if (arg[2] === dataConst.rewardType.coin) {
                        this.addScore(10);  //撞到金币时加10分
                    }
                } else {
                    //播放音效
                    EventManager.getInstance().emit(EventConst.MUSIC_PLAY, audioData.data[3].id);
                }
                break;
            case dataConst.DIR.DOWN:
                this.collision = dataConst.DIR.DOWN;
                if (this.isJump == false) {
                    this._downSpeed = dataConst.DOWN_SPEED;
                    this._jumpSpeed = dataConst.JUMP_SPEED;
                    this.node.y = arg[0].y + myApp.getInstance().tileSize.height / 2 + this.node.height / 2;
                    this.direction_1 = dataConst.DIR.NONE;
                }
                if (this.direction_1 == dataConst.DIR.NONE) {
                    this.stopJumpAnimate();
                }
                break;
        }
    }

    /**
     * 判断是否下落
     * @method chackFallDown
     * @param dir 
     */
    chackFallDown(dir) {
        if (dir === dataConst.DIR.DOWN && !this.isJump) {
            this.direction_1 = dataConst.DIR.DOWN;
            //player1Control.moveState_1 = dataConst.MOVESTATE.MOVE;
        }
    }

    jump() {
        if (this.isJump === true) {
            this.collision = dataConst.DIR.NONE;
            this.jumpAnimate();
            EventManager.getInstance().emit(EventConst.MUSIC_PLAY, audioData.data[7].id);
            this._jumpSpeed -= dataConst.G_SPEED;
            this.node.y += this._jumpSpeed;
            if (this._jumpSpeed <= 0) {
                this.isJump = false;
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

    /**
     * 地图切换
     */
    changeMap() {
        EventManager.getInstance().emit(EventConst.CHANGE_MAP);
    }

    /**
     * 加分
     * @param addValue
     */
    addScore(addValue) {
        let value = addValue[0] ? addValue[0] : addValue;
        this.score_1 = this.score_1 + value;
        EventManager.getInstance().emit(EventConst.UPDATE_UI);
    }

    update(dt) {
        this.jump();
    }
}