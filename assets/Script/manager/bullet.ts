/********************
 * @Name：bullet
 * @Describe：子弹类
 * @Author：王全由
 * @Date：2019.04.28
 ********************/
import EventManager from "./EventManager";
import EventConst from "../data/EventConst";
import dataConst from "../data/dataConst";
import nodePool from "../util/nodePool";

const { ccclass, property } = cc._decorator;

@ccclass
export default class bullet extends cc.Component {

    private _downSpeed: number = 0;
    private _boom: boolean = false;

    onLoad() {
        EventManager.getInstance().emit(EventConst.CHECK_COLLSION, this.node, this.onCollisonMap.bind(this));
    }

    onEnable() {
        let anima = this.node.getComponent(cc.Animation);
        anima.on("stop", () => {
            nodePool.getInstance().onBulletKilled(this.node);
            this._boom = false;
        }, this);
    }

    init() {
        let anima = this.node.getComponent(cc.Animation);
        anima.play();
        this.schedule(this.move.bind(this), 0);
    }

    /**
     * 自写与地图碰撞
     * @param arg 
     */
    onCollisonMap(arg) {
        let anima = this.node.getComponent(cc.Animation);
        switch (arg[1]) {
            // case dataConst.DIR.UP:
            //     this.unscheduleAllCallbacks();
            //     anima.setCurrentTime(1.35);
            //     anima.resume();
            //     break;
            case dataConst.DIR.DOWN:
                this._downSpeed = dataConst.DOWN_SPEED * 3;
                break;
            default:
                this.unscheduleAllCallbacks();
                if (!this._boom) {
                    anima.setCurrentTime(1.35);
                    this._boom = true;
                }
                break;
        }
    }

    /**
     * 引擎封装碰撞组件函数
     * @param other 
     * @param self 
     */
    onCollisionEnter(other, self) {
        if(other.node.type === dataConst.roleType.monster) {
            let anima = this.node.getComponent(cc.Animation);
            anima.stop();
            this._boom = false;
            nodePool.getInstance().onBulletKilled(this.node);
        }
    }

    move() {
        this.node.x += dataConst.MOVE_SPEED;
    }

    fallDown() {
        this._downSpeed -= dataConst.G_SPEED;
        this.node.y += this._downSpeed;
    }

    update(dt) {
        this.fallDown();
    }
}
