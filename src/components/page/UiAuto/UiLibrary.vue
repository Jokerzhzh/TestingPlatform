<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-select width="100%" v-model="params.project" placeholder="请选择项目" @change="changeProject" filterable clearable>
                    <el-option v-for="item in projectList" :key="item.pid" :label="item.pname" :value="item.pname"> </el-option>
                </el-select>
                <el-select
                    width="100%"
                    :disabled="!this.params.project"
                    v-model="params.piter"
                    placeholder="请选择迭代"
                    @change="change"
                    filterable
                    clearable
                >
                    <el-option v-for="item in iterationList" :key="item.id" :label="item.project_name" :value="item.project_name">
                    </el-option>
                </el-select>
                <el-input placeholder="请输入页面名称" v-model="params.page_name"> </el-input>
                <el-input placeholder="请输入元素名称" v-model="params.element_name"> </el-input>
                <el-input placeholder="请输入版本" v-model="params.version"> </el-input>
                <el-button type="primary" @click="handleSearch()">搜索</el-button>
                <el-button @click="onReload()">重置</el-button>
                <el-button type="primary" icon="el-icon-plus" class="handle-del button" @click="showAdd()">添加元素</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column prop="id" label="ID" width="66" align="center"></el-table-column>
                <el-table-column prop="project" label="项目名称" align="center"></el-table-column>
                <el-table-column prop="piter" label="迭代名称" align="center"></el-table-column>
                <el-table-column prop="page_name" label="页面名称" align="center"></el-table-column>
                <el-table-column prop="element_name" label="元素名称" align="center"></el-table-column>
                <el-table-column prop="fix_method" label="定位方式" align="center"></el-table-column>
                <el-table-column prop="action_info" label="定位置" align="center"></el-table-column>
                <!-- <el-table-column prop="status" label="状态" align="center">
                    <template slot-scope="scope">
                        <el-switch :disabled="true" v-model="scope.row.status"> </el-switch>
                    </template>
                </el-table-column> -->
                <el-table-column prop="version" label="版本" align="center"></el-table-column>
                <el-table-column label="操作" width="120" align="center">
                    <template slot-scope="scope">
                        <el-button type="warning" size="mini" icon="el-icon-edit-outline" @click="showModify(scope.row)">修改 </el-button>
                        <br />
                        <el-button
                            style="margin-top: 5px"
                            type="danger"
                            size="mini"
                            icon="el-icon-delete"
                            @click="deleteLibrary(scope.row.id)"
                        >
                            删除
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
        <!-- 添加元素 / 编辑元素 -->
        <el-dialog :title="title" :visible.sync="isShow" width="40%" :before-close="handleClose">
            <el-form :model="libraryData" label-width="100px" :rules="rules" ref="ruleForm">
                <el-form-item label="项目名称" prop="project">
                    <el-select v-model="libraryData.project" placeholder="请选择项目" @change="changeProject" filterable clearable>
                        <el-option v-for="item in projectList" :key="item.pid" :label="item.pname" :value="item.pname"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="项目迭代" prop="piter">
                    <el-select
                        :disabled="!this.libraryData.project"
                        v-model="libraryData.piter"
                        placeholder="请选择迭代"
                        @change="change"
                        filterable
                        clearable
                    >
                        <el-option v-for="item in iterationList" :key="item.id" :label="item.project_name" :value="item.project_name">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="页面名称" prop="page_name">
                    <el-input placeholder="请输入页面名称" v-model="libraryData.page_name"> </el-input>
                </el-form-item>
                <el-form-item label="元素名称" prop="element_name">
                    <el-input placeholder="请输入元素名称" v-model="libraryData.element_name"> </el-input>
                </el-form-item>
                <el-form-item label="定位方式" prop="fix_method">
                    <el-input placeholder="请输入定位方式" v-model="libraryData.fix_method"> </el-input>
                </el-form-item>
                <el-form-item label="定位值" prop="action_info">
                    <el-input placeholder="请输入定位值" v-model="libraryData.action_info"> </el-input>
                </el-form-item>
                <el-form-item label="版本" prop="version">
                    <el-input placeholder="请输入版本" v-model="libraryData.version"> </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="close">取 消</el-button>
                <el-button type="primary" @click="submit()">确 定</el-button>
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
                size: 10
            },
            tableData: [], // 接口数据
            projectList: [],
            iterationList: [],
            pageTotal: 0, // 分页数据长度
            paginationIndex: 1, //分页默认 第1页
            libraryData: {
                project: '',
                piter: '',
                page_name: '',
                element_name: '',
                fix_method: '',
                action_info: '',
                version: '',
                status: 0
            },
            title: '',
            isShow: false,
            rules: {
                project: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
                piter: [{ required: true, message: '请输入迭代', trigger: 'blur' }],
                page_name: [{ required: true, message: '请输入页面名称', trigger: 'blur' }],
                element_name: [{ required: true, message: '请输入元素名', trigger: 'blur' }],
                fix_method: [{ required: true, message: '请输入定位方式', trigger: 'blur' }],
                action_info: [{ required: true, message: '请输入定位值', trigger: 'blur' }],
                version: [{ required: true, message: '请输入版本', trigger: 'blur' }]
            }
        };
    },
    created() {
        console.log('初次进入页面渲染接口数据');
        this.searchElement();
        this.getProjectName();
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
        // 查询
        searchElement() {
            this.$api.uiLibraryApi
                .search_element(this.params)
                .then((res) => {
                    if (res.results.code == 0) {
                        this.tableData = res.results.data;
                        this.pageTotal = res.count;
                    } else {
                        this.$message.error(res.results.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(err.results.msg);
                });
        },
        // 打开添加弹窗
        showAdd() {
            this.title = '添加元素';
            this.isShow = true;
            this.libraryData = {
                project: '',
                piter: '',
                page_name: '',
                element_name: '',
                fix_method: '',
                action_info: '',
                version: '',
                status: 0
            };
        },
        // 打开编辑弹窗
        showModify(row) {
            this.title = '编辑元素';
            this.isShow = true;
            // 执行显示弹出层
            this.listIndex = index;
            // 获取当前的修改的内容项
            this.libraryData.id = row.id;
            this.libraryData.project = row.project;
            this.libraryData.piter = row.piter;
            this.libraryData.page_name = row.page_name;
            this.libraryData.element_name = row.element_name;
            this.libraryData.fix_method = row.fix_method;
            this.libraryData.action_info = row.action_info;
            this.libraryData.version = row.version;
        },
        // 提交 添加 / 编辑
        submit() {
            if (!this.libraryData.project) {
                this.$message.error('请选择项目...');
                return;
            }
            if (!this.libraryData.piter) {
                this.$message.error('请选择迭代...');
                return;
            }
            if (!this.libraryData.page_name) {
                this.$message.error('请输入页面名称...');
                return;
            }
            if (!this.libraryData.element_name) {
                this.$message.error('请输入元素名称...');
                return;
            }
            if (!this.libraryData.fix_method) {
                this.$message.error('请输入定位方式...');
                return;
            }
            if (!this.libraryData.action_info) {
                this.$message.error('请输入定位值...');
                return;
            }
            if (!this.libraryData.version) {
                this.$message.error('请输入版本...');
                return;
            }
            if (this.title == '添加元素') {
                this.$api.uiLibraryApi
                    .add_element(this.libraryData)
                    .then((res) => {
                        if (res.code == 0) {
                            this.$message.success('添加成功！');
                            this.searchElement();
                            this.close();
                        } else {
                            this.$message.error(res.msg);
                        }
                    })
                    .catch((err) => {
                        this.$message.error(err.msg);
                    });
            } else {
                this.$api.uiLibraryApi
                    .updata_element(this.libraryData)
                    .then((res) => {
                        if (res.code == 0) {
                            this.$message.success('编辑成功！');
                            this.searchElement();
                            this.close();
                        } else {
                            this.$message.error(res.msg);
                        }
                    })
                    .catch((err) => {
                        this.$message.error(err.msg);
                    });
            }
        },
        // 关闭弹窗
        close() {
            this.isShow = false;
        },
        // 删除
        deleteLibrary(id) {
            this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    let params = {
                        element_id: id
                    };
                    this.$api.uiLibraryApi
                        .delete_element(params)
                        .then((res) => {
                            if (res.code == 0) {
                                this.$message.success('删除成功！');
                                this.handleSearch();
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
        // 获取项目名称
        getProjectName() {
            this.$forceUpdate();
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
                    this.$message.error(res.msg);
                });
        },
        // 监听选择项目
        changeProject(e) {
            this.params.piter = '';
            if (!e) {
                this.params.piter = '';
                this.iterationList = [];
            } else {
                // this.params.piter = '';
                this.getIterationList(e);
            }
        },
        // 选中项目获取迭代
        getIterationList(name) {
            this.$forceUpdate();
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
        },
        // 二次确认关闭
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then((_) => {
                    done();
                })
                .catch((_) => {});
        },
        // 重置查询步骤
        onReload() {
            this.params = {};
            this.handleSearch();
        },
        // 触发搜索按钮
        handleSearch() {
            console.log(this.params, '获取搜索数据');
            this.$set(this.params, 'page', 1);
            this.searchElement();
        },
        // 分页导航
        handlePageChange(val) {
            this.paginationIndex = val;
            this.$set(this.params, 'page', val);
            this.searchElement();
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
    // margin-top: 10px;
    // margin-bottom: 20px;
    width: 128%;
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
.el-dialog {
    .el-select {
        width: 95%;
        margin-right: 10px;
    }
    .el-input {
        width: 95%;
        margin-right: 10px;
    }
    .choice {
        margin-top: 0px;
        // margin-left: 10px;
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
    }
    .el-select {
        width: 150px;
        margin-right: 10px;
    }
    .el-button {
        margin-right: 0px;
    }
}
.table {
    width: 100%;
    font-size: 14px;
}
</style>
