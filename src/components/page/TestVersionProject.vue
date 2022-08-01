<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <!-- <span class="public-title">项目:</span> -->
                <el-select v-model="params.parent_project" placeholder="请选择项目" class="public-form">
                    <el-option v-for="item in projectsName" :key="item.pid" :label="item.pname" :value="item.pid"></el-option>
                </el-select>
                <el-input style="margin-right: 20px" v-model="project_name" placeholder="请输入迭代名称"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" @click="onAdd">新增</el-button>
                <el-button type="warn" @click="onReload">重置</el-button>
                <!-- <el-button type="primary" @click="onSynchro">同步</el-button> -->
            </div>
            <el-table :data="tableData" border size="mini" class="table" ref="multipleTable">
                <el-table-column label="序号" type="index" width="50" align="center">
                    <template slot-scope="scope">
                        <span>{{ (params.page - 1) * params.page_size + scope.$index + 1 }}</span>
                        <!-- <span>{{scope.$index + 1}}</span> -->
                    </template>
                </el-table-column>
                <el-table-column prop="id" label="迭代ID" width="66" align="center">
                    <template slot-scope="scope">{{ scope.row.id }}</template>
                </el-table-column>
                <el-table-column prop="big_projectname" label="项目名称" width="160" align="center">
                    <template slot-scope="scope">{{ scope.row.bigproject_info.big_projectname }}</template>
                </el-table-column>
                <el-table-column prop="project_name" label="迭代名称" width="150"></el-table-column>
                <el-table-column label="查看需求" width="120">
                    <template slot-scope="scope">
                        <el-button type="primary" plain @click="checkDetails(scope)">查看详情</el-button>
                        <!-- <el-tag style="margin-right:5px" v-for="(item,index) in scope.row.rname" :key="index">{{item.rname}}</el-tag> -->
                    </template>
                </el-table-column>
                <el-table-column label="迭代状态" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.status == 1 ? 'success' : scope.row.status == 2 ? '' : 'info'">
                            {{ scope.row.status == 1 ? '已立项' : scope.row.status == 2 ? '进行中' : '已结束' }}
                        </el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="date" label="创建时间" align="center" width="180">
                    <template slot-scope="scope">{{ scope.row.create_time }}</template>
                </el-table-column>
                <el-table-column prop="date" label="更新时间" align="center" width="180">
                    <template slot-scope="scope">{{ scope.row.update_time }}</template>
                </el-table-column>

                <el-table-column label="创建人" prop="creator"></el-table-column>

                <el-table-column label="负责人" width="200">
                    <template slot-scope="scope">
                        <el-tag style="margin-right: 5px" v-for="(item, index) in scope.row.tester" :key="index">{{
                            item.username
                        }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="备注" width="300">
                    <template slot-scope="scope">
                        <textarea
                            style="width: 100%; height: 50px; resize: none; outline: none; border: none"
                            disabled
                            v-model="scope.row.remarks"
                        />
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="150" fixed="right">
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
        <!-- 查看详情 -->

        <el-dialog :visible.sync="dialogdetailsVisible" title="需求详情" width="80%">
            <el-table :data="needData" border size="mini" class="table" ref="multipleTable">
                <el-table-column prop="ZID" label="需求ID" width="66" align="center"></el-table-column>

                <el-table-column label="需求状态" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.status == 1 ? 'success' : scope.row.status == 2 ? '' : 'info'">
                            {{ scope.row.status == 1 ? '已立项' : scope.row.status == 2 ? '进行中' : '已结束' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="date" label="创建时间" align="center" width="300">
                    <template slot-scope="scope">{{ scope.row.create_time }}</template>
                </el-table-column>
                <el-table-column label="负责人" width="200">
                    <template slot-scope="scope">
                        <el-tag style="margin-right: 5px" v-for="(item, index) in scope.row.tester" :key="index">{{
                            item.username
                        }}</el-tag>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogdetailsVisible = false">关 闭</el-button>
            </span>
        </el-dialog>

        <!-- 新增编辑 弹窗 -->
        <el-dialog :title="title" :visible.sync="dialogVisible" width="80%" :before-close="handleClose">
            <div class="public-dialog">
                <el-card class="box-card">
                    <div class="box-line">
                        <input type="text" placeholder="请输入名称" v-model="dialogObj.project_name" class="project-input" />
                    </div>
                    <textarea v-model="dialogObj.project_desc" class="textarea-input" />
                </el-card>

                <el-card class="box-input-card">
                    <el-form status-icon label-width="80px" class="demo-ruleForm" :model="dialogObj" :rules="rules">
                        <el-form-item label="项目" :rules="[{ required: true, message: '请选择项目', trigger: 'blur' }]">
                            <el-select v-model="dialogObj.be_bigproject_name" placeholder="请选择项目" @change="changeBeBigprojectName">
                                <el-option v-for="item in projectsName" :key="item.pid" :label="item.pname" :value="item.pname"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="项目状态" :rules="[{ required: true, message: '请选择项目状态', trigger: 'blur' }]">
                            <el-select v-model="dialogObj.status" placeholder="请选择活动区域">
                                <el-option label="已立项" :value="1" key="1"></el-option>
                                <el-option label="进行中" :value="2" key="2"></el-option>
                                <el-option label="已结束" :value="3" key="3"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="创建人" prop="creator">
                            <el-input type="text" autocomplete="off" v-model="dialogObj.creator"></el-input>
                        </el-form-item>
                        <el-form-item label="负责人" prop="age" :rules="[{ required: true, message: '请选择负责人', trigger: 'blur' }]">
                            <el-select
                                v-model="dialogObj.tester"
                                :filter-method="filterMember"
                                @visible-change="visibleSelect"
                                filterable
                                multiple
                                collapse-tags
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

                        <el-form-item label="备注" prop="desc">
                            <textarea class="textarea-input" v-model="dialogObj.remarks" style="height: 150px; margin-top: 0px" />
                        </el-form-item>
                    </el-form>
                </el-card>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose()">取 消</el-button>
                <el-button type="primary" @click="onSubmit">提 交</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'basetable',
    data() {
        return {
            rules: {
                creator: [{ required: true, message: '请输入内容', trigger: 'blur' }]
            },
            needData: '',
            dialogdetailsVisible: false,
            params: {
                page: 1,
                page_size: 10,
                project_name: '',
                parent_project: ''
            },
            project_name: '',
            dialogVisible: false,
            title: '创建项目',
            projectsName: [], // 项目名称搜索
            tableData: [], // 列表数据
            pageTotal: 0, // 数据总条数
            disabled: false,
            dialogObj: {
                be_bigproject_name: '',
                be_bigproject: '',
                project_name: '',
                project_desc: '',
                creator: '',
                tester: [],
                status: '',
                remarks: '',
                id: ''
            },
            userList: []
        };
    },
    created() {
        this.getData();
    },
    mounted() {
        // 绑定enter事件
        document.addEventListener('keyup', this.enterKey);
        this.userList = JSON.parse(localStorage.getItem('userList'));
        this.getProjectName();
        // console.log('userList:',JSON.parse(this.userList))
    },
    destroyed() {
        // 销毁enter事件
        document.removeEventListener('keyup', this.enterKey);
    },
    methods: {
        // 监听项目选择
        changeBeBigprojectName(e) {
            this.projectsName.forEach((item) => {
                if (item.pname == e) {
                    this.dialogObj.be_bigproject = item.pid;
                    this.dialogObj.be_bigproject_name = e;
                }
            });
        },
        // 查看详情
        checkDetails(data) {
            this.$api
                .need_project({ belong_project: data.row.id })
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
        onSubmit() {
            console.log('dialogObj::', this.dialogObj);
            // 新增

            if (this.title == '创建项目') {
                this.$api
                    .create_project(this.dialogObj)
                    .then((res) => {
                        if (res.code == 0) {
                            this.$message({
                                message: '创建项目成功',
                                type: 'success'
                            });
                            this.project_name = '';
                            this.$set(this.params, 'page', 1);
                            this.getData();
                            this.handleClose();
                        } else {
                            this.$message.error(res.msg);
                        }
                    })
                    .catch((err) => {
                        this.$message.error(res.msg);
                    });
            } else {
                this.$api
                    .modify_project(this.dialogObj)
                    .then((res) => {
                        if (res.code == 0) {
                            this.$message({
                                message: '编辑成功',
                                type: 'success'
                            });
                            this.getData();
                            this.handleClose();
                        } else {
                            this.$message.error(res.msg);
                        }
                    })
                    .catch((err) => {
                        this.$message.error(res.msg);
                    });
            }
        },
        handleClose() {
            this.dialogVisible = false;
            this.userList = JSON.parse(localStorage.getItem('userList'));
        },
        // 编辑
        onEdit(scope) {
            var array = [];
            scope.row.tester.forEach((element) => {
                array.push(element.uid.toString());
            });
            this.title = '编辑项目';
            this.dialogObj.be_bigproject_name = scope.row.bigproject_info.big_projectname;
            // this.dialogObj.be_bigproject = scope.row.bigproject_info.bid;
            this.dialogObj.project_name = scope.row.project_name;
            this.dialogObj.project_desc = scope.row.project_desc;
            this.dialogObj.remarks = scope.row.remarks;
            this.dialogObj.status = scope.row.status;
            this.dialogObj.creator = scope.row.creator;
            this.dialogObj.id = scope.row.id;
            this.dialogObj.tester = [...array];
            this.dialogVisible = true;
            console.log('dialogObj:', this.dialogObj);
        },
        // 新增
        onAdd() {
            this.title = '创建项目';
            this.dialogObj.be_bigproject = '';
            this.dialogObj.project_name = '';
            this.dialogObj.project_desc = '';
            this.dialogObj.remarks = '';
            this.dialogObj.tester = [];
            this.dialogObj.status = '';
            this.dialogObj.creator = '';
            this.dialogVisible = true;
        },
        onSynchro() {
            // sync_jira_projec
            this.$api.sync_jira_projec({}).then((res) => {
                if (res.code == 0) {
                    this.$message.success(res.msg);
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        // 获取数据
        getData() {
            // 项目检索状态+列表
            this.params.project_name = this.project_name;
            console.log(this.params, 22);
            this.$api
                .on_search_project(this.params)
                .then((res) => {
                    if (res.results.code == 0) {
                        this.tableData = res.results.result;
                        this.pageTotal = res.count;
                        this.params.page_size = res.results.page_size;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {});
        },
        onReload() {
            this.params.parent_project = '';
            this.project_name = '';
            this.getData();
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
                        pids: [scope.row.id]
                    };
                    this.$api.delete_project(params).then((res) => {
                        if (res.code == 0) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.project_name = '';
                            // this.$set(this.params, 'page', 1);
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

        // // 全局回车搜索
        // enterKey(event){
        //     const code = event.keyCode;
        //     const path = this.$route.path;
        //     if (code == 13 && path == '/testProject') {
        //         this.handleSearch();
        //     }
        // },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.params, 'page', 1);
            this.getData();
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
                this.userList = JSON.parse(localStorage.getItem('userList'));
            }
        },
        getProjectName() {
            // 获取项目名称
            this.$api.apiChart
                .projectName({})
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
    width: 300px;
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
    width: 90%;
    font-size: 14px;
}
.textarea-input {
    width: 100%;
    height: 400px;
    margin-top: 20px;
    outline: none;
    border: 1px solid #cccccc;
    padding: 5px 10px;
    box-sizing: border-box;
}
.public-form {
    margin: 0 20px 0 10px;
}
.public-title {
    font-size: 14px;
    font-weight: 400;
}
</style>
