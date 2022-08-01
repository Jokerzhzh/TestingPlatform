import { api } from './service';
export const uiLibraryApi = {
/**
     *
     * 元素库新增改查
     * 刘登宇
     */

 search_element(data){
  return api.get('/api/v1/ui_auto/search_element/', data);
 },
  // 新增
  add_element(data) {
    return api.post('/api/v1/ui_auto/add_element/', data);
},
//修改
updata_element(data) {
  return api.put('/api/v1/ui_auto/updata_element/' + data.id + '/', data);
},
//删除
delete_element(data) {
  return api.delete('/api/v1/ui_auto/delete_element/', data);
},
}