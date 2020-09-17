import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatDialogConfig, MatDialog } from '@angular/material';
import { ContactUsComponent } from '../contact-us/contact-us.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  openContactUs(){
    let dailogRef=this.dialog.open(ContactUsComponent,{ 
      panelClass: 'col-sm-6',
      }) 
      }
  open(r){

  }
}
