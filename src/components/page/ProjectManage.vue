<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-input style="margin-right: 20px" v-model="case_name" placeholder="请输入用例名称"></el-input>

                <!-- <el-input  v-model="Testers" placeholder="请输入人员名称"></el-input> -->
                <el-select
                    style="margin-right: 20px"
                    v-model="Testers"
                    collapse-tags
                    :filter-method="filterMember"
                    @visible-change="visibleSelect"
                    filterable
                    :clearable="true"
                    placeholder="请选择人员"
                >
                    <el-option v-for="item in userList" :key="item.username" :label="item.username" :value="item.id"></el-option>
                </el-select>
                <el-cascader
                    :key="cascaderKey"
                    ref="belong_group_cascader"
                    style="margin-right: 20px"
                    placeholder="请选择类目"
                    v-model="belong_group"
                    :options="kindList"
                ></el-cascader>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" @click="onAdd">新增用例</el-button>
                <el-button type="primary" @click="onReload">重置</el-button>
                <el-upload
                    class="el-upload project-manage"
                    accept=".xls, .xlsx"
                    ref="upload"
                    id="project_manage_upload"
                    action="string"
                    :http-request="uploadFiles"
                    :show-file-list="false"
                >
                    <el-button type="primary" icon="el-icon-download">导入</el-button>
                </el-upload>
                <el-button type="primary" style="margin-left: 10px" @click="exportFile" icon="el-icon-upload2">导出</el-button>
            </div>
            <el-table :data="tableData" border size="mini" class="table" ref="multipleTable">
                <el-table-column prop="CID" label="用例ID" width="66" align="center"></el-table-column>
                <el-table-column prop="case_name" label="用例名称" width="200"></el-table-column>

                <el-table-column label="所属类目" align="center" width="300">
                    <template slot-scope="scope">
                        <span v-for="(item, index) in scope.row.belong_group" :key="index">
                            <el-tag type>{{ item.group_name }}</el-tag>

                            <span v-if="index != scope.row.belong_group.length - 1">-></span>
                        </span>
                    </template>
                </el-table-column>

                <el-table-column label="状态">
                    <template slot-scope="scope">{{ scope.row.status == false ? '不可用' : '可用' }}</template>
                </el-table-column>

                <el-table-column label="备注">
                    <template slot-scope="scope">{{ scope.row.note }}</template>
                </el-table-column>

                <el-table-column width="220" prop="date" label="创建时间" align="center">
                    <template slot-scope="scope">{{ scope.row.create_time }}</template>
                </el-table-column>
                <el-table-column width="220" prop="date" label="更新时间" align="center">
                    <template slot-scope="scope">{{ scope.row.update_time }}</template>
                </el-table-column>
                <el-table-column label="负责人">
                    <template slot-scope="scope">{{ scope.row.editor }}</template>
                </el-table-column>

                <el-table-column label="操作" width="160" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="onEdit(scope)">编辑</el-button>
                        <el-button type="danger" @click="onDel(scope)">删除</el-button>
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

        <el-dialog :title="title" :visible.sync="dialogVisible" width="80%" :close-on-click-modal="false" :before-close="handleClose">
            <div class="public-dialog">
                <el-card class="box-card">
                    <div class="box-line">
                        <input
                            type="text"
                            placeholder="请输入名称"
                            v-model="dialogObj.case_name"
                            class="project-input"
                            style="width: 80%"
                        />
                    </div>
                    <el-table :data="settableData" border size="mini" class="table" ref="multipleTable" style="margin-top: 10px">
                        <el-table-column prop="id" type="index" label="步骤" width="66" align="center"></el-table-column>
                        <el-table-column prop="name" label="步骤描述">
                            <template slot-scope="scope">
                                <textarea class="textarea-table" v-model="scope.row.test_step" @keyup.tab.end="onSubmit(1, true)" />
                            </template>
                        </el-table-column>
                        <el-table-column label="预期结果">
                            <template slot-scope="scope">
                                <textarea class="textarea-table" v-model="scope.row.pre_result" @keyup.tab.end="onSubmit(1, true)" />
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>

                <el-card class="box-input-card">
                    <el-form status-icon label-width="100px" class="demo-ruleForm" :model="dialogObj" :rules="rules">
                        <el-form-item label="状态">
                            <span v-if="dialogObj.status">可用</span>
                            <span v-else>不可用</span>
                        </el-form-item>
                        <el-form-item label="所属类目" :rules="[{ required: true, message: '请选择所属类目', trigger: 'blur' }]">
                            <el-cascader v-model="dialogObj.belong_group" :options="kindList"></el-cascader>
                        </el-form-item>

                        <!-- <el-form-item label="所属标签"
  :rules="[
      { required: true, message: '请选择所属标签', trigger: 'blur' },
    ]"
  >
    <el-select  placeholder="请选择所属标签">
      <el-option label="已立项" value="shanghai"></el-option>
      <el-option label="进行中" value="beijing"></el-option>
      <el-option label="已结束" value="beijing"></el-option>
    </el-select>
                        </el-form-item>-->

                        <el-form-item label="负责人" prop="editor">
                            <el-input type="text" v-model="dialogObj.editor" @keyup.tab.end="onSubmit(1, true)"></el-input>
                        </el-form-item>

                        <el-form-item label="备注" prop="desc">
                            <textarea
                                class="textarea-input"
                                v-model="dialogObj.note"
                                style="height: 150px"
                                @keyup.tab.end="onSubmit(1, true)"
                            />
                        </el-form-item>
                    </el-form>
                </el-card>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose()">取 消</el-button>
                <el-button @click="onSubmit(0, false)">保存到草稿</el-button>
                <el-button type="primary" @click="onSubmit(1, false)">提 交</el-button>
                <!-- <el-button type="primary" @keyup.enter.up.native="onSubmit(1, false)">提 交</el-button> -->
                <el-button v-if="title == '创建用例'" type="primary" @click="onSubmit(1, true)">提交下一步</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
// import { delete } from 'vue/types/umd';
let id = 0;
export default {
    name: 'projectManager',
    data() {
        var that = this;
        return {
            rules: {
                editor: [{ required: true, message: '请输入内容', trigger: 'blur' }]
            },
            params: {
                page: 1,
                page_size: 10
            },
            case_name: '',
            belong_group: [], // 所属类目id
            cascaderKey: 0, // 级联控件key
            Testers: '',
            dialogObj: {
                case_name: '',
                editor: '',
                status: '',
                belong_group: [] //所属类目
            },
            dialogVisible: false,
            title: '创建用例',
            projectsName: [], // 项目名称搜索
            tableData: [],
            settableData: [
                {
                    test_step: '',
                    pre_result: ''
                },
                {
                    test_step: '',
                    pre_result: ''
                },
                {
                    test_step: '',
                    pre_result: ''
                },
                {
                    test_step: '',
                    pre_result: ''
                },
                {
                    test_step: '',
                    pre_result: ''
                },
                {
                    test_step: '',
                    pre_result: ''
                },
                {
                    test_step: '',
                    pre_result: ''
                },
                {
                    test_step: '',
                    pre_result: ''
                }
            ], // 列表数据
            pageTotal: 0, // 数据总条数
            disabled: false,
            kindList: [],
            cid: '',
            userList: [] // 人员
        };
    },
    created() {
        this.getData();
        this.getKind();
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
            this.$confirm('此操作将永久删除该类目, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    console.log('scope:', scope);
                    let formData = new FormData();
                    formData.append('cid', scope.row.CID);
                    this.$api
                        .del_caselist(formData)
                        .then((res) => {
                            if (res.code == 0) {
                                this.$message({
                                    message: '删除成功',
                                    type: 'success'
                                });
                                // this.$set(this.params, 'page', 1);
                                this.getData();
                            } else {
                                this.$message.error(res.msg);
                            }
                        })
                        .catch((err) => {
                            this.$message.error(res.msg);
                        });
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
        },
        //  编辑
        onEdit(scope) {
            // this.getKind()
            this.dialogObj.belong_group = [];
            this.settableData = [
                {
                    test_step: '',
                    pre_result: ''
                },
                {
                    test_step: '',
                    pre_result: ''
                },
                {
                    test_step: '',
                    pre_result: ''
                },
                {
                    test_step: '',
                    pre_result: ''
                },
                {
                    test_step: '',
                    pre_result: ''
                },
                {
                    test_step: '',
                    pre_result: ''
                },
                {
                    test_step: '',
                    pre_result: ''
                },
                {
                    test_step: '',
                    pre_result: ''
                }
            ];
            console.log('scope:', scope);
            this.dialogObj.case_name = scope.row.case_name;
            this.dialogObj.note = scope.row.note;
            this.dialogObj.editor = scope.row.editor;
            this.dialogObj.status = scope.row.status;
            this.cid = scope.row.CID;
            scope.row.test_step.forEach((item, index) => {
                this.settableData[index].test_step = item;
                if (scope.row.pre_result[index]) {
                    this.settableData[index].pre_result = scope.row.pre_result[index];
                }
            });
            scope.row.belong_group.forEach((item, index) => {
                this.dialogObj.belong_group.unshift(item.GID);
            });
            console.log('this.dialogObj.belong_group:', this.dialogObj.belong_group);
            this.title = '编辑用例';
            this.dialogVisible = true;
        },

        changeKind(item, data) {
            console.log('进来了！', item);
            for (var i = 0; i < data.length; i++) {
                if (item.GID == data[i].parent_group) {
                    console.log('等于啊！！！》');
                    if (item.children) {
                        item.children.push(data[i]);
                    } else {
                        item.children = [];
                        item.children.push(data[i]);
                    }
                }
            }
        },

        getKind() {
            console.log('11!!!!!!!');
            // 项目检索状态+列表
            this.$api
                .nopage_catgory({})
                .then((res) => {
                    if (res.code == 0) {
                        var array = [];
                        array = res.data;
                        array.forEach((item, index) => {
                            item.value = item.GID;
                            item.label = item.group_name;
                            item.leaf = item.child_num <= 0;
                            if (item.child_num > 0) {
                                this.changeKind(item, array);
                            }
                        });
                        this.kindList = array.filter((item) => {
                            return item.parent_group == 0;
                        });
                        console.log('array:', array);
                        console.log('kindList:', this.kindList);
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        // 提交
        onSubmit(status, visible) {
            var test_step = [];
            var pre_result = [];
            console.log('kindValue:', this.dialogObj.belong_group);
            this.settableData.forEach((item, index) => {
                test_step.push(item.test_step);
                pre_result.push(item.pre_result);
            });
            if (test_step == [] && pre_result == []) {
                this.$message.error('请填写完整步骤和预期结果');
                return;
            }
            if (this.dialogObj.editor == '') {
                this.$message.error('请填写负责人');
                return;
            }
            if (this.dialogObj.belong_group == []) {
                this.$message.error('请填写所属类目');
                return;
            }
            if (this.dialogObj.case_name == '') {
                this.$message.error('请填写用例名称');
                return;
            }
            var params = { ...this.dialogObj };
            params.test_step = test_step;
            params.pre_result = pre_result;
            params.status = status;
            params.belong_group = this.dialogObj.belong_group[this.dialogObj.belong_group.length - 1];
            console.log('params', params, this.dialogObj);
            if (this.title == '创建用例') {
                this.$api
                    .add_caselist(params)
                    .then((res) => {
                        if (res.code == 0) {
                            if (visible == true) {
                                this.projectsName = res.projects_name;
                                this.$message({
                                    message: '创建成功',
                                    type: 'success'
                                });

                                // this.$set(this.params, 'page', 1);
                                // this.getData();
                                this.settableData = [
                                    {
                                        test_step: '',
                                        pre_result: ''
                                    },
                                    {
                                        test_step: '',
                                        pre_result: ''
                                    },
                                    {
                                        test_step: '',
                                        pre_result: ''
                                    },
                                    {
                                        test_step: '',
                                        pre_result: ''
                                    },
                                    {
                                        test_step: '',
                                        pre_result: ''
                                    },
                                    {
                                        test_step: '',
                                        pre_result: ''
                                    },
                                    {
                                        test_step: '',
                                        pre_result: ''
                                    },
                                    {
                                        test_step: '',
                                        pre_result: ''
                                    }
                                ];
                                // this.dialogObj = {};
                                // this.dialogObj.editor = '';
                                this.dialogObj.case_name = '';
                                // this.dialogObj.status = '';

                                // if (this.dialogObj.note) {
                                //     this.dialogObj.note = '';
                                // }
                                // this.dialogObj.note = '';
                                this.title = '创建用例';
                                this.dialogVisible = true;
                                console.log('this.dialogObj', this.dialogObj.belong_group);
                            } else {
                                this.projectsName = res.projects_name;
                                this.$message({
                                    message: '创建成功',
                                    type: 'success'
                                });

                                this.$set(this.params, 'page', 1);
                                this.getData();
                                this.handleClose();
                            }
                        } else {
                            this.$message.error(res.msg);
                        }
                    })
                    .catch((err) => {
                        this.$message.error(res.msg);
                    });
            } else {
                console.log('编辑params:', params);
                params.CID = this.cid;
                this.$api
                    .edit_caselist(params)
                    .then((res) => {
                        if (res.code == 0) {
                            this.projectsName = res.projects_name;
                            this.$message({
                                message: '编辑成功',
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
        handleClose() {
            this.dialogVisible = false;
            this.userList = JSON.parse(localStorage.getItem('userList'));
        },
        // 重置
        onReload() {
            this.case_name = '';
            this.Testers = '';
            this.belong_group = [];
            this.$refs.belong_group_cascader.$refs.panel.clearCheckedNodes();
            ++this.cascaderKey;
            this.$set(this.params, 'page', 1);
            this.getData();
        },
        // 新增
        onAdd() {
            (this.settableData = [
                {
                    test_step: '',
                    pre_result: ''
                },
                {
                    test_step: '',
                    pre_result: ''
                },
                {
                    test_step: '',
                    pre_result: ''
                },
                {
                    test_step: '',
                    pre_result: ''
                },
                {
                    test_step: '',
                    pre_result: ''
                },
                {
                    test_step: '',
                    pre_result: ''
                },
                {
                    test_step: '',
                    pre_result: ''
                },
                {
                    test_step: '',
                    pre_result: ''
                }
            ]),
                (this.dialogObj = {
                    case_name: '',
                    editor: '',
                    status: '',
                    belong_group: [] //所属类目
                });
            this.title = '创建用例';
            this.dialogVisible = true;
        },
        getData() {
            // 项目检索状态+列表
            if (this.case_name != '') {
                this.params.case_name = this.case_name;
            } else {
                delete this.params.case_name;
            }
            if (this.Testers != '') {
                this.params.Testers = this.Testers;
            } else {
                delete this.params.Testers;
            }
            this.params.belong_group = this.belong_group.length > 0 ? this.belong_group[this.belong_group.length - 1] : '';
            // this.params.case_name = this.case_name;
            delete this.params.page_size;
            this.$api
                .get_caselist(this.params)
                .then((res) => {
                    if (res.results.code == 0) {
                        this.tableData = res.results.data;
                        this.pageTotal = res.count;
                        this.params.page_size = res.results.page_size;
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
            this.$api
                .get_project_name({})
                .then((res) => {
                    if (res.code == 0) {
                        this.projectsName = res.projects_name;
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
        // 上传文件方法
        uploadFiles(param) {
            let formData = new FormData();
            formData.append('file', param.file);
            let file = param.file;
            this.$api
                // .importFile(formData, file)
                .importFile(formData)
                .then((res) => {
                    this.$message.success(res.msg);
                    this.$set(this.params, 'page', 1);
                    this.getData();
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        /**
         * 导出文件方法
         */
        exportFile() {
            let params = {
                Testers: this.Testers ? this.Testers : '',
                belong_group: this.belong_group.length > 0 ? this.belong_group[this.belong_group.length - 1] : ''
            };
            this.$api
                .exportFile(params)
                .then((res) => {
                    this.$message.success(res.msg);
                    this.$set(this.params, 'page', 1);
                    console.log('data', res);
                    this.downloadUrl(res.result);
                })
                .catch((err) => {
                    // this.$message.error(err);
                });
        },
        downloadUrl(url) {
            const link = document.createElement('a');
            link.href = url;
            document.body.appendChild(link);
            link.click();
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
/deep/ .el-upload {
    width: 73px;
    height: 32px;
    border: 0;
    margin: 0 0 0 10px;
    transform: translateY(12px);
    .el-upload {
        margin: 0;
        transform: translateY(0);
    }
}
</style>
