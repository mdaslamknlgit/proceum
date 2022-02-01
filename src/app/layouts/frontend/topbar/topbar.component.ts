import { Component, HostListener, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { environment } from 'src/environments/environment';
import { CartCountService } from '../../../services/cart-count.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-topbar',
    templateUrl: './topbar.component.html',
    styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit, OnDestroy {
    //For cart badge
    public glbSrch = true;
    number: any;
    subscription: Subscription;
    user_id = '';
    public domain_name = window.location.protocol;//+window.location.hostname;
    public sidemenu_status: String = '';
    public innerWidth: any;
    public isOpen = false;
    public load_top_bar = false;
    public course_usage = 1;
    public curriculums;
    activeClass: string = 'tp_rt_mn';
    menus: any;
    subMenus: any = [];
    subMenuCount: number = 0;
    isCustomMenuShow: boolean = true;
    sub_domain_data: any = [];

    @Output() finishedLoading: EventEmitter<boolean> = new EventEmitter<boolean>();
    constructor(private http: CommonService, private authHttp: AuthService, private route: Router, private activeRoute: ActivatedRoute, private cartCountService: CartCountService) {
        //for cart badge
        this.subscription = this.cartCountService.getNumber().subscribe(number => { this.number = number });
    }

    public user;
    public search_key = this.http.search_string;
    id: number = undefined;
    ngOnInit(): void {
        //check subdomain
        let sub_domain = window.location.hostname.split('.')[0];
        //sub_domain = 'drsprep';
        //If subdomain not exist in in app domains then check for partner domain
        if (environment.INAPP_DOMAINS_ARRAY.indexOf(sub_domain) === -1) {
            this.getSubDomainDetails(sub_domain);
        } else {
            localStorage.setItem('header_logo', '');
            this.load_top_bar = true;
            this.finishedLoading.emit(true);
        }
        this.http.menu_status = '';
        this.user = this.http.getUser();
        if (this.user) {
            this.user_id = this.user['id'];
        }
        this.innerWidth = window.innerWidth;
        this.getMenus();
        this.getCurriculums();
        this.activeRoute.params.subscribe((routeParams) => {
            if (routeParams.id) {
                //this.activeClass = 'tp_rt_mn active';
            }
        });
    }

    ngAfterViewInit() {
        this.search_key = this.http.search_string;
    }

    navigateTo() {
        if (this.user['role'] == '1' || this.user['role'] == '8' || this.user['role'] == '9' || this.user['role'] == '10') {
            this.route.navigateByUrl('/admin/dashboard');
        } else if (this.user['role'] == '2') {
            this.route.navigateByUrl('/student/dashboard');
        }
        else if (this.user['role'] == '3' || this.user['role'] == '4' || this.user['role'] == '5' || this.user['role'] == '6' || this.user['role'] == '7') {
            this.route.navigateByUrl('/reviewer/dashboard');
        }
        else if (this.user['role'] == '12') {
            this.route.navigateByUrl('/teacher/dashboard');
        }
    }

    menuActive() {
        if (typeof this.id != undefined) {
            this.activeClass = 'tp_rt_mn active';
        }
    }

    toggleSidemenu(param) {
        this.sidemenu_status =
            this.sidemenu_status == 'sd_opn' ? 'sd_cls' : 'sd_opn';
        this.http.menu_status = this.sidemenu_status;
    }

    logout() {
        let login_id = JSON.parse(atob(localStorage.getItem('user'))).login_id;
        let params = { url: 'logout', login_id: login_id };
        this.http.post(params).subscribe((res) => {
            localStorage.removeItem('_token');
            localStorage.removeItem('user');
            localStorage.removeItem('header_logo');
            localStorage.removeItem('footer_logo');
            localStorage.removeItem('p_id');
            localStorage.removeItem('p_type');
            this.route.navigate(['/login']);
        });
    }

    menuToggle() {
        this.isOpen = !this.isOpen;
    }
    isSticky: boolean = false;

    // @HostListener('window:resize', ['$event'])
    //   onResize(event) {
    //   this.innerWidth = window.innerWidth;
    // }

    @HostListener('window:scroll', ['$event'])
    checkScroll() {
        // var AinnerWidth = window.innerWidth;
        this.isSticky = window.pageYOffset >= 100;
    }

    getMenus() {
        let params = { url: 'get-menus', id: this.user_id };
        this.authHttp.post(params).subscribe((res) => {
            this.menus = res['menus'];
            if (res['cart_count'] != 0) {
                this.cartCountService.sendNumber(res['cart_count']);
            }
        });
    }

    changeSubmenu(menu_id) {
        this.subMenus = [];
        let params = {
            url: 'sub-menu',
            parent_id: menu_id,
            name: 'sub-menu',
        };
        this.authHttp.post(params).subscribe((res) => {
            this.subMenus = res['pages'];
        });
    }

    getSubDomainDetails(sub_domain) {
        let params = {
            url: 'get-subdomain-details',
            sub_domain: sub_domain,
        };
        this.authHttp.post(params).subscribe((res) => {
            if (!res['error']) {
                this.sub_domain_data = res['data'];
                localStorage.setItem('header_logo', res['data']['header_logo']);
                localStorage.setItem('footer_logo', res['data']['footer_logo']);
                localStorage.setItem('organization_name', res['data']['organization_name']);
                localStorage.setItem('p_id', res['data']['p_id']);
                localStorage.setItem('p_type', res['data']['p_type']);
                localStorage.setItem('description', res['data']['description']);
                //console.log(this.sub_domain_data);
            }else{
                //window.location.href = environment.APP_BASE_URL;
            }
            this.load_top_bar = true;
            this.finishedLoading.emit(true);
        });
    }

    getHeaderLogo() {
        let header_logo = localStorage.getItem('header_logo');
        if (header_logo) {
            return header_logo;
        } else {
            return "./assets/images/ProceumLogo.png";
        }
    }


    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    getCurriculums() {
        let param = {
            url: 'get-curriculums',
            usage_type: this.course_usage
        };
        this.authHttp.post(param).subscribe((res) => {
            if (res['error'] == false) {
                this.curriculums = res['data'];
            }
        });
    }
    navigateURL(url) {
        this.route.navigateByUrl("/index/curriculum/" + url);
    }
    studentglobalsearch() {
        this.route.navigateByUrl("/index/global-search/" + this.search_key)
    }
}
