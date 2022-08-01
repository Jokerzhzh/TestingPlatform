<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-input style="margin-right: 20px" v-model="params.keyword" placeholder="ID/IP地址" @input="change($event)"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="getData()">搜索</el-button>
                <el-button type="primary" @click="add()">新增</el-button>
                <el-button type="warn" @click="onReload()">重置</el-button>
            </div>
            <el-table :data="tableData" border size="mini" class="table" ref="multipleTable">
                <el-table-column fixed prop="id" label="ID" align="center">
                    <template slot-scope="scope">{{ scope.row.id }}</template>
                </el-table-column>
                <el-table-column fixed prop="ipAddress" label="IP地址" align="center">
                    <template slot-scope="scope">{{ scope.row.ipAddress }}</template>
                </el-table-column>
                <el-table-column fixed prop="name" label="服务器名称" align="center">
                    <template slot-scope="scope">{{ scope.row.name }}</template>
                </el-table-column>
                <el-table-column label="操作" width="150" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="modify(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="danger" size="mini" @click="onDel(scope)">删除</el-button>
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
        <!-- 新增服务器 -->
        <el-dialog
            title="新增服务器"
            @close="closeAdd"
            custom-class="add-el-dialog"
            :visible.sync="isAdd"
            width="40%"
            :before-close="handleClose"
        >
            <el-form :model="addData" ref="form" label-width="70px">
                <el-form-item prop="ipAddress" label="IP地址" :rules="[{ required: true, message: '请输入IP地址', trigger: 'blur' }]">
                    <el-input v-model="addData.ipAddress" placeholder="请输入IP地址" @input="change($event)"></el-input>
                </el-form-item>
                <el-form-item prop="name" label="名称" :rules="[{ required: true, message: '请输入服务器名称', trigger: 'blur' }]">
                    <el-input v-model="addData.name" placeholder="请输入服务器名称" @input="change($event)"></el-input>
                </el-form-item>
                <el-form-item prop="username" label="账号" :rules="[{ required: true, message: '请输入账号', trigger: 'blur' }]">
                    <el-input v-model="addData.username" placeholder="请输入账号" @input="change($event)"></el-input>
                </el-form-item>
                <el-form-item prop="password" label="密码" :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]">
                    <el-input v-model="addData.password" placeholder="请输入密码" @input="change($event)"></el-input>
                </el-form-item>
                <!-- <el-form-item label="jdk版本">
                    <el-input v-model="addData.jdkVersion" placeholder="请输入jdk版本"></el-input>
                </el-form-item>
                <el-form-item label="jdk">
                    <el-input v-model="addData.jdk" placeholder="JDK是否存在"></el-input>
                </el-form-item>
                <el-form-item label="jmeter版本">
                    <el-input v-model="addData.jmeterVersion" placeholder="请输入jmeter版本"></el-input>
                </el-form-item>
                <el-form-item label="Jmeter是否存在">
                    <el-input v-model="addData.jmeter" placeholder="Jmeter是否存在"></el-input>
                </el-form-item>
                <el-form-item label="服务器是否可用">
                    <el-input v-model="addData.usable" placeholder="服务器是否可用"></el-input>
                </el-form-item> -->
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isAdd = false">取 消</el-button>
                <el-button type="primary" @click="submitAdd()">提 交</el-button>
            </span>
        </el-dialog>
        <!-- 编辑 -->
        <el-dialog title="编辑" @close="closeModify" :visible.sync="isModify" width="40%" :before-close="handleClose">
            <el-form ref="form" :model="modifyData" label-width="70px">
                <el-form-item prop="ipAddress" label="IP地址" :rules="[{ required: true, message: '请输入IP地址', trigger: 'blur' }]">
                    <el-input v-model="modifyData.ipAddress" placeholder="请输入IP地址" @input="change($event)"></el-input>
                </el-form-item>
                <el-form-item prop="name" label="名称" :rules="[{ required: true, message: '请输入服务器名称', trigger: 'blur' }]">
                    <el-input v-model="modifyData.name" placeholder="请输入服务器名称" @input="change($event)"></el-input>
                </el-form-item>
                <el-form-item prop="username" label="账号" :rules="[{ required: true, message: '请输入账号', trigger: 'blur' }]">
                    <el-input v-model="modifyData.username" placeholder="请输入账号" @input="change($event)"></el-input>
                </el-form-item>
                <el-form-item prop="password" label="密码" :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]">
                    <el-input v-model="modifyData.password" placeholder="请输入密码" @input="change($event)"></el-input>
                </el-form-item>
                <!-- <el-form-item label="jdk版本">
                    <el-input v-model="modifyData.jdkVersion" placeholder="请输入jdk版本" @input="change($event)"></el-input>
                </el-form-item>
                <el-form-item label="jdk">
                    <el-input v-model="modifyData.jdk" placeholder="JDK是否存在" @input="change($event)"></el-input>
                </el-form-item>
                <el-form-item label="jmeter版本">
                    <el-input v-model="modifyData.jmeterVersion" placeholder="请输入jmeter版本" @input="change($event)"></el-input>
                </el-form-item>
                <el-form-item label="Jmeter是否存在">
                    <el-input v-model="modifyData.jmeter" placeholder="Jmeter是否存在" @input="change($event)"></el-input>
                </el-form-item>
                <el-form-item label="服务器是否可用">
                    <el-input v-model="modifyData.usable" placeholder="服务器是否可用" @input="change($event)"></el-input>
                </el-form-item> -->
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isModify = false">取 消</el-button>
                <el-button type="primary" @click="submitModify()">提 交</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
// 1.引入动画组件
import { Loading } from 'element-ui';
export default {
    name: 'basetable',
    data() {
        return {
            params: {
                pageNum: 1,
                pageSize: 10
            },
            dialogVisible: false,
            tableData: [], // 列表数据
            pageTotal: 0, // 数据总条数
            disabled: false,
            isAdd: false,
            addData: {},
            isModify: false,
            modifyData: {},
            loadingInstance: null
        };
    },
    created() {
        this.getData();
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
        getData() {
            this.$api
                .searchPage(this.params)
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
        add() {
            this.isAdd = true;
        },
        submitAdd() {
            if (!this.addData.ipAddress) {
                this.$message.error('请输入IP地址');
                return;
            }
            if (!this.addData.name) {
                this.$message.error('请输入服务器名称');
                return;
            }
            if (!this.addData.username) {
                this.$message.error('请输入用户名');
                return;
            }
            if (!this.addData.password) {
                this.$message.error('请输入密码');
                return;
            }
            let params = new FormData();
            let ipAddress = this.addData.ipAddress;
            params.append('ipAddress', ipAddress);

            let name = this.addData.name;
            params.append('name', name);

            let username = this.addData.username;
            params.append('username', username);

            let password = this.addData.password;
            params.append('password', password);

            // let jdkVersion = this.addData.jdkVersion;
            // params.append('jdkVersion', jdkVersion);

            // let jdk = this.addData.jdk;
            // params.append('jdk', jdk);

            // let jmeterVersion = this.addData.jmeterVersion;
            // params.append('jmeterVersion', jmeterVersion);

            // let jmeter = this.addData.jmeter;
            // params.append('jmeter', jmeter);

            // let usable = this.addData.usable;
            // params.append('usable', usable);
            // 3. 生成动画
            this.loadingInstance = Loading.service({
                // 动画中的文字
                // text: '正在进行中...',
                // 要加载动画的容器-释放集群操作
                target: '.el-dialog'
                // // 设置动画加载图标
                // spinner: 'el-icon-loading',
                // // 设置加载动画背景颜色
                // background: 'rgba(0, 0, 0, 0.8)'
            });
            this.$api
                .addSearch(params)
                .then((res) => {
                    if (res.code == 0) {
                        this.$message.success('添加成功！');
                        this.isAdd = false;
                        this.getData();
                        // 4. 请求完成后关闭动画
                        this.loadingInstance.close();
                    } else {
                        this.isAdd = false;
                        this.$message.error(res.msg);
                        // 4. 请求完成后关闭动画
                        this.loadingInstance.close();
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        closeAdd() {
            this.isAdd = false;
            this.addData = [];
        },
        modify(index, row) {
            // 执行显示弹出层
            this.isModify = true;
            // 获取当前的修改的内容项
            this.listIndex = index;
            // 给弹出层内容赋值
            this.modifyData.id = row.id;
            this.modifyData.ipAddress = row.ipAddress;
            this.modifyData.name = row.name;
            this.modifyData.username = row.username;
            this.modifyData.password = row.password;
            // this.modifyData.jdkVersion = row.jdkVersion;
            // this.modifyData.jdk = row.jdk;
            // this.modifyData.jmeterVersion = row.jmeterVersion;
            // this.modifyData.jmeter = row.jmeter;
            // this.modifyData.usable = row.usable;
        },
        submitModify() {
            if (!this.modifyData.ipAddress) {
                this.$message.error('请输入IP地址');
                return;
            }
            if (!this.modifyData.name) {
                this.$message.error('请输入服务器名称');
                return;
            }
            if (!this.modifyData.username) {
                this.$message.error('请输入用户名');
                return;
            }
            if (!this.modifyData.password) {
                this.$message.error('请输入密码');
                return;
            }
            let params = new FormData();
            let id = this.modifyData.id;
            params.append('id', id);

            let ipAddress = this.modifyData.ipAddress;
            params.append('ipAddress', ipAddress);

            let name = this.modifyData.name;
            params.append('name', name);

            let username = this.modifyData.username;
            params.append('username', username);

            let password = this.modifyData.password;
            params.append('password', password);

            // let jdkVersion = this.modifyData.jdkVersion;
            // params.append('jdkVersion', jdkVersion);

            // let jdk = this.modifyData.jdk;
            // params.append('jdk', jdk);

            // let jmeterVersion = this.modifyData.jmeterVersion;
            // params.append('jmeterVersion', jmeterVersion);

            // let jmeter = this.modifyData.jmeter;
            // params.append('jmeter', jmeter);

            // let usable = this.modifyData.usable;
            // params.append('usable', usable);
            this.$api
                .modifySearch(params)
                .then((res) => {
                    if (res.code == 0) {
                        this.$message.success('修改成功！');
                        this.getData();
                        this.isModify = false;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        closeModify() {
            this.isModify = false;
        },
        onReload() {
            this.params.keyword = '';
            this.getData();
        },
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then((_) => {
                    done();
                })
                .catch((_) => {});
        },
        // 删除
        onDel(scope) {
            this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    let params = {
                        id: scope.row.id
                    };
                    console.log(scope.row.id);
                    this.$api.deleteSearch(params).then((res) => {
                        if (res.code == 0) {
                            if (res.msg == 'success') {
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                                this.getData();
                            } else this.$message.error(res.msg);
                        } else {
                            this.$message.error(res.msg);
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
            this.$set(this.params, 'pageNum', 1);
            this.getData();
        },
        // 重新渲染 input 可编辑操作
        change() {
            this.$forceUpdate();
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.params, 'pageNum', val);
            this.getData();
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
