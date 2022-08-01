<template>
    <div>
        <!-- 编辑用例弹出框 -->
        <el-dialog title="编辑用例" :before-close="handleClose" custom-class="add-el-dialog" :visible.sync="editDialog" width="40%">
            <el-form :model="formEdit" label-width="70px">
                <el-form-item label="用例名称">
                    <el-input v-model="formEdit.case_name" @input="change($event)"></el-input>
                </el-form-item>

                <el-form-item label="接口名称">
                    <el-select
                        v-model="formEdit.api_id"
                        @input="change($event)"
                        placeholder="接口名称"
                        filterable
                        @change="changeApiId"
                        class="handle-select mr10"
                    >
                        <el-option v-for="(item, index) in apiName" :key="index" :label="item.api_name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <p style="margin-bottom: 8px">请求方式</p>
                <el-tabs v-model="formEdit.method" type="card" @tab-click="tabEditClick">
                    <el-tab-pane label="get" name="get"></el-tab-pane>
                    <el-tab-pane label="form-data" name="form-data"></el-tab-pane>
                    <el-tab-pane label="post-body" name="post-body"></el-tab-pane>
                    <p>请求头信息</p>
                    <div class="get-box" v-for="(item, index) in formEdit.headers" :key="index">
                        <el-input v-model="formEdit.headers[index].key" @input="change($event)" placeholder="名称"></el-input>
                        <el-input v-model="formEdit.headers[index].value" @input="change($event)" placeholder="值"></el-input>
                        <el-button v-if="index == 0" type="success" size="mini" @click="addEditGetHead()">添加</el-button>
                        <el-button v-else type="danger" size="mini" @click="deleEditHead(index)">删除</el-button>
                    </div>
                    <span v-if="formEdit.method !== 'post-body'">
                        <p>请求参数</p>
                        <div class="get-box" v-for="(item, index) in formEdit.params" :key="index">
                            <el-input v-model="item.key" @input="change($event)" placeholder="参数名"></el-input>
                            <el-input v-model="item.value" @input="change($event)" placeholder="参数值"></el-input>
                            <el-button v-if="index == 0" type="success" size="mini" @click="addEditParameter()">添加</el-button>
                            <el-button v-else type="danger" size="mini" @click="delEditParameter(index)">删除</el-button>
                        </div>
                    </span>
                    <!-- <span v-else-if="formEdit.method == 'form-data'">
                        <p>请求参数</p>
                        <div class="get-box" v-for="(item, index) in formEdit.params" :key="index">
                            <el-input style="width:45%" v-model="item.key" placeholder="参数名"></el-input>
                            <a href="javascript:;" class="file" style="height:22px;width: 57px;">
                                上传附件
                                <input
                                    type="file"
                                    :ref="'editcaseFileField'+index"
                                    name
                                    :id="'editcaseFileField'+index"
                                    multiple
                                    @change="getvalueName(index)"
                                />
                            </a>
                            <div class="scroll-file">
                                <p
                                    class="ellipsis"
                                    style="line-height:30px;margin-left:10px;font-weight:bolder;width:100%;"
                                    v-for="(file, i) in item.files"
                                    :key="i"
                                    :title="file.name"
                                >{{ file.name }}</p>
                            </div>
                            <el-button
                                v-if="index == 0"
                                type="success"
                                size="mini"
                                @click="addEditParameter()"
                            >添加</el-button>
                            <el-button
                                v-else
                                type="danger"
                                size="mini"
                                @click="delEditParameter(index)"
                            >删除</el-button>
                        </div>
                    </span>-->
                    <span v-else>
                        <p>Body Data</p>
                        <div class="get-box">
                            <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 10 }" v-model="formEdit.textarea"></el-input>
                        </div>
                    </span>
                    <el-form-item label="选择文件" v-if="formEdit.method == 'form-data'">
                        <input type="file" id="filepicker" />
                    </el-form-item>
                    <!-- <span v-if="formEdit.method == 'form-data'">
                        <p>Data</p>
                        <div class="get-box" v-for="(item, index) in formEdit.data" :key="index">
                            <el-input v-model="item.key" @input="change($event)" placeholder="参数名"></el-input>
                            <el-input v-model="item.value" @input="change($event)" placeholder="参数值"></el-input>
                            <el-button v-if="index == 0" type="success" size="mini" @click="addEditData()">添加</el-button>
                            <el-button v-else type="danger" size="mini" @click="delEditData(index)">删除</el-button>
                        </div>
                    </span> -->
                </el-tabs>

                <p class="get-box-head">
                    <span>Assert</span>
                    <el-tooltip
                        class="item"
                        effect="dark"
                        content="断言，左侧填写返回值的解析路径或者数据库查出的变量值，右侧填写常量;返回值路径可以借助断言解析辅助工具"
                        placement="right"
                    >
                        <i class="el-icon-question get-box-icon"></i>
                    </el-tooltip>
                </p>
                <el-switch
                    v-model="formEdit.switchAssert"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    @change="changeEditAssert"
                ></el-switch>
                <span v-if="formEdit.switchAssert == true">
                    <div class="get-box" v-for="(item, index) in formEdit.asserts" :key="index">
                        <el-input v-model="formEdit.asserts[index].k1" @input="change($event)" placeholder="断言名"></el-input>
                        <el-select v-model="formEdit.asserts[index].k2" @input="change($event)" placeholder="请选择">
                            <el-option label="等于" value="=="></el-option>
                            <el-option label="不等于" value="!="></el-option>
                            <el-option label="包含" value="in"></el-option>
                            <el-option label="不包含" value="not_in"></el-option>
                            <el-option label="大于" value=">"></el-option>
                            <el-option label="大于等于" value=">="></el-option>
                            <el-option label="小于" value="<"></el-option>
                            <el-option label="小于等于" value="<="></el-option>
                        </el-select>
                        <el-input v-model="formEdit.asserts[index].k3" @input="change($event)" placeholder="值"></el-input>
                        <el-button v-if="index == 0" type="success" size="mini" @click="addEditAssert()">添加</el-button>
                        <el-button v-else type="danger" size="mini" @click="delEditAssert(index)">删除</el-button>
                    </div>
                </span>

                <p class="get-box-head" style="margin-top: 10px">
                    <span>API Dependency</span>
                    <el-tooltip
                        class="item"
                        effect="dark"
                        content="接口依赖，实现在一个任务中接口需要用到其他接口的返回值"
                        placement="right"
                    >
                        <i class="el-icon-question get-box-icon"></i>
                    </el-tooltip>
                </p>
                <el-switch
                    v-model="formEdit.switchApi"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    @change="changeEditSwitchApi"
                    :style="{ 'margin-bottom': formEdit.switchApi == false ? '10px' : '' }"
                ></el-switch>
                <span v-if="formEdit.switchApi == true">
                    <div class="get-box" v-for="(item, index) in formEdit.ApiDependencys" :key="index">
                        <el-input v-model="formEdit.ApiDependencys[index].key" @input="change($event)" placeholder="变量名"></el-input>
                        <el-input v-model="formEdit.ApiDependencys[index].value" @input="change($event)" placeholder="表达式"></el-input>
                        <el-button v-if="index == 0" type="success" size="mini" @click="addEditDependency()">添加</el-button>
                        <el-button v-else type="danger" size="mini" @click="delEditDependency(index)">删除</el-button>
                    </div>
                </span>
                <el-form-item label="优先级" style>
                    <el-input v-model="formEdit.caselevel" @input="change($event)"></el-input>
                </el-form-item>
                <el-form-item label="用例描述">
                    <el-input v-model="formEdit.case_desc" @input="change($event)"></el-input>
                </el-form-item>
                <el-form-item label="等待时间">
                    <el-input v-model="formEdit.wait_time" placeholder="单位：秒" @input="change($event)"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-switch v-model="formEdit.status" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeEdit">关闭</el-button>
                <el-button type="primary" @click="addEditSubmit">提交</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props: {
        editDialog: {
            type: Boolean,
            default: false
        },
        apiName: {
            type: Array,
            default: () => []
        },
        formEdit: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            tabEditIndex: 0, // 编辑tab切换状态
            addStatus: false,
            fileName: ''
        };
    },
    methods: {
        // 监听 编辑tab 切换
        tabEditClick(tab, event) {
            this.tabEditIndex = tab.index;
            console.log(tab.index, '。。。。。');
        },
        // 监听 编辑 Assert 开关
        changeEditAssert(e) {
            if (e == true) {
                this.formEdit.asserts = [{}];
            }
        },
        // 监听 编辑 Dependency 开关
        changeEditSwitchApi(e) {
            if (e == true) {
                this.formEdit.ApiDependencys = [{}];
            }
        },
        // 添加 编辑Assert
        addEditAssert() {
            this.formEdit.asserts.push({});
        },
        // 删除 编辑Assert
        delEditAssert(index) {
            this.formEdit.asserts.splice(index, 1);
        },
        // 添加 编辑 请求头信息
        addEditGetHead() {
            this.formEdit.headers.push({});
        },
        // 删除 编辑 请求头信息
        deleEditHead(index) {
            this.formEdit.headers.splice(index, 1);
        },
        // 添加 编辑 请求参数
        addEditParameter() {
            this.formEdit.params.push({});
        },
        // 删除 编辑 请求参数
        delEditParameter(index) {
            this.formEdit.params.splice(index, 1);
        },
        // 添加 编辑 Data
        addEditData() {
            this.formEdit.data.push({});
        },
        // 删除 编辑 Data
        delEditData(index) {
            this.formEdit.data.splice(index, 1);
        },
        // 添加 编辑 API Dependency
        addEditDependency() {
            this.formEdit.ApiDependencys.push({});
        },
        // 删除 编辑 API Dependency
        delEditDependency(index) {
            this.formEdit.ApiDependencys.splice(index, 1);
        },
        // 提交执行
        addEditSubmit() {
            // 循环接口名称数组
            this.apiName.forEach((item) => {
                // 修改提交时 e.api_id 传过来的是非ID 而是 接口名称
                // 用传过来的接口名称跟接口名称数组里的名称进行匹配获取id
                if (item.api_name == this.formEdit.api_id) {
                    this.formEdit.api_id = item.id;
                }
            });
            // 判断请求头里是否为空
            if (JSON.stringify(this.formEdit.headers) != '{}' && this.formEdit.headers != '{}') {
                // 不为空则赋值 调用转换方法
                this.formEdit.headers = this.$methods.transition2(this.formEdit.headers);
            } else {
                // 为空则给一个默认空对象
                this.formEdit.headers = {};
            }
            // 判断Assert是否为空
            if (JSON.stringify(this.formEdit.asserts) != '{}' && this.formEdit.asserts != '{}') {
                // 不为空则赋值 调用转换方法
                this.formEdit.asserts = this.$methods.transition3k(this.formEdit.asserts);
            } else {
                // 为空则给一个默认空对象
                this.formEdit.asserts = {};
            }
            // 判断API Dependency是否为空
            if (JSON.stringify(this.formEdit.ApiDependencys) != '{}' && this.formEdit.ApiDependencys != '{}') {
                // 不为空则赋值 调用转换方法
                // this.formEdit.ApiDependencys = this.$methods.transition2(this.formEdit.ApiDependencys);
            } else {
                // 为空则给一个默认空对象
                this.formEdit.ApiDependencys = {};
            }
            let ApiDependencys = {};
            // e.ApiDependencys.map(item => {
            //     ApiDependencys = item;
            // });
            // this.formEdit.ApiDependencys = ApiDependencys;
            console.log(this.formEdit, ApiDependencys, '获得修改后表单');
            if (this.formEdit.method != 'sql') {
                if (this.formEdit.method == 'post-body') {
                    var obj = {};
                    if (JSON.stringify(this.formEdit.ApiDependencys) == '{}') {
                        this.formEdit.ApiDependencys = [];
                    }
                    this.formEdit.ApiDependencys.map((item) => {
                        console.log('item:', item);
                        obj[item.key] = item.value;
                    });
                    this.formEdit.ApiDependencys = obj;
                    console.log('array:', obj);
                    this.formEdit.params = JSON.parse(this.formEdit.textarea.replace(/'/g, '"'));
                } else {
                    // 判断请求参数是否为空
                    if (JSON.stringify(this.formEdit.params) != '{}' && this.formEdit.params != '{}') {
                        // 不为空则赋值 调用转换方法
                        this.formEdit.params = this.$methods.transition2(this.formEdit.params);
                    } else {
                        // 为空则给一个默认空对象
                        this.formEdit.params = {};
                    }
                }
            }
            // 判断data里是否为空
            if (JSON.stringify(this.formEdit.data) != '{}' && this.formEdit.data != '{}') {
                // 不为空则赋值 调用转换方法
                this.formEdit.data = this.$methods.transition2(this.formEdit.data);
            } else {
                // 为空则给一个默认空对象
                this.formEdit.data = {};
            }
            // 判断是否为 post-body 类型，如果是就把textarea赋值给params，并且把单引号换成双引号
            // 删除不需要的传参对象
            delete this.formEdit.textarea;
            delete this.formEdit.switchApi;
            delete this.formEdit.switchAssert;

            // console.log(this.formCarryOut,'获取添加执行信息');
            this.formEdit.wait_time = Number(this.formEdit.wait_time);
            console.log('🚀 ~ formEdit', this.formEdit);

            let formData = new FormData();
            formData.append('id', this.formEdit.id);
            formData.append('case_name', this.formEdit.case_name);
            formData.append('api_id', this.formEdit.api_id);
            formData.append('method', this.formEdit.method);
            formData.append('headers', JSON.stringify(this.formEdit.headers));
            formData.append('params', JSON.stringify(this.formEdit.params));
            // formData.append('data',JSON.stringify(this.formcase.data) );
            if (this.formEdit.method == 'form-data') {
                let file = document.getElementById('filepicker').files[0];
                if (file) {
                    formData.append('files', file);
                }
            }
            formData.append('asserts', JSON.stringify(this.formEdit.asserts));
            formData.append('ApiDependencys', JSON.stringify(this.formEdit.ApiDependencys));
            formData.append('caselevel', this.formEdit.caselevel);
            formData.append('case_desc', this.formEdit.case_desc);
            formData.append('wait_time', this.formEdit.wait_time);
            formData.append('status', this.formEdit.status);
            console.log('🚀 ~ formData', formData.get('ApiDependencys'));
            this.$emit('getEdit', formData);
            this.closeEdit();
        },
        // 关闭 执行 弹出框监听重置内容
        closeEdit() {
            this.$emit('closeDialog');
        },
        // 二次确认关闭
        handleClose() {
            this.$confirm('确认关闭？')
                .then((_) => {
                    this.closeEdit();
                })
                .catch((_) => {});
        },
        // 重新渲染 input 可编辑操作
        change() {
            this.$forceUpdate();
        },
        // 处理请求参数
        setFormcaseParams(res) {
            for (let key in res.result.api_case) {
                let value =
                    typeof res.result.api_case[key] == 'string' ? res.result.api_case[key] : JSON.stringify(res.result.api_case[key]);
                let files = [];
                this.formEdit.params.push({ key, value, files });
            }
        },
        // 处理请求头
        setFormcaseHeaders(res) {
            // 请求头信息
            if (typeof res.result.headers == 'string') {
                this.$message({
                    message: `${res.result.headers}`,
                    type: 'success'
                });
            } else {
                res.result.headers.forEach((item, i) => {
                    let obj;
                    if (i == 0) {
                        for (let key1 in item) {
                            obj = { key: key1, value: item[key1] };
                        }
                        this.formEdit.headers = [obj];
                    } else {
                        for (let key2 in item) {
                            obj = { key: key2, value: item[key2] };
                        }
                        this.formEdit.headers.push(obj);
                    }
                });
            }
        },
        /**
         * 改变接口名称
         * @param e 接口名称id
         */
        changeApiId(e) {
            this.formEdit.params = [];
            this.formEdit.textarea = [];
            this.formEdit.headers = [{}];
            this.$api
                .get_api_to_case({ api_id: e })
                .then((res) => {
                    if (res.code == 0) {
                        // 请求参数
                        console.log('参数', res);
                        this.setFormcaseHeaders(res);
                        // 请求方式
                        switch (res.result.method.toLowerCase()) {
                            case 'get':
                                this.setFormcaseParams(res);
                                this.formEdit.method == res.result.method.toLowerCase();
                                this.formEdit.tabEditIndex = 0;
                                break;
                            case 'post':
                                this.formEdit.textarea = this.$methods.jsonFormat(res.result.api_case);
                                this.formEdit.method == 'post-body';
                                this.formEdit.tabEditIndex = 2;
                                break;
                            default:
                                this.setFormcaseParams(res);
                                this.formEdit.method == 'form-data';
                                this.formEdit.tabEditIndex = 1;
                                break;
                        }
                    } else if (res.code == 1) {
                        this.$message({
                            message: res.msg,
                            type: 'success'
                        });
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(err);
                });
        },
        getvalueName(index) {
            // console.log('formData', document.getElementById('caseFileField').files);
            this.fileName = document.getElementById('editcaseFileField' + index).files[0];
            try {
                let files = this.formEdit.params[index].files;
                files.push(this.fileName);
                this.$set(this.formEdit.params[index], 'files', files);
            } catch (error) {
                this.$set(this.formEdit.params[index], 'files', [this.fileName]);
            }
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
    margin-bottom: 20px;
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
.scroll-file {
    height: 32px;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    overflow-x: hidden;
    overflow-y: scroll;
    width: 32%;
    margin: 0 10px;
}
/deep/ .el-dialog__body {
    overflow: auto;
    height: 601px;
}
/deep/ .el-dialog__body::-webkit-scrollbar {
    width: 10px;
    height: 10px;
}
/deep/ .el-dialog__body::-webkit-scrollbar-track {
    background: rgb(239, 239, 239);
    border-radius: 2px;
}
/deep/ .el-dialog__body::-webkit-scrollbar-thumb {
    background: #bfbfbf;
    border-radius: 10px;
}
/deep/ .el-dialog__body::-webkit-scrollbar-thumb:hover {
    background: #333;
}
/deep/ .el-dialog__body::-webkit-scrollbar-corner {
    background: #179a16;
}
.ellipsis {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
