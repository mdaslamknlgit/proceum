export const environment = {
  production: true,
  file_upload_size: 2040,//in kb
  page_size: 10,
  page_size_options: [10, 20, 50, 100],
  liteEditorConfig : {
    editable: true,
    spellcheck: true,
    toolbarHiddenButtons: [['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'fontName', 'customClasses', 'insertImage', 'insertVideo', 'insertHorizontalRule']]  
    },
  ckeditor_toolbar: ['Heading', 'CustomFileExporer', 'PageBreak', 'FontBackgroundColor', 'Alignment', 'FontColor', 'FontFamily', 'FontSize', 'bold', 'italic', 'underline', 'link', 'bulletedList', 'numberedList', '|', '|', 'blockQuote', 'insertTable', 'undo', 'redo', 'MathType', 'ChemType', 'MediaEmbed', 'HorizontalLine', 'Highlight', 'ImageResize', 'SpecialCharacters'],
    //'uploadImage', 'ImageInsert', 'AutoImage', 'TextTransformation', 'imageUpload', 'CKFinder', 'CKFinderUploadAdapter', 'Essentials', 'Image', 'ImageCaption', 'ImageStyle', 'ImageToolbar', 'List', 'Paragraph', 'Table', 'TableToolbar', 'htmlSource'
  video_types : [{name: "KPoint", value:'KPOINT'}, {name: "Youtube", value:'YOUTUBE'}],
  ORGANIZATION_TYPES : [
    {value: '1', viewValue: 'University'},
    //{value: '2', viewValue: 'College'},
    {value: '3', viewValue: 'Institute'}
  ],
  DISCOUNT_TYPES: [
    {value: 1, viewValue: 'Fixed Amount'},
    {value: 2, viewValue: 'Percentage'}
  ],
  PROCEUM_ADMIN_SPECIFIC_ROLES : {
    SUPER_ADMIN : 1,
    ADMIN : 13, //This role comes under above role
  },

  PARTNER_ADMIN_SPECIFIC_ROLES : {
    UNIVERSITY_ADMIN : 8,
    COLLEGE_ADMIN : 9,
    INSTITUTE_ADMIN : 10,
    PARTNER_ADMIN : 14, //This role comes under above of 3 roles
  },
  
  ALL_ADMIN_SPECIFIC_ROLES : {
    SUPER_ADMIN : 1,
    ADMIN : 13,
    UNIVERSITY_ADMIN : 8,
    COLLEGE_ADMIN : 9,
    INSTITUTE_ADMIN : 10,
    PARTNER_ADMIN : 14,
  },
   //apiUrl: 'https://apidev.proceum.com/api/',
  //apiUrl: 'https://apiqa.proceum.com/api/',
  apiUrl: 'https://dev.medvizz3d.com/web-api/public/api/',
  //apiUrl: 'https://apiuat.proceum.com/api/',

firebaseConfig : {
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
    INAPP_DOMAINS_ARRAY: ["localhost","qa","uat","dev"],
    PACKAGE_DEFAULT_IMG: '../../../assets/images/out-story-img.jpeg',
  //uat firebase
//   firebaseConfig : {
//     apiKey: "AIzaSyDM_Q8stJkIGWMqZvvGW8MDp0nS8i_zgqg",
//     authDomain: "proceum-5b71c.firebaseapp.com",
//     projectId: "proceum-5b71c",
//     storageBucket: "proceum-5b71c.appspot.com",
//     messagingSenderId: "730854299639",
//     appId: "1:730854299639:web:223a73ba74a9c7bcee80f2"
//   }
};
