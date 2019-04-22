/********************
 * @Name：game_scene
 * @Describe：游戏主场景
 * @Author：王全由
 * @Date：2019.03.28
 ********************/
import myApp from "../myApp";
import dataConst from "../data/dataConst";
import UIUtil from "../util/uiUtil";
import player1Control from "../manager/player1Control";
import player2Control from "../manager/player2Control";
import EventManager from "../manager/EventManager";
import EventConst from "../data/EventConst";
import audioData from "../data/audioData";
import AudioManager from "../manager/audioManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class gameScene extends cc.Component {

    @property(cc.TiledMap)
    tiledMap: cc.TiledMap = null;

    @property([cc.Prefab])
    playerPrefab: cc.Prefab[] = [];

    @property(cc.Node)
    uiNode: cc.Node = null;

    @property(cc.Node)
    gameOver: cc.Node = null;

    @property(cc.Node)
    audioManager: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:
    private _player1Comtrol: player1Control = null;
    private _player2Comtrol: player2Control = null;

    onLoad() {
        this.gameOver.active = false;
        this.initPlayer();
        this.initUINode();
        this.initTiledMapSize();
    }

    onEnable() {
        EventManager.getInstance().on(EventConst.UPDATE_UI, this.updateUINode.bind(this));
        EventManager.getInstance().on(EventConst.GAMEOVER, this.gameEnd.bind(this));
        let collisionManager = cc.director.getCollisionManager();
        collisionManager.enabled = true;//开启碰撞检测
        //collisionManager.enabledDebugDraw = true;//画边线
        //collisionManager.enabledDrawBoundingBox = true;//包围盒显示
    }

    onDisable() {
        EventManager.getInstance().off(EventConst.UPDATE_UI);     
        EventManager.getInstance().off(EventConst.GAMEOVER);     
    }

    start() {
        let AudioManager: AudioManager = this.audioManager.getComponent("audioManager");
        AudioManager.playMusic(audioData.data[0].id);
    }

    initTiledMapSize() {
        //格子地图适配屏幕大小
        let tiledNode = this.tiledMap.node;
        let viewSize = cc.view.getVisibleSize();
        //let canvasHight = this.node.parent.height;
        //let canvasWidth = this.node.parent.width;
        tiledNode.x = -viewSize.width / 2;
        tiledNode.y = -viewSize.height / 2;
        tiledNode.scale = viewSize.height / tiledNode.height;
        myApp.getInstance().fixScale = tiledNode.scale;
    }

    initPlayer() {
        //初始化玩家
        let objectGroups = this.tiledMap.getObjectGroups();
        //objectGroups[0]._sgNode._visible = false;   //直接访问了私有变量，访问成功，但是编辑器报错
        let objects = objectGroups[0].getObjects();
        //console.log("格子地图对象层所有对象");
        //console.log(objects);
        //创建单人
        if (UIUtil.checkDataIsNull(myApp.getInstance().playerNum)) {
            let player1_Obj = objectGroups[0].getObject("player1");
            let player1 = cc.instantiate(this.playerPrefab[0]);
            player1.parent = this.tiledMap.node;
            myApp.getInstance().player1Node = player1;
            this._player1Comtrol = player1.getComponent("player1Control");
            player1.setPosition(player1_Obj.x, player1_Obj.y);
            //创建第二个角色
            if (myApp.getInstance().playerNum == dataConst.TWO_PLAYER) {
                console.assert(false, "data is error");
                let player2_Obj = objectGroups[0].getObject("player2");
                let player2 = cc.instantiate(this.playerPrefab[1]);
                player2.parent = this.tiledMap.node;
                myApp.getInstance().player2Node = player2;
                player2.setPosition(player2_Obj.sgNode.getPosition());
            }
        }
    }

    initUINode() {
        //初始化UI
        //当前关卡
        let checkNode = this.uiNode.getChildByName("check");
        //let checkNode = UIUtil.seekChildByName(this.uiNode, "check");
        checkNode.getComponent(cc.Label).string = myApp.getInstance().checkStr;
        //倒计时
        //let timeLabNode = this.uiNode.getChildByName("time").getChildByName("timeLab");
        let timeLabNode = UIUtil.seekChildByName(this.uiNode, "timeLab");
        timeLabNode.getComponent(cc.Label).string = dataConst.DOWN_TIME;
        this.schedule(() => {
            let time = Number(timeLabNode.getComponent(cc.Label).string);
            time -= 1;
            timeLabNode.getComponent(cc.Label).string = time + "";
        }, 1);
        //角色分数
        let score1 = UIUtil.seekChildByName(this.uiNode, "score1");
        let score2 = UIUtil.seekChildByName(this.uiNode, "score2");
        if (UIUtil.checkDataIsNull(this._player1Comtrol)) {
            score1.getComponent(cc.Label).string = this._player1Comtrol.score_1 + "";
        }
        if (UIUtil.checkDataIsNull(this._player2Comtrol)) {
            score2.getComponent(cc.Label).string = this._player2Comtrol.Score_2 + "";
        }
        if (UIUtil.checkDataIsNull(myApp.getInstance().playerNum) && myApp.getInstance().playerNum == dataConst.ONE_PLAYER) {
            this.uiNode.getChildByName("role2").active = false;
        }
    }

    updateUINode() {
        let checkNode = this.uiNode.getChildByName("check");
        checkNode.getComponent(cc.Label).string = myApp.getInstance().checkStr;
        //角色分数
        let score1 = UIUtil.seekChildByName(this.uiNode, "score1");
        let score2 = UIUtil.seekChildByName(this.uiNode, "score2");
        if (UIUtil.checkDataIsNull(this._player1Comtrol)) {
            score1.getComponent(cc.Label).string = this._player1Comtrol.score_1 + "";
        }
        if (UIUtil.checkDataIsNull(this._player2Comtrol)) {
            score2.getComponent(cc.Label).string = this._player2Comtrol.Score_2 + "";
        }
    }

    gameEnd() {
        this.gameOver.active = true;
        let seq = cc.sequence(cc.delayTime(15), cc.callFunc(()=>{
            //this.gameOver.active = false;
            cc.director.loadScene("menu_scene");
        }));
        this.node.runAction(seq);
    }

    // update (dt) {}
}