
/********************
 * @Name：tiledMapUtil
 * @Describe：格子地图的公用方法
 * @Author：王全由
 * @Date：2019.03.29
 ********************/
import myApp from "../myApp";
import dataConst from "../data/dataConst";
import UIUtil from "./uiUtil";
import EventManager from "../manager/EventManager";
import EventConst from "../data/EventConst";
import layerData from "../data/layerData";
import mapData from "../data/mapData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class tiledMapUtil extends cc.Component {

    private _curMap: cc.TiledMap = null;
    private _allLayers = null;
    private _objectGroups = null;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.init();
        myApp.getInstance().tileNode = this.node;
    }

    onEnable() {
        EventManager.getInstance().on(EventConst.CHANGE_MAP, this.changeMap.bind(this));
    }

    onDisable() {
        EventManager.getInstance().off(EventConst.CHANGE_MAP);
    }

    start() {
        this.setPlayerFollow();
    }

    init() {
        this._curMap = this.node.getComponent(cc.TiledMap);
        this._allLayers = this._curMap.getLayers();
        //设置水管层的渲染层级
        let pipeLayer = this._curMap.getLayer(layerData.data[2006].name);
        pipeLayer.node.zIndex = dataConst.PIPE_LAYER;
    }

    changeMap() {
        let player1 = myApp.getInstance().player1Node;
        this._objectGroups = this._curMap.getObjectGroups();
        let final_Obj = this._objectGroups[0].getObject("final");
        if (UIUtil.checkDataIsNull(final_Obj)) {
            let final_rect = UIUtil.objectToRect(final_Obj);
            let player1_box = player1.getBoundingBox();
            let checkNum = myApp.getInstance().checkNum;
            let maxCheck = dataConst.CHECK.length;
            if (final_rect.intersects(player1_box) && checkNum <= maxCheck) {
                myApp.getInstance().checkNum = dataConst.CHECK[checkNum].checkNum + 1;
                myApp.getInstance().checkStr = dataConst.CHECK[checkNum].checkStr;
                EventManager.getInstance().emit(EventConst.UPDATE_UI);
                UIUtil.loaderRes(mapData.data[myApp.getInstance().checkNum].name, cc.TiledMapAsset, (mapAsset) => {
                    this._curMap.tmxAsset = mapAsset;
                })
                let objectGroups = this._curMap.getObjectGroups();
                let player1_Obj = objectGroups[0].getObject("player1");
                player1.setPosition(player1_Obj.x, player1_Obj.y);
            }
        }
    }

    /**
     * 玩家与TiledLayer碰撞检测
     */
    collision() {
        let player1 = myApp.getInstance().player1Node;
        if (!UIUtil.checkNodeisLive(player1)) {
            return;
        }
        let player1_box = player1.getBoundingBox();
        let box_center = player1_box.center;
        let box_origin = cc.v2(player1_box.origin.x, player1_box.origin.y);
        //从上下左右四个方向来判断是否产生碰撞
        let box_top = cc.v2(box_center.x, box_center.y + player1_box.height / 2);
        let box_bottom = cc.v2(box_center.x, box_center.y - player1_box.height / 2);
        let box_left = cc.v2(box_center.x - player1_box.width / 2, box_center.y);
        let box_right = cc.v2(box_center.x + player1_box.width / 2, box_center.y);
        this.checkGIDAt(box_top, box_origin, dataConst.UP);
        this.checkGIDAt(box_bottom, box_origin, dataConst.DOWN);
        this.checkGIDAt(box_left, box_origin, dataConst.LEFT);
        this.checkGIDAt(box_right, box_origin, dataConst.RIGHT);
    }

    /**
     * 获取当前坐标的坐标
     */
    checkGIDAt(pos: cc.Vec2, box_origin, dir) {
        if (pos.x < 0 || pos.y < 0) {
            EventManager.getInstance().emit(EventConst.LISTEN_COLLSION, box_origin);
            return;
        }

        let vec = this.toTilesPos(pos);
        for (const key in this._allLayers) {
            let properties = this._allLayers[key].getProperties();
            if (properties["isColliding"]) {
                let tileGid = this._allLayers[key].getTileGIDAt(vec);
                if (tileGid != 0) {
                    //gid不等于0时，是碰撞到了，返回真
                    EventManager.getInstance().emit(EventConst.LISTEN_COLLSION, box_origin);
                } else {
                    let player1: cc.Node = myApp.getInstance().player1Node;
                    let player1Control = player1.getComponent("player1Control");
                    if (dir === dataConst.DOWN && !player1Control.isJump) {
                        player1Control.direction_1 = dataConst.DOWN;
                        player1Control.moveState_1 = dataConst.MOVE;
                        //EventManager.getInstance().emit(EventConst.PLAYER_FALL);
                    }
                }
            }
        }
    }

    /**
     * 将屏幕坐标转换为TiledMap的坐标
     */
    toTilesPos(pos: cc.Vec2) {
        let mapSize = this._curMap.getMapSize();
        let tileSize = this._curMap.getTileSize();
        let y = mapSize.height - Math.floor(pos.y / tileSize.height) - 1;
        let x = Math.floor(pos.x / tileSize.width);
        return cc.v2(x, y);
    }

    setPlayerFollow() {
        //跟踪玩家视角
        let scale = this.node.scale;
        let player1 = myApp.getInstance().player1Node;
        let followAction = cc.follow(player1, cc.rect(0, 0, this.node.width * scale - 100, this.node.height * scale));
        this.node.parent.runAction(followAction);
    }

    update(dt) {
        this.collision();
    }
}
