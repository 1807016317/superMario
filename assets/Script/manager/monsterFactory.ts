/********************
 * @Name：monsterFactory
 * @Describe：怪物生产类
 * @Author：王全由
 * @Date：2019.04.22
 ********************/
import UIUtil from "../util/uiUtil";
import dataConst from "../data/dataConst";

const { ccclass, property } = cc._decorator;

@ccclass
export default class monsterFactory extends cc.Component {

    @property(cc.Prefab)
    monsterPrefab: cc.Prefab = null;

    private _parentNode: any = null;

    init(obj, parentNode: cc.Node) {
        this._parentNode = parentNode;
        this.initMushroom(obj);
        this.initFlower(obj);
        this.initTortoise(obj);
        this.createBoss(obj);
    }

    /**
     * 蘑菇怪
     */
    initMushroom(obj) {
        let mushroom_obj = [];
        for (const key in obj) {
            if (obj[key].name == "mushroom_mon") {
                mushroom_obj.push(obj[key]);
            }
        }
        if (UIUtil.checkDataIsNull(mushroom_obj)) {
            for (const key in mushroom_obj) {
                let monster = cc.instantiate(this.monsterPrefab);
                monster.name = "mushroom_mon" + key;
                monster.parent = this._parentNode;
                monster["type"] = dataConst.roleType.monster;
                monster["moveType"] = dataConst.monsterMoveType.transverse;
                monster.group = dataConst.GROUP.monster;
                monster.getComponent("monsterControl").mushroomMove_A();
                monster.x = mushroom_obj[key].x;
                monster.y = mushroom_obj[key].y;
            }
        }
    }

    /**
     * 食人花
     */
    initFlower(obj) {
        let flower_obj = [];
        for (const key in obj) {
            if (obj[key].name == "flower_mon") {
                flower_obj.push(obj[key]);
            }
        }
        if (UIUtil.checkDataIsNull(flower_obj)) {
            for (const key in flower_obj) {
                let monster = cc.instantiate(this.monsterPrefab);
                monster["type"] = dataConst.roleType.monster;
                monster.name = "flower_mon" + key;
                monster.parent = this._parentNode;
                monster["moveType"] = dataConst.monsterMoveType.portrait;
                monster.group = dataConst.GROUP.monster;
                monster.getComponent("monsterControl").flowerAnimate();
                monster.x = flower_obj[key].x;
                monster.y = flower_obj[key].y;
            }
        }
    }

    /**
     * 爬行乌龟
     */
    initTortoise(obj) {
        let tortoise_obj = [];
        for (const key in obj) {
            if (obj[key].name == "tortoise") {
                tortoise_obj.push(obj[key]);
            }
        }
        if (UIUtil.checkDataIsNull(tortoise_obj)) {
            for (const key in tortoise_obj) {
                let monster = cc.instantiate(this.monsterPrefab);
                monster.parent = this._parentNode;
                monster["type"] = dataConst.roleType.monster;
                monster.name = "tortoise" + key;
                monster["moveType"] = dataConst.monsterMoveType.transverse;
                monster.group = dataConst.GROUP.monster;
                monster.getComponent("monsterControl").tortoiseMove_A();
                monster.x = tortoise_obj[key].x;
                monster.y = tortoise_obj[key].y;
            }
        }
    }

    /**
     * Boss
     */
    createBoss(obj) {
        for (const key in obj) {
            if (obj[key].name === "boss") {
                let monster = cc.instantiate(this.monsterPrefab);
                monster.parent = this._parentNode;
                monster["type"] = dataConst.roleType.monster;
                monster.name = "boss";
                monster["moveType"] = dataConst.monsterMoveType.transverse;
                monster.group = dataConst.GROUP.monster;
                monster.getComponent("monsterControl").bossMove_A();
                monster.x = obj[key].x;
                monster.y = obj[key].y;
            }
        }
    }
}
