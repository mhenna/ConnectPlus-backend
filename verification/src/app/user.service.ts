import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient
  ) { }

  verify(email, otp): Promise<any> {
    const promise = new Promise((resolve, reject) => {
      const headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));
      headers.append('Content-Type', 'application/json');
      headers.append('Access-Control-Allow-Origin', '*');
      this.http.put(`http://localhost:3333/user/verify/${email}`, { code: otp }, { headers: headers }).toPromise()
        .then(res => {
          resolve(res['message']);
        }, err => {
          reject(err);
        });
    });
    return promise;
  }
}
