import { api } from './service';
import * as apiChart from './tableCharts';
import * as uiLibrary from './uiLibrary';
import * as uiTestTaskSet from './uiTestTaskSet';
// import * as apiTest from './tesReport';
export default {
    // 首页登录
    login(data) {
        return api.post('/api/v1/login/', data);
    },
    // 项目检索状态+列表
    search_projects(data) {
        return api.get('/api/v1/interface_test/search_projects/', data);
    },
    // 项目选择名称
    get_project_name(data) {
        return api.get('/api/v1/interface_test/get_project_name/', data);
    },
    // 模块检索状态+列表
    search_modules(data) {
        return api.get('/api/v1/interface_test/search_modules/', data);
    },
    // 模块选择名称
    get_module_name(data) {
        return api.get('/api/v1/interface_test/test_get_module_name/' + data.id + '/');
    },
    // 从Yapi拉取模块数据
    pull_modules_info() {
        return api.post('/api/v1/interface_test/pull_modules_info/');
    },
    // 编辑模块数据
    edit_modules(data) {
        return api.put('/api/v1/interface_test/edit_modules/' + data.id + '/', data);
    },
    // 删除模块数据
    del_modules(data) {
        return api.delete('/api/v1/interface_test/del_modules/', data);
    },
    // 查询api 状态+列表
    api_search(data) {
        return api.get('/api/v1/interface_test/api_search/', data);
    },
    // 删除接口
    delete_api(data) {
        return api.delete('/api/v1/interface_test/delete_api/', data);
    },
    // 新增接口提交
    add_api(data) {
        return api.post('/api/v1/interface_test/add_api/', data);
    },
    // 修改接口提交
    modify_api(data) {
        return api.put('/api/v1/interface_test/modify_api/' + data.id + '/', data);
    },
    // 查询用例列表
    cases_search(data) {
        return api.get('/api/v1/interface_test/cases_search/', data);
    },
    // 获取接口名称
    get_api_name(data) {
        return api.get('/api/v1/interface_test/get_api_name/', data);
    },
    // 删除用例
    delete_case(data) {
        return api.delete('/api/v1/interface_test/delete_case/', data);
    },
    // 创建用例
    add_case(data) {
        return api.post('/api/v1/interface_test/add_case/', data);
    },
    // 获取测试用例详情
    get_caseinfo(data) {
        return api.get('/api/v1/interface_test/get_caseinfo/', data);
    },
    // 修改测试用例
    modify_case(data) {
        return api.post('/api/v1/interface_test/modify_case/', data);
    },
    // 查询host (执行用例>选环境)
    get_host(data) {
        return api.get('/api/v1/interface_test/get_host/', data);
    },
    // 执行测试用例
    executing_case(data) {
        return api.post('/api/v1/interface_test/executing_case/', data);
    },
    // 添加测试用例sql
    add_sqlcase(data) {
        return api.post('/api/v1/interface_test/add_sqlcase/', data);
    },
    // 查询任务集
    search_taskList(data) {
        return api.get('/api/v1/interface_test/search_task/', data);
    },
    // 删除任务集
    delete_task(data) {
        return api.delete('/api/v1/interface_test/delete_task/', data);
    },
    // 创建任务集
    add_task(data) {
        return api.post('/api/v1/interface_test/add_task/', data);
    },
    // 修改任务集
    modify_task(data) {
        return api.put('/api/v1/interface_test/modify_task/' + data.id + '/', data);
    },
    // 执行任务集
    executing_task(data) {
        return api.post('/api/v1/interface_test/executing_task/', data);
    },
    // 获取任务集详情
    taskset_detail(data) {
        return api.get('/api/v1/interface_test/taskset_detail/' + data.id + '/?page=' + data.page);
    },
    // 查询历史测试报告
    search_report(data) {
        return api.get('/api/v1/interface_test/search_report/', data);
    },
    // 根据报告名称查看报告信息
    query_single_report(data) {
        return api.get('/api/v1/interface_test/query_single_report/', data);
    },
    // 数据库mysql连接信息查询和获取
    get_sql(data) {
        return api.get('/api/v1/interface_test/get_sql/', data);
    },
    // 数据库mysql连接信息入库 (添加)
    add_sql(data) {
        return api.post('/api/v1/interface_test/add_sql/', data);
    },
    // 数据库mysql连接信息删除
    del_sql(data) {
        return api.delete('/api/v1/interface_test/del_sql/', data);
    },
    // 数据库mysql连接信息修改
    updata_sql(data) {
        return api.put('/api/v1/interface_test/put_sql/', data);
    },
    // 获取执行多个任务汇总信息
    tasks_total_massage(data) {
        return api.get('/api/v1/interface_test/tasks_total_massage/', data);
    },
    // 查询host（测试环境页面）
    get_host(data) {
        return api.get('/api/v1/interface_test/get_host/', data);
    },
    // 创建host (测试环境页面)
    add_host(data) {
        return api.post('/api/v1/interface_test/add_host/', data);
    },
    // 修改host (测试环境页面)
    modify_host(data) {
        return api.put('/api/v1/interface_test/modify_host/' + data.host_id + '/', data);
    },
    // 删除host (测试环境页面)
    delete_host(data) {
        return api.delete('/api/v1/interface_test/delete_host/', data);
    },
    // 根据模块id查询该模块下的接口名称
    get_apiname(data) {
        // return api.get('/api/v1/interface_test/get_apiname/', data);
        return api.get('/api/v1/interface_test/module_to_apiname/', data);
    },
    // 根据接口id查询该接口下的测试用例
    get_casename(data) {
        return api.get('/api/v1/interface_test/get_casename/', data);
    },
    // 测试报告明细接口
    report_detail(data) {
        return api.get('/api/v1/interface_test/report_detail/', data);
    },
    // 任务集添加用例
    cases_to_taskset(data) {
        return api.post('/api/v1/interface_test/cases_to_taskset/', data);
    },
    // 设置定时任务
    setuptimedtask(data) {
        return api.post('/api/v1/interface_test/setuptimedtask/', data);
    },
    // 由任务集id获取该任务集下的测试用例名称
    tid_to_casenames(data) {
        return api.get('/api/v1/interface_test/tid_to_casenames/', data);
    },
    // 导入用例
    uploadFile(data, file) {
        return api.post('/api/v1/interface_test/uploadFile/' + file.name, data);
    },
    // 导入用例--根据postman导出的json文件导入
    importPostmanData(data) {
        return api.post('/api/v1/interface_test/import_postman_data/', data);
    },
    // 导入用例
    // importFile(data, file) {
    //     return api.post('/api/v1/funcapp/importFile/' + file.name, data);
    // },
    importFile(data) {
        return api.post('/api/v1/funcapp/upload_cases_filename/', data);
    },
    // 导出用例
    exportFile(data) {
        return api.post('/api/v1/funcapp/case/download/', data);
    },
    // 任务集更新(删除)用例
    cases_modify_taskset(data) {
        return api.put('/api/v1/interface_test/cases_modify_taskset/', data);
    },
    // 获取用户名称
    get_usernames(data) {
        return api.get('/api/v1/funcapp/get_usernames', data);
    },
    // 获取迭代列表
    get_iteration_list(data) {
        return api.get('/api/v1/funcapp/iterproject_name/?pid=' + data.key);
    },
    get_iter_name(data) {
        return api.get('/api/v1/funcapp/get_iter_name/', data);
    },
    // // 获取任务
    // tname_id(data) {
    //     return api.get('/api/v1/funcapp/tname_id/', data);
    // },
    // // 获取项目
    // projectName(data) {
    //     return api.get('/api/v1/funcapp/jira_project_name/', data);
    // },

    // 项目下接口

    // 查询项目
    on_search_project(data) {
        return api.get('/api/v1/funcapp/search_project/', data);
    },
    // 查询项目
    on_search_big_project(data) {
        return api.get('/api/v1/funcapp/search_big_project/', data);
    },
    search_project(data) {
        data.project_name = data.project_name ? data.project_name : '';
        return api.get('/api/v1/funcapp/project_name/', data);
        // /api/v1/funcapp/project_name/
    },
    // 修改项目
    modify_project(data) {
        return api.put('/api/v1/funcapp/modify_project/' + data.id + '/', data);
    },
    // 修改项目
    modify_big_project(data) {
        return api.put('/api/v1/funcapp/modify_big_project/' + data.bid + '/', data);
    },
    // 添加项目
    create_project(data) {
        return api.post('/api/v1/funcapp/create_project/', data);
    },
    // 删除项目
    delete_project(data) {
        return api.delete('/api/v1/funcapp/delete_project/', data);
    },
    // 删除项目
    delete_big_project(data) {
        return api.delete('/api/v1/funcapp/delete_big_project/', data);
    },

    // 不带分页下拉取 需求列表
    require_project(data) {
        return api.get('/api/v1/funcapp/require/projet/', data);
    },

    // 需求下接口

    // 获取需求列表
    need_project(data) {
        return api.get('/api/v1/funcapp/require/get/', data);
    },
    // 创建需求
    add_need(data) {
        return api.post('/api/v1/funcapp/require/add/', data);
    },
    // 编辑需求
    edit_need(data) {
        return api.put('/api/v1/funcapp/require/updata/' + data.ZID + '/', data);
    },
    // 删除需求
    del_need(data) {
        return api.delete('/api/v1/funcapp/require/delete/', data);
    },
    // 查询分类下接口

    // 获取查询分类列表
    get_catgory(data) {
        return api.get('/api/v1/funcapp/catgory/get/', data);
    },
    // 新建类目
    add_catgory(data) {
        return api.post('/api/v1/funcapp/catgory/add/', data);
    },
    // 删除类目
    del_catgory(data) {
        return api.delete('/api/v1/funcapp/catgory/delete/', data);
    },
    // 修改类目
    edit_catgory(data, id) {
        return api.put('/api/v1/funcapp/catgory/updata/' + id + '/', data);
    },
    // 用例管理池下接口
    // 获取用例管理列表
    get_caselist(data) {
        return api.get('/api/v1/funcapp/case/get/', data);
    },
    // 获取用例管理列表  不带分页
    get_nocaselist(data) {
        return api.get('/api/v1/funcapp/case/nopage/get/', data);
    },
    // 创建用例管理
    add_caselist(data) {
        return api.post('/api/v1/funcapp/case/add/', data);
    },
    // 删除用例管理
    del_caselist(data) {
        return api.delete('/api/v1/funcapp/case/delete/', data);
    },
    // 编辑用例管理
    edit_caselist(data) {
        return api.put('/api/v1/funcapp/case/updata/' + data.CID + '/', data);
    },
    // 任务下接口

    // 查询任务
    search_task(data) {
        return api.get('/api/v1/funcapp/search_task/', data);
    },
    // 创建任务
    create_task(data) {
        return api.post('/api/v1/funcapp/create_task/', data);
    },
    // 修改任务
    modify_tasktid(data) {
        return api.put('/api/v1/funcapp/modify_task/' + data.tid + '/', data);
    },
    // 删除任务
    del_task(data) {
        return api.delete('/api/v1/funcapp/delete_task/', data);
    },

    // 用例下接口
    get_excute(data) {
        return api.get('/api/v1/funcapp/case/excute/get/', data);
    },

    // 用例下接口列表
    get_excuterq(data) {
        return api.get('/api/v1/funcapp/case/excute/getrq/', data);
    },
    // 删除用例列表
    del_excute(data) {
        return api.delete('/api/v1/funcapp/case/excute/delete/', data);
    },
    // 修改用例列表
    put_excute(data) {
        return api.put('/api/v1/funcapp/case/excute/updata/' + data.tcid + '/', data);
    },
    // 创建任务 时 获取 项目列表
    project_name(data) {
        data.project_name = data.project_name ? data.project_name : '';
        return api.get('/api/v1/funcapp/project_name/', data);
    },
    // 创建任务 时 获取 项目列表同步
    sync_jira_projec(data) {
        return api.post('/api/v1/funcapp/sync_jira_project/');
    },

    // 获取bug链接详情
    issue_detail(data) {
        return api.get('/api/v1/funcapp/issue_detail/', data);
    },
    // /funcapp/issue_detail/

    // /**
    //  *
    //  * 缺陷bug图表
    //  */
    // // 缺陷状态查询bug分布
    // defect_statistics(data) {
    //     return api.get('/api/v1/funcapp/bug_status_statistics/', data);
    // },
    // // defect_statistics(data) {
    // //     return api.get('/api/v1/funcapp/bug_resolution_rate/', data);
    // // },
    // // 获取需求
    // rname_id(data) {
    //     return api.get('/api/v1/funcapp/get_requireinfo/', data);
    // },
    // // 获取任务
    // tname_id(data) {
    //     return api.get('/api/v1/funcapp/tname_id/', data);
    // },
    // // 获取项目
    // projectName(data) {
    //     return api.get('/api/v1/funcapp/jira_project_name/', data);
    // }
    // /**
    //  *
    //  * 缺陷bug图表
    //  */
    
    // 缺陷 列表
    tester_tasktime_search(data) {
        return api.get('/api/v1/funcapp/tester_tasktime_search/', data);
    },
    // 缺陷 列表
    bug_resolution_rate(data) {
        return api.get('/api/v1/funcapp/bug_resolution_rate/', data);
    },
    // 缺陷列表 导出
    bug_output_data(data) {
        return api.post('/api/v1/funcapp/output_data/', data);
    },
    // jira项目列表

    group_to_user(data) {
        return api.get('/api/v1/funcapp/jira_project_name/', data);
    },
    // 获取需求名称
    get_requireList(data) {
        return api.get('/api/v1/funcapp/get_requireinfo/', data);
    },
    // 提交bug
    submit_bug(data) {
        return api.post('/api/v1/funcapp/submit_bug/', data);
    },
    // 获取不带分页的  分类列表
    nopage_catgory(data) {
        return api.get('/api/v1/funcapp/nopage_catgory/get/', data);
    },
    // 组合 二者
    excute_group(data) {
        return api.post('/api/v1/funcapp/case/excute/add/', data);
    },
    // 获取jira 用户组
    get_jira_user(data) {
        return api.get('/api/v1/funcapp/get_jira_user/?user=' + data.user);
    },
    // 获取用例复用统计报表
    timescaseReport(data) {
        return api.get('/api/v1/funcapp/timescase/report/', data);
    },
    // 用例执行次数统计
    excuteTimes(data) {
        return api.get('api/v1/funcapp/excute_times/report/', data);
    },
    // 提交修改sql
    // modify_case(data) {
    //     return api.post('/api/v1/interface_test/modify_case/' + data.id + '/',data);
    // },
    // 拉取项目
    pull_projects() {
        return api.post('/api/v1/interface_test/pull_projects/');
    },
    // 拉取项目
    del_project(data) {
        return api.delete('/api/v1/interface_test/del_project/', data);
    },
    // 编辑项目
    edit_project(data) {
        return api.put('/api/v1/interface_test/edit_project/' + data.id + '/', data);
    },
    // 获取测试人员
    get_test_username(data) {
        return api.get('/api/v1/interface_test/get_test_username/', data);
    },
    // 拉取接口
    pull_api_list() {
        return api.post('/api/v1/interface_test/pull_api_list/');
    },
    // 拼接测试用例
    get_api_to_case(data) {
        return api.get('/api/v1/interface_test/api_to_case/', data);
    },
    // 获取接口名称
    get_apiname(data) {
        // return api.get('/api/v1/interface_test/get_apiname/' + data);
        return api.get('/api/v1/interface_test/module_to_apiname/' + data);
    },
    // 获取tapd项目
    get_tapd_project() {
        return api.get('/api/v1/interface_test/get_tapd_project/');
    },
    // 获取tapd需求
    get_tpad_require(data) {
        return api.get('/api/v1/interface_test/get_tpad_require/', data);
    },
    // 获取tapd迭代
    get_tpad_iterinfo(data) {
        return api.get('/api/v1/interface_test/get_tpad_iterinfo/', data);
    },
    // 获取cicd之appid
    get_cicd_appid() {
        return api.get('/api/v1/interface_test/get_cicd_appid/');
    },
    // UI AUTO
    // 查询执行步骤
    query_steps(data) {
        return api.get('/api/v1/ui_auto/query_steps/', data);
    },
    // 添加执行步骤
    add_steps(data) {
        return api.post('/api/v1/ui_auto/add_steps/', data);
    },
    // 删除执行步骤
    delete_step(data) {
        return api.delete('/api/v1/ui_auto/delete_step/', data);
    },
    // 修改执行步骤
    modify_step(data) {
        return api.post('/api/v1/ui_auto/modify_step/', data);
    },
    // 查询执行动作
    query_action(data) {
        return api.get('/api/v1/ui_auto/query_action/', data);
    },
    // 添加执行动作
    add_action(data){
        return api.post('/api/v1/ui_auto/add_action/',data)
    },
    // 修改执行动作
    modify_action(data){
        return api.put('/api/v1/ui_auto/modify_action/' + data.id + '/',data)
    },
    // 删除执行动作
    delete_action(data){
        return api.delete('/api/v1/ui_auto/delete_action/',data)
    },
    // 获取页面名称
    get_page_name(data) {
        return api.get('/api/v1/ui_auto/get_page_name/', data);
    },
    // 获取页面名称下的元素
    get_page_element(data) {
        return api.get('/api/v1/ui_auto/get_page_element/', data);
    },
    // 获取元素中的定位方法和定位值
    get_element_info(data) {
        return api.get('/api/v1/ui_auto/get_element_info/' + data.id + '/', data);
    },
    // // 添加执行动作中的值
    // add_action_value(data){
    //     return api.post('/api/v1/ui_auto/add_action_value/',data)
    // },
    // 查询测试用例
    query_case(data){
        return api.get('/api/v1/ui_auto/query_case/',data)
    },
    // 添加测试用例
    ui_add_case(data){
        return api.post('/api/v1/ui_auto/add_case/',data)
    },
    // 删除测试用例
    ui_delete_case(data){
        return api.delete('/api/v1/ui_auto/delete_case/',data)
    },
    // 修改测试用例
    ui_modify_case(data){
        return api.put('/api/v1/ui_auto/modify_case/' + data.id + '/',data)
    },
    // 组合测试用例 - 向用例中添加步骤
    step_to_case(data){
        return api.post('/api/v1/ui_auto/step_to_case/',data)
    },
    // 查询用例关联的步骤详情
    case_contains_step_detail(data){
        return api.get('/api/v1/ui_auto/case_contains_step_detail/',data)
    },
    // 删除用例关联的步骤
    delete_step_to_case(data){
        return api.delete('/api/v1/ui_auto/delete_step_to_case/',data)
    },
    // 执行用例
    execute_auto_case(data){
        return api.post('/api/v1/ui_auto/execute_auto_case/',data)
    },
    // 执行任务集
    execute_auto_task(data){
        return api.post('/api/v1/ui_auto/execute_auto_task/',data)
    },
    // 获取任务集名称
    get_task_name(data){
        return api.get('/api/v1/ui_auto/get_task_name/',data)
    },
    // 生成测试报告
    query_test_report(data){
        return api.get('/api/v1/ui_auto/query_test_report/',data)
    },
    // 性能
    // 查询服务器
    searchPage(data) {
        return api.get('/server/searchPage/', data, 'java');
    },
    // 添加服务器
    addSearch(data) {
        return api.post('/server/', data, 'java');
    },
    // 编辑服务器
    modifySearch(data) {
        return api.put('/server/', data, 'java');
    },
    // 删除服务器
    deleteSearch(data) {
        return api.delete('/server?serverId=' + data.id , data, 'java');
    },
    // 查询可用服务器
    searchUsable(data){
        return api.get('/server/searchUsable', data, 'java');
    },
    // 分页查询集群
    clusterSearchPage(data) {
        return api.get('/cluster/searchPage/', data, 'java');
    },
    // 添加集群
    addCluster(data) {
        return api.post('/cluster/', data, 'java');
    },
    // 部署JDK
    deployJDK(data) {
        return api.get('/server/deploy/jdk?clusterId=' + data.clusterId, data, 'java');
    },
    // 部署Jmeter
    deployjmeter(data) {
        return api.get('/server/deploy/jmeter/', data, 'java');
    },
    // 检测集群可用
    checkCustomer(data) {
        return api.get('/server/check/customer?clusterId=' + data.clusterId, data, 'java');
    },
    // 释放集群
    shutdownCustomer(data) {
        return api.post('/cluster/shutdown/customer?clusterId=' + data.id + '&is=' + data.is, data, 'java');
    },
    // 知识库
    // 获取视频信息
    get_videoinfo(data) {
        return api.get('/api/v1/knowledge/get_videoinfo/', data);
    },
    // 上传视频
    video_upload(data) {
        return api.post('/api/v1/knowledge/video_upload/', data);
    },
    // 获取视频播放地址
    get_video_addr(data) {
        return api.get('/api/v1/knowledge/get_video_addr/', data);
    },
    // 获取一级分类
    first_category() {
        return api.get('/api/v1/knowledge/first_category/');
    },
    // 获取二级分类的名称
    second_category(data) {
        return api.get('/api/v1/knowledge/second_category/', data);
    },
    // 收藏/取消收藏
    collection_video(data) {
        return api.post('/api/v1/knowledge/collection_video/', data);
    },
    // 我下载的视频
    my_download_video(data) {
        return api.get('/api/v1/knowledge/my_download_video/', data);
    },
    // 我的收藏--视频
    my_collection_video(data) {
        return api.get('/api/v1/knowledge/my_collection_video/', data);
    },
    // 我播放的视频
    my_play_video(data) {
        return api.get('/api/v1/knowledge/my_play_video/', data);
    },
    // 视频下载次数
    download_sum_video(data) {
        return api.get('/api/v1/knowledge/download_sum_video/', data);
    },
    // 我的视频
    my_upload_video(data) {
        return api.get('/api/v1/knowledge/my_upload_video/', data);
    },
    // 上传文件
    file_upload(data) {
        return api.post('/api/v1/knowledge/file_upload/', data);
    },
    // 获取文件信息
    get_fileinfo(data) {
        return api.get('/api/v1/knowledge/get_fileinfo/', data);
    },
    // 收藏/取消收藏文件
    collection_file(data) {
        return api.post('/api/v1/knowledge/collection_file/', data);
    },
    // 获取文件下载次数
    download_sum_file(data) {
        return api.get('/api/v1/knowledge/download_sum_file/', data);
    },
    // 我下载的文件
    my_download_file(data) {
        return api.get('/api/v1/knowledge/my_download_file/', data);
    },
    // 我阅读过的文件
    my_read_file(data) {
        return api.get('/api/v1/knowledge/my_read_file/', data);
    },
    // 我收藏的文件
    my_collection_file(data) {
        return api.get('/api/v1/knowledge/my_collection_file/', data);
    },
    // 获取S3上文件地址
    get_file_addr(data) {
        return api.get('/api/v1/knowledge/get_file_addr/', data);
    },
    // 我的文件
    my_upload_file(data) {
        return api.get('/api/v1/knowledge/my_upload_file/', data);
    },
    // 创建文章
    create_file(data){
        return api.post('/api/v1/knowledge/create_file/', data);
    },
    // 数据查询
    query_data(data){
        return api.get('/api/v1/knowledge/query_data/', data);
    },
    // 获取全部二级分类
    get_type_info(){
        return api.get('/api/v1/knowledge/get_type_info/');
    },
    // 删除我上传的视频或文件
    delete_video_or_file(data){
        return api.delete('/api/v1/knowledge/delete_video_or_file/', data);
    },
    // 抽奖福利
    // 查询奖品信息
    query_prize(data){
        return api.get('/api/v1/luck_draw/query_prize/', data);
    },
    // 添加奖品
    prize_register(data){
        return api.post('/api/v1/luck_draw/prize_register/', data);
    },
    // 修改奖品参数
    modify_prize(data){
        return api.put('/api/v1/luck_draw/modify_prize/', data);
    },
    // 删除奖品
    delete_prize(data){
        return api.delete('/api/v1/luck_draw/delete_prize/', data);
    },
    // 奖品投票
    prize_vote(data){
        return api.post('/api/v1/luck_draw/prize_vote/', data);
    },
    // 获取热度奖品 
    get_heat_prize(data){
        return api.get('/api/v1/luck_draw/get_heat_prize/', data);
    },
    // 获取抽奖人和奖品信息 
    winners_prizes_info(data){
        return api.get('/api/v1/luck_draw/winners_prizes_info/', data);
    },
    // 抽取奖品 
    win_prizes(data){
        return api.post('/api/v1/luck_draw/win_prizes/', data);
    },
    // 查询我的抽奖次数
    my_lucky_draw(data){
        return api.get('/api/v1/luck_draw/my_lucky_draw/', data);
    },
    // 手动清空热度
    empty_prize_heat(data){
        return api.post('/api/v1/luck_draw/empty_prize_heat/', data);
    },
    // 自动清空奖品热度
    auto_empty_prize_heat(data){
        return api.post('/api/v1/luck_draw/auto_empty_prize_heat/', data);
    },
    // 设置抽奖次数
    set_lucky_draw_count(data){
        return api.post('/api/v1/luck_draw/set_lucky_draw_count/', data);
    },
    ...apiChart,
    ...uiLibrary,
    ...uiTestTaskSet
    // ...apiTest
};
