<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-button-group>
                    <el-button type="primary" icon="el-icon-delete" class="handle-del mr10" @click="delAllSelection">批量删除</el-button>
                    <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addTaskSet">新增任务集</el-button>
                    <el-button type="primary" icon="el-icon-lx-forward" class="handle-del mr10" @click="onCarryOut">执行任务集</el-button>
                    <el-button type="primary" icon="el-icon-lx-time" class="handle-del mr10" @click="onTimedTask">定时任务</el-button>
                </el-button-group>
                <el-input v-model="taskSetName" placeholder="请输入任务名称" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <!-- <el-button type="primary" @click="open">打开</el-button>
                <el-button type="primary" @click="close">关闭</el-button> -->
            </div>

            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="用例ID" width="75" align="center">
                    <template slot-scope="scope">{{ scope.row.id }}</template>
                </el-table-column>
                <el-table-column prop="tapd_unique" label="tapd_unique">
                    <template slot-scope="scope">{{ scope.row.tapd_unique }}</template>
                </el-table-column>
                <el-table-column prop="name" label="任务名称">
                    <template slot-scope="scope">{{ scope.row.task_name }}</template>
                </el-table-column>
                <el-table-column label="执行人员">
                    <template slot-scope="scope">{{ scope.row.exec_uname }}</template>
                </el-table-column>
                <el-table-column label="执行地址">
                    <template slot-scope="scope">{{ scope.row.env_addr }}</template>
                </el-table-column>
                <el-table-column label="数据库环境" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.db }}
                    </template>
                </el-table-column>
                <el-table-column label="任务状态" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.status == true ? 'success' : 'danger'">{{
                            scope.row.status == true ? '已启用' : '已禁用'
                        }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="定时任务状态" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.flag == true ? 'success' : 'danger'">{{
                            scope.row.flag == true ? '定时任务已开启' : '定时任务已关闭'
                        }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120" align="center">
                    <template slot-scope="scope">
                        <el-button
                            style="margin-top: 5px"
                            type="success"
                            size="mini"
                            icon="el-icon-document"
                            @click="handleDetails(scope.$index, scope.row)"
                            >详情</el-button
                        ><br />
                        <el-button
                            style="margin-top: 5px"
                            type="warning"
                            size="mini"
                            icon="el-icon-edit-outline"
                            @click="handleEdit(scope.$index, scope.row)"
                            >修改</el-button
                        ><br />
                        <el-button
                            style="margin-top: 5px"
                            type="danger"
                            size="mini"
                            icon="el-icon-delete"
                            @click="handleDelete(scope.$index, scope.row)"
                            >删除</el-button
                        >
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
        <!-- 新增任务集 弹层组件 -->
        <addTaskSetComponents
            :addTaskSetDialog.sync="addTaskSetDialog"
            @getTaskSet="getTaskSet"
            @closeDialog="closeHandle"
        ></addTaskSetComponents>
        <!-- 定时任务 弹层组件 -->
        <timedTaskComponents
            :showTimedTask.sync="showTimedTask"
            @getTimedTask="getTimedTask"
            @closeDialog="closeHandle"
        ></timedTaskComponents>
        <!-- 执行 弹层组件 -->
        <carryOutTaskSetComponents
            :carryOut.sync="carryOut"
            :formCarryOut.sync="formCarryOut"
            :hostList="hostList"
            @getCarryOut="getCarryOut"
            @closeDialog="closeHandle"
        ></carryOutTaskSetComponents>
        <!-- 修改、编辑 弹层组件 -->
        <editTaskSetComponents
            :editDialog.sync="editDialog"
            :formEditTaskSet="formEditTaskSet"
            @getEditTaskSet="getEditTaskSet"
            @closeDialog="closeHandle"
        ></editTaskSetComponents>
    </div>
</template>

<script>
// 1.引入动画组件
import { Loading } from 'element-ui';

import addTaskSetComponents from '@/components/common/dialog/testTaskSet/addTaskSet';
import timedTaskComponents from '@/components/common/dialog/testTaskSet/timedTask';
import carryOutTaskSetComponents from '@/components/common/dialog/testTaskSet/carryOutTaskSet';
import editTaskSetComponents from '@/components/common/dialog/testTaskSet/editTaskSet';
export default {
    name: 'basetable',
    components: {
        addTaskSetComponents,
        timedTaskComponents,
        carryOutTaskSetComponents,
        editTaskSetComponents
    },
    data() {
        return {
            taskSetName: '', //任务集名称
            params: {
                page: 1,
                page_size: 10
            },
            formEditTaskSet: {
                app_id: '', // CICD应用id
                demand_id: '', // tapd需求id
                modules: '', // 模块id
                task_name: '',
                exec_uname: '',
                env_addr: '',
                db: '',
                status: false
            },
            hostList: [], // 选环境
            formCarryOut: {}, // 执行弹窗表单数据
            tableData: [], // 接口数据
            multipleSelection: [], // 多选监听
            delList: [], // 批量删除
            showTimedTask: false, // 定时任务
            addTaskSetDialog: false, // 添加 添加任务集状态
            pageTotal: 0, // 分页数据长度
            listIndex: -1, // 编辑当前项
            carryOut: false, //执行任务集弹出框状态
            editDialog: false, //编辑弹出框状态
            paginationIndex: 1, //分页默认 第1页
            checkedId: '', //定时选择器选中的ID
            tapd_unique: '',
            CicdAppidName: [], // CICD应用id
            // 2.定义实例
            loadingInstance: null,
            wait_time: 0
        };
    },
    created() {
        console.log('初次进入页面渲染接口数据');
        this.getData();
        this.getCicdAppid();
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
        getCicdAppid() {
            // 获取cicd之appid
            this.$api
                .get_cicd_appid({})
                .then((res) => {
                    if (res.code == 0) {
                        this.CicdAppidName = res.result;
                    } else {
                        this.$messager.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        getTaskSet(e) {
            console.log(e, '获得添加任务集后表单');
            this.addTaskSetDialog = false;
            this.$api
                .add_task(e)
                .then((res) => {
                    if (res.code == 0) {
                        this.$message.success(res.msg);
                        this.$set(this.params, 'page', 1);
                        this.getData();
                    } else if (res.code == 1001) {
                        this.$message.warning(res.data.tapd_unique[0]);
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        // 获取定时任务参数
        getTimedTask(e) {
            e.task_ids = this.checkedId;
            this.showTimedTask = false;
            this.setuptimedtask(e);
        },
        // 设置定时任务
        setuptimedtask(e) {
            this.$api
                .setuptimedtask(e)
                .then((res) => {
                    if (res.code == 0) {
                        this.$message.success(res.msg);
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        // open() {
        //     // let time = 0;
        //     // if (time == 0) {
        //     //     this.$message.success('开始执行任务集，稍后可在任务集历史查看');
        //     // } else {
        //     // 3.生成动画
        //     this.loadingInstance = Loading.service({
        //         lock: true, //同v-loading的修饰符
        //         // text: '请等待，剩余时间' + time + 's ...', //加载文案
        //         text: '正在执行任务集，请等待...',
        //         backgroundColor: 'rgba(55,55,55,0.4)', //背景色
        //         // spinner: 'el-icon-loading', //加载图标
        //         target: '.table' //loading需要覆盖的DOM节点，默认为body
        //     });
        //     // const timer = setInterval(() => {
        //     //     if (time === 0) {
        //     //         clearInterval(timer);
        //     //         // 4.请求完成后关闭动画
        //     //         this.loadingInstance.close();
        //     //         this.$message.success('等待时间结束，开始执行，稍后可在任务集历史查看');
        //     //     } else {
        //     //         this.loadingInstance.text = '请等待，剩余时间' + time + 's ...';
        //     //         --time;
        //     //     }
        //     // }, 1000);
        //     // }
        // },
        // close() {
        //     // 4.请求完成后关闭动画
        //     this.loadingInstance.close();
        // },
        // 执行任务集
        getCarryOut(e) {
            console.log(e, '获得执行任务集后表单');
            this.carryOut = false;
            // 3.生成动画
            this.loadingInstance = Loading.service({
                lock: true, //同v-loading的修饰符
                // text: '请等待，剩余时间' + this.wait_time + 's ...', //加载文案
                text: '正在执行任务集，请等待...',
                backgroundColor: 'rgba(55,55,55,0.4)', //背景色
                // spinner: 'el-icon-loading', //加载图标
                target: '.table' //loading需要覆盖的DOM节点，默认为body
            });
            this.$api
                .executing_task(e)
                .then((res) => {
                    if (res.code == 0) {
                        // console.log(res.wait_time);
                        // this.wait_time = res.wait_time;
                        // // console.log(this.wait_time);
                        // if (this.wait_time == 0) {
                        //     this.$message.success('开始执行任务集，稍后可在任务集历史查看');
                        // } else {
                        //     const timer = setInterval(() => {
                        //         if (this.wait_time === 0) {
                        //             clearInterval(timer);
                        //             this.$message.success('等待时间结束，开始执行，稍后可在任务集历史查看');
                        //         } else {
                        //             this.loadingInstance.text = '请等待，剩余时间' + this.wait_time + 's ...';
                        //             --this.wait_time;
                        //         }
                        //     }, 1000);
                        // }

                        // 4.请求完成后关闭动画
                        this.loadingInstance.close();
                        localStorage.setItem('report_id', res.report_id);
                        // 跳转任务集结果页
                        this.$router.push({ path: '/testTaskSetResult' });
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });

            this.formCarryOut = {};
        },
        getEditTaskSet(e) {
            console.log(e, '获得修改任务集后表单');
            // 修改任务集
            this.$api
                .modify_task(e)
                .then((res) => {
                    if (res.code == 0) {
                        // this.$set(this.params, 'page', 1);
                        this.getData();
                        this.$message.success(res.msg);
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });

            this.editDialog = false;
            // this.$set(this.params, 'page', 1);
            this.getData();
        },
        // 关闭弹出框
        closeHandle(e) {
            // 关闭 添加任务集弹出层
            this.addTaskSetDialog = false;
            // 关闭 执行任务集弹出层
            this.carryOut = false;
            // 执行任务集 数据重置
            this.formCarryOut = {};
            // 关闭修改任务集弹出层
            this.editDialog = false;
            // 修改任务集 数据重置
            this.formEditTaskSet = {
                demand_id: '',
                task_name: '',
                exec_uname: '',
                env_addr: '',
                db: '',
                status: false,
                tapd_unique: ''
            };
            // 关闭定时任务弹出层
            this.showTimedTask = false;
        },
        // 新增任务集
        addTaskSet() {
            this.addTaskSetDialog = true;
        },
        // 定时任务
        onTimedTask() {
            // 获取选中表格的长度
            const length = this.multipleSelection.length;
            // 判断长度为1个时执行定时任务弹出框
            // 长度不是1的时候 各自弹出提示
            if (length == 1) {
                // 获得当前选中的id
                this.checkedId = this.multipleSelection[0].id;
                console.log(this.checkedId, '当前选中的itemId');
                // 执行弹出框
                this.showTimedTask = true;
            } else if (length == 0) {
                this.$message.error(`请选择任务集`);
            } else {
                this.$message.error(`不能同时选择多个添加定时任务`);
            }
        },
        // 执行任务集
        onCarryOut() {
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
                // 选中的表格的ID赋值给 formCarryOut.id
                this.formCarryOut.task_ids = str.toString();
                this.carryOut = true;
                this.get_host();
                // this.$message.success(`成功执行了${length}条任务集`);
            } else {
                this.$message.error(`请选择要执行的任务集`);
            }
        },
        // 查询host (执行任务集>选择环境)
        get_host() {
            this.$api
                .get_host({})
                .then((res) => {
                    if (res.code == 0) {
                        this.hostList = res.data;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        // 查看任务集详情
        handleDetails(index, row) {
            console.log('row:', row);
            // 参数储存本地
            localStorage.setItem('taskId', row.id);
            // localStorage.setItem('taskId','18');
            // 跳转用例结果页
            this.$router.push({ path: '/testTaskDetails' });
        },
        // 修改 当前任务集弹出层
        handleEdit(index, row) {
            // 执行显示弹出层
            this.editDialog = true;
            // 获取当前的修改的内容项
            this.listIndex = index;
            // 给弹出层内容赋值
            this.formEditTaskSet.id = row.id;
            this.formEditTaskSet.task_name = row.task_name;
            this.formEditTaskSet.exec_uname = row.exec_uname;
            this.formEditTaskSet.env_addr = row.env_addr;
            this.formEditTaskSet.db = row.db;
            this.formEditTaskSet.status = row.status;
            this.formEditTaskSet.tapd_unique = row.tapd_unique;
            this.formEditTaskSet.app_id = row.app_id;
            // console.log('🚀 ~ row.app_id', row.app_id);
            // console.log('🚀 ~ this.formEditTaskSet.app_id', this.formEditTaskSet.app_id);
            this.CicdAppidName.forEach((item) => {
                // console.log('🚀 ~ this.formEditTaskSet.app_id', this.formEditTaskSet.app_id);
                // console.log('🚀 ~ item.id', item.id);
                if (item.id == this.formEditTaskSet.app_id) {
                    // console.log('🚀 ~ this.formEditTaskSet.app_id', this.formEditTaskSet.app_id);
                    // console.log('🚀 ~ item.id', item.id);
                    // console.log('🚀 ~ item', item);
                    // console.log('🚀 ~ item.appId', item.appId);
                    // console.log(this.formEditTaskSet.appID);
                    this.formEditTaskSet.appId = item.appId;
                    // console.log('🚀 ~ this.formEditTaskSet.appId', this.formEditTaskSet.appId);
                }
            });
            this.formEditTaskSet.modules = row.modules;
            this.formEditTaskSet.modules_name = row.modules_name;
            this.formEditTaskSet.demand_id = row.demand_id;
            this.formEditTaskSet.demand_name = row.demand_name;
            this.formEditTaskSet.iteration_id = row.iteration_id;
            this.formEditTaskSet.iteration_name = row.iteration_name;
            console.log(this.formEditTaskSet, '修改前的编辑');
        },

        //  批量删除
        delAllSelection() {
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
                console.log(str, '删除的项目');
                // 二次确认删除
                this.$confirm('确定要删除这' + length + '条吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        this.delete_task(str);
                        this.tableData.splice(index, 1);
                    })
                    .catch(() => {});
                // this.$message.success(`成功删除了${length}条项目`);
            } else {
                this.$message({
                    message: '请选择要删除的项目',
                    type: 'warning'
                });
            }
        },
        // 删除用例
        delete_task(e) {
            let params = {
                ids: e
            };
            this.$api
                .delete_task(params)
                .then((res) => {
                    if (res.code == 0) {
                        this.$message.success(res.msg);
                        // this.$set(this.params, 'page', 1);
                        this.getData();
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        // 删除 单条操作
        handleDelete(index, row) {
            let params = [];
            params.push(row.id);
            console.log(row, '删除监听');
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.delete_task(params);
                    this.tableData.splice(index, 1);
                })
                .catch(() => {});
        },
        // 获取 接口数据
        getData() {
            // 请求参数
            this.$api
                .search_taskList(this.params)
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
        // 全局回车搜索
        enterKey(event) {
            const code = event.keyCode;
            const path = this.$route.path;
            if (code == 13 && path == '/testTaskSet') {
                this.handleSearch();
            }
        },
        // 触发搜索按钮
        handleSearch() {
            console.log(this.taskSetName, '获取任务集搜索名称');

            // 判断搜索框是否为true (不为空)
            if (this.taskSetName) {
                // 如果不是空 则赋值给 this.params.task_name
                this.params.task_name = this.taskSetName;
            } else {
                // 否则为空 就删除掉 this.params.task_name
                delete this.params.task_name;
            }

            // 执行搜索后的接口数据
            this.$set(this.params, 'page', 1);
            this.getData();
        },
        // 多选监听
        handleSelectionChange(val) {
            // 获取到选中的内容集合
            this.multipleSelection = val;
        },
        // 分页导航
        handlePageChange(val) {
            this.paginationIndex = val;
            this.$set(this.params, 'page', val);
            this.getData();
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
