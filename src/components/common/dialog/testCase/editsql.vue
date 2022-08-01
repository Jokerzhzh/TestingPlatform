<template>
    <div>
        <!-- 编辑用例弹出框 -->
        <el-dialog title="编辑sql" :before-close="handleClose" custom-class="add-el-dialog" :visible.sync="editDialog" width="40%">
            <el-form :model="formEdit" label-width="70px">
                <el-form-item label="用例名称">
                    <el-input v-model="formEdit.case_name" @input="change($event)"></el-input>
                </el-form-item>

                <el-form-item label="接口名称">
                    <el-select
                        v-model="formEdit.api_id"
                        @input="change($event)"
                        placeholder="接口名称"
                        filterable
                        class="handle-select mr10"
                    >
                        <el-option v-for="(item, index) in apiName" :key="index" :label="item.api_name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="sql语句">
                    <el-input type="textarea" :rows="3" v-model="formEdit.params"></el-input>
                </el-form-item>

                <p class="get-box-head">
                    <span>Assert</span>
                    <el-tooltip
                        class="item"
                        effect="dark"
                        content="断言，左侧填写返回值的解析路径或者数据库查出的变量值，右侧填写常量;返回值路径可以借助断言解析辅助工具"
                        placement="right"
                    >
                        <i class="el-icon-question get-box-icon"></i>
                    </el-tooltip>
                </p>
                <el-switch v-model="formEdit.switchAssert" active-color="#13ce66" inactive-color="#ff4949" @change="changeEditAssert">
                </el-switch>
                <span v-if="formEdit.switchAssert == true">
                    <div class="get-box" v-for="(item, index) in formEdit.asserts" :key="index">
                        <el-input v-model="formEdit.asserts[index].k1" @input="change($event)" placeholder="断言名"></el-input>
                        <el-select v-model="formEdit.asserts[index].k2" @input="change($event)" placeholder="请选择">
                            <el-option label="等于" value="0"></el-option>
                            <el-option label="不等于" value="1"></el-option>
                            <el-option label="包含" value="2"></el-option>
                            <el-option label="不包含" value="3"></el-option>
                            <el-option label="大于" value="4"></el-option>
                            <el-option label="大于等于" value="5"></el-option>
                            <el-option label="小于" value="6"></el-option>
                            <el-option label="小于等于" value="7"></el-option>
                            <el-option label="在列表中" value="8"></el-option>
                            <el-option label="不在列表中" value="9"></el-option>
                        </el-select>
                        <el-input v-model="formEdit.asserts[index].k3" @input="change($event)" placeholder="值"></el-input>
                        <el-button v-if="index == 0" type="success" size="mini" @click="addEditAssert()">添加</el-button>
                        <el-button v-else type="danger" size="mini" @click="delEditAssert(index)">删除</el-button>
                    </div>
                </span>

                <p class="get-box-head" style="margin-top: 10px">
                    <span>Sql Dependency</span>
                    <el-tooltip
                        class="item"
                        effect="dark"
                        content="接口依赖，实现在一个任务中接口需要用到其他接口的返回值"
                        placement="right"
                    >
                        <i class="el-icon-question get-box-icon"></i>
                    </el-tooltip>
                </p>

                <el-switch
                    v-model="formEdit.switchApi"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    @change="changeSqlSwitchApi"
                    :style="{ 'margin-bottom': formEdit.switchSql == false ? '10px' : '' }"
                >
                </el-switch>
                <span v-if="formEdit.switchApi == true">
                    <div class="get-box" v-for="(item, index) in formEdit.ApiDependencys" :key="index">
                        <el-input v-model="formEdit.ApiDependencys[index].key" placeholder="变量名"></el-input>
                        <el-input v-model="formEdit.ApiDependencys[index].value" placeholder="表达式"></el-input>
                        <el-input v-model="formEdit.ApiDependencys[index].regular" placeholder="正则"></el-input>
                    </div>
                </span>

                <el-form-item label="优先级" style="">
                    <el-input v-model="formEdit.caselevel" @input="change($event)"></el-input>
                </el-form-item>
                <el-form-item label="用例描述">
                    <el-input v-model="formEdit.case_desc" @input="change($event)"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-switch v-model="formEdit.status" active-color="#13ce66" inactive-color="#ff4949"> </el-switch>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeEdit">关闭</el-button>
                <el-button type="primary" @click="addEditSubmit">提交</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props: {
        editDialog: {
            type: Boolean,
            default: false
        },
        apiName: {
            type: Array,
            default: () => []
        },
        formEdit: {
            type: Object,
            default: () => {}
        },
        rows: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            tabEditIndex: 0, // 编辑tab切换状态
            addStatus: false
        };
    },
    watch: {
        formEdit: {
            handler(n, o) {
                // if (n.switchApi == true) {
                //     n.switchApi = 'true';
                // } else if (n.switchApi == false) {
                //     n.switchApi = 'false';
                // }
                console.log('xinde.switchApi', n, 'laode', o);
            },
            immediate: true
        }
    },
    mounted() {
        console.log('xinde', this.formEdit.Assert, '编辑tab切换状态', this.rows);
    },
    methods: {
        // 监听 API Dependency 开关
        changeSqlSwitchApi(e) {
            if (e == false) {
                this.formEdit.ApiDependencys = [{}];
            }
        },
        // 添加 Sql Dependency
        addApiDependencys() {
            this.formEdit.ApiDependencys.push({});
        },
        //  删除 Sql Dependency
        delApiDependencys(index) {
            this.formEdit.ApiDependencys.splice(index, 1);
        },
        // 监听 编辑tab 切换
        tabEditClick(tab, event) {
            this.tabEditIndex = tab.index;
            console.log(tab.index, '。。。。。');
        },
        // 监听 编辑 Assert 开关
        changeEditAssert(e) {
            if (e == false) {
                this.formEdit.assert = [{}];
            }
        },
        // 监听 编辑 Dependency 开关
        changeEditSwitchApi(e) {
            if (e == false) {
                this.formEdit.ApiDependencys = [{}];
            }
        },
        // 添加 编辑Assert
        addEditAssert() {
            this.formEdit.asserts.push({});
        },
        // 删除 编辑Assert
        delEditAssert(index) {
            this.formEdit.asserts.splice(index, 1);
        },
        // 添加 编辑 请求头信息
        addEditGetHead() {
            this.formEdit.headers.push({});
        },
        // 删除 编辑 请求头信息
        deleEditHead(index) {
            this.formEdit.headers.splice(index, 1);
        },
        // 添加 编辑 请求参数
        addEditParameter() {
            this.formEdit.params.push({});
        },
        // 删除 编辑 请求参数
        delEditParameter(index) {
            this.formEdit.params.splice(index, 1);
        },
        // 添加 编辑 API Dependency
        addEditDependency() {
            this.formEdit.ApiDependencys.push({});
        },
        // 删除 编辑 API Dependency
        delEditDependency(index) {
            this.formEdit.ApiDependencys.splice(index, 1);
        },
        // 提交执行
        addEditSubmit() {
            console.log(this.formEdit, '获取添加执行信息', this.rows, '传入接口', this.formEdit.ApiDependencys);
            this.$emit('getEdit', this.formEdit);
        },
        // 关闭 执行 弹出框监听重置内容
        closeEdit() {
            this.$emit('closeDialog');
        },
        // 二次确认关闭
        handleClose() {
            this.$confirm('确认关闭？')
                .then((_) => {
                    this.closeEdit();
                })
                .catch((_) => {});
        },
        // 重新渲染 input 可编辑操作
        change() {
            this.$forceUpdate();
        }
    }
};
</script>

<style scoped lang="less">
.get-box {
    display: flex;
    margin-top: 10px;
    margin-bottom: 20px;
    width: 100%;
    justify-content: space-between;
}
.get-box-head {
    display: flex;
    align-items: center;
    .get-box-icon {
        font-size: 16px;
        margin-left: 3px;
    }
}

.add-el-dialog {
    .el-select {
        width: 100%;
        margin-right: 10px;
    }
    .el-input {
        margin-right: 10px;
    }
    .el-switch {
        margin-top: 5px;
    }
}
.handle-box {
    margin-bottom: 20px;
    .el-input {
        width: 200px;
    }
    .el-select {
        width: 150px;
    }
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.mt10 {
    margin-top: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
