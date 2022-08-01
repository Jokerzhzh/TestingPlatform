<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="params.case_name" placeholder="用例名称" class="handle-input mr10"></el-input>
                <el-select
                    ref="select1"
                    @visible-change="changeFocus1"
                    v-model="params.api_name"
                    placeholder="接口名称"
                    filterable
                    class="handle-select mr10"
                >
                    <el-option v-for="(item, index) in apiName" :key="index" :label="item.api_name" :value="item.api_name"></el-option>
                </el-select>

                <el-select
                    ref="select2"
                    @visible-change="changeFocus2"
                    v-model="params.request_method"
                    placeholder="请求方式"
                    class="handle-select mr10"
                >
                    <el-option v-for="(item, index) in requestMethod" :key="index" :label="item.value" :value="item.value"></el-option>
                </el-select>

                <el-select
                    ref="select3"
                    @visible-change="changeFocus3"
                    v-model="params.status"
                    placeholder="选择状态"
                    class="handle-select mr10"
                >
                    <el-option key="1" label="生效中" value="1"></el-option>
                    <el-option key="0" label="已禁用" value="0"></el-option>
                </el-select>

                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" @click="onRes">重置</el-button>
            </div>

            <div class="handle-box">
                <el-button-group style="position: relative">
                    <el-button type="primary" icon="el-icon-delete" class="handle-del mr10" @click="delAllSelection">批量删除</el-button>
                    <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addCase">添加case</el-button>
                    <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addSql">添加sql</el-button>
                    <el-upload class="el-upload" accept=".mpp, .xls, .xlsx," ref="upload" action="string" :http-request="uploadFiles"
                        >1</el-upload
                    >
                    <el-button type="primary" icon="el-icon-download" class="handle-del mr10">导入</el-button>
                    <el-upload class="el-upload2" accept=" .json" ref="upload" action="string" :http-request="importPostmanData"
                        >2</el-upload
                    >
                    <el-button type="primary" icon="el-icon-download" class="handle-del mr10">Postman导入</el-button>
                </el-button-group>
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
                <el-table-column prop="id" label="ID" width="66" align="center">
                    <template slot-scope="scope">{{ scope.row.id }}</template>
                </el-table-column>
                <el-table-column prop="name" label="用例名称">
                    <template slot-scope="scope">{{ scope.row.case_name }}</template>
                </el-table-column>
                <el-table-column label="接口名称">
                    <template slot-scope="scope">{{ scope.row.api_name }}</template>
                </el-table-column>
                <el-table-column label="请求方式" align="center">
                    <template slot-scope="scope">{{ scope.row.method }}</template>
                </el-table-column>

                <el-table-column prop="date" :show-overflow-tooltip="true" label="头信息" align="center" width="120">
                    <template slot-scope="scope">{{ scope.row.headers == '{}' ? '暂无信息' : scope.row.headers }}</template>
                </el-table-column>
                <el-table-column prop="date" :show-overflow-tooltip="true" label="请求参数" align="center">
                    <template slot-scope="scope">{{ scope.row.params }}</template>
                </el-table-column>
                <el-table-column prop="date" :show-overflow-tooltip="true" label="Data" align="center">
                    <template slot-scope="scope">{{ scope.row.data }}</template>
                </el-table-column>
                <el-table-column prop="date" :show-overflow-tooltip="true" label="断言" align="center" width="320">
                    <template slot-scope="scope">{{
                        scope.row.asserts == '[{}]' || scope.row.asserts == '{}' ? '暂无信息' : scope.row.asserts
                    }}</template>
                </el-table-column>
                <el-table-column prop="date" :show-overflow-tooltip="true" label="依赖数据" align="center">
                    <template slot-scope="scope">{{ scope.row.ApiDependencys == '{}' ? '暂无信息' : scope.row.ApiDependencys }}</template>
                </el-table-column>
                <el-table-column label="优先级" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.caselevel == '高' ? 'danger' : 'warning'">
                            {{ scope.row.caselevel == '高' ? '高' : '低' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="用例描述">
                    <template slot-scope="scope">{{ scope.row.case_desc }}</template>
                </el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.status == true ? 'success' : 'danger'">
                            {{ scope.row.status == true ? '生效中' : '已禁用' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="success" size="mini" icon="el-icon-lx-forward" @click="onCarryOut(scope.$index, scope.row)"
                            >执行</el-button
                        >
                        <br />
                        <el-button
                            style="margin-top: 5px"
                            type="warning"
                            size="mini"
                            icon="el-icon-edit-outline"
                            @click="handleEdit(scope.$index, scope.row)"
                            >修改</el-button
                        >
                        <br />
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
        <!-- 添加case 弹层组件 -->
        <addCaseComponents
            :addCaseDialog.sync="addCaseDialog"
            :apiName="apiName"
            @getformcase="getformcase"
            @closeDialog="closeHandle"
            ref="addCase"
        ></addCaseComponents>
        <!-- 添加sql 弹层组件 -->
        <addSqlComponents
            :addSqlDialog.sync="addSqlDialog"
            :apiName="apiName"
            @getformsql="getformsql"
            @closeDialog="closeHandle"
        ></addSqlComponents>
        <!-- 执行 弹层组件 -->
        <carryOutComponents
            :carryOut.sync="carryOut"
            :formCarryOut="formCarryOut"
            :hostList="hostList"
            @getCarryOut="getCarryOut"
            @closeDialog="closeHandle"
        ></carryOutComponents>
        <!-- 修改、编辑 弹层组件 -->
        <editComponents
            :editDialog.sync="editDialog"
            :apiName="apiName"
            :formEdit="formEdit"
            @getEdit="getEdit"
            @closeDialog="closeHandle"
        ></editComponents>
        <!-- 修改sql、编辑 弹层组件 -->
        <editsqlComponents
            :editDialog.sync="editsqlDialog"
            :apiName="apiName"
            :formEdit="formEdit"
            @getEdit="getEdit"
            @rows="rows"
            @closeDialog="closeHandle"
        ></editsqlComponents>
    </div>
</template>

<script>
import addCaseComponents from '@/components/common/dialog/testCase/addCase';
import addSqlComponents from '@/components/common/dialog/testCase/addSql';
import carryOutComponents from '@/components/common/dialog/testCase/carryOut';
import editComponents from '@/components/common/dialog/testCase/edit';
import editsqlComponents from '@/components/common/dialog/testCase/editsql';
export default {
    name: 'basetable',
    components: {
        addCaseComponents,
        addSqlComponents,
        carryOutComponents,
        editComponents,
        editsqlComponents
    },
    data() {
        return {
            hostList: [],
            requestMethod: [{ value: 'get' }, { value: 'form-data' }, { value: 'post-body' }],
            apiName: [], // 接口名称
            params: {
                page: 1,
                page_size: 10
            },
            editsqlDialog: false,
            formEdit: {
                // 编辑修改 数据
                method: 'get', // 请求方式
                status: 2, // 状态
                headers: [{}], //  请求头数组
                params: [{ files: [] }], //  请求参数 数组
                data: [{}], //  data 数组
                asserts: [{}], //  Assert 数组
                ApiDependencys: {}, //  API Dependency 数组
                switchAssert: false, //  Assert 开关
                switchApi: false, //  API Dependency 开关
                textarea: '', // Body Data 文本域
                wait_time: '' // 等待时间
            },
            rows: {},
            formCarryOut: {}, // 执行弹窗表单数据
            tableData: [], // 接口数据
            multipleSelection: [], // 多选监听
            delList: [], // 批量删除
            addSqlDialog: false, // 添加 sql用例状态
            addCaseDialog: false, // 添加 case用例状态
            pageTotal: 0, // 分页数据长度
            tabEditIndex: 0, // 编辑tab切换状态
            listIndex: -1, // 编辑当前项
            carryOut: false, //执行弹出框状态
            editDialog: false, //编辑弹出框状态
            paginationIndex: 1 //分页默认 第1页
        };
    },
    created() {
        console.log('初次进入页面渲染接口数据');
        this.getData();
        this.get_api_name();
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
        // 上传文件方法
        uploadFiles(param) {
            let formData = new FormData();
            formData.append('ModelName', param.file);
            let file = param.file;
            this.$api
                .uploadFile(formData, file)
                .then((res) => {
                    this.$message.success(res.msg);
                    this.$set(this.params, 'page', 1);
                    this.getData();
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        // 上传Postman的json文件
        importPostmanData(param) {
            let formData = new FormData();
            formData.append('postman_file', param.file);
            this.$api
                .importPostmanData(formData)
                .then((res) => {
                    if (res.code == 0) {
                        this.$message({
                            type: 'success',
                            message:
                                '成功上传' +
                                res.success_insert_count +
                                '条，失败上传' +
                                res.fail_insert_count +
                                '条，共操作' +
                                (res.success_insert_count + res.fail_insert_count) +
                                '条'
                        });
                        this.getData();
                    } else {
                        this.$message.error('上传失败');
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
        },
        // 添加用例
        getformcase(e) {
            // this.addCaseDialog = false;
            this.$api
                .add_case(e)
                .then((res) => {
                    if (res.code == 0) {
                        this.$message.success(res.msg);
                        this.$set(this.params, 'page', 1);
                        this.getData();
                        this.addCaseDialog = false;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(err.msg);
                });
        },
        getformsql(e) {
            // console.log(new FormData(e), '获得添加sql后表单');
            // let form = new FormData(e);
            console.log('eeee', e);
            e.ApiDependencys = {
                key: e.ApiDependencys[0].key,
                value: e.ApiDependencys[0].value,
                regular: e.ApiDependencys[0].regular
            };
            // let ApiDependencys = {};
            // e.ApiDependencys.map(item => {
            //     ApiDependencys = item;
            // });
            // e.ApiDependencys = ApiDependencys;
            let params = { ...e };
            console.log('params:', params);
            this.$api
                .add_sqlcase(params)
                .then((res) => {
                    if (res.code == 0) {
                        this.$message.success(res.msg);
                        this.$set(this.params, 'page', 1);
                        this.getData();
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
            this.addSqlDialog = false;
        },
        getCarryOut(e) {
            console.log(e, '获得执行后表单');
            this.carryOut = false;

            // 参数储存本地
            localStorage.setItem('host_addr', e.host_addr);
            localStorage.setItem('id', e.id);
            // 跳转用例结果页
            this.$router.push({ path: '/testCarryOutCase' });
        },
        // 修改用例
        getEdit(e) {
            console.log('event入参', e);
            // this.editDialog = false;
            // this.editsqlDialog = false;
            console.log(e.get('file'));
            // 修改测试用例
            this.$api
                .modify_case(e)
                .then((res) => {
                    if (res.code == 0) {
                        // this.$set(this.params, 'page', 1);
                        this.getData();
                        this.$message.success(res.msg);
                        this.editDialog = false;
                        this.editsqlDialog = false;
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
            this.addCaseDialog = false;
            this.addSqlDialog = false;
            this.editsqlDialog = false;
            this.carryOut = false;
            this.formCarryOut = {};
            this.editDialog = false;
            this.formEdit = {
                method: 'get', // 请求方式
                status: 2, // 状态
                headers: [{}], //  请求头数组
                params: [{ files: [] }], //  请求参数 数组
                data: [{}], //  data 数组
                asserts: [{}], //  Assert 数组
                ApiDependencys: {}, //  API Dependency 数组
                switchAssert: false, //  Assert 开关
                switchApi: false, //  API Dependency 开关
                textarea: '' // Body Data 文本域
            };
        },
        // 添加case新增用例
        addCase() {
            this.get_api_name();
            this.addCaseDialog = true;
            // 调用子组件的方法 addCase 清空formcase表单重置内容
            this.$refs.addCase.openAdd();
        },
        // 添加sql用例
        addSql() {
            this.addSqlDialog = true;
        },
        // 执行弹出层
        onCarryOut(index, row) {
            this.carryOut = true;
            this.formCarryOut.id = row.id;
            this.get_host();
            console.log(this.formCarryOut, '执行前的表单');
        },
        // 查询host (执行用例>选环境)
        get_host() {
            this.$api
                .get_host()
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
        // 修改 弹出层
        handleEdit(index, row) {
            console.log('row:', row);
            this.rows = row;
            console.log('this.rows', this.rows);
            if (row.method == 'sql') {
                this.editsqlDialog = true;
            } else {
                this.editDialog = true;
            }
            this.listIndex = index;
            let cid = row.id;
            // 请求参数
            this.$api
                .get_caseinfo({ cid: cid })
                .then((res) => {
                    if (res.code == 0) {
                        this.formEdit.id = cid;
                        this.formEdit.case_name = res.data.case_name;
                        this.formEdit.api_id = res.data.api_name;
                        this.formEdit.method = res.data.method;

                        if (JSON.stringify(res.data.headers) != '{}' && res.data.headers != '{}') {
                            this.formEdit.headers = res.data.headers;
                        } else {
                            this.formEdit.headers = [{}];
                        }

                        if (res.data.method == 'post-body') {
                            this.tableData.forEach((e) => {
                                if (e.id == cid) {
                                    this.formEdit.textarea = e.params;
                                }
                            });
                        } else {
                            if (JSON.stringify(res.data.params) != '{}' && res.data.params != '{}') {
                                this.formEdit.params = res.data.params;
                                this.formEdit.params.forEach((item) => {
                                    item.files = item.files ? item.files : [];
                                });
                            } else {
                                this.formEdit.params = [{ files: [] }];
                            }
                        }

                        if (JSON.stringify(res.data.data) != '{}' && res.data.data != '{}') {
                            this.formEdit.data = res.data.data;
                        } else {
                            this.formEdit.data = [{}];
                        }

                        if (JSON.stringify(res.data.asserts) != '{}' && res.data.asserts != '{}') {
                            this.formEdit.asserts = res.data.asserts;
                            this.formEdit.switchAssert = true;
                        } else {
                            this.formEdit.asserts = [{}];
                            this.formEdit.switchAssert = false;
                        }

                        if (JSON.stringify(res.data.ApiDependencys) != '{}' && res.data.ApiDependencys != '{}') {
                            this.formEdit.ApiDependencys = res.data.ApiDependencys;
                            this.formEdit.switchApi = true;
                        } else {
                            this.formEdit.ApiDependencys = {};
                            this.formEdit.switchApi = false;
                        }

                        this.formEdit.caselevel = res.data.caselevel;
                        this.formEdit.case_desc = res.data.case_desc;
                        this.formEdit.wait_time = res.data.wait_time;
                        this.formEdit.status = res.data.status;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(err.msg);
                });
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
                        this.delete_case(str);
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
        delete_case(e) {
            let params = {
                ids: e
            };
            this.$api
                .delete_case(params)
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
                    this.delete_case(params);
                    this.tableData.splice(index, 1);
                })
                .catch(() => {});
        },
        // 获取 接口数据
        getData() {
            // 请求参数
            this.$api
                .cases_search(this.params)
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
        // 获取接口名称
        get_api_name() {
            // 请求参数
            this.$api
                .get_api_name({})
                .then((res) => {
                    if (res.code == 0) {
                        this.apiName = res.data;
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
            if (code == 13 && path == '/testCase') {
                this.handleSearch();
            }
        },
        // 触发搜索按钮
        handleSearch() {
            console.log(this.params, '获取搜索数据');
            this.$set(this.params, 'page', 1);
            this.getData();
        },
        // 重置
        onRes() {
            this.params = {};
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
        changeFocus3(val) {
            if (val) {
                this.$refs.select3.focus();
            } else {
                this.$refs.select3.blur();
            }
        },
        // 多选监听
        handleSelectionChange(val) {
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
.el-upload {
    opacity: 0;
    right: 130px;
    cursor: pointer;
    position: absolute;
    width: 70px;
    line-height: 35px;
    height: 32px;
    z-index: 99;
    background: #ff0000;
    overflow: hidden;
}
.el-upload2 {
    opacity: 0;
    right: 10px;
    cursor: pointer;
    position: absolute;
    width: 120px;
    line-height: 35px;
    height: 32px;
    z-index: 99;
    background: #ff0000;
    overflow: hidden;
}
</style>
