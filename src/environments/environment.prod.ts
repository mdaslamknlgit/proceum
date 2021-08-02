export const environment = {
  production: true,
  file_upload_size: 2040,//in kb
  page_size: 10,
  page_size_options: [10, 20, 50, 100],
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
  ORGANIZATION_TYPES : [
    {value: '1', viewValue: 'University'},
    {value: '2', viewValue: 'College'},
    {value: '3', viewValue: 'Institute'}
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
    apiKey: "AIzaSyBRMnr8x3_S_LxXZgWGGFALPiwp6-lkfgU",
    authDomain: "proceum-qa.firebaseapp.com",
    projectId: "proceum-qa",
    storageBucket: "proceum-qa.appspot.com",
    messagingSenderId: "659520827468",
    appId: "1:659520827468:web:14067a9f4bd63bce9504e9"
  }
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
