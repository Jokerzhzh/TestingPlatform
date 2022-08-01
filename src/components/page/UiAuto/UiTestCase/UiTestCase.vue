<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-select
                    clearable
                    filterable
                    width="100%"
                    v-model="params.project"
                    placeholder="项目名称"
                    class="handle-select mr99"
                    @change="selectProject"
                >
                    <el-option v-for="item in projectList" :key="item.pid" :label="item.pname" :value="item.pname"></el-option>
                </el-select>
                <el-select
                    clearable
                    filterable
                    width="100%"
                    v-model="params.piter"
                    :disabled="!params.project"
                    placeholder="项目迭代"
                    class="handle-select mr99"
                    @change="change()"
                >
                    <el-option
                        v-for="item in iterationList"
                        :key="item.id"
                        :label="item.project_name"
                        :value="item.project_name"
                    ></el-option>
                </el-select>
                <el-input
                    v-model="params.page_name"
                    placeholder="页面名称"
                    class="handle-input mr10"
                    clearable
                    @input="change($event)"
                ></el-input>
                <el-input
                    v-model="params.case_name"
                    placeholder="用例名称"
                    class="handle-input mr10"
                    clearable
                    @input="change($event)"
                ></el-input>
                <el-button type="primary" class="handle-del button" @click="handleSearch()">搜 索</el-button>
                <el-button class="handle-del button" @click="onReload()">重 置</el-button>
                <el-button type="primary" icon="el-icon-plus" class="handle-del button" @click="showAddCase()">添加用例</el-button>
                <!-- <el-button type="primary" class="handle-del button" @click="deleteAllStep()">组 合</el-button> -->
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column prop="id" label="ID" width="66" align="center">
                    <template slot-scope="scope">{{ scope.row.id }}</template>
                </el-table-column>
                <el-table-column prop="project" label="项目名称" align="center">
                    <template slot-scope="scope">{{ scope.row.project }}</template>
                </el-table-column>
                <el-table-column prop="piter" label="项目迭代" align="center">
                    <template slot-scope="scope">{{ scope.row.piter }}</template>
                </el-table-column>
                <el-table-column prop="page_name" label="页面名称" align="center">
                    <template slot-scope="scope">{{ scope.row.page_name }}</template>
                </el-table-column>
                <el-table-column prop="case_name" label="测试用例名称" align="center">
                    <template slot-scope="scope">{{ scope.row.case_name }}</template>
                </el-table-column>
                <el-table-column prop="case_desc" label="测试用例描述" align="center">
                    <template slot-scope="scope">{{ scope.row.case_desc }}</template>
                </el-table-column>
                <el-table-column prop="exec_uname" label="执行人" align="center">
                    <template slot-scope="scope">{{ scope.row.exec_uname }}</template>
                </el-table-column>
                <!-- <el-table-column prop="status" label="用例状态" align="center">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="绿色为true，红色为false" placement="top">
                            <el-switch :disabled="true" v-model="scope.row.status" active-color="#13ce66" inactive-color="#ff4949">
                            </el-switch>
                        </el-tooltip>
                    </template>
                </el-table-column> -->
                <!-- <el-table-column prop="case_assert" label="用例断言">
                    <template slot-scope="scope">{{ scope.row.case_assert }}</template>
                </el-table-column> -->
                <!-- <el-table-column prop="user" label="user" align="center">
                    <template slot-scope="scope">{{ scope.row.user }}</template>
                </el-table-column> -->
                <el-table-column label="操作" width="120" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button
                            v-if="scope.row.replay"
                            style="margin-top: 5px"
                            type="success"
                            size="mini"
                            icon="el-icon-view"
                            @click="show(scope.row.replay)"
                            >查看
                        </el-button>
                        <br />
                        <el-button
                            style="margin-top: 5px"
                            type="success"
                            size="mini"
                            icon="el-icon-lx-forward"
                            @click="executeAutoCase(scope.row.id)"
                            >执行
                        </el-button>
                        <br />
                        <el-button
                            style="margin-top: 5px"
                            type="primary"
                            size="mini"
                            icon="el-icon-document"
                            @click="handleDetails(scope.row)"
                            >详情
                        </el-button>
                        <br />
                        <!-- <el-button style="margin-top: 5px" type="success" size="mini" icon="el-icon-lx-forward">执行 </el-button>
                        <br /> -->
                        <el-button
                            style="margin-top: 5px"
                            type="warning"
                            size="mini"
                            icon="el-icon-edit-outline"
                            @click="showModifyCase(scope.row)"
                            >修改
                        </el-button>
                        <br />
                        <el-button style="margin-top: 5px" type="danger" size="mini" icon="el-icon-delete" @click="deleteCase(scope.row.id)"
                            >删除
                        </el-button>
                    </template>
                </el-table-column>
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
        </div>
        <!-- 添加用例 / 修改用例 -->
        <el-dialog
            :title="casetitle"
            @close="closeCase()"
            custom-class="case-el-dialog"
            :visible.sync="isCase"
            width="40%"
            :before-close="handleClose"
        >
            <el-form :model="caseData" label-width="80px">
                <el-form-item label="项目名称" :rules="[{ required: true }]">
                    <el-select
                        clearable
                        filterable
                        width="100%"
                        v-model="caseData.project"
                        placeholder="请选择项目"
                        class="handle-select mr99"
                        @change="selectProject"
                    >
                        <el-option
                            v-for="item in projectList"
                            :key="item.pid"
                            :label="item.pname"
                            :value="item.pname"
                            @input="change($event)"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="项目迭代" :rules="[{ required: true }]">
                    <el-select
                        clearable
                        filterable
                        width="100%"
                        v-model="caseData.piter"
                        :disabled="!caseData.project"
                        placeholder="请选择迭代"
                        class="handle-select mr99"
                        @change="change($event)"
                    >
                        <el-option
                            v-for="item in iterationList"
                            :key="item.id"
                            :label="item.project_name"
                            :value="item.project_name"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="页面名称" prop="page_name" :rules="[{ required: true, message: '请输入页面名称', trigger: 'blur' }]">
                    <el-input v-model="caseData.page_name" placeholder="请输入页面名称" @input="change($event)"> </el-input>
                </el-form-item>
                <el-form-item
                    label="用例名称"
                    prop="case_name"
                    :rules="[{ required: true, message: '请输入测试用例名称', trigger: 'blur' }]"
                >
                    <el-input v-model="caseData.case_name" placeholder="请输入测试用例名称" @input="change($event)"> </el-input>
                </el-form-item>
                <el-form-item label="用例描述">
                    <el-input v-model="caseData.case_desc" placeholder="请输入测试用例描述" @input="change($event)"> </el-input>
                </el-form-item>
                <el-form-item label="执行人">
                    <el-input v-model="caseData.exec_uname" placeholder="请输入执行人" @input="change($event)"> </el-input>
                </el-form-item>
                <!-- <el-form-item label="用例状态">
                    <el-tooltip class="item" effect="dark" content="绿色为true，红色为false" placement="right">
                        <el-switch
                            class="status"
                            v-model="status"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            @change="change($event)"
                        ></el-switch>
                    </el-tooltip>
                </el-form-item> -->
                <!-- <el-form-item label="用例断言" prop="case_assert">
                    <el-input v-model="addCaseData.case_assert" placeholder="请输入用例断言" @input="change($event)"></el-input>
                </el-form-item> -->
                <!-- <el-form-item label="user">
                    <el-input v-model="addCaseData.user" placeholder="请输入user" @input="change($event)"> </el-input>
                </el-form-item> -->
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeCase()">取 消</el-button>
                <el-button type="primary" @click="submitCase()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            params: {
                page: 1,
                page_size: 10
            },
            tableData: [], // 接口数据
            projectList: [], // 项目列表
            iterationList: [], // 迭代列表
            pageTotal: 0, // 分页数据长度
            paginationIndex: 1, //分页默认 第1页
            status: true, // 添加用例时状态默认为true
            caseData: {}, // 添加用例/修改用例data
            casetitle: '', // 添加用例/修改用例title
            isCase: false // 添加用例/修改用例弹窗
        };
    },
    created() {
        console.log('初次进入页面渲染接口数据');
        this.getProjectName();
        this.queryCase();
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
        show(replay) {
            console.log(replay);
            window.open(replay);
        },
        executeAutoCase(id) {
            let params = {
                cid: id
            };
            this.$api
                .execute_auto_case(params)
                .then((res) => {
                    if (res.code == 0) {
                        this.$message.success(res.msg);
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(err.msg);
                });
        },
        // 打开 添加用例 弹窗
        showAddCase() {
            this.casetitle = '添加用例';
            this.isCase = true;
            this.caseData = {};
        },
        // 打开 修改用例 弹窗
        showModifyCase(row) {
            this.casetitle = '修改用例';
            // 执行显示弹出层
            this.isCase = true;
            // 给弹出层内容赋值
            this.caseData.id = row.id;
            this.caseData.project = row.project;
            this.caseData.piter = row.piter;
            this.caseData.page_name = row.page_name;
            this.caseData.case_name = row.case_name;
            this.caseData.case_desc = row.case_desc;
            this.caseData.exec_uname = row.exec_uname;
            this.caseData.status = row.status;
            // this.modifyCaseData.status = String(row.status);
            // this.modifyCaseData.case_assert = row.case_assert;
            // this.modifyCaseData.user = row.user;
        },
        // 关闭 添加用例/修改用例 弹窗
        closeCase() {
            this.isCase = false;
        },
        submitCase() {
            console.log(this.caseData);
            if (!this.caseData.project) {
                this.$message.error('请选择项目');
                return;
            }
            if (!this.caseData.piter) {
                this.$message.error('请选择迭代');
                return;
            }
            if (!this.caseData.page_name) {
                this.$message.error('请输入页面名称');
                return;
            }
            if (!this.caseData.case_name) {
                this.$message.error('请输入用例名称');
                return;
            }
            if (this.casetitle == '添加用例') {
                this.caseData.status = this.status;
                this.$api
                    .ui_add_case(this.caseData)
                    .then((res) => {
                        if (res.code == 0) {
                            this.$message.success('添加成功！');
                            this.isCase = false;
                            this.queryCase();
                        } else {
                            this.$message.error(res.msg);
                        }
                    })
                    .catch((err) => {
                        this.$message.error(err.msg);
                    });
            } else {
                this.$api
                    .ui_modify_case(this.caseData)
                    .then((res) => {
                        if (res.code == 0) {
                            this.$message.success('修改成功！');
                            this.isCase = false;
                            this.queryCase();
                        } else {
                            this.$message.error(res.msg);
                        }
                    })
                    .catch((err) => {
                        this.$message.error(err.msg);
                    });
            }
        },
        // 查看用例详情
        handleDetails(row) {
            this.$router.push({ path: '/uiTestCaseDetails', query: { id: row.id } });
        },
        // 查询测试用例
        queryCase() {
            this.$api
                .query_case(this.params)
                .then((res) => {
                    if (res.results.code == 0) {
                        this.tableData = res.results.result;
                        this.pageTotal = res.count;
                        // this.$message.success(res.results.msg);
                    } else {
                        this.$message.error(res.results.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(err.msg);
                });
        },
        // 删除用例
        deleteCase(id) {
            this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    // console.log(id);
                    let params = {
                        ids: [id]
                    };
                    this.$api
                        .ui_delete_case(params)
                        .then((res) => {
                            if (res.code == 0) {
                                this.$message.success(res.msg);
                                this.queryCase();
                            } else {
                                this.$message.error(res.msg);
                            }
                        })
                        .catch((err) => {
                            this.$message.error(err.msg);
                        });
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
        },
        // 关闭确认
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then((_) => {
                    done();
                })
                .catch((_) => {});
        },
        // 获取项目名称
        getProjectName() {
            this.$api
                .group_to_user()
                .then((res) => {
                    if (res.code == 0) {
                        this.projectList = res.project_name;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(err.msg);
                });
        },
        // 选中项目获取迭代
        selectProject(name) {
            this.$forceUpdate();
            if (name == '') {
                this.params.piter = '';
                this.caseData.piter = '';
            } else {
                this.params.piter = '';
                this.caseData.piter = '';
                let key;
                for (let i = 0; i < this.projectList.length; i++) {
                    const ele = this.projectList[i];
                    if (ele.pname == name) {
                        key = ele.pid;
                        break;
                    }
                }
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
            }
        },
        // 全局回车搜索
        enterKey(event) {
            const code = event.keyCode;
            const path = this.$route.path;
            if (code == 13 && path == '/testCase') {
                this.handleSearch();
            }
        },
        // 触发搜索按钮
        handleSearch() {
            console.log(this.params, '获取搜索数据');
            this.$set(this.params, 'page', 1);
            this.queryCase();
        },
        // 重置
        onReload() {
            this.params = {};
            this.$set(this.params, 'page', 1);
            this.queryCase();
        },
        // 二次确认关闭
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then((_) => {
                    done();
                })
                .catch((_) => {});
        },
        // 控制下拉框失去焦点
        changeFocus1(val) {
            if (val) {
                this.$refs.select1.focus();
            } else {
                this.$refs.select1.blur();
            }
        },
        // 用例-分页导航
        handlePageChange(val) {
            this.paginationIndex = val;
            this.$set(this.params, 'page', val);
            this.queryCase();
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
.case-el-dialog {
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
    .status {
        margin-top: -3px;
    }
}
.handle-box {
    margin-bottom: 10px;
    div {
        margin-bottom: 10px;
    }
    .el-input {
        width: 150px;
        margin-right: 10px;
        display: inline-block;
    }
    .el-select {
        width: 150px;
        margin-right: 10px;
    }
}
.handle-select {
    width: 120px;
}
.table {
    width: 100%;
    font-size: 14px;
}
</style>
