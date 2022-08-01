<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="6">
                <el-card>
                    <el-tree :data="dataTree" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
                </el-card>
            </el-col>
            <el-col :span="18">
                <el-card v-if="showHttp">
                    <div>HTTP请求</div>
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                        <el-form-item label="名称" prop="name">
                            <el-input class="w-input" v-model="ruleForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="注释" prop="region">
                            <el-input class="w-input" v-model="ruleForm.region"></el-input>
                        </el-form-item>
                        <div class="line-greay"></div>
                        <el-tabs v-model="activeName">
                            <el-tab-pane label="基本" name="first">
                                <div>web服务器</div>
                                <el-form-item label="协议" required>
                                    <el-input class="w-input" v-model="ruleForm.region1"></el-input>
                                </el-form-item>
                                <el-form-item label="服务名称或IP" prop="delivery">
                                    <el-input class="w-input" v-model="ruleForm.region2"></el-input>
                                </el-form-item>
                                <el-form-item label="端口号" prop="delivery">
                                    <el-input class="w-input" v-model="ruleForm.region3"></el-input>
                                </el-form-item>
                                <div>HTTP请求</div>
                                <el-form-item label="方法" prop="type">
                                    <el-select placeholder="请选择活动区域" v-model="ruleForm.date1">
                                        <el-option label="GET" value="shanghai"></el-option>
                                        <el-option label="POST" value="shanghai"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="路径" prop="resource">
                                    <el-input class="w-input" v-model="ruleForm.region4"></el-input>
                                </el-form-item>
                                <el-form-item label="内容编码" prop="desc">
                                    <el-input class="w-input" v-model="ruleForm.region5"></el-input>
                                    <!-- <el-input type="textarea" v-model="ruleForm.desc"></el-input> -->
                                </el-form-item>
                                <el-form-item prop="desc">
                                    <el-radio-group v-model="ruleForm.resource">
                                        <el-radio label="自动重定向"></el-radio>
                                        <el-radio label="跟随重定向"></el-radio>
                                        <el-radio label="使用keepAliv"></el-radio>s
                                        <el-radio label="对post使用mutipart/form-data"></el-radio>
                                        <el-radio label="与浏览器兼容的头"></el-radio> </el-radio-group
                                ></el-form-item>
                                <el-tabs v-model="activeNames" type="card">
                                    <el-tab-pane label="参数" name="first">
                                        <el-table :data="tableData" style="width: 100%">
                                            <el-table-column prop="date" label="名称" width="180"> </el-table-column>
                                            <el-table-column prop="name" label="值" width="180"> </el-table-column>
                                            <el-table-column prop="address" label="编码?"> </el-table-column>
                                            <el-table-column prop="address" label="内容类型"> </el-table-column>
                                            <el-table-column prop="address" label="包等于?"> </el-table-column>
                                        </el-table>
                                    </el-tab-pane>
                                    <el-tab-pane label="消息体数据" name="second">
                                        <el-input type="textarea" :rows="6" v-model="ruleForm.desc"></el-input>
                                    </el-tab-pane>
                                    <el-tab-pane label="文件上传" name="third">
                                        <el-table :data="tableData" style="width: 100%">
                                            <el-table-column prop="date" label="文件名称" width="180"> </el-table-column>
                                            <el-table-column prop="name" label="参数名称" width="180"> </el-table-column>
                                            <el-table-column prop="address" label="MIME类型"> </el-table-column>
                                        </el-table>
                                    </el-tab-pane>
                                </el-tabs>
                            </el-tab-pane>
                            <el-tab-pane label="高级" name="second">
                                <el-card class="box-card">
                                    <div>客户端实现</div>
                                    <el-form-item label="实现" prop="type">
                                        <el-select placeholder="请选择活动区域" v-model="ruleForm.date1">
                                            <el-option label="HttpClient4" value="shanghai"></el-option>
                                            <el-option label="Java" value="shanghai"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <div>超时（毫秒）</div>
                                    <el-form-item label="连接" required>
                                        <el-input class="w-input" v-model="ruleForm.region6"></el-input>
                                    </el-form-item>
                                    <el-form-item label="响应" required>
                                        <el-input class="w-input" v-model="ruleForm.region7"></el-input>
                                    </el-form-item>
                                    <div>从HMTL嵌入资源</div>
                                    <el-checkbox v-model="checked">从HTML获取所有内含的资源</el-checkbox>
                                    <el-checkbox v-model="checked">并行下载.数量</el-checkbox>
                                    <el-input style="margin-left:8px;width:40px" v-model="num"></el-input>
                                    <el-form-item label-width="110px" label="网址必须匹配" required>
                                        <!-- label-width="80px" -->
                                        <el-input class="w-input" v-model="ruleForm.region8"></el-input>
                                    </el-form-item>
                                    <div>源地址</div>
                                    <el-input placeholder="请输入内容" v-model="input3" class="input-with-select">
                                        <el-select style="width: 130px;" v-model="select" slot="prepend" placeholder="请选择">
                                            <el-option label="ip/主机名" value="1"></el-option>
                                            <el-option label="设备" value="2"></el-option>
                                            <el-option label="设备 ipv4" value="3"></el-option>
                                            <el-option label="设备 ipv6" value="4"></el-option>
                                        </el-select>
                                    </el-input>
                                    <div>代理服务器</div>
                                    <el-form-item label="scheme" required>
                                        <el-input class="w-input" v-model="ruleForm.region9"></el-input>
                                    </el-form-item>
                                    <el-form-item label-width="120px" label="服务器名称或IP" required>
                                        <el-input class="w-input" v-model="ruleForm.region0"></el-input>
                                    </el-form-item>
                                    <el-form-item label="端口号" required>
                                        <el-input class="w-input" v-model="ruleForm.region10"></el-input>
                                    </el-form-item>
                                    <el-form-item label="用户名" required>
                                        <el-input class="w-input" v-model="ruleForm.region11"></el-input>
                                    </el-form-item>
                                    <el-form-item label="密码" required>
                                        <el-input class="w-input" v-model="ruleForm.region12"></el-input>
                                    </el-form-item>
                                    <div>其他任务</div>
                                    <el-checkbox v-model="checked">保存响应为MD5哈希</el-checkbox>
                                </el-card>
                            </el-tab-pane>
                        </el-tabs>

                        <div style="height:10px"></div>
                        <el-form-item>
                            <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
                            <el-button @click="resetForm('ruleForm')">重置</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
                <el-card v-if="showJson">
                    <div>JSON提取器</div>
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                        <el-form-item label="名称" prop="name">
                            <el-input v-model="ruleForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="注释" prop="region">
                            <el-input v-model="ruleForm.region13"></el-input>
                        </el-form-item>
                        <el-card shadow="never" style="margin-bottom:10px">
                            <div slot="header" class="clearfix">
                                <span>Apply to</span>
                            </div>
                            <el-radio v-model="radio" label="1">Manin sample and sub-samples</el-radio>
                            <el-radio v-model="radio" label="2">Manin sample only</el-radio>
                            <el-radio v-model="radio" label="3">sub-samples only</el-radio>
                            <el-radio v-model="radio" label="3">Jmeter Variable Name to use </el-radio>
                            <!-- <el-form-item prop="region"> -->
                            <el-input style="margin-top:10px" v-model="ruleForm.region"></el-input>
                            <!-- </el-form-item> -->
                        </el-card>
                        <el-form-item label-width="162px" label="Name of creatd variable" prop="region">
                            <el-input v-model="ruleForm.region14"></el-input>
                        </el-form-item>
                        <el-form-item label-width="168px" label="JSON Path expresstions" prop="region">
                            <el-input v-model="ruleForm.region15"></el-input>
                        </el-form-item>
                        <el-form-item label-width="180px" label="Match No.(0 for Random)" prop="region">
                            <el-input v-model="ruleForm.region16"></el-input>
                        </el-form-item>
                        <el-form-item label-width="200px" label="Match No.(0 for Random)" prop="desc">
                            <el-checkbox-group v-model="ruleForm.resource">
                                <el-checkbox label="Compute concatenation var(suffix_All)"></el-checkbox> </el-checkbox-group
                        ></el-form-item>
                        <el-form-item label-width="162px" label="Default Values" prop="region">
                            <el-input v-model="ruleForm.region17"></el-input>
                        </el-form-item>
                        <div style="height:10px"></div>
                        <el-form-item>
                            <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
                            <el-button @click="resetForm('ruleForm')">重置</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
                <el-card v-if="Backend">
                    <div>后端监听器</div>
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                        <el-form-item label="名称" prop="name">
                            <el-input v-model="ruleForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="注释" prop="region">
                            <el-input v-model="ruleForm.region18"></el-input>
                        </el-form-item>
                        <el-form-item label-width="120px" label="后端监听器实现" prop="name">
                            <el-input v-model="ruleForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="异步队列大小" prop="region">
                            <el-input v-model="ruleForm.region19"></el-input>
                        </el-form-item>
                    </el-form>
                    <div>参数</div>
                    <el-table :data="tableData" border style="width: 100%">
                        <el-table-column prop="date" label="名称"> </el-table-column>
                        <el-table-column prop="name" label="值"> </el-table-column>
                    </el-table>
                </el-card>
                <el-card v-if="lookResult">
                    <div>查看结果树</div>
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                        <el-form-item label="名称" prop="name">
                            <el-input v-model="ruleForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="注释" prop="region">
                            <el-input v-model="ruleForm.region20"></el-input>
                        </el-form-item>
                        <div>所有数据写入一个文件</div>
                        <el-form-item label="文件名" prop="name">
                            <input type="file" />
                        </el-form-item>
                        <el-form-item label="显示日志内容" prop="name">
                            <el-checkbox-group v-model="ruleForm.resources">
                                <el-checkbox label="仅错误日志"></el-checkbox>
                                <el-checkbox label="仅成功日志"></el-checkbox>
                            </el-checkbox-group>
                            <el-button @click="resetForm('ruleForm')">配置</el-button>
                        </el-form-item>
                        <el-form-item label="查找" prop="name">
                            <el-input v-model="ruleForm.name"></el-input>
                            <el-checkbox-group v-model="ruleForm.resources">
                                <el-checkbox label="区分大小写"></el-checkbox>
                                <el-checkbox label="正则表达式"></el-checkbox>
                            </el-checkbox-group>
                            <el-button @click="resetForm('ruleForm')">查找</el-button>
                            <el-button @click="resetForm('ruleForm')">重置</el-button>
                        </el-form-item>
                        <el-card shadow="never">
                            <el-form-item prop="type">
                                <el-select placeholder="请选择活动区域" v-model="ruleForm.date1">
                                    <el-option label="Text" value="shanghai"></el-option>
                                    <el-option label="RegExp Tester" value="shanghai"></el-option>
                                    <el-option label="边界提取器测试" value="shanghai1"></el-option>
                                    <el-option label="css选择器测试" value="shanghai2"></el-option>
                                    <el-option label="Xpath Tester" value="shanghai3"></el-option>
                                    <el-option label="Json path Tester" value="shanghai4"></el-option>
                                    <el-option label="HTML" value="shanghai5"></el-option>
                                    <el-option label="HTML Sourse Formatted" value="shanghai6"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-card>
                    </el-form>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    data() {
        return {
            ruleForm: {
                // hashTree: {
                name: '',
                region: '',
                date1: '',
                date2: '',
                delivery: false,
                type: [],
                resource: '',
                resources: [],
                desc: ''
                // }
            },
            activeName: 'first',
            activeNames: 'first',
            input3: '',
            select: '',
            checked: true,
            radio: true,
            dataTree: [
                {
                    label: 'TestPlan',
                    id: 1,
                    children: [
                        {
                            label: '线程组',
                            id: 2,
                            children: [
                                {
                                    label: '取样',
                                    id: 4,
                                    children: [
                                        {
                                            label: 'HTTP请求',
                                            id: 3
                                        }
                                    ]
                                },
                                {
                                    label: '后置处理',
                                    id: 5,
                                    children: [
                                        {
                                            label: 'json提取',
                                            id: 7
                                        }
                                    ]
                                },
                                {
                                    label: '监听器',
                                    id: 6,
                                    children: [
                                        {
                                            label: '后端监听器',
                                            id: 8
                                        },
                                        {
                                            label: '查看结果树',
                                            id: 9
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ],
            showHttp: false,
            showJson: false,
            Backend: false,
            lookResult: false,
            rules: {
                // name: [
                //     { required: true, message: '请输入活动名称', trigger: 'blur' },
                //     { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                // ],
                // region: [{ required: true, message: '请选择活动区域', trigger: 'change' }],
                // date1: [{ type: 'date', required: true, message: '请选择日期', trigger: 'change' }],
                // date2: [{ type: 'date', required: true, message: '请选择时间', trigger: 'change' }],
                // type: [{ type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }],
                // resource: [{ required: true, message: '请选择活动资源', trigger: 'change' }],
                // desc: [{ required: true, message: '请填写活动形式', trigger: 'blur' }]
            }
        };
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    var xmlStr = this.ruleForm;

                    // 调用
                    // var jsonae = this.$x2js.xml2js(xmlStr);
                    // this.$x2js.js2xml(this.$x2js.xml2js(xmlStr));
                    // console.log(jsonae);
                    // var jsonae = this.$x2js.js2xml(this.$x2js.xml2js(xmlStr));
                    let jsonae = this.$x2js.js2xml(xmlStr);
                    console.log(jsonae);
                    // alert('submit!');
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        handleNodeClick(data) {
            console.log(data);
            if (data.id == 3) {
                this.showHttp = true;
                this.showJson = false;
                this.lookResult = false;
                this.Backend = false;
            } else if (data.id == 7) {
                this.showJson = true;
                this.showHttp = false;
                this.lookResult = false;
                this.Backend = false;
            } else if (data.id == 8) {
                this.Backend = true;
                this.showJson = false;
                this.showHttp = false;
                this.lookResult = false;
            } else if (data.id == 9) {
                this.lookResult = true;
                this.showJson = false;
                this.showHttp = false;
                this.Backend = false;
            } else {
                this.showJson = false;
                this.showHttp = false;
                this.Backend = false;
                this.lookResult = false;
            }
        }
    }
};
</script>
<style scoped lang="less">
.el-select {
    .el-input {
        width: 130px;
    }
}
.input-with-select {
    width: 320px;
    .el-input-group__prepend {
        background-color: #fff;
    }
}
.massage {
    height: 600px;
}
.line-greay {
    height: 2px;
    background-color: #e4e7ed;
    margin-bottom: 10px;
    // margin-top: 40px;
}
.w-input {
    width: 203px;
}
</style>
