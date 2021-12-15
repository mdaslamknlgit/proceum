import { Component, HostListener, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { NavigationEnd, Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-admin-topbar',
  templateUrl: './admin-topbar.component.html',
  styleUrls: ['./admin-topbar.component.scss'],
})
export class AdminTopbarComponent implements OnInit {
  public sidemenu_status: string = "sd_cls";
  // public sidemenu_status: string = localStorage.getItem('sidemenu');
  public user;
  private subscription:Subscription;
  public content_notifications = [];
  public load_top_bar:boolean;
  public show_notifications = false;
  width: any;
  @HostListener('window:load', ['$event'])
  @HostListener('window:resize', ['$event'])
  onEvent(event) {
    this.width = window.innerWidth;
  }
  constructor(private http: CommonService, private route: Router, private fs: FirebaseService) {
    this.http.menu_status = "sd_cls";
    // this.http.menu_status = localStorage.getItem('sidemenu');
  }
  ngOnInit(): void {
    //check subdomain
    let sub_domain = window.location.hostname;
    //static sub domain
    //sub_domain = 'ntr';
    //If subdomain not exist in in app domains then check for partner domain
    if(environment.INAPP_DOMAINS_ARRAY.indexOf(sub_domain) === -1){
      if(!localStorage.getItem('header_logo')){
        this.getSubDomainDetails(sub_domain);
      }else{
        this.load_top_bar = true;
      }
    }else{
      localStorage.setItem('header_logo','');
      this.load_top_bar = true;
    }
    this.user = this.http.getUser();
    this.route.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        // if (this.width < 1024) {
          this.sidemenu_status = this.http.menu_status = 'sd_cls';
        // }
      }
    });   
  }
  ngAfterViewInit(){
    let param = {path: "content_notifications", role_id: Number(this.user['role'])};
    this.subscription = this.fs.getNotifications(param).subscribe(res=>{
        this.content_notifications = res;
    })
  }
  // toggleSidemenu(param) {
  //   this.sidemenu_status =
  //     this.sidemenu_status == 'sd_opn' ? 'sd_cls' : 'sd_opn';
  //   localStorage.setItem('sidemenu', 'sd_cls');
  //   // localStorage.setItem('sidemenu', this.sidemenu_status);
  //   this.http.menu_status = this.sidemenu_status;
  // }
  
    toggleSidemenu(param) { 
        this.sidemenu_status = this.http.menu_status == 'sd_opn' ? 'sd_cls' : 'sd_opn';
        this.http.menu_status = this.sidemenu_status;
    }

  logout() {
    let login_id = JSON.parse(atob(localStorage.getItem('user'))).login_id;
    let params = { url: 'logout', login_id: login_id };
    this.http.post(params).subscribe((res) => {
      this.http.removeSession();
      this.route.navigate(['/login']);
    });
  }
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
  navigateTo(url){
    let user = this.http.getUser();
    if(user['role']== '1'){
        url = "/admin/"+url;
    }
    if(user['role']== '3' || user['role']== '4' || user['role']== '5' || user['role']== '6' || user['role']== '7'){
      url = "/reviewer/"+url;
  }
    this.route.navigateByUrl(url);
  }
  getSubDomainDetails(sub_domain){
    let params = {
      url: 'get-subdomain-details',
      sub_domain: sub_domain,
    };
    this.http.post(params).subscribe((res) => {
      if(!res['error']){
        localStorage.setItem('header_logo', res['data']['header_logo']);
        //console.log(this.sub_domain_data);
      }else{
        console.log("No subdomain data found");
      }
      this.load_top_bar = true;
    });
  }
  
  getHeaderLogo(){
    let header_logo = localStorage.getItem('header_logo');
    if(header_logo){
      return header_logo;
    }else{
      return "./assets/images/ProceumLogo.png";
    }
  }
}
