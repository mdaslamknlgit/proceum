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
  ckeditor_toolbar: [
    'Heading',
    'CustomFileExporer',
    //'uploadImage',
    //'ImageInsert',
    //'AutoImage',
    'PageBreak',
    'FontBackgroundColor',
    'Alignment',
    'FontColor',
    'FontFamily',
    'FontSize',
    //'TextTransformation',
    'bold',
    'italic',
    'underline',
    'link',
    'bulletedList',
    'numberedList',
    '|',
    '|',
    //'imageUpload',
    'blockQuote',
    'insertTable',
    'undo',
    'redo',
    'MathType',
    'ChemType',
    'MediaEmbed',
    //'CKFinder',
    //'CKFinderUploadAdapter',
    'HorizontalLine',
    //'Essentials',
    'Highlight',
    //'Image',
    //'ImageCaption',
    'ImageResize',
    //'ImageStyle',
    //'ImageToolbar',
    //'List',
    //'Paragraph',
    'SpecialCharacters',
    //'Table',
    //'TableToolbar',
    //'htmlSource',
  ],
  video_types : [{name: "KPoint", value:'KPOINT'}, {name: "Youtube", value:'YOUTUBE'}],
  ORGANIZATION_TYPES : [
    {value: '1', viewValue: 'University'},
    {value: '2', viewValue: 'College'},
    {value: '3', viewValue: 'Institute'}
  ],
  DISCOUNT_TYPES: [
    {value: 1, viewValue: 'Fixed Amount'},
    {value: 2, viewValue: 'Percentage'}
  ],
  // apiUrl: 'https://apidev.proceum.com/api/',
  apiUrl: 'https://apiqa.proceum.com/api/',
  //apiUrl: 'https://apiuat.proceum.com/api/',
//   firebaseConfig : {
//     apiKey: "AIzaSyDYq_cR2oBS3VwPYpT2bqfz9v6YjEHW63k",
//     authDomain: "proceum-dev-62a30.firebaseapp.com",
//     projectId: "proceum-dev-62a30",
//     storageBucket: "proceum-dev-62a30.appspot.com",
//     messagingSenderId: "41849089517",
//     appId: "1:41849089517:web:daea02011d4e30db528be4"
//   }
//qa firebase
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
