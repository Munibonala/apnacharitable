import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap'

import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule, MatIconModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatDatepickerModule, MatNativeDateModule, MatRadioModule, MatCheckboxModule, MatGridListModule, MatDialogModule, MatSnackBarModule, MatListModule, MatMenuModule, MatCardModule } from '@angular/material';
import { FlexLayoutModule } from "@angular/flex-layout";
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { DonateComponent } from './components/donate/donate.component';
import { JoinUsComponent } from './components/join-us/join-us.component';
import { FooterComponent } from './components/footer/footer.component'
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { TermsAndConditionsComponent } from './components/terms-and-conditions/terms-and-conditions.component';
import { DisclaimerComponent } from './components/disclaimer/disclaimer.component';
import { RefundPolicyComponent } from './components/refund-policy/refund-policy.component';
import { HttpClientModule } from '@angular/common/http';
import { PaymentComponent } from './components/payment/payment.component';
import { QrPaymentComponent } from './components/qr-payment/qr-payment.component';
import { ConfirmComponent } from './components/confirm/confirm.component';
import { DonationRefundComponent } from './components/donation-refund/donation-refund.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    AboutUsComponent,
    ContactUsComponent,
    ProjectsComponent,
    GalleryComponent,
    CarouselComponent,
    DonateComponent,
    JoinUsComponent,
    FooterComponent,
    TermsAndConditionsComponent,
    DisclaimerComponent,
    RefundPolicyComponent,
    PaymentComponent,
    QrPaymentComponent,
    ConfirmComponent,
    DonationRefundComponent
  ],
  entryComponents:[PaymentComponent,ConfirmComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgbModule,
    MatToolbarModule,
    MatDialogModule,
    MatSnackBarModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatGridListModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatListModule,
    MatMenuModule,
    FlexLayoutModule,
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.threeBounce,
      backdropBackgroundColour: 'rgba(0,0,0,0.5)',
      backdropBorderRadius: '4px',
      primaryColour: '#ffffff',
      secondaryColour: '#ffffff',
      tertiaryColour: '#ffffff',
      fullScreenBackdrop: true
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
