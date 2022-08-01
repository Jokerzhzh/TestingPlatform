<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-select
                    ref="select3"
                    @visible-change="changeFocus3"
                    v-model="formData1.type_id"
                    filterable
                    @input="change($event)"
                    placeholder="请选择分类"
                    class="handle-select mr10"
                >
                    <el-option v-for="item in typeInfoName" :key="item.id" :label="item.type_name" :value="item.id"></el-option>
                </el-select>
                <el-input v-model="formData1.name" placeholder="视频名称" class="handle-input mr10"></el-input>
                <el-button-group>
                    <el-button type="primary" icon="el-icon-search" class="handle-del mr10" @click="queryData">搜索</el-button>
                    <el-button type="primary" @click="onReload" class="handle-del mr10">重置</el-button>
                </el-button-group>
                <el-button-group>
                    <el-button type="primary" icon="el-icon-upload" class="handle-del mr10" @click="addVideo">上传视频</el-button>
                    <el-button type="primary" icon="el-icon-reading" class="handle-del mr10" @click="VideoHistory">播放历史</el-button>
                    <el-button type="primary" icon="el-icon-collection-tag" class="handle-del mr10" @click="isCollectionVideo"
                        >我的收藏</el-button
                    >
                    <el-button type="primary" icon="el-icon-download" class="handle-del mr10" @click="isDownloadVideo">我的下载</el-button>
                    <el-button type="primary" icon="el-icon-user" class="handle-del mr10" @click="isUploadVideo">我的视频</el-button>
                </el-button-group>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column label="ID" width="66" align="center">
                    <template slot-scope="scope">{{ scope.row.id }}</template>
                </el-table-column>
                <el-table-column label="视频" align="center">
                    <template slot-scope="scope">
                        <div class="video-name" @click="getVideoAddr(scope.row.id)">
                            <video width="140" id="video" :src="scope.row.s3_addr"></video>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="视频名称" align="center">
                    <template slot-scope="scope">
                        <div class="video-name" @click="getVideoAddr(scope.row.id)">{{ scope.row.video_name }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="视频描述" align="center">
                    <template slot-scope="scope">{{ scope.row.video_desc }}</template>
                </el-table-column>
                <el-table-column label="视频大小" width="110" align="center">
                    <template slot-scope="scope">{{ scope.row.video_size }}MB</template>
                </el-table-column>
                <el-table-column label="上传人员" width="100" align="center">
                    <template slot-scope="scope">{{ scope.row.video_up_user }}</template>
                </el-table-column>
                <el-table-column label="播放次数" width="80" align="center">
                    <template slot-scope="scope">{{ scope.row.play_sum }}</template>
                </el-table-column>
                <el-table-column label="下载次数" width="80" align="center">
                    <template slot-scope="scope">{{ scope.row.download_sum }}</template>
                </el-table-column>
                <el-table-column prop="date" label="上传时间" width="160" align="center">
                    <template slot-scope="scope">{{ format(scope.row.video_up_time) }}</template>
                </el-table-column>
                <el-table-column label="操作" width="140" fixed="right" align="center">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="播放" placement="top">
                            <el-button icon="el-icon-caret-right" type="primary" circle @click="getVideoAddr(scope.row.id)"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="下载" placement="top">
                            <el-button icon="el-icon-download" circle @click="download(scope.row.id)">
                                <!-- <a href="https://jtmm.s3.cn-north-1.amazonaws.com.cn/2021/09/CBBCBF210BB54DAA87276AA3F27AF1B6.mp4"></a> -->
                            </el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="收藏" placement="top">
                            <el-button
                                type="warning"
                                icon="el-icon-star-off"
                                circle
                                @click="collectionVideo(scope.row.id, (collection = 1))"
                            ></el-button>
                        </el-tooltip>
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
        <!-- 上传视频 -->
        <el-dialog title="上传视频" @close="closeAddVideo" custom-class="add-el-dialog" :visible.sync="isAddVideo" width="40%">
            <el-form ref="form" :model="formData" label-width="70px">
                <el-form-item label="选择文件" prop="file">
                    <input type="file" id="filepicker" accept="video/*" @change="chooseVideoInput" class="uploadVideo_input" />
                    <!-- <video id="video" poster="封面图路径" :src="video_url" autoplay controls></video> -->
                </el-form-item>
                <el-form-item label="一级类目">
                    <el-select
                        ref="select1"
                        @visible-change="changeFocus1"
                        v-model="formData.category_name"
                        filterable
                        @change="changeFirstCategoryName"
                        placeholder="请选择一级类目"
                        class="handle-select mr10"
                    >
                        <el-option
                            v-for="item in firstCategoryName"
                            :key="item.id"
                            :label="item.category_name"
                            :value="item.category_name"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="二级类目">
                    <el-select
                        ref="select2"
                        @visible-change="changeFocus2"
                        v-model="formData.type"
                        filterable
                        @input="change($event)"
                        placeholder="请选择二级类目"
                        class="handle-select mr10"
                    >
                        <el-option v-for="item in secondCategoryName" :key="item.id" :label="item.type_name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="视频描述">
                    <el-input placeholder="请输入视频描述" v-model="formData.video_desc" @input="change($event)"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isAddVideo = false">取 消</el-button>
                <el-button type="primary" :disabled="isDisabled" @click="submitAdd">提 交</el-button>
            </span>
        </el-dialog>
        <!-- 播放视频 -->
        <el-dialog title="播放视频" @close="closePlayVideo" custom-class="add-el-dialog" :visible.sync="isplayVideo" width="60%">
            <el-form>
                <el-form-item>
                    <!-- autoplay 设置视频自动播放 -->
                    <!-- muted 设置视频静音 -->
                    <!-- controls 设置显示播放插件 -->
                    <!-- poster="封面图路径" -->
                    <video id="video" :src="video_url" controls width="870px"></video>
                </el-form-item>
            </el-form>
            <!-- <span slot="footer" class="dialog-footer"> -->
            <!-- <el-button @click="isplayVideo = false">关 闭</el-button> -->
            <!-- @click="downloadVideo()" -->
            <!-- <el-button type="primary" @change="downloadUrl">下 载</el-button> -->
            <!-- <el-button style="margin-right: 10px"><a @click="handleDownloads(video_url)">下载</a></el-button> -->
            <!-- <a href=" " :download="video_url" text-decoration:none @click="downloadVideo">下 载</a> -->
            <!-- </span> -->
        </el-dialog>
        <!-- 我播放的视频 -->
        <el-dialog title="播放历史" @close="closeVideoHistory" custom-class="add-el-dialog" :visible.sync="isHistory" width="70%">
            <el-table :data="playVideoName" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column label="ID" width="66" align="center">
                    <template slot-scope="scope">{{ scope.row.id }}</template>
                </el-table-column>
                <el-table-column label="视频名称" align="center">
                    <template slot-scope="scope">
                        <div class="video-name" @click="getVideoAddr(scope.row.id)">
                            {{ scope.row.video_name }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="视频描述" align="center">
                    <template slot-scope="scope">{{ scope.row.video_desc }}</template>
                </el-table-column>
                <el-table-column label="操作" width="100" fixed="right" align="center">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="播放" placement="top">
                            <el-button icon="el-icon-caret-right" type="primary" circle @click="getVideoAddr(scope.row.id)"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="收藏" placement="top">
                            <el-button
                                type="warning"
                                icon="el-icon-star-off"
                                circle
                                @click="collectionVideo(scope.row.id, (collection = 1))"
                            ></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next,jumper"
                    :current-page="params1.page"
                    :page-size="params1.page_size"
                    :total="pageTotal1"
                    @current-change="handleHistoryPageChange"
                ></el-pagination>
            </div>
        </el-dialog>
        <!-- 我收藏的视频 -->
        <el-dialog title="我的收藏" @close="closeCollectionVideo" custom-class="add-el-dialog" :visible.sync="isCollection" width="70%">
            <el-table :data="collectionVideoName" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column label="ID" width="66" align="center">
                    <template slot-scope="scope">{{ scope.row.id }}</template>
                </el-table-column>
                <el-table-column label="视频名称" align="center">
                    <template slot-scope="scope">
                        <div class="video-name" @click="getVideoAddr(scope.row.id)">
                            {{ scope.row.video_name }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="视频描述" align="center">
                    <template slot-scope="scope">{{ scope.row.video_desc }}</template>
                </el-table-column>
                <el-table-column label="操作" width="100" fixed="right" align="center">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="播放" placement="top">
                            <el-button icon="el-icon-caret-right" type="primary" circle @click="getVideoAddr(scope.row.id)"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="取消收藏" placement="top">
                            <el-button
                                icon="el-icon-star-on"
                                type="warning"
                                circle
                                @click="collectionVideo(scope.row.id, (collection = 0))"
                            ></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next,jumper"
                    :current-page="params2.page"
                    :page-size="params2.page_size"
                    :total="pageTotal2"
                    @current-change="handleCollectionPageChange"
                ></el-pagination>
            </div>
        </el-dialog>
        <!-- 我的下载 -->
        <el-dialog title="我的下载" @close="closeDownloadVideo" custom-class="add-el-dialog" :visible.sync="isDownload" width="70%">
            <el-table :data="downloadVideoName" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column label="ID" width="66" align="center">
                    <template slot-scope="scope">{{ scope.row.id }}</template>
                </el-table-column>
                <el-table-column label="视频名称" align="center">
                    <template slot-scope="scope">
                        <div class="video-name" @click="getVideoAddr(scope.row.id)">
                            {{ scope.row.video_name }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="视频描述" align="center">
                    <template slot-scope="scope">{{ scope.row.video_desc }}</template>
                </el-table-column>
                <el-table-column label="操作" width="100" fixed="right" align="center">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="播放" placement="top">
                            <el-button icon="el-icon-caret-right" type="primary" circle @click="getVideoAddr(scope.row.id)"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="收藏" placement="top">
                            <el-button
                                icon="el-icon-star-off"
                                type="warning"
                                circle
                                @click="collectionVideo(scope.row.id, (collection = 1))"
                            ></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next,jumper"
                    :current-page="params3.page"
                    :page-size="params3.page_size"
                    :total="pageTotal3"
                    @current-change="handleDownloadPageChange"
                ></el-pagination>
            </div>
        </el-dialog>
        <!-- 我的视频 -->
        <el-dialog title="我的视频" @close="closeUploadVideo" custom-class="add-el-dialog" :visible.sync="isUpload" width="70%">
            <el-table :data="uploadVideoName" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column label="ID" width="66" align="center">
                    <template slot-scope="scope">{{ scope.row.id }}</template>
                </el-table-column>
                <el-table-column label="视频名称" align="center">
                    <template slot-scope="scope">
                        <div class="video-name" @click="getVideoAddr(scope.row.id)">
                            {{ scope.row.video_name }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="视频描述" align="center">
                    <template slot-scope="scope">{{ scope.row.video_desc }}</template>
                </el-table-column>
                <el-table-column label="操作" width="140" fixed="right" align="center">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="播放" placement="top">
                            <el-button icon="el-icon-caret-right" type="primary" circle @click="getVideoAddr(scope.row.id)"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="收藏" placement="top">
                            <el-button
                                icon="el-icon-star-off"
                                type="warning"
                                circle
                                @click="collectionVideo(scope.row.id, (collection = 1))"
                            ></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除" placement="top">
                            <el-button icon="el-icon-delete" type="danger" circle @click="deleteVideoOrFile(scope.row.id)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next,jumper"
                    :current-page="params4.page"
                    :page-size="params4.page_size"
                    :total="pageTotal4"
                    @current-change="handleUploadPageChange"
                ></el-pagination>
            </div>
        </el-dialog>
    </div>
</template>
<script>
// 1.引入动画组件
import { Loading } from 'element-ui';
export default {
    name: 'basetable',
    data() {
        return {
            video_url: '', // 视频的地址
            params: {
                page: 1,
                page_size: 10
            },
            params1: {
                page: 1,
                page_size: 10
            },
            params2: {
                page: 1,
                page_size: 10
            },
            params3: {
                page: 1,
                page_size: 10
            },
            params4: {
                page: 1,
                page_size: 10
            },
            tableData: [], // 列表数据
            pageTotal: 0, // 数据总条数
            pageTotal1: 0, // 播放历史总条数
            pageTotal2: 0, // 收藏视频总条数
            pageTotal3: 0, // 下载视频总条数
            pageTotal4: 0, // 我的视频总条数
            firstCategoryName: [], // 一级类目列表
            secondCategoryName: [], // 二级类目列表
            typeInfoName: [], // 全部的二级分类列表
            playVideoName: [], // 我播放的视频列表
            collectionVideoName: [], // 收藏视频列表
            downloadVideoName: [], // 我的下载列表
            uploadVideoName: [], // 我的视频列表
            formData: {
                id: '',
                // video: '', // 文件
                type: '', // 二级类目id
                video_desc: '', // 视频描述
                collection: '' // 1-收藏/0-取消收藏
            },
            formData1: {
                type: 1, // 0=文件查询；1=视频查询
                name: '', // 视频或文件名称
                type_id: '' // 二级分类
            },
            deleteDate: {
                id: '', // 需要删除的id
                type: '' // 视频：type=1 文件：type=0
            },
            isAddVideo: false, // 上传视频
            isplayVideo: false, // 播放视频
            isHistory: false, // 浏览历史
            isCollection: false, // 收藏视频
            isDownload: false, // 我的下载
            isUpload: false, // 我的视频
            isDisabled: false,
            paginationIndex: 1, //分页默认 第1页
            paginationIndex1: 1, //分页默认 第1页
            paginationIndex2: 1, //分页默认 第1页
            paginationIndex3: 1, //分页默认 第1页
            paginationIndex4: 1, //分页默认 第1页
            // 2.定义实例
            loadingInstance: null
        };
    },
    created() {
        console.log('初次进入页面渲染接口数据');
        this.getData();
        this.getFirstCategory();
        this.getTypeInfo();
    },
    mounted() {
        // 绑定enter事件
        document.addEventListener('keyup', this.enterKey);
    },
    destroyed() {
        // 销毁enter事件
        document.removeEventListener('keyup', this.enterKey);
    },
    methods: {
        // 获取视频信息
        getData() {
            this.$api
                .get_videoinfo(this.params)
                .then((res) => {
                    if (res.results.code == 0) {
                        this.tableData = res.results.result;
                        this.pageTotal = res.count;
                        this.params.page_size = res.results.page_size;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.results.msg);
                });
        },
        // 获取一级类目信息
        getFirstCategory() {
            this.$api
                .first_category({})
                .then((res) => {
                    if (res.code == 0) {
                        this.firstCategoryName = res.result;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.result.msg);
                });
        },
        // 列表选择一级类目名称监听
        changeFirstCategoryName(e) {
            this.$delete(this.params, 'category_name');
            this.formData.category_name = e;
            let id;
            this.firstCategoryName.forEach((item) => {
                if (e == item.category_name) {
                    id = item.id;
                }
            });
            this.getSecondCategory(id);
        },
        // 获取二级类目信息
        getSecondCategory(id) {
            this.$api
                .second_category({ id })
                .then((res) => {
                    if (res.code == 0) {
                        this.secondCategoryName = res.result;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        // 获取全部的二级分类
        getTypeInfo() {
            this.$api
                .get_type_info()
                .then((res) => {
                    if (res.code == 0) {
                        this.typeInfoName = res.result;
                    } else {
                        this.$message.erroe(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        // 上传视频 弹出层
        addVideo() {
            this.isAddVideo = true;
        },
        // 收藏视频 弹出层
        isCollectionVideo() {
            this.isCollection = true;
            this.myCollectionVideo();
        },
        // 我的下载 弹出层
        isDownloadVideo() {
            this.isDownload = true;
            this.myDownloadVideo();
        },
        // 我的视频 弹出层
        isUploadVideo() {
            this.isUpload = true;
            this.myUploadVideo();
        },
        // 播放视频历史 弹出层
        VideoHistory() {
            this.isHistory = true;
            this.myPlayVideo();
        },
        // 监听选择文件信息
        chooseVideoInput(event) {
            var files = document.getElementById('filepicker').files[0];
            var url = URL.createObjectURL(files);
            // this.video_url = url;
        },
        // 提交视频 弹出层
        submitAdd() {
            let formData = new FormData();
            // 获取选择的文件信息
            let video = document.getElementById('filepicker').files[0];
            formData.append('video', video);
            let type = this.formData.type;
            formData.append('type', type);
            let video_desc = this.formData.video_desc;
            formData.append('video_desc', video_desc);
            console.log(formData, '添加参数');
            this.isDisabled = true;
            // 3. 生成动画
            this.loadingInstance = Loading.service({
                // 动画中的文字
                text: '正在上传',
                // 要加载动画的容器-上传弹窗
                target: '.el-dialog'
            });
            this.$api
                .video_upload(formData)
                .then((res) => {
                    if (res.code == 0) {
                        this.$message({
                            message: '上传成功',
                            type: 'success'
                        });
                        this.closeAddVideo();
                        this.getData();
                        // 4. 请求完成后关闭动画
                        this.loadingInstance.close();
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        // 关闭上传视频弹窗
        closeAddVideo() {
            this.params = {
                category_name: '',
                type_name: ''
            };
            this.secondCategoryName = [];
            this.isAddVideo = false;
            this.formData = {
                video: '',
                type: '',
                video_desc: ''
            };
            this.isDisabled = false;
        },
        // 关闭播放视频弹窗
        closePlayVideo() {
            this.isplayVideo = false;
            this.getData();
        },
        // 关闭播放历史弹窗
        closeVideoHistory() {
            this.isHistory = false;
        },
        // 关闭我的下载弹窗
        closeDownloadVideo() {
            this.isDownload = false;
        },
        // 关闭我的视频弹窗
        closeUploadVideo() {
            this.isUpload = false;
        },
        // 关闭我的收藏弹窗
        closeCollectionVideo() {
            this.isCollection = false;
        },
        // 获取视频播放地址
        getVideoAddr(id) {
            // 打开播放视频弹窗
            this.isplayVideo = true;
            this.$api
                .get_video_addr({ id })
                .then((res) => {
                    if (res.code == 0) {
                        // this.$message.success(res.result[0].s3_addr);
                        // 播放地址
                        this.video_url = res.result[0].s3_addr;
                        // console.log(this.video_url);
                        this.videoId = res.id;
                        var video = document.getElementById('video');
                        video.currentTime = 0.1; // 设置视频从0.1秒开始播放
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        // 我下载的视频
        myDownloadVideo() {
            this.$api
                .my_download_video(this.params3)
                .then((res) => {
                    if (res.code == 1) {
                        this.$message.error(res.msg);
                        // this.collectionFileName = [];
                    } else if (res.results.code == 0) {
                        this.downloadVideoName = res.results.result;
                        this.pageTotal3 = res.count;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        // 下载视频
        // download(id) {
        //     this.tableData.forEach((item) => {
        //         if (item.id == id) {
        //             this.s3_addr = item.s3_addr;
        //             this.video_name = item.video_name;
        //         }
        //     });
        //     fetch(this.s3_addr)
        //         .then((res) => res.blob())
        //         .then((blob) => {
        //             const a = document.createElement('a');
        //             document.body.appendChild(a);
        //             a.style.display = 'none';
        //             const url = window.URL.createObjectURL(blob);
        //             a.href = url;
        //             a.download = this.video_name;
        //             a.click();
        //             document.body.removeChild(a);
        //             window.URL.revokeObjectURL(url);
        //         });
        //     this.downloadVideo(id);
        // },
        download(id) {
            this.tableData.forEach((item) => {
                if (item.id == id) {
                    this.s3_addr = item.s3_addr;
                    this.video_name = item.video_name;
                }
            });
            var videoName = this.video_name;
            var url; //下载地址
            var xhr = new XMLHttpRequest();
            xhr.open('get', this.s3_addr, true); // 也可以使用POST方式，根据接口
            // 						xhr.setRequestHeader("dis_k",`cb9a62d3796e276f8707318b3c48ed3d`);
            // xhr.setRequestHeader("dis_t",`1617786336`);
            xhr.responseType = 'blob'; // 返回类型blob

            xhr.onload = function () {
                if (this.status === 200) {
                    var blob = this.response;
                    var reader = new FileReader();

                    reader.readAsDataURL(blob); // 转换为base64，可以直接放入a表情href
                    reader.onload = function (e) {
                        var a = document.createElement('a');
                        a.download = videoName; //下载文件名
                        a.href = e.target.result;
                        a.click();
                        window.URL.revokeObjectURL(e.target.result);
                    };
                }
            };
            xhr.send();
            this.downloadVideo(id);
        },
        // 下载播放视频次数
        downloadVideo(id) {
            this.$api
                .download_sum_video({ id })
                .then((res) => {
                    if (res.code == 0) {
                        // this.$message.success(res.msg);
                        this.getData();
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        // 获取我播放的视频
        myPlayVideo() {
            this.$api
                .my_play_video(this.params1)
                .then((res) => {
                    if (res.code == 1) {
                        this.$message.error(res.msg);
                    } else if (res.results.code == 0) {
                        // this.$message.success(res.results.msg);
                        this.playVideoName = res.results.result;
                        // console.log(this.playVideoName);
                        this.pageTotal1 = res.count;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        // 我的收藏--视频
        myCollectionVideo() {
            this.$api
                .my_collection_video(this.params2)
                .then((res) => {
                    if (res.code == 1) {
                        this.$message.error(res.msg);
                        this.collectionVideoName = [];
                    } else if (res.results.code == 0) {
                        // this.$message.success(res.results.msg);
                        this.collectionVideoName = res.results.result;
                        // console.log(this.collectionVideoName);
                        this.pageTotal2 = res.count;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        // 收藏/取消收藏 1-收藏/0-取消收藏
        collectionVideo(id, collection) {
            this.formData.id = id;
            this.formData.collection = collection;
            this.$api
                .collection_video(this.formData)
                .then((res) => {
                    if (res.code == 0) {
                        this.$message.success(res.msg);
                        this.myCollectionVideo();
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        // 删除我的视频
        deleteVideoOrFile(id) {
            this.deleteDate.id = id;
            this.deleteDate.type = 1;
            this.$api
                .delete_video_or_file(this.deleteDate)
                .then((res) => {
                    if (res.code == 0) {
                        this.$message.success(res.msg);
                        this.getData();
                        this.myUploadVideo();
                    } else {
                        this.$message.erroe(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        // 我的视频
        myUploadVideo() {
            this.$api
                .my_upload_video(this.params4)
                .then((res) => {
                    if (res.results.code == 0) {
                        this.uploadVideoName = res.results.result;
                        this.pageTotal4 = res.count;
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
            if (code == 13 && path == '/testKnowledgeVideo') {
                this.queryData();
            }
        },
        // 数据查询
        queryData() {
            this.$api
                .query_data(this.formData1)
                .then((res) => {
                    if (res.results.code == 0) {
                        // this.$message.success(res.results.msg);
                        this.tableData = res.results.result;
                        this.pageTotal = res.count;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        // 重置按钮
        onReload() {
            this.formData1.type_id = '';
            this.formData1.name = '';
            this.getData();
        },
        // 重新渲染 input 可编辑操作
        change() {
            this.$forceUpdate();
        },
        // 分页导航
        handlePageChange(val) {
            this.paginationIndex = val;
            this.$set(this.params, 'page', val);
            this.getData();
        },
        // 播放历史的分页导航
        handleHistoryPageChange(val) {
            this.paginationIndex1 = val;
            this.$set(this.params1, 'page', val);
            this.myPlayVideo();
        },
        // 我的收藏的分页导航
        handleCollectionPageChange(val) {
            this.paginationIndex2 = val;
            this.$set(this.params2, 'page', val);
            this.myCollectionVideo();
        },
        // 我的下载的分页导航
        handleDownloadPageChange(val) {
            this.paginationIndex3 = val;
            this.$set(this.params3, 'page', val);
            this.myDownloadVideo();
        },
        // 我的视频的分页导航
        handleUploadPageChange(val) {
            this.paginationIndex4 = val;
            this.$set(this.params4, 'page', val);
            this.myUploadVideo();
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
        changeFocus3(val) {
            if (val) {
                this.$refs.select3.focus();
            } else {
                this.$refs.select3.blur();
            }
        }
    },
    computed: {
        format() {
            return (originVal) => {
                const dt = new Date(originVal);

                const y = dt.getFullYear();
                const m = (dt.getMonth() + 1 + '').padStart(2, '0');
                const d = (dt.getDate() + '').padStart(2, '0');

                const hh = (dt.getHours() + '').padStart(2, '0');
                const mm = (dt.getMinutes() + '').padStart(2, '0');
                const ss = (dt.getSeconds() + '').padStart(2, '0');

                return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
            };
        }
    }
};
</script>

<style scoped lang="less">
.handle-box {
    margin-bottom: 10px;
    .el-input {
        width: 200px;
    }
    .el-select {
        width: 150px;
    }
}
.el-form {
    width: 100%;
    overflow: hidden;
}

.add-el-dialog {
    .el-select {
        width: 100%;
    }
    .el-date-editor {
        width: 100%;
    }
}
.head-box {
    .el-form-item {
        margin-bottom: 10px;
        float: left;
    }
    .el-input {
        width: 300px;
    }
    .el-select {
        width: 120px;
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
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
.video-name {
    color: Blue;
    cursor: pointer;
}
</style>
