
/********************
 * @Name：player2Control
 * @Describe：玩家控制中心
 * @Author：王全由
 * @Date：2019.03.29
 ********************/
import dataConst from "../data/dataConst";

const { ccclass, property } = cc._decorator;

@ccclass
export default class player2Control extends cc.Component{

    //玩家1
    // private _score_1: number = 0; //玩家1分数
    // private _dir_1: dataConst = dataConst.LEFT;   //玩家2当前方向
    // private _moveState_1: dataConst = dataConst.STOP; //玩家2当前运动状态
    // private _state_1: dataConst = dataConst.SMALL; //玩家身体形态

    //玩家2
    private _score_2: number = 0; //玩家2分数
    private _dir_2: dataConst = dataConst.LEFT;   //玩家2当前方向
    private _moveState_2: dataConst = dataConst.STOP; //玩家2当前运动状态
    private _state_2: dataConst = dataConst.SMALL; //玩家身体形态

    //玩家1
    // set Score_1(data: number) {
    //     this._score_1 = data;
    // }

    // get Score_1(): number {
    //     return this._score_1;
    // }

    // set Direction_1(data: dataConst) {
    //     this._dir_1 = data;
    // }

    // get Direction_1(): dataConst {
    //     return this._dir_1;
    // }

    // set MoveState_1(data: dataConst) {
    //     this._moveState_1 = data;
    // }

    // get MoveState_1(): dataConst {
    //     return this._moveState_1;
    // }

    // set State_1(data: dataConst) {
    //     this._state_1 = data;
    // }

    // get State_1(): dataConst {
    //     return this._state_1;
    // }

    //玩家2
    set Score_2(data: number) {
        this._score_2 = data;
    }

    get Score_2(): number {
        return this._score_2;
    }

    set Direction_2(data: dataConst) {
        this._dir_2 = data;
    }

    get Direction_2(): dataConst {
        return this._dir_2;
    }

    set MoveState_2(data: dataConst) {
        this._moveState_2 = data;
    }

    get MoveState_2(): dataConst {
        return this._moveState_2;
    }

    set State_2(data: dataConst) {
        this._state_2 = data;
    }

    get State_2(): dataConst {
        return this._state_2;
    }
    // update (dt) {}
}
