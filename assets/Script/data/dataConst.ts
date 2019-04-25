/********************
 * @Name：dataConst
 * @Describe：全局常量定义
 * @Author：王全由
 * @Date：2019.03.28
 ********************/

export default class dataConst {
    static ONE_PLAYER = 1;  //@单人模式
    static TWO_PLAYER = 2;  //@双人模式

    static VEC2_ZERO = cc.v2(0, 0);

    static overLayer = 10; //@gameOver层

    static DOWN_TIME = "300"; //@单关倒计时，300s
    static MOVE_SPEED = 2; //@移动速度
    static JUMP_SPEED = 8; //@起跳速度
    static DOWN_SPEED = 2; //@下落初始速度

    static G_SPEED = 0.5; //@自由落体加速度
    //@层级
    static PIPE_LAYER = 10;  //水管层
    //@关卡常量
    static CHECK = {
        0: { checkNum: 1, checkStr: "1 - 1" },
        1: { checkNum: 2, checkStr: "2 - 1" },
        2: { checkNum: 3, checkStr: "3 - 1" },
        3: { checkNum: 4, checkStr: "4 - 1" },
        length: 4,
    }

    //@:状态常量
    static BODYSTATE = {
        SMALL: "small",   //小型
        BIG: "big",   //大型
        INVINCIBLE: "invincible", /* 无敌的 */
        COMBATABLE: "combatAble", /* 可战斗的 */
    }
    //@移动状态
    static MOVESTATE = {
        STOP: "stop",   //静止
        //JUMP:"jump",   //跳
        MOVE: "move",    //移动
    }

    /** 
     * 方向常量
    */
    static DIR = {
        NONE: "none",
        UP: "up",       //上
        DOWN: "down",   //下
        LEFT: "left",   //左
        RIGHT: "right", //右
    }

    /** 
     * @des:碰撞分组
    */
    static GROUP = {
        default: "default",
        wall: "wall",
        player: "player",
        monster: "monster",
        prop: "prop"
    }

    /** 
     * @des:怪物移动方式
    */
    static monsterMoveType = {
        transverse: "transverse",    /** 横向*/
        portrait: "portrait",    /** 纵向*/
        rotate: "rotate",    /** 旋转*/
    }

    /** 
     * @des:奖励类型
    */
    static rewardType = {
        coin: "coin",   /** 金币*/
        prop: "prop"    /** 道具*/
    }

    /**
     * @:道具类型
     */
    static propType = {
        mushroom: "mushroom",
        flower: "flower",
        star: "star"
    }
}
