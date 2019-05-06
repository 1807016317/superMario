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
import propFactory from "../manager/propFactory";
import audioData from "../data/audioData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class tiledMapUtil extends cc.Component {

    private _curMap: cc.TiledMap = null;
    private _allLayers = null;
    private _objectGroups = null;
    private _mapSize = null;
    private _tileSize = null;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.init();
        myApp.getInstance().tileNode = this.node;

        this._mapSize = this._curMap.getMapSize();
        this._tileSize = this._curMap.getTileSize();
    }

    onEnable() {
        EventManager.getInstance().on(EventConst.CHANGE_MAP, this.changeMap.bind(this));
        EventManager.getInstance().on(EventConst.CHECK_COLLSION, this.scheduleCollision.bind(this));
    }

    onDisable() {
        EventManager.getInstance().off(EventConst.CHANGE_MAP);
        EventManager.getInstance().off(EventConst.CHECK_COLLSION);
    }

    start() {
        this.updateSize();
        this.setPlayerFollow();
    }

    init() {
        this._curMap = this.node.getComponent(cc.TiledMap);
        this._allLayers = this._curMap.getLayers();
        //设置水管层的渲染层级
        let noCoinLayer = this._curMap.getLayer(layerData.data[2001].name);
        let coinLayer = this._curMap.getLayer(layerData.data[2002].name);
        let landLayer = this._curMap.getLayer(layerData.data[2003].name);
        let pipeLayer = this._curMap.getLayer(layerData.data[2006].name);
        let propLayer = this._curMap.getLayer(layerData.data[2007].name);
        pipeLayer.node.zIndex = dataConst.PIPE_LAYER;
        landLayer.node.zIndex = dataConst.PIPE_LAYER;
        noCoinLayer.node.zIndex = dataConst.PIPE_LAYER;
        coinLayer.node.zIndex = dataConst.PIPE_LAYER;
        propLayer.node.zIndex = dataConst.PIPE_LAYER;
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
                this.unschedule(this.scheduleCollision(null));
                myApp.getInstance().checkNum = dataConst.CHECK[checkNum].checkNum - 1;
                myApp.getInstance().checkStr = dataConst.CHECK[checkNum].checkStr;
                EventManager.getInstance().emit(EventConst.UPDATE_UI);
                UIUtil.loaderRes(mapData.data[myApp.getInstance().checkNum].name, cc.TiledMapAsset, (mapAsset) => {
                    this._curMap.tmxAsset = mapAsset;
                    this.updateSize();
                    let objectGroups = this._curMap.getObjectGroups();
                    let player1_Obj = objectGroups[0].getObject("player1");
                    player1.setPosition(player1_Obj.x, player1_Obj.y);
                    this.init();
                    player1.zIndex = dataConst.PIPE_LAYER - 1;
                    EventManager.getInstance().emit(EventConst.INIT_MONSTER);
                    EventManager.getInstance().emit(EventConst.COLLSION_HANDLE);
                })
            }
        }
    }

    updateSize() {
        myApp.getInstance().mapSize = this._curMap.getMapSize();
        myApp.getInstance().tileSize = this._curMap.getTileSize();
    }

    /**
     * 传入节点与TiledLayer碰撞检测
     */
    scheduleCollision(event) {
        function checkCollision() {
            this.collision(event)
        }
        this.schedule(checkCollision, 0);
        if(event === null) {
            return checkCollision;
        }
    }

    collision(event) {
        let target = event[0];
        if (!UIUtil.checkNodeisLive(target)) {
            return;
        }
        let target_box = target.getBoundingBox();
        let box_origin = target_box.origin;
        //从上下左右四个方向来判断是否产生碰撞
        let box_top_right = cc.v2(box_origin.x + target_box.width * 9 / 10, box_origin.y + target_box.height + this._tileSize.height / 2);//上
        let box_top_left = cc.v2(box_origin.x, box_origin.y + target_box.height + this._tileSize.height / 2);//上
        let box_top_center = cc.v2(box_origin.x + target_box.width / 2, box_origin.y + target_box.height + this._tileSize.height / 2);//上
        let box_bottom_left = cc.v2(box_origin.x, box_origin.y - this._tileSize.height / 2);//下
        let box_bottom_center = cc.v2(box_origin.x + target_box.width / 2, box_origin.y);//下
        let box_bottom_right = cc.v2(box_origin.x + target_box.width * 9 / 10, box_origin.y - this._tileSize.height / 2);//下
        let box_left_top = cc.v2(box_origin.x - target_box.width * 1 / 10, box_origin.y + target_box.height);//左
        let box_left = cc.v2(box_origin.x - target_box.width * 1 / 10, box_origin.y + target_box.height / 4);//左
        let box_right = cc.v2(box_origin.x + target_box.width * 11 / 10, box_origin.y + target_box.height / 4);//右
        let box_right_top = cc.v2(box_origin.x + target_box.width * 11 / 10, box_origin.y + target_box.height);//右
        this.checkGIDAt(box_top_left, dataConst.DIR.UP, event);
        this.checkGIDAt(box_top_right, dataConst.DIR.UP, event);
        this.checkGIDAt(box_top_center, dataConst.DIR.UP, event);
        this.checkGIDAt(box_bottom_left, dataConst.DIR.DOWN, event, box_bottom_right);
        //this.checkGIDAt(box_bottom_right, dataConst.DIR.DOWN, event);
        this.checkGIDAt(box_left_top, dataConst.DIR.LEFT, event);
        this.checkGIDAt(box_left, dataConst.DIR.LEFT, event);
        this.checkGIDAt(box_right_top, dataConst.DIR.RIGHT, event);
        this.checkGIDAt(box_right, dataConst.DIR.RIGHT, event);
    }

    /**
     * 获取当前坐标的坐标
     * @param supplement //补充参数
     */
    checkGIDAt(pos: cc.Vec2, dir, event, supplement?) {
        let vec = this.toTilesPos(pos);
        if (vec.x < 0 || vec.y < 0) {
            if (event[0].type == dataConst.roleType.monster) {
                event[0].destroy();
            }
            return;
        }
        if (vec.y >= this._mapSize.height) {
            if (UIUtil.checkDataIsNull(event[2])) {
                event[2](dir);
            }
            if (event[0].type == dataConst.roleType.monster) {
                event[0].destroy();
            } else if (event[0].type == dataConst.roleType.player){
                EventManager.getInstance().emit(EventConst.GAMEOVER);
            }
            return;
        }

        let hasColl = false;   //判断向上是否撞到东西
        let target_origin = event[0].getPosition();
        if(dir == dataConst.DIR.DOWN) {
            target_origin = this.toViewPos(vec);
        }
        let vec_View = this.toViewPos(vec);
        vec_View.y += this._tileSize.width;
        for (const key in this._allLayers) {
            let properties = this._allLayers[key].getProperties();
            if (properties["isColliding"]) {
                let tileGid = this._allLayers[key].getTileGIDAt(vec);
                if (tileGid != 0) {
                    //gid不等于0时，是碰撞到了，返回真
                    let reward = null;
                    if(event[0].type == dataConst.roleType.player) {
                        reward = this.rewardCollsion(this._allLayers[key].getLayerName(), vec_View, dir)
                    }
                    let arg = [
                        target_origin,
                        dir,
                        reward
                    ]
                    if (UIUtil.checkDataIsNull(event[1])
                    && this._allLayers[key].getLayerName() != layerData.data[2005].name) {
                        event[1](arg);
                    }
                    hasColl = true;
                    if (UIUtil.checkDataIsNull(reward)) {
                        this._allLayers[key].setTileGIDAt(0, vec.x, vec.y);
                        hasColl = false;
                    }
                }
            }
        }
        if (!hasColl && UIUtil.checkDataIsNull(event[2])) {
            event[2](dir);
            if(UIUtil.checkDataIsNull(supplement)) {
                this.checkGIDAt(supplement, dir, event);
            }
        }
        //EventManager.getInstance().emit(EventConst.CHECK_FALL, dir);
    }

    /**
     * 奖励碰撞
     */
    rewardCollsion(name, pos, dir) {
        switch (name) {
            case layerData.data[2002].name:
                if (dir == dataConst.DIR.UP) {
                    EventManager.getInstance().emit(EventConst.MUSIC_PLAY, audioData.data[4].id);
                    propFactory.getInstance().initCoin(this.node, pos);
                    return dataConst.rewardType.coin;
                }
                return null;
            case layerData.data[2005].name:
                return dataConst.rewardType.coin;
            case layerData.data[2007].name:
                if (dir == dataConst.DIR.UP) {
                    EventManager.getInstance().emit(EventConst.MUSIC_PLAY, audioData.data[2].id);
                    propFactory.getInstance().initProp(this.node, pos);
                    return dataConst.rewardType.prop;
                }
                return null;
            default:
                return null;
        }
    }

    /**
     * 将屏幕坐标转换为TiledMap的坐标
     */
    toTilesPos(pos: cc.Vec2) {
        let y = this._mapSize.height - Math.floor(pos.y / this._tileSize.height) - 1;
        let x = Math.floor(pos.x / this._tileSize.width);
        // if (y >= this._mapSize.height) {
        //     return cc.v2(x, this._mapSize.height - 1);
        // }
        return cc.v2(x, y);
    }

    /**
     * 将TiledMap坐标转换为屏幕的坐标
     */
    toViewPos(pos: cc.Vec2) {
        let x = pos.x * this._tileSize.width + this._tileSize.width / 2;
        let y = (this._mapSize.height - pos.y) * this._tileSize.height - this._tileSize.height / 2;
        return cc.v2(x, y);
    }

    setPlayerFollow() {
        //跟踪玩家视角
        let scale = this.node.scale;
        let player1 = myApp.getInstance().player1Node;
        let followAction = cc.follow(player1, cc.rect(0, 0, this.node.width * scale - 100, this.node.height * scale));
        this.node.parent.runAction(followAction);
    }

    //update(dt) {
    //}
}
