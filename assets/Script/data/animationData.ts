/********************
 * @Name：animationData
 * @Describe：动画常量
 * @Author：王全由
 * @Date：2019.04.01
 ********************/

export default class animationData {
    static player = {
        1001: { name: "player1_small_walk" },
        1002: { name: "player1_small_die" },
        1003: { name: "player1_big_walk" },
        1004: { name: "player1_big_die" },
        1005: { name: "player1_toBig" }
    }

    static mushroom = {
        1005: { name: "mushroom_move" },
        1006: { name: "mushroom_die1", des: "被踩死" },
        1007: { name: "mushroom_die2", des: "被子弹打死" }
    }

    static tortoise = {
        1008: { name: "tortoise_move" },
        1009: { name: "flyTortoise_move" },
        1010: { name: "tortoise_die" }
    }

    static boss = {
        1011: { name: "boss" }
    }

    static flower = {
        1012: { name: "flower" }
    }
}
