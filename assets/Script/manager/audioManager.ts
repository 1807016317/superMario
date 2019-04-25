/********************
 * @Name：audioManager
 * @Describe：游戏音效管理中心
 * @Author：王全由
 * @Date：2019.03.29
 ********************/
import UIUtil from "../util/uiUtil";
import EventManager from "./EventManager";
import EventConst from "../data/EventConst";

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

    onEnable() {
        EventManager.getInstance().on(EventConst.MUSIC_PLAY, this.playMusic.bind(this));
        EventManager.getInstance().on(EventConst.MUSIC_STOP, this.stopMusic.bind(this));
        EventManager.getInstance().on(EventConst.MUSIC_MUTE, this.mute.bind(this));
        EventManager.getInstance().on(EventConst.MUSIC_VOLUME, this.volumeSet.bind(this));
    }

    onDisable() {
        EventManager.getInstance().off(EventConst.MUSIC_PLAY);
        EventManager.getInstance().off(EventConst.MUSIC_STOP);
        EventManager.getInstance().off(EventConst.MUSIC_MUTE);
        EventManager.getInstance().off(EventConst.MUSIC_VOLUME);
    }

    // /**
    //  * 预加载音效
    //  */
    // preLoadMusic(musicOrder: number) {
    //     if (UIUtil.checkDataIsNull(this.audioSource)) {
    //         this.audioSource.AudioClip = this.audio[musicOrder];
    //     }
    // }

    /**
     * @:播放音乐
     */
    playMusic(event) {
        let musicOrder = event[0] ? event[0] : event;
        if (UIUtil.checkDataIsNull(this.audioSource)) {
            if (this.audioSource.isPlaying) {
                this.stopMusic();
            }
            this.audioSource.clip = this.audioClip[musicOrder];
            this.audioSource.play();
        }
    }

    /**
     * @:播放音效
     */
    public playEffect(event) {
        let musicOrder = event[0] ? event[0] : event;
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
    volumeSet(event) {
        let vol = event[0] ? event[0] : event;
        if (UIUtil.checkDataIsNull(this.audioSource)) {
            this.audioSource.volume = vol;
        }
    }

    // update (dt) {}
}
