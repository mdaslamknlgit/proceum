import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopbarComponent } from './frontend/topbar/topbar.component';
import { FooterComponent } from './frontend/footer/footer.component';
import { MaterialModule } from '../material/material.module';
import { NgWhiteboardModule } from 'ng-whiteboard';
import { ColorPickerModule } from 'ngx-color-picker';
import { SidemenuComponent } from './frontend/sidemenu/sidemenu.component';
import { RouterModule } from '@angular/router';
import { StudentTopbarComponent } from './frontend/student-topbar/student-topbar.component';
import { PartnerTopbarComponent } from './frontend/partner-topbar/partner-topbar.component';

@NgModule({
  declarations: [
    TopbarComponent,
    FooterComponent,
    SidemenuComponent,
    StudentTopbarComponent,
    PartnerTopbarComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    NgWhiteboardModule,
    ColorPickerModule,
    RouterModule,
    SharedModule,
  ],
  exports: [
    TopbarComponent,
    FooterComponent,
    SidemenuComponent,
    StudentTopbarComponent,
    PartnerTopbarComponent,
  ],
})
export class LayoutsModule {}
