import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopbarComponent } from './frontend/topbar/topbar.component';
import { FooterComponent } from './frontend/footer/footer.component';
import { SidebarComponent } from './admin/sidebar/sidebar.component';
import { AdminFooterComponent } from './admin/admin-footer/admin-footer.component';
import { AdminTopbarComponent } from './admin/admin-topbar/admin-topbar.component';
import { MaterialModule } from '../material/material.module'

@NgModule({
  declarations: [TopbarComponent, FooterComponent, SidebarComponent, AdminFooterComponent, AdminTopbarComponent],
  imports: [
    CommonModule, MaterialModule
  ],
  exports: [TopbarComponent, FooterComponent, SidebarComponent, AdminFooterComponent, AdminTopbarComponent]
})
export class LayoutsModule { }
