import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { DonateComponent } from './components/donate/donate.component';
import { JoinUsComponent } from './components/join-us/join-us.component';
import { TermsAndConditionsComponent } from './components/terms-and-conditions/terms-and-conditions.component';
import { DisclaimerComponent } from './components/disclaimer/disclaimer.component';
import { RefundPolicyComponent } from './components/refund-policy/refund-policy.component';
import { PaymentComponent } from './components/payment/payment.component';
import { QrPaymentComponent } from './components/qr-payment/qr-payment.component';
import { DonationRefundComponent } from './components/donation-refund/donation-refund.component';


const routes: Routes = [
  {path:'home',component:HomeComponent},
  {path:"aboutUs",component:AboutUsComponent},
  {path:"contactUs",component:ContactUsComponent},
  {path:"projects",component:ProjectsComponent},
  {path:"gallery",component:GalleryComponent},
  {path:"donate",component:DonateComponent},
  {path:"documents",component:JoinUsComponent},
  {path:"termsandconditions",component:TermsAndConditionsComponent},
  {path:"payment",component:PaymentComponent},
  {path:"privacypolicy",component:RefundPolicyComponent},
  {path:"disclaimer",component:DisclaimerComponent},
  {path:"qrScanPay",component:QrPaymentComponent},
  {path:'refundpolicy',component:DonationRefundComponent},
  {path:'',redirectTo:'home',pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
