<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-input
                    v-model="params.page_name"
                    placeholder="页面名称"
                    class="handle-input mr10"
                    clearable
                    @input="change($event)"
                ></el-input>
                <el-input
                    v-model="params.step_name"
                    placeholder="步骤名称"
                    class="handle-input mr10"
                    clearable
                    @input="change($event)"
                ></el-input>
                <el-button type="primary" @click="handleSearch()">搜 索</el-button>
                <el-button @click="onReload()">重 置</el-button>
                <el-button type="primary" icon="el-icon-plus" @click="showAddStep">添 加</el-button>
                <el-button type="warning" icon="el-icon-delete" @click="deleteAllStep()">批量删除</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" width="50" align="center">
                    <template slot-scope="scope">{{ scope.row.id }}</template>
                </el-table-column>
                <el-table-column prop="project" label="项目名称" align="center" width="160px">
                    <template slot-scope="scope">{{ scope.row.project }}</template>
                </el-table-column>
                <el-table-column prop="piter" label="项目迭代" align="center" width="160px">
                    <template slot-scope="scope">{{ scope.row.piter }}</template>
                </el-table-column>
                <el-table-column prop="page_name" label="页面名称" align="center" width="160px">
                    <template slot-scope="scope">{{ scope.row.page_name }}</template>
                </el-table-column>
                <el-table-column prop="step_name" label="步骤名称" align="center" width="160px">
                    <template slot-scope="scope">{{ scope.row.step_name }}</template>
                </el-table-column>
                <el-table-column prop="element_name" label="元素名称" align="center" width="160px">
                    <template slot-scope="scope">{{ scope.row.element_name }}</template>
                </el-table-column>
                <el-table-column prop="fix_method" label="定位方法" align="center" width="160px">
                    <template slot-scope="scope">{{ scope.row.fix_method }}</template>
                </el-table-column>
                <el-table-column prop="action_info" label="定位值字符串" align="center" width="160px">
                    <template slot-scope="scope">{{ scope.row.action_info }}</template>
                </el-table-column>
                <el-table-column prop="action_method" label="执行动作" align="center" width="160px">
                    <template slot-scope="scope">{{ scope.row.action_method }}</template>
                </el-table-column>
                <el-table-column prop="action_desc" label="动作描述" align="center" width="160px">
                    <template slot-scope="scope">{{ scope.row.action_desc }}</template>
                </el-table-column>
                <el-table-column prop="action_value" label="执行数据" align="center" width="160px">
                    <template slot-scope="scope">{{ scope.row.action_value }}</template>
                </el-table-column>
                <el-table-column prop="action_raise" label="执行步骤断言" align="center" width="160px">
                    <template slot-scope="scope">{{ scope.row.action_raise }}</template>
                </el-table-column>
                <el-table-column label="操作" width="120" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button
                            style="margin-top: 5px"
                            type="primary"
                            size="mini"
                            icon="el-icon-edit-outline"
                            @click="showModifyStep(scope.$index, scope.row)"
                            >编 辑
                        </el-button>
                        <br />
                        <!-- <el-button style="margin-top: 5px" type="danger" size="mini" icon="el-icon-delete" @click="deleteStep(scope.row.id)"
                            >删 除</el-button
                        > -->
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
        <!-- 添加步骤 / 编辑步骤 -->
        <!-- :before-close="handleClose" -->
        <el-dialog :title="steptitle" @close="closeStep()" custom-class="add-el-dialog" :visible.sync="isStep" width="40%">
            <el-form ref="form" :model="stepData" label-width="110px">
                <el-form-item label="项目名称" prop="project" :rules="[{ required: true, message: '请选择项目', trigger: 'blur' }]">
                    <el-select
                        filterable
                        clearable
                        width="100%"
                        v-model="stepData.project"
                        placeholder="请选择项目"
                        class="handle-select mr99"
                        @change="selectProject"
                    >
                        <el-option
                            v-for="item in projectList"
                            :key="item.pid"
                            :label="item.pname"
                            :value="item.pname"
                            @input="change($event)"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="项目迭代" prop="piter" :rules="[{ required: true, message: '请选择迭代', trigger: 'blur' }]">
                    <el-select
                        filterable
                        clearable
                        width="100%"
                        v-model="stepData.piter"
                        :disabled="!stepData.project"
                        placeholder="请选择迭代"
                        class="handle-select mr99"
                        @change="getPageName"
                    >
                        <el-option
                            v-for="item in iterationList"
                            :key="item.id"
                            :label="item.project_name"
                            :value="item.project_name"
                            @input="change($event)"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <!-- <el-form-item label="页面名称" prop="page_name" :rules="[{ required: true, message: '请输入页面名称', trigger: 'blur' }]">
                    <el-input v-model="stepData.page_name" placeholder="请输入页面名称" @input="change($event)"> </el-input>
                </el-form-item> -->
                <el-form-item label="页面名称" prop="page_name" :rules="[{ required: true, message: '请选择页面名称', trigger: 'blur' }]">
                    <el-select
                        filterable
                        clearable
                        width="100%"
                        v-model="stepData.page_name"
                        :disabled="!stepData.piter"
                        placeholder="请选择页面"
                        class="handle-select mr99"
                        @change="getPageElement"
                    >
                        <el-option v-for="item in pageNameList" :key="item" :label="item" :value="item" @input="change($event)"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="步骤名称"
                    prop="step_name"
                    :rules="[{ required: true, message: '请输入步骤名称', trigger: ['blur', 'change'] }]"
                >
                    <el-input v-model="stepData.step_name" placeholder="请输入步骤名称" @input="change($event)"> </el-input>
                </el-form-item>
                <!-- <el-form-item
                    label="元素名称"
                    prop="element_name"
                    :rules="[{ required: true, message: '请输入元素名称', trigger: 'blur' }]"
                >
                    <el-input v-model="stepData.element_name" placeholder="请输入元素名称" @input="change($event)"> </el-input>
                </el-form-item> -->
                <el-form-item label="元素名称" prop="element_name">
                    <!-- :rules="[{ required: true, message: '请选择元素名称', trigger: 'blur' }]" -->
                    <el-select
                        filterable
                        clearable
                        width="100%"
                        v-model="stepData.element_name"
                        :disabled="!stepData.page_name"
                        placeholder="请选择元素"
                        class="handle-select mr99"
                        @change="getElementInfo"
                    >
                        <el-option
                            v-for="item in elementNameList"
                            :key="item.id"
                            :label="item.element_name"
                            :value="item.id"
                            @input="change($event)"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="定位方法" @change="change($event)">
                    <el-input readonly v-model="stepData.fix_method" placeholder="请选择元素"> </el-input>
                </el-form-item>
                <el-form-item label="定位值字符串" @change="change($event)">
                    <el-input readonly v-model="stepData.action_info" placeholder="请选择元素"> </el-input>
                </el-form-item>
                <!-- <el-form-item
                    label="执行动作"
                    class="action_method"
                    prop="action_method"
                    :rules="[{ required: true, message: '请选择执行动作', trigger: 'change' }]"
                >
                    <span class="get-box">
                        <el-input readonly v-model="stepData.action_method" placeholder="请选择执行动作" @input="change($event)"></el-input>
                        <el-button size="mini" type="success" @click="showChooseAction()">选择动作</el-button>
                    </span>
                </el-form-item> -->
                <el-form-item
                    label="执行动作"
                    prop="action_method"
                    :rules="[{ required: true, message: '请选择执行动作', trigger: 'blur' }]"
                >
                    <el-select v-model="stepData.action_method" placeholder="请选择执行动作" @change="change($event)" filterable clearable>
                        <el-option v-for="item in actionList" :key="item.id" :label="item.action_method" :value="item.action_method">
                            <span style="float: left">{{ item.action_method }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.action_desc }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择文件" prop="file" v-if="this.stepData.action_method == 'upload_file'">
                    <input type="file" id="filepicker" accept="" class="upload_file" />
                </el-form-item>
                <el-form-item label="动作描述">
                    <el-input v-model="stepData.action_desc" placeholder="请输入动作描述" @input="change($event)"> </el-input>
                </el-form-item>
                <el-form-item label="执行数据">
                    <el-input v-model="stepData.action_value" placeholder="请输入执行数据" @input="change($event)"> </el-input>
                </el-form-item>
                <el-form-item label="执行步骤断言">
                    <el-input v-model="stepData.action_raise" placeholder="请输入执行步骤断言" @input="change($event)"> </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeStep()">取 消</el-button>
                <el-button type="primary" @click="submitStep()">确 定</el-button>
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
                page_size: 10
            }, // 步骤页面 分页数据长度
            tableData: [], // 步骤列表数据
            actionList: [], // 执行动作列表数据
            actionValueList: [], // 执行动作中的值列表数据
            multipleSelection: [], // 多选监听
            currentRow: [], // 单选监听
            pageTotal: 0, // 步骤页面 分页数据长度
            pageTotal1: 0, // 动作页面 分页数据长度
            paginationIndex: 1, //步骤页面 分页默认 第1页
            paginationIndex1: 1, //动作页面 分页默认 第1页
            isChooseAction: false, // 选择执行动作
            projectList: [], // 项目列表
            iterationList: [], // 迭代列表
            pageNameList: [], // 页面列表
            elementNameList: [], // 元素列表
            stepData: {
                project: '',
                piter: '',
                page_name: '',
                step_name: '',
                element_name: '',
                fix_method: '',
                action_info: '',
                action_method: '',
                action_desc: '',
                action_value: '',
                action_raise: ''
            }, // 步骤data
            isStep: false, // 添加步骤/编辑步骤
            steptitle: '' // 添加步骤/编辑步骤的title
        };
    },
    created() {
        console.log('初次进入页面渲染接口数据');
        this.getProjectName();
        this.querySteps();
        this.queryAction();
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
        // 查询执行步骤
        querySteps() {
            this.$api
                .query_steps(this.params)
                .then((res) => {
                    if (res.results.code == 0) {
                        this.tableData = res.results.result;
                        this.pageTotal = res.count;
                    } else {
                        this.$message.error(res.results.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(err.results.msg);
                });
        },
        // 查询执行动作
        queryAction() {
            this.$api
                // .query_action(this.params1)
                .query_action()
                .then((res) => {
                    if (res.code == 0) {
                        // this.$message.success(res.results.msg);
                        this.actionList = res.result;
                        // this.pageTotal1 = res.count;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(err.results.msg);
                });
        },
        // 打开添加步骤弹窗
        showAddStep() {
            this.steptitle = '添加步骤';
            this.stepData = {
                project: '',
                piter: '',
                page_name: '',
                step_name: '',
                element_name: '',
                fix_method: '',
                action_info: '',
                action_method: '',
                action_desc: '',
                action_value: '',
                action_raise: ''
            };
            // this.stepData.action_method = '';
            this.isStep = true;
        },
        // 打开修改步骤弹窗
        showModifyStep(index, row) {
            this.steptitle = '编辑步骤';
            this.isStep = true;
            // 执行显示弹出层
            this.listIndex = index;
            // 获取当前的修改的内容项
            this.stepData.id = row.id;
            // 给弹出层内容赋值
            this.stepData.project = row.project;
            this.stepData.piter = row.piter;
            this.stepData.page_name = row.page_name;
            this.stepData.step_name = row.step_name;
            this.stepData.element_name = row.element_name;
            // this.stepData.fix_method = row.fix_method;
            // this.stepData.action_info = row.action_info;
            this.stepData.action_method = row.action_method;
            this.stepData.action_desc = row.action_desc;
            this.stepData.action_value = row.action_value;
            this.stepData.action_raise = row.action_raise;

            this.selectProject1(this.stepData.project);
            this.getPageName1();
            this.getPageElement1(this.stepData.page_name);
        },
        // 关闭添加步骤/修改步骤弹窗
        closeStep() {
            this.isStep = false;
            var test = document.getElementById('filepicker');
            if (test != null) {
                test.value = '';
            }
            // 关闭弹窗时 清除rules表单校验
            this.$refs.form.clearValidate();
            // this.$refs.form.resetFields();
        },
        // 提交 添加步骤/修改步骤
        submitStep() {
            if (!this.stepData.project) {
                this.$message.error('请选择项目');
                return;
            }
            if (!this.stepData.piter) {
                this.$message.error('请选择项目迭代');
                return;
            }
            if (!this.stepData.page_name) {
                this.$message.error('请选择页面');
                return;
            }
            if (!this.stepData.step_name) {
                this.$message.error('请输入步骤名称');
                return;
            }
            // if (!this.stepData.element_name) {
            //     this.$message.error('请选择元素');
            //     return;
            // }
            // if (!this.stepData.action_method || this.stepData.action_method == ' ') {
            if (!this.stepData.action_method) {
                this.$message.error('请选择执行动作');
                return;
            }
            if (this.stepData.action_method == 'upload_file' && document.getElementById('filepicker').files[0] == null) {
                this.$message.error('请选择文件');
                return;
            }
            if (this.steptitle == '添加步骤') {
                this.stepData.element = this.stepData.element_name;
                let formData = new FormData();
                // 项目名称
                formData.append('project', this.stepData.project);
                // 项目迭代
                formData.append('piter', this.stepData.piter);
                // 页面名称
                formData.append('page_name', this.stepData.page_name);
                // 步骤名称
                formData.append('step_name', this.stepData.step_name);
                // 元素名称
                if (!this.stepData.element) {
                    formData.append('element', '');
                } else {
                    formData.append('element', this.stepData.element);
                }
                // 定位方法
                formData.append('fix_method', this.stepData.fix_method);
                // 定位值字符串
                formData.append('action_info', this.stepData.action_info);
                // 执行动作   选择 upload_file 后可选择文件
                formData.append('action_method', this.stepData.action_method);
                // 获取选择的文件信息
                if (this.stepData.action_method == 'upload_file') {
                    let file = document.getElementById('filepicker').files[0];
                    formData.append('file', file);
                }
                // 动作描述
                if (!this.stepData.action_desc) {
                    formData.append('action_desc', '');
                } else {
                    formData.append('action_desc', this.stepData.action_desc);
                }
                // 执行数据
                if (!this.stepData.action_value) {
                    formData.append('action_value', '');
                } else {
                    formData.append('action_value', this.stepData.action_value);
                }
                // 执行步骤断言
                if (!this.stepData.action_raise) {
                    formData.append('action_raise', '');
                } else {
                    formData.append('action_raise', this.stepData.action_raise);
                }
                console.log('🚀 ~ formData', formData);
                this.$api
                    .add_steps(formData)
                    .then((res) => {
                        if (res.code == 0) {
                            this.$message.success(res.msg);
                            this.querySteps();
                            this.isStep = false;
                        } else {
                            this.$message.error(res.msg);
                        }
                    })
                    .catch((err) => {
                        this.$message.error(err.msg);
                    });
            } else {
                let formData = new FormData();
                // 步骤id
                formData.append('id', this.stepData.id);
                // 项目名称
                formData.append('project', this.stepData.project);
                // 项目迭代
                formData.append('piter', this.stepData.piter);
                // 页面名称
                formData.append('page_name', this.stepData.page_name);
                // 步骤名称
                formData.append('step_name', this.stepData.step_name);
                // 判断 this.stepData.element 是否为数字
                if (typeof this.stepData.element_name == 'string') {
                    this.stepData.element = this.stepData.element;
                } else {
                    this.stepData.element = this.stepData.element_name;
                }
                if (!this.stepData.element) {
                    // 元素名称
                    formData.append('element', '');
                } else {
                    formData.append('element', this.stepData.element);
                }
                // 定位方法
                if (!this.stepData.fix_method) {
                    formData.append('fix_method', '');
                } else {
                    formData.append('fix_method', this.stepData.fix_method);
                }
                // 定位值字符串
                if (!this.stepData.action_info) {
                    formData.append('action_info', '');
                } else {
                    formData.append('action_info', this.stepData.action_info);
                }
                // // 定位方法
                // formData.append('fix_method', this.stepData.fix_method);
                // // 定位值字符串
                // formData.append('action_info', this.stepData.action_info);
                // 执行动作  选择 upload_file 后可选择文件
                formData.append('action_method', this.stepData.action_method);
                // 获取选择的文件信息
                if (this.stepData.action_method == 'upload_file') {
                    let file = document.getElementById('filepicker').files[0];
                    formData.append('file', file);
                }
                // 动作描述
                if (!this.stepData.action_desc) {
                    formData.append('action_desc', '');
                } else {
                    formData.append('action_desc', this.stepData.action_desc);
                }
                // 执行数据
                if (!this.stepData.action_value) {
                    formData.append('action_value', '');
                } else {
                    formData.append('action_value', this.stepData.action_value);
                }
                // 执行步骤断言
                if (!this.stepData.action_raise) {
                    formData.append('action_raise', '');
                } else {
                    formData.append('action_raise', this.stepData.action_raise);
                }
                // 动作描述
                // formData.append('action_desc', this.stepData.action_desc);
                // // 执行数据
                // formData.append('action_value', this.stepData.action_value);
                // // 执行步骤断言
                // formData.append('action_raise', this.stepData.action_raise);
                this.$api
                    .modify_step(formData)
                    .then((res) => {
                        if (res.code == 0) {
                            this.$message.success('修改成功！');
                            this.isStep = false;
                            this.querySteps();
                        } else {
                            this.$message.error(res.msg);
                        }
                    })
                    .catch((err) => {
                        this.$message.error(err.msg);
                    });
            }
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
        // 选中项目获取迭代
        selectProject(name) {
            this.$forceUpdate();
            if (!name) {
                this.stepData.piter = '';
                this.stepData.page_name = '';
                this.stepData.element_name = '';
                this.$set(this.stepData, 'fix_method', '');
                this.$set(this.stepData, 'action_info', '');
                return;
            }
            this.stepData.piter = '';
            this.stepData.piter = '';
            this.stepData.page_name = '';
            this.stepData.element_name = '';
            this.$set(this.stepData, 'fix_method', '');
            this.$set(this.stepData, 'action_info', '');
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
        // 获取页面名称
        getPageName(val) {
            this.$forceUpdate();
            if (!val) {
                this.stepData.page_name = '';
                this.stepData.element_name = '';
                this.$set(this.stepData, 'fix_method', '');
                this.$set(this.stepData, 'action_info', '');
                return;
            }
            this.stepData.page_name = '';
            this.stepData.element_name = '';
            this.$set(this.stepData, 'fix_method', '');
            this.$set(this.stepData, 'action_info', '');
            let params = {
                project: this.stepData.project,
                piter: this.stepData.piter
            };
            this.$api
                .get_page_name(params)
                .then((res) => {
                    if (res.code == 0) {
                        // this.pageNameList = res.result;

                        // 页面名称去重
                        let arr = [];
                        res.result.forEach((item) => {
                            // console.log(item.page_name);
                            arr.push(item.page_name);
                        });
                        this.pageNameList = Array.from(new Set(arr));
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(err.msg);
                });
        },
        // 获取页面名称下的元素
        getPageElement(val) {
            this.$forceUpdate();
            if (!val) {
                this.stepData.element_name = '';
                this.$set(this.stepData, 'fix_method', '');
                this.$set(this.stepData, 'action_info', '');
                return;
            }
            this.stepData.element_name = '';
            this.$set(this.stepData, 'fix_method', '');
            this.$set(this.stepData, 'action_info', '');
            let params = {
                project: this.stepData.project,
                piter: this.stepData.piter,
                page_name: val
            };
            this.$api
                .get_page_element(params)
                .then((res) => {
                    if (res.code == 0) {
                        this.elementNameList = res.result;
                        if (this.stepData.element_name) {
                            this.elementNameList.forEach((item) => {
                                if (this.stepData.element_name == item.element_name) {
                                    this.stepData.element = item.id;
                                    this.getElementInfo(this.stepData.element);
                                }
                            });
                        }
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(err.msg);
                });
        },
        // 获取元素信息
        getElementInfo(val) {
            this.$forceUpdate();
            if (!val) {
                this.$set(this.stepData, 'fix_method', '');
                this.$set(this.stepData, 'action_info', '');
                return;
            }
            let params = {
                id: val
            };
            this.$api
                .get_element_info(params)
                .then((res) => {
                    if (res.code == 0) {
                        res.result.forEach((item) => {
                            // 给v-model绑定的输入框赋值不好使  在Vue中双向绑定对象属性时，手动赋值属性后输入框的数据不实时更新
                            // this.stepData.fix_method = item.fix_method;
                            // this.stepData.action_info = item.action_info;

                            // 解决办法：使用$set(object,"prop",value)方法对属性重新设置一遍就显示了，具体代码如下：
                            this.$set(this.stepData, 'fix_method', item.fix_method);
                            this.$set(this.stepData, 'action_info', item.action_info);
                        });
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(err.msg);
                });
        },
        // 编辑时数据查询反显
        // 选中项目获取迭代
        selectProject1(name) {
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
        // 获取页面名称
        getPageName1(val) {
            this.$forceUpdate();
            let params = {
                project: this.stepData.project,
                piter: this.stepData.piter
            };
            this.$api
                .get_page_name(params)
                .then((res) => {
                    if (res.code == 0) {
                        // this.pageNameList = res.result;

                        // 页面名称去重
                        let arr = [];
                        res.result.forEach((item) => {
                            arr.push(item.page_name);
                        });
                        this.pageNameList = Array.from(new Set(arr));
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(err.msg);
                });
        },
        // 获取页面名称下的元素
        getPageElement1(val) {
            this.$forceUpdate();
            let params = {
                project: this.stepData.project,
                piter: this.stepData.piter,
                page_name: val
            };
            this.$api
                .get_page_element(params)
                .then((res) => {
                    if (res.code == 0) {
                        this.elementNameList = res.result;
                        if (this.stepData.element_name) {
                            this.elementNameList.forEach((item) => {
                                if (this.stepData.element_name == item.element_name) {
                                    this.stepData.element = item.id;
                                    this.getElementInfo1(this.stepData.element);
                                }
                            });
                        }
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(err.msg);
                });
        },
        // 获取元素信息
        getElementInfo1(val) {
            this.$forceUpdate();
            let params = {
                id: val
            };
            this.$api
                .get_element_info(params)
                .then((res) => {
                    if (res.code == 0) {
                        res.result.forEach((item) => {
                            // 给v-model绑定的输入框赋值不好使  在Vue中双向绑定对象属性时，手动赋值属性后输入框的数据不实时更新
                            // this.stepData.fix_method = item.fix_method;
                            // this.stepData.action_info = item.action_info;

                            // 解决办法：使用$set(object,"prop",value)方法对属性重新设置一遍就显示了，具体代码如下：
                            this.$set(this.stepData, 'fix_method', item.fix_method);
                            this.$set(this.stepData, 'action_info', item.action_info);
                        });
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(err.msg);
                });
        },
        //  批量删除 步骤
        deleteAllStep() {
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
                let params = {
                    ids: str
                };
                // 二次确认删除
                this.$confirm('确定要删除这' + length + '条吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        this.$api
                            .delete_step(params)
                            .then((res) => {
                                if (res.code == 0) {
                                    this.$message.success(res.msg);
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
            } else {
                this.$message({
                    message: '请选择要删除的步骤',
                    type: 'warning'
                });
            }
        },
        // 删除执行步骤
        deleteStep(id) {
            this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    let params = {
                        ids: [id]
                    };
                    this.$api
                        .delete_step(params)
                        .then((res) => {
                            if (res.code == 0) {
                                this.$message.success(res.msg);
                                this.querySteps();
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
        // 二次确认关闭
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then((_) => {
                    done();
                })
                .catch((_) => {});
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
            this.querySteps();
        },
        // 控制下拉框失去焦点
        changeFocus1(val) {
            if (val) {
                this.$refs.select1.focus();
            } else {
                this.$refs.select1.blur();
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
            this.querySteps();
        },
        // 重新渲染 input 可编辑操作
        change() {
            this.$forceUpdate();
        },
        // 重置查询步骤
        onReload() {
            this.params = {};
            this.querySteps();
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
.add-el-dialog {
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
.modify-el-dialog {
    .el-select {
        width: 95%;
        margin-right: 10px;
    }
    .el-input {
        width: 95%;
        margin-right: 10px;
    }
    .button {
        margin-top: 0px;
        // margin-left: 10px;
    }
}
/deep/.addAction-el-dialog {
    .el-input {
        width: 95%;
        margin-right: 10px;
    }
    .el-dialog__body {
        padding: 10px 20px;
    }
    .el-dialog__footer {
        padding: 0px 20px 20px;
    }
}
/deep/.choose-el-dialog {
    .el-dialog__body {
        padding: 0px 20px;
    }
    .el-dialog__footer {
        padding: 0px 20px 20px;
    }
}
/deep/.actionValue-el-dialog {
    .el-dialog__body {
        padding: 0px 20px;
    }
    .el-dialog__footer {
        padding: 0px 20px 20px;
    }
}
/deep/.change-el-dialog {
    .el-dialog__body {
        padding: 20px 20px;
    }
    .el-dialog__footer {
        padding: 0px 20px 20px;
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
    }
    .el-button {
        margin-right: 0px;
    }
}
.table {
    width: 100%;
    font-size: 14px;
}
.mr99 {
    margin-right: 10px;
    width: 100%;
}
.action_method {
    width: 80%;
}
</style>
