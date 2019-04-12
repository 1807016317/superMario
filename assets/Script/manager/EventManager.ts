import UIUtil from "../util/uiUtil";

/********************
 * @Name：EventManager
 * @Describe：事件管理中心
 * @Author：王全由
 * @Date：2019.04.02
 ********************/

export default class EventManager {
    private static _instance: EventManager = null;

    private _eventArray = {};

    public static getInstance(): EventManager {
        if (this._instance == null) {
            this._instance = new EventManager();
        }
        return this._instance;
    }

    /**
     * 注册事件
     */
    public on(eventName: string, callback: Function) {
        this._eventArray[eventName] = callback;
    }

    /**
     * 注册一次性事件
     */
    public once(eventName: string, callback: Function) {
        function on(eventName: string, callback: Function) {
            this.off(eventName);
        }

        this.on(eventName, on);
    }

    /**
     * 执行事件
     */
    public emit(eventName: string, ...params) {
        if (UIUtil.checkDataIsNull(this._eventArray[eventName])) {
            this._eventArray[eventName](params);
        }
    }

    /**
     * 注销事件
     */
    public off(eventName: string) {
        if (UIUtil.checkDataIsNull(this._eventArray[eventName])) {
            delete this._eventArray[eventName];
        }
    }

    public deleteAllEvent() {
        this._eventArray = {};
    }

}
