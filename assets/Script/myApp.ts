
/********************
 * @Name：myApp
 * @Describe：全局变量定义
 * @Author：王全由
 * @Date：2019.03.28
 ********************/

export default class myApp {
    private static _instance: myApp = null;

    private _tiledNode: cc.Node = null;
    private _playerNum: number = null;
    private _checkStr: string = "";
    private _checkNum: number = null;
    private _player1Node: cc.Node = null;
    private _player2Node: cc.Node = null;
    private _fixScale: number = null;
    private _moveSpeed: number = 1.5;
    private _mapSize: cc.Size = null;
    private _tileSize: cc.Size = null;

    private constructor() {}

    public static getInstance(): myApp {
        if (this._instance == null) {
            this._instance = new myApp();
        }
        return this._instance;
    }

    public set tileNode(node: cc.Node) {
        this._tiledNode = node;
    }

    public get tileNode(): cc.Node {
        return this._tiledNode;
    }

    public set playerNum(data: number) {
        this._playerNum = data;
    }

    public get playerNum(): number {
        return this._playerNum;
    }

    public set checkStr(data: string) {
        this._checkStr = data;
    }

    public get checkStr(): string {
        return this._checkStr;
    }

    public set checkNum(data: number) {
        this._checkNum = data;
    }

    public get checkNum(): number {
        return this._checkNum;
    }

    public set player1Node(node: cc.Node) {
        this._player1Node = node;
    }

    public get player1Node(): cc.Node {
        return this._player1Node;
    }

    public set player2Node(node: cc.Node) {
        this._player2Node = node;
    }

    public get player2Node(): cc.Node {
        return this._player2Node;
    }

    public set fixScale(data: number) {
        this._fixScale = data;
    }

    public get fixScale(): number {
        return this._fixScale;
    }

    public set moveSpeed(data: number) {
        this._moveSpeed = data;
    }

    public get moveSpeed(): number {
        return this._moveSpeed;
    }

    public get mapSize(): cc.Size {
        return this._mapSize;
    }
    public set mapSize(value: cc.Size) {
        this._mapSize = value;
    }

    public get tileSize(): cc.Size {
        return this._tileSize;
    }
    public set tileSize(value: cc.Size) {
        this._tileSize = value;
    }

}