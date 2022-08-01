<template>
    <div>
        <!-- 添加sql用例弹出框 -->
        <el-dialog title="新增sql用例" :before-close="handleClose" custom-class="add-el-dialog" :visible.sync="addSqlDialog" width="40%">
            <el-form ref="form" :model="formSql" label-width="70px">
                <el-form-item label="用例名称">
                    <el-input v-model="formSql.case_name" placeholder="请输入sql用例名"></el-input>
                </el-form-item>

                <el-form-item label="sql配置">
                    <el-select v-model="formSql.api_id" placeholder="接口名称" filterable class="handle-select mr10" @change="changeApiId">
                        <el-option v-for="(item, index) in apiName" :key="index" :label="item.api_name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <p>SQL语句</p>
                <div class="get-box">
                    <el-input type="textarea" :rows="3" v-model="formSql.params"></el-input>
                </div>

                <p class="get-box-head">
                    <span>asserts</span>
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
                    v-model="formSql.switchasserts"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    @change="changeSqlSwitchasserts"
                ></el-switch>
                <span v-if="formSql.switchasserts == true">
                    <div class="get-box" v-for="(item, index) in formSql.asserts" :key="index">
                        <el-input v-model="formSql.asserts[index].key" placeholder="断言名"></el-input>
                        <el-select v-model="formSql.asserts[index].select" placeholder="请选择">
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
                        <el-input v-model="formSql.asserts[index].value" placeholder="值"></el-input>
                        <el-button v-if="index == 0" type="success" size="mini" @click="addSqlasserts()">添加</el-button>
                        <el-button v-else type="danger" size="mini" @click="delSqlasserts(index)">删除</el-button>
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
                    v-model="formSql.switchSql"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    @change="changeSqlSwitchApi"
                    :style="{ 'margin-bottom': formSql.switchSql == false ? '10px' : '' }"
                ></el-switch>
                <span v-if="formSql.switchSql == true">
                    <div class="get-box" v-for="(item, index) in formSql.ApiDependencys" :key="index">
                        <el-input v-model="formSql.ApiDependencys[index].key" placeholder="变量名"></el-input>
                        <el-input v-model="formSql.ApiDependencys[index].value" placeholder="表达式"></el-input>
                        <el-input v-model="formSql.ApiDependencys[index].regular" placeholder="正则"></el-input>
                        <!-- <el-button v-if="index == 0" type="success" size="mini" @click="addApiDependencys()">添加</el-button> -->
                        <!-- <el-button v-else type="danger" size="mini" @click="delApiDependencys(index)">删除</el-button> -->
                    </div>
                </span>

                <el-form-item label="优先级" style>
                    <el-input v-model="formSql.caselevel"></el-input>
                </el-form-item>
                <el-form-item label="用例描述">
                    <el-input v-model="formSql.case_desc"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-switch v-model="formSql.status" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeCompile">关闭</el-button>
                <el-button type="primary" @click="addSqlSubmit">提交</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props: {
        addSqlDialog: {
            type: Boolean,
            default: false
        },
        options: {
            type: Array,
            default: () => []
        },
        apiName: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            formSql: {
                // 添加sql弹层表单数据
                case_name: '',
                api_id: '',
                status: 'true',
                getHead: [{}],
                getParameter: [{}],
                asserts: [{}],
                ApiDependencys: [{}],
                switchasserts: false,
                switchSql: false,
                onClose: true
            }
        };
    },
    methods: {
        // 添加 Sql Dependency
        addApiDependencys() {
            this.formSql.ApiDependencys.push({});
        },
        //  删除 Sql Dependency
        delApiDependencys(index) {
            this.formSql.ApiDependencys.splice(index, 1);
        },
        // 监听 assertss 开关
        changeSqlSwitchasserts(e) {
            if (e == false) {
                this.formSql.asserts = [{}];
            }
        },
        // 添加 assertss
        addSqlasserts() {
            this.formSql.asserts.push({});
        },
        // 删除 assertss
        delSqlassertss(index) {
            this.formSql.asserts.splice(index, 1);
        },
        // 监听 API Dependency 开关
        changeSqlSwitchApi(e) {
            if (e == false) {
                this.formSql.ApiDependencys = [{}];
            }
        },

        // 提交添加的 sql
        addSqlSubmit() {
            // console.log(this.formSql,'获取添加sql用例信息');
            this.formSql.method = 'sql';
            console.log('formSql:', this.formSql, this.apiName);
            // if (JSON.stringify(this.formSql.ApiDependencys) != '[{}]' && this.formSql.ApiDependencys != '[{}]') {
            //     this.formSql.ApiDependencys = this.$methods.transition2(this.formSql.ApiDependencys);
            // }
            // 判断Assert是否为空
            if (JSON.stringify(this.formSql.asserts) != '{}' && this.formSql.asserts != '{}') {
                this.formSql.asserts = this.$methods.transition3(this.formSql.asserts);
            }
            var params = {
                api_id: this.formSql.api_id,
                ApiDependencys: this.formSql.ApiDependencys[0], //格式总变，传参不确定 又把删除 添加注释了。乱极了！ 数组变对象 呵呵
                asserts: this.formSql.asserts,
                case_desc: this.formSql.case_desc,
                case_name: this.formSql.case_name,
                params: this.formSql.params,
                status: this.formSql.status,
                caselevel: this.formSql.caselevel
            };
            console.log('???', params, this.formSql);
            this.$emit('getformsql', this.formSql);
            this.closeCompile();
        },
        // 关闭 sql 弹出框监听重置内容
        closeCompile() {
            this.$emit('closeDialog');
            this.formSql = {
                type: [],
                getHead: [{}],
                getParameter: [{}],
                asserts: {},
                ApiDependencys: [{}],
                switchasserts: false,
                switchSql: false
            };
        },
        // 二次确认关闭
        handleClose() {
            this.$confirm('确认关闭？')
                .then((_) => {
                    this.closeCompile();
                })
                .catch((_) => {});
        },
        /**
         * 改变接口名称
         * @param e 接口名称id
         */
        changeApiId(e) {
            this.formcase.params = [];
            this.$api
                .get_api_to_case({ api_id: e })
                .then((res) => {
                    if (res.code == 0) {
                        console.log('参数', res);
                        for (let key in res.result.api_case) {
                            this.formcase.params.push({ key, value: res.result.api_case[key] });
                        }
                        this.formcase.textarea = JSON.stringify(res.result.api_case);
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(err);
                });
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
