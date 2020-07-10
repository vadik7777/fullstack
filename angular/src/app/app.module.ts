import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule} from '@angular/forms';
import {MaterialModule} from './mat.module';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';

import { AppComponent } from './app.component';
import { DialogComponent } from './views/dialog/dialog.component';
import { PaginatorComponent } from './views/paginator/paginator.component';
import { ConfirmationComponent } from './views/confirmation/confirmation.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MaterialModule
  ],
  entryComponents: [AppComponent],
  declarations: [AppComponent, DialogComponent, PaginatorComponent, ConfirmationComponent],
  bootstrap: [AppComponent],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
  ]
})
export class AppModule {}
