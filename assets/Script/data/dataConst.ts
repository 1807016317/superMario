/********************
 * @Name：dataConst
 * @Describe：全局常量定义
 * @Author：王全由
 * @Date：2019.03.28
 ********************/

export default class dataConst {
    static ONE_PLAYER = 1;  //单人模式
    static TWO_PLAYER = 2;  //双人模式

    static DOWN_TIME = "300"; //单关倒计时，300s
    static MOVE_SPEED = 2; //移动速度
    static JUMP_HIGHT = 64; //移动速度

    static G_SPEED = 0.56; //自由落体加速度
    //层级
    static PIPE_LAYER = 10;  //水管层
    //关卡常量
    static CHECK = {
        0: { checkNum: 1, checkStr: "1 - 1" },
        1: { checkNum: 2, checkStr: "2 - 1" },
        2: { checkNum: 3, checkStr: "3 - 1" },
        3: { checkNum: 4, checkStr: "4 - 1" },
        length: 4,
    }

    //状态常量
    static SMALL = "small";   //小型
    static BIG = "big";   //大型
    static INVINCIBLE = "invincible"; //无敌的
    static COMBATABLE = "combatAble"; //可战斗的
    //移动状态
    static STOP = "stop";   //静止
    //static JUMP = "jump";   //跳
    static MOVE = "move";   //移动

    //方向常量
    static UP = "up";       //上
    static DOWN = "down";   //下
    static LEFT = "left";   //左
    static RIGHT = "right"; //右
}
