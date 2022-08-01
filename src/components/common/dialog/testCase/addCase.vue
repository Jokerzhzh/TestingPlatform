<template>
    <div>
        <!-- 添加case用例弹出框 -->
        <el-dialog title="新增用例" :before-close="handleClose" custom-class="add-el-dialog" :visible.sync="addCaseDialog" width="40%">
            <el-form :model="formcase" label-width="70px">
                <el-form-item label="用例名称">
                    <el-input v-model="formcase.case_name" placeholder="请输入用例名"></el-input>
                </el-form-item>

                <el-form-item v-if="formcase.method == 'Dubbo'" label="服务名称">
                    <el-input v-model="formcase.service_name" placeholder="请输入服务名称"></el-input>
                </el-form-item>
                <el-form-item v-else label="接口名称">
                    <el-select v-model="formcase.api_id" placeholder="接口名称" filterable class="handle-select mr10" @change="changeApiId">
                        <el-option v-for="(item, index) in apiName" :key="index" :label="item.api_name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <p style="margin-bottom: 8px">请求方式</p>
                <el-tabs v-model="formcase.method" type="card" @tab-click="tabClick">
                    <el-tab-pane label="get" name="get"></el-tab-pane>
                    <el-tab-pane label="form-data" name="form-data"></el-tab-pane>
                    <el-tab-pane label="post-body" name="post-body"></el-tab-pane>
                    <el-tab-pane label="Dubbo" name="Dubbo"></el-tab-pane>
                    <span v-if="formcase.method == 'Dubbo'">
                        <p>方法名</p>
                        <el-input class="get-box" v-model="formcase.method_name" placeholder="请输入方法名"></el-input>
                        <span v-if="formcase.tabIndex != 2">
                            <p>请求参数</p>
                            <div class="get-box" v-for="(item, index) in formcase.params" :key="index">
                                <el-input v-model="item.key" placeholder="参数名"></el-input>
                                <el-input v-model="item.value" placeholder="参数值"></el-input>
                                <el-button v-if="index == 0" type="success" size="mini" @click="addParameter()">添加</el-button>
                                <el-button v-else type="danger" size="mini" @click="delParameter(index)">删除</el-button>
                            </div>
                        </span>
                    </span>
                    <span v-else>
                        <p>请求头信息</p>
                        <div class="get-box" v-for="(item, index) in formcase.headers" :key="index">
                            <el-input v-model="formcase.headers[index].key" placeholder="名称"></el-input>
                            <el-input v-model="formcase.headers[index].value" placeholder="值"></el-input>
                            <el-button v-if="index == 0" type="success" size="mini" @click="addheaders()">添加</el-button>
                            <el-button v-else type="danger" size="mini" @click="deletHead(index)">删除</el-button>
                        </div>
                        <span v-if="formcase.tabIndex != 2">
                            <p>请求参数</p>
                            <div class="get-box" v-for="(item, index) in formcase.params" :key="index">
                                <el-input v-model="item.key" placeholder="参数名"></el-input>
                                <el-input v-model="item.value" placeholder="参数值"></el-input>
                                <el-button v-if="index == 0" type="success" size="mini" @click="addParameter()">添加</el-button>
                                <el-button v-else type="danger" size="mini" @click="delParameter(index)">删除</el-button>
                            </div>
                        </span>

                        <!-- <span v-else-if="formcase.tabIndex == 1">
                        <p>请求参数</p>
                        <div class="get-box" v-for="(item, index) in formcase.params" :key="index">
                            <el-input style="width: 45%" v-model="item.key" placeholder="参数名"></el-input>
                            <a href="javascript:;" class="file" style="height: 22px; width: 57px">
                                上传附件
                                <input
                                    type="file"
                                    :ref="'caseFileField' + index"
                                    name
                                    :id="'caseFileField' + index"
                                    multiple
                                    @change="getvalueName(index)"
                                />
                            </a>
                            <div class="scroll-file">
                                <p
                                    class="ellipsis"
                                    style="line-height: 30px; margin-left: 10px; font-weight: bolder"
                                    style="line-height:30px;margin-left:10px;font-weight:bolder;width:100%;"
                                    v-for="(file, i) in item.files"
                                    :key="i"
                                    :title="file.name"
                                >
                                    {{ file.name }}
                                </p>
                            </div>
                            <el-button v-if="index == 0" type="success" size="mini" @click="addParameter()">添加</el-button>
                            <el-button v-else type="danger" size="mini" @click="delParameter(index)">删除</el-button>
                        </div>
                    </span>-->
                        <span v-else>
                            <p>Body Data</p>
                            <div class="get-box">
                                <el-input type="textarea" v-model="formcase.textarea" :autosize="{ minRows: 3, maxRows: 10 }"></el-input>
                            </div>
                        </span>
                        <el-form-item label="选择文件" v-if="formcase.method == 'form-data'">
                            <input type="file" id="filepicker" />
                        </el-form-item>
                        <!-- <span v-if="formcase.method == 'form-data'">
                        <p>Data</p>
                        <div class="get-box" v-for="(item, index) in formcase.data" :key="index">
                            <el-input v-model="item.key" placeholder="参数名"></el-input>
                            <el-input v-model="item.value" placeholder="参数值"></el-input>
                            <el-button v-if="index == 0" type="success" size="mini" @click="addData()">添加</el-button>
                            <el-button v-else type="danger" size="mini" @click="delData(index1)">删除</el-button>
                        </div>
                    </span> -->
                    </span>
                </el-tabs>
                <span v-if="formcase.method != 'Dubbo'">
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
                        v-model="formcase.switchAssert"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        @change="changeSwitchAssert"
                    ></el-switch>
                    <span v-if="formcase.switchAssert">
                        <div class="get-box" v-for="(item, index) in formcase.asserts" :key="index">
                            <el-input v-model="formcase.asserts[index].key" placeholder="断言名"></el-input>
                            <el-select v-model="formcase.asserts[index].select" placeholder="请选择">
                                <el-option label="等于" value="=="></el-option>
                                <el-option label="不等于" value="!="></el-option>
                                <el-option label="包含" value="in"></el-option>
                                <el-option label="不包含" value="not_in"></el-option>
                                <el-option label="大于" value=">"></el-option>
                                <el-option label="大于等于" value=">="></el-option>
                                <el-option label="小于" value="<"></el-option>
                                <el-option label="小于等于" value="<="></el-option>
                            </el-select>
                            <el-input v-model="formcase.asserts[index].value" placeholder="值"></el-input>
                            <el-button v-if="index == 0" type="success" size="mini" @click="addAssert()">添加</el-button>
                            <el-button v-else type="danger" size="mini" @click="delAssert(index)">删除</el-button>
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
                        v-model="formcase.switchApi"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        @change="changeSwitchApi"
                        :style="{ 'margin-bottom': formcase.switchApi == false ? '10px' : '' }"
                    ></el-switch>
                    <span v-if="formcase.switchApi">
                        <div class="get-box" v-for="(item, index) in formcase.ApiDependencys" :key="index">
                            <el-input v-model="formcase.ApiDependencys[index].key" placeholder="变量名"></el-input>
                            <el-input v-model="formcase.ApiDependencys[index].value" placeholder="表达式"></el-input>
                            <el-button v-if="index == 0" type="success" size="mini" @click="addApiDependency()">添加</el-button>
                            <el-button v-else type="danger" size="mini" @click="delApiDependency(index)">删除</el-button>
                        </div>
                    </span>

                    <el-form-item label="优先级" style>
                        <el-input v-model="formcase.caselevel"></el-input>
                    </el-form-item>
                    <el-form-item label="用例描述">
                        <el-input v-model="formcase.case_desc"></el-input>
                    </el-form-item>
                    <el-form-item label="等待时间">
                        <el-input v-model="formcase.wait_time" placeholder="单位：秒"></el-input>
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-switch v-model="formcase.status" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                    </el-form-item>
                </span>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeAdd">关闭</el-button>
                <el-button type="primary" @click="addCaseSubmit">提交</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props: {
        addCaseDialog: {
            type: Boolean,
            default: false
        },
        apiName: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            formcase: {
                // 添加case弹层表单数据
                case_name: '', // 用例名称
                api_id: '', // 接口名称
                tabIndex: 0, // tab切换状态
                method: 'get', // 请求方式
                status: true, // 状态
                headers: [{}], //  请求头数组
                textarea: '', // post-body 下文本域
                params: [{ files: [] }], //  请求参数 数组
                data: [{}], // data 数组
                asserts: [{}], //  Assert 数组
                ApiDependencys: [{}], //  API Dependency 数组
                switchAssert: false, //  Assert 开关
                switchApi: false, //  API Dependency 开关
                caselevel: '', // 优先级
                case_desc: '', // 用例描述
                wait_time: '' // 等待时间
            },
            fileName: ''
        };
    },
    created() {
        console.log('???', this.formcase);
    },
    methods: {
        // 添加 API Dependency
        addApiDependency() {
            this.formcase.ApiDependencys.push({});
        },
        // 删除 API Dependency
        delApiDependency(index) {
            this.formcase.ApiDependencys.splice(index, 1);
        },
        // 监听 API Dependency 开关
        changeSwitchApi(e) {
            if (e == false) {
                this.formcase.ApiDependencys = [{}];
            }
        },
        // 添加 Assert
        addAssert() {
            this.formcase.asserts.push({});
        },
        // 删除 Assert
        delAssert(index) {
            this.formcase.asserts.splice(index, 1);
        },
        // 监听 Assert 开关
        changeSwitchAssert(e) {
            if (e == false) {
                this.formcase.asserts = [{}];
            }
        },
        // 添加 请求头信息
        addheaders() {
            this.formcase.headers.push({});
        },
        // 删除 请求头信息
        deletHead(index) {
            this.formcase.headers.splice(index, 1);
        },
        // 添加 请求参数
        addParameter() {
            this.formcase.params.push({ files: [] });
        },
        // 删除 请求参数
        delParameter(index) {
            this.formcase.params.splice(index, 1);
        },
        // 添加 data
        addData() {
            this.formcase.data.push({ files: [] });
        },
        // 删除 data
        delData(index) {
            this.formcase.data.splice(index, 1);
        },
        // 监听 tab 切换
        tabClick(tab, event) {
            this.formcase.tabIndex = tab.index;
            // console.log(tab.index,'切换TAB' );
            console.log(this.formcase.method, '切换TAB');
        },
        // 打开 case 弹出框监听重置内容
        openAdd() {
            this.formcase = {
                case_name: '', // 用例名称
                api_id: '', // 接口名称
                tabIndex: 0, // tab切换状态
                method: 'get', // 请求方式
                status: true, // 状态
                headers: [{}], //  请求头数组
                textarea: '', // post-body 下文本域
                params: [{}], //  请求参数 数组
                asserts: [{}], //  Assert 数组
                ApiDependencys: [{}], //  API Dependency 数组
                switchAssert: false, //  Assert 开关
                switchApi: false, //  API Dependency 开关
                caselevel: '', // 优先级
                case_desc: '', // 用例描述
                wait_time: '', // 等待时间
                data: [{}]
            };
        },
        // 提交添加的 case
        addCaseSubmit() {
            if (this.formcase.method == 'Dubbo') {
                // 判断 API Dependency 是否为空
                if (JSON.stringify(this.formcase.params) != '[{}]' && this.formcase.params != '[{}]') {
                    this.formcase.params = this.$methods.transition2(this.formcase.params);
                }
                console.log('Dubbo.................');
                console.log('case_name...', this.formcase.case_name);
                console.log('method...', this.formcase.method);
                console.log('service_name.method_name...', this.formcase.service_name + '.' + this.formcase.method_name);
                console.log('params...', this.formcase.params);
                let params = {
                    case_name: this.formcase.case_name,
                    method: this.formcase.method,
                    data: this.formcase.service_name + '.' + this.formcase.method_name,
                    params: JSON.stringify(this.formcase.params),
                    api_id: 1
                };
                let formData = new FormData();
                formData.append('case_name', this.formcase.case_name);
                formData.append('api_id', '1');
                formData.append('method', this.formcase.method);
                formData.append('data', this.formcase.service_name + '.' + this.formcase.method_name);
                formData.append('params', JSON.stringify(this.formcase.params));
                this.$emit('getformcase', formData);
            } else {
                // 判断请求头信息是否为空
                if (JSON.stringify(this.formcase.headers) != '[{}]' && this.formcase.headers != '[{}]') {
                    this.formcase.headers = this.$methods.transition2(this.formcase.headers);
                }
                // 判断Assert是否为空
                if (JSON.stringify(this.formcase.asserts) != '[{}]' && this.formcase.asserts != '[{}]') {
                    this.formcase.asserts = this.$methods.transition3(this.formcase.asserts);
                }
                // 判断 API Dependency 是否为空
                if (JSON.stringify(this.formcase.ApiDependencys) != '[{}]' && this.formcase.ApiDependencys != '[{}]') {
                    this.formcase.ApiDependencys = this.$methods.transition2(this.formcase.ApiDependencys);
                }
                // 判断tab切换的当前项 是否为 post-body 类型
                if (this.formcase.method == 'post-body') {
                    // 如果是 post-body类型 直接给 params 赋值
                    this.formcase.params = this.formcase.textarea;
                } else {
                    // 判断 请求参数是否为空
                    // if (this.formcase.method == 'form-data') {
                    //     let value = [];
                    //     this.formcase.params.forEach(item => {
                    //         // let formData = new FormData();
                    //         // item.files.forEach(file => {
                    //         //     formData.append(`attach_path`, file);
                    //         // });
                    //         //     value.push(JSON.stringify(item.files));
                    //         item.value = item.files;
                    //     });
                    //     this.formcase.params.value = this.formcase.files;
                    //     this.formcase.params = this.$methods.transition2(this.formcase.params);
                    //     for (const key in this.formcase.params) {
                    //         this.formcase.params[key] = JSON.stringify(this.formcase.params[key]);
                    //     }
                    //     this.formcase.params;
                    // } else
                    if (JSON.stringify(this.formcase.params) != '[{}]' && this.formcase.params != '[{}]') {
                        this.formcase.params = this.$methods.transition2(this.formcase.params);
                    }
                }
                // 判断data信息是否为空
                if (JSON.stringify(this.formcase.data) != '[{}]' && this.formcase.data != '[{}]') {
                    this.formcase.data = this.$methods.transition2(this.formcase.data);
                }
                this.formcase.wait_time = Number(this.formcase.wait_time);
                let formData = new FormData();
                formData.append('case_name', this.formcase.case_name);
                formData.append('api_id', this.formcase.api_id);
                formData.append('method', this.formcase.method);
                formData.append('headers', JSON.stringify(this.formcase.headers));
                if (this.formcase.method == 'post-body') {
                    formData.append('params', this.formcase.params);
                } else {
                    formData.append('params', JSON.stringify(this.formcase.params));
                }
                // formData.append('data',JSON.stringify(this.formcase.data) );
                if (this.formcase.method == 'form-data') {
                    let file = document.getElementById('filepicker').files[0];
                    if (file) {
                        formData.append('files', file);
                    }
                }
                formData.append('asserts', JSON.stringify(this.formcase.asserts));
                formData.append('ApiDependencys', JSON.stringify(this.formcase.ApiDependencys));
                formData.append('caselevel', this.formcase.caselevel);
                formData.append('case_desc', this.formcase.case_desc);
                formData.append('wait_time', this.formcase.wait_time);
                formData.append('status', this.formcase.status);

                this.$emit('getformcase', formData);
                // this.closeAdd();
            }
        },
        // 关闭 case 弹出框监听重置内容
        closeAdd() {
            this.$emit('closeDialog');
            this.formcase = {
                case_name: '', // 用例名称
                api_id: '', // 接口名称
                tabIndex: 0, // tab切换状态
                method: 'get', // 请求方式
                status: true, // 状态
                headers: [{}], //  请求头数组
                textarea: '', // post-body 下文本域
                params: [{}], //  请求参数 数组
                asserts: [{}], //  Assert 数组
                ApiDependencys: [{}], //  API Dependency 数组
                switchAssert: false, //  Assert 开关
                switchApi: false, //  API Dependency 开关
                caselevel: '', // 优先级
                case_desc: '', // 用例描述
                wait_time: '', // 等待时间
                data: [{}]
            };
        },
        // 二次确认关闭
        handleClose() {
            this.$confirm('确认关闭？')
                .then((_) => {
                    this.closeAdd();
                })
                .catch((_) => {});
        },
        /**
         * 处理请求参数
         * @param {object} res 返回数据
         */
        setFormcaseParams(res) {
            // 请求参数
            for (let key in res.result.api_case) {
                let value =
                    typeof res.result.api_case[key] == 'string' ? res.result.api_case[key] : JSON.stringify(res.result.api_case[key]);
                let files = [];
                this.formcase.params.push({ key, value, files });
            }
        },
        /**
         * 处理请求头
         * @param {object} res 返回数据
         */
        setFormcaseHeaders(res) {
            // 请求头信息
            if (typeof res.result.headers == 'string') {
                this.$message({
                    message: `${res.result.headers}`,
                    type: 'success'
                });
            } else {
                console.log(typeof res.result.headers);
                res.result.headers.forEach((item, i) => {
                    let obj;
                    if (i == 0) {
                        for (let key1 in item) {
                            obj = { key: key1, value: item[key1] };
                        }
                        this.formcase.headers = [obj];
                    } else {
                        for (let key2 in item) {
                            obj = { key: key2, value: item[key2] };
                        }
                        this.formcase.headers.push(obj);
                    }
                });
            }
        },
        /**
         * 改变接口名称
         * @param e 接口名称id
         */
        changeApiId(e) {
            this.formcase.params = [{}];
            this.formcase.headers = [{}];
            this.formcase.textarea = '';
            this.$api
                .get_api_to_case({ api_id: e })
                .then((res) => {
                    if (res.code == 0) {
                        console.log('参数', res);
                        this.setFormcaseHeaders(res);
                        // 请求方式
                        switch (res.result.method.toLowerCase()) {
                            case 'post':
                                this.formcase.textarea = this.$methods.jsonFormat(res.result.api_case);
                                this.formcase.method = 'post-body';
                                this.formcase.tabIndex = 2;
                                break;
                            case 'get':
                                this.setFormcaseParams(res);
                                this.formcase.method = res.result.method.toLowerCase();
                                this.formcase.tabIndex = 0;
                                break;
                            default:
                                this.setFormcaseParams(res);
                                this.formcase.method = 'form-data';
                                this.formcase.tabIndex = 1;
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
            this.fileName = document.getElementById('caseFileField' + index).files[0];
            try {
                let files = this.formcase.params[index].files;
                files.push(this.fileName);
                this.$set(this.formcase.params[index], 'files', files);
            } catch (error) {
                this.$set(this.formcase.params[index], 'files', [this.fileName]);
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
/deep/ .el-dialog__body {
    overflow: auto;
    max-height: 601px;
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
    white-space: nowrap;
}
</style>
