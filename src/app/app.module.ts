import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgWhiteboardModule } from 'ng-whiteboard';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ColorPickerModule } from 'ngx-color-picker';
import { MaterialModule } from './material/material.module';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, NgWhiteboardModule, ToastrModule.forRoot({
      positionClass :'toast-bottom-right'
    }), BrowserAnimationsModule, ColorPickerModule, MaterialModule, AppRoutingModule, HttpClientModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
