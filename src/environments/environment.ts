// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

let api_url = 'http://192.10.250.150:8000/api/';

export const environment = {
  production: false,
  file_upload_size: 512000,//in kb
  page_size: 10,
  page_size_options: [10, 20, 50, 100],
  editor_url:'/assets/ckeditor/ckeditor.js',
  editor_config: {
    toolbar_Full :
    [
        ['Source','-','Save','NewPage','Preview','-','Templates'],
        ['Cut','Copy','Paste','PasteText','PasteFromWord','-','Print', 'SpellChecker', 'Scayt'],
        ['Undo','Redo','-','Find','Replace','-','SelectAll','RemoveFormat'],
        //['Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField'],
        ['Bold','Italic','Underline','Strike','-','Subscript','Superscript'],
        '/',
        ['NumberedList','BulletedList','-','Outdent','Indent','Blockquote'],
        ['JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock'],
        ['Link','Unlink','Anchor'],
        ['Image','Flash','Table','HorizontalRule','Smiley','SpecialChar','PageBreak'],
        '/',
        ['Styles','Format','Font','FontSize'],
        ['TextColor','BGColor'],
        ['Maximize', 'ShowBlocks','-']
    ],
    allowedContent : true,
    //extraAllowedContent: "h3{clear};h2{line-height};h2 h3{margin-left,margin-top};mathElements.join( ' ' ) + '(*)[*]{*};img[data-mathml,data-custom-editor,role](Wirisformula)'",
    extraPlugins: 'print,format,font,colorbutton,justify,uploadimage,slideshow,ckeditor_wiris',
    uploadUrl: api_url+'upload-files',
    // Configure your file manager integration. This example uses CKFinder 3 for PHP.
    filebrowserImageBrowseUrl: '/assets/ckeditor/plugins/ckfinder/samples/full-page-open.html?command=GetFiles&lang=en&type=Images&currentFolder=/images/content_images/',
    filebrowserImageUploadUrl: api_url+'upload-files',
    height: 560,
    //removeDialogTabs: 'image:advanced;link:advanced',
    removeButtons: 'Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,Save,NewPage,Print,SetLanguage,ShowBlocks,AboutCKEditor4'
  },
  lang: "https://s3.ap-south-1.amazonaws.com/assets.proceum.com/lang_flags/4x3/",
  liteEditorConfig: {
    editable: true,
    spellcheck: true,
    toolbarHiddenButtons: [['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'fontName', 'customClasses', 'insertImage', 'insertVideo', 'insertHorizontalRule']]
  },
  video_types: [{ name: "kPoint", value: 'KPOINT',img:'../../../assets/images/kpoint_k.png' }, { name: "YouTube", value: 'YOUTUBE',img:'../../../assets/images/youtube.png' }, { name: "AppSquadz", value: "APP_SQUADZ",img:'../../../assets/images/app-squadz.png'}, { name: "VdoCipher", value: "VDO_CIPHER",img:'../../../assets/images/video-cipher.png'}],
  ORGANIZATION_TYPES: [
    { value: '1', viewValue: 'University' },
    { value: '2', viewValue: 'College' },
    { value: '3', viewValue: 'Institute' }
  ],
  DISCOUNT_TYPES: [
    { value: 1, viewValue: 'Fixed Amount' },
    { value: 2, viewValue: 'Percentage' }
  ],

  PROCEUM_ADMIN_SPECIFIC_ROLES: {
    SUPER_ADMIN: 1,
    ADMIN: 13, //This role comes under SUPER_ADMIN
  },

  PARTNER_ADMIN_SPECIFIC_ROLES: {
    UNIVERSITY_ADMIN: 8,
    COLLEGE_ADMIN: 9,
    INSTITUTE_ADMIN: 10,
    UNIVERSITY_COLLEGE_ADMIN: 14,
  },

  ALL_ADMIN_SPECIFIC_ROLES: {
    SUPER_ADMIN: 1,
    ADMIN: 13,
    UNIVERSITY_ADMIN: 8,
    COLLEGE_ADMIN: 9,
    INSTITUTE_ADMIN: 10,
    UNIVERSITY_COLLEGE_ADMIN: 14,
  },

  ALL_ROLES: {
    SUPER_ADMIN: 1,
    STUDENT: 2,
    CONTENT_EDITOR: 3,
    REVIEWER_1: 4,
    REVIEWER_2: 5,
    REVIEWER_3: 6,
    APPROVER: 7,
    UNIVERSITY_ADMIN: 8,
    COLLEGE_ADMIN: 9,
    INSTITUTE_ADMIN: 10,
    INDIVIDUAL: 11,
    TEACHER: 12,
    UNIVERSITY_COLLEGE_ADMIN: 14,
  },
  CONTENT_USER_ROLES:[3,4,5,6,7,13],
  DISABLED_USER_ROLES_FOR_PROCEUM: [2,12],
  DISABLED_USER_ROLES_FOR_ORGANIZATION: [1, 3, 4, 5, 6, 7],

    apiUrl: api_url,
  //apiUrl: 'http://127.0.0.1:8000/api/',
   //apiUrl: 'https://dev.medvizz3d.com/web-api/public/api/',
  // apiUrl: 'https://uat.proceum.com/web-api/public/api/',
  // apiUrl: 'https://apiqa.proceum.com/api/',

  APP_BASE_URL: 'http://localhost:4200/',
   //APP_BASE_URL: 'http://192.10.250.150:4200/',

firebaseConfig: {
    apiKey: "AIzaSyDYq_cR2oBS3VwPYpT2bqfz9v6YjEHW63k",
    authDomain: "proceum-dev-62a30.firebaseapp.com",
    projectId: "proceum-dev-62a30",
    storageBucket: "proceum-dev-62a30.appspot.com",
    messagingSenderId: "41849089517",
    appId: "1:41849089517:web:daea02011d4e30db528be4"
  },

  /*
  * Below array used to check domian or subdomian from in app users or partners
  */
  INAPP_DOMAINS_ARRAY: ["localhost", "dev", "master", "192", "uat", "rmu"],
  PACKAGE_DEFAULT_IMG: '../../../assets/images/out-story-img.jpeg',

  /* Change based on dev or uat (hhtp or https) */
  SSL_ORIGIN: 'https',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
  // import 'zone.js/dist/zone-error';  // Included with Angular CLI.
