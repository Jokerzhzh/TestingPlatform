<template>
    <div class="container">
        <div class="handle-box">
            <el-select width="100%" v-model="params.project" placeholder="请选择项目" @change="changeProject" filterable clearable>
                <el-option v-for="item in projectList" :key="item.pid" :label="item.pname" :value="item.pname"> </el-option>
            </el-select>
            <el-select
                width="100%"
                v-model="params.piter"
                :disabled="!params.project"
                placeholder="请选择迭代"
                @change="change"
                filterable
                clearable
            >
                <el-option v-for="item in iterationList" :key="item.id" :label="item.project_name" :value="item.project_name"> </el-option>
            </el-select>
            <el-input placeholder="任务集名称" v-model="params.task_name"> </el-input>
            <el-button style="marginleft: 20px" type="primary" @click="handleSearch">搜索</el-button>
            <el-button style="marginleft: 30px" @click="onReload">重置</el-button>
            <el-button type="primary" icon="el-icon-plus" class="handle-del button" @click="showAdd">添加任务集</el-button>
        </div>
        <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
            <el-table-column prop="id" label="ID" width="66" align="center"></el-table-column>
            <el-table-column prop="project" label="项目名称" align="center"></el-table-column>
            <el-table-column prop="piter" label="迭代名称" align="center"></el-table-column>
            <el-table-column prop="task_name" label="任务集名称" align="center"></el-table-column>
            <el-table-column prop="task_desc" label="任务集描述" align="center"></el-table-column>
            <el-table-column prop="exec_uname" label="执行人" align="center"></el-table-column>
            <!-- <el-table-column prop="status" label="任务集状态" align="center">
                <template slot-scope="scope">
                    <el-switch :disabled="true" v-model="scope.row.status"> </el-switch>
                </template>
            </el-table-column> -->
            <el-table-column label="操作" width="120" align="center">
                <template slot-scope="scope">
                    <el-button type="success" size="mini" icon="el-icon-lx-forward" @click="executeAutoTask(scope.row.id)">执行 </el-button>
                    <br />
                    <el-button style="margin-top: 5px" type="primary" size="mini" icon="el-icon-document" @click="handleDetails(scope.row)"
                        >详情
                    </el-button>
                    <br />
                    <el-button style="margin-top: 5px" type="warning" size="mini" icon="el-icon-edit-outline" @click="showModify(scope.row)"
                        >修改
                    </el-button>
                    <br />
                    <el-button
                        style="margin-top: 5px"
                        type="danger"
                        size="mini"
                        icon="el-icon-delete"
                        @click="handleDelete(scope.$index, scope.row)"
                        >删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                background
                @current-change="handleCurrentChange"
                :current-page="params.page"
                :page-size="params.size ? params.size : 5"
                layout="total, prev, pager, next, jumper"
                :total="pageTotal ? pageTotal : 0"
            ></el-pagination>
        </div>
        <!-- 添加流程 / 编辑流程 -->
        <el-dialog :title="title" :visible.sync="isShow" width="40%" :before-close="handleClose">
            <el-form :model="taskData" label-width="100px" :rules="rules" ref="ruleForm">
                <el-form-item label="项目名称" prop="project">
                    <el-select v-model="taskData.project" placeholder="请选择项目" @change="changeProject" filterable clearable>
                        <el-option v-for="item in projectList" :key="item.pid" :label="item.pname" :value="item.pname"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="项目迭代" prop="piter">
                    <el-select
                        :disabled="!this.taskData.project"
                        v-model="taskData.piter"
                        placeholder="请选择迭代"
                        @change="change"
                        filterable
                        clearable
                    >
                        <el-option v-for="item in iterationList" :key="item.id" :label="item.project_name" :value="item.project_name">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="任务集名称" prop="task_name">
                    <el-input placeholder="请输入任务集名称" v-model="taskData.task_name"> </el-input>
                </el-form-item>
                <el-form-item label="任务集描述" prop="task_desc">
                    <el-input placeholder="请输入任务集描述" v-model="taskData.task_desc"> </el-input>
                </el-form-item>
                <el-form-item label="执行人" prop="exec_uname">
                    <el-input placeholder="请输入执行人" v-model="taskData.exec_uname"> </el-input>
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
// 1.引入动画组件
import { Loading } from 'element-ui';
export default {
    data() {
        return {
            params: {
                page: 1,
                size: 10
            },
            pageTotal: 0,
            tableData: [], // 接口数据
            projectList: [], //项目数组
            iterationList: [], //迭代数组
            title: '',
            dialogShow: false,
            isShow: false,
            taskData: {
                project: '',
                piter: '',
                task_name: '',
                task_desc: '',
                exec_uname: ''
            },
            row: {}, //修改数据id,
            rules: {
                project: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
                piter: [{ required: true, message: '请输入迭代', trigger: 'blur' }],
                task_name: [{ required: true, message: '请输入任务集名称', trigger: 'blur' }]
            },
            // 2.定义实例
            loadingInstance: null
        };
    },
    created() {
        this.getList();
        this.getProjectName();
    },
    methods: {
        // 获取列表数据
        getList() {
            this.$api.uiTestTaskSetApi
                .query_task(this.params)
                .then((res) => {
                    if (res.results.code == 0) {
                        this.pageTotal = res.count;
                        this.tableData = res.results.result;
                    } else {
                        this.$message.error(res.results.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.results.msg);
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
                this.taskData.piter = '';
                this.iterationList = [];
            } else {
                // this.params.piter = '';
                this.getIterationList(e);
            }
        },
        // 选中项目获取迭代
        getIterationList(name) {
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
        // 打开添加弹窗
        showAdd() {
            this.title = '添加任务集';
            this.isShow = true;
            this.taskData = {
                project: '',
                piter: '',
                task_name: '',
                task_desc: '',
                exec_uname: '',
                status: 1 //任务集状态
            };
        },
        // 打开修改弹窗
        showModify(row) {
            this.title = '修改任务集';
            this.isShow = true;
            // 执行显示弹出层
            this.listIndex = index;
            // 获取当前的修改的内容项
            this.taskData.id = row.id;
            this.taskData.project = row.project;
            this.taskData.piter = row.piter;
            this.taskData.task_name = row.task_name;
            this.taskData.task_desc = row.task_desc;
            this.taskData.exec_uname = row.exec_uname;
            this.taskData.user = row.user;
        },
        // 提交 添加 / 编辑
        submit() {
            if (!this.taskData.project) {
                this.$message.error('请选择项目...');
                return;
            }
            if (!this.taskData.piter) {
                this.$message.error('请选择迭代...');
                return;
            }
            if (!this.taskData.task_name) {
                this.$message.error('请输入任务集名称...');
                return;
            }
            if (this.title == '添加任务集') {
                this.$api.uiTestTaskSetApi
                    .add_task(this.taskData)
                    .then((res) => {
                        if (res.code == 0) {
                            this.$message.success('添加成功！');
                            this.getList();
                            this.close();
                        } else {
                            this.$message.error(res.msg);
                        }
                    })
                    .catch((err) => {
                        this.$message.error(err.msg);
                    });
            } else {
                this.$api.uiTestTaskSetApi
                    .modify_task(this.taskData)
                    .then((res) => {
                        if (res.code == 0) {
                            this.$message.success('编辑成功！');
                            this.getList();
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
        // 执行任务集
        executeAutoTask(id) {
            // 3. 生成动画
            this.loadingInstance = Loading.service({
                // 动画中的文字
                text: '执行中，请耐心等待',
                // 要加载动画的容器
                target: '.table'
            });
            console.log(id);
            let params = {
                tids: [id]
            };
            this.$api
                .execute_auto_task(params)
                .then((res) => {
                    if (res.code == 0) {
                        this.$message.success('执行成功！');
                        // 4. 请求完成后关闭动画
                        this.loadingInstance.close();
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(err.msg);
                });
        },
        // 重置查询步骤
        onReload() {
            this.params = {
                project: '', //项目
                piter: '', //迭代
                task_name: '' //任务集名称
            };
            this.getList();
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.params, 'page', 1);
            this.getList();
        },
        change() {
            this.$forceUpdate();
        },
        // 二次确认关闭
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then((_) => {
                    done();
                })
                .catch((_) => {});
        },

        handleDelete(index, row) {
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(async () => {
                    let res = await this.$api.uiTestTaskSetApi.delete_task({ ids: [row.id] });
                    if (res.code == 0) {
                        this.$message({
                            message: res.msg,
                            type: 'success'
                        });
                        this.handleSearch();
                    } else {
                        this.$message({
                            message: res.msg,
                            type: 'error'
                        });
                    }
                })
                .catch(() => {});
        },
        // 分页导航
        handleCurrentChange(val) {
            this.params.page = val;
            this.getList(this.form);
        },
        //详情
        handleDetails(row) {
            this.$router.push({ path: '/uiTestTaskSetDetals', query: { id: row.id } });
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
.el-table {
    width: 100%;
    font-size: 14px;
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
</style>
