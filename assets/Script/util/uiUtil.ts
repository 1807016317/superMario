/********************
 * @Name：UIUtil
 * @Describe：渲染需要公用方法
 * @Author：王全由
 * @Date：2019.03.29
 ********************/

export default class UIUtil {

    //判断节点是否可用
    static checkNodeisLive(node: cc.Node) {
        if (node != null && node != undefined && node.isValid) {
            return true;
        }
        return false;
    }

    //判断数据是否为空
    static checkDataIsNull(data: any) {
        if (data == null || data == undefined) {
            return false;
        }
        return true;
    }

    //查找子节点
    static seekChildByName(root: cc.Node, name: string): cc.Node {
        if (!UIUtil.checkNodeisLive(root)) {
            return null;
        }
        if (root.name == name) {
            return root;
        }
        let children = root.children;
        for (let key in children) {
            if (children[key]) {
                let child = UIUtil.seekChildByName(children[key], name)
                if (child != null) {
                    return child;
                }
            }
        }
    }

    //快排,true,为由小到大，false为由大到小,默认由小到大
    static sort(tab: any[], ord?: boolean, key?): any[] {
        let order = ord
        if (order == null) {
            order = true
        }
        let pos = 0
        while (pos < tab.length - 1) {
            let i = pos
            let j = tab.length - 1
            let i_move = i
            let j_move = j
            while (i_move <= j_move) {
                let temp_1 = tab[i]
                let temp_2 = tab[j]
                i_move++
                j_move--
                let value_i_base = tab[i]
                let value_i_move = tab[i_move]
                let value_j_base = tab[j]
                let value_j_move = tab[j_move]
                if (key) {
                    value_i_base = tab[i][key]
                    value_i_move = tab[i_move][key]
                    value_j_base = tab[j][key]
                    value_j_move = tab[j_move][key]
                }
                if (order) {
                    if (value_i_base > value_i_move) {
                        tab[i] = tab[i_move]
                        tab[i_move] = temp_1
                    }
                    if (value_j_base > value_j_move) {
                        tab[j] = tab[j_move]
                        tab[j_move] = temp_2
                    }
                }
                else {
                    if (value_i_base < value_i_move) {
                        tab[i] = tab[i_move]
                        tab[i_move] = temp_1
                    }
                    if (value_j_base < value_j_move) {
                        tab[j] = tab[j_move]
                        tab[j_move] = temp_2
                    }
                }

            }
            let value_i_base = tab[i]
            let value_j_base = tab[j]
            let temp = tab[i]
            if (key) {
                value_i_base = tab[i][key]
                value_j_base = tab[j][key]
            }
            if (order) {
                if (value_i_base > value_j_base) {
                    tab[i] = tab[j]
                    tab[j] = temp
                }
            }
            else {
                if (value_i_base < value_j_base) {
                    tab[i] = tab[j]
                    tab[j] = temp
                }
            }
            pos++
        }
        return tab
    }

    //创建rect矩形
    static objectToRect(obj) {
        let y = obj.y - obj.height;
        return cc.rect(obj.x, y, obj.width, obj.height);
    }

    /*
    *   加载控制台
    **/
    static loadGM() {
        cc.loader.loadRes("gameControl", cc.Prefab, (error, prefab) => {
            if (error) {
                cc.error(error.message || error);
                return;
            }
            let GM = cc.instantiate(prefab);
            GM.parent = cc.find("Canvas");
        })
    }

    static loaderRes(path: string, type: typeof cc.Asset, callback: Function) {
        cc.loader.loadRes(path, type, (error, data) => {
            if (error) {
                cc.error(error.message || error);
                return;
            }
            if(UIUtil.checkDataIsNull(callback) && UIUtil.checkDataIsNull(data)) {
                callback(data);
            }
        })
    }
}
