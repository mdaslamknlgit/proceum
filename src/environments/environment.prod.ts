export const environment = {
  production: true,
  file_upload_size: 2040,//in kb
  page_size: 10,
  page_size_options: [10, 20, 50, 100],
  ckeditor_toolbar: [
    'Heading',
    'uploadImage',
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
  // apiUrl: 'https://apidev.proceum.com/api/',
  apiUrl: 'https://apiqa.proceum.com/api/',
  //apiUrl: 'https://apiuat.proceum.com/api/',
  firebaseConfig : {
    apiKey: "AIzaSyDYq_cR2oBS3VwPYpT2bqfz9v6YjEHW63k",
    authDomain: "proceum-dev-62a30.firebaseapp.com",
    projectId: "proceum-dev-62a30",
    storageBucket: "proceum-dev-62a30.appspot.com",
    messagingSenderId: "41849089517",
    appId: "1:41849089517:web:daea02011d4e30db528be4"
  }
};
