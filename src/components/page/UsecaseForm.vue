<template>
    <div>
        <el-card style="margin-bottom:20px">
            <div class="handle-box">
                <span class="public-title">项目:</span>
                <el-select
                    v-model="params.big_project"
                    @change="changeRequirepid"
                    placeholder="请选择项目"
                    class="public-form"
                >
                    <el-option
                        v-for="item in projectsName"
                        :key="item.pname"
                        :label="item.pname"
                        :value="item.pid"
                    ></el-option>
                </el-select>
                <span class="public-title">迭代项目:</span>
                <el-select
                    class="public-form"
                    placeholder="请选择迭代项目"
                    :disabled="!params.big_project"
                    v-model="params.project_id"
                    @change="changeiterId"
                >
                    <el-option
                        v-for="item in iterationList"
                        :key="item.id"
                        :label="item.project_name"
                        :value="item.id"
                    ></el-option>
                </el-select>
                <span class="public-title">需求:</span>
                <el-select
                    v-model="params.requid_id"
                    filterable
                    :filter-method="changeRequire"
                    placeholder="请选择需求"
                    class="public-form"
                    @change="changeDuty"
                    :disabled="showRequiresName == true"
                >
                    <el-option
                        v-for="item in requiresName"
                        :key="item.ZID"
                        :label="item.rname"
                        :value="item.ZID"
                    ></el-option>
                </el-select>

                <span class="public-title">用户组:</span>
                <el-select v-model="params.group_id" placeholder="用户组" class="public-form">
                    <el-option label="全部" value="0"></el-option>
                    <el-option
                        v-for="item in dutype"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    ></el-option>
                </el-select>

                <span class="public-title">复用次数:</span>
                <el-input v-model="params.case_times" class="public-form" type="number" placeholder>
                    <template slot="append">次</template>
                </el-input>
                <br />
                <span class="public-title">起始时间:</span>
                <el-date-picker
                    v-model="params.begin_time"
                    class="public-form"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                ></el-date-picker>-
                <el-date-picker
                    v-model="params.end_time"
                    class="public-form"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                ></el-date-picker>
                <el-button type="primary" @click="reportGenerate">生成报表</el-button>
                <el-button type="primary" @click="onReset">重置</el-button>
                <el-button type="primary">导出</el-button>
            </div>
        </el-card>

        <el-card class="box-card">
            <h4 style="color:#909399;line-height:40px">用例复用统计图</h4>
            <el-table :data="tableData" border size="mini" class="table" ref="multipleTable">
                <el-table-column prop="id" label="用例名称" align="center">
                    <template slot-scope="scope">{{ scope.row.case }}</template>
                </el-table-column>
                <el-table-column prop="name" label="复用次数">
                    <template slot-scope="scope">{{ scope.row.sum_all }}</template>
                </el-table-column>
                <el-table-column label="编写人">
                    <template slot-scope="scope">{{ scope.row.editor }}</template>
                </el-table-column>
            </el-table>

            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next,jumper"
                    :current-page="params.page"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'projectManager',
    data() {
        return {
            iterKey: '', // 迭代id是否一致
            projectKey: '', // 项目id是否一致
            params: {
                page: 1
            },
            dialogVisible: false,
            title: '创建项目',
            projectsName: [], // 项目名称搜索
            tableData: [], // 列表数据
            pageTotal: 0, // 数据总条数
            disabled: false,
            options: [],
            dutype: [],
            pageTotal: 0, // 数据总条数
            disabled: false,
            showRequiresName: false,
            showDutyName: true,
            value: '',
            requiresName: [],
            iterationList: [] // 迭代列表
        };
    },
    created() {
        // this.getData();
        this.getProjectName();
        this.groupName();
    },
    mounted() {
        // 绑定enter事件
        document.addEventListener('keyup', this.enterKey);
    },
    destroyed() {
        // 销毁enter事件
        document.removeEventListener('keyup', this.enterKey);
    },
    methods: {
        // serchPerson(e) {
        //     //   group_users
        //     // this.params.group_id
        //     // this.getGroupUsers(e);
        //     console.log(e);
        // },
        onReset() {
            this.params = {};
            this.tableData = [];
            this.options = {};
            this.initEcharts();
        },
        changeDuty(e) {
            console.log('e', e);
            // e = this.$methods.serchCutOut(e);
            let parm = { rid: e };
            // this.getDutyName(parm);
        },
        changeRequire(e) {
            // console.log(this.params.rid, e);
            let parm = { rname: e, belong_project: this.params.big_project };
            // this.getRequireName(parm);
        },
        getRequireName(e) {
            // 获取项目名称
            this.$api.apiChart
                .rname_id(e)
                .then(res => {
                    if (res.code == 0) {
                        res.result.map(item => {
                            item.ZID = this.$methods.serchCutOut(item.ZID);
                        });
                        this.requiresName = res.result;
                        this.showRequiresName = false;
                        // console.log('res.result', res.result);
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch(err => {
                    this.$message.error(res.msg);
                });
        },
        groupName() {
            // dutype
            this.$api.apiChart
                .get_group({})
                .then(res => {
                    if (res.code == 0) {
                        this.dutype = res.group;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch(err => {
                    this.$message.error(res.msg);
                });
        },
        handleClose() {
            this.dialogVisible = false;
        },
        // 新增
        onAdd() {
            this.dialogVisible = true;
        },
        reportGenerate() {
            this.getData();
        },
        getData() {
            if (!this.params.big_project) {
                this.$message.error('项目为必选项');
                return;
            }
            let param = JSON.parse(JSON.stringify(this.params));
            if (this.params.requid_id) {
                delete param.project_id;
                delete param.big_project;
            } else if (this.params.project_id) {
                delete param.requid_id;
            } else {
                delete param.project_id;
                delete param.requid_id;
            }
            // 项目检索状态+列表
            this.$api.apiChart
                .timescase(param)
                .then(res => {
                    if (res.code == 0) {
                        this.tableData = this.oneArr(res.tj);
                        this.pageTotal = res.count;
                        this.params.page_size = res.page_size;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch(err => {
                    console.log(err);
                    this.$message.error(err);
                });
        },
        getProjectName() {
            // 获取项目名称
            this.$api.apiChart
                .projectName({})
                .then(res => {
                    if (res.code == 0) {
                        this.projectsName = res.project_name;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch(err => {
                    this.$message.error(res.msg);
                });
        },
        changeRequirepid(e) {
            let parm = { key: e };
            if (this.projectKey != e) {
                this.projectKey = e;
                delete this.params.project_id;
                this.requiresName = [];
                delete this.params.rid;
                this.requiresName = [];
                this.getIterList(parm);
            }
        },
        /**
         * 请求迭代列表
         * @param {Object} e 请求迭代列表参数
         */
        getIterList(e) {
            // this.requiresName = [];
            this.$api
                .get_iteration_list(e)
                .then(res => {
                    if (res.code == 0) {
                        this.iterationList = res.result;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch(err => {
                    this.$message.error(err);
                });
        },
        /**
         * 根据迭代id获取需求列表
         * @param {String} e 选中迭代id
         */
        changeiterId(e) {
            let parm = { pid: e };
            if (this.iterKey != e) {
                this.iterKey = e;
                delete this.params.requid_id;
                this.getRequireName(parm);
            }
        },
        // 全局回车搜索
        enterKey(event) {
            const code = event.keyCode;
            const path = this.$route.path;
            if (code == 13 && path == '/testProject') {
                this.handleSearch();
            }
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.params, 'page', 1);
            this.getData();
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
        // 分页导航
        handlePageChange(val) {
            this.$set(this.params, 'page', val);
            this.getData();
        },
        //    二维数组数据拉伸一维数组
        oneArr(data) {
            data.map(item => {
                if (item.case_info) {
                    item.case_info.map(ite => {
                        item.case = ite.case_name;
                        item.editor = ite.editor;
                    });
                }
            });
            return data;
        }
    }
};
</script>

<style scoped lang="less">
.handle-box {
    margin-bottom: 10px;
    div {
        margin-bottom: 10px;
    }
    .el-input {
        width: 200px;
    }
    .el-select {
        width: 150px;
    }
}

.handle-select {
    width: 150px;
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
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}

//公共弹窗
.public-dialog {
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
    display: flex !important;
}
.box-card {
    flex: 1;
}
.box-input-card {
    width: 320px;
    margin-left: 10px;
}
.box-line {
    border-bottom: 1px solid #cccccc;
}
.project-input {
    border: 0px solid transparent !important;
    outline: none !important;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
}
.textarea-input {
    width: 100%;
    height: 400px;
    outline: none;
    border: 1px solid #cccccc;
    padding: 5px 10px;
    box-sizing: border-box;
}
.textarea-table {
    height: 80px;
    outline: none;
    width: 100%;
    border: 0px solid transparent;
}
.public-form {
    margin: 0 10px;
}
.public-title {
    font-size: 14px;
    font-weight: 400;
}
</style>
