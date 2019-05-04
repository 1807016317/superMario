/********************
 * @Name：nodePool
 * @Describe：节点缓存池
 * @Author：王全由
 * @Date：2019.04.29
 ********************/

export default class nodePool {
    private static _instance: nodePool = null;

    private _bulletPool: cc.NodePool = null;

    /**
     * getInstance()
     */
    public static getInstance(): nodePool {
        if (this._instance == null) {
            this._instance = new nodePool();
        }
        return this._instance;
    }

    private constructor() {}

    /**
     * 创建子弹并加入子弹缓存池
     */
    createBullet(prefab) {
        this._bulletPool = new cc.NodePool();
        let initCount = 4;
        for (let i = 0; i < initCount; ++i) {
            let bullet = cc.instantiate(prefab); // 创建节点
            bullet.name = "bullet";
            this._bulletPool.put(bullet); // 通过 put 接口放入对象池
        }
    }

    /**
     * 从缓存池中取出并生成子弹
     */
    onBulletInit(parentNode) {
        let bullet = null;
        if (this._bulletPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            bullet = this._bulletPool.get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            return;
            //bullet = cc.instantiate();
        }
        bullet.parent = parentNode.parent; // 将生成的子弹加入节点树
        let box = parentNode.getBoundingBox();
        bullet.setPosition(box.center);
        bullet.getComponent('bullet').init(); //接下来就可以调用节点身上的脚本进行初始化
    }

    /**
     * 子弹放回缓存池中
     */
    onBulletKilled(bullet) {
        // bullet 应该是一个 cc.Node
        this._bulletPool.put(bullet); // 和初始化时的方法一样，将节点放进对象池，这个方法会同时调用节点的 removeFromParent
    }
}
