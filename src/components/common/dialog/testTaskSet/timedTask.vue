<template>
    <div>
        <!-- 定时任务弹出框 -->
        <el-dialog title="定时选择器" :before-close="closeTimedTask" custom-class="add-el-dialog" :visible.sync="showTimedTask" width="40%">
            <div>
                <el-form :model="selector" label-width="70px"> 
                    <el-form-item label="选择环境">
                        <el-select v-model="selector.host_addr" placeholder="请选择环境" filterable class="handle-select mr10">
                            <el-option v-for="(item,index) in hostList" :key="index" :label="item.host" :value="item.host"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <el-tabs v-model="activeTab" @tab-click="handleClick">
                    <el-tab-pane label="分钟" name="0">
                        <div class="checkbox-box">
                            <el-checkbox-group v-model="selector.minute" @change="checkboxChange">
                                <el-checkbox v-for="item in 60" :label="item" :key="item">{{item}}分</el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="小时" name="1">
                        <div class="checkbox-box">
                            <el-checkbox-group v-model="selector.hour" @change="checkboxChange">
                                <el-checkbox v-for="item in 24" :label="item" :key="item">{{item}}时</el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="日期" name="2">
                        <div class="checkbox-box">
                            <el-checkbox-group v-model="selector.day" @change="checkboxChange">
                                <el-checkbox v-for="item in dateList" :label="item" :key="item">{{item}}日</el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="月份" name="3">
                        <div class="checkbox-box">
                            <el-checkbox-group v-model="selector.month" @change="checkboxChange">
                                <el-checkbox v-for="item in 12" :label="item" :key="item">{{item}}月</el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="星期几" name="4">
                        <div class="checkbox-box">
                            <el-checkbox-group v-model="selector.week" @change="checkboxChange">
                                <el-checkbox v-for="item in 7" :label="item" :key="item" style="width:80px;">
                                    {{item == 1?'星期一':''}}
                                    {{item == 2?'星期二':''}}
                                    {{item == 3?'星期三':''}}
                                    {{item == 4?'星期四':''}}
                                    {{item == 5?'星期五':''}}
                                    {{item == 6?'星期六':''}}
                                    {{item == 7?'星期日':''}}
                                </el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="timedStart(0)">停用</el-button>
                <el-button type="primary" @click="timedStart(1)">启用</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        props: {
            showTimedTask: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                activeTab: '0',
                dateList:31,
                selector:{
                    minute:[],
                    hour:[],
                    day:[],
                    month:[],
                    week:[],
                },
                hostList:[]
            }
        },
        created(){
            this.mGetDate();
            this.get_host();
        },
        methods: {
            checkboxChange(e){
                // console.log(e,'多选监听');
                // console.log(this.selector,'数据对象')
            },
            handleClick(e) {
                // console.log(e.index,'当前的切换');
                // console.log(e.index,'当前切换')
            },
            mGetDate(){
                var date = new Date();
                var year = date.getFullYear();
                var month = date.getMonth()+1;
                var d = new Date(year, month, 0);
                this.dateList = d.getDate();
            },
            // 定时任务启动
            timedStart(e){
                if(e == 1){
                    // 启用定时任务
                    this.selector.flag = 1;
                }else{
                    // 关闭定时任务
                    this.selector.flag = 0;
                }
                this.$emit('getTimedTask',this.selector);
                this.closeTimedTask();
            },

            // 关闭定时器弹出框
            closeTimedTask(){
                this.selector = {
                    minute:[],
                    hour:[],
                    day:[],
                    month:[],
                    week:[]
                }
                this.activeTab = "0";
                this.$emit('closeDialog');
            },
            // 查询host (执行任务集>选择环境)
            get_host(){
                this.$api.get_host({}).then(res => {
                    if(res.code == 0){
                        this.hostList = res.data;
                    }else{
                        this.$message.error(res.msg);
                    }
                }).catch(err=> {
                    this.$message.error(res.msg);
                });
            },
        },
    }

</script>


<style scoped lang="less">
.checkbox-box{
    padding: 10px 0;
    box-sizing: border-box;
    width: 100%;
    display: flex;
    flex-wrap: wrap
}
/deep/ .el-checkbox{
    width: 54px;
    margin: 10px 10px 10px 0;
}
.get-box{
    display: flex;
    margin-top: 10px;
    margin-bottom: 20px;
    width: 100%;
    justify-content: space-between;
}
.get-box-head{
    display: flex;
    align-items: center;
    .get-box-icon{
        font-size: 16px;
        margin-left:3px;
    }
}

.add-el-dialog{
    .el-select{
        width: 100%;
        margin-right: 10px;
    }
    .el-input{
        margin-right: 10px;
    }
    .el-switch{
        margin-top: 5px;
    }
}
.handle-box {
    margin-bottom: 20px;
    .el-input{
        width: 200px;
    }
    .el-select{
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
</style>
