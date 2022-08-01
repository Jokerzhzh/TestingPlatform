<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-button-group>
                    <el-button type="primary" icon="el-icon-plus" @click="addUseCase">添加用例</el-button>
                    <el-button type="primary" icon="el-icon-plus" @click="delUseCase">删除用例</el-button>
                </el-button-group>
            </div>
            <el-table :data="tableData" row-key="id" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column label="序号" type="index" width="50" align="center">
                    <template slot-scope="scope">
                        <span>{{ (params.page - 1) * params.page_size + scope.$index + 1 }}</span>
                        <!-- <span>{{scope.$index + 1}}</span> -->
                    </template>
                </el-table-column>
                <el-table-column label="Task_id" width="75" align="center">
                    <template slot-scope="scope">{{ scope.row.id }}</template>
                </el-table-column>
                <el-table-column label="用例名称">
                    <template slot-scope="scope">{{ scope.row.case_name }}</template>
                </el-table-column>
                <el-table-column label="用例描述" :show-overflow-tooltip="true">
                    <template slot-scope="scope">{{ scope.row.case_desc }}</template>
                </el-table-column>
                <el-table-column label="请求方法">
                    <template slot-scope="scope">{{ scope.row.method }}</template>
                </el-table-column>
                <el-table-column label="请求参数" align="center" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row.params }}
                    </template>
                </el-table-column>
                <el-table-column label="请求头" align="center" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row.headers }}
                    </template>
                </el-table-column>
                <el-table-column label="断言对象" :show-overflow-tooltip="true" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.asserts }}
                    </template>
                </el-table-column>
                <el-table-column label="依赖对象" align="center" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row.ApiDependencys }}
                    </template>
                </el-table-column>
                <el-table-column label="优先级" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.case_weights }}
                    </template>
                </el-table-column>
                <el-table-column label="用例状态" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.status == true ? 'success' : 'danger'">{{
                            scope.row.status == true ? '已启用' : '已禁用'
                        }}</el-tag>
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
        <!-- 添加用例弹出层 -->
        <addUseCaseComponents
            v-if="isAddUseCase"
            :isAddUseCase.sync="isAddUseCase"
            @getAddUseCaseSubmit="getAddUseCaseSubmit"
            @closeDialog="closeHandle"
        ></addUseCaseComponents>
        <!-- 修稿任务集用例 -->
        <delUseCaseComponents
            v-if="isdelUseCase"
            :isdelUseCase.sync="isdelUseCase"
            @getdelUseCaseSubmit="getdelUseCaseSubmit"
            @closeDialog="closeHandle"
        ></delUseCaseComponents>
    </div>
</template>

<script>
import addUseCaseComponents from '@/components/common/dialog/testCaseDetails/addUseCase';
import delUseCaseComponents from '@/components/common/dialog/testCaseDetails/delUseCase';
import Sortable from 'sortablejs';
export default {
    name: 'basetable',
    components: {
        addUseCaseComponents,
        delUseCaseComponents
    },
    data() {
        return {
            params: {
                page: 1,
                page_size: 10
            },
            tableData: [], // 接口数据
            pageTotal: 0, // 分页数据长度
            paginationIndex: 1, //分页默认 第1页
            isAddUseCase: false, //是否显示添加用例弹出框
            isdelUseCase: false //是否显示修改用例弹出框
        };
    },
    created() {
        this.getData();
        this.getProjectName();
    },
    mounted() {
        this.rowDrop();
    },
    watch: {
        $route(to, from) {
            if (to.path == '/testTaskDetails') {
                this.params = {
                    page: 1
                };
                this.getData();
            }
        }
    },
    methods: {
        //行拖拽
        rowDrop() {
            const tbody = document.querySelector('.el-table__body-wrapper tbody');
            const _this = this;
            Sortable.create(tbody, {
                onEnd({ newIndex, oldIndex }) {
                    const currRow = _this.tableData.splice(oldIndex, 1)[0];
                    _this.tableData.splice(newIndex, 0, currRow);
                    let arr = [];
                    _this.tableData.forEach((item) => {
                        arr.push(item.id);
                    });
                    // console.log(arr);
                }
            });
        },
        // 执行测试用例
        getData() {
            this.params.id = localStorage.getItem('taskId');
            this.$api
                .taskset_detail(this.params)
                .then((res) => {
                    if (res.results.code == 0) {
                        this.tableData = res.results.data;
                        this.pageTotal = res.count;
                        this.params.page_size = res.results.page_size;
                    } else {
                        this.$message.error(res.results.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.results.msg);
                });
        },
        getProjectName() {
            // 获取项目名称
            this.$api
                .get_project_name({})
                .then((res) => {
                    if (res.code == 0) {
                        this.projectsName = res.projects_name;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        // 关闭弹出框
        closeHandle(e) {
            console.log('关闭用例');
            this.isAddUseCase = false;
            this.isdelUseCase = false;
        },
        // 添加用例
        addUseCase() {
            this.isAddUseCase = true;
            console.log('添加用例');
        },
        // 修改用例
        delUseCase() {
            this.isdelUseCase = true;
            console.log('修改用例');
        },
        // 获取提交用例数据
        getAddUseCaseSubmit(e) {
            this.isAddUseCase = false;
            console.log(e, '获得了提交的用例');
            this.cases_to_taskset(e);
        },
        //
        getdelUseCaseSubmit(e) {
            this.isdelUseCase = false;
            this.cases_modify_taskset(e);
            console.log(e, '获得了修改的用例');
        },
        // 任务集添加用例
        cases_to_taskset(e) {
            let params = {
                tid: localStorage.getItem('taskId'),
                case_ids: e
            };
            this.$api
                .cases_to_taskset(params)
                .then((res) => {
                    if (res.code == 0) {
                        this.$message({
                            message: res.msg,
                            type: 'success'
                        });
                        this.$set(this.params, 'page', 1);
                        this.getData();
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        // 任务集添加用例
        cases_modify_taskset(e) {
            let params = {
                tid: localStorage.getItem('taskId'),
                case_ids: e
            };
            this.$api
                .cases_modify_taskset(params)
                .then((res) => {
                    if (res.code == 0) {
                        this.$message({
                            message: res.msg,
                            type: 'success'
                        });
                        this.$set(this.params, 'page', 1);
                        this.getData();
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        // 分页导航
        handlePageChange(val) {
            this.paginationIndex = val;
            this.$set(this.params, 'page', val);
            this.getData();
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
    margin-bottom: 10px;
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
