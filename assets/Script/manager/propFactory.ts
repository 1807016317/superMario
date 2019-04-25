/********************
 * @Name：propFactory
 * @Describe：道具生产类
 * @Author：王全由
 * @Date：2019.04.24
 ********************/
import UIUtil from "../util/uiUtil";
import myApp from "../myApp";
import dataConst from "../data/dataConst";

export default class propFactory {
    private static _instance: propFactory = null;

    public static getInstance(): propFactory {
        if (this._instance == null) {
            this._instance = new propFactory();
        }
        return this._instance;
    }

    /**
     * @：创造金币
     */
    initCoin(parent, pos) {
        //let parent = event[0];
        //let pos = event[1];
        UIUtil.loaderRes("uiPrefab/coinJump", cc.Prefab, (pre) => {
            let coin = cc.instantiate(pre);
            coin.parent = parent;
            let vec = cc.v2(pos.x, pos.y - myApp.getInstance().tileSize.height / 2);
            coin.setPosition(vec);
            let moveUp = cc.moveBy(0.2, 0, myApp.getInstance().tileSize.height);
            let seq = cc.sequence(moveUp, cc.delayTime(0.1), cc.callFunc(() => {
                coin.destroy();
            }));
            coin.runAction(seq);
            // coin.getComponent(cc.Animation).on('stop', () => {
            //     coin.destroy();
            // }, this);
        });
    }

    /**
     * @:创造道具
    */
    initProp(parent, pos) {
        UIUtil.loaderRes("uiPrefab/prop", cc.Prefab, (pre) => {
            let prop = cc.instantiate(pre);
            prop.parent = parent;
            prop.group = dataConst.GROUP.prop;
            let vec = cc.v2(pos.x, pos.y - myApp.getInstance().tileSize.height / 2);
            prop.setPosition(vec);
            let moveUp = cc.moveBy(0.2, 0, myApp.getInstance().tileSize.height / 2);
            prop.runAction(moveUp);
            let player1 = myApp.getInstance().player1Node;
            this.typeOfProp(player1["state_1"], prop);
        });
    }

    typeOfProp(state, prop) {
        let propAnimation = prop.getComponent(cc.Animation);
        let clips = propAnimation.getClips();
        switch (state) {
            case dataConst.BODYSTATE.SMALL:
                prop["type"] = dataConst.propType.mushroom;
                propAnimation.play(clips[0].name);
                break;
            case dataConst.BODYSTATE.BIG:
                prop["type"] = dataConst.propType.flower;
                propAnimation.play(clips[1].name);
                break;
            case dataConst.BODYSTATE.COMBATABLE:
                prop["type"] = dataConst.propType.star;
                propAnimation.play(clips[2].name);
                break;
            case dataConst.BODYSTATE.INVINCIBLE:
                prop["type"] = dataConst.propType.star;
                propAnimation.play(clips[2].name);
                break;
        }
    }
}
