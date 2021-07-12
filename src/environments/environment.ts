// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
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
  //  apiUrl: 'http://192.168.0.12:8080/api/',

  // apiUrl: 'http://192.10.250.150:8000/api/',
   // apiUrl: 'http://127.0.0.1:8000/api/',
    apiUrl: 'https://apiqa.proceum.com/api/',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
