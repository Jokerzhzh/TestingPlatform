<template>
    <div>
        <div class="container">
            <!-- <div class="head-box">
                <el-form :model="params" label-width="110px">
                    <el-form-item label="数据库类型" class="mr10">
                        <el-input v-model="params.db_type"></el-input>
                    </el-form-item>
                    <el-form-item label="数据库配置名称" class="mr10">
                        <el-input v-model="params.custom_db_name"></el-input>
                    </el-form-item>
                    <el-form-item label="数据库名称" class="mr10">
                        <el-input v-model="params.db_name"></el-input>
                    </el-form-item>
                    <el-form-item label="数据库ip" class="mr10">
                        <el-input v-model="params.db_ip"></el-input>
                    </el-form-item>
                </el-form>
                <div class="head-box mb10" style="float: left;">
                    <el-button type="primary" @click="handleSearch">搜索</el-button>
                </div>
            </div> -->

            <div class="handle-box">
                <el-input v-model="params.custom_db_name" placeholder="数据库配置名称" class="handle-input mr10"></el-input>
                <el-input v-model="params.db_name" placeholder="数据库名称" class="handle-input mr10"></el-input>
                <el-button-group>
                    <el-button type="primary" @click="handleSearch">搜索</el-button>
                    <el-button type="primary" icon="el-icon-delete" class="handle-del mr10" @click="delAllSelection">批量删除</el-button>
                    <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addSql">添加Sql</el-button>
                </el-button-group>
            </div>
            <br />
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column label="Sqlid">
                    <template slot-scope="scope">{{ scope.row.id }}</template>
                </el-table-column>
                <el-table-column label="数据库配置名称">
                    <template slot-scope="scope">{{ scope.row.custom_db_name }}</template>
                </el-table-column>
                <el-table-column label="数据库ip">
                    <template slot-scope="scope">{{ scope.row.db_ip }}</template>
                </el-table-column>
                <el-table-column label="数据库名称">
                    <template slot-scope="scope">{{ scope.row.db_name }}</template>
                </el-table-column>
                <el-table-column label="数据库类型">
                    <template slot-scope="scope">{{ scope.row.db_type }}</template>
                </el-table-column>
                <el-table-column label="类型名称">
                    <template slot-scope="scope">{{ scope.row.db_typename }}</template>
                </el-table-column>
                <el-table-column label="数据库端口号">
                    <template slot-scope="scope">{{ scope.row.db_port }}</template>
                </el-table-column>
                <el-table-column label="数据库名称">
                    <template slot-scope="scope">{{ scope.row.db_user }}</template>
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

        <!-- 添加sql弹出框 -->
        <el-dialog title="添加sql" @close="closeDialog" custom-class="add-el-dialog" :visible.sync="isAddSql" width="40%">
            <el-form ref="form" :model="formAdd" label-width="110px">
                <el-form-item label="配置名称">
                    <el-input v-model="formAdd.custom_db_name" @input="change($event)"></el-input>
                </el-form-item>
                <el-form-item label="数据数据库名称">
                    <el-input v-model="formAdd.db_name" @input="change($event)"></el-input>
                </el-form-item>
                <el-form-item label="Host地址">
                    <el-input v-model="formAdd.db_ip" @input="change($event)"></el-input>
                </el-form-item>
                <el-form-item label="数据库端口号">
                    <el-input v-model="formAdd.db_port" @input="change($event)"></el-input>
                </el-form-item>
                <el-form-item label="数据库账号">
                    <el-input v-model="formAdd.db_user" @input="change($event)"></el-input>
                </el-form-item>
                <el-form-item label="数据库密码">
                    <el-input v-model="formAdd.db_password" @input="change($event)"></el-input>
                </el-form-item>
                <el-form-item label="数据类型">
                    <el-input v-model="formAdd.db_type" @input="change($event)"></el-input>
                </el-form-item>
                <el-form-item label="类型名称">
                    <el-input v-model="formAdd.db_typename" @input="change($event)"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isAddSql = false">取 消</el-button>
                <el-button type="primary" @click="submitAddSql">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑sql信息" @close="closeDialog" custom-class="add-el-dialog" :visible.sync="isEdit" width="40%">
            <el-form ref="form" :model="formEdit" label-width="110px">
                <el-form-item label="配置名称">
                    <el-input v-model="formEdit.custom_db_name" @input="change($event)"></el-input>
                </el-form-item>
                <el-form-item label="数据数据库名称">
                    <el-input v-model="formEdit.db_name" @input="change($event)"></el-input>
                </el-form-item>
                <el-form-item label="Host地址">
                    <el-input v-model="formEdit.db_ip" @input="change($event)"></el-input>
                </el-form-item>
                <el-form-item label="数据库端口号">
                    <el-input v-model="formEdit.db_port" @input="change($event)"></el-input>
                </el-form-item>
                <el-form-item label="数据库账号">
                    <el-input v-model="formEdit.db_user" @input="change($event)"></el-input>
                </el-form-item>
                <el-form-item label="数据库密码">
                    <el-input v-model="formEdit.db_password" @input="change($event)"></el-input>
                </el-form-item>
                <el-form-item label="数据类型">
                    <el-input v-model="formEdit.db_type" @input="change($event)"></el-input>
                </el-form-item>
                <el-form-item label="类型名称">
                    <el-input v-model="formEdit.db_typename" @input="change($event)"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isEdit = false">取 消</el-button>
                <el-button type="primary" @click="submitEdit">确 定</el-button>
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
            tableData: [],
            multipleSelection: [],
            isEdit: false, // 是都显示编辑弹层
            isAddSql: false, //添加sql
            pageTotal: 0,
            formSql: {}, // 搜索填写信息
            formEdit: {}, // 编辑信息
            formAdd: {}, //添加sql
            listIndex: -1,
            paginationIndex: 1 //分页默认 第1页
        };
    },
    created() {
        this.getData();
    },
    mounted() {
        // 绑定enter事件
        // document.addEventListener("keyup", this.enterKey);
    },
    destroyed() {
        // 销毁enter事件
        // document.removeEventListener("keyup", this.enterKey);
    },
    methods: {
        getData() {
            // 数据库mysql连接信息查询和获取
            this.$api
                .get_sql(this.params)
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
        handleSearch() {
            this.$set(this.params, 'page', 1);
            this.getData();
        },
        // 添加SQL
        addSql() {
            this.isAddSql = true;
        },
        // 全局回车搜索
        // enterKey(event){
        //     const code = event.keyCode;
        //     const path = this.$route.path;
        //     if (code == 13 && path == '/testDatabase') {
        //         this.handleSearch();
        //     }
        // },
        // 触发搜索按钮
        // handleSearch() {
        //     console.log(this.params,'获取搜索数据')

        //     this.$set(this.params, 'page', 1);
        //     this.getData();
        //     this.params = {
        //         page:1,
        //         page_size:10,
        //     }
        // },
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
                    this.del_sql(params);
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
                        this.del_sql(str);
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
        del_sql(e) {
            let params = {
                ids: e
            };
            this.$api
                .del_sql(params)
                .then((res) => {
                    if (res.code == 0) {
                        this.$message.success(res.msg);
                        this.$set(this.params, 'page', this.paginationIndex);
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
        closeDialog() {
            this.isEdit = false;
            this.isAddSql = false;
            this.formEdit = {};
            this.formAdd = {};
        },
        // 重新渲染 input 可编辑操作
        change() {
            this.$forceUpdate();
        },
        // 编辑操作
        handleEdit(index, row) {
            this.listIndex = index;

            this.formEdit.ids = row.id;
            this.formEdit.custom_db_name = row.custom_db_name;
            this.formEdit.db_name = row.db_name;
            this.formEdit.db_ip = row.db_ip;
            this.formEdit.db_port = row.db_port;
            this.formEdit.db_user = row.db_user;
            this.formEdit.db_password = row.db_password;
            this.formEdit.db_type = row.db_type;
            this.formEdit.db_typename = row.db_typename;

            this.isEdit = true;
        },
        // 修改接口
        updata_sql() {
            this.$api
                .updata_sql(this.formEdit)
                .then((res) => {
                    console.log(res, 'qqqqqqqqqq');
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
        // 保存编辑
        submitEdit() {
            console.log(this.formEdit, '修改后的编辑');
            this.isEdit = false;
            this.updata_sql();
        },
        // 添加sql
        add_sql() {
            this.$api
                .add_sql(this.formAdd)
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
        },
        // 添加SQL提交
        submitAddSql() {
            this.isAddSql = false;
            this.add_sql();
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
.head-box {
    overflow: hidden;
    .el-form-item {
        margin-bottom: 10px;
        float: left;
    }
    .el-input {
        width: 220px;
    }
    .el-select {
        width: 120px;
    }
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 200px;
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
.mb10 {
    margin-bottom: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
