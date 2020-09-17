import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http:HttpClient) { }
  donate(data):Observable<any>{
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin":"apnacharitabletrust.org",
        "Access-Control-Allow-Headers": "Accept , x-requested-with, Content-Type",
        "Access-Control-Allow-Credentials": "true"
      }),
      withCredentials:false,
      body: {
        CUST_ID:data.CUST_ID,
        TXN_AMOUNT : data.TXN_AMOUNT,
        CHANNEL_ID: data.CHANNEL_ID,
        ORDER_ID:data.ORDER_ID
      }
    }
   
return this.http.post("https://apnacharitabletrust.org/PaytmKit/pgRedirect.php",data)
  }
  transactionStatus(id):Observable<any>{
    return this.http.post("https://apnacharitabletrust.org/paymentprocess/TxnStatus.php",id)
  }
  sendDonarDetails(data):Observable<any>{
    return this.http.post("https://apnacharitabletrust.org/paymentprocess/paymentDone.php",data,{responseType: 'json'})
  }
}
