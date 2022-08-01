<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-input style="margin-right: 20px" placeholder="请输入需求名称" v-model="requid"></el-input>
                <el-input v-model="caseid" style="margin-right: 20px" placeholder="请输入用例名称"></el-input>
                <el-select
                    style="margin-right: 20px"
                    v-model="packet_usr"
                    filterable
                    placeholder="请选择组装者"
                    :filter-method="filterUser"
                    @visible-change="userVisibleSelect"
                    class="public-form"
                >
                    <el-option v-for="item in userNameList" :key="item.id" :label="item.username" :value="item.id"></el-option>
                </el-select>
                <el-select placeholder="请选择状态" v-model="status" style="margin-right: 20px" class="handle-select mr10">
                    <el-option value="0" label="未执行"></el-option>
                    <el-option value="1" label="执行中"></el-option>
                    <el-option value="2" label="执行失败"></el-option>
                    <el-option value="3" label="线下通过"></el-option>
                    <el-option value="4" label="线上通过"></el-option>
                    <el-option value="5" label="只线上通过"></el-option>
                    <el-option value="6" label="挂起或delay"></el-option>
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
                <el-button type="primary" @click="onReload">重置</el-button>
                <el-button type="primary" @click="onGroup">组合</el-button>
                <!-- <el-button type="primary" @click="onEdit">新增</el-button> -->
            </div>
            <el-table :data="tableData" v-loading="loading" border size="mini" class="table" ref="multipleTable">
                <el-table-column prop="CID" label="用例ID" width="66" align="center"></el-table-column>
                <el-table-column prop="case_name" label="用例名称" width="200"></el-table-column>
                <el-table-column label="需求名称" width="200">
                    <template slot-scope="scope">
                        <span v-for="(item, index) in scope.row.requid" :key="index">{{ item.rname }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="状态" width="120">
                    <template slot-scope="scope">{{ caseStatu(scope.row.case_statu) }}</template>
                </el-table-column>
                <el-table-column label="评审状态" width="150">
                    <template slot-scope="scope">{{ caseAssestStatu(scope.row.assess_status) }}</template>
                </el-table-column>

                <el-table-column label="bug缺陷" width="350">
                    <template slot-scope="scope">
                        <template v-for="(item, index) in scope.row.bug_info.bug_key">
                            <el-tag
                                style="margin-top: 10px; cursor: pointer; margin-right: 5px"
                                @click="goBugLink(item)"
                                :key="index"
                                :type="item.issue_status == 1 ? 'danger' : 'success'"
                                >{{ item.issue_key }}</el-tag
                            >
                        </template>
                    </template>
                </el-table-column>
                <el-table-column label="Bug占比(未关闭/总数)" width="200">
                    <template slot-scope="scope">{{ scope.row.bug_info.not_closed_count }} / {{ scope.row.bug_info.total_count }}</template>
                </el-table-column>

                <el-table-column label="备注" width="200">
                    <template slot-scope="scope">{{ scope.row.note }}</template>
                </el-table-column>

                <el-table-column width="180" prop="date" label="创建时间" align="center">
                    <template slot-scope="scope">{{ scope.row.create_time }}</template>
                </el-table-column>
                <el-table-column width="180" prop="date" label="更新时间" align="center">
                    <template slot-scope="scope">{{ scope.row.update_time }}</template>
                </el-table-column>
                <el-table-column label="负责人">
                    <template slot-scope="scope">
                        <span v-for="(item, index) in scope.row.executor" :key="index">{{ item.username }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="200" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="onEdit(scope.row)">编辑</el-button>
                        <el-button type="danger" @click="onDel(scope.row)">删除</el-button>
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

        <!-- 组合弹窗 -->
        <el-dialog title="组合用例" :visible.sync="dialogGroup" width="80%" :before-close="handleClose" :close-on-click-modal="false">
            <span>所属类目:</span>
            <el-cascader style="margin-left: 10px" v-model="dialogObj.belong_group" :options="kindList"></el-cascader>
            <el-button type="primary" style="margin-left: 10px" @click="getGroupData">查询</el-button>
            <el-button type="primary" @click="onReloadGroup">重置</el-button>

            <el-table
                style="margin-top: 10px"
                :data="tableGroupData"
                v-loading="tableGroupDataLoading"
                border
                height="450"
                size="mini"
                class="table"
                ref="multipleTable"
                @selection-change="handleSelectionChange"
            >
                <el-table-column fixed="left" type="selection" width="55"></el-table-column>
                <el-table-column prop="CID" label="用例ID" width="66" align="center"></el-table-column>
                <el-table-column prop="case_name" label="用例名称" width="200"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">{{ scope.row.case_statu == true ? '可用' : '不可用' }}</template>
                </el-table-column>
                <el-table-column label="备注" width="200">
                    <template slot-scope="scope">{{ scope.row.note }}</template>
                </el-table-column>
                <el-table-column width="220" prop="date" label="创建时间" align="center">
                    <template slot-scope="scope">{{ scope.row.create_time }}</template>
                </el-table-column>
                <el-table-column width="220" prop="date" label="更新时间" align="center">
                    <template slot-scope="scope">{{ scope.row.update_time }}</template>
                </el-table-column>
                <el-table-column label="负责人">
                    <template slot-scope="scope">
                        <span v-for="(item, index) in scope.row.executor" :key="index">{{ item.username }}</span>
                    </template>
                </el-table-column>

                <!-- <el-table-column label="操作" width="200" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="onEdit(scope.row)">编辑</el-button>
                        <el-button type="danger" @click="onDel(scope.row)">删除</el-button>
                    </template>
                </el-table-column>-->
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogGroup = false">取 消</el-button>
                <el-button type="primary" @click="onGroupDialog">组 合</el-button>
            </span>
        </el-dialog>

        <!-- 组合弹窗 需求 项目 下拉 选择 -->
        <el-dialog title="组合" :visible.sync="isGroup" width="50%" :before-close="handleGroupClose" :close-on-click-modal="false">
            <div class="public-dialog">
                <span style="line-height: 30px; margin-right: 10px">所属项目:</span>
                <el-select
                    placeholder="请选择关联项目"
                    v-model="dialogObj.belong_project"
                    filterable
                    @change="changeProject"
                    @visible-change="visibleProjectSelect"
                >
                    <el-option
                        v-for="(item, index) in belongProjectList"
                        :key="index"
                        :label="item.project_name"
                        :value="item.id"
                    ></el-option>
                </el-select>
                <span style="line-height: 30px; margin: 0 10px 0 10px">所属需求:</span>
                <el-select :disabled="dialogObj.belong_project == ''" v-model="dialogObj.require" placeholder="请选择">
                    <el-option v-for="(item, index) in needList" :key="index" :label="item.rname" :value="item.ZID"></el-option>
                </el-select>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isGroup = false">取 消</el-button>
                <el-button type="primary" @click="sureGroup">组合</el-button>
            </span>
        </el-dialog>

        <!-- 用例执行弹窗 -->
        <el-dialog title="编辑用例执行" :visible.sync="dialogVisible" width="80%" :before-close="handleClose" :close-on-click-modal="false">
            <div class="public-dialog">
                <el-card class="box-card">
                    <div class="box-line">
                        <input
                            type="text"
                            v-model="edit.case_name"
                            disabled
                            placeholder="请输入名称"
                            class="project-input"
                            style="width: 80%"
                        />
                    </div>
                    <el-table :data="bugtableData" border size="mini" class="table" ref="multipleTable" style="margin-top: 10px">
                        <el-table-column prop="id" type="index" label="步骤" width="66" align="center"></el-table-column>
                        <el-table-column prop="test_step" label="步骤描述"></el-table-column>
                        <el-table-column label="预期结果" prop="pre_result"></el-table-column>

                        <el-table-column label="执行状态" width="250">
                            <template slot-scope="scope">
                                <div style="display: flex">
                                    <el-select placeholder="请选择" v-model="scope.row.stepStatu">
                                        <el-option
                                            v-for="item in options"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value"
                                        ></el-option>
                                    </el-select>
                                    <el-button
                                        v-show="scope.row.stepStatu == 2"
                                        type="danger"
                                        @click="createdBug(scope)"
                                        size="mini"
                                        style="margin: 0 5px"
                                        >提交bug</el-button
                                    >
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>

                <el-card class="box-input-card">
                    <el-form status-icon label-width="100px" class="demo-ruleForm">
                        <el-form-item label="状态" :rules="[{ required: true, message: '请选择状态', trigger: 'blur' }]">
                            <el-select placeholder="请选择状态" v-model="edit.case_statu">
                                <el-option value="0" label="未执行"></el-option>
                                <el-option value="1" label="执行中"></el-option>
                                <el-option value="2" label="执行失败"></el-option>
                                <el-option value="3" label="线下通过"></el-option>
                                <el-option value="4" label="线上通过"></el-option>
                                <el-option value="5" label="只线上通过"></el-option>
                                <el-option value="6" label="挂起或delay"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="评审状态" :rules="[{ required: true, message: '请选择评审状态', trigger: 'blur' }]">
                            <el-select placeholder="请选择状态" v-model="edit.assess_status">
                                <el-option value="0" label="未评审"></el-option>
                                <el-option value="1" label="评审通过"></el-option>
                                <el-option value="2" label="评审失败待修改"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="评审时间" :rules="[{ required: true, message: '请选择评审时间', trigger: 'blur' }]">
                            <el-date-picker
                                style="width: 180px"
                                v-model="edit.assess_time"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                type="datetime"
                                placeholder="选择日期时间"
                            ></el-date-picker>
                        </el-form-item>

                        <el-form-item
                            label="关联需求ID"
                            prop="checkPass"
                            :rules="[{ required: true, message: '请输入关联需求', trigger: 'blur' }]"
                        >
                            <el-input type="text" autocomplete="off" v-model="edit.requid" disabled></el-input>
                        </el-form-item>

                        <el-form-item label="负责人" prop="checkPass">
                            <el-input type="text" autocomplete="off" v-model="edit.executor" disabled></el-input>
                        </el-form-item>

                        <el-form-item label="备注" prop="desc">
                            <textarea class="textarea-input" v-model="edit.note" style="height: 150px" />
                        </el-form-item>
                    </el-form>
                </el-card>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editSubmit">提 交</el-button>
            </span>
        </el-dialog>

        <!-- bug 弹窗 -->
        <el-dialog title="新建bug" :visible.sync="bugVisible" width="80%" :before-close="closeBug" :close-on-click-modal="false">
            <div class="public-dialog">
                <el-card class="box-card">
                    <div class="box-line" style="margin-bottom: 10px">
                        <input type="text" placeholder="请输入BUG摘要" v-model="bugEdit.summary" class="project-input" style="width: 80%" />
                    </div>
                    <!-- <textarea
                        v-model="bugEdit.description"
                        placeholder="请输入bug描述"
                        style="height:250px;width:100%;outline:none;padding:5px;box-sizing:border-box"
                    />-->
                    <!-- <el-table
                :data="tableData"
                border
                size="mini"
                class="table"
                ref="multipleTable"
                style="margin-top:10px"
            >
                <el-table-column prop="id" type="index" label="步骤" width="66" align="center">
                </el-table-column>
                <el-table-column prop="name" label="步骤描述">
                    <template slot-scope="scope">
                        
                    </template>
                </el-table-column>
                <el-table-column label="预期结果">
                    <template slot-scope="scope">
                        
                    </template>
                </el-table-column>
                  <el-table-column label="实际结果">
                    <template slot-scope="scope">
                        
                    </template>
                </el-table-column>

                  <el-table-column label="执行状态">
                    <template slot-scope="scope">
                    </template>
                </el-table-column>
                    </el-table>-->
                    <div ref="wangeditor" id="wangeditor"></div>
                    <a href="javascript:;" class="file" style="margin-top: 10px">
                        上传附件
                        <input type="file" ref="fileField" name id="fileField" multiple @change="getvalueName()" />
                    </a>
                    <div style="line-height: 40px; margin-left: 20px; font-weight: bolder" v-for="(item, i) in files" :key="i">
                        {{ item.name }}
                    </div>
                </el-card>
                <el-card class="box-input-card">
                    <el-form status-icon label-width="100px" class="demo-ruleForm">
                        <el-form-item label="类型" :rules="[{ required: true, message: '请选择状态', trigger: 'blur' }]">
                            <el-select placeholder="请选择状态" v-model="bugEdit.issuetype">
                                <el-option label="故障" value="10005"></el-option>
                                <!-- <el-option label="故障" value="10004"></el-option> -->
                                <el-option label="任务" value="10002"></el-option>
                                <el-option label="Epic" value="1000"></el-option>
                                <el-option label="故事" value="10001"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="项目" :rules="[{ required: true, message: '请选择项目', trigger: 'blur' }]">
                            <el-select placeholder="请选择项目" @change="selectProject" v-model="bugEdit.project_name">
                                <el-option
                                    v-for="item in projectList"
                                    :key="item.pname"
                                    :label="item.pname"
                                    :value="item.pname"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="迭代项目" :rules="[{ required: true, message: '请选择迭代项目', trigger: 'blur' }]">
                            <el-select placeholder="请选择迭代项目" :disabled="!bugEdit.project_name" v-model="bugEdit.iter_id">
                                <el-option
                                    v-for="item in iterationList"
                                    :key="item.id"
                                    :label="item.project_name"
                                    :value="item.id"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="任务" :rules="[{ required: true, message: '请选择任务', trigger: 'blur' }]">
                            <el-select placeholder="请选择任务" v-model="bugEdit.tid">
                                <el-option
                                    v-for="item in dutyName"
                                    :key="item.task_name"
                                    :label="item.task_name"
                                    :value="item.DID"
                                ></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="优先级" :rules="[{ required: true, message: '请选择优先级', trigger: 'blur' }]">
                            <el-select placeholder="请选择优先级" v-model="bugEdit.priority">
                                <el-option label="Highest" value="Highest"></el-option>
                                <el-option label="High" value="High"></el-option>
                                <el-option label="Medium" value="Medium"></el-option>
                                <el-option label="Low" value="Low"></el-option>
                                <el-option label="Lowest" value="Lowest"></el-option>
                            </el-select>
                        </el-form-item>

                        <!-- <el-form-item label="终端" prop="checkPass"
  :rules="[
      { required: true, message: '请输入终端', trigger: 'blur' },
    ]"
  >
     <el-select v-model="bugEdit.terminal" placeholder="请选择终端" class="public-form">
    <el-option key="安卓" label="安卓" value="安卓"></el-option>
    <el-option key="IOS" label="IOS" value="IOS"></el-option>
    <el-option key="H5" label="H5" value="H5"></el-option>
    <el-option key="后台" label="后台" value="后台"></el-option>
    <el-option key="PC" label="PC" value="PC"></el-option>
  </el-select>
  </el-form-item>
         <el-form-item label="用例名称" prop="checkPass"
  >
  <p>{{caseName}}</p>

                        </el-form-item>-->

                        <el-form-item label="需求名称" prop="checkPass">
                            <p>{{ requName }}</p>
                        </el-form-item>

                        <el-form-item label="发现版本" prop="checkPass">
                            <el-input
                                v-model="bugEdit.discovery_version"
                                type="text"
                                autocomplete="off"
                                placeholder="请输入发现本版"
                            ></el-input>
                        </el-form-item>

                        <el-form-item label="创建人" prop="checkPass">
                            <p>{{ username }}</p>
                        </el-form-item>
                        <el-form-item label="指派" prop="checkPass">
                            <el-select
                                v-model="bugEdit.assignee"
                                filterable
                                placeholder="请选择指派人选"
                                @visible-change="visibleSelect"
                                class="public-form"
                            >
                                <!-- :filter-method="filterMember" -->
                                <el-option
                                    v-for="item in userList"
                                    :key="item.ID"
                                    :label="item.display_name"
                                    :value="item.user_name"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </el-card>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="bugVisible = false">取 消</el-button>
                <el-button type="primary" :disabled="isDisabled" @click="onSubmitBug">提 交</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
// import { delete } from 'vue/types/umd';
import E from 'wangeditor';
export default {
    name: 'projectManagerDetails',
    data() {
        return {
            multipleSelection: [],
            isGroup: false,
            dialogObj: {
                belong_project: '',
                require: '',
                belong_group: ''
            },
            needList: [],
            belongProjectList: [],
            tcid: '',
            dialogGroup: false,
            loading: true,
            tableGroupDataLoading: false,
            isDisabled: false,
            caseName: '',
            username: '',
            requName: '',
            userList: [],
            projectList: [],
            iterationList: [],
            bugtableData: [],
            tableGroupData: [],
            requid: '',
            caseid: '',
            packet_usr: '',
            status: '', // 搜索状态
            dutyName: [],
            fileName: '',
            files: [],
            bugVisible: false,
            addbug: {
                terminal: ''
            },
            edit: {
                case_name: '',
                case_statu: '',
                executor: '',
                belong_group: [],
                requid: '',
                note: '',
                stepStatu: [],
                assess_status: '',
                assess_time: ''
            },
            bugEdit: {
                project_name: '', //项目名称
                iter_id: '', // 迭代项目
                summary: '', //bug摘要
                issuetype: '', //类型
                description: '', //bug描述
                priority: '', //优先级
                assignee: '', //指派
                cid: '', //用例ID
                rid: '', //需求ID
                tid: '', //任务ID
                discovery_version: '', //发现版本号
                terminal: '' //终端
            },
            kindList: [],
            params: {
                page: 1
            },
            bugParams: {},
            dialogVisible: false,
            title: '创建项目',
            projectsName: [], // 项目名称搜索
            tableData: [], // 列表数据
            pageTotal: 0, // 数据总条数
            disabled: false,
            options: [
                {
                    value: '0',
                    label: '未执行'
                },
                {
                    value: '1',
                    label: '执行完成'
                },
                {
                    value: '2',
                    label: '执行失败'
                },
                {
                    value: '3',
                    label: '延迟'
                }
            ],
            editor: null, // 富文本对象
            editorContent: '', // 富文本内容
            description_img: [], // 图片src集合
            belong_group: [], // 所属类目id
            cascaderKey: 0, // 级联控件key
            userNameList: []
        };
    },
    created() {
        // if (this.$route.query) {
        this.requid = this.$route.query.rqname;
        this.getData();
        // }
        this.getKind();
        this.group_to_user();
        this.belongProject();
        this.getjiraUser();
    },
    mounted() {
        this.username = this.$store.state.username;
        // 绑定enter事件
        document.addEventListener('keyup', this.enterKey);
        this.userNameList = JSON.parse(localStorage.getItem('userList'));
    },
    destroyed() {
        // 销毁enter事件
        document.removeEventListener('keyup', this.enterKey);
    },
    watch: {
        // $route(to, from) {
        //     this.$router.go(0);
        // }
        // requid(n) {
        //     if (n) {
        //         console.log('n', n);
        //         this.getData();
        //     }
        // }
        $route(to, from) {
            // 监听路由中的 path 是否为此页面
            if (to.path === '/testUsecaseDetails') {
                //监听路由是否变化
                if (to.query.rqname != from.query.rqname) {
                    this.requid = to.query.rqname;
                    this.getData();
                }
            }
        },
        bugVisible(val) {
            // if (this.editor) this.editor.textSelector = this.bugEdit.description;
            if (val && !this.editor) {
                setTimeout(() => {
                    // 新增上传文件的富文本编辑器
                    this.editor = new E(this.$refs.wangeditor);
                    this.editor.config.uploadImgShowBase64 = true;
                    this.editor.config.placeholder = '请输入bug描述或粘贴图片';
                    // 编辑器的事件，每次改变会获取其html内容
                    this.editor.config.onchange = (html) => {
                        this.description_img = this.getSrc(html);
                        let textJson = this.editor.txt.getJSON();
                        this.bugEdit.description = '';
                        textJson.forEach((item) => {
                            if (item.tag == 'p' && typeof item.children[0] == 'string') {
                                this.bugEdit.description = this.bugEdit.description
                                    ? this.bugEdit.description + '\n\n' + item.children[0]
                                    : item.children[0];
                            }
                        });
                    };

                    // this.editor.config.linkImgCallback = (src, alt, href) => {
                    //     console.log('图片 src ', src);
                    // };
                    this.editor.config.menus = [
                        'image', // 插入图片
                        'undo', // 撤销
                        'redo' // 重复
                    ];
                    this.editor.create(); // 创建富文本实例
                    this.editor.txt.html(`<p>${this.bugEdit.descriptionOne}</p> <p>${this.bugEdit.descriptionTwo}</p>`);
                }, 0);
            } else if (!val && this.editor) {
                this.editor.destroy();
                this.editor = null;
            }
        }
    },
    methods: {
        changeDuty(e) {
            // this.getjiraUser(e);
        },
        changeRequire(e) {
            // console.log(this.params.rid, e);
            // this.getjiraUser(e);
        },
        // 获取jira 用户
        getjiraUser(data) {
            this.$api
                .get_jira_user({ user: data ? data : '' })
                .then((res) => {
                    if (res.code == 0) {
                        this.userList = [];
                        this.userList = res.result;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        // 前往bug jira
        goBugLink(code) {
            var params = {
                issue_key: code
            };
            console.log('code:', code);
            this.$api
                .issue_detail(params)
                .then((res) => {
                    if (res.code == 0) {
                        window.open(res.issue_detail_url);
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        // 组合选择用例
        handleSelectionChange(val) {
            this.multipleSelection = val;
            console.log('multipleSelection', this.multipleSelection);
        },
        // 确认 组合
        sureGroup() {
            if (this.dialogObj.require == '') {
                this.$message.error('请选择关联需求');
                return;
            }
            var array = [];
            this.multipleSelection.forEach((item, index) => {
                array.push(item.CID);
            });
            let formData = new FormData();
            formData.append('require', this.dialogObj.require);
            formData.append('case_list', array.join(','));
            this.$api
                .excute_group(formData)
                .then((res) => {
                    if (res.code == 0) {
                        this.$message({
                            message: '组合用例成功!',
                            type: 'success'
                        });
                        this.isGroup = false;
                        this.dialogGroup = false;
                        this.bugVisible = false;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        //  重置
        onReload() {
            this.requid = '';
            this.caseid = '';
            this.packet_usr = '';
            this.status = '';
            this.belong_group = [];
            this.$refs.belong_group_cascader.$refs.panel.clearCheckedNodes();
            ++this.cascaderKey;
            this.getData();
        },
        onGroupDialog() {
            if (this.multipleSelection == []) {
                this.$message.error('请先勾选用例');
                return;
            }
            this.isGroup = true;
        },
        // 获取需求列表
        // 选择项目 后 获取需求
        changeProject(callback) {
            this.$api
                .require_project({ belong_project: this.dialogObj.belong_project })
                .then((res) => {
                    if (res.code == 0) {
                        console.log('res:', res);
                        this.needList = res.data;
                        if (callback) {
                            callback();
                        }
                    } else {
                        this.$message.error(res.msg);
                        // this.$message.error('接口返回异常');
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                    // this.$message.error('接口返回异常');
                });
        },
        // 获取所属项目
        belongProject() {
            this.$api
                .project_name({})
                .then((res) => {
                    if (res.code == 0) {
                        this.belongProjectList = res.result;
                    }
                })
                .catch((err) => {
                    // this.$message.error(res.msg);
                });
        },
        // 提交
        editSubmit() {
            var stepStatu = [];
            this.bugtableData.forEach((item, index) => {
                stepStatu.push(item.stepStatu);
            });
            var params = {
                assess_status: this.edit.assess_status,
                assess_time: this.edit.assess_time,
                stepStatu: stepStatu,
                note: this.edit.note,
                case_statu: this.edit.case_statu,
                tcid: this.tcid
            };
            this.$api
                .put_excute(params)
                .then((res) => {
                    if (res.code == 0) {
                        this.$message({
                            message: '编辑用例执行成功!',
                            type: 'success'
                        });
                        // this.$set(this.params, 'page', 1);
                        this.loading = true;
                        this.getData();
                        this.dialogVisible = false;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
            // this.dialogVisible = false
        },
        //  组合查询重置
        onReloadGroup() {
            this.dialogObj.belong_group = '';
            this.tableGroupData = [];
            // this.getGroupData();
        },
        getGroupData() {
            this.tableGroupDataLoading = true;
            // 项目检索状态+列表
            if (this.dialogObj.belong_group != '') {
                this.bugParams.belong_group = this.dialogObj.belong_group[this.dialogObj.belong_group.length - 1];
            } else {
                delete this.bugParams.belong_group;
            }
            // this.params.case_name = this.case_name;
            this.$api
                .get_nocaselist(this.bugParams)
                .then((res) => {
                    if (res.code == 0) {
                        this.tableGroupData = res.data;
                        this.tableGroupDataLoading = false;
                        console.log('tableGroupData', this.tableGroupData, this.tableGroupDataLoading);
                        // this.pageTotal = res.count;
                        // this.params.page_size = res.results.page_size;
                    } else {
                        this.$message.error(res.msg);
                        this.tableGroupDataLoading = false;
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                    this.tableGroupDataLoading = false;
                });
        },
        getDutyName(e) {
            // 获取项目名称
            this.$api.apiChart
                .tname_id(e)
                .then((res) => {
                    if (res.code == 0) {
                        // this.dutyName = res.task_info;
                        res.task_info.map((item) => {
                            item.DID = this.$methods.serchCutOut(item.DID);
                        });
                        this.dutyName = res.task_info;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        onSubmitBug() {
            let formData = new FormData();
            if (this.bugEdit.description == '') {
                this.$message.error('请输入bug描述');
                return;
            }
            if (this.bugEdit.project_name == '') {
                this.$message.error('请选择项目');
                return;
            }
            if (this.bugEdit.iter_id == '') {
                this.$message.error('请选择迭代项目');
                return;
            }
            if (this.bugEdit.summary == '') {
                this.$message.error('请输入bug摘要');
                return;
            }
            if (this.bugEdit.issuetype == '') {
                this.$message.error('请选择类型');
                return;
            }
            if (this.bugEdit.priority == '') {
                this.$message.error('请选择优先级');
                return;
            }
            if (this.bugEdit.tid == '') {
                this.$message.error('请选择任务');
                return;
            }
            // if(this.bugEdit.terminal == '') {
            //     this.$message.error('请选择终端');
            //     return
            // }
            if (this.bugEdit.assignee == '') {
                this.$message.error('请选择指派人员');
                return;
            }

            let files = document.querySelector('input[type=file]').files;
            console.log('filesfilesfilesfiles:', files);
            if (files[0]) {
                // formData.append('attach_path', files[0]);
                // formData.append('attach_path', this.files);
                for (var i = 0; i < this.files.length; i++) {
                    formData.append(`attach_path`, this.files[i]); //`attach_path[${i}]`
                }
            }
            formData.append('project_name', this.bugEdit.project_name);
            formData.append('iter_id', this.bugEdit.iter_id);
            formData.append('summary', this.bugEdit.summary);
            // formData.append('issuetype', 10004);
            formData.append('issuetype', 10004);
            formData.append('description', this.bugEdit.description);
            formData.append('priority', this.bugEdit.priority);
            formData.append('assignee', this.bugEdit.assignee);
            formData.append('cid', this.bugEdit.cid);
            formData.append('tid', this.bugEdit.tid);
            formData.append('rid', this.bugEdit.rid);
            formData.append('discovery_version', this.bugEdit.discovery_version);
            formData.append('terminal', this.bugEdit.terminal);
            formData.append('description_img', JSON.stringify(this.description_img));
            this.isDisabled = true;
            this.$api
                .submit_bug(formData)
                .then((res) => {
                    if (res.code == 0) {
                        this.$message({
                            message: '同步成功!',
                            type: 'success'
                        });
                        this.isDisabled = false;
                        this.bugVisible = false;
                    } else {
                    }
                })
                .catch((err) => {});
        },
        group_to_user() {
            this.$api
                .group_to_user({})
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
            // 项目检索状态+列表
            this.$api
                .nopage_catgory({})
                .then((res) => {
                    console.log('res:', res.code);
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
                        console.log('array:', array);
                        this.kindList = array.filter((item) => {
                            return item.parent_group == 0;
                        });
                        console.log('kindList:', this.kindList);
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        caseStatu(data) {
            switch (data) {
                case 0:
                    return '未执行'; // "
                case 1:
                    return '执行中'; // '
                case 2:
                    return '执行失败'; // `
                case 3:
                    return '线下通过'; // (
                case 4:
                    return '线上通过'; // (
                case 5:
                    return '只线上通过'; // (
                case 6:
                    return '挂起或delay'; // (
            }
        },
        caseAssestStatu(data) {
            switch (data) {
                case 0:
                    return '未评审'; // "
                case 1:
                    return '评审通过'; // '
                case 2:
                    return '评审失败待修改'; // `
            }
        },
        // 组合
        onGroup() {
            // this.getGroupData();

            this.dialogGroup = true;
            this.onReloadGroup();
        },
        closeBug() {
            this.bugVisible = false;
        },
        getvalueName() {
            // console.log('formData', document.getElementById('fileField').files);
            this.fileName = document.getElementById('fileField').files[0];
            this.files.push(this.fileName);
            let fileData = document.getElementById('fileField').files;
            console.log('this.files', this.files, fileData);
        },
        // 创建bug
        createdBug(scope) {
            console.log('scope:', scope);
            this.fileName = '';
            this.bugEdit.project_name = '';
            this.bugEdit.iter_id = '';
            this.bugEdit.summary = '';
            this.bugEdit.issuetype = '';
            this.bugEdit.description = '步骤描述：' + scope.row.test_step + '\n\n' + '预期结果：' + scope.row.pre_result;
            this.bugEdit.descriptionOne = '步骤描述：' + scope.row.test_step;
            this.bugEdit.descriptionTwo = '预期结果：' + scope.row.pre_result;
            this.bugEdit.priority = '';
            this.bugEdit.discovery_version = '';
            this.bugEdit.terminal = '';
            this.bugEdit.assignee = '';
            this.bugEdit.tid = '';
            this.files = [];
            this.bugVisible = true;
        },
        handleClose() {
            this.bugVisible = false;
            this.dialogGroup = false;
            this.dialogVisible = false;
        },
        handleGroupClose() {
            this.isGroup = false;
        },
        // 删除
        onDel(data) {
            console.log('data!!!', data);
            this.$confirm('此操作将永久删除该类目, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    let formData = new FormData();
                    formData.append('requid', data.requid[0].ZID);
                    formData.append('caseid', data.caseid);
                    this.$api
                        .del_excute(formData)
                        .then((res) => {
                            if (res.code == 0) {
                                this.$message({
                                    message: '删除成功',
                                    type: 'success'
                                });
                                // this.$set(this.params, 'page', 1);
                                this.loading = true;
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
        // 编辑
        onEdit(data) {
            console.log('data:', data);
            this.edit.case_name = data.case_name;
            this.bugEdit.cid = data.CID;
            this.bugEdit.rid = data.requid[0].ZID;
            this.edit.executor = data.executor[0].username;
            this.edit.belong_group = data.belong_group;
            this.edit.note = data.note;
            this.caseName = data.case_name;
            this.tcid = data.tcid;
            this.requName = data.requid[0].rname;
            this.edit.requid = data.requid[0].ZID;
            this.edit.case_statu = data.case_statu.toString();
            this.edit.assess_status = data.assess_status.toString();
            this.edit.assess_time = data.assess_time;
            this.bugtableData = [];
            data.test_step.forEach((item, index) => {
                if (item != '' && data.pre_result[index] != '') {
                    this.bugtableData.push({
                        test_step: item,
                        pre_result: data.pre_result[index],
                        stepStatu: data.stepStatu[index].stepStatu.toString()
                    });
                }
            });
            console.log('bugtableData:', this.bugtableData);
            this.getDutyName({ rid: data.requid[0].ZID });
            this.dialogVisible = true;
        },
        getData() {
            // 项目检索状态+列表
            var params = {
                requid: this.requid ? this.requid : '',
                caseid: this.caseid ? this.caseid : '',
                packet_usr: this.packet_usr ? this.packet_usr : '',
                page: this.params.page,
                case_statu: this.status ? this.status : ''
            };
            params.belong_group = this.belong_group.length > 0 ? this.belong_group[this.belong_group.length - 1] : '';
            this.loading = true;
            this.$api
                .get_excute(params)
                .then((res) => {
                    if (res.results.code == 0) {
                        this.tableData = res.results.data;
                        this.pageTotal = res.count;
                        this.params.page_size = res.results.page_size;
                        this.loading = false;
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
            this.loading = true;
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
        // 组装者过滤
        filterUser(key) {
            let params = { uname: key ? key : '' };
            this.$api
                .get_usernames(params)
                .then((res) => {
                    if (res.code == 0) {
                        this.userNameList = res.result;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(err);
                });
        },
        /**
         * 过滤人员
         * @param {string} key 过滤字段
         */
        filterMember(key) {
            this.getjiraUser(key);
        },
        /**
         * 下拉框隐藏重置人员列表
         * @param {bool} type 隐藏/显示
         */
        visibleSelect(type, flag) {
            if (flag) {
            } else {
                if (!type) {
                    this.getjiraUser();
                }
            }
        },
        /**
         * 组装者下拉框隐藏重置人员列表
         * @param {bool} type 隐藏/显示
         */
        userVisibleSelect(type) {
            if (!type) {
                this.filterMember('', true);
            }
        },
        /**
         * 取出区域内所有img的src
         * @param {String} html html字符串
         */
        getSrc(html) {
            var imgReg = /<img.*?(?:>|\/>)/gi;
            // 匹配src属性
            var srcReg = /src=[\\"]?([^\\"]*)[\\"]?/i;
            var arr = html.match(imgReg);
            let imgs = [];
            if (arr) {
                for (let i = 0; i < arr.length; i++) {
                    var src = arr[i].match(srcReg)[1];
                    imgs.push(src);
                }
            }
            return imgs;
        },
        /**
         * 选中项目获取迭代
         * @param {String} name 选中项目名称
         */
        selectProject(name) {
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
        /**
         * @param {String}  // 过滤字段
         */
        filterProject(key) {
            let params = { project_name: key ? key : '' };
            this.$api
                .search_project(params)
                .then((res) => {
                    if (res.code == 0) {
                        this.belongProjectList = res.result;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    // this.$message.error(err);
                });
        },
        /**
         * 下拉框隐藏重置人员列表
         * @param {bool} type 隐藏/显示
         */
        visibleProjectSelect(type) {
            if (!type) {
                this.filterProject('');
            }
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
.table {
    font-size: 12px !important;
}

.file {
    position: relative;
    display: inline-block;
    background: #1890ff;
    border: 1px solid #1890ff;
    border-radius: 4px;
    padding: 4px 12px;
    overflow: hidden;
    color: #ffffff;
    text-decoration: none;
    text-indent: 0;
    line-height: 20px;
    cursor: pointer;
}

.file input {
    cursor: pointer;
    position: absolute;
    font-size: 100px;
    right: 0;
    top: 0;
    opacity: 0;
}

.file:hover {
    background: #aadffd;
    border-color: #78c3f3;
    color: #004974;
    text-decoration: none;
}
</style>
