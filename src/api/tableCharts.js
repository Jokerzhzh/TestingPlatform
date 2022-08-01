import { api } from './service';
export const apiChart = {
    /**
     *
     * 缺陷bug图表
     */
    // 创建任务 时 获取 项目列表
    project_name(data) {
        return api.get('/api/v1/funcapp/big_project_name/');
    },
    // 缺陷状态查询bug分布
    defect_statistics(data) {
        return api.get('/api/v1/funcapp/bug_status_statistics/', data);
    },
    //缺陷严重级别分布图
    severLevel(data) {
        return api.get('/api/v1/funcapp/bug_level_statistics/', data);
    },
    // 缺陷创建人/严重级别分布图
    submit_bugs(data) {
        return api.get('/api/v1/funcapp/tester_submit_bugs/', data);
    },
    // 缺陷处理人/严重级别分布图
    assignee_bugs(data) {
        return api.get('/api/v1/funcapp/assignee_bugs/', data);
    },
    // 按缺陷重新打开次数统计
    reopend_count(data) {
        return api.get('/api/v1/funcapp/bug_reopend_count/', data);
    },
    // 用例复用统计报表
    timescase(data) {
        return api.get('/api/v1/funcapp/timescase/report/', data);
    },
    // 用例执行次数统计
    excuteTimes(data) {
        return api.get('/api/v1/funcapp/excute_times/report/', data);
    },
    // 用例统计表
    report_funcase(data) {
        return api.get('/api/v1/funcapp/funcase/report/', data);
    },
    // 缺陷解决/未解决统计
    // 获取需求
    rname_id(data) {
        return api.get('/api/v1/funcapp/verification_required/', data);
    },
    rname_id2(data) {
        return api.get('/api/v1/funcapp/verification_non_required/', data);
    },
    require_projet(data) {
        return api.get('/api/v1/funcapp/require/projet/', data);
    },
    //缺陷每日变化趋势
    daily_trend(data) {
        return api.get('/api/v1/funcapp/bug_daily_trend/', data);
    },
    //缺陷年龄
    // resolve_time(data) {
    //     return api.get('/api/v1/funcapp/bug_average_resolve_time/', data);
    // },
    resolve_time(data) {
        return api.get('/api/v1/funcapp/bug_average_resolved_time/', data);
    },
    // 获取任务
    tname_id(data) {
        return api.get('/api/v1/funcapp/tname_id/', data);
    },
    // 获取项目
    projectName2(data) {
        return api.get('/api/v1/funcapp/get_pname/', data);
    },
    // 获取项目
    projectName(data) {
        return api.get('/api/v1/funcapp/jira_project_name/', data);
    },
    // 获取用户组
    group_name(data) {
        return api.get('/api/v1/funcapp/get_dev_group_name/', data);
    },
    // 获取用户组
    test_group_name(data) {
        return api.get('/api/v1/funcapp/get_test_group_name/', data);
    },
    // 用户统计获取用户组
    get_group(data) {
        return api.get('/api/v1/funcapp/get_group/', data);
    },
    // 用户统计获取用户组人员
    group_users(data) {
        return api.get('/api/v1/funcapp/group_users/', data);
    },
    // 获取项目测试负责人
    get_project_leader(data) {
        return api.get('/api/v1/funcapp/get_project_leader', data);
    },
    // 获取项目测试负责人
    get_require_listinfo(data) {
        return api.get('/api/v1/funcapp/get_require_listinfo/', data);
    },
    // 获取项目测试负责人
    get_require_bugstate(data) {
        return api.post('/api/v1/funcapp/get_require_bugstate/', data);
    },
    // 获取bug详情
    get_require_bugdetail(data) {
        return api.post('/api/v1/funcapp/get_require_bugdetail/', data);
    },
    // 获取case
    get_require_casestate(data) {
        return api.get('/api/v1/funcapp/get_require_casestate/', data);
    },
    // 获取case详情
    get_require_casedetail(data) {
        return api.get('/api/v1/funcapp/get_require_casedetail/', data);
    },
    // 保存需求分析信息
    get_save_result_data(data) {
        return api.post('/api/v1/funcapp/save_result_data/', data);
    },
    // 重现测试报告数据
    get_save_data(data) {
        return api.get('/api/v1/funcapp/reproduce_report_data/', data);
    },
    // 保存需求分析信息
    get_save_require_data(data) {
        return api.post('/api/v1/funcapp/save_require_data/', data);
    },
    // 获取人员信息
    group_to_user(data) {
        return api.get('/api/v1/funcapp/group_to_user', data);
    },
    // 校验能否 保存
    check_require_analysis(data) {
        return api.get('/api/v1/funcapp/check_require_analysis', data);
    },
    //获取详情 保存
    reverse_display_require_data(data) {
        return api.get('/api/v1/funcapp/reverse_display_require_data/', data);
    },
    // 获取bug数据 研发组bug分布图
    get_project_per_group_bugs(data) {
        return api.get('/api/v1/funcapp/project_per_group_bugs/', data);
    },
    // 导出 研发组bug分布图
    output_data() {
        return api.post('/api/v1/funcapp/output_data/');
    },
    // 获取bug数据
    get_project_and_require_bugs(data) {
        return api.get('/api/v1/funcapp/project_and_require_bugs/', data);
    }
    /**
     *
     * 缺陷bug图表
     */
};
