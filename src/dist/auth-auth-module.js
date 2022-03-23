(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["auth-auth-module"],{

/***/ "Yj9t":
/*!*************************************!*\
  !*** ./src/app/auth/auth.module.ts ***!
  \*************************************/
/*! exports provided: AuthModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthModule", function() { return AuthModule; });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _login_login_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./login/login.component */ "bsvf");
/* harmony import */ var _material_material_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../material/material.module */ "hctd");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _register_register_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./register/register.component */ "ZGml");
/* harmony import */ var _layouts_layouts_module__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../layouts/layouts.module */ "5wG6");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/forms */ "3Pt+");
/* harmony import */ var _partner_register_partner_register_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./partner-register/partner-register.component */ "5+Hm");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/core */ "fXoL");










const routes = [
    {
        path: '',
        component: _login_login_component__WEBPACK_IMPORTED_MODULE_1__["LoginComponent"],
    },
];
class AuthModule {
}
AuthModule.ɵfac = function AuthModule_Factory(t) { return new (t || AuthModule)(); };
AuthModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdefineNgModule"]({ type: AuthModule });
AuthModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdefineInjector"]({ imports: [[_angular_common__WEBPACK_IMPORTED_MODULE_0__["CommonModule"], _angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterModule"].forChild(routes), _material_material_module__WEBPACK_IMPORTED_MODULE_2__["MaterialModule"], _layouts_layouts_module__WEBPACK_IMPORTED_MODULE_5__["LayoutsModule"], _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormsModule"]], _angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterModule"]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵsetNgModuleScope"](AuthModule, { declarations: [_login_login_component__WEBPACK_IMPORTED_MODULE_1__["LoginComponent"], _register_register_component__WEBPACK_IMPORTED_MODULE_4__["RegisterComponent"], _partner_register_partner_register_component__WEBPACK_IMPORTED_MODULE_7__["PartnerRegisterComponent"]], imports: [_angular_common__WEBPACK_IMPORTED_MODULE_0__["CommonModule"], _angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterModule"], _material_material_module__WEBPACK_IMPORTED_MODULE_2__["MaterialModule"], _layouts_layouts_module__WEBPACK_IMPORTED_MODULE_5__["LayoutsModule"], _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormsModule"]], exports: [_angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterModule"]] }); })();


/***/ }),

/***/ "bsvf":
/*!***********************************************!*\
  !*** ./src/app/auth/login/login.component.ts ***!
  \***********************************************/
/*! exports provided: LoginComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoginComponent", function() { return LoginComponent; });
/* harmony import */ var sweetalert2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! sweetalert2 */ "PSD3");
/* harmony import */ var sweetalert2__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(sweetalert2__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var angularx_social_login__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! angularx-social-login */ "ahC7");
/* harmony import */ var src_environments_environment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/environments/environment */ "AytR");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _auth_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../auth.service */ "qXBG");
/* harmony import */ var ngx_toastr__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ngx-toastr */ "5eHb");
/* harmony import */ var _global__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../global */ "BKks");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _layouts_frontend_topbar_topbar_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../layouts/frontend/topbar/topbar.component */ "kx3i");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/forms */ "3Pt+");
/* harmony import */ var _layouts_frontend_footer_footer_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../layouts/frontend/footer/footer.component */ "PMlp");













function LoginComponent_app_topbar_0_Template(rf, ctx) { if (rf & 1) {
    const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "app-topbar", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("finishedLoading", function LoginComponent_app_topbar_0_Template_app_topbar_finishedLoading_0_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r4); const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](); return ctx_r3.isLoadedTopBar = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
} }
function LoginComponent_div_1_div_1_span_14_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "span", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](ctx_r10.email_error);
} }
function LoginComponent_div_1_div_1_span_23_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "span", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](ctx_r12.password_error);
} }
function LoginComponent_div_1_div_1_Template(rf, ctx) { if (rf & 1) {
    const _r14 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](1, "p", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](2, "Welcome");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](3, "div", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](4, "div", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](5, "div", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](6, "form", 12, 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("ngSubmit", function LoginComponent_div_1_div_1_Template_form_ngSubmit_6_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r14); const ctx_r13 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](2); return ctx_r13.doLogin(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](8, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](9, "input", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](10, "input", 15, 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("ngModelChange", function LoginComponent_div_1_div_1_Template_input_ngModelChange_10_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r14); const ctx_r15 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](2); return ctx_r15.login.email = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](12, "span", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](13, "mail_outline");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](14, LoginComponent_div_1_div_1_span_14_Template, 2, 1, "span", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](15, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](16, "input", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](17, "input", 20, 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("ngModelChange", function LoginComponent_div_1_div_1_Template_input_ngModelChange_17_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r14); const ctx_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](2); return ctx_r16.login.password = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](19, "span", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](20, "password");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](21, "span", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function LoginComponent_div_1_div_1_Template_span_click_21_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r14); const ctx_r17 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](2); return ctx_r17.passwordFun(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](22);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](23, LoginComponent_div_1_div_1_span_23_Template, 2, 1, "span", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](24, "div", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](25, "button", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](26, "Sign In");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](27, "div", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](28, "div", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](29, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](30, "New User? ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](31, "span", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](32, "Register here.");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](33, "div", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](34, "div", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](35, "a", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](36, "Forgot Password ?");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](37, "div", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](38, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](39, "or Sign In with");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](40, "div", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](41, "div", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function LoginComponent_div_1_div_1_Template_div_click_41_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r14); const ctx_r18 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](2); return ctx_r18.sociallogin("GG"); });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](42, "img", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](43, "div", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function LoginComponent_div_1_div_1_Template_div_click_43_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r14); const ctx_r19 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](2); return ctx_r19.sociallogin("FB"); });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](44, "img", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](45, "div", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function LoginComponent_div_1_div_1_Template_div_click_45_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r14); const ctx_r20 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](2); return ctx_r20.sociallogin("AP"); });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](46, "img", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](47, "div", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
} if (rf & 2) {
    const _r8 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵreference"](7);
    const _r9 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵreference"](11);
    const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵclassMapInterpolate1"]("mail ", _r8.submitted && (ctx_r5.login.email == "" || _r9.invalid) ? "err_tltp_par" : "", "");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngModel", ctx_r5.login.email);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", _r8.submitted && (ctx_r5.login.email == "" || ctx_r5.email_check == false));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵclassMapInterpolate1"]("psswrd ", _r8.submitted && ctx_r5.login.password == "" ? "err_tltp_par" : "", "");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("type", ctx_r5.password_hide ? "password" : "text");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("type", ctx_r5.password_hide ? "password" : "text")("ngModel", ctx_r5.login.password);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](ctx_r5.password_hide ? "visibility_off" : "visibility");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", _r8.submitted && ctx_r5.login.password == "");
} }
function LoginComponent_div_1_div_2_span_22_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "span", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r23 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](ctx_r23.email_error);
} }
function LoginComponent_div_1_div_2_span_31_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "span", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r25 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](ctx_r25.password_error);
} }
function LoginComponent_div_1_div_2_Template(rf, ctx) { if (rf & 1) {
    const _r27 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](1, "p", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](2, "Welcome");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](3, "div", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](4, "div", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](5, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](6, "h2");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](8, "hr");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](9, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](10, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](11);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](12, "div", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](13, "div", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](14, "form", 12, 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("ngSubmit", function LoginComponent_div_1_div_2_Template_form_ngSubmit_14_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r27); const ctx_r26 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](2); return ctx_r26.doLogin(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](16, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](17, "input", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](18, "input", 44, 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("ngModelChange", function LoginComponent_div_1_div_2_Template_input_ngModelChange_18_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r27); const ctx_r28 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](2); return ctx_r28.login.email = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](20, "span", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](21, "mail_outline");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](22, LoginComponent_div_1_div_2_span_22_Template, 2, 1, "span", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](23, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](24, "input", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](25, "input", 45, 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("ngModelChange", function LoginComponent_div_1_div_2_Template_input_ngModelChange_25_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r27); const ctx_r29 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](2); return ctx_r29.login.password = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](27, "span", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](28, "password");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](29, "span", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function LoginComponent_div_1_div_2_Template_span_click_29_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r27); const ctx_r30 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](2); return ctx_r30.passwordFun(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](30);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](31, LoginComponent_div_1_div_2_span_31_Template, 2, 1, "span", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](32, "div", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](33, "button", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](34, "Sign In");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](35, "div", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](36, "New User? ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](37, "span", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](38, "Sign-up here.");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
} if (rf & 2) {
    const _r21 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵreference"](15);
    const _r22 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵreference"](19);
    const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](ctx_r6.app.localStorageItem("organization_name"));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](ctx_r6.app.localStorageItem("description"));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵclassMapInterpolate1"]("mail ", _r21.submitted && (ctx_r6.login.email == "" || _r22.invalid) ? "err_tltp_par" : "", "");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngModel", ctx_r6.login.email);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", _r21.submitted && (ctx_r6.login.email == "" || ctx_r6.email_check == false));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵclassMapInterpolate1"]("psswrd ", _r21.submitted && ctx_r6.login.password == "" ? "err_tltp_par" : "", "");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("type", ctx_r6.password_hide ? "password" : "text");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("type", ctx_r6.password_hide ? "password" : "text")("ngModel", ctx_r6.login.password);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](ctx_r6.password_hide ? "visibility_off" : "visibility");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", _r21.submitted && ctx_r6.login.password == "");
} }
function LoginComponent_div_1_div_3_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](1, "p", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](2, "Login");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](3, "div", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](4, "div", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](5, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](6, "h4");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](7, "About ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](8, "h2");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](10, "hr");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](11, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](12, "h2");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](13);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](14, "div", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](15, "div", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](16, "h3", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](17, "Subdomain is suspended, Please contact administrator");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](ctx_r7.app.localStorageItem("organization_name"));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](ctx_r7.app.localStorageItem("description"));
} }
function LoginComponent_div_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](1, LoginComponent_div_1_div_1_Template, 48, 13, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](2, LoginComponent_div_1_div_2_Template, 39, 15, "div", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](3, LoginComponent_div_1_div_3_Template, 18, 2, "div", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx_r1.isLoadedTopBar && !ctx_r1.app.localStorageItem("header_logo"));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx_r1.isLoadedTopBar && ctx_r1.app.localStorageItem("header_logo") && ctx_r1.app.localStorageItem("licence_expired") == "0");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx_r1.isLoadedTopBar && ctx_r1.app.localStorageItem("header_logo") && ctx_r1.app.localStorageItem("licence_expired") == "1");
} }
function LoginComponent_app_footer_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](0, "app-footer");
} }
class LoginComponent {
    constructor(activatedRoute, http, route, toastr, socialAuthService, app) {
        this.activatedRoute = activatedRoute;
        this.http = http;
        this.route = route;
        this.toastr = toastr;
        this.socialAuthService = socialAuthService;
        this.app = app;
        this.force_login = false;
        this.partner_id = 0;
        this.register = {
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            provider: '',
            id: '',
            password: '',
            confirm_pwd: '',
            register_type: '',
        };
        this.login = { email: '', password: '' };
        this.email_error = 'Email is Required';
        this.password_error = 'Password is Required';
        this.email_check = true;
        this.is_login = false;
        this.isLoadedTopBar = false;
        this.subDomain = false;
        this.params = [];
        this.password_hide = true;
    }
    ngOnInit() {
        this.activatedRoute.params.subscribe((param) => {
            if (param.data) {
                try {
                    let data = atob(param.data);
                    this.params = data.split("/");
                    console.log(this.params, data);
                    this.forceLogin();
                }
                catch (e) {
                    // something failed
                    // if you want to be specific and only catch the error which means
                    // the base 64 was invalid, then check for 'e.code === 5'.
                    // (because 'DOMException.INVALID_CHARACTER_ERR === 5')
                }
            }
        });
        this.socialAuthService.authState.subscribe((user) => {
            if (user && this.is_login == false) {
                this.is_login = true;
                this.socialUser = user;
                this.register.first_name = this.socialUser.firstName;
                this.register.last_name = this.socialUser.lastName;
                this.register.email = this.socialUser.email
                    ? this.socialUser.email
                    : '';
                this.register.password = 'Proceum@123';
                this.register.confirm_pwd = 'Proceum@123';
                this.register.register_type = 'SL';
                this.register.provider = this.socialUser.provider;
                this.register.id = this.socialUser.id;
                let params = {
                    url: 'register',
                    first_name: this.register.first_name,
                    last_name: this.register.last_name,
                    email: this.register.email,
                    password: this.register.password,
                    role: 2,
                    register_type: this.register.register_type,
                    provider: this.register.provider,
                    id: this.register.id,
                };
                this.http.register(params).subscribe((res) => {
                    if (res.error) {
                        this.socialAuthService.signOut(true);
                        this.register = {
                            first_name: '',
                            last_name: '',
                            email: '',
                            phone: '',
                            provider: '',
                            id: '',
                            password: '',
                            confirm_pwd: '',
                            register_type: '',
                        };
                        this.toastr.error(res.message, 'Error', {
                            closeButton: true,
                            timeOut: 5000,
                        });
                    }
                    else {
                        localStorage.setItem('_token', res['data'].token);
                        let json_user = btoa(JSON.stringify(res['data'].user));
                        localStorage.setItem('user', json_user);
                        let role = res['data']['user']['role'];
                        if (res['data']['user']['role'] == 1 || role == 8 || role == 9 || role == 10) {
                            //admin
                            let redirect_url = localStorage.getItem('_redirect_url')
                                ? localStorage.getItem('_redirect_url')
                                : '/admin/dashboard';
                            localStorage.removeItem('_redirect_url');
                            this.route.navigate([redirect_url]);
                        }
                        else if (res['data']['user']['role'] == 3 || res['data']['user']['role'] == 4 || res['data']['user']['role'] == 5 || res['data']['user']['role'] == 6 || res['data']['user']['role'] == 7) {
                            //Reviewer L1, L2,L3 Approver
                            let redirect_url = localStorage.getItem('_redirect_url')
                                ? localStorage.getItem('_redirect_url')
                                : '/reviewer/dashboard';
                            localStorage.removeItem('_redirect_url');
                            this.route.navigate([redirect_url]);
                        }
                        else if (role == 8 || role == 9 || role == 10) {
                            let redirect_url = localStorage.getItem('_redirect_url')
                                ? localStorage.getItem('_redirect_url')
                                : '/admin/dashboard';
                            localStorage.removeItem('_redirect_url');
                            this.route.navigate([redirect_url]);
                        }
                        else {
                            //student or others
                            let redirect_url = localStorage.getItem('_redirect_url')
                                ? localStorage.getItem('_redirect_url')
                                : '/student/dashboard';
                            localStorage.removeItem('_redirect_url');
                            this.route.navigate([redirect_url]);
                        }
                    }
                });
            }
        });
    }
    passwordFun() {
        this.password_hide = !this.password_hide;
    }
    forceLogin() {
        if (this.params.length == 0) {
            return false;
        }
        let params = { url: 'force-login', partner_id: this.params[0], role: this.params[1] };
        this.http.login(params).subscribe((res) => {
            if (res.error == false) {
                this.login.email = res['data']['email'],
                    this.login.password = res['data']['password'];
                this.force_login = true;
                console.log(this.params);
                this.doLogin();
            }
        });
    }
    doLogin() {
        if (this.login.email != '') {
            this.email_check = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.login.email);
            if (this.email_check == false) {
                this.email_error = 'Invalid email';
            }
            else {
                if (this.login.password != '') {
                    let params = {
                        url: 'login',
                        email: this.login.email,
                        password: this.login.password,
                        force_login: this.force_login
                    };
                    this.http.login(params).subscribe((res) => {
                        if (res.error) {
                            if (res['insti_reg_user']) {
                                let sweetAlertHtml = 'Dear ' + res['user_role_type'] + ', Thanks for registering with us.<br/> \
                    Your account is not enabled yet as we are still reviewing your information.<br/> \
                    We will get back to you soon.<br/>Once your account is approved, you will be notified via email.';
                                sweetalert2__WEBPACK_IMPORTED_MODULE_0___default.a.fire({
                                    icon: 'warning',
                                    //title: 'Dear Partner,',
                                    html: sweetAlertHtml
                                });
                                return false;
                            }
                            this.toastr.error(res.message, 'Error', {
                                closeButton: true,
                                timeOut: 5000,
                            });
                        }
                        else {
                            localStorage.setItem('_token', res['data'].token);
                            let json_user = btoa(JSON.stringify(res['data'].user));
                            localStorage.setItem('user', json_user);
                            //If login user has subdomain the send him to land on subdomain
                            if (res['data']['user']['sub_domain']) {
                                this.landOnSubdomain(res['data']['user']);
                            }
                            if (res['data']['user']['role'] == 1) {
                                //admin
                                let redirect_url = localStorage.getItem('_redirect_url') ? localStorage.getItem('_redirect_url') : '/admin/dashboard';
                                localStorage.removeItem('_redirect_url');
                                this.route.navigate([redirect_url]);
                            }
                            else if (res['data']['user']['role'] == 3 || res['data']['user']['role'] == 4 || res['data']['user']['role'] == 5 || res['data']['user']['role'] == 6 || res['data']['user']['role'] == 7) {
                                //Reviewer L1, L2,L3 Approver
                                let redirect_url = localStorage.getItem('_redirect_url') ? localStorage.getItem('_redirect_url') : '/reviewer/dashboard';
                                localStorage.removeItem('_redirect_url');
                                this.route.navigate([redirect_url]);
                            }
                            else if (res['data']['user']['role'] == 13) {
                                //Finance User
                                let redirect_url = '/finance-user/dashboard';
                                localStorage.removeItem('_redirect_url');
                                this.route.navigate([redirect_url]);
                            }
                            else if (Object.values(src_environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].PARTNER_ADMIN_SPECIFIC_ROLES).includes(Number(res['data']['user']['role']))) {
                                let redirect_url = localStorage.getItem('_redirect_url') ? localStorage.getItem('_redirect_url') : '/admin/dashboard';
                                this.route.navigate([redirect_url]);
                            }
                            else if (res['data']['user']['role'] == 12) {
                                let redirect_url = localStorage.getItem('_redirect_url') ? localStorage.getItem('_redirect_url') : '/teacher/dashboard';
                                localStorage.removeItem('_redirect_url');
                                this.route.navigate([redirect_url]);
                            }
                            else {
                                //student or others
                                let redirect_url = localStorage.getItem('_redirect_url') ? localStorage.getItem('_redirect_url') : '/student/dashboard';
                                localStorage.removeItem('_redirect_url');
                                this.route.navigate([redirect_url]);
                            }
                        }
                    });
                }
            }
        }
    }
    landOnSubdomain(userData) {
        let replacer = userData['sub_domain'];
        let role = Number(userData['role']);
        let dashboard = "/student/dashboard";
        if (Object.values(src_environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].ALL_ADMIN_SPECIFIC_ROLES).includes(role)) {
            dashboard = "/admin/dashboard";
        }
        if (role == src_environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].ALL_ROLES.TEACHER) {
            dashboard = "/teacher/dashboard";
        }
        let replaceValue = window.location.host.split('.')[0];
        let url = window.location.origin.replace(replaceValue, replacer);
        if (replaceValue != 'localhost:4200') {
            url = url.replace('https', src_environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].SSL_ORIGIN);
            window.location.href = url + dashboard;
        }
        return false;
        /* let newdomain;
        newdomain = window.location.origin.replace('uat', subdomain);
        if (newdomain.indexOf(subdomain) > -1) {
          window.location.href = newdomain + dashboard; return;
        }
        newdomain = window.location.origin.replace('dev', subdomain);
        if (newdomain.indexOf(subdomain) > -1) {
          window.location.href = newdomain + dashboard; return;
        }
        newdomain = window.location.origin.replace('master', subdomain);
        if (newdomain.indexOf(subdomain) > -1) {
          window.location.href = newdomain + dashboard; return;
        } */
    }
    sociallogin(social_type) {
        if (social_type == 'GG') {
            this.socialAuthService.signIn(angularx_social_login__WEBPACK_IMPORTED_MODULE_1__["GoogleLoginProvider"].PROVIDER_ID);
        }
        else if (social_type == 'FB') {
            this.socialAuthService.signIn(angularx_social_login__WEBPACK_IMPORTED_MODULE_1__["FacebookLoginProvider"].PROVIDER_ID);
        }
        else if (social_type == 'AP') {
        }
    }
    logout() {
        let params = { url: 'logout' };
        this.http.login(params).subscribe((res) => {
            localStorage.removeItem('_token');
            localStorage.removeItem('user');
            this.route.navigate(['/login']);
        });
    }
}
LoginComponent.ɵfac = function LoginComponent_Factory(t) { return new (t || LoginComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_4__["ActivatedRoute"]), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_auth_service__WEBPACK_IMPORTED_MODULE_5__["AuthService"]), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_4__["Router"]), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](ngx_toastr__WEBPACK_IMPORTED_MODULE_6__["ToastrService"]), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](angularx_social_login__WEBPACK_IMPORTED_MODULE_1__["SocialAuthService"]), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_global__WEBPACK_IMPORTED_MODULE_7__["GlobalApp"])); };
LoginComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineComponent"]({ type: LoginComponent, selectors: [["app-login"]], decls: 3, vars: 3, consts: [[3, "finishedLoading", 4, "ngIf"], ["class", "mn_dshbrd mlr_auto", 4, "ngIf"], [4, "ngIf"], [3, "finishedLoading"], [1, "mn_dshbrd", "mlr_auto"], ["class", "login_main inner-container", 4, "ngIf"], ["class", "login_main partner_registration inner-container", 4, "ngIf"], [1, "login_main", "inner-container"], [1, "sgn_hd"], [1, "log_mdl_cont"], [1, "log_div", "text_center"], [1, "sgn_sec"], ["name", "login_form", "novalidate", "", 3, "ngSubmit"], ["login_id", "ngForm"], ["type", "email", "name", "user_email", 2, "display", "none"], ["type", "email", "focus", "", "name", "user_email", "placeholder", "Enter Email", "email", "", "ngModel", "", "required", "", "autocomplete", "off", 3, "ngModel", "ngModelChange"], ["user_email", "ngModel"], [1, "material-icons", "mail_icon"], ["class", "prc_tltp", 4, "ngIf"], ["name", "user_password", 2, "display", "none", 3, "type"], ["required", "", "name", "user_password", "placeholder", "Enter Password", "ngModel", "", "autocomplete", "new-password", 3, "type", "ngModel", "ngModelChange"], ["user_password", "ngModel"], [1, "material-icons", "passcode_view_icon", 3, "click"], [1, "login_btns"], ["type", "submit", 1, "teal_btn", "sign_btn", "lgn_btn"], [1, "hgt_5"], [1, "d-flex", "w_100p", "ai_cntr", "mt_1"], ["routerLink", "/register", 1, "lgn_hr"], [1, "spacer"], [1, ""], ["routerLink", "/forgot-password"], [1, "or_signin_with"], [1, "social_login_block"], [1, "sign_google", 3, "click"], ["src", "../../../assets/images/sign-googleicon.svg"], [1, "sign_fb", 3, "click"], ["src", "../../../assets/images/sign-fbicon.svg", "alt", ""], [1, "sign_apple", 3, "click"], ["src", "../../../assets/images/sign-appleicon.svg", "alt", ""], [1, "hgt_20"], [1, "prc_tltp"], [1, "login_main", "partner_registration", "inner-container"], [1, "partner_info"], [1, "log_div", "text_center", "d-flex", "ai_cntr", "fd_clmn", "jc_se"], ["type", "email", "focus", "", "name", "user_email", "placeholder", "Enter Email", "email", "", "ngModel", "", "required", "", 3, "ngModel", "ngModelChange"], ["required", "", "name", "user_password", "placeholder", "Enter Password", "ngModel", "", 3, "type", "ngModel", "ngModelChange"], [1, "text_left", "w_79p"], ["routerLink", "/signup", 1, "lgn_hr"], [2, "color", "darkred"]], template: function LoginComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](0, LoginComponent_app_topbar_0_Template, 1, 0, "app-topbar", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](1, LoginComponent_div_1_Template, 4, 3, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](2, LoginComponent_app_footer_2_Template, 1, 0, "app-footer", 2);
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx.params.length == 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx.params.length == 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx.isLoadedTopBar && ctx.params.length == 0);
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_8__["NgIf"], _layouts_frontend_topbar_topbar_component__WEBPACK_IMPORTED_MODULE_9__["TopbarComponent"], _angular_forms__WEBPACK_IMPORTED_MODULE_10__["ɵangular_packages_forms_forms_ba"], _angular_forms__WEBPACK_IMPORTED_MODULE_10__["NgControlStatusGroup"], _angular_forms__WEBPACK_IMPORTED_MODULE_10__["NgForm"], _angular_forms__WEBPACK_IMPORTED_MODULE_10__["DefaultValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_10__["EmailValidator"], _angular_forms__WEBPACK_IMPORTED_MODULE_10__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_10__["NgModel"], _angular_forms__WEBPACK_IMPORTED_MODULE_10__["RequiredValidator"], _angular_router__WEBPACK_IMPORTED_MODULE_4__["RouterLink"], _angular_router__WEBPACK_IMPORTED_MODULE_4__["RouterLinkWithHref"], _layouts_frontend_footer_footer_component__WEBPACK_IMPORTED_MODULE_11__["FooterComponent"]], styles: [".log_mdl_cont[_ngcontent-%COMP%] {\n  position: relative;\n  margin: auto;\n  bottom: 0;\n  min-height: 350px;\n  width: 800px;\n  display: flex;\n  align-items: center;\n  justify-content: space-around;\n}\n\n.logo_img[_ngcontent-%COMP%] {\n  border-right: 1px solid #0594b4;\n  float: left;\n  align-items: center;\n  display: flex;\n  width: 40%;\n  justify-content: center;\n  height: 350px;\n}\n\n.logo_img[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 200px;\n}\n\n.log_div[_ngcontent-%COMP%] {\n  width: 500px;\n  position: relative;\n  z-index: 90;\n  background-color: #fff;\n}\n\n.sgn_sec[_ngcontent-%COMP%] {\n  width: 100%;\n  border-radius: 10px;\n  color: #000;\n  padding: 50px 70px 30px;\n  box-sizing: border-box;\n  position: relative;\n}\n\n.sgn_sec[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  text-align: left;\n  margin: 0 0 30px 0;\n}\n\n.sgn_hd[_ngcontent-%COMP%] {\n  font-size: 37px;\n  font-weight: 800;\n  text-align: center;\n}\n\n.sgn_hint[_ngcontent-%COMP%] {\n  font-size: 12px;\n}\n\n.text-left[_ngcontent-%COMP%] {\n  text-align: left;\n}\n\n.sgn_sec[_ngcontent-%COMP%]   input[type=text][_ngcontent-%COMP%], .sgn_sec[_ngcontent-%COMP%]   input[type=email][_ngcontent-%COMP%], .sgn_sec[_ngcontent-%COMP%]   input[type=password][_ngcontent-%COMP%] {\n  width: 100%;\n  height: 40px;\n  background-color: #fff;\n  padding: 5px 40px 5px 45px;\n  outline: none;\n  border: 0;\n  box-sizing: border-box;\n  font-size: 18px;\n  color: #000;\n  border-bottom: 1px solid #707070;\n  margin-bottom: 15px;\n}\n\n.mail[_ngcontent-%COMP%], .psswrd[_ngcontent-%COMP%] {\n  position: relative;\n  margin: 12px 0 12px 0;\n  border: 1px solid transparent;\n}\n\n.mail[_ngcontent-%COMP%]   .mail_icon[_ngcontent-%COMP%], .psswrd[_ngcontent-%COMP%]   .mail_icon[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 0px;\n  top: 0;\n  color: #41AB3C;\n  bottom: 15px;\n  margin: auto;\n  height: 24px;\n}\n\n.passcode_view_icon[_ngcontent-%COMP%] {\n  position: absolute;\n  right: 9px;\n  top: 0;\n  color: #41AB3C;\n  bottom: 15px;\n  margin: auto;\n  height: 24px;\n  cursor: pointer;\n}\n\n.mail.err_tltp_par[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], .psswrd.err_tltp_par[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  border-bottom: 1px solid #b71c1c;\n}\n\n.mail.err_tltp_par[_ngcontent-%COMP%]   .material-icons[_ngcontent-%COMP%], .psswrd.err_tltp_par[_ngcontent-%COMP%]   .material-icons[_ngcontent-%COMP%] {\n  color: #b71c1c;\n}\n\n.frgt_sec[_ngcontent-%COMP%] {\n  color: #0594b4;\n  width: 100%;\n  margin-top: 15px;\n  display: flex;\n  justify-content: space-between;\n}\n\n.scl_lgns[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 100%;\n  top: 80px;\n}\n\n.scl_lgns[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\n  width: 200px;\n  height: 40px;\n  margin-bottom: 10px;\n  padding-left: 15px;\n  line-height: 40px;\n  cursor: pointer;\n  text-align: left;\n  text-indent: 5px;\n}\n\n.sgn_fb[_ngcontent-%COMP%] {\n  background-color: #385591;\n  color: #fff;\n}\n\n.sgn_fb[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 20px;\n  float: left;\n  height: 40px;\n  margin-right: 8px;\n}\n\n.scl_lgns[_ngcontent-%COMP%]   .sgn_gg[_ngcontent-%COMP%] {\n  background-color: #4285f4;\n  color: #fff;\n  padding-left: 14px;\n}\n\n.sgn_gg[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 24px;\n  float: left;\n  height: 24px;\n  background-color: #fff;\n  margin-top: 8px;\n  padding: 5px;\n  box-sizing: border-box;\n  margin-right: 5px;\n  border-radius: 4px;\n}\n\n.sgn_ap[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 20px;\n  float: left;\n  height: 40px;\n  margin-right: 8px;\n}\n\n.sgn_ap[_ngcontent-%COMP%] {\n  background-color: #757575;\n  color: #fff;\n}\n\n.err_tltp_par[_ngcontent-%COMP%], .inp_par_dv[_ngcontent-%COMP%] {\n  width: 100%;\n}\n\n.frgt_sec[_ngcontent-%COMP%] {\n  font-weight: 200;\n  font-size: 14px;\n}\n\n.frgt_sec[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  color: #FFF;\n  opacity: 0.6;\n}\n\n.frgt_sec[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover {\n  opacity: 1;\n}\n\n.teal_btn.sign_btn-2[_ngcontent-%COMP%] {\n  background-color: #fff;\n  border: 1px solid #70707030;\n  text-transform: uppercase;\n  border-radius: 5px;\n  color: #000;\n  margin-right: 20px;\n}\n\n.teal_btn.sign_btn[_ngcontent-%COMP%] {\n  background-color: #41AB3C;\n  border: 1px solid #41AB3C;\n  text-transform: uppercase;\n  border-radius: 5px;\n}\n\n.social_login_block[_ngcontent-%COMP%] {\n  margin-top: 20px;\n}\n\n.forgot_password[_ngcontent-%COMP%] {\n  margin-top: 20px;\n}\n\n.forgot_password[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  color: #000;\n}\n\n.or_signin_with[_ngcontent-%COMP%]:before {\n  content: \"\";\n  height: 1px;\n  background: #707070;\n  width: 100%;\n  position: absolute;\n  left: 0;\n  top: 13px;\n  z-index: -1;\n}\n\n.or_signin_with[_ngcontent-%COMP%] {\n  position: relative;\n  text-align: center;\n  z-index: 0;\n  margin-top: 10px;\n}\n\n.or_signin_with[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  background: #FFF;\n  display: inline-block;\n  padding-right: 10px;\n  padding-left: 10px;\n}\n\n.social_login_block[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\n  display: inline-block;\n  max-width: 35px;\n  margin: 0 5px;\n  cursor: pointer;\n}\n\n.login_btns[_ngcontent-%COMP%] {\n  text-align: center;\n  margin-top: 10px;\n}\n\n  app-root {\n  background-color: #F5F7F9;\n}\n\n.inner-container[_ngcontent-%COMP%] {\n  margin-top: 0px;\n}\n\n.partner_info[_ngcontent-%COMP%] {\n  padding: 20px 10px 20px 20px;\n  background: #41ab3c;\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  border-radius: 20px 0 0 20px;\n  font-size: 16px;\n  font-weight: 200;\n  color: #FFF;\n}\n\n.partner_info[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%] {\n  overflow: auto;\n  max-height: 300px;\n}\n\n.partner_registration[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] {\n  margin-bottom: 0;\n  font-weight: 300;\n  font-size: larger;\n  color: #FFF;\n}\n\n.partner_registration[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin-top: 0;\n  color: #FFF;\n}\n\n.partner_info[_ngcontent-%COMP%]   hr[_ngcontent-%COMP%] {\n  background-color: #FFF;\n}\n\n.partner_registration[_ngcontent-%COMP%]   .sgn_hd[_ngcontent-%COMP%] {\n  text-align: center;\n}\n\n.partner_registration[_ngcontent-%COMP%]   .log_div[_ngcontent-%COMP%] {\n  flex: 3;\n}\n\n.partner_registration[_ngcontent-%COMP%]   .mat-stepper-horizontal[_ngcontent-%COMP%] {\n  border-radius: 0 20px 20px 0;\n}\n\n.partner_registration[_ngcontent-%COMP%]   .log_mdl_cont[_ngcontent-%COMP%] {\n  vertical-align: top;\n  align-items: normal;\n}\n\n.partner_registration[_ngcontent-%COMP%]   .sgn_sec[_ngcontent-%COMP%] {\n  padding: 0 60px;\n}\n\n.login_main[_ngcontent-%COMP%] {\n  height: auto;\n  padding: 0 20px 50px 20px;\n}\n\n.partner_registration.login_main[_ngcontent-%COMP%] {\n  padding: 50px 20px;\n}\n\n@media (max-width: 1600px) {\n  .log_mdl_cont[_ngcontent-%COMP%] {\n    left: 0;\n    right: 0;\n  }\n}\n\n@media (max-width: 1100px) {\n  .partner_registration[_ngcontent-%COMP%]   .partner_info[_ngcontent-%COMP%] {\n    border-radius: 20px;\n  }\n\n  .logo_img[_ngcontent-%COMP%] {\n    width: 100%;\n    border: 0;\n    height: auto;\n    margin-top: 40px;\n  }\n\n  .log_mdl_cont[_ngcontent-%COMP%] {\n    display: block;\n    position: relative;\n    top: auto;\n    left: auto;\n    display: flex;\n    flex-direction: column-reverse;\n    row-gap: 20px;\n  }\n\n  .wlcm_hd[_ngcontent-%COMP%] {\n    text-align: left;\n  }\n\n  .log_div[_ngcontent-%COMP%] {\n    margin: 0 auto;\n    top: 10%;\n    bottom: 0;\n    position: relative;\n    left: 0;\n    right: 0;\n  }\n\n  .partner_registration[_ngcontent-%COMP%]   .log_div[_ngcontent-%COMP%] {\n    position: static;\n    top: auto;\n  }\n\n  .partner_registration[_ngcontent-%COMP%]   .mat-stepper-horizontal[_ngcontent-%COMP%] {\n    border-radius: 0 0 20px 20px;\n  }\n}\n\n@media (max-width: 767px) {\n  .login_btns[_ngcontent-%COMP%] {\n    display: flex;\n    flex-direction: column-reverse;\n    max-width: 300px;\n    margin: auto;\n  }\n\n  .log_mdl_cont[_ngcontent-%COMP%] {\n    width: 100%;\n    padding-bottom: 15px;\n  }\n\n  .scl_lgns[_ngcontent-%COMP%] {\n    left: auto;\n    right: auto;\n    top: 20px;\n    border-top: 1px solid #fff;\n    padding-top: 20px;\n    position: relative;\n  }\n\n  .scl_lgns[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\n    width: auto;\n  }\n\n  .log_div[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n\n  .login_main[_ngcontent-%COMP%] {\n    padding: 0 20px;\n  }\n\n  .sgn_sec[_ngcontent-%COMP%] {\n    padding: 30px 15px;\n  }\n\n  .lgn_btn[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n\n  .frgt_sec[_ngcontent-%COMP%] {\n    display: inline-block;\n    margin-top: 0px;\n  }\n\n  .frgt_sec[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n    width: 100%;\n    display: inline-block;\n    margin-top: 12px;\n  }\n\n  .logo_img[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n    margin-right: 25px;\n  }\n\n  .wlcm_hd[_ngcontent-%COMP%] {\n    text-align: center;\n  }\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFxsb2dpbi5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLGtCQUFBO0VBQ0EsWUFBQTtFQUVBLFNBQUE7RUFDQSxpQkFBQTtFQUNBLFlBQUE7RUFDQSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSw2QkFBQTtBQUFGOztBQUlBO0VBQ0UsK0JBQUE7RUFDQSxXQUFBO0VBQ0EsbUJBQUE7RUFDQSxhQUFBO0VBQ0EsVUFBQTtFQUNBLHVCQUFBO0VBQ0EsYUFBQTtBQURGOztBQUlBO0VBQ0UsWUFBQTtBQURGOztBQUlBO0VBQ0UsWUFBQTtFQUNBLGtCQUFBO0VBQ0EsV0FBQTtFQUNBLHNCQUFBO0FBREY7O0FBSUE7RUFDRSxXQUFBO0VBRUEsbUJBQUE7RUFDQSxXQUFBO0VBQ0EsdUJBQUE7RUFDQSxzQkFBQTtFQUNBLGtCQUFBO0FBRkY7O0FBS0E7RUFDRSxnQkFBQTtFQUNBLGtCQUFBO0FBRkY7O0FBS0E7RUFDRSxlQUFBO0VBQ0EsZ0JBQUE7RUFDQSxrQkFBQTtBQUZGOztBQUtBO0VBQ0UsZUFBQTtBQUZGOztBQUtBO0VBQ0UsZ0JBQUE7QUFGRjs7QUFLQTs7O0VBR0UsV0FBQTtFQUNBLFlBQUE7RUFDQSxzQkFBQTtFQUNBLDBCQUFBO0VBQ0EsYUFBQTtFQUNBLFNBQUE7RUFDQSxzQkFBQTtFQUNBLGVBQUE7RUFDQSxXQUFBO0VBQ0EsZ0NBQUE7RUFDQSxtQkFBQTtBQUZGOztBQUtBOztFQUVFLGtCQUFBO0VBQ0EscUJBQUE7RUFDQSw2QkFBQTtBQUZGOztBQUtBOztFQUVFLGtCQUFBO0VBQ0EsU0FBQTtFQUNBLE1BQUE7RUFDQSxjQUFBO0VBQ0EsWUFBQTtFQUNBLFlBQUE7RUFDQSxZQUFBO0FBRkY7O0FBS0E7RUFDRSxrQkFBQTtFQUNBLFVBQUE7RUFDQSxNQUFBO0VBQ0EsY0FBQTtFQUNBLFlBQUE7RUFDQSxZQUFBO0VBQ0EsWUFBQTtFQUNBLGVBQUE7QUFGRjs7QUFLQTs7RUFFRSxnQ0FBQTtBQUZGOztBQUtBOztFQUVFLGNBQUE7QUFGRjs7QUFLQTtFQUNFLGNBQUE7RUFDQSxXQUFBO0VBQ0EsZ0JBQUE7RUFDQSxhQUFBO0VBQ0EsOEJBQUE7QUFGRjs7QUFLQTtFQUNFLGtCQUFBO0VBQ0EsVUFBQTtFQUNBLFNBQUE7QUFGRjs7QUFLQTtFQUNFLFlBQUE7RUFDQSxZQUFBO0VBQ0EsbUJBQUE7RUFDQSxrQkFBQTtFQUNBLGlCQUFBO0VBQ0EsZUFBQTtFQUNBLGdCQUFBO0VBQ0EsZ0JBQUE7QUFGRjs7QUFLQTtFQUNFLHlCQUFBO0VBQ0EsV0FBQTtBQUZGOztBQUtBO0VBQ0UsV0FBQTtFQUNBLFdBQUE7RUFDQSxZQUFBO0VBQ0EsaUJBQUE7QUFGRjs7QUFLQTtFQUNFLHlCQUFBO0VBQ0EsV0FBQTtFQUNBLGtCQUFBO0FBRkY7O0FBS0E7RUFDRSxXQUFBO0VBQ0EsV0FBQTtFQUNBLFlBQUE7RUFDQSxzQkFBQTtFQUNBLGVBQUE7RUFDQSxZQUFBO0VBQ0Esc0JBQUE7RUFDQSxpQkFBQTtFQUNBLGtCQUFBO0FBRkY7O0FBS0E7RUFDRSxXQUFBO0VBQ0EsV0FBQTtFQUNBLFlBQUE7RUFDQSxpQkFBQTtBQUZGOztBQUtBO0VBQ0UseUJBQUE7RUFDQSxXQUFBO0FBRkY7O0FBS0E7O0VBRUUsV0FBQTtBQUZGOztBQUtBO0VBQ0UsZ0JBQUE7RUFDQSxlQUFBO0FBRkY7O0FBSUU7RUFDRSxXQUFBO0VBQ0EsWUFBQTtBQUZKOztBQUdJO0VBQ0UsVUFBQTtBQUROOztBQU1BO0VBQ0Usc0JBQUE7RUFDQSwyQkFBQTtFQUNBLHlCQUFBO0VBQ0Esa0JBQUE7RUFDQSxXQUFBO0VBQ0Esa0JBQUE7QUFIRjs7QUFNQTtFQUNFLHlCQUFBO0VBQ0EseUJBQUE7RUFDQSx5QkFBQTtFQUNBLGtCQUFBO0FBSEY7O0FBTUE7RUFDRSxnQkFBQTtBQUhGOztBQU1BO0VBQ0UsZ0JBQUE7QUFIRjs7QUFNQTtFQUNFLFdBQUE7QUFIRjs7QUFNQTtFQUNFLFdBQUE7RUFDQSxXQUFBO0VBQ0EsbUJBQUE7RUFDQSxXQUFBO0VBQ0Esa0JBQUE7RUFDQSxPQUFBO0VBQ0EsU0FBQTtFQUNBLFdBQUE7QUFIRjs7QUFNQTtFQUNFLGtCQUFBO0VBQ0Esa0JBQUE7RUFDQSxVQUFBO0VBQ0EsZ0JBQUE7QUFIRjs7QUFNQTtFQUNFLGdCQUFBO0VBQ0EscUJBQUE7RUFDQSxtQkFBQTtFQUNBLGtCQUFBO0FBSEY7O0FBTUE7RUFDRSxxQkFBQTtFQUNBLGVBQUE7RUFDQSxhQUFBO0VBQ0EsZUFBQTtBQUhGOztBQU1BO0VBQ0Usa0JBQUE7RUFDQSxnQkFBQTtBQUhGOztBQUtBO0VBQ0UseUJBQUE7QUFGRjs7QUFLQTtFQUVJLGVBQUE7QUFISjs7QUFNQTtFQUVFLDRCQUFBO0VBQ0EsbUJBQUE7RUFDQSxPQUFBO0VBQ0EsYUFBQTtFQUNBLHNCQUFBO0VBQ0EsNEJBQUE7RUFDQSxlQUFBO0VBQ0EsZ0JBQUE7RUFDQSxXQUFBO0FBSkY7O0FBS0U7RUFDRSxjQUFBO0VBQ0EsaUJBQUE7QUFISjs7QUFPQTtFQUNFLGdCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxpQkFBQTtFQUNBLFdBQUE7QUFKRjs7QUFPQTtFQUNFLGFBQUE7RUFDQSxXQUFBO0FBSkY7O0FBT0E7RUFDRSxzQkFBQTtBQUpGOztBQU9BO0VBQ0Usa0JBQUE7QUFKRjs7QUFRQTtFQUNFLE9BQUE7QUFMRjs7QUFRQTtFQUNFLDRCQUFBO0FBTEY7O0FBUUE7RUFFRSxtQkFBQTtFQUNBLG1CQUFBO0FBTkY7O0FBVUE7RUFHRSxlQUFBO0FBVEY7O0FBWUE7RUFDRSxZQUFBO0VBRUEseUJBQUE7QUFWRjs7QUFhRTtFQUVFLGtCQUFBO0FBWEo7O0FBaUJBO0VBQ0U7SUFDRSxPQUFBO0lBQ0EsUUFBQTtFQWRGO0FBQ0Y7O0FBdUJBO0VBQ0U7SUFDRSxtQkFBQTtFQXJCRjs7RUF1QkE7SUFDRSxXQUFBO0lBQ0EsU0FBQTtJQUNBLFlBQUE7SUFDQSxnQkFBQTtFQXBCRjs7RUF1QkE7SUFDRSxjQUFBO0lBQ0Esa0JBQUE7SUFFQSxTQUFBO0lBQ0EsVUFBQTtJQUNBLGFBQUE7SUFDQSw4QkFBQTtJQUNBLGFBQUE7RUFyQkY7O0VBd0JBO0lBQ0UsZ0JBQUE7RUFyQkY7O0VBd0JBO0lBQ0UsY0FBQTtJQUNBLFFBQUE7SUFDQSxTQUFBO0lBQ0Esa0JBQUE7SUFDQSxPQUFBO0lBQ0EsUUFBQTtFQXJCRjs7RUF3QkE7SUFDRSxnQkFBQTtJQUNBLFNBQUE7RUFyQkY7O0VBdUJBO0lBQ0UsNEJBQUE7RUFwQkY7QUFDRjs7QUF1QkE7RUFDRTtJQUNFLGFBQUE7SUFDQSw4QkFBQTtJQUNBLGdCQUFBO0lBQ0EsWUFBQTtFQXJCRjs7RUF1QkE7SUFDRSxXQUFBO0lBQ0Esb0JBQUE7RUFwQkY7O0VBc0JBO0lBQ0UsVUFBQTtJQUNBLFdBQUE7SUFDQSxTQUFBO0lBQ0EsMEJBQUE7SUFDQSxpQkFBQTtJQUNBLGtCQUFBO0VBbkJGOztFQXNCQTtJQUNFLFdBQUE7RUFuQkY7O0VBc0JBO0lBQ0UsV0FBQTtFQW5CRjs7RUFzQkE7SUFHRSxlQUFBO0VBckJGOztFQXdCQTtJQUNFLGtCQUFBO0VBckJGOztFQXdCQTtJQUNFLFdBQUE7RUFyQkY7O0VBd0JBO0lBQ0UscUJBQUE7SUFDQSxlQUFBO0VBckJGOztFQXdCQTtJQUNFLFdBQUE7SUFDQSxxQkFBQTtJQUNBLGdCQUFBO0VBckJGOztFQXdCQTtJQUNFLGtCQUFBO0VBckJGOztFQXdCQTtJQUNFLGtCQUFBO0VBckJGO0FBQ0YiLCJmaWxlIjoibG9naW4uY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIubG9nX21kbF9jb250IHtcclxuICBwb3NpdGlvbiAgICAgICA6IHJlbGF0aXZlO1xyXG4gIG1hcmdpbiAgICAgICAgIDogYXV0bztcclxuICAvLyB0b3AgICAgICAgICAgICA6IDEwJTtcclxuICBib3R0b20gICAgICAgICA6IDA7XHJcbiAgbWluLWhlaWdodCAgICAgOiAzNTBweDtcclxuICB3aWR0aCAgICAgICAgICA6IDgwMHB4O1xyXG4gIGRpc3BsYXkgICAgICAgIDogZmxleDtcclxuICBhbGlnbi1pdGVtcyAgICA6IGNlbnRlcjtcclxuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcclxuICAvLyBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xyXG59XHJcblxyXG4ubG9nb19pbWcge1xyXG4gIGJvcmRlci1yaWdodCAgIDogMXB4IHNvbGlkICMwNTk0YjQ7XHJcbiAgZmxvYXQgICAgICAgICAgOiBsZWZ0O1xyXG4gIGFsaWduLWl0ZW1zICAgIDogY2VudGVyO1xyXG4gIGRpc3BsYXkgICAgICAgIDogZmxleDtcclxuICB3aWR0aCAgICAgICAgICA6IDQwJTtcclxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuICBoZWlnaHQgICAgICAgICA6IDM1MHB4O1xyXG59XHJcblxyXG4ubG9nb19pbWcgaW1nIHtcclxuICB3aWR0aDogMjAwcHg7XHJcbn1cclxuXHJcbi5sb2dfZGl2IHtcclxuICB3aWR0aCAgIDogNTAwcHg7XHJcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gIHotaW5kZXggOiA5MDtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xyXG59XHJcblxyXG4uc2duX3NlYyB7XHJcbiAgd2lkdGggICAgICAgICAgIDogMTAwJTtcclxuICAvLyBiYWNrZ3JvdW5kLWNvbG9yOiAjRkZGO1xyXG4gIGJvcmRlci1yYWRpdXMgICA6IDEwcHg7XHJcbiAgY29sb3IgICAgICAgICAgIDogIzAwMDtcclxuICBwYWRkaW5nICAgICAgICAgOiA1MHB4IDcwcHggMzBweDtcclxuICBib3gtc2l6aW5nICAgICAgOiBib3JkZXItYm94O1xyXG4gIHBvc2l0aW9uICAgICAgICA6IHJlbGF0aXZlO1xyXG59XHJcblxyXG4uc2duX3NlYyBwIHtcclxuICB0ZXh0LWFsaWduOiBsZWZ0O1xyXG4gIG1hcmdpbiAgICA6IDAgMCAzMHB4IDA7XHJcbn1cclxuXHJcbi5zZ25faGQge1xyXG4gIGZvbnQtc2l6ZSAgOiAzN3B4O1xyXG4gIGZvbnQtd2VpZ2h0OiA4MDA7XHJcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG59XHJcblxyXG4uc2duX2hpbnQge1xyXG4gIGZvbnQtc2l6ZTogMTJweDtcclxufVxyXG5cclxuLnRleHQtbGVmdCB7XHJcbiAgdGV4dC1hbGlnbjogbGVmdDtcclxufVxyXG5cclxuLnNnbl9zZWMgaW5wdXRbdHlwZT1cInRleHRcIl0sXHJcbi5zZ25fc2VjIGlucHV0W3R5cGU9XCJlbWFpbFwiXSxcclxuLnNnbl9zZWMgaW5wdXRbdHlwZT1cInBhc3N3b3JkXCJdIHtcclxuICB3aWR0aCAgICAgICAgICAgOiAxMDAlO1xyXG4gIGhlaWdodCAgICAgICAgICA6IDQwcHg7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcclxuICBwYWRkaW5nICAgICAgICAgOiA1cHggNDBweCA1cHggNDVweDtcclxuICBvdXRsaW5lICAgICAgICAgOiBub25lO1xyXG4gIGJvcmRlciAgICAgICAgICA6IDA7XHJcbiAgYm94LXNpemluZyAgICAgIDogYm9yZGVyLWJveDtcclxuICBmb250LXNpemUgICAgICAgOiAxOHB4O1xyXG4gIGNvbG9yICAgICAgICAgICA6ICMwMDA7XHJcbiAgYm9yZGVyLWJvdHRvbSAgIDogMXB4IHNvbGlkICM3MDcwNzA7XHJcbiAgbWFyZ2luLWJvdHRvbSAgIDogMTVweDtcclxufVxyXG5cclxuLm1haWwsXHJcbi5wc3N3cmQge1xyXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICBtYXJnaW4gIDogMTJweCAwIDEycHggMDtcclxuICBib3JkZXIgIDogMXB4IHNvbGlkIHRyYW5zcGFyZW50O1xyXG59XHJcblxyXG4ubWFpbCAubWFpbF9pY29uLFxyXG4ucHNzd3JkIC5tYWlsX2ljb24ge1xyXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICBsZWZ0ICAgIDogMHB4O1xyXG4gIHRvcCAgICAgOiAwO1xyXG4gIGNvbG9yICAgOiAjNDFBQjNDO1xyXG4gIGJvdHRvbSAgOiAxNXB4O1xyXG4gIG1hcmdpbiAgOiBhdXRvO1xyXG4gIGhlaWdodCAgOiAyNHB4O1xyXG59XHJcblxyXG4ucGFzc2NvZGVfdmlld19pY29uIHtcclxuICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgcmlnaHQgICA6IDlweDtcclxuICB0b3AgICAgIDogMDtcclxuICBjb2xvciAgIDogIzQxQUIzQztcclxuICBib3R0b20gIDogMTVweDtcclxuICBtYXJnaW4gIDogYXV0bztcclxuICBoZWlnaHQgIDogMjRweDtcclxuICBjdXJzb3IgIDogcG9pbnRlcjtcclxufVxyXG5cclxuLm1haWwuZXJyX3RsdHBfcGFyIGlucHV0LFxyXG4ucHNzd3JkLmVycl90bHRwX3BhciBpbnB1dCB7XHJcbiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNiNzFjMWM7XHJcbn1cclxuXHJcbi5tYWlsLmVycl90bHRwX3BhciAubWF0ZXJpYWwtaWNvbnMsXHJcbi5wc3N3cmQuZXJyX3RsdHBfcGFyIC5tYXRlcmlhbC1pY29ucyB7XHJcbiAgY29sb3I6ICNiNzFjMWNcclxufVxyXG5cclxuLmZyZ3Rfc2VjIHtcclxuICBjb2xvciAgICAgICAgICA6ICMwNTk0YjQ7XHJcbiAgd2lkdGggICAgICAgICAgOiAxMDAlO1xyXG4gIG1hcmdpbi10b3AgICAgIDogMTVweDtcclxuICBkaXNwbGF5ICAgICAgICA6IGZsZXg7XHJcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xyXG59XHJcblxyXG4uc2NsX2xnbnMge1xyXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICBsZWZ0ICAgIDogMTAwJTtcclxuICB0b3AgICAgIDogODBweDtcclxufVxyXG5cclxuLnNjbF9sZ25zIGRpdiB7XHJcbiAgd2lkdGggICAgICAgIDogMjAwcHg7XHJcbiAgaGVpZ2h0ICAgICAgIDogNDBweDtcclxuICBtYXJnaW4tYm90dG9tOiAxMHB4O1xyXG4gIHBhZGRpbmctbGVmdCA6IDE1cHg7XHJcbiAgbGluZS1oZWlnaHQgIDogNDBweDtcclxuICBjdXJzb3IgICAgICAgOiBwb2ludGVyO1xyXG4gIHRleHQtYWxpZ24gICA6IGxlZnQ7XHJcbiAgdGV4dC1pbmRlbnQgIDogNXB4O1xyXG59XHJcblxyXG4uc2duX2ZiIHtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMzg1NTkxO1xyXG4gIGNvbG9yICAgICAgICAgICA6ICNmZmY7XHJcbn1cclxuXHJcbi5zZ25fZmIgaW1nIHtcclxuICB3aWR0aCAgICAgICA6IDIwcHg7XHJcbiAgZmxvYXQgICAgICAgOiBsZWZ0O1xyXG4gIGhlaWdodCAgICAgIDogNDBweDtcclxuICBtYXJnaW4tcmlnaHQ6IDhweDtcclxufVxyXG5cclxuLnNjbF9sZ25zIC5zZ25fZ2cge1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICM0Mjg1ZjQ7XHJcbiAgY29sb3IgICAgICAgICAgIDogI2ZmZjtcclxuICBwYWRkaW5nLWxlZnQgICAgOiAxNHB4O1xyXG59XHJcblxyXG4uc2duX2dnIGltZyB7XHJcbiAgd2lkdGggICAgICAgICAgIDogMjRweDtcclxuICBmbG9hdCAgICAgICAgICAgOiBsZWZ0O1xyXG4gIGhlaWdodCAgICAgICAgICA6IDI0cHg7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcclxuICBtYXJnaW4tdG9wICAgICAgOiA4cHg7XHJcbiAgcGFkZGluZyAgICAgICAgIDogNXB4O1xyXG4gIGJveC1zaXppbmcgICAgICA6IGJvcmRlci1ib3g7XHJcbiAgbWFyZ2luLXJpZ2h0ICAgIDogNXB4O1xyXG4gIGJvcmRlci1yYWRpdXMgICA6IDRweDtcclxufVxyXG5cclxuLnNnbl9hcCBpbWcge1xyXG4gIHdpZHRoICAgICAgIDogMjBweDtcclxuICBmbG9hdCAgICAgICA6IGxlZnQ7XHJcbiAgaGVpZ2h0ICAgICAgOiA0MHB4O1xyXG4gIG1hcmdpbi1yaWdodDogOHB4O1xyXG59XHJcblxyXG4uc2duX2FwIHtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjNzU3NTc1O1xyXG4gIGNvbG9yICAgICAgICAgICA6ICNmZmY7XHJcbn1cclxuXHJcbi5lcnJfdGx0cF9wYXIsXHJcbi5pbnBfcGFyX2R2IHtcclxuICB3aWR0aDogMTAwJTtcclxufVxyXG5cclxuLmZyZ3Rfc2VjIHtcclxuICBmb250LXdlaWdodDogMjAwO1xyXG4gIGZvbnQtc2l6ZSAgOiAxNHB4O1xyXG5cclxuICBhIHtcclxuICAgIGNvbG9yICA6ICNGRkY7XHJcbiAgICBvcGFjaXR5OiAwLjY7XHJcbiAgICAmOmhvdmVyIHtcclxuICAgICAgb3BhY2l0eTogMTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbi50ZWFsX2J0bi5zaWduX2J0bi0yIHtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xyXG4gIGJvcmRlciAgICAgICAgICA6IDFweCBzb2xpZCAjNzA3MDcwMzA7XHJcbiAgdGV4dC10cmFuc2Zvcm0gIDogdXBwZXJjYXNlO1xyXG4gIGJvcmRlci1yYWRpdXMgICA6IDVweDtcclxuICBjb2xvciAgICAgICAgICAgOiAjMDAwO1xyXG4gIG1hcmdpbi1yaWdodCAgICA6IDIwcHg7XHJcbn1cclxuXHJcbi50ZWFsX2J0bi5zaWduX2J0biB7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogIzQxQUIzQztcclxuICBib3JkZXIgICAgICAgICAgOiAxcHggc29saWQgIzQxQUIzQztcclxuICB0ZXh0LXRyYW5zZm9ybSAgOiB1cHBlcmNhc2U7XHJcbiAgYm9yZGVyLXJhZGl1cyAgIDogNXB4O1xyXG59XHJcblxyXG4uc29jaWFsX2xvZ2luX2Jsb2NrIHtcclxuICBtYXJnaW4tdG9wOiAyMHB4O1xyXG59XHJcblxyXG4uZm9yZ290X3Bhc3N3b3JkIHtcclxuICBtYXJnaW4tdG9wOiAyMHB4O1xyXG59XHJcblxyXG4uZm9yZ290X3Bhc3N3b3JkIGEge1xyXG4gIGNvbG9yOiAjMDAwO1xyXG59XHJcblxyXG4ub3Jfc2lnbmluX3dpdGg6YmVmb3JlIHtcclxuICBjb250ZW50ICAgOiBcIlwiO1xyXG4gIGhlaWdodCAgICA6IDFweDtcclxuICBiYWNrZ3JvdW5kOiAjNzA3MDcwO1xyXG4gIHdpZHRoICAgICA6IDEwMCU7XHJcbiAgcG9zaXRpb24gIDogYWJzb2x1dGU7XHJcbiAgbGVmdCAgICAgIDogMDtcclxuICB0b3AgICAgICAgOiAxM3B4O1xyXG4gIHotaW5kZXggICA6IC0xO1xyXG59XHJcblxyXG4ub3Jfc2lnbmluX3dpdGgge1xyXG4gIHBvc2l0aW9uICA6IHJlbGF0aXZlO1xyXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICB6LWluZGV4ICAgOiAwO1xyXG4gIG1hcmdpbi10b3A6IDEwcHg7XHJcbn1cclxuXHJcbi5vcl9zaWduaW5fd2l0aCBzcGFuIHtcclxuICBiYWNrZ3JvdW5kICAgOiAjRkZGO1xyXG4gIGRpc3BsYXkgICAgICA6IGlubGluZS1ibG9jaztcclxuICBwYWRkaW5nLXJpZ2h0OiAxMHB4O1xyXG4gIHBhZGRpbmctbGVmdCA6IDEwcHg7XHJcbn1cclxuXHJcbi5zb2NpYWxfbG9naW5fYmxvY2sgZGl2IHtcclxuICBkaXNwbGF5ICA6IGlubGluZS1ibG9jaztcclxuICBtYXgtd2lkdGg6IDM1cHg7XHJcbiAgbWFyZ2luICAgOiAwIDVweDtcclxuICBjdXJzb3IgICA6IHBvaW50ZXI7XHJcbn1cclxuXHJcbi5sb2dpbl9idG5zIHtcclxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgbWFyZ2luLXRvcDogMTBweDtcclxufVxyXG46Om5nLWRlZXAgYXBwLXJvb3Qge1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICNGNUY3Rjk7XHJcbn1cclxuXHJcbi5pbm5lci1jb250YWluZXIge1xyXG4gIC8vIG1hcmdpbi10b3A6IDk1cHg7XHJcbiAgICBtYXJnaW4tdG9wOiAwcHg7XHJcbn1cclxuXHJcbi5wYXJ0bmVyX2luZm8ge1xyXG4gIC8vIHdpZHRoOiAzNTBweDtcclxuICBwYWRkaW5nICAgICAgICA6IDIwcHggMTBweCAyMHB4IDIwcHg7XHJcbiAgYmFja2dyb3VuZCAgICAgOiAjNDFhYjNjO1xyXG4gIGZsZXggICAgICAgICAgIDogMTtcclxuICBkaXNwbGF5ICAgICAgICA6IGZsZXg7XHJcbiAgZmxleC1kaXJlY3Rpb24gOiBjb2x1bW47XHJcbiAgYm9yZGVyLXJhZGl1cyAgOiAyMHB4IDAgMCAyMHB4O1xyXG4gIGZvbnQtc2l6ZSAgICAgIDogMTZweDtcclxuICBmb250LXdlaWdodCAgICA6IDIwMDtcclxuICBjb2xvciAgICAgICAgICA6ICNGRkY7XHJcbiAgPiBkaXZ7XHJcbiAgICBvdmVyZmxvdzogYXV0bztcclxuICAgIG1heC1oZWlnaHQ6IDMwMHB4O1xyXG4gIH1cclxufVxyXG5cclxuLnBhcnRuZXJfcmVnaXN0cmF0aW9uIGg0IHtcclxuICBtYXJnaW4tYm90dG9tOiAwO1xyXG4gIGZvbnQtd2VpZ2h0ICA6IDMwMDtcclxuICBmb250LXNpemUgICAgOiBsYXJnZXI7XHJcbiAgY29sb3IgICAgICAgIDogI0ZGRjtcclxufVxyXG5cclxuLnBhcnRuZXJfcmVnaXN0cmF0aW9uIGgyIHtcclxuICBtYXJnaW4tdG9wOiAwO1xyXG4gIGNvbG9yICAgICA6ICNGRkY7XHJcbn1cclxuXHJcbi5wYXJ0bmVyX2luZm8gaHIge1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICNGRkY7XHJcbn1cclxuXHJcbi5wYXJ0bmVyX3JlZ2lzdHJhdGlvbiAuc2duX2hkIHtcclxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgLy8gbWFyZ2luLXRvcDogMTAwcHg7XHJcbn1cclxuXHJcbi5wYXJ0bmVyX3JlZ2lzdHJhdGlvbiAubG9nX2RpdiB7XHJcbiAgZmxleDogMztcclxufVxyXG5cclxuLnBhcnRuZXJfcmVnaXN0cmF0aW9uIC5tYXQtc3RlcHBlci1ob3Jpem9udGFsIHtcclxuICBib3JkZXItcmFkaXVzOiAwIDIwcHggMjBweCAwO1xyXG59XHJcblxyXG4ucGFydG5lcl9yZWdpc3RyYXRpb24gLmxvZ19tZGxfY29udCB7XHJcbiAgLy8gdG9wICAgICAgICAgICA6IDE5MHB4O1xyXG4gIHZlcnRpY2FsLWFsaWduOiB0b3A7XHJcbiAgYWxpZ24taXRlbXMgICA6IG5vcm1hbDtcclxuICAvLyBtYXgtaGVpZ2h0ICAgIDogNTUwcHg7XHJcbn1cclxuXHJcbi5wYXJ0bmVyX3JlZ2lzdHJhdGlvbiAuc2duX3NlYyB7XHJcbiAgLy8gcGFkZGluZy10b3AgOiAwO1xyXG4gIC8vIHBhZGRpbmctbGVmdDogMDtcclxuICBwYWRkaW5nOiAwIDYwcHg7XHJcbn1cclxuXHJcbi5sb2dpbl9tYWluIHtcclxuICBoZWlnaHQgICAgOiBhdXRvO1xyXG4gIC8vIGJhY2tncm91bmQ6ICNGRkY7XHJcbiAgcGFkZGluZyAgIDogMCAyMHB4IDUwcHggMjBweDtcclxufVxyXG4ucGFydG5lcl9yZWdpc3RyYXRpb257XHJcbiAgJi5sb2dpbl9tYWluIHtcclxuICAgIC8vIGhlaWdodDogYXV0bztcclxuICAgIHBhZGRpbmcgICA6IDUwcHggMjBweDtcclxuICB9XHJcbn1cclxuXHJcblxyXG5cclxuQG1lZGlhIChtYXgtd2lkdGg6IDE2MDBweCkge1xyXG4gIC5sb2dfbWRsX2NvbnQge1xyXG4gICAgbGVmdCA6IDA7XHJcbiAgICByaWdodDogMFxyXG4gIH1cclxufVxyXG5cclxuQG1lZGlhIChtYXgtd2lkdGg6IDEyODBweCkge1xyXG4gIC8vIC5sb2dfbWRsX2NvbnQge1xyXG4gIC8vICAgbGVmdDogNSU7XHJcbiAgLy8gfVxyXG59XHJcblxyXG5AbWVkaWEgKG1heC13aWR0aDogMTEwMHB4KSB7XHJcbiAgLnBhcnRuZXJfcmVnaXN0cmF0aW9uIC5wYXJ0bmVyX2luZm97XHJcbiAgICBib3JkZXItcmFkaXVzOiAyMHB4O1xyXG4gIH1cclxuICAubG9nb19pbWcge1xyXG4gICAgd2lkdGggICAgIDogMTAwJTtcclxuICAgIGJvcmRlciAgICA6IDA7XHJcbiAgICBoZWlnaHQgICAgOiBhdXRvO1xyXG4gICAgbWFyZ2luLXRvcDogNDBweDtcclxuICB9XHJcblxyXG4gIC5sb2dfbWRsX2NvbnQge1xyXG4gICAgZGlzcGxheSA6IGJsb2NrO1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gICAgLy8gd2lkdGggICA6IDgwJTtcclxuICAgIHRvcCAgICAgOiBhdXRvO1xyXG4gICAgbGVmdCAgICA6IGF1dG87XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbi1yZXZlcnNlO1xyXG4gICAgcm93LWdhcDogMjBweDtcclxuICB9XHJcblxyXG4gIC53bGNtX2hkIHtcclxuICAgIHRleHQtYWxpZ246IGxlZnQ7XHJcbiAgfVxyXG5cclxuICAubG9nX2RpdiB7XHJcbiAgICBtYXJnaW4gIDogMCBhdXRvO1xyXG4gICAgdG9wICAgICA6IDEwJTtcclxuICAgIGJvdHRvbSAgOiAwO1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gICAgbGVmdCAgICA6IDA7XHJcbiAgICByaWdodCAgIDogMDtcclxuICB9XHJcblxyXG4gIC5wYXJ0bmVyX3JlZ2lzdHJhdGlvbiAubG9nX2RpdiB7XHJcbiAgICBwb3NpdGlvbjogc3RhdGljO1xyXG4gICAgdG9wICAgICA6IGF1dG87XHJcbiAgfVxyXG4gIC5wYXJ0bmVyX3JlZ2lzdHJhdGlvbiAubWF0LXN0ZXBwZXItaG9yaXpvbnRhbCB7XHJcbiAgICBib3JkZXItcmFkaXVzOiAwIDAgMjBweCAyMHB4O1xyXG4gIH1cclxufVxyXG5cclxuQG1lZGlhIChtYXgtd2lkdGg6IDc2N3B4KSB7XHJcbiAgLmxvZ2luX2J0bnN7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbi1yZXZlcnNlO1xyXG4gICAgbWF4LXdpZHRoOiAzMDBweDtcclxuICAgIG1hcmdpbjogYXV0bztcclxuICB9XHJcbiAgLmxvZ19tZGxfY29udCB7XHJcbiAgICB3aWR0aCAgICAgICAgIDogMTAwJTtcclxuICAgIHBhZGRpbmctYm90dG9tOiAxNXB4O1xyXG4gIH1cclxuICAuc2NsX2xnbnMge1xyXG4gICAgbGVmdCAgICAgICA6IGF1dG87XHJcbiAgICByaWdodCAgICAgIDogYXV0bztcclxuICAgIHRvcCAgICAgICAgOiAyMHB4O1xyXG4gICAgYm9yZGVyLXRvcCA6IDFweCBzb2xpZCAjZmZmO1xyXG4gICAgcGFkZGluZy10b3A6IDIwcHg7XHJcbiAgICBwb3NpdGlvbiAgIDogcmVsYXRpdmU7XHJcbiAgfVxyXG5cclxuICAuc2NsX2xnbnMgZGl2IHtcclxuICAgIHdpZHRoOiBhdXRvO1xyXG4gIH1cclxuXHJcbiAgLmxvZ19kaXYge1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgfVxyXG5cclxuICAubG9naW5fbWFpbiB7XHJcbiAgICAvLyBoZWlnaHQgICAgOiAxMDAlO1xyXG4gICAgLy8gYmFja2dyb3VuZDogI0ZGRjtcclxuICAgIHBhZGRpbmcgICA6IDAgMjBweDtcclxuICB9XHJcblxyXG4gIC5zZ25fc2VjIHtcclxuICAgIHBhZGRpbmc6IDMwcHggMTVweDtcclxuICB9XHJcblxyXG4gIC5sZ25fYnRuIHtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gIH1cclxuXHJcbiAgLmZyZ3Rfc2VjIHtcclxuICAgIGRpc3BsYXkgICA6IGlubGluZS1ibG9jaztcclxuICAgIG1hcmdpbi10b3A6IDBweDtcclxuICB9XHJcblxyXG4gIC5mcmd0X3NlYyBhIHtcclxuICAgIHdpZHRoICAgICA6IDEwMCU7XHJcbiAgICBkaXNwbGF5ICAgOiBpbmxpbmUtYmxvY2s7XHJcbiAgICBtYXJnaW4tdG9wOiAxMnB4O1xyXG4gIH1cclxuXHJcbiAgLmxvZ29faW1nIGltZyB7XHJcbiAgICBtYXJnaW4tcmlnaHQ6IDI1cHg7XHJcbiAgfVxyXG5cclxuICAud2xjbV9oZCB7XHJcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgfVxyXG59Il19 */"] });


/***/ })

}]);
//# sourceMappingURL=auth-auth-module.js.map