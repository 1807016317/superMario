import myApp from "../myApp";
import UIUtil from "../util/uiUtil";
import dataConst from "../data/dataConst";

/********************
 * @Name：GM
 * @Describe：控制台
 * @Author：王全由
 * @Date：2019.04.02
 ********************/

const { ccclass, property } = cc._decorator;

@ccclass
export default class GM extends cc.Component {

    @property(cc.EditBox)
    editbox:cc.EditBox = null;

    onLoad() {
        this.node.width = cc.view.getVisibleSize().width;
        this.node.height = cc.view.getVisibleSize().height;
    }

    closeBtn() {
        this.node.destroy();
    }

    /**
     * 直达终点
     */
    toFinal() {
        let width = myApp.getInstance().tileNode.width * myApp.getInstance().fixScale;
        let h = myApp.getInstance().tileNode.height * myApp.getInstance().fixScale;
        myApp.getInstance().player1Node.x = myApp.getInstance().tileNode.width - 200;
        myApp.getInstance().player1Node.y = 100;
        this.closeBtn();
    }

    /**
     * 回到起点
     */
    backStart() {
        myApp.getInstance().player1Node.x = 100;
        myApp.getInstance().player1Node.y = 100;
        this.closeBtn();
    }

    setMoveSpeed() {
        let speed = Number(this.editbox.string);
        if(UIUtil.checkDataIsNull(speed)) {
            myApp.getInstance().moveSpeed = speed;
        }
    }

    /**
     * 一键变大
     */
    toBig() {
        myApp.getInstance().player1Node.getComponent("player1Control").state_1 = dataConst.BODYSTATE.BIG;
        this.closeBtn();    
    }

    /**
     * 一键无敌
     */
    toInvincible() {
        myApp.getInstance().player1Node.getComponent("player1Control").state_1 = dataConst.BODYSTATE.INVINCIBLE;
        this.closeBtn();  
    }
}
