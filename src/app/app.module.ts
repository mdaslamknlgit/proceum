import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgWhiteboardModule } from 'ng-whiteboard';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ColorPickerModule } from 'ngx-color-picker';
import { MaterialModule } from './material/material.module';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS  } from '@angular/common/http';
import { SpinnerComponent } from './spinner/spinner.component';
import { Loader } from './classes/loader';
import {MatIconModule} from '@angular/material/icon';
import { WhiteBoardComponent } from './shared/white-board/white-board.component';
@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    WhiteBoardComponent
  ],
  imports: [
    BrowserModule, NgWhiteboardModule, ToastrModule.forRoot({
      positionClass :'toast-bottom-right'
    }), BrowserAnimationsModule, ColorPickerModule, MaterialModule, AppRoutingModule, HttpClientModule, MatIconModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: Loader, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
