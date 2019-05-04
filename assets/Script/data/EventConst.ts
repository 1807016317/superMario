/********************
 * @Name：EventConst
 * @Describe：事件常量
 * @Author：王全由
 * @Date：2019.03.28
 ********************/

export default class EventConst {
    static CHANGE_MAP = "changMap"; //地图切换
    static UPDATE_UI = "updateUI";  //屏幕UI更新
    static COLLSION_HANDLE = "collsion_handle"; //碰撞处理
    static ANIMATION_PLAY = "animationPlay"; //玩家自由下落
    static CHECK_COLLSION = "check_collsion"; //碰撞检测
    static GAMEOVER = "gameOver"; //死掉检测
    static CHECK_FALL = "check_fall"; //玩家下落判定
    static ADD_SCORE = "addScore"; //玩家加分

    /**
     * @:音效事件
     */
    static MUSIC_PLAY = "musicPlay";
    static MUSIC_STOP = "musicStop";
    static MUSIC_MUTE = "music_mute";//静音
    static MUSIC_VOLUME = "volumeSet";//音量设置
}
