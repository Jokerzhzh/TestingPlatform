<template>
    <div>
        <el-card style="margin-bottom:20px">
            <div class="handle-box">
                <span class="public-title">项目:</span>
                <el-select @change="changeRequirepid" v-model="searchObj.pid" placeholder="请选择项目" class="public-form">
                    <el-option v-for="item in projectList" :key="item.pname" :label="item.pname" :value="item.pid"></el-option>
                </el-select>
                <span class="public-title">迭代项目:</span>
                <el-select
                    class="public-form"
                    placeholder="请选择迭代项目"
                    :disabled="!searchObj.pid"
                    v-model="searchObj.iter_id"
                    @change="changeiterId"
                >
                    <el-option v-for="item in iterationList" :key="item.id" :label="item.project_name" :value="item.id"></el-option>
                </el-select>
                <span class="public-title">需求:</span>
                <el-select @change="changeDuty" v-model="searchObj.rid" placeholder="请选择需求" class="public-form">
                    <el-option v-for="item in options" :key="item.ZID" :label="item.rname" :value="item.ZID"></el-option>
                </el-select>
                <br />
                <span class="public-title">起始时间:</span>
                <el-date-picker
                    v-model="searchObj.stime"
                    value-format="yyyy-MM-dd"
                    class="public-form"
                    type="date"
                    placeholder="选择日期"
                ></el-date-picker
                >-
                <el-date-picker
                    class="public-form"
                    value-format="yyyy-MM-dd"
                    type="date"
                    v-model="searchObj.etime"
                    placeholder="选择日期"
                ></el-date-picker>
                <el-button type="primary" @click="getData">生成报表</el-button>
                <el-button type="primary" @click="reoload">重置</el-button>
                <el-button type="primary" @click="getForm">导出</el-button>
            </div>
        </el-card>

        <el-card class="box-card">
            <h4 style="color:#909399;line-height:40px" v-if="nowName != ''">{{ nowName }}的解决表</h4>
            <el-table :data="tableData" border size="mini" class="table" ref="multipleTable">
                <el-table-column prop="owner" label="人名" align="center"></el-table-column>
                <el-table-column prop="resolved_numbers" label="已解决"></el-table-column>
                <el-table-column label="未解决" prop="unresolved_numbers"></el-table-column>
            </el-table>

            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next,jumper"
                    :current-page="params.page"
                    :page-size="params.page_size"
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
            iterKey: '',
            projectKey: '', //
            projectList: [],
            params: {
                page: 1,
                page_size: 10
            },
            searchObj: {
                stime: '',
                etime: '',
                pid: '',
                rid: '',
                iter_id: ''
            },
            dialogVisible: false,
            title: '创建项目',
            projectsName: [], // 项目名称搜索
            tableData: [], // 列表数据
            pageTotal: 0, // 数据总条数
            disabled: false,
            options: [],
            iterationList: [] // 迭代列表
        };
    },
    created() {
        // this.getData();
        this.group_to_user();
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
        isExcel(type, name, data) {},
        // 导出
        getForm() {
            this.params.stime = this.searchObj.stime;
            this.params.etime = this.searchObj.etime;
            this.params.pid = this.searchObj.pid;
            this.params.rid = this.searchObj.rid;
            this.params.iter_id = this.searchObj.iter_id;
            this.params.header_name = ['人名', '已解决', '未解决'];
            this.$api
                .bug_output_data(this.params)
                .then(res => {
                    const link = document.createElement('a');
                    link.href = res.result;
                    document.body.appendChild(link);
                    link.click();
                })
                .catch(err => {
                    this.$message.error(res.msg);
                });
        },
        // 重置
        reoload() {
            (this.searchObj = {
                stime: '',
                etime: '',
                pid: '',
                iter_id: '',
                rid: ''
            }),
                this.$set(this.params, 'page', 1);
            this.getData();
        },
        changeRequirepid(e) {
            let parm = { key: e };
            if (this.projectKey != e) {
                this.projectKey = e;
                delete this.params.iter_id;
                this.requiresName = [];
                delete this.params.rid;
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
                delete this.params.rid;
                this.getRequireName(parm);
            }
        },
        changeRequire(e) {
            // console.log(this.params.rid, e);
            this.options = [];
            let parm = { rname: e };
            this.getRequireName(parm);
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
                        this.options = res.result;
                        // this.showRequiresName = false;
                        // console.log('res.result', res.result);
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch(err => {
                    this.$message.error(res.msg);
                });
        },
        changeDuty(e) {
            console.log('param:', e);
            // e = this.$methods.serchCutOut(e);
            let parm = { rname: e };
            this.get_requireList(parm);
        },
        // 获取需求列表
        get_requireList(parm) {
            this.$api
                .get_requireList(parm)
                .then(res => {
                    if (res.code == 0) {
                        this.requireList = res.project_name;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch(err => {
                    this.$message.error(res.msg);
                });
        },
        // 获取jira项目列表
        group_to_user() {
            this.$api
                .group_to_user({})
                .then(res => {
                    if (res.code == 0) {
                        this.projectList = res.project_name;
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
        getData() {
            // 项目检索状态+列表
            // this.params = {...this.searchObj}
            this.params.stime = this.searchObj.stime;
            this.params.etime = this.searchObj.etime;
            this.params.pid = this.searchObj.pid;
            this.params.rid = this.searchObj.rid;
            this.params.iter_id = this.searchObj.iter_id;
            if (!this.params.pid) {
                this.$message.error('项目为必选项');
                return;
            }
            this.$api
                .bug_resolution_rate(this.params)
                .then(res => {
                    if (res.results.code == 0) {
                        this.tableData = res.results.result;
                        this.pageTotal = res.count;
                        this.params.page_size = res.page_size;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch(err => {
                    this.$message.error(res.msg);
                });
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
