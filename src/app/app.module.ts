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
import { GoogleLoginProvider, FacebookLoginProvider, SocialLoginModule, SocialAuthServiceConfig} from 'angularx-social-login';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { PaymentsComponent } from './payments/payments.component';
import { CartCountService } from './services/cart-count.service'; 
import { ReplaceUnderscorePipe } from './shared/pipes/replace-underscore-pipe';
import { ReplacePipe } from './shared/pipes/replace-pipe';
//import { SafePipe } from './shared/pipes/safe.pipe';
@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    NotFoundComponent,
    DrawingBoardComponent,
    ProceumLibraryComponent,
    PaymentsComponent,
    ReplaceUnderscorePipe,
    ReplacePipe,
    //SafePipe,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    BrowserAnimationsModule,
    ColorPickerModule,
    MaterialModule,
    AppRoutingModule,
    HttpClientModule,
    LayoutsModule,
    NgWhiteboardModule,
    SocialLoginModule,
    MatIconModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    PdfViewerModule
  ],
  providers: [
    CartCountService,
    { provide: HTTP_INTERCEPTORS, useClass: Loader, multi: true },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '495801232918-cb2avq8af4fd8slu1a4n7cc8htakc22g.apps.googleusercontent.com'
            ),
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('851700872077265'),
          },
        ],
      } as SocialAuthServiceConfig,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
