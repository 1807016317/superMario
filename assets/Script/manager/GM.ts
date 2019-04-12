import myApp from "../myApp";
import UIUtil from "../util/uiUtil";

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
        myApp.getInstance().player1Node.x = width - 100;
        myApp.getInstance().player1Node.y = 32;
        this.closeBtn();
    }

    /**
     * 回到起点
     */
    backStart() {
        myApp.getInstance().player1Node.x = 50;
        myApp.getInstance().player1Node.y = 32;
        this.closeBtn();
    }

    setMoveSpeed() {
        let speed = Number(this.editbox.string);
        if(UIUtil.checkDataIsNull(speed)) {
            myApp.getInstance().moveSpeed = speed;
        }
    }
}
