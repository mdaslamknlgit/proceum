import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ColorPickerModule } from 'ngx-color-picker';
import { MaterialModule } from './material/material.module';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { Loader } from './classes/loader';
import { LayoutsModule } from './layouts/layouts.module';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { DrawingBoardComponent } from './shared/drawing-board/drawing-board.component';
import { NgWhiteboardModule } from 'ng-whiteboard';
import { ProceumLibraryComponent } from './shared/proceum-library/proceum-library.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    NotFoundComponent,
    DrawingBoardComponent,
    ProceumLibraryComponent,

  ],
  imports: [
    BrowserModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
    }),
    BrowserAnimationsModule,
    ColorPickerModule,
    MaterialModule,
    AppRoutingModule,
    HttpClientModule,
    LayoutsModule,
    NgWhiteboardModule,
    MatIconModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: Loader, multi: true }],
  bootstrap: [AppComponent],
})
export class AppModule {}
