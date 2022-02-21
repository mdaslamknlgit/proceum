export const environment = {
  production: true,
  file_upload_size: 2040,//in kb
  page_size: 10,
  page_size_options: [10, 20, 50, 100],
  liteEditorConfig: {
    editable: true,
    spellcheck: true,
    toolbarHiddenButtons: [['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'fontName', 'customClasses', 'insertImage', 'insertVideo', 'insertHorizontalRule']]
  },
  ckeditor_toolbar: ['Heading', 'CustomFileExporer', 'PageBreak', 'FontBackgroundColor', 'Alignment', 'FontColor', 'FontFamily', 'FontSize', 'bold', 'italic', 'underline', 'link', 'bulletedList', 'numberedList', '|', '|', 'blockQuote', 'insertTable', 'undo', 'redo', 'MathType', 'ChemType', 'MediaEmbed', 'HorizontalLine', 'Highlight', 'ImageResize', 'SpecialCharacters'],
  //'uploadImage', 'ImageInsert', 'AutoImage', 'TextTransformation', 'imageUpload', 'CKFinder', 'CKFinderUploadAdapter', 'Essentials', 'Image', 'ImageCaption', 'ImageStyle', 'ImageToolbar', 'List', 'Paragraph', 'Table', 'TableToolbar', 'htmlSource'
  video_types: [{ name: "KPoint", value: 'KPOINT' }, { name: "Youtube", value: 'YOUTUBE' }/*, { name: "App Squadz", value: "APP_SQUADZ"}, { name: "Video Cipher", value: "VIDEO_CIPHER"}*/],
  ORGANIZATION_TYPES: [
    { value: '1', viewValue: 'University' },
    {value: '2', viewValue: 'College'},
    { value: '3', viewValue: 'Institute' }
  ],
  DISCOUNT_TYPES: [
    { value: 1, viewValue: 'Fixed Amount' },
    { value: 2, viewValue: 'Percentage' }
  ],
  PROCEUM_ADMIN_SPECIFIC_ROLES: {
    SUPER_ADMIN: 1,
    ADMIN: 13, //This role comes under above role
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
  DISABLED_USER_ROLES_FOR_ORGANIZATION: [1,3,4,5,6,7],
  
  //apiUrl: 'https://apidev.proceum.com/api/',
  //apiUrl: 'https://apiqa.proceum.com/api/',
  apiUrl: 'https://dev.medvizz3d.com/web-api/public/api/',
  //apiUrl: 'https://uat.proceum.com/web-api/public/api/',
  APP_BASE_URL: 'http://dev.medvizz3d.com/',
  //APP_BASE_URL: 'http://uat.proceum.com/',
  firebaseConfig: {
    apiKey: "AIzaSyBSuwf5lz04-nZEPjXUCW6W41FgD3v8hvE",
    authDomain: "proceum-qa-34a1f.firebaseapp.com",
    projectId: "proceum-qa-34a1f",
    storageBucket: "proceum-qa-34a1f.appspot.com",
    messagingSenderId: "1050534849110",
    appId: "1:1050534849110:web:942b6b83ec40e05c9669f7"
  },
  /* 
* Below array used to check domian or subdomian from in app users or partners 
*/
  INAPP_DOMAINS_ARRAY: ["localhost", "dev", "uat", "master"],
  PACKAGE_DEFAULT_IMG: '../../../assets/images/out-story-img.jpeg',
}
