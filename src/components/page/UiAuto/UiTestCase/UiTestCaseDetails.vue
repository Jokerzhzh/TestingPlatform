<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-plus" class="handle-del button" @click="showSteps()">添加步骤</el-button>
                <el-button type="warning" icon="el-icon-delete" class="handle-del button" @click="deleteStepToCase()">批量删除</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                max-height="505"
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" width="50" align="center">
                    <template slot-scope="scope">{{ scope.row.id }}</template>
                </el-table-column>
                <el-table-column prop="project" label="项目名称" align="center" width="160px">
                    <template slot-scope="scope">{{ scope.row.project }}</template>
                </el-table-column>
                <el-table-column prop="piter" label="项目迭代" align="center" width="160px">
                    <template slot-scope="scope">{{ scope.row.piter }}</template>
                </el-table-column>
                <el-table-column prop="page_name" label="页面名称" align="center" width="160px">
                    <template slot-scope="scope">{{ scope.row.page_name }}</template>
                </el-table-column>
                <el-table-column prop="step_name" label="步骤名称" align="center" width="160px">
                    <template slot-scope="scope">{{ scope.row.step_name }}</template>
                </el-table-column>
                <el-table-column prop="element_name" label="元素名称" align="center" width="160px">
                    <template slot-scope="scope">{{ scope.row.element_name }}</template>
                </el-table-column>
                <el-table-column prop="fixed_method" label="定位方法" align="center" width="160px">
                    <template slot-scope="scope">{{ scope.row.fixed_method }}</template>
                </el-table-column>
                <el-table-column prop="action_info" label="定位值字符串" align="center" width="160px">
                    <template slot-scope="scope">{{ scope.row.action_info }}</template>
                </el-table-column>
                <el-table-column prop="action_method" label="执行动作" align="center" width="160px">
                    <template slot-scope="scope">{{ scope.row.action_method }}</template>
                </el-table-column>
                <el-table-column prop="action_desc" label="动作描述" align="center" width="160px">
                    <template slot-scope="scope">{{ scope.row.action_desc }}</template>
                </el-table-column>
                <el-table-column prop="action_value" label="执行数据" align="center" width="160px">
                    <template slot-scope="scope">{{ scope.row.action_value }}</template>
                </el-table-column>
                <el-table-column prop="action_raise" label="执行步骤断言" align="center" width="160px">
                    <template slot-scope="scope">{{ scope.row.action_raise }}</template>
                </el-table-column>
            </el-table>
            <!-- <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next,jumper"
                    :current-page="params.page"
                    :page-size="params.page_size"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div> -->
        </div>
        <!-- 用例详情 添加步骤 -->
        <el-dialog title="添加步骤" @close="closeShowSteps()" custom-class="showSteps-el-dialog" :visible.sync="isShowSteps" width="80%">
            <div class="handle-box">
                <el-input v-model="params.page_name" placeholder="页面名称" class="handle-input mr10" clearable></el-input>
                <el-input v-model="params.step_name" placeholder="步骤名称" class="handle-input mr10" clearable></el-input>
                <el-button type="primary" class="handle-del button" @click="handleSearch()">搜 索</el-button>
                <el-button class="handle-del button" @click="onReload()">重 置</el-button>
            </div>
            <el-table
                :data="stepsData"
                border
                height="340"
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" align="center" width="39"></el-table-column>
                <el-table-column prop="id" label="ID" width="50" align="center">
                    <template slot-scope="scope">{{ scope.row.id }}</template>
                </el-table-column>
                <el-table-column prop="project" label="项目名称" align="center" width="160px">
                    <template slot-scope="scope">{{ scope.row.project }}</template>
                </el-table-column>
                <el-table-column prop="piter" label="项目迭代" align="center" width="160px">
                    <template slot-scope="scope">{{ scope.row.piter }}</template>
                </el-table-column>
                <el-table-column prop="page_name" label="页面名称" align="center" width="160px">
                    <template slot-scope="scope">{{ scope.row.page_name }}</template>
                </el-table-column>
                <el-table-column prop="step_name" label="步骤名称" align="center" width="160px">
                    <template slot-scope="scope">{{ scope.row.step_name }}</template>
                </el-table-column>
                <el-table-column prop="element_name" label="元素名称" align="center" width="160px">
                    <template slot-scope="scope">{{ scope.row.element_name }}</template>
                </el-table-column>
                <el-table-column prop="fixed_method" label="定位方法" align="center" width="160px">
                    <template slot-scope="scope">{{ scope.row.fixed_method }}</template>
                </el-table-column>
                <el-table-column prop="action_info" label="定位值字符串" align="center" width="160px">
                    <template slot-scope="scope">{{ scope.row.action_info }}</template>
                </el-table-column>
                <el-table-column prop="action_method" label="执行动作" align="center" width="160px">
                    <template slot-scope="scope">{{ scope.row.action_method }}</template>
                </el-table-column>
                <el-table-column prop="action_desc" label="动作描述" align="center" width="160px">
                    <template slot-scope="scope">{{ scope.row.action_desc }}</template>
                </el-table-column>
                <el-table-column prop="action_value" label="执行数据" align="center" width="160px">
                    <template slot-scope="scope">{{ scope.row.action_value }}</template>
                </el-table-column>
                <el-table-column prop="step_assert" label="执行步骤断言" align="center" width="160px">
                    <template slot-scope="scope">{{ scope.row.step_assert }}</template>
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
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeShowSteps()">取 消</el-button>
                <el-button type="primary" @click="submitChoose()">确 定</el-button>
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
            stepsData: [],
            multipleSelection: [], // 多选监听
            pageTotal: 0, // 分页数据长度
            paginationIndex: 1, //分页默认 第1页
            isShowSteps: false,
            cid: '' // 删除用例中的步骤时所需的用例id
        };
    },
    created() {
        console.log('初次进入页面渲染接口数据');
        let id = this.$route.query.id;
        this.cid = id;
        this.caseContainsStepDetail(this.cid);
        this.querySteps();
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
        // 查询执行步骤
        querySteps() {
            this.$api
                .query_steps(this.params)
                .then((res) => {
                    if (res.results.code == 0) {
                        // this.$message.success(res.results.msg);
                        this.stepsData = res.results.result;
                        this.pageTotal = res.count;
                    } else {
                        this.$message.error(res.results.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(err.msg);
                });
        },
        // 查询用例关联的步骤详情
        caseContainsStepDetail(cid) {
            let params = {
                cid: cid
            };
            this.$api
                .case_contains_step_detail(params)
                .then((res) => {
                    if (res.code == 0) {
                        this.tableData = res.result;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(err.msg);
                });
        },
        // 打开添加步骤弹窗
        showSteps() {
            this.isShowSteps = true;
        },
        // 提交添加步骤
        submitChoose() {
            // 获取选中表格的长度
            const length = this.multipleSelection.length;
            // 设置一个空数组
            let str = [];
            // 循环表格的长度，把每个表格的id装进str空数组里
            for (let i = 0; i < length; i++) {
                str.push(this.multipleSelection[i].id);
            }
            // // 判断如果有选中（str不为空）执行弹出框
            if (str != '') {
                let params = {
                    cid: this.cid,
                    sids: str
                };
                this.$api
                    .step_to_case(params)
                    .then((res) => {
                        if (res.code == 0) {
                            this.$message.success(res.msg);
                            this.isShowSteps = false;
                            this.caseContainsStepDetail(this.cid);
                        } else {
                            this.$message.error(res.msg);
                        }
                    })
                    .catch((err) => {
                        this.$message.error(err.msg);
                    });
            } else {
                this.$message({
                    message: '请选择要添加得步骤',
                    type: 'warning'
                });
            }
        },
        // 关闭添加步骤弹窗
        closeShowSteps() {
            // 清除 element 表格所选数据
            this.$refs.multipleTable.clearSelection();
            this.isShowSteps = false;
        },
        // 批量删除 用例关联的步骤
        deleteStepToCase() {
            // 获取选中表格的长度
            const length = this.multipleSelection.length;
            // 设置一个空数组
            let str = [];
            // 循环表格的长度，把每个表格的id装进str空数组里
            for (let i = 0; i < length; i++) {
                str.push(this.multipleSelection[i].id);
            }
            // 判断如果有选中（str不为空）执行弹出框
            if (str != '') {
                let params = {
                    cid: this.cid,
                    ids: str
                };
                // 二次确认删除
                this.$confirm('确定要删除这' + length + '条吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        this.$api
                            .delete_step_to_case(params)
                            .then((res) => {
                                if (res.code == 0) {
                                    this.$message.success(res.msg);
                                    this.caseContainsStepDetail(this.cid);
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
            } else {
                this.$message({
                    message: '请选择要删除的步骤',
                    type: 'warning'
                });
            }
        },
        // 多选监听
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 步骤-分页导航
        handlePageChange(val) {
            this.paginationIndex = val;
            this.$set(this.params, 'page', val);
            this.querySteps();
        },
        // 触发搜索按钮
        handleSearch() {
            console.log(this.params, '获取搜索数据');
            this.$set(this.params, 'page', 1);
            this.querySteps();
        },
        // 重置查询步骤
        onReload() {
            this.params = {};
            this.querySteps();
        }
    }
};
</script>

<style scoped lang="less">
/deep/.showSteps-el-dialog {
    .el-switch {
        margin-top: 5px;
    }
    .el-dialog__body {
        padding: 10px 20px !important;
    }
    .el-dialog__footer {
        padding: 0px 20px 15px !important;
        margin-top: -20px;
    }
}
.handle-box {
    margin-bottom: 10px;
    div {
        margin-bottom: 10px;
    }
    .el-input {
        width: 150px;
    }
    .el-select {
        width: 150px;
        margin-right: 10px;
    }
}
.table {
    width: 100%;
    font-size: 14px;
}
.mr10 {
    margin-right: 10px;
    // width: 100%;
}
</style>
