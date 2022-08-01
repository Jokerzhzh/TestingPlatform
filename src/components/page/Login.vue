<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">自动化接口测试平台</div>
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="param.username" placeholder="username">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        placeholder="password"
                        v-model="param.password"
                        @keyup.enter.native="submitForm()"
                    >
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()">登录</el-button>
                </div>
                <!-- <p class="login-tips">Tips : 用户名和密码随便填。</p> -->
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data: function() {
        return {
            param: {
                // username: 'wangchao',
                // password: 'admin123',
                username: '',
                password: '',
            },
            rules: {
                username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
            },
        };
    },
    mounted() {
    },
    methods: {
    // 获取登录用户名
    getUsernames(callback) {
        let params = {uname:''};
    // /api/v1/funcapp/get_usernames/
    this.$api.get_usernames(params).then(res=>{
        if(res.code == 0){
            console.log('当前的res:',res)
             this.$store.commit("userList", res.result);
              localStorage.setItem('userList',JSON.stringify(res.result))
              if(callback) {
                  callback()
              }
        }
    })

    },
      submitForm() {
            this.$refs.login.validate(valid => {
                if (valid) {
                    let params = {
                        // username: 'wangchao',
                        // password: 'admin123'
                        username: this.param.username,
                        password: this.param.password
                    };
                    this.$api.login(params).then(res => {
                        if(res.code == 0){
                            this.$message.success('登录成功');
                            // 把token存入store
                            this.$store.commit("updateToken", res.token);
                            // 把uid存入store
                            this.$store.commit("updateUid", res.code);
        this.getUsernames(()=>{
                            // this.basicInfo();
                            setTimeout(()=>{
                                this.$router.push('/');
                            },1000)
        })

                           
                            
                        }else{
                            this.$message.error(res.msg);
                        }
                    }).catch(err=> {
                        console.log('登陆失败')
                    });
                    // 请求参数
                    // let params = {
                    //     loginType: 1,
                    //     userName: this.param.username,
                    //     password: this.param.password,
                    //     terminalType:3
                    // };
                    // this.$api.accountPwdLogin(params).then(res => {
                    //     if(res.code == 0){
                    //         this.$message.success('登录成功');
                    //         // 把token存入store
                    //         this.$store.commit("updateToken", res.data.token);
                    //         // 把uid存入store
                    //         this.$store.commit("updateUid", res.data.uid);
                    //         this.basicInfo();
                    //         setTimeout(()=>{
                    //             this.$router.push('/');
                    //         },300)
                            
                    //     }
                    // }).catch(err=> {
                    //     console.log('登陆失败')
                    // });
                } else {
                    this.$message.error('请输入账号和密码');
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        basicInfo(){
            this.$api.basicInfo({clientType: 1}).then(res => {
                if(res.code == 0){
                    // 把用户名存入store
                    this.$store.commit("updateUsername", res.data.userName);
                    // 把用户头像存入store
                    this.$store.commit("updateUserhead", res.data.headUrl);
                }
            }).catch(err=> {
                console.log('获取失败')
            });
        }
    },
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(https://jtmm.s3.cn-north-1.amazonaws.com.cn/ypyx/login-bg.jpg);
    background-size: 100%;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
</style>