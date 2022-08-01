<template>
    <div>
        <!-- 执行弹出框 -->
        <el-dialog title="执行用例" :before-close="closeCarryOut" custom-class="add-el-dialog" :visible.sync="carryOut" width="40%">
            <el-form :model="formCarryOut" label-width="70px">
                <el-form-item label="用例ID">
                    <el-input placeholder="请输入用例ID" @input="change($event)" v-model="formCarryOut.id"></el-input>
                </el-form-item>
                <el-form-item label="选环境">
                    <el-select v-model="formCarryOut.host_addr" @input="change($event)" placeholder="请选择" filterable class="handle-select mr10">
                        <el-option v-for="(item,index) in hostList" :key="index" :label="item.host" :value="item.host"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeCarryOut">关闭</el-button>
                <el-button type="primary" @click="carryOutSubmit">执行</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        props: {
            carryOut: {
                type: Boolean,
                default: false
            },
            hostList:{
                type:Array,
                default: ()  => []
            },
            formCarryOut:{
                type:Object,
                default: ()  => {}
            }
        },
        data() {
            return {}
        },
        methods: {
            // 提交执行
            carryOutSubmit(){
                // console.log(this.formCarryOut,'获取添加执行信息');
                this.$emit('getCarryOut',this.formCarryOut);
            },
            // 关闭 执行 弹出框监听重置内容
            closeCarryOut(){
                this.$emit('closeDialog');
            },
            // 重新渲染 input 可编辑操作
            change() {
                this.$forceUpdate();
            },
        }
    }

</script>


<style scoped lang="less">
  
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
