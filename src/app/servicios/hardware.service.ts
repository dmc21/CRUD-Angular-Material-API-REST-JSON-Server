import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HardwareService {

  constructor(private http: HttpClient) {}

    url = "http://localhost:3000/hardware";

    getAll(): Observable<any> {
      return this.http.get<any>(this.url);
    }

    insertProduct(producto): Observable<any>{
      return this.http.post<any>(this.url,producto);
    }

    updateProduct(producto): Observable<any>{
      return this.http.put(`${this.url}/${producto.id}`,producto);
    }

    removeProduct(id): Observable<any>{
      return this.http.delete(this.url+"/"+id);
    }
}
