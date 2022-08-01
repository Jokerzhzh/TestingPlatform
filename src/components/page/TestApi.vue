<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-select
                    ref="select1"
                    @visible-change="changeFocus1"
                    v-model="params.project_name"
                    @change="changeProjectName"
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
                    v-model="params.module_name"
                    placeholder="选择模块"
                    @change="changeModuleName"
                    class="handle-select mr10"
                >
                    <el-option
                        v-for="item in moduleName1"
                        :key="item.Modules_name"
                        :label="item.Modules_name"
                        :value="item.Modules_name"
                    ></el-option>
                </el-select>
                <el-select
                    ref="select3"
                    @visible-change="changeFocus3"
                    v-model="params.Api_name"
                    filterable
                    placeholder="选择接口"
                    class="handle-select mr10"
                >
                    <el-option v-for="item in ApiName" :key="item.api_name" :label="item.api_name" :value="item.api_name"></el-option>
                </el-select>
                <!-- <el-input v-model="params.Api_name" placeholder="接口名称" class="handle-input mr10"></el-input> -->
                <el-input v-model="params.Api_addr" placeholder="接口地址" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-bottom" @click="pullData">拉取</el-button>
                <el-button type="primary" @click="onReload">重置</el-button>
            </div>
            <div class="handle-box">
                <el-button-group>
                    <el-button type="primary" icon="el-icon-delete" class="handle-del mr10" @click="delAllSelection">批量删除</el-button>
                    <!-- <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addApi">添加</el-button> -->
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
                <el-table-column prop="id" label="Api_id" width="66" align="center">
                    <template slot-scope="scope">{{ scope.row.id }}</template>
                </el-table-column>
                <el-table-column label="所属项目">
                    <template slot-scope="scope">{{ scope.row.project_name }}</template>
                </el-table-column>
                <el-table-column label="所属模块">
                    <template slot-scope="scope">{{ scope.row.modules_name }}</template>
                </el-table-column>
                <el-table-column label="接口名称">
                    <template slot-scope="scope">{{ scope.row.api_name }}</template>
                </el-table-column>
                <el-table-column label="接口地址">
                    <template slot-scope="scope">{{ scope.row.api_addr }}</template>
                </el-table-column>
                <el-table-column label="接口版本">
                    <template slot-scope="scope">{{ scope.row.version }}</template>
                </el-table-column>
                <el-table-column label="接口描述">
                    <template slot-scope="scope">{{ scope.row.api_desc }}</template>
                </el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.status == '1' ? 'success' : 'danger'">
                            {{ scope.row.status == '1' ? '已完成' : '未完成' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)"
                            >编辑</el-button
                        >
                        <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)"
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

        <!-- 添加API出框 -->
        <el-dialog title="新增接口" @close="closeAdd" custom-class="add-el-dialog" :visible.sync="addApiDialog" width="40%">
            <el-form ref="form" :model="formAdd" label-width="70px">
                <el-form-item label="接口名称">
                    <el-input v-model="formAdd.api_name"></el-input>
                </el-form-item>
                <el-form-item label="项目名称">
                    <el-select v-model="formAdd.project_name" placeholder="请选择" @change="changeProjectNameAdd">
                        <el-option
                            v-for="item in projectsName"
                            :key="item.project_name"
                            :label="item.project_name"
                            :value="item.project_name"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="模块名称">
                    <el-select v-model="formAdd.modules" placeholder="请选择">
                        <el-option
                            v-for="item in moduleName2"
                            :key="item.Modules_name"
                            :label="item.Modules_name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="接口地址">
                    <el-input v-model="formAdd.api_addr"></el-input>
                </el-form-item>
                <el-form-item label="接口版本">
                    <el-input v-model="formAdd.version"></el-input>
                </el-form-item>
                <el-form-item label="接口描述">
                    <el-input v-model="formAdd.api_desc"></el-input>
                </el-form-item>
                <!-- <el-form-item label>
                    <el-checkbox-group v-model="addStatus">
                        <el-checkbox label="0" name="type">状态</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>-->
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addApiDialog = false">取 消</el-button>
                <el-button type="primary" @click="addApiSubmit">提交</el-button>
            </span>
        </el-dialog>
        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" @close="closeCompile" custom-class="add-el-dialog" :visible.sync="editVisible" width="40%">
            <el-form ref="form" :model="formCompile" label-width="70px">
                <el-form-item label="接口名称">
                    <el-input v-model="formCompile.api_name" @input="change($event)"></el-input>
                </el-form-item>
                <!-- <el-form-item label="项目名称">
                    <el-select v-model="formCompile.project_name" @input="change($event)" placeholder="请选择" @change="changeProjectNameEdit">
                        <el-option
                        v-for="item in projectsName"
                        :key="item.project_name"
                        :label="item.project_name"
                        :value="{'id':item.id,'project_name':item.project_name}">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="模块名称">
                        <el-select v-model="formCompile.module" value-key="id" @input="change($event)" placeholder="请选择">
                            <el-option 
                            v-for="item in moduleName3" 
                            :key="item.Modules_name" 
                            :label="item.Modules_name" 
                            :value="item.id"></el-option>
                        </el-select>
                </el-form-item>-->
                <el-form-item label="接口地址">
                    <el-input v-model="formCompile.api_addr" @input="change($event)"></el-input>
                </el-form-item>
                <el-form-item label="接口版本">
                    <el-input v-model="formCompile.version" @input="change($event)"></el-input>
                </el-form-item>
                <el-form-item label="接口描述">
                    <el-input v-model="formCompile.api_desc" @input="change($event)"></el-input>
                </el-form-item>
                <!-- <el-form-item label>
                    <el-checkbox-group v-model="editStatus">
                        <el-checkbox label="0" name="type">状态</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>-->
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
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
            // addStatus: false, // 添加复选框状态
            // editStatus: false, // 修改复选框状态
            tableData: [], // 列表数据
            multipleSelection: [], // 多选操作
            editVisible: false, // 编辑弹出框
            addApiDialog: false, // 添加弹出框
            pageTotal: 0, // 数据总条数
            formAdd: {}, // 添加表单
            formCompile: { 'Content-type': 'application/json' }, // 编辑表单
            listIndex: -1, // 选中的当前项
            paginationIndex: 1, //分页默认 第1页
            projectsName: [], // 项目名称搜索
            moduleName1: [], //搜索模块名称
            moduleName2: [], //添加模块名称
            moduleName3: [], //修改模块名称
            ApiName: [] // 接口列表
        };
    },
    created() {
        this.getData();
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
        // 获取列表数据
        getData() {
            this.$api
                .api_search(this.params)
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
        pullData() {
            this.$api
                .pull_api_list()
                .then((res) => {
                    if (res.code == 0) {
                        this.$message({
                            message: `yapi上拉取到${res.numbers}条接口`,
                            type: 'success'
                        });
                        this.getData();
                    } else {
                        this.$message.error(res.results.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.results.msg);
                });
        },
        getProjectName() {
            // 获取项目名称
            this.$api
                .get_project_name({})
                .then((res) => {
                    if (res.code == 0) {
                        this.projectsName = res.result;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        getModuleName1(id) {
            this.moduleName1 = [];
            // 获取模块名称（搜索）
            this.$api
                .get_module_name({ id })
                .then((res) => {
                    if (res.code == 0) {
                        this.moduleName1 = res.result;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        getModuleName2(id) {
            // 获取模块名称（添加）
            this.$api
                .get_module_name({ id })
                .then((res) => {
                    if (res.code == 0) {
                        this.moduleName2 = res.result;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        getModuleName3(id) {
            // 获取模块名称（修改）
            this.$api
                .get_module_name({ id })
                .then((res) => {
                    if (res.code == 0) {
                        this.moduleName3 = res.modules_name_list;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        // 列表选择项目名称监听
        changeProjectName(e) {
            this.$delete(this.params, 'module_name');
            this.params.project_name = e;
            let id;
            this.projectsName.forEach((item) => {
                if (e == item.project_name) {
                    id = item.id;
                }
            });
            this.getModuleName1(id);
        },
        /**
         *根据模块id获取接口名称
         */
        changeModuleName(e) {
            this.$delete(this.params, 'Api_name');
            let mid;
            this.moduleName1.forEach((item) => {
                if (e == item.Modules_name) {
                    mid = parseFloat(item.id);
                }
            });
            // 获取接口
            // 获取模块名称（搜索）
            this.$api
                .get_apiname(mid)
                .then((res) => {
                    if (res.code == 0) {
                        this.ApiName = res.result;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        // 添加选择项目名称监听
        changeProjectNameAdd(e) {
            this.$delete(this.formAdd, 'modules_name');
            this.formAdd.project_name = e;
            let id;
            this.projectsName.forEach((item) => {
                if (e == item.project_name) {
                    id = item.id;
                }
            });
            this.getModuleName2(id);
        },
        // 编辑选择项目名称监听
        changeProjectNameEdit(e) {
            this.$delete(this.formCompile, 'module');
            this.formCompile.project_name = e.project_name;
            this.getModuleName3(e.id);
        },
        // 全局回车搜索
        enterKey(event) {
            const code = event.keyCode;
            const path = this.$route.path;
            if (code == 13 && path == '/testApi') {
                this.handleSearch();
            }
        },
        // 重置
        onReload() {
            this.params = {
                page: 1,
                page_size: 10
            };
            this.moduleName1 = [];
            this.this.ApiName = [];
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
        changeFocus3(val) {
            if (val) {
                this.$refs.select3.focus();
            } else {
                this.$refs.select3.blur();
            }
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
                    this.delete_api(params);
                    this.tableData.splice(index, 1);
                })
                .catch(() => {});
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
                        this.delete_api(str);
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
        // 删除接口
        delete_api(e) {
            let params = {
                ids: e
            };
            this.$api
                .delete_api(params)
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
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 提交添加的API
        addApiSubmit() {
            // if (this.addStatus) {
            //     this.formAdd.status = 1;
            // } else {
            //     this.formAdd.status = 0;
            // }
            this.addApiDialog = false;
            this.add_api(this.formAdd);
        },
        // 添加APi
        addApi() {
            this.addApiDialog = true;
        },
        // 关闭添加API弹层
        closeAdd() {
            // this.addStatus = false;
            this.moduleName2 = []; //添加模块名称
            this.formAdd = {};
        },
        // 新建接口
        add_api(e) {
            this.$api
                .add_api(e)
                .then((res) => {
                    if (res.code == 0) {
                        this.$set(this.params, 'page', 1);
                        this.getData();
                        this.$message.success(res.msg);
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        closeCompile() {
            this.formCompile = { 'Content-type': 'application/json' };
        },
        // 修改接口
        modify_api() {
            this.$api
                .modify_api(this.formCompile)
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
        },
        // 编辑操作
        handleEdit(index, row) {
            this.listIndex = index;
            this.formCompile.api_name = row.api_name;
            // if (row.project_name == '海外站') {
            //     this.getModuleName3(12);
            // } else {
            //     this.getModuleName3(9);
            // }
            this.formCompile.module = row.modules_name;
            this.formCompile.api_addr = row.api_addr;
            this.formCompile.version = row.version;
            this.formCompile.api_desc = row.api_desc;
            this.formCompile.id = row.id;
            // this.editStatus = row.status;
            this.editVisible = true;
        },
        // 保存编辑
        saveEdit() {
            // if (this.editStatus) {
            //     this.formCompile.status = 1;
            // } else {
            //     this.formCompile.status = 0;
            // }
            this.moduleName3.forEach((e) => {
                if (this.formCompile.module == e.Modules_name) {
                    this.formCompile.module = e.id;
                }
            });
            this.editVisible = false;
            console.log(this.formCompile, '0000000000');
            this.modify_api();
            // this.$message.success(`修改第 ${this.listIndex + 1} 行成功`);
            // this.$set(this.params, 'page', 1);
            // this.getData();
        },
        // 重新渲染 input 可编辑操作
        change() {
            this.$forceUpdate();
        },
        // 分页导航
        handlePageChange(val) {
            this.paginationIndex = val;
            this.$set(this.params, 'page', val);
            this.getData();
        }
    }
};
</script>

<style scoped lang="less">
.add-el-dialog {
    .el-select {
        width: 100%;
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
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
