<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-input style="margin-right: 20px" placeholder="请输入任务名称" v-model="search_task"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" @click="onAdd">新增任务</el-button>
                <el-button type @click="onReload">重置</el-button>
            </div>
            <el-table :data="tableData" border size="mini" class="table" ref="multipleTable">
                <el-table-column prop="DID" label="任务ID" width="66" align="center"></el-table-column>
                <el-table-column prop="task_name" label="任务名称" width="150"></el-table-column>
                <el-table-column label="关联需求" width="250">
                    <template slot-scope="scope">
                        <el-tag style="margin-right: 5px" v-for="(item, index) in scope.row.require_info" :key="index">{{
                            item.rname
                        }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="任务类型" align="center" width="100">
                    <template slot-scope="scope">
                        <el-tag type="success">{{ changeType(scope.row.task_type) }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="任务描述" prop="task_desc" width="180"></el-table-column>

                <el-table-column label="状态" align="center" width="150">
                    <template slot-scope="scope">
                        <el-tag :type="changeStatus(scope.row.status, 0)">{{ changeStatus(scope.row.status, 1) }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column width="150" prop="date" label="开始时间" align="center">
                    <template slot-scope="scope">{{ scope.row.task_stime }}</template>
                </el-table-column>
                <el-table-column width="150" prop="date" label="结束时间" align="center">
                    <template slot-scope="scope">{{ scope.row.task_etime }}</template>
                </el-table-column>
                <el-table-column width="220" prop="date" label="创建时间" align="center">
                    <template slot-scope="scope">{{ scope.row.create_time }}</template>
                </el-table-column>
                <el-table-column width="220" prop="date" label="更新时间" align="center">
                    <template slot-scope="scope">{{ scope.row.update_time }}</template>
                </el-table-column>

                <el-table-column label="创建人" prop="creator" width="100"></el-table-column>

                <el-table-column label="指派" width="200">
                    <template slot-scope="scope">
                        <el-tag style="margin-right: 5px" v-for="(item, index) in scope.row.tester" :key="index">{{
                            item.username
                        }}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="180" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="onEdit(scope)">编辑</el-button>
                        <el-button type="danger" @click="onDel(scope)">删除</el-button>
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

        <el-dialog :title="title" :visible.sync="dialogVisible" width="80%" :before-close="handleClose">
            <div class="public-dialog">
                <el-card class="box-card">
                    <div class="box-line">
                        <input
                            v-model="dialogObj.task_name"
                            type="text"
                            placeholder="请输入名称"
                            class="project-input"
                            style="width: 80%"
                        />
                    </div>
                    <textarea v-model="dialogObj.task_desc" class="textarea-input" style="margin-top: 20px" />
                </el-card>

                <el-card class="box-input-card">
                    <el-form status-icon label-width="100px" class="demo-ruleForm">
                        <el-form-item label="关联迭代" :rules="[{ required: true, message: '请选择关联迭代', trigger: 'blur' }]">
                            <el-select placeholder="请选择关联迭代" v-model="dialogObj.pid" @change="changeProject">
                                <el-option
                                    v-for="(item, index) in projectList"
                                    :key="index"
                                    :label="item.project_name"
                                    :value="item.id"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="关联需求" :rules="[{ required: true, message: '请输入需求ID', trigger: 'blur' }]">
                            <el-select
                                :disabled="dialogObj.pid == ''"
                                v-model="dialogObj.Trequire"
                                multiple
                                collapse-tags
                                placeholder="请选择"
                            >
                                <el-option v-for="(item, index) in needList" :key="index" :label="item.rname" :value="item.ZID"></el-option>
                            </el-select>

                            <!-- <el-input type="password" autocomplete="off"></el-input> -->
                        </el-form-item>

                        <el-form-item label="任务类型" :rules="[{ required: true, message: '请选择优先级', trigger: 'blur' }]">
                            <el-select placeholder="请选择活动区域" v-model="dialogObj.task_type">
                                <el-option label="需求评审" value="0"></el-option>
                                <el-option label="用例编写" value="1"></el-option>
                                <el-option label="用例评审" value="2"></el-option>
                                <el-option label="用例执行" value="3"></el-option>
                                <el-option label="环境部署" value="4"></el-option>
                                <el-option label="数据准备" value="5"></el-option>
                                <el-option label="其他" value="6"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="状态" :rules="[{ required: true, message: '请选择状态', trigger: 'blur' }]">
                            <el-select placeholder="请选择活动区域" v-model="dialogObj.status">
                                <el-option label="未开始" value="0"></el-option>
                                <el-option label="已开始" value="1"></el-option>
                                <el-option label="已完成" value="2"></el-option>
                                <el-option label="未完成" value="3"></el-option>
                                <el-option label="超期完成" value="4"></el-option>
                                <el-option label="超期未完成" value="5"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="起止时间" :rules="[{ required: true, message: '请选择起止时间', trigger: 'blur' }]">
                            <el-date-picker
                                type="date"
                                style="width: 180px"
                                v-model="dialogObj.task_stime"
                                format="yyyy 年 MM 月 dd 日"
                                value-format="yyyy-MM-dd"
                                placeholder="选择起始日期"
                            ></el-date-picker
                            >至
                            <el-date-picker
                                type="date"
                                style="width: 180px"
                                format="yyyy 年 MM 月 dd 日"
                                value-format="yyyy-MM-dd"
                                v-model="dialogObj.task_etime"
                                placeholder="选择结束日期"
                            ></el-date-picker>
                        </el-form-item>

                        <el-form-item label="指派" :rules="[{ required: true, message: '请选择指派人', trigger: 'blur' }]">
                            <el-select
                                v-model="dialogObj.tester"
                                multiple
                                collapse-tags
                                :filter-method="filterMember"
                                @visible-change="visibleSelect"
                                filterable
                                placeholder="请选择"
                            >
                                <el-option
                                    v-for="item in userList"
                                    :key="item.username"
                                    :label="item.username"
                                    :value="item.id"
                                ></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="备注">
                            <textarea v-model="dialogObj.remarks" class="textarea-input" style="height: 150px" />
                        </el-form-item>
                    </el-form>
                </el-card>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose()">取 消</el-button>
                <el-button type="primary" :loading="btnLoading" @click="onSubimt">提 交</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'testwork',
    data() {
        return {
            search_task: '',
            params: {
                page: 1,
                page_size: 10
            },
            dialogVisible: false,
            title: '创建任务',
            projectsName: [], // 项目名称搜索
            tableData: [], // 列表数据
            pageTotal: 0, // 数据总条数
            disabled: false,
            userList: [],
            needData: [],
            needList: [],
            dialogObj: {
                task_name: '',
                task_desc: '',
                task_type: '',
                task_stime: '',
                task_etime: '',
                status: '',
                tester: [],
                Trequire: [],
                tid: '',
                remarks: '',
                pid: ''
            },
            projectList: [],
            btnLoading: false
        };
    },
    created() {
        this.getData();
    },
    mounted() {
        // 绑定enter事件
        document.addEventListener('keyup', this.enterKey);
        this.userList = JSON.parse(localStorage.getItem('userList'));
    },
    destroyed() {
        // 销毁enter事件
        document.removeEventListener('keyup', this.enterKey);
    },
    methods: {
        // 选择项目 后 获取需求
        changeProject(callback) {
            console.log('获取当前选号功能的：', this.dialogObj.pid);
            this.$api
                .require_project({ belong_project: this.dialogObj.pid })
                .then((res) => {
                    if (res.code == 0) {
                        console.log('res:', res);
                        this.needList = res.data;
                        this.dialogObj.Trequire = [];
                        if (callback) {
                            callback();
                        }
                    } else {
                        this.$message.error(res.msg);
                        // this.$message.error('接口返回异常');
                    }
                })
                .catch((err) => {
                    // this.$message.error(res.msg);
                    // this.$message.error('接口返回异常');
                });
        },
        // 查看详情
        checkDetails(data) {
            this.$api
                .need_project({ belong_project: id })
                .then((res) => {
                    if (res.results.code == 0) {
                        console.log('res:', res);
                        this.dialogdetailsVisible = true;
                        this.needData = res.results.data;
                    } else {
                        this.$message.error(res.results.msg);
                        // this.$message.error('接口返回异常');
                    }
                })
                .catch((err) => {
                    this.$message.error(res.results.msg);

                    // this.$message.error('接口返回异常');
                });
        },
        // 提交
        onSubimt() {
            if (this.btnLoading) {
                console.log(this.btnLoading);
                return;
            }
            if (this.dialogObj.task_name == '') {
                this.$message.error('请填写任务名称');
                return;
            }
            if (this.dialogObj.task_desc == '') {
                this.$message.error('请填写任务简介');
                return;
            }
            if (this.dialogObj.pid == '') {
                this.$message.error('请选择关联项目');
                return;
            }
            if (this.dialogObj.Trequire == []) {
                this.$message.error('请选择关联需求');
                return;
            }
            if (this.dialogObj.task_type == '') {
                this.$message.error('请选择任务类型');
                return;
            }
            if (this.dialogObj.status == '') {
                this.$message.error('请选择状态');
                return;
            }
            if (this.dialogObj.task_stime == '') {
                this.$message.error('请选择开始时间');
                return;
            }
            if (this.dialogObj.task_etime == '') {
                this.$message.error('请选择结束时间');
                return;
            }
            if (this.dialogObj.tester == '') {
                this.$message.error('请选择指派人');
                return;
            }
            console.log('dialogObj:', this.dialogObj);
            this.btnLoading = true;
            if (this.title == '创建任务') {
                // this.dialogObj.start_and_end_time = this.dialogObj.start_time + '~' + this.dialogObj.end_time;
                console.log('dialogObj:', this.dialogObj);
                this.$api
                    .create_task(this.dialogObj)
                    .then((res) => {
                        console.log('res.results:', res.results);
                        if (res.code == 0) {
                            this.$message({
                                message: '创建任务成功',
                                type: 'success'
                            });
                            this.handleClose();
                            this.$set(this.params, 'page', 1);
                            // this.btnLoading = false;
                            this.getData();
                        } else {
                            this.btnLoading = false;
                            // this.$message.error(res.msg);
                        }
                    })
                    .catch((err) => {
                        this.btnLoading = false;
                        // this.$message.error(res.msg);
                    });
            } else {
                // this.dialogObj.start_and_end_time = this.dialogObj.start_time + '~' + this.dialogObj.end_time;
                console.log('dialogObj:', this.dialogObj);
                this.$api
                    .modify_tasktid(this.dialogObj)
                    .then((res) => {
                        console.log('res.results:', res.results);
                        if (res.code == 0) {
                            // this.$set(this.params, 'page', 1);
                            this.getData();
                            this.$message({
                                message: '修改任务成功',
                                type: 'success'
                            });
                            this.handleClose();
                            // this.btnLoading = false;
                        } else {
                            this.btnLoading = false;
                            // this.$message.error(res.msg);
                        }
                    })
                    .catch((err) => {
                        this.btnLoading = false;
                        // this.$message.error(res.msg);
                    });
            }
        },
        // 编辑
        onEdit(scope) {
            this.$api
                .project_name({})
                .then((res) => {
                    if (res.code == 0) {
                        this.projectList = res.result;
                        this.dialogObj.pid = scope.row.project_info.pid;
                        var array = [];
                        var require_info = [];
                        scope.row.tester.forEach((element) => {
                            array.push(element.uid.toString());
                        });
                        scope.row.require_info.forEach((element) => {
                            require_info.push(Number(element.zid));
                        });
                        this.changeProject(() => {
                            this.dialogObj.Trequire = [...require_info];
                            console.log('needList:', this.needList, this.dialogObj.Trequire);
                        });
                        this.title = '编辑任务';
                        this.dialogObj.task_name = scope.row.task_name;
                        this.dialogObj.task_desc = scope.row.task_desc;
                        this.dialogObj.task_type = scope.row.task_type.toString();
                        this.dialogObj.status = scope.row.status.toString();
                        this.dialogObj.tester = [...array];
                        this.dialogObj.remarks = scope.row.remarks;
                        // this.dialogObj.start_time = scope.row.start_and_end_time.split('~')[0];
                        // this.dialogObj.end_time = scope.row.start_and_end_time.split('~')[1];
                        this.dialogObj.task_stime = scope.row.task_stime;
                        this.dialogObj.task_etime = scope.row.task_etime;
                        // console.log('编辑任务:', this.dialogObj, scope.row.start_and_end_time.split('~'));
                        this.dialogObj.tid = scope.row.DID;
                        this.dialogVisible = true;
                        // this.dialogObj.task_name = scope.row.task_name
                    } else {
                        // this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    // this.$message.error(res.msg);
                });
        },
        // 删除
        onDel(scope) {
            console.log('scope:', scope);
            this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    let params = {
                        tids: [scope.row.DID]
                    };
                    this.$api.del_task(params).then((res) => {
                        if (res.code == 0) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.$set(this.params, 'page', 1);
                            this.getData();
                        }
                    });
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
        },
        changeStatus(data, num) {
            if (num == 0) {
                switch (data) {
                    case 0:
                        return 'info'; // "
                    case 1:
                        return ''; // '
                    case 2:
                        return 'success'; // `
                    case 3:
                        return 'success'; // (
                }
            } else {
                switch (data) {
                    case 0:
                        return '未开始'; // "
                    case 1:
                        return '已开始'; // '
                    case 2:
                        return '已完成'; // `
                    case 3:
                        return '未完成';
                    case 4:
                        return '超期完成'; // (
                    case 5:
                        return '超期未完成'; // (
                    // (
                }
            }
        },
        changeType(data) {
            switch (data) {
                case 0:
                    return '需求评审';
                case 1:
                    return '用例编写';
                case 2:
                    return '用例评审';
                case 3:
                    return '用例执行';
                case 4:
                    return '环境部署';
                case 5:
                    return '数据准备';
                case 6:
                    return '其他'; // (
            }
        },
        handleClose() {
            this.dialogVisible = false;
            this.userList = JSON.parse(localStorage.getItem('userList'));
        },
        // 重置
        onReload() {
            this.search_task = '';
            this.$set(this.params, 'page', 1);
            this.getData();
        },
        // 新增
        onAdd() {
            this.$api
                .project_name({})
                .then((res) => {
                    if (res.code == 0) {
                        this.projectList = res.result;
                    } else {
                        // this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    // this.$message.error(res.msg);
                });
            this.title = '创建任务';
            this.dialogVisible = true;
            this.dialogObj.task_name = '';
            // dialogObj.pid
            this.dialogObj.task_desc = '';
            this.dialogObj.task_type = '';
            this.dialogObj.task_stime = '';
            this.dialogObj.task_etime = '';
            this.dialogObj.status = '';
            this.dialogObj.tester = [];
            this.dialogObj.Trequire = [];
            this.dialogObj.remarks = '';
            this.dialogObj.pid = '';
        },
        getData() {
            // 项目检索状态+列表
            this.params.task_name = this.search_task;
            this.$api
                .search_task(this.params)
                .then((res) => {
                    console.log('res.results:', res.results);
                    if (res.results.code == 0) {
                        this.tableData = res.results.result;
                        this.pageTotal = res.count;
                        this.params.page_size = res.results.page_size;
                        this.btnLoading = false;
                    } else {
                        this.$message.error(res.msg);
                        this.btnLoading = false;
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                    this.btnLoading = false;
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
        /**
         * 过滤人员
         * @param {string} key 过滤字段
         */
        filterMember(key) {
            let params = { uname: key ? key : '' };
            this.$api.get_usernames(params).then((res) => {
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
                this.filterMember('');
            }
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
    .el-date-picker {
        margin-top: 10px;
    }
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
</style>
