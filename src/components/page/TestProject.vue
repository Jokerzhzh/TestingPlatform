<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-select
                    ref="select1"
                    @visible-change="changeFocus1"
                    v-model="params.project_name"
                    placeholder="项目名称"
                    class="handle-select mr10"
                >
                    <el-option
                        v-for="item in projectsName"
                        :key="item.project_name"
                        :label="item.project_name"
                        :value="item.project_name"
                    ></el-option>
                </el-select>
                <el-select
                    ref="select2"
                    @visible-change="changeFocus2"
                    v-model="params.status"
                    placeholder="选择状态"
                    class="handle-select mr10"
                >
                    <el-option key="1" label="生效中" value="1"></el-option>
                    <el-option key="0" label="已禁用" value="0"></el-option>
                </el-select>

                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-bottom" @click="pull_projects">拉取</el-button>
                <el-button type="primary" @click="onReload">重置</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column label="序号" type="index" width="50" align="center">
                    <template slot-scope="scope">
                        <span>{{(params.page - 1) * params.page_size + scope.$index + 1}}</span>
                        <!-- <span>{{scope.$index + 1}}</span> -->
                    </template>
                </el-table-column>
                <el-table-column prop="id" label="ID" width="66" align="center">
                    <template slot-scope="scope">{{scope.row.id}}</template>
                </el-table-column>
                <el-table-column prop="name" label="项目名称">
                    <template slot-scope="scope">{{scope.row.project_name}}</template>
                </el-table-column>
                <el-table-column label="项目描述">
                    <template slot-scope="scope">{{scope.row.project_desc}}</template>
                </el-table-column>
                <el-table-column label="责任人">
                    <template slot-scope="scope">{{ filterTesters(scope.row.Testers)}}</template>
                </el-table-column>
                <el-table-column prop="date" label="创建时间" align="center">
                    <template slot-scope="scope">{{format(scope.row.create_time)}}</template>
                </el-table-column>
                <el-table-column prop="date" label="修改时间" align="center">
                    <template slot-scope="scope">{{format(scope.row.update_time)}}</template>
                </el-table-column>
                <el-table-column label="操作" width="150" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="onEdit(scope.row)">编辑</el-button>
                        <!-- <el-button type="danger" @click="onDel(scope)">删除</el-button> -->
                    </template>
                </el-table-column>
            </el-table>
            <el-dialog
                :title="title"
                :visible.sync="dialogVisible"
                width="40%"
                :before-close="handleClose"
            >
                <div class="public-dialog">
                    <el-form
                        status-icon
                        :model="edit"
                        ref="edit"
                        label-width="100px"
                        class="demo-ruleForm"
                    >
                        <el-form-item
                            label="项目名称"
                            prop="project_name"
                            :rules="[{ required: true, message: '请输入项目名称', trigger: 'blur' }]"
                        >
                            <el-input
                                type="text"
                                placeholder="请输入项目名称"
                                maxlength="30"
                                show-word-limit
                                v-model="edit.project_name"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="项目描述" prop="project_desc">
                            <el-input
                                type="text"
                                placeholder="请输入项目描述"
                                maxlength="30"
                                show-word-limit
                                v-model="edit.project_desc"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="责任人" prop="Testers">
                            <!-- :filter-method="filterMember"
                                @visible-change="visibleSelect"
                            filterable-->
                            <el-select
                                v-model="edit.Testers"
                                multiple
                                collapse-tags
                                placeholder="请选择责任人"
                            >
                                <el-option
                                    v-for="item in userList"
                                    :key="item.user_id"
                                    :label="item.username"
                                    :value="item.username"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="onSure">提 交</el-button>
                </span>
            </el-dialog>
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
    </div>
</template>

<script>
export default {
    name: 'basetable',
    data() {
        return {
            params: {
                page: 1,
                page_size: 10
            },
            projectsName: [], // 项目名称搜索
            tableData: [], // 列表数据
            pageTotal: 0, // 数据总条数
            disabled: false,
            userList: [],
            dialogVisible: false,
            edit: {},
            title: '项目编辑'
        };
    },
    created() {
        this.getData();
        this.getProjectName();
    },
    mounted() {
        // 绑定enter事件
        this.$api.get_test_username().then(res => {
            if (res.code == 0) {
                this.userList = res.result;
            }
        });
        document.addEventListener('keyup', this.enterKey);
    },
    destroyed() {
        // 销毁enter事件
        document.removeEventListener('keyup', this.enterKey);
    },
    methods: {
        getData() {
            // 项目检索状态 + 列表;
            this.$api
                .search_projects(this.params)
                .then(res => {
                    if (res.results.code == 0) {
                        this.tableData = res.results.data;
                        this.pageTotal = res.count;
                        this.params.page_size = res.results.page_size;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch(err => {
                    this.$message.error(res.msg);
                });
        },
        pull_projects() {
            this.$api
                .pull_projects()
                .then(res => {
                    if (res.code == 0) {
                        // this.tableData = res.result;
                        // this.pageTotal = res.numbers;
                        this.$message({
                            message: `yapi上拉取到${res.numbers}条项目`,
                            type: 'success'
                        });
                        this.getData();
                        // this.params.page_size = res.results.page_size;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch(err => {
                    this.$message.error(res.msg);
                });
        },
        getProjectName() {
            // 获取项目名称
            this.$api
                .get_project_name({})
                .then(res => {
                    if (res.code == 0) {
                        this.projectsName = res.result;
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
        },
        // 删除
        onDel(scope) {
            this.$confirm('此操作将永久删除该项目以及项目下模块和接口, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.$api
                        .del_project({ pids: [scope.row.id] })
                        .then(res => {
                            if (res.code == 0) {
                                this.$message({
                                    message: '项目删除成功',
                                    type: 'success'
                                });
                                // this.$set(this.params, 'page', 1);
                                this.tableData = [];
                                this.getData();
                            } else {
                                this.$message.error(res.msg);
                            }
                        })
                        .catch(err => {
                            this.$message.error('取消删除');
                        });
                    console.log('删除：', scope);
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
        },
        onEdit(va) {
            this.dialogVisible = true;
            this.edit = JSON.parse(JSON.stringify(va));
        },
        onSure(va) {
            let params = JSON.parse(JSON.stringify(this.edit));
            this.userList.forEach(item => {
                for (let i = 0; i < params.Testers.length; i++) {
                    const user = params.Testers[i];
                    if (user == item.username) {
                        params.Testers[i] = item.user_id;
                        break;
                    }
                }
            });
            this.$api
                .edit_project(params)
                .then(res => {
                    if (res.code == 0) {
                        this.dialogVisible = false;
                        this.getData();
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch(err => {
                    this.$message.error(res.msg);
                });
        },
        /**
         * 过滤人员
         * @param {string} key 过滤字段
         */
        filterMember(key) {
            let params = { uname: key ? key : '' };
            this.$api.get_test_username(params).then(res => {
                if (res.code == 0) {
                    this.userList = res.result;
                }
            });
        },
        /**
         * 下拉框隐藏重置人员列表
         * @param {bool} type 隐藏/显示
         */
        visibleSelect(type) {
            if (!type) {
                this.$api.get_test_username().then(res => {
                    if (res.code == 0) {
                        this.userList = res.result;
                    }
                });
            }
        },
        handleClose() {
            this.dialogVisible = false;
        },
        // 重置
        onReload() {
            this.params = {
                page: 1,
                page_size: 10
            };
        }
    },
    computed: {
        format() {
            return originVal => {
                const dt = new Date(originVal);

                const y = dt.getFullYear();
                const m = (dt.getMonth() + 1 + '').padStart(2, '0');
                const d = (dt.getDate() + '').padStart(2, '0');

                const hh = (dt.getHours() + '').padStart(2, '0');
                const mm = (dt.getMinutes() + '').padStart(2, '0');
                const ss = (dt.getSeconds() + '').padStart(2, '0');

                return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
            };
        },
        filterTesters() {
            return testers => {
                let testerStr = '';
                for (let i = 0; i < testers.length; i++) {
                    const user = testers[i];
                    testerStr = testerStr ? testerStr + '、' + user : user;
                }
                return testerStr;
            };
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
</style>
