import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { PaymentService } from 'src/app/payment.service';
import { ConfirmComponent } from '../confirm/confirm.component';
import { MatDialog } from '@angular/material';
import { PaymentComponent } from '../payment/payment.component';

@Component({
  selector: 'app-qr-payment',
  templateUrl: './qr-payment.component.html',
  styleUrls: ['./qr-payment.component.css']
})
export class QrPaymentComponent implements OnInit {
  donationForm:FormGroup;
  height:string;
  pRes:any;
  isSelected:string = ""
  model:any ={}
  isAccepted:boolean = false;
  loading:boolean = false;
  directDonateForm:FormGroup;
  constructor(private fb:FormBuilder, private service:PaymentService, private dialog:MatDialog) { }

  ngOnInit() {
    this.directDonateForm= this.fb.group({
      amount:["",[Validators.required,Validators.pattern('[0-9]*')]]
    })
    this.donationForm = this.fb.group({
      name:["",Validators.required],
      amount:[""],
      emailID:["",[Validators.required,Validators.email]],
      phoneNumber:["",[Validators.pattern(/^\+?\d+$/ ),Validators.minLength(10),Validators.maxLength(13)]],
       refferedEmails:this.fb.array([""]),
       address:[""],
       city:[""],
       state:[""],
       pincode:[""],
       panNumber:["",Validators.required],
       payInterval:[""],
       donationAppliedFor:this.fb.array([
         this.fb.group({
          text: 'Health',
          isChecked: false
        }),this.fb.group({
          text: 'Education',
          isChecked: false
        }),
        this.fb.group({
          text: 'Rural Development',
          isChecked: false
        }),
        this.fb.group({
          text: 'Sports',
          isChecked: false
        }),
        this.fb.group({
          text: 'Culture',
          isChecked: false
        }),
        this.fb.group({
          text: 'Social Service',
          isChecked: false
        }),
       ]),
       orderID:[""],
       orderDate:[""]
    })
    let id= localStorage.getItem('orderID')
    if(id){
      this.loading = true;
     let sendOrderId= {
      ORDER_ID: id
     }
     let formData= new FormData()
     formData.append("ORDER_ID",sendOrderId.ORDER_ID)
      this.service.transactionStatus(formData).subscribe((res)=>{
        this.loading = false;
        if(res.ParamsList.STATUS == "TXN_SUCCESS"  ){
          let isQrPaid = localStorage.getItem('isQrPaid')
          
          if(isQrPaid == "0"){
            localStorage.setItem("txnId",res.ParamsList.TXNID)
            this.sendDonarDetails(res)
          }else{
            localStorage.setItem("txnId",res.ParamsList.TXNID)
            this.sendEmtyUserDetails(res)
            
          }
         
        }else if(res.ParamsList.STATUS == "TXN_FAILURE"){
          this.openTxnStatusDialog(res)
        }
        else{
          localStorage.removeItem("orderId")
        }
      }, (err)=>{
        this.loading = false;
        
        console.log("Err",err)
      }) 
    }
  }
  //Open Transaction status modal
openTxnStatusDialog(res){
  let dailogRef=this.dialog.open(PaymentComponent,{ 
    panelClass: 'col-sm-5',
    data: res,
    hasBackdrop:false
    })
    dailogRef.afterClosed().subscribe(res=>{
    if(res === "retry"){
      localStorage.removeItem('orderID')
      this.retryPayment()
    }
      })
}

  get frndEmail(){
    return <FormArray>this.donationForm.get('refferedEmails')
  }
  addFrnd(){
    this.frndEmail.push(this.fb.control(""))
  }
directDonate(){
  
    if(this.directDonateForm.valid){
      let dailogRef=this.dialog.open(ConfirmComponent,{ 
        panelClass: 'col-sm-4',
        hasBackdrop:false
        })
      dailogRef.afterClosed().subscribe(res=>{
        if(res === "3"){
          this.isAccepted = true;
        }else{
          this.isAccepted = false;
          this.donateWithoutDetails()
        }
          })
    }else{
      alert("Enter Valid Amount..")
    }
}
donateWithoutDetails(){
  this.loading = true;
  localStorage.removeItem('donarDetails')
    let randomId= "order"+Math.floor(1000000 + Math.random() * 9000000)
    localStorage.setItem("orderID",randomId)
    const payLoad = new FormData();
    payLoad.append("CUST_ID", "ApnaQrCode");
    payLoad.append("TXN_AMOUNT",this.directDonateForm.get("amount").value);
    payLoad.append("CHANNEL_ID","WEB");
    payLoad.append("ORDER_ID",randomId);
    payLoad.append("SOURCE_TYPE","QRCODE")
    localStorage.setItem("isQrPaid","3")
    localStorage.setItem("onlyCash",this.directDonateForm.get("amount").value)
  this.sendToPaytm(payLoad)
  
}
  donate(){
    if(this.donationForm.valid){
      this.loading = true;
      let addAmount = {... this.donationForm.value}
      addAmount.amount = this.directDonateForm.value.amount
      localStorage.setItem("donarDetails",JSON.stringify(addAmount))
    let randomId= "order"+Math.floor(1000000 + Math.random() * 9000000)
    localStorage.setItem("orderID",randomId)
    const payLoad = new FormData();
    payLoad.append("CUST_ID", this.donationForm.get("name").value);
    payLoad.append("TXN_AMOUNT",this.directDonateForm.get("amount").value);
    payLoad.append("CHANNEL_ID","WEB");
    payLoad.append("ORDER_ID",randomId);
    payLoad.append("SOURCE_TYPE","QRCODE")
      localStorage.setItem("isQrPaid","0")
  this.sendToPaytm(payLoad)
    }else{
      alert("Enter all required fields..")
    }
  }
  sendToPaytm(payLoad){
    
    let xhttp = new XMLHttpRequest();
    xhttp.responseType = 'text'
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.querySelector('.qrPay').innerHTML = this.responseText ;
      document['paytm_form'].submit()
    
    }
  };
  xhttp.open("POST", "https://apnacharitabletrust.org/paymentprocess/doPayment.php", true);
  xhttp.send(payLoad);
  setTimeout(()=>{
    this.loading = false;
  },5000)
  }
get donationFormCheckBoxes(){
  return <FormArray>this.donationForm.get('donationAppliedFor')
}
retryPayment(){
  this.loading = true;
  let checkQr = localStorage.getItem('isQrPaid')
  if(checkQr == "0"){
    let details = JSON.parse(localStorage.getItem('donarDetails'))
    let randomId= "order"+Math.floor(1000000 + Math.random() * 9000000)
  localStorage.setItem("orderID",randomId)
  const payLoad = new FormData();
    payLoad.append("CUST_ID", details.name);
    payLoad.append("TXN_AMOUNT",details.amount);
    payLoad.append("CHANNEL_ID","WEB");
    payLoad.append("ORDER_ID",randomId);
    this.sendToPaytm(payLoad)
  }else{
let amnt = localStorage.getItem('onlyCash')
let randomId= "order"+Math.floor(1000000 + Math.random() * 9000000)
    localStorage.setItem("orderID",randomId)
    const payLoad = new FormData();
    payLoad.append("CUST_ID", "ApnaQrCode");
    payLoad.append("TXN_AMOUNT",amnt);
    payLoad.append("CHANNEL_ID","WEB");
    payLoad.append("ORDER_ID",randomId);
    payLoad.append("SOURCE_TYPE","QRCODE")
    localStorage.setItem("isQrPaid","3")
  this.sendToPaytm(payLoad)
  }
}
  onChange(event: any){
    const checkBoxesList = this.donationForm.get('donationAppliedFor').value;
   this.isSelected = checkBoxesList.filter(val=>{
     return val.isChecked;
   }).map(val =>{
     return val.text;
   }).join(',')
   localStorage.setItem("isSelected",this.isSelected) 
  }
  sendDonarDetails(txnRes){
    this.loading = true;
    let txnId = localStorage.getItem('txnId')
    let checkBoxes = localStorage.getItem("isSelected")
    let details = JSON.parse(localStorage.getItem('donarDetails'))
    var regTime = new Date().toLocaleDateString();
    let id= localStorage.getItem('orderID')
    let donarData = new FormData()
    donarData.append("name",details.name);
    donarData.append("amount",details.amount);
    donarData.append("emailID",details.emailID);
    donarData.append("phoneNumber",details.phoneNumber);
    donarData.append("referredEmails",details.refferedEmails.toString());
    donarData.append("address",details.address);
    donarData.append("city",details.city);
    donarData.append("state",details.state);
    donarData.append("pincode",details.pincode);
    donarData.append("panNumber",details.panNumber);
    donarData.append("donationAppliedFor",checkBoxes);
    donarData.append("payInterval",details.payInterval);
    donarData.append("orderID",id);
    donarData.append("orderDate",regTime);
    donarData.append("txnNumber",txnId)
    this.service.sendDonarDetails(donarData).subscribe((res)=>{
      if(res.status == 3){
        this.loading = false;
        txnRes = {...txnRes}
        txnRes.serialNum = res.serialNumber;
        this.openTxnStatusDialog(txnRes);
      }else{
        this.loading = false;
      }
      localStorage.removeItem('orderID')
        localStorage.removeItem("isSelected")
        localStorage.removeItem('txnId')
    },(err)=>{
      this.loading = false;
      console.log("err",err)
    })
  }
  sendEmtyUserDetails(data){
    this.loading = true;
    let amnt = localStorage.getItem('onlyCash')
    let txnId = localStorage.getItem('txnId')
    var regTime = new Date().toLocaleDateString();
    let id= localStorage.getItem('orderID')
    let donarData = new FormData()
    donarData.append("name","ApnaQrCode");
    donarData.append("amount",amnt);
    donarData.append("emailID","-");
    donarData.append("phoneNumber","");
    donarData.append("referredEmails","");
    donarData.append("address","");
    donarData.append("city","");
    donarData.append("state","");
    donarData.append("pincode","");
    donarData.append("panNumber","-");
    donarData.append("donationAppliedFor","");
    donarData.append("payInterval","");
    donarData.append("orderID",id);
    donarData.append("orderDate",regTime);
    donarData.append("txnNumber",txnId)
    this.service.sendDonarDetails(donarData).subscribe((res)=>{
      if(res.status == 3){
        this.loading = false;
        data = {...data}
        data.serialNum = res.serialNumber;
        this.openTxnStatusDialog(data);
      }else{
        this.loading= false;
      }
      localStorage.removeItem('orderID')
        localStorage.removeItem("isSelected")
        localStorage.removeItem('txnId')
    },(err)=>{
      this.loading = false;
      console.log("err",err)
    })
  }
}
