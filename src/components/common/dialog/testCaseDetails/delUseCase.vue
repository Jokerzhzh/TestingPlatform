<template>
    <div>
        <!-- 删除用例弹出框 -->
        <el-dialog title="删除用例" :before-close="closeAddUseCase" custom-class="add-el-dialog" :visible.sync="isdelUseCase" width="850px">
            <div class="edit_dev">
                <el-transfer :button-texts="['撤回', '删除']" :titles="['全选', '全选']" v-model="transferValue" @change="changeTransfer" :data="apiArr"></el-transfer>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeAddUseCase">关闭</el-button>
                <el-button type="primary" @click="addUseCaseSubmit">提交</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        props: {
            isdelUseCase: {
                type: Boolean,
                default: false
            },
        },
        data() {
            return {
                transferValue: [],
                transferData:[], //穿梭框数据
                projectsName:[], // 项目名称检索
                moduleName:[], // 模块名称检索
                apiName:[], // 选择接口名称
                apiId:'', // 选择接口ID
                apiArr:[], //接口数组
                params:{}, //
            }
        },
        watch:{
     
        },
        created() {
            // 由任务集id获取该任务集下的测试用例名称
            this.tidToCasenames();
        },
        methods: {
            // 由任务集id获取该任务集下的测试用例名称
            tidToCasenames(){
                let params = {
                    task_id:localStorage.getItem('taskId'),
                }
                // 获取项目名称
                this.$api.tid_to_casenames(params).then(res => {
                    if(res.code == 0){
                        let arrayData = res.data;
                        this.apiArr = JSON.parse(JSON.stringify(arrayData).replace(/id/g,"key").replace(/case_name/g,"label"));
                    }else{
                        this.$message.error(res.msg);
                    }
                }).catch(err=> {
                    this.$message.error(res.msg);
                });
            },
            // 关闭 添加用例弹出层
            closeAddUseCase(){
                this.$emit('closeDialog');
            },
            // 提交添加的用例
            addUseCaseSubmit(){
                this.$emit('getdelUseCaseSubmit',this.transferData);
            },
            // 监听穿梭框
            changeTransfer(e){
                this.transferData = e;
            },

        }
    }

</script>


<style scoped lang="less">
  
.el-transfer{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
/deep/ .el-transfer-panel {
     width:300px;
}
/deep/ .el-transfer-panel__body{
    height: 300px;
}
/deep/ .el-transfer-panel__list{
    height: 300px;
}
/deep/ .el-transfer__buttons{
    padding: 0;
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
    display: flex;
    justify-content:space-between;
    margin-bottom: 20px;
    .el-input{
        width: 200px;
    }
    .el-select{
        width: 240px;
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
