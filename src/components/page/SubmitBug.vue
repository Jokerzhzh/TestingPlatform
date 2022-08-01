<template>
    <div>
        <div class="public-dialog">
            <el-card class="box-card">
                <div class="box-line" style="margin-bottom: 10px">
                    <input type="text" placeholder="请输入BUG摘要" v-model="bugEdit.summary" class="project-input" style="width: 80%" />
                </div>
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
                            <el-option label="故障" value="10004"></el-option>
                            <el-option label="任务" value="10002"></el-option>
                            <el-option label="Epic" value="1000"></el-option>
                            <el-option label="故事" value="10001"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="项目" :rules="[{ required: true, message: '请选择项目', trigger: 'blur' }]">
                        <el-select placeholder="请选择项目" v-model="bugEdit.project_name" @change="changeProject">
                            <el-option v-for="item in projectList" :key="item.pname" :label="item.pname" :value="item.pname"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="需求" :rules="[{ required: true, message: '请选择需求', trigger: 'blur' }]">
                        <el-select popper-class="selectone" filterable placeholder="请选择需求" v-model="bugEdit.rid" @change="getDutyName">
                            <el-option
                                v-for="item in needList"
                                :title="item.rname"
                                :key="item.ZID"
                                :label="item.rname"
                                :value="item.ZID"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="任务" :rules="[{ required: true, message: '请选择任务', trigger: 'blur' }]">
                        <el-select placeholder="请选择任务" v-model="bugEdit.tid">
                            <el-option v-for="item in dutyName" :key="item.task_name" :label="item.task_name" :value="item.DID"></el-option>
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
                    <el-form-item label="发现版本" prop="checkPass">
                        <el-input
                            v-model="bugEdit.discovery_version"
                            type="text"
                            autocomplete="off"
                            placeholder="请输入发现本版"
                        ></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="创建人" prop="checkPass">
                        <p>{{ username }}</p>
                    </el-form-item> -->
                    <el-form-item label="指派" :rules="[{ required: true, message: '请选择指派人选', trigger: 'blur' }]" prop="checkPass">
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
                <el-button class="submit" type="primary" :disabled="isDisabled" @click="onSubmitBug">提 交</el-button>
            </el-card>
        </div>
    </div>
</template>
<script>
import E from 'wangeditor';
export default {
    name: 'projectManagerDetails',
    data() {
        return {
            belongProjectList: [],
            username: '',
            userList: [],
            projectList: [],
            status: '', // 搜索状态
            dutyName: [],
            fileName: '',
            files: [],
            bugEdit: {
                project_name: '', //项目名称
                summary: '', //bug摘要
                issuetype: '', //类型
                description: '', //bug描述
                priority: '', //优先级
                assignee: '', //指派
                rid: '', //需求ID
                tid: '', //任务ID
                discovery_version: '' //发现版本号
            },
            kindList: [],
            disabled: false,
            editor: null, // 富文本对象
            editorContent: '', // 富文本内容
            description_img: [], // 图片src集合
            userNameList: [],
            needList: [], // 需求列表
            taskInfoList: [], // 任务列表
            isDisabled: false,
            isShow: false
        };
    },
    created() {
        // this.getKind();
        this.group_to_user();
        this.belongProject();
        this.getjiraUser();
        // 显示富文本框
        this.showText();
        // this.getNeedList();
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
    methods: {
        showText() {
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
                this.editor.config.menus = [
                    'image', // 插入图片
                    'undo', // 撤销
                    'redo' // 重复
                ];
                this.editor.create(); // 创建富文本实例
            }, 0);
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
        changeProject(e) {
            let pid;
            this.projectList.forEach((item) => {
                if (item.pname == e) {
                    pid = item.pid;
                }
            });
            this.getNeedList(pid);
        },
        // 获取需求列表
        getNeedList(e) {
            let params = {
                pid: e
            };
            let belong_project = e;
            this.$api
                .require_project({ belong_project })
                .then((res) => {
                    if (res.code == 0) {
                        this.needList = res.data;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
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
        // 根据需求获取任务
        getDutyName(e) {
            let params = {
                rid: e
            };
            // 获取项目名称
            this.$api.apiChart
                .tname_id(params)
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
            if (this.bugEdit.summary == '') {
                this.$message.error('请输入bug摘要');
                return;
            }
            if (this.bugEdit.description == '') {
                this.$message.error('请输入bug描述');
                return;
            }
            if (this.bugEdit.issuetype == '') {
                this.$message.error('请选择类型');
                return;
            }
            if (this.bugEdit.project_name == '') {
                this.$message.error('请选择项目');
                return;
            }
            if (this.bugEdit.rname == '') {
                this.$message.error('请输入需求');
                return;
            }
            if (this.bugEdit.tid == '') {
                this.$message.error('请选择任务');
                return;
            }
            if (this.bugEdit.priority == '') {
                this.$message.error('请选择优先级');
                return;
            }
            if (this.bugEdit.assignee == '') {
                this.$message.error('请选择指派人员');
                return;
            }
            let files = document.querySelector('input[type=file]').files;
            if (files[0]) {
                // formData.append('attach_path', files[0]);
                // formData.append('attach_path', this.files);
                for (var i = 0; i < this.files.length; i++) {
                    formData.append(`attach_path`, this.files[i]); //`attach_path[${i}]`
                }
            }
            formData.append('project_name', this.bugEdit.project_name);
            formData.append('summary', this.bugEdit.summary);
            formData.append('issuetype', 10004);
            formData.append('description', this.bugEdit.description);
            formData.append('priority', this.bugEdit.priority);
            formData.append('assignee', this.bugEdit.assignee);
            formData.append('tid', this.bugEdit.tid);
            formData.append('rid', this.bugEdit.rid);
            formData.append('discovery_version', this.bugEdit.discovery_version);
            formData.append('description_img', JSON.stringify(this.description_img));
            this.isDisabled = true;
            this.$api
                .submit_bug(formData)
                .then((res) => {
                    if (res.code == 0) {
                        this.$message({
                            message: '提交bug成功!',
                            type: 'success'
                        });
                        // 清请提交表单的内容
                        this.bugEdit = {};
                        //清空富文本的内容
                        this.editor.txt.clear();
                        this.isDisabled = false;
                        // 提交之后把选择的文件清除
                        var test = document.getElementById('fileField');
                        test.value = '';
                        this.files = '';
                    } else {
                        this.$message.error(res.msg);
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
            for (var i = 0; i < data.length; i++) {
                if (item.GID == data[i].parent_group) {
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
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        getvalueName() {
            this.fileName = document.getElementById('fileField').files[0];
            this.files.push(this.fileName);
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
        }
    }
};
</script>

<style lang="less">
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
.submit {
    margin-left: 200px;
}
.demo-ruleForm {
    margin-left: -20px;
}
.selectone {
    width: 200px;
}
</style>
