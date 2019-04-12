import UIUtil from "../util/uiUtil";

/********************
 * @Name：audioManager
 * @Describe：游戏音效管理中心
 * @Author：王全由
 * @Date：2019.03.29
 ********************/

const { ccclass, property } = cc._decorator;

@ccclass
export default class AudioManager extends cc.Component {

    @property([cc.AudioClip])
    audio: {
        type: cc.AudioClip,
        default: []
    }

    // LIFE-CYCLE CALLBACKS:

    private _audioSource = null;

    onLoad() {
        this._audioSource = this.node.getComponent(cc.AudioSource);
    }

    start() { }

    // /**
    //  * 预加载音效
    //  */
    // preLoadMusic(musicOrder: number) {
    //     if (UIUtil.checkDataIsNull(this._audioSource)) {
    //         this._audioSource.AudioClip = this.audio[musicOrder];
    //     }
    // }

    /**
     * 播放音效
     */
    playMusic(musicOrder: number) {
        if (UIUtil.checkDataIsNull(this._audioSource)) {
            if (this._audioSource.isPlaying) {
                this.stopMusic();
            }
            this._audioSource.AudioClip = this.audio[musicOrder];
            this._audioSource.play();
        }
    }

    stopMusic() {
        if (UIUtil.checkDataIsNull(this._audioSource)) {
            this._audioSource.stop();
            this._audioSource.AudioClip = null;
        }
    }

    /**
     * 静音
     */
    mute() {
        if (UIUtil.checkDataIsNull(this._audioSource)) {
            this._audioSource.mute = !this._audioSource.mute;
        }
    }

    /**
     * 音量设置
     */
    volumeSet() {
        if (UIUtil.checkDataIsNull(this._audioSource)) {
            this._audioSource.volume = 0;
        }
    }

    // update (dt) {}
}
