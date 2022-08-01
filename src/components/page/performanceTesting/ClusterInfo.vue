<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" @click="outerVisible = true">添 加</el-button>
                <!-- <el-button type="primary" @click="setInter1()">获取时间</el-button> -->
                <!-- <el-button type="primary" @click="test()">测试</el-button> -->
            </div>
            <el-table :data="tableData" border size="mini" class="table" ref="multipleTable">
                <el-table-column prop="id" label="ID" align="center" width="100px">
                    <template slot-scope="scope">{{ scope.row.id }}</template>
                </el-table-column>
                <el-table-column prop="name" label="集群名称" align="center" width="300px">
                    <template slot-scope="scope">{{ scope.row.name }}</template>
                </el-table-column>
                <el-table-column prop="remark" label="集群描述" align="center" width="300px">
                    <template slot-scope="scope">{{ scope.row.remark }}</template>
                </el-table-column>
                <el-table-column prop="serverIds" label="IP地址" align="center">
                    <template slot-scope="scope">{{ scope.row.serverIds }}</template>
                </el-table-column>
                <el-table-column label="操作" width="150" align="center">
                    <template slot-scope="scope">
                        <el-button type="success" size="mini" @click="shutdownCustomer(scope.row.id)">释 放</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next,jumper"
                    :current-page="params.pageNum"
                    :page-size="params.pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>
        <el-dialog width="30%" title="请选择主从机" @close="closeOut" :visible.sync="outerVisible">
            <div>
                <el-form :model="addData" ref="form" label-width="70px" class="outDialog">
                    <el-form-item label="主机" :rules="[{ required: true }]">
                        <el-select
                            ref="select1"
                            @visible-change="changeFocus1"
                            v-model="addData.masterIp"
                            @change="changeMaster"
                            filterable
                            clearable
                            placeholder="请选择主机"
                        >
                            <el-option v-for="item in masterList" :key="item.id" :label="item.name" :value="item.ipAddress"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="从机" :rules="[{ required: true }]">
                        <el-select
                            ref="select2"
                            @visible-change="changeFocus2"
                            :disabled="!addData.masterIp"
                            v-model="addData.serverIds"
                            multiple
                            filterable
                            clearable
                            collapse-tags
                            placeholder="请选择从机"
                        >
                            <el-option
                                v-for="item in serverList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.ipAddress"
                                :disabled="item.disabled"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <el-dialog width="30%" title="请输入内容" @close="closeIn" :visible.sync="innerVisible" append-to-body>
                <div>
                    <el-form :model="addData" ref="form" label-width="80px">
                        <el-form-item
                            label="集群名称"
                            prop="name"
                            :rules="[{ required: true, message: '请输入集群名称', trigger: 'blur' }]"
                        >
                            <el-input v-model="addData.name" placeholder="请输入集群名称" @input="change($event)"></el-input>
                        </el-form-item>
                        <el-form-item
                            label="集群描述"
                            prop="remark"
                            :rules="[{ required: true, message: '请输入集群描述', trigger: 'blur' }]"
                        >
                            <el-input v-model="addData.remark" placeholder="请输入集群描述" @input="change($event)"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="innerVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submitAdd()">提交</el-button>
                </div>
            </el-dialog>
            <div slot="footer" class="dialog-footer">
                <el-button @click="outerVisible = false">取 消</el-button>
                <el-button type="primary" @click="openIn()">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog
            width="35%"
            custom-class="show-dialog"
            title="进度"
            @close="closeShow"
            :visible.sync="isShow"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :show-close="false"
        >
            <!-- :close-on-click-modal="false"
            :close-on-press-escape="false"
            :show-close="false" -->
            <div>
                <el-form :model="addData" ref="form" label-width="100px">
                    <el-form-item label="部署JDK...">
                        <el-progress
                            :text-inside="true"
                            :stroke-width="24"
                            :percentage="percentage1"
                            :color="customColors"
                            status="success"
                        ></el-progress>
                    </el-form-item>
                    <el-form-item label="部署Jmeter...">
                        <el-progress
                            :text-inside="true"
                            :stroke-width="24"
                            :percentage="percentage2"
                            :color="customColors"
                            status="success"
                        ></el-progress>
                    </el-form-item>
                    <el-form-item label="检查集群...">
                        <el-progress
                            :text-inside="true"
                            :stroke-width="24"
                            :percentage="percentage3"
                            :color="customColors"
                            status="success"
                        ></el-progress>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>
    </div>
</template>

<script>
// 1.引入动画组件
import { Loading } from 'element-ui';
// 引入 自定义的element UI loading样式 文件
// import '../../../assets/css/loading.css';
export default {
    name: 'basetable',
    data() {
        return {
            params: {
                pageNum: 1,
                pageSize: 10
            },
            tableData: [], // 列表数据
            pageTotal: 0, // 数据总条数
            outerVisible: false, // 外层弹窗
            innerVisible: false, // 内层弹窗
            addData: {}, // 提交的数据
            masterList: [], // 主机列表
            serverList: [], // 从机列表
            // 2.定义实例
            loadingInstance: null,
            clusterId: '', // 集群ID
            isShow: false, // 进度条弹窗
            percentage1: 0, // 部署JDK进度条
            percentage2: 0, // 部署Jmeter进度条
            percentage3: 0, // 检测集群可用进度条
            customColors: [
                { color: '#f56c6c', percentage: 20 },
                { color: '#e6a23c', percentage: 40 },
                { color: '#5cb87a', percentage: 60 },
                { color: '#1989fa', percentage: 80 },
                { color: '#67c23a', percentage: 100 }
            ] // 进度条颜色
        };
    },
    created() {
        // 分页查询集群
        this.getData();
        // 查询可用服务器
        this.searchUsable();
    },
    mounted() {
        // 绑定enter事件
        // document.addEventListener('keyup', this.enterKey);
        // this.userList = JSON.parse(localStorage.getItem('userList'));
        // this.getProjectName();
        // console.log('userList:',JSON.parse(this.userList))
    },
    destroyed() {
        // 销毁enter事件
        document.removeEventListener('keyup', this.enterKey);
    },
    methods: {
        // test() {
        //     var str = '172.16.68.76,172.16.68.16,172.16.68.27';
        //     let arr = str.split(',');
        //     console.log(arr);

        //     const tasks = [];
        //     const output = (i) =>
        //         new Promise((resolve) => {
        //             setTimeout(() => {
        //                 console.log(arr[i], i);
        //                 this.$message.success(arr[i] + ' 释放成功！');
        //                 resolve();
        //             }, 2000 * i);
        //         });

        //     for (var i = 0; i < arr.length; i++) {
        //         tasks.push(output(i));
        //     }
        //     //最后的i的值是在异步全部完成之后
        //     Promise.all(tasks).then(() => {
        //         setTimeout(() => {
        //             // this.$message.success(arr[i] + ' 释放成功！');
        //             this.$message.success('释放集群成功！');
        //             // console.log(arr[i], i);
        //         }, 2000);
        //     });
        // },
        // 分页查询集群
        getData() {
            this.$api
                .clusterSearchPage(this.params)
                .then((res) => {
                    if (res.code == 0) {
                        this.tableData = res.data.records;
                        this.pageTotal = res.data.total;
                        this.params.pageSize = res.data.size;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.success(res.msg);
                });
        },
        // 查询可用服务器
        searchUsable() {
            let params = {
                keyword: 0
            };
            this.$api
                .searchUsable(params)
                .then((res) => {
                    if (res.code == 0) {
                        this.masterList = res.data.records;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        // 监听选择主机
        changeMaster(e) {
            var list = new Array();
            var name = '';
            var masterNameList = new Array();
            if (!this.addData.masterIp) {
                this.addData.serverIds = '';
            } else {
                this.addData.serverIds = '';
                this.masterList.forEach((item, i) => {
                    list.push(item.name);
                    masterNameList.push(item.name);
                    if (e == item.ipAddress) {
                        name = item.name;
                    }
                });
                var index = list.indexOf(name);
                this.masterList.forEach((item, i) => {
                    this.serverList[i] = item;
                });
                this.serverList[index].disabled = true;
                list.splice(index, 1);
                list.forEach((item) => {
                    var index1 = masterNameList.indexOf(item);
                    this.serverList[index1].disabled = false;
                });
            }
        },
        // 打开外层弹窗
        openOut() {
            this.outerVisible = true;
        },
        // 打开内层弹窗
        openIn() {
            if (!this.addData.masterIp) {
                this.$message.error('请选择主机');
                return;
            }
            if (!this.addData.serverIds) {
                this.$message.error('请选择从机');
                return;
            }
            this.innerVisible = true;
        },
        // 关闭外层弹窗
        closeOut() {
            this.addData.masterIp = '';
            this.addData.serverIds = '';
            this.outerVisible = false;
        },
        // 关闭内层弹窗
        closeIn() {
            this.addData.name = '';
            this.addData.remark = '';
            this.innerVisible = false;
        },
        // 提交
        submitAdd() {
            if (!this.addData.name) {
                this.$message.error('请输入集群名称');
                return;
            }
            if (!this.addData.remark) {
                this.$message.error('请输入集群名称描述');
                return;
            }
            this.isShow = true;
            this.percentage1 = 0;
            this.percentage2 = 0;
            this.percentage3 = 0;
            let params = new FormData();
            params.append('is', 1);
            let masterIp = this.addData.masterIp;
            params.append('masterIp', masterIp);

            let name = this.addData.name;
            params.append('name', name);

            let serverIds = this.addData.serverIds;
            params.append('serverIds', serverIds);

            let remark = this.addData.remark;
            params.append('remark', remark);
            // 查询可用服务器
            this.searchUsable();
            this.$api
                .addCluster(params)
                .then((res) => {
                    if (res.code == 0) {
                        // this.$message.success(res.msg);
                        this.outerVisible = false;
                        this.innerVisible = false;
                        this.clusterId = res.data;
                        // console.log('🚀 ~ clusterId', this.clusterId);
                        // 部署JDK
                        // console.log('开始部署JDK...');
                        this.$message.success('开始部署JDK...');
                        this.setInter1();
                        this.deployJDK(this.clusterId);
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(err.msg);
                });
        },
        // 部署JDK
        deployJDK() {
            let params = {
                clusterId: this.clusterId
            };
            this.$api
                .deployJDK(params)
                .then((res) => {
                    if (res.code == 0) {
                        this.$message.success('部署JDK成功！开始部署Jmeter...');
                        // console.log('部署JDK成功...');
                        this.percentage1 = 100;
                        // 部署Jmeter
                        // console.log('开始部署Jmeter...');
                        this.setInter2();
                        this.deployjmeter();
                    } else {
                        // console.log('JDK部署失败！！！');
                        // 关闭进度弹窗
                        this.closeShow();
                        this.$message.error(res.msg);
                        // 刷新页面数据
                        // console.log('开始刷新页面...');
                        this.getData();
                    }
                })
                .catch((err) => {
                    this.$message.error(err.msg);
                });
        },
        // 部署Jmeter
        deployjmeter() {
            this.$api
                .deployjmeter()
                .then((res) => {
                    if (res.code == 0) {
                        this.$message.success('部署Jmeter成功！开始检测集群是否可用...');
                        // console.log('部署Jmeter成功...');
                        this.percentage2 = 100;
                        // 检测集群可用
                        // console.log('开始检测集群可用...');
                        this.setInter3();
                        this.checkCustomer();
                    } else {
                        // console.log('Jmeter部署失败！！！');
                        // 关闭进度弹窗
                        this.closeShow();
                        this.$message.error(res.msg);
                        // 刷新页面数据
                        // console.log('开始刷新页面...');
                        this.getData();
                    }
                })
                .catch((err) => {
                    this.$message.error(err.msg);
                });
        },
        // 检测集群可用
        checkCustomer() {
            let params = {
                clusterId: this.clusterId
            };
            this.$api
                .checkCustomer(params)
                .then((res) => {
                    if (res.code == 0) {
                        this.$message.success('集群可用！！！');
                        this.percentage3 = 100;
                        // console.log('集群可用...');
                        // 关闭进度弹窗
                        this.closeShow();
                        // 刷新页面数据
                        // console.log('开始刷新页面...');
                        this.getData();
                    } else {
                        // console.log('检测集群可用失败！！！');
                        // 关闭进度弹窗
                        this.closeShow();
                        this.$message.error(res.msg);
                        // 刷新页面数据
                        // console.log('开始刷新页面...');
                        this.getData();
                    }
                })
                .catch((err) => {
                    this.$message.error(err.msg);
                });
        },
        // 部署JDK进度条
        setInter1() {
            this.isShow = true;
            // this.setInter2();
            var timer = setInterval(() => {
                this.percentage1++;
                // console.log('🚀 ~ percentage1', this.percentage1);
                if (this.percentage1 === 99) {
                    // console.log('this.percentage1 === 99,清除定时器');
                    clearInterval(timer); //清除定时器
                }
                if (this.percentage1 > 100) {
                    // console.log('this.percentage1 > 100,清除定时器');
                    this.percentage1 = 100;
                    clearInterval(timer); //清除定时器
                }
            }, 200); // 200毫秒执行一次
        },
        // 部署Jmeter进度条
        setInter2() {
            // this.setInter3();
            var timer = setInterval(() => {
                this.percentage2++;
                // console.log('🚀 ~ percentage2', this.percentage2);
                if (this.percentage2 === 99) {
                    // console.log('this.percentage2 === 99,清除定时器');
                    clearInterval(timer); //清除定时器
                }
                if (this.percentage2 > 100) {
                    // console.log('this.percentage2 > 100,清除定时器');
                    this.percentage2 = 100;
                    clearInterval(timer); //清除定时器
                }
            }, 250); // 250毫秒执行一次
        },
        // 检测集群可用进度条
        setInter3() {
            var timer = setInterval(() => {
                this.percentage3++;
                // console.log('🚀 ~ percentage3', this.percentage3);
                if (this.percentage3 === 99) {
                    // console.log('this.percentage3 === 99,清除定时器');
                    clearInterval(timer); //清除定时器
                }
                if (this.percentage3 > 100) {
                    // console.log('this.percentage3 > 100,清除定时器');
                    this.percentage3 = 100;
                    clearInterval(timer); //清除定时器
                }
            }, 90); // 90毫秒执行一次
        },
        // 关闭进度条弹窗
        closeShow() {
            this.isShow = false;
            // 当关闭进度弹窗时，清除所有定时器
            // console.log('清除所有定时器');
            for (var i = 1; i < 5; i++) {
                window.clearInterval(i);
            }
            this.percentage1 = 0;
            this.percentage2 = 0;
            this.percentage3 = 0;
        },
        // 释放集群
        shutdownCustomer(id) {
            let params = {
                id: id,
                is: 0
            };
            // 3. 生成动画
            this.loadingInstance = Loading.service({
                // 动画中的文字
                text: '正在释放集群...',
                // 要加载动画的容器-释放集群操作
                target: '.el-table'
                // // 设置动画加载图标
                // spinner: 'el-icon-loading',
                // // 设置加载动画背景颜色
                // background: 'rgba(0, 0, 0, 0.8)'
            });
            this.$api
                .shutdownCustomer(params)
                .then((res) => {
                    if (res.code == 0) {
                        var str = res.msg;
                        let arr = str.split(',');
                        // console.log(arr);
                        const tasks = [];
                        const output = (i) =>
                            new Promise((resolve) => {
                                setTimeout(() => {
                                    // console.log(arr[i], i);
                                    this.$message.success(arr[i] + ' 释放成功！');
                                    resolve(); // 代表已完成
                                }, 2000 * i);
                            });

                        for (var i = 0; i < arr.length; i++) {
                            tasks.push(output(i));
                        }
                        //最后的i的值是在异步全部完成之后
                        Promise.all(tasks).then(() => {
                            setTimeout(() => {
                                // this.$message.success(arr[i] + ' 释放成功！');
                                // console.log(arr[i], i);
                                this.$message.success('释放集群成功！');
                                // 刷新页面数据
                                this.getData();
                                // 查询可用服务器
                                this.searchUsable();
                                // 4. 请求完成后关闭动画
                                this.loadingInstance.close();
                            }, 2000);
                            // this.$message.success('释放集群成功！');
                            // 刷新页面数据
                            // this.getData();
                            // // 查询可用服务器
                            // this.searchUsable();
                            // // 4. 请求完成后关闭动画
                            // this.loadingInstance.close();
                        });
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(err.msg);
                });
        },
        // 重新渲染 input 可编辑操作
        change() {
            this.$forceUpdate();
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.params, 'pageNum', val);
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
        }
    }
};
</script>
<style scoped lang="less">
// 引入 自定义的element UI loading样式 文件
// @import '../../../assets/css/loading.css';
.show-dialog {
    .el-progress {
        width: 96%;
        margin-right: 10px;
    }
}
.handle-box {
    margin-bottom: 10px;
    div {
        margin-bottom: 10px;
    }
    .el-input {
        width: 200px;
    }
    .el-select {
        width: 200px;
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
.outDialog {
    margin-left: 60px;
}
</style>
