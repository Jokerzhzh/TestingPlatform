import { api } from './service';
export const uiTestTaskSetApi = {
/**
     *
     * 
     * 刘登宇
     */

 query_task(data){
  return api.get('/api/v1/ui_auto/query_task/', data);
 },
   // 新增
   add_task(data) {
    return api.post('/api/v1/ui_auto/add_task/', data);
},
//修改
modify_task(data) {
  return api.put('/api/v1/ui_auto/modify_task/' + data.id + '/', data);
},
//删除
delete_task(data) {
  return api.delete('/api/v1/ui_auto/delete_task/', data);
},
//详情
taskuiset_detail(id,data){
  return api.get('/api/v1/ui_auto/taskuiset_detail/' + id + '/', data);
 },
 //从任务集中删除用例
 delete_case_to_task(id,data) {
  return api.delete('/api/v1/ui_auto/delete_case_to_task/' +id + '/', data);
},
 //通过迭代名称查询关联用例名称
    get_caseName_list(data) {
        return api.get('/api/v1/ui_auto/task_query_case/', data);
    },
    //项目--迭代--测试用例关联查询
     project_itername_case(data) {
    return api.post('/api/v1/ui_auto/project_itername_case/', data);
},
//测试用例组合任务集
case_to_task(data) {
  return api.post('/api/v1/ui_auto/case_to_task/', data);
},

 }