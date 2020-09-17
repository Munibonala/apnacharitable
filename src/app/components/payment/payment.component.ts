import { Component, OnInit, Inject } from '@angular/core';
import { DonateComponent } from '../donate/donate.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
amnt:string;
isSuccess:boolean = false;
anchorUrl:string;
showButton:boolean= false;
  constructor(private dialogRef: MatDialogRef<DonateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
    
  }

  ngOnInit() {
    let isQrPaid = localStorage.getItem('isQrPaid')
    this.amnt = this.data.ParamsList.TXNAMOUNT
    if(this.data.ParamsList.STATUS === "TXN_SUCCESS"){
      this.isSuccess = true; 
      if(isQrPaid == "0"){
        this.showButton = true;
      }else{
        this.showButton = false;
      }
this.anchorUrl = `http://apnacharitabletrust.org/paymentprocess/getInvoice.php?serialNumber=${this.data.serialNum}`

    }else{
      this.isSuccess = false;
    }
  }
close(){
  if(this.data.ParamsList.STATUS === "TXN_FAILURE"){
    localStorage.removeItem('orderID')
  }
  this.dialogRef.close(this.data.ParamsList.STATUS)
}
retry(){
  localStorage.removeItem('orderID')
  this.dialogRef.close("retry")
}
}
