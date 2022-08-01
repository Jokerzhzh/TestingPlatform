<template>
    <div>
        <div class="container">
            <span v-if="type != 'Dubbo'">
                <div class="request-data">
                    <h3>请求数据</h3>
                    <el-button @click="formattingRequest" type="primary">格式化json</el-button>
                </div>
                <el-tabs v-model="activeRequest" type="card" @tab-click="requestData">
                    <el-tab-pane label="url" name="0"></el-tab-pane>
                    <el-tab-pane label="header" name="1"></el-tab-pane>
                    <el-tab-pane label="params" name="2"></el-tab-pane>
                    <el-tab-pane label="assert" name="3"></el-tab-pane>
                </el-tabs>
                <pre :class="{ pre: isFormattingRequest }">{{ objData1 }}</pre>
                <br />
                <hr style="background-color: #409eff; height: 1px; border: none" />
                <br />
                <div class="request-data">
                    <h3>相应数据</h3>

                    <el-button type="primary" @click="formattingRelevant">格式化json</el-button>
                </div>
                <el-tabs v-model="activeRelevant" type="card" @tab-click="relevantData">
                    <el-tab-pane label="响应_header" name="0"></el-tab-pane>
                    <el-tab-pane label="响应_body" name="1"></el-tab-pane>
                    <el-tab-pane label="已提取" name="2"></el-tab-pane>
                </el-tabs>
                <pre :class="{ pre: isFormattingRelevant }">{{ objData2 }}</pre>
            </span>
            <span v-else>
                <div class="request-data">
                    <h3>Dubbo接口返回数据</h3>
                    <el-button @click="formattingRequest" type="primary">格式化json</el-button>
                </div>
                <el-tabs v-model="activeDubbo" type="card" @tab-click="DubboData">
                    <el-tab-pane label="host" name="0"></el-tab-pane>
                    <el-tab-pane label="params" name="1"></el-tab-pane>
                    <el-tab-pane label="result" name="2"></el-tab-pane>
                    <el-tab-pane label="server_info" name="3"></el-tab-pane>
                </el-tabs>
                <pre :class="{ pre: formattingDubbo }">{{ objData3 }}</pre>
            </span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'tabs',
    data() {
        return {
            activeRequest: '0',
            activeRelevant: '0',
            activeDubbo: '0',
            objData1: {}, // 请求数据
            objData2: {}, // 相应数据
            objData3: {}, // Dubbo返回数据
            isFormattingRequest: true, // 格式化请求数据
            isFormattingRelevant: true, // 格式化相应数据
            isFormattingDubbo: true, // 格式化Dubbo返回数据
            type: ''
        };
    },
    watch: {
        $route(to, from) {
            if (to.path == '/testCarryOutCase') {
                this.executingCase();
            }
        }
    },
    created() {
        this.executingCase();
    },
    methods: {
        requestData(tab, event) {
            if (this.activeRequest == 0) {
                this.objData1 = this.objData.full_url;
            } else if (this.activeRequest == 1) {
                this.objData1 = this.objData.headers;
            } else if (this.activeRequest == 2) {
                this.objData1 = this.objData.req_param;
            } else if (this.activeRequest == 3) {
                this.objData1 = this.objData.asserts;
            }
        },
        relevantData(tab, event) {
            if (this.activeRelevant == 0) {
                this.objData2 = this.objData.response_header;
            } else if (this.activeRelevant == 1) {
                this.objData2 = this.objData.response_body;
            } else if (this.activeRelevant == 2) {
                this.objData2 = this.objData.tqjg;
            }
        },
        DubboData() {
            if (this.activeDubbo == 0) {
                this.objData3 = this.objData.host;
            } else if (this.activeDubbo == 1) {
                this.objData3 = this.objData.params;
            } else if (this.activeDubbo == 2) {
                this.objData3 = this.objData.result;
            } else if (this.activeDubbo == 3) {
                this.objData3 = this.objData.server_info;
            }
        },
        // 执行测试用例
        executingCase() {
            let params = {
                host_addr: localStorage.getItem('host_addr'),
                id: localStorage.getItem('id')
            };
            this.$api
                .executing_case(params)
                .then((res) => {
                    if (res.code == 0) {
                        console.log(res.data.length);
                        if (res.data.length) {
                            this.type = 'Dubbo';
                            this.objData = res.data[0];
                            this.objData3 = res.data[0].host;
                        } else {
                            this.objData = res.data;
                            this.objData1 = res.data.full_url;
                            this.objData2 = res.data.response_header;
                        }
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        formattingRequest() {
            this.isFormattingRequest = !this.isFormattingRequest;
        },
        formattingRelevant() {
            this.isFormattingRelevant = !this.isFormattingRelevant;
        },
        formattingDubbo() {
            this.isFormattingDubbo = !this.isFormattingDubbo;
        }
    }
};
</script>

<style scoped lang="less">
pre {
    background: #cccccc;
    border-radius: 3px;
    padding: 10px;
    box-sizing: border-box;
}
.pre {
    word-wrap: break-word;
    white-space: normal;
    word-break: break-all;
}
.request-data {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    h3 {
        margin-right: 20px;
    }
}
</style>

