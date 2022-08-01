export default {
    // 转换拼接方法 两组
    transition2(e) {
        let obj = {};
        e.forEach(item => {
            obj[item.key] = item.value;
        });
        return obj;
    },
    // 转换拼接方法 三组
    transition3(e) {
        let obj1 = {};
        let obj2 = {};
        e.forEach(item => {
            if (item.key && item.select && item.value) {
                obj2[item.select] = item.value;
                obj1[item.key] = obj2;
                obj2 = {};
            }
        });
        return obj1;
    },
    transition3k(e) {
        let obj1 = {};
        let obj2 = {};
        e.forEach(item => {
            if (item.k1 && item.k2 && item.k3) {
                obj2[item.k2] = item.k3;
                obj1[item.k1] = obj2;
                obj2 = {};
            }
        });
        return obj1;
    },
    // 字符串 反转数组格式 两组
    reversal2(e) {
        let obj = JSON.parse(e);
        let arr = [];
        for (var key in obj) {
            let arrFor = [];
            if (!obj.hasOwnProperty(key)) {
                continue;
            }
            arrFor.key = key;
            arrFor.value = obj[key];
            arr.push(arrFor);
        }
        console.log(arr, '我太难了');
        return arr;
    },
    // 字符串 反转数组格式 三组
    reversal3(e) {
        let obj = JSON.parse(e);
        let arr = [];
        for (var key in obj) {
            let arrFor = [];
            if (!obj.hasOwnProperty(key)) {
                continue;
            }
            arrFor.key = key;
            let arr1 = [];
            for (var key1 in obj[key]) {
                arr1.select = key1;
                arr1.value = obj[key][key1];
            }
            arrFor.select = arr1.select;
            arrFor.value = arr1.value;

            arr.push(arrFor);
            // debugger
        }
        // console.log(arr,'我太难了')
        return arr;
    },
    // 删除重复多余对象方法
    deteleObject(obj) {
        var uniques = [];
        var stringify = {};
        for (var i = 0; i < obj.length; i++) {
            var keys = Object.keys(obj[i]);
            keys.sort(function(a, b) {
                return Number(a) - Number(b);
            });
            var str = '';
            for (var j = 0; j < keys.length; j++) {
                str += JSON.stringify(keys[j]);
                str += JSON.stringify(obj[i][keys[j]]);
            }
            if (!stringify.hasOwnProperty(str)) {
                uniques.push(obj[i]);
                stringify[str] = true;
            }
        }
        uniques = uniques;
        return uniques;
    },
    // 缺陷数据转换
    // 缺陷查询截取id
    serchCutOut(e) {
        var index = e.lastIndexOf('_');
        e = e.substring(index + 1, e.length);
        return e;
    },
    // json数据格式化后换行
    jsonFormat(jsonTemp) {
        let json = '';
        try {
            // stringify 时需指定缩进否则不会显示换行。为了防止传入的string没有指定 在此统一执行一遍
            if (typeof jsonTemp != 'string') {
                json = JSON.stringify(jsonTemp, undefined, 2);
            } else {
                json = JSON.stringify(JSON.parse(jsonTemp), undefined, 2);
            }
            let jsonObj = JSON.parse(json);
            if (typeof jsonObj === 'object') {
                json = json
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;');
                return json.replace(
                    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
                    match => {
                        return match;
                    }
                );
            } else {
                return jsonTemp;
            }
        } catch (e) {
            return jsonTemp;
        }
    }

    // 缺陷数据转换
};
