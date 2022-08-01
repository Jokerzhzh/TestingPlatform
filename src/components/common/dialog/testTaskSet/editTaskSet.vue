<template>
    <div>
        <!-- 编辑任务集弹出框 -->
        <el-dialog title="编辑任务集" :before-close="closeTaskSet" custom-class="add-el-dialog" :visible.sync="editDialog" width="40%">
            <el-form :model="formEditTaskSet" label-width="100px">
                <el-form-item label="tapd项目">
                    <el-select
                        ref="select3"
                        @visible-change="changeFocus3"
                        v-model="formEditTaskSet.tapd_project_name"
                        filterable
                        @change="changeTapdProjectName"
                        placeholder="请选择tapd项目"
                        class="handle-select mr10"
                    >
                        <el-option
                            v-for="item in TapdProjectName"
                            :key="item.id"
                            :label="item.tapd_project_name"
                            :value="item.tapd_project_name"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="应用名称">
                    <el-select
                        ref="select6"
                        @visible-change="changeFocus6"
                        v-model="formEditTaskSet.appId"
                        filterable
                        @change="changeAppId"
                        placeholder="请选择应用名称"
                        class="handle-select mr10"
                    >
                        <el-option v-for="item in CicdAppidName" :key="item.appId" :label="item.appId" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="tapd需求">
                    <el-select
                        ref="select4"
                        @visible-change="changeFocus4"
                        v-model="formEditTaskSet.demand_name"
                        filterable
                        @change="changeDemandName"
                        placeholder="请选择tapd需求"
                        class="handle-select mr10"
                    >
                        <el-option
                            v-for="item in TapdRequireName"
                            :key="item.id"
                            :label="item.require_name"
                            :value="item.require_name"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="tapd迭代 ">
                    <el-select
                        ref="select5"
                        @visible-change="changeFocus5"
                        v-model="formEditTaskSet.iteration_name"
                        filterable
                        @change="changeIterationName($event)"
                        placeholder="请选择tapd迭代"
                        class="handle-select mr10"
                    >
                        <el-option
                            v-for="item in TpadIterinfoName"
                            :key="item.id"
                            :label="item.iter_name"
                            :value="item.iter_name"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="项目名称">
                    <el-select
                        ref="select1"
                        @visible-change="changeFocus1"
                        v-model="formEditTaskSet.project_name"
                        filterable
                        @change="changeProjectName"
                        placeholder="请选择项目"
                        class="handle-select mr10"
                    >
                        <el-option
                            v-for="item in projectsName"
                            :key="item.project_name"
                            :label="item.project_name"
                            :value="item.project_name"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="模块名称" :rules="[{ required: true }]">
                    <el-select
                        ref="select2"
                        @visible-change="changeFocus2"
                        v-model="formEditTaskSet.modules_name"
                        filterable
                        @change="changeModulesName($event)"
                        placeholder="请选择模块"
                        class="handle-select mr10"
                    >
                        <el-option
                            v-for="item in moduleName"
                            :key="item.id"
                            :label="item.Modules_name"
                            :value="item.Modules_name"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="任务集名称"
                    prop="task_name"
                    :rules="[{ required: true, message: '请输入任务集名称', trigger: 'blur' }]"
                >
                    <el-input v-model="formEditTaskSet.task_name" @input="change($event)"></el-input>
                </el-form-item>
                <el-form-item label="执行人员" prop="exec_uname" :rules="[{ required: true, message: '请输入执行人员', trigger: 'blur' }]">
                    <el-input v-model="formEditTaskSet.exec_uname" @input="change($event)"></el-input>
                </el-form-item>
                <el-form-item label="执行环境" prop="env_addr" :rules="[{ required: true, message: '请输入执行地址', trigger: 'blur' }]">
                    <el-input v-model="formEditTaskSet.env_addr" @input="change($event)"></el-input>
                </el-form-item>
                <el-form-item label="数据库环境">
                    <el-input v-model="formEditTaskSet.db" @input="change($event)"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-checkbox-group v-model="formEditTaskSet.status">
                        <el-checkbox label="0" name="type">状态</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeTaskSet">关闭</el-button>
                <el-button type="primary" @click="addCaseSubmit">提交</el-button>
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
        formEditTaskSet: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            params: {
                page: 1,
                page_size: 10
            },
            CicdAppidName: [], // CICD应用id
            TapdProjectName: [], // tapd项目名称
            TapdRequireName: [], // tapd需求名称
            TpadIterinfoName: [], // tapd迭代名称
            projectsName: [], // 项目名称搜索
            moduleName: [] //搜索模块名称
        };
    },
    created() {
        this.getTapdProjectName();
        this.getProjectName();
        this.getCicdAppid();
    },
    methods: {
        // 监听弹出框的名字，根据名字获取id
        changeAppId(e) {
            // console.log(e);
            // this.CicdAppidName.forEach((item) => {
            //     if (item.appId == this.formEditTaskSet.appId) {
            //         this.formEditTaskSet.app_id = item.id;
            //     }
            // });
            this.formEditTaskSet.app_id = e;
            this.$forceUpdate();
        },
        changeDemandName(e) {
            this.TapdRequireName.forEach((item) => {
                if (item.require_name == e) {
                    // tapd需求id
                    this.formEditTaskSet.demand_id = item.id;
                    // tapd需求名称
                    // this.formEditTaskSet.demand_name = e;
                    // vue强制刷新
                    this.$forceUpdate();
                }
            });
        },
        changeIterationName(e) {
            this.TpadIterinfoName.forEach((item) => {
                if (item.iter_name == e) {
                    // tapd迭代id
                    this.formEditTaskSet.iteration_id = item.id;
                    // tapd迭代名称
                    // this.formEditTaskSet.iteration_name = e;
                    // vue强制刷新
                    this.$forceUpdate();
                }
            });
        },
        changeModulesName(e) {
            this.moduleName.forEach((item) => {
                if (item.Modules_name == e) {
                    // 模块id
                    this.formEditTaskSet.modules = item.id;
                    // 模块名称
                    // this.formEditTaskSet.modules_name = e;
                    // vue强制刷新
                    this.$forceUpdate();
                }
            });
        },
        // 提交修改的 任务集
        addCaseSubmit() {
            // console.log(this.formEditTaskSet, '获取修改的任务集信息');
            if (this.formEditTaskSet.app_id == null) {
                this.formEditTaskSet.app_id = '';
            }
            this.formEditTaskSet.tapd_unique =
                this.formEditTaskSet.app_id + this.formEditTaskSet.demand_id + this.formEditTaskSet.iteration_id;
            if (this.formEditTaskSet.modules == '') {
                this.$message.error('请选择模块');
            } else if (this.formEditTaskSet.task_name == '') {
                this.$message.error('请输入任务集名称');
            } else if (this.formEditTaskSet.exec_uname == '') {
                this.$message.error('请输入执行人员');
            } else if (this.formEditTaskSet.env_addr == '') {
                this.$message.error('请输入执行地址');
            } else {
                this.$emit('getEditTaskSet', this.formEditTaskSet);
            }
        },
        // 关闭 任务集 弹出框监听重置内容
        closeTaskSet() {
            this.TapdRequireName = [];
            this.TpadIterinfoName = [];
            this.moduleName = [];
            this.params = {
                project_name: ''
            };
            this.$emit('closeDialog');
        },
        // 重新渲染 input 可编辑操作
        change() {
            this.$forceUpdate();
        },
        getTapdProjectName() {
            // 获取tapd项目
            this.$api
                .get_tapd_project({})
                .then((res) => {
                    if (res.code == 0) {
                        this.TapdProjectName = res.result;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        getCicdAppid() {
            // 获取cicd之appid
            this.$api
                .get_cicd_appid({})
                .then((res) => {
                    if (res.code == 0) {
                        this.CicdAppidName = res.result;
                    } else {
                        this.$messager.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        getTpadRequireName(workspace_id) {
            // 获取tapd需求
            this.$api
                .get_tpad_require({ workspace_id })
                .then((res) => {
                    if (res.code == 0) {
                        this.TapdRequireName = res.result;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        getTpadIterinfoName(workspace_id) {
            // 获取tapd迭代
            this.$api
                .get_tpad_iterinfo({ workspace_id })
                .then((res) => {
                    if (res.code == 0) {
                        this.TpadIterinfoName = res.result;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
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
        getModuleName(id) {
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
        },
        // 列表选择tapd项目名称监听
        changeTapdProjectName(e) {
            this.$delete(this.params, 'require_name', 'iter_name');
            this.params.tapd_project_name = e;
            let id;
            this.TapdProjectName.forEach((item) => {
                if (e == item.tapd_project_name) {
                    id = item.id;
                }
            });
            this.getTpadRequireName(id);
            this.getTpadIterinfoName(id);
        },
        // 列表选择项目名称监听
        changeProjectName(e) {
            this.$delete(this.params, 'module_name');
            this.params.project_name = e;
            let id;
            this.projectsName.forEach((item) => {
                if (e == item.project_name) {
                    id = item.id;
                }
            });
            this.getModuleName(id);
        },
        // 控制下拉框失去焦点
        changeFocus1(val) {
            if (val) {
                this.$refs.select1.focus();
            } else {
                this.$refs.select1.blur();
            }
        },
        changeFocus2(val) {
            if (val) {
                this.$refs.select2.focus();
            } else {
                this.$refs.select2.blur();
            }
        },
        changeFocus3(val) {
            if (val) {
                this.$refs.select3.focus();
            } else {
                this.$refs.select3.blur();
            }
        },
        changeFocus4(val) {
            if (val) {
                this.$refs.select4.focus();
            } else {
                this.$refs.select4.blur();
            }
        },
        changeFocus5(val) {
            if (val) {
                this.$refs.select5.focus();
            } else {
                this.$refs.select5.blur();
            }
        },
        changeFocus6(val) {
            if (val) {
                this.$refs.select6.focus();
            } else {
                this.$refs.select6.blur();
            }
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
