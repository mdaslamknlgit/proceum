import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ColorPickerModule } from 'ngx-color-picker';
import { MaterialModule } from './material/material.module';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SpinnerComponent } from './spinner/spinner.component';
import { Loader } from './classes/loader';
import { LayoutsModule } from './layouts/layouts.module';
import { NotFoundComponent } from './shared/not-found/not-found.component';

@NgModule({
  declarations: [AppComponent, SpinnerComponent, NotFoundComponent],
  imports: [
    BrowserModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
    }),
    BrowserAnimationsModule,
    ColorPickerModule,
    MaterialModule,
    AppRoutingModule,
    HttpClientModule,
    LayoutsModule,
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: Loader, multi: true }],
  bootstrap: [AppComponent],
})
export class AppModule {}
