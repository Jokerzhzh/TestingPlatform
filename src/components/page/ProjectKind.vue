<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" @click="onAdd">添加类目</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                height="500"
                size="mini"
                :key="itemKey"
                class="table"
                row-key="GID"
                lazy
                :load="load"
                ref="tree"
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
            >
                <el-table-column prop="group_name" label="分类" width="150" align="center"></el-table-column>
                <el-table-column prop="GID" label="ID">
                    <template slot-scope="scope">{{scope.row.GID}}</template>
                </el-table-column>
                <el-table-column label="更新时间">
                    <template slot-scope="scope">{{scope.row.update_time}}</template>
                </el-table-column>
                <el-table-column label="更新人" align="center" prop="editor"></el-table-column>
                <el-table-column label="操作" width="300">
                    <template slot-scope="scope">
                        <el-button
                            type="primary"
                            @click="onAddSon(scope)"
                            v-if="scope.row.group_type != 3"
                        >添加</el-button>
                        <el-button type="primary" @click="onEdit(scope)">编辑</el-button>
                        <el-button type="danger" @click="onDel(scope)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next,jumper"
                    :current-page="params.page"
                    :page-size="params.page_size"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>-->
        </div>

        <el-dialog
            :title="title"
            :visible.sync="dialogVisible"
            width="40%"
            :before-close="handleClose"
        >
            <div class="public-dialog">
                <el-input
                    type="text"
                    placeholder="请输入内容"
                    maxlength="30"
                    show-word-limit
                    v-model="kindName"
                ></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="onSure">提 交</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'projectManager',
    data() {
        return {
            itemKey: 1,
            params: {
                page: 1,
                page_size: 10
            },
            dialogVisible: false,
            title: '创建类目',
            projectsName: [], // 项目名称搜索
            tableData: [], // 列表数据
            pageTotal: 0, // 数据总条数
            disabled: false,
            kindName: '',
            kindObj: {}
        };
    },
    created() {
        this.getData();
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
        // 删除
        onDel(scope) {
            this.$confirm('此操作将永久删除该类目, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    let formData = new FormData();
                    formData.append('gid', scope.row.GID);
                    this.$api
                        .del_catgory(formData)
                        .then(res => {
                            if (res.code == 0) {
                                this.$message({
                                    message: '类目删除成功',
                                    type: 'success'
                                });
                                // this.$set(this.params, 'page', 1);
                                this.tableData = [];
                                this.getData();
                            } else {
                                this.$message.error(res.msg);
                            }
                        })
                        .catch(err => {
                            this.$message.error('取消删除');
                        });
                    console.log('删除：', scope);
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
        },
        // 确定新增 / 编辑
        onSure() {
            var params = {};
            let scope = { ...this.kindObj };
            console.log('scope:', scope);
            if (this.title == '修改类目') {
                // edit_catgory
                params = {
                    id: scope.row.GID,
                    group_name: this.kindName
                };

                let formData = new FormData();
                formData.append('group_name', this.kindName);

                this.$api
                    .edit_catgory(formData, scope.row.GID)
                    .then(res => {
                        if (res.code == 0) {
                            this.getData();
                        } else {
                            this.$message.error(res.msg);
                        }
                    })
                    .catch(err => {
                        this.$message.error(res.msg);
                    });
            } else {
                console.log('scope:', scope);
                if (!scope.row) {
                    params = {
                        parent_group: 0,
                        group_name: this.kindName,
                        group_type: '1'
                    };
                } else {
                    params = {
                        parent_group: scope.row.GID,
                        group_name: this.kindName,
                        group_type: scope.row.parent_group == 0 ? '2' : '3'
                    };
                }

                this.$api
                    .add_catgory(params)
                    .then(res => {
                        if (res.code == 0) {
                            console.log('返回的：', res);
                            this.getData();
                        } else {
                            this.$message.error(res.msg);
                        }
                    })
                    .catch(err => {
                        this.$message.error(res.msg);
                    });
            }

            // if(!scope.row.children){
            //    scope.row.children = []
            // }
            // scope.row.children.push({
            //   id: Math.random().toFixed(2),
            //   date: '2016-05-01',
            //   name: '我是子集',
            //   address: '我是子集 1519 弄'
            // })
            this.itemKey = Math.random();
            this.dialogVisible = false;
        },
        // 新增字迹
        onAddSon(scope) {
            this.kindName = '';
            this.title = '创建类目';
            this.kindObj = scope;

            this.dialogVisible = true;
        },
        handleClose() {
            this.dialogVisible = false;
        },
        // 新增
        onAdd() {
            this.kindObj = {};
            this.kindName = '';
            this.dialogVisible = true;
            this.title = '创建类目';
        },
        onEdit(scope) {
            this.title = '修改类目';
            this.dialogVisible = true;
            this.kindObj = { ...scope };
            this.kindName = scope.row.group_name;
        },
        getData() {
            console.log('11!!!!!!!');
            // 项目检索状态+列表
            this.$api
                .nopage_catgory({ parent_group: 0 })
                .then(res => {
                    if (res.code == 0) {
                        this.tableData = res.data;
                        this.tableData.forEach((item, index) => {
                            if (item.child_num > 0) {
                                console.log('item:', item);
                                item.hasChildren = true;
                            }
                        });
                        console.log('tableData:', this.tableData);
                        this.pageTotal = res.count;
                        this.params.page_size = res.results.page_size;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch(err => {
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
        load(tree, treeNode, resolve) {
            console.log(tree, treeNode, resolve);
            this.$api
                .nopage_catgory({ parent_group: tree.GID })
                .then(res => {
                    if (res.code == 0) {
                        var tableData = [];
                        tableData = res.data;
                        tableData.forEach((item, index) => {
                            if (item.child_num > 0) {
                                console.log('item:', item);
                                item.hasChildren = true;
                            }
                        });
                        setTimeout(() => {
                            console.log(tree, treeNode, resolve);
                            resolve(tableData);
                        }, 1000);
                        console.log('tableData:', tableData);
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch(err => {
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
.textarea-table {
    height: 80px;
    outline: none;
    width: 100%;
    border: 0px solid transparent;
}
</style>
