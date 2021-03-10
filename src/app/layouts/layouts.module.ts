import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopbarComponent } from './frontend/topbar/topbar.component';
import { FooterComponent } from './frontend/footer/footer.component';
import { SidebarComponent } from './admin/sidebar/sidebar.component';
import { AdminFooterComponent } from './admin/admin-footer/admin-footer.component';
import { AdminTopbarComponent } from './admin/admin-topbar/admin-topbar.component';
import { MaterialModule } from '../material/material.module';
import { WhiteBoardComponent } from '../shared/white-board/white-board.component';
import { NgWhiteboardModule } from 'ng-whiteboard';
import { ColorPickerModule } from 'ngx-color-picker';
import { SidemenuComponent } from './frontend/sidemenu/sidemenu.component';
@NgModule({
  declarations: [
    TopbarComponent,
    FooterComponent,
    SidebarComponent,
    AdminFooterComponent,
    AdminTopbarComponent,
    WhiteBoardComponent,
    SidemenuComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    NgWhiteboardModule,
    ColorPickerModule,
  ],
  exports: [
    TopbarComponent,
    FooterComponent,
    SidebarComponent,
    AdminFooterComponent,
    AdminTopbarComponent,
    SidemenuComponent,
  ],
})
export class LayoutsModule {}
