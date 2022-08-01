<template>
    <div>
        <el-dialog title="添加" :visible.sync="dialogVisible" width="70%" :before-close="closeConfirm">
            <el-form :model="form" label-width="90px">
                <el-row>
                    <el-col :span="7">
                        <el-form-item label="项目名称">
                            <el-select width="100%" v-model="form.project" placeholder="请选择项目">
                                <el-option v-for="item in projectsName" :key="item.pid" :label="item.pname" :value="item.pname">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="7">
                        <el-form-item label="项目迭代">
                            <el-select width="100%" :disabled="piterShow" v-model="form.piter" placeholder="请选择迭代">
                                <el-option
                                    v-for="item in iterationList"
                                    :key="item.id"
                                    :label="item.project_name"
                                    :value="item.project_name"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item label="用例名称">
                            <el-select
                                width="100%"
                                :disabled="case_name_Show"
                                v-model="form.case_name"
                                filterable
                                placeholder="请选择用例名称"
                            >
                                <el-option v-for="item in caseNameList" :key="item.id" :label="item.case_name" :value="item.case_name">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-button style="marginleft: 20px" type="primary" @click="search">加入</el-button>
                </el-row>
            </el-form>
            <div class="transfer">
                <el-transfer v-model="value" :data="data" :button-texts="['撤回', '添加']" :titles="['全选', '全选']"></el-transfer>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeConfirm">取 消</el-button>
                <el-button type="primary" @click="save">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    props: {
        dialogShow: {
            type: Boolean,
            default: () => {
                return false;
            }
        },
        id: {
            type: String,
            default: () => {
                return null;
            }
        }
    },
    data() {
        return {
            dialogVisible: false,
            piterShow: false,
            case_name_Show: false,
            form: {
                project: '',
                piter: '',
                case_name: ''
            },
            projectsName: [], //项目数组
            iterationList: [], //迭代数组
            caseNameList: [], //用例名称数组
            data: [],
            value: []
        };
    },
    watch: {
        dialogShow() {
            this.dialogVisible = this.dialogShow;
        },
        'form.project': {
            handler(newName, oldName) {
                if (oldName) {
                    this.form.piter = '';
                }
                const list = this.projectsName.filter((item) => item.pname == newName);
                if (newName) {
                    this.piterShow = false;
                    this.getIterList(list[0].pid);
                } else {
                    this.piterShow = true;
                }
            },
            immediate: true
            // deep: true
        },
        'form.piter': {
            handler(newName, oldName) {
                if (oldName) {
                    this.form.case_name = '';
                }
                const list = this.iterationList.filter((item) => item.project_name == newName);
                if (newName) {
                    this.case_name_Show = false;
                    this.getCaseNameList(list[0].project_name);
                } else {
                    this.case_name_Show = true;
                }
            },
            immediate: true
            // deep: true
        }
    },
    created() {
        this.getProjectName();
    },
    methods: {
        async search() {
            let { case_name } = this.form;
            if (!case_name) {
                this.$message.error('请选择所搜索的内容');
                return false;
            } else {
                let res = await this.$api.uiTestTaskSetApi.project_itername_case(this.form);
                // let res = await this.$api.uiTestTaskSetApi.project_itername_case({
                //     piter: '1028迭代',
                //     project: 'test',
                //     case_name: '用户登录1'
                // });
                if (res.code == 0) {
                    res.result.map((item) => {
                        this.data.push({
                            key: item.id, // 改变id
                            label: item.case_name //改变name
                        });
                        console.log('🚀 ~ this.data', this.data);
                    });
                } else {
                    this.$message.error(res.msg);
                }
            }
        },
        closeConfirm() {
            this.show = false;
            this.$emit('closeDialog');
        },
        getProjectName() {
            // 获取项目名称
            this.$api
                .group_to_user({})
                .then((res) => {
                    if (res.code == 0) {
                        this.projectsName = res.project_name;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        //获取迭代数组
        getIterList(key) {
            this.$api
                .get_iteration_list({ key })
                .then((res) => {
                    if (res.code == 0) {
                        this.iterationList = res.result;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(err);
                });
        },
        async getCaseNameList(project_name) {
            let params = {
                piter_name: project_name
            };
            let res = await this.$api.uiTestTaskSetApi.get_caseName_list(params);
            if (res.code == 0) {
                this.caseNameList = res.result;
            }
        },
        async save() {
            if (!this.value.length) {
                this.$message.error('请选择提交内容');
                return false;
            } else {
                let res = await this.$api.uiTestTaskSetApi.case_to_task({ tid: this.id, cids: this.value });
                if (res.code == 0) {
                    this.$message.success(res.msg);
                    this.$emit('getList');
                    this.$emit('closeDialog');
                } else {
                    this.$message.error(res.msg);
                }
            }
        }
    }
};
</script>
<style scoped >
.transfer >>> .el-transfer-panel {
    width: 400px !important;
}
</style>
<style scoped  lang="less">
.transfer {
    width: 100%;
    display: flex;
    justify-content: center;
}
// .transfer >>> .el-transfer-panel {
//     width: 350px !important;
// }
::v-deep .el-transfer {
    display: flex;
    align-items: center;
    .el-transfer-panel {
        width: 300px;
    }
    .el-transfer__buttons {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .el-button.el-button--primary {
            margin-left: 0;
        }
    }
}
</style>
