<template>
    <div>
        <!-- 添加用例弹出框 -->
        <el-dialog title="添加用例" :before-close="closeAddUseCase" custom-class="add-el-dialog" :visible.sync="isAddUseCase" width="850px">
            <div class="handle-box">
                <el-select
                    v-model="params.project_name"
                    @change="changeProjectName"
                    placeholder="选择项目"
                    class="handle-select mr10"
                    filterable
                    clearable
                >
                    <el-option v-for="item in projectsName" :key="item.id" :label="item.project_name" :value="item.id"> </el-option>
                </el-select>
                <el-select
                    v-model="params.module_name"
                    @change="changeModuleName"
                    placeholder="选择模块"
                    class="handle-select mr10"
                    filterable
                    clearable
                >
                    <el-option v-for="item in moduleName" :key="item.id" :label="item.Modules_name" :value="item.id"></el-option>
                </el-select>
                <el-select
                    v-model="params.api_name"
                    @change="changeApiName"
                    placeholder="选择接口"
                    class="handle-select mr10"
                    filterable
                    clearable
                >
                    <el-option v-for="item in apiName" :key="item.id" :label="item.api_name" :value="item.id"></el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <div class="edit_dev">
                <el-transfer
                    :button-texts="['撤回', '添加']"
                    :titles="['全选', '全选']"
                    v-model="transferValue"
                    @change="changeTransfer"
                    :data="apiArr"
                ></el-transfer>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeAddUseCase">关闭</el-button>
                <el-button type="primary" @click="addUseCaseSubmit">提交</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props: {
        isAddUseCase: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            transferValue: [],
            transferData: [], //穿梭框数据
            projectsName: [], // 项目名称检索
            moduleName: [], // 模块名称检索
            apiName: [], // 选择接口名称
            apiId: '', // 选择接口ID
            apiArr: [], //接口数组
            params: {}, //
            stockpile: [] //储存
        };
    },
    watch: {},
    created() {
        // 获取项目名称
        this.getProjectName();
    },
    methods: {
        // 搜索
        handleSearch() {
            if (this.apiId) {
                this.get_casename();
            } else {
                this.$message({
                    message: '请选择要搜索的接口',
                    type: 'warning'
                });
            }
        },
        // 根据接口id查询该接口下的测试用例
        get_casename() {
            let params = {
                api_id: this.apiId
            };
            this.$api
                .get_casename(params)
                .then((res) => {
                    if (res.code == 0) {
                        // this.stockpile = [];
                        // this.stockpile = this.stockpile.concat(res.data);
                        let arr = this.stockpile.concat(res.data);
                        // var result = [];
                        for (var i = 0; i < arr.length; i++) {
                            var flag = true;
                            for (var j = 0; j < this.stockpile.length; j++) {
                                if (arr[i].id === this.stockpile[j].id) {
                                    flag = false;
                                }
                            }
                            if (flag) {
                                this.stockpile.push(arr[i]);
                            }
                        }
                        // console.log(this.stockpile);
                        var array = [];
                        this.stockpile.forEach((item, index) => {
                            array.push({
                                key: item.id,
                                label: item.case_name,
                                disabled: false
                            });
                        });
                        // let arrayData = this.$methods.reversal4(this.stockpile);
                        console.log('???', array);
                        this.apiArr = [];
                        this.apiArr = array;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        // 关闭 添加用例弹出层
        closeAddUseCase() {
            this.$emit('closeDialog');
        },
        // 提交添加的用例
        addUseCaseSubmit() {
            console.log('?transferData', this.transferData, this.transferValue);
            this.$emit('getAddUseCaseSubmit', this.transferData);
        },
        // 监听穿梭框
        changeTransfer(e) {
            this.transferData = e;
        },
        getProjectName() {
            // 获取项目名称
            this.$api
                .get_project_name({})
                .then((res) => {
                    if (res.code == 0) {
                        this.projectsName = res.result;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        // 列表选择项目名称监听
        changeProjectName(e) {
            console.log(e, '项目选择');
            this.params.module_name = '';
            this.moduleName = [];
            this.params.api_name = '';
            this.apiName = [];
            this.getModuleName(e);
        },
        getModuleName(id) {
            if (!id) {
                this.params.module_name = '';
                this.moduleName = [];
                this.params.api_name = '';
                this.apiName = [];
                return;
            } else {
                // 获取模块名称（搜索）
                this.$api
                    .get_module_name({ id })
                    .then((res) => {
                        if (res.code == 0) {
                            this.moduleName = res.result;
                        } else {
                            this.$message.error(res.msg);
                        }
                    })
                    .catch((err) => {
                        this.$message.error(res.msg);
                    });
            }
        },
        // 列表选择模块名称监听
        changeModuleName(e) {
            console.log(e, '模块选择');
            this.$forceUpdate();
            this.apiName = [];
            this.params.api_name = '';
            this.get_apiname(e);
        },
        // 根据模块id查询该模块下的接口名称
        get_apiname(id) {
            if (!id) {
                this.params.api_name = '';
                this.apiName = [];
                return;
            } else {
                let params = {
                    module_id: id
                };
                this.$api
                    .get_apiname(params.module_id)
                    .then((res) => {
                        if (res.code == 0) {
                            this.apiName = res.result;
                        } else {
                            this.$message.error(res.msg);
                        }
                    })
                    .catch((err) => {
                        this.$message.error(res.msg);
                    });
            }
        },
        changeApiName(e) {
            console.log(e, 'api名称选择');
            this.$forceUpdate();
            this.apiId = e;
            // this.get_apiname(e.id);
        }
    }
};
</script>


<style scoped lang="less">
.el-transfer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
/deep/ .el-transfer-panel {
    width: 300px;
}
/deep/ .el-transfer-panel__body {
    height: 300px;
}
/deep/ .el-transfer-panel__list {
    height: 300px;
}
/deep/ .el-transfer__buttons {
    padding: 0;
}
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
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    .el-input {
        width: 200px;
    }
    .el-select {
        width: 240px;
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
