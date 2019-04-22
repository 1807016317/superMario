/********************
 * @Name：audioManager
 * @Describe：游戏音效管理中心
 * @Author：王全由
 * @Date：2019.03.29
 ********************/
import UIUtil from "../util/uiUtil";

const { ccclass, property } = cc._decorator;

@ccclass
export default class AudioManager extends cc.Component {

    @property([cc.AudioClip])
    audioClip: cc.AudioClip[] = [];

    @property(cc.AudioSource)
    audioSource: cc.AudioSource = null;

    // LIFE-CYCLE CALLBACKS:


    onLoad() {
    }

    start() { }

    // /**
    //  * 预加载音效
    //  */
    // preLoadMusic(musicOrder: number) {
    //     if (UIUtil.checkDataIsNull(this.audioSource)) {
    //         this.audioSource.AudioClip = this.audio[musicOrder];
    //     }
    // }

    /**
     * 播放音效
     */
    playMusic(musicOrder: number) {
        if (UIUtil.checkDataIsNull(this.audioSource)) {
            if (this.audioSource.isPlaying) {
                this.stopMusic();
            }
            this.audioSource.clip = this.audioClip[musicOrder];
            this.audioSource.play();
        }
    }

    stopMusic() {
        if (UIUtil.checkDataIsNull(this.audioSource)) {
            this.audioSource.stop();
            this.audioSource.clip = null;
        }
    }

    /**
     * 静音
     */
    mute() {
        if (UIUtil.checkDataIsNull(this.audioSource)) {
            this.audioSource.mute = !this.audioSource.mute;
        }
    }

    /**
     * 音量设置
     */
    volumeSet() {
        if (UIUtil.checkDataIsNull(this.audioSource)) {
            this.audioSource.volume = 0;
        }
    }

    // update (dt) {}
}
