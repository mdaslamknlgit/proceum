// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
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
    'bold',
    'italic',
    'underline',
    'link',
    'bulletedList',
    'numberedList',
    '|',
    '|',
    'blockQuote',
    'insertTable',
    'undo',
    'redo',
    'MathType',
    'ChemType',
    'MediaEmbed',
    'HorizontalLine',
    //'Essentials',
    'Highlight',
    //'Image',
    'ImageCaption',
    'ImageResize',
    //'ImageStyle',
    //'ImageToolbar',
    //'List',
    //'Paragraph',
    'SpecialCharacters',
    //'Table',
    //'TableToolbar',
    //'htmlSource',
    //'wproofreader'
  ],
  video_types : [{name: "KPoint", value:'KPOINT'}, {name: "Youtube", value:'YOUTUBE'}],
  ORGANIZATION_TYPES : [
    {value: '1', viewValue: 'University'},
    {value: '2', viewValue: 'College'},
    {value: '3', viewValue: 'Institute'}
  ],
  

   //apiUrl: 'http://192.10.250.150:8000/api/',
    // apiUrl: 'http://127.0.0.1:8000/api/',
    apiUrl: 'https://apiqa.proceum.com/api/',
    firebaseConfig : {
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
      INAPP_DOMAINS_ARRAY: ["localhost","qa","uat","dev"],
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
