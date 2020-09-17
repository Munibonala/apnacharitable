import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { PaymentService } from 'src/app/payment.service';
import { MethodCall } from '@angular/compiler';
import { MatDialog } from '@angular/material';
import { PaymentComponent } from '../payment/payment.component';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-donate',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.css']
})
export class DonateComponent implements OnInit {
minDate = new Date(1900,0,1);
  maxDate:any = new Date();
  breakpoint:number;
  height:string;
  donationForm:FormGroup;
  pRes:any;
  isSelected:string = ""
  loading:boolean = false;
  constructor(private fb:FormBuilder,private service:PaymentService, private dialog:MatDialog) { }

  ngOnInit() {
    this.donationForm = this.fb.group({
      name:["",Validators.required],
      amount:["",[Validators.required,Validators.pattern('[0-9]*')]],
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
        localStorage.setItem("isQrPaid","0")
        this.loading = false;
        if(res.ParamsList.STATUS == "TXN_SUCCESS"  ){
          localStorage.setItem("txnId",res.ParamsList.TXNID)
         this.sendDonarDetails(res)
        }else if(res.ParamsList.STATUS == "TXN_FAILURE"){
          this.openTxnStatusDialog(res)
        }
        else{
          this.loading = false;
          
        }
      }, (err)=>{
        this.loading = false;
        console.log("Err",err)
      }) 
    }
  }
  get frndEmail(){
  return <FormArray>this.donationForm.get('refferedEmails')
}
addFrnd(){
  this.frndEmail.push(this.fb.control(""))
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
  donate(){
    if(this.donationForm.valid){
      this.loading = true;
      localStorage.setItem("donarDetails",JSON.stringify(this.donationForm.value))
    let randomId= "order"+Math.floor(1000000 + Math.random() * 9000000)
    localStorage.setItem("orderID",randomId)
    const payLoad = new FormData();
    payLoad.append("CUST_ID", this.donationForm.get("name").value);
    payLoad.append("TXN_AMOUNT",this.donationForm.get("amount").value);
    payLoad.append("CHANNEL_ID","WEB");
    payLoad.append("ORDER_ID",randomId);
    payLoad.append("SOURCE_TYPE","NORMAL")

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
      document.querySelector('.payment').innerHTML = this.responseText ;
      document['paytm_form'].submit()
    
    }
  };
  xhttp.open("POST", "https://apnacharitabletrust.org/paymentprocess/doPayment.php", true);
setTimeout(()=>{
  this.loading = false;

},5000)
  
  xhttp.send(payLoad);
  }
get donationFormCheckBoxes(){
  return <FormArray>this.donationForm.get('donationAppliedFor')
}
retryPayment(){
  let details = JSON.parse(localStorage.getItem('donarDetails'))
  if(details){
    let randomId= "order"+Math.floor(1000000 + Math.random() * 9000000)
  localStorage.setItem("orderID",randomId)
  const payLoad = new FormData();
    payLoad.append("CUST_ID", details.name);
    payLoad.append("TXN_AMOUNT",details.amount);
    payLoad.append("CHANNEL_ID","WEB");
    payLoad.append("ORDER_ID",randomId);
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
    let timeStamp = Math.round((new Date()).getTime() / 1000);
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
        this.openTxnStatusDialog(txnRes)
      }else{
        this.loading = false;
      }
      localStorage.removeItem('orderID')
        localStorage.removeItem("isSelected")
        localStorage.removeItem('txnId')
    },(err)=>{
      this.loading = false;
      console.log("Sending Donation Details Error",err)
    })
  }
}