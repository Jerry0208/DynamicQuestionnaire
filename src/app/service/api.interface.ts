//需導入 Injectable 和 httpClient
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

//注入器
@Injectable({
  providedIn: 'root'
})


//可以發出API請求
export class HttpClientService {
  constructor(private http: HttpClient) { }

  // 讀取
  getApi(url: string) {
    return this.http.get(url);
  }

  // 新增
  postApi(url: string, postData: any) {
    return this.http.post(url, postData);
  }

  // 更新
  putApi(url: string, postData: any) {
    return this.http.put(url, postData);
  }

  // 刪除
  delApi(url: string) {
    return this.http.delete(url);
  }

}
