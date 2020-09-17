import { Component, OnInit, Inject } from '@angular/core';
import { QrPaymentComponent } from '../qr-payment/qr-payment.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<QrPaymentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }
  accept(){
this.dialogRef.close("3")
  }
  notAccept(){
    this,this.dialogRef.close("0")
  }
}
