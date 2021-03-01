import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopbarComponent } from './frontend/topbar/topbar.component';
import { FooterComponent } from './frontend/footer/footer.component';
import { SidebarComponent } from './admin/sidebar/sidebar.component';
import { AdminFooterComponent } from './admin/admin-footer/admin-footer.component';
import { AdminTopbarComponent } from './admin/admin-topbar/admin-topbar.component';



@NgModule({
  declarations: [TopbarComponent, FooterComponent, SidebarComponent, AdminFooterComponent, AdminTopbarComponent],
  imports: [
    CommonModule
  ],
  exports: [TopbarComponent, FooterComponent, SidebarComponent, AdminFooterComponent, AdminTopbarComponent]
})
export class LayoutsModule { }
