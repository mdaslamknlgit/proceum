// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  file_upload_size: 2040,//in kb
  page_size: 10,
  page_size_options: [10, 20, 50, 100],
  liteEditorConfig: {
    editable: true,
    spellcheck: true,
    toolbarHiddenButtons: [['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'fontName', 'customClasses', 'insertImage', 'insertVideo', 'insertHorizontalRule']]
  },
  ckeditor_toolbar: ['Heading', 'CustomFileExporer', 'PageBreak', 'FontBackgroundColor', 'Alignment', 'FontColor', 'FontFamily', 'FontSize', 'bold', 'italic', 'underline', 'link', 'bulletedList', 'numberedList', '|', '|', 'blockQuote', 'insertTable', 'undo', 'redo', 'MathType', 'ChemType', 'MediaEmbed', 'HorizontalLine', 'Highlight', 'ImageResize', 'SpecialCharacters'],
  //'uploadImage', 'ImageInsert', 'AutoImage', 'TextTransformation', 'imageUpload', 'CKFinder', 'CKFinderUploadAdapter', 'Essentials', 'Image', 'ImageCaption', 'ImageStyle', 'ImageToolbar', 'List', 'Paragraph', 'Table', 'TableToolbar', 'htmlSource',
  video_types: [{ name: "KPoint", value: 'KPOINT' }, { name: "Youtube", value: 'YOUTUBE' }],
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

  DISABLED_USER_ROLES_FOR_PROCEUM: [2],
  DISABLED_USER_ROLES_FOR_ORGANIZATION: [1, 3, 4, 5, 6, 7],
  
<<<<<<< HEAD
  // apiUrl: 'http://192.10.250.150:8000/api/',
  //apiUrl: 'http://127.0.0.1:8000/api/',
   // apiUrl: 'https://dev.medvizz3d.com/web-api/public/api/',
    apiUrl: 'https://apiqa.proceum.com/api/',
=======
   apiUrl: 'http://192.10.250.150:8000/api/',
  //apiUrl: 'http://127.0.0.1:8000/api/',
  ///apiUrl: 'https://dev.medvizz3d.com/web-api/public/api/',
>>>>>>> 714717358610d0eddfdc371b8c4c217861af7837

  APP_BASE_URL: 'http://localhost:4200/',
  // APP_BASE_URL: 'http://192.10.250.150:4200/',

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
  INAPP_DOMAINS_ARRAY: ["localhost", "dev", "master", "192.10.250.150"],
  PACKAGE_DEFAULT_IMG: '../../../assets/images/out-story-img.jpeg',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
  // import 'zone.js/dist/zone-error';  // Included with Angular CLI.
