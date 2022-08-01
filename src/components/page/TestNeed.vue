<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-input style="margin-right: 20px" placeholder="请输需求标题" v-model="rname"></el-input>
                <span class="public-title">项目:</span>
                <el-select v-model="bigproject_id" placeholder="请选择项目" class="public-form">
                    <el-option v-for="item in projectsName" :key="item.pid" :label="item.pname" :value="item.pname"></el-option>
                </el-select>
                <el-input style="margin-right: 20px" placeholder="请输入迭代项目ID" v-model="project_id"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" @click="onAdd">新增</el-button>
                <!-- <el-button type="primary" @click="onAdd">导入</el-button> -->
                <el-button type="warn" @click="onReload">重置</el-button>
            </div>
            <el-table :data="tableData" border size="mini" class="table" ref="multipleTable">
                <el-table-column prop="ZID" label="需求ID" width="66" align="center"></el-table-column>
                <el-table-column prop="rname" label="需求标题" width="150"></el-table-column>
                <el-table-column label="所属项目" prop="belong_project" align="center"></el-table-column>
                <el-table-column label="优先级" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.level == '0' ? 'danger' : scope.row.level == '1' ? 'success' : ''">
                            {{ scope.row.level == '0' ? '高' : scope.row.level == '1' ? '中' : '低' }}
                        </el-tag>
                    </template>
                </el-table-column>

                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <el-tag type>{{ changeStatus(scope.row.status) }}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column width="220" label="创建时间" align="center">
                    <template slot-scope="scope">{{ scope.row.create_time }}</template>
                </el-table-column>
                <el-table-column width="220" label="更新时间" align="center">
                    <template slot-scope="scope">{{ scope.row.update_time }}</template>
                </el-table-column>

                <el-table-column label="处理人" width="240">
                    <template slot-scope="scope">
                        <el-tag style="margin-right: 5px" v-for="(item, index) in scope.row.tester" :key="index">{{
                            item.username
                        }}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column label="备注" width="200">
                    <template slot-scope="scope">{{ scope.row.remarks }}</template>
                </el-table-column>

                <el-table-column label="操作" width="200" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="onEditor(scope)">编辑</el-button>
                        <el-button type="danger" @click="onDel(scope)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next,jumper"
                    :current-page="params.page"
                    :page-size="params.size"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <el-dialog :title="title" :visible.sync="dialogVisible" width="80%" :before-close="handleClose">
            <div class="public-dialog">
                <el-card class="box-card">
                    <div class="box-line">
                        <input v-model="dialogObj.rname" type="text" placeholder="请输入名称" class="project-input" style="width: 80%" />
                    </div>
                    <textarea v-model="dialogObj.require_desc" class="textarea-input" style="margin-top: 20px" />
                </el-card>

                <el-card class="box-input-card">
                    <el-form status-icon label-width="100px" class="demo-ruleForm">
                        <el-form-item label="所属迭代" :rules="[{ required: true, message: '请选择关联迭代', trigger: 'blur' }]">
                            <el-select
                                placeholder="请选择关联迭代"
                                filterable
                                v-model="dialogObj.belong_project"
                                @visible-change="visibleProjectSelect"
                            >
                                <el-option
                                    v-for="(item, index) in projectList"
                                    :key="index"
                                    :label="item.project_name"
                                    :value="item.id"
                                ></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="优先级" :rules="[{ required: true, message: '请选择优先级', trigger: 'blur' }]">
                            <el-select placeholder="请选择活动区域" v-model="dialogObj.level">
                                <el-option label="高" value="0"></el-option>
                                <el-option label="中" value="1"></el-option>
                                <el-option label="低" value="2"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="需求标识">
                            <el-input type="text" v-model="dialogObj.rid" placeholder="请输入需求配置"></el-input>
                        </el-form-item>

                        <el-form-item label="状态" :rules="[{ required: true, message: '请选择状态', trigger: 'blur' }]">
                            <el-select placeholder="请选择状态" v-model="dialogObj.status">
                                <el-option label="待宣讲" value="0"></el-option>
                                <el-option label="待评审" value="1"></el-option>
                                <el-option label="评审通过" value="2"></el-option>
                                <el-option label="评审未通过" value="3"></el-option>
                                <el-option label="待测试" value="4"></el-option>
                                <el-option label="待验收" value="5"></el-option>
                                <el-option label="待上线" value="6"></el-option>
                                <el-option label="已投产" value="7"></el-option>
                                <el-option label="带伤上线" value="8"></el-option>
                                <el-option label="测试中" value="9"></el-option>
                                <el-option label="测试未通过" value="10"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="处理人" :rules="[{ required: true, message: '请输入处理人', trigger: 'blur' }]">
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
                        <el-form-item label="超链接" :rules="[{ required: true, message: '请输入超链接', trigger: 'blur' }]">
                            <el-input type="text" v-model="dialogObj.ridLink"></el-input>
                        </el-form-item>
                        <el-form-item label="备注">
                            <textarea class="textarea-input" style="height: 150px" v-model="dialogObj.remarks" />
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
            projectList: [],
            params: {
                page: 1,
                size: 10,
                belong_project: '',
                rname: ''
            },
            rname: '',
            project_id: '', //搜索项目ID 迭代
            bigproject_id: '', // 项目id
            dialogVisible: false,
            title: '创建需求',
            projectsName: [], // 项目名称搜索
            tableData: [], // 列表数据
            pageTotal: 0, // 数据总条数
            disabled: false,
            userList: [],
            dialogObj: {
                tester: [],
                rname: '',
                ridLink: '',
                level: '',
                status: '',
                rid: '',
                require_desc: '',
                remarks: '',
                belong_project: ''
            }
        };
    },
    created() {
        this.getData();
        this.getProjectName();
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
        // 删除
        onDel(scope) {
            this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.$api
                        .del_need({ zid: [scope.row.ZID] })
                        .then((res) => {
                            if (res.code == 0) {
                                this.$message({
                                    message: '需求删除成功',
                                    type: 'success'
                                });
                                // this.$set(this.params, 'page', 1);
                                this.getData();
                            } else {
                                // this.$message.error(res.msg);
                            }
                        })
                        .catch((err) => {
                            // this.$message.error(res.msg);
                        });
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
        },
        // 编辑
        onEditor(scope) {
            console.log('scope:', scope);
            this.title = '编辑需求';
            // this.dialogObj.tester = [],
            // this.dialogVisible = true;
            this.$api
                .search_project({})
                .then((res) => {
                    if (res.code == 0) {
                        var array = [];
                        scope.row.tester.forEach((element) => {
                            array.push(element.id.toString());
                        });
                        this.projectList = res.result;
                        this.dialogObj.rname = scope.row.rname;
                        this.dialogObj.ridLink = scope.row.ridLink;
                        this.dialogObj.ZID = scope.row.ZID;
                        this.dialogObj.status = scope.row.status.toString();
                        this.dialogObj.belong_project = scope.row.belong_project;
                        this.dialogObj.require_desc = scope.row.require_desc;
                        this.dialogObj.remarks = scope.row.remarks;
                        this.dialogObj.level = scope.row.level.toString();
                        this.dialogObj.tester = [...array];
                        this.dialogObj.rid = scope.row.rid;
                        this.dialogVisible = true;
                    } else {
                        // this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    // this.$message.error(res.msg);
                });
            console.log('scope:', scope);
        },
        // 提交
        onSubmit() {
            if (this.title == '创建需求') {
                let params = { ...this.dialogObj };
                params.tester = params.tester.length == 1 ? params.tester[0] : params.tester.join(',');
                console.log('params:', params);
                this.$api
                    .add_need(params)
                    .then((res) => {
                        console.log('res.results:', res.results);
                        if (res.code == 0) {
                            this.$message({
                                message: '创建需求成功',
                                type: 'success'
                            });
                            this.handleClose();
                            this.$set(this.params, 'page', 1);
                            this.getData();
                        } else {
                            // this.$message.error(res.msg);
                        }
                    })
                    .catch((err) => {
                        // this.$message.error(res.msg);
                    });
            } else {
                let params = { ...this.dialogObj };
                console.log('???', params);
                this.$api
                    .edit_need(params)
                    .then((res) => {
                        console.log('res.results:', res.results);
                        if (res.code == 0) {
                            this.$message({
                                message: '修改需求成功',
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
        changeStatus(data) {
            switch (data) {
                case 0:
                    return '待宣讲'; // "
                case 1:
                    return '待评审'; // '
                case 2:
                    return '评审通过'; // `
                case 3:
                    return '评审未通过';
                case 4:
                    return '待测试';
                case 5:
                    return '待验收';
                case 6:
                    return '待上线';
                case 7:
                    return '已投产';
                case 8:
                    return '带伤上线';
                case 9:
                    return '测试中';
                case 10:
                    return '测试未通过';
            }
        },
        handleClose() {
            this.dialogVisible = false;
            this.userList = JSON.parse(localStorage.getItem('userList'));
        },
        // 重置
        onReload() {
            this.rname = '';
            this.project_id = '';
            this.bigproject_id = '';
            this.$set(this.params, 'page', 1);
            this.getData();
        },
        // 新增
        onAdd() {
            this.$api
                .search_project({})
                .then((res) => {
                    console.log(res);
                    if (res.code == 0) {
                        this.projectList = res.result;
                    } else {
                        // this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    // this.$message.error(res.msg);
                });
            this.dialogObj.tester = [];
            this.dialogObj.rname = '';
            this.dialogObj.ridLink = '';
            this.dialogObj.status = '';
            this.dialogObj.belong_project = '';
            this.dialogObj.require_desc = '';
            this.dialogObj.remarks = '';
            this.dialogObj.level = '';
            this.dialogObj.rid = '';
            this.title = '创建需求';
            this.dialogVisible = true;
        },
        getData() {
            // 项目检索状态+列表
            this.params.rname = this.rname;
            this.params.belong_project = this.project_id;
            this.params.belong_bigproject = this.bigproject_id;
            this.$api
                .need_project(this.params)
                .then((res) => {
                    if (res.results.code == 0) {
                        this.tableData = res.results.data;
                        this.pageTotal = res.count;
                        this.params.size = res.results.page_size;
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
        },
        /**
         * @param {String}  // 过滤字段
         */
        filterProject(key) {
            let params = { project_name: key ? key : '' };
            this.$api.search_project(params).then((res) => {
                if (res.code == 0) {
                    this.projectList = res.result;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        /**
         * 下拉框隐藏重置人员列表
         * @param {bool} type 隐藏/显示
         */
        visibleProjectSelect(type) {
            if (!type) {
                this.filterProject('');
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
.public-form {
    margin: 0 20px 0 10px;
}
.public-title {
    font-size: 14px;
    font-weight: 400;
}
</style>
