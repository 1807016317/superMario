/********************
 * @Name：monsterControl
 * @Describe：怪物控制类
 * @Author：王全由
 * @Date：2019.04.02
 ********************/
import dataConst from "../data/dataConst";
import EventManager from "./EventManager";
import EventConst from "../data/EventConst";

const { ccclass, property } = cc._decorator;

@ccclass
export default class monsterControl extends cc.Component {

    @property(cc.Animation)
    monsterAnimation: cc.Animation = null;

    // LIFE-CYCLE CALLBACKS:
    private _dir = dataConst.DIR.NONE;
    private _downSpeed = dataConst.DOWN_SPEED;
    private _isChangeDir = true;


    //onLoad () {}

    onEnable() {
        EventManager.getInstance().on(EventConst.COLLSION_HANDLE, this.onCollisionMapLayer.bind(this));
        EventManager.getInstance().on(EventConst.CHECK_FALL, this.chackFallDown.bind(this));
    }

    onDisable() {
        EventManager.getInstance().off(EventConst.COLLSION_HANDLE);
        EventManager.getInstance().off(EventConst.CHECK_FALL);
    }

    start() {
        //EventManager.getInstance().emit(EventConst.CHECK_COLLSION, this.node);
        if (this.node["moveType"] != dataConst.monsterMoveType.portrait) {
            EventManager.getInstance().emit(EventConst.CHECK_COLLSION, this.node, this.onCollisionMapLayer.bind(this), this.chackFallDown.bind(this));
        }
    }

    public get dir() {
        return this._dir;
    }

    public set dir(value) {
        this._dir = value;
        this.fall();
    }

    onCollisionMapLayer(event) {
        switch (event[1]) {
            case dataConst.DIR.LEFT:
                this._isChangeDir = !this._isChangeDir;
                break;
            case dataConst.DIR.RIGHT:
                this._isChangeDir = !this._isChangeDir;
                break;
            case dataConst.DIR.DOWN:
                this._downSpeed = dataConst.DOWN_SPEED;
                this.node.y = event[0].y;
                this.dir = dataConst.DIR.NONE;
                break;
        }
        if (this._isChangeDir) {
            //this._isCollison为真，运动方向变为左
            this.dir = dataConst.DIR.LEFT;
        } else {
            //this._isCollison为假，运动方向变为右
            this.dir = dataConst.DIR.RIGHT;
        }
    }

    chackFallDown(dir) {
        if (dir === dataConst.DIR.DOWN) {
            this.dir = dataConst.DIR.DOWN;
        }
    }

    fall() {
        //下落
        if (this.dir == dataConst.DIR.DOWN &&
            this.node["moveType"] === dataConst.monsterMoveType.transverse) {
            this._downSpeed -= dataConst.G_SPEED;
            this.node.y += this._downSpeed;
        }
    }

    mushroomMove_A() {
        let clips = this.monsterAnimation.getClips();
        this.monsterAnimation.play(clips[0].name);
        //this.dir = dataConst.DIR.LEFT;
    }

    mushroomDie_A() {
        let clips = this.monsterAnimation.getClips();
        this.monsterAnimation.play(clips[1].name);
    }

    flowerAnimate() {
        let clips = this.monsterAnimation.getClips();
        this.monsterAnimation.play(clips[7].name);
        let moveUp = cc.moveBy(0.3, 0, 24);
        let moveDown = cc.moveBy(0.3, 0, -24);
        let seq = cc.sequence(moveUp, cc.delayTime(0.5), moveDown, cc.delayTime(0.7));
        if (this.node["moveType"] === dataConst.monsterMoveType.portrait) {
            this.node.runAction(cc.repeatForever(seq));
        }
    }

    tortoiseMove_A() {
        let clips = this.monsterAnimation.getClips();
        this.monsterAnimation.play(clips[3].name);
    }

    tortoiseDie_A() {
        let clips = this.monsterAnimation.getClips();
        this.monsterAnimation.play(clips[5].name);
    }

    tortoiseDieMove_A() {
        let clips = this.monsterAnimation.getClips();
        this.monsterAnimation.play(clips[4].name);
    }

    bossMove_A() {
        let clips = this.monsterAnimation.getClips();
        this.monsterAnimation.play(clips[8].name);
    }

    update(dt) {
        if (this.node["moveType"] === dataConst.monsterMoveType.transverse) {
            if (this.dir === dataConst.DIR.LEFT) {
                this.node.scaleX = -1;
                this.node.x -= dataConst.MOVE_SPEED / 3;
            } else if (this.dir === dataConst.DIR.RIGHT) {
                this.node.scaleX = 1;
                this.node.x += dataConst.MOVE_SPEED / 3;
            }
        }
    }
}
