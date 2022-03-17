let api_url = 'https://uat.proceum.com/web-api/public/api/';
export const environment = {
  production: true,
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
    extraAllowedContent: "h3{clear};h2{line-height};h2 h3{margin-left,margin-top};mathElements.join( ' ' ) + '(*)[*]{*};img[data-mathml,data-custom-editor,role](Wirisformula)'",
    // Adding drag and drop image upload.
    extraPlugins: 'print,format,font,colorbutton,justify,uploadimage,slideshow,ckeditor_wiris',
    uploadUrl: api_url+'upload-files',
    // Configure your file manager integration. This example uses CKFinder 3 for PHP.
    filebrowserImageBrowseUrl: '/assets/ckeditor/plugins/ckfinder/samples/full-page-open.html?command=GetFiles&lang=en&type=Images&currentFolder=/images/content_images/',
    filebrowserImageUploadUrl: api_url+'upload-files',
    height: 560,
    //removeDialogTabs: 'image:advanced;link:advanced',
    //removeButtons: 'PasteFromWord'
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
  CONTENT_USER_ROLES:[3,4,5,6,7],
  DISABLED_USER_ROLES_FOR_PROCEUM: [2],
  DISABLED_USER_ROLES_FOR_ORGANIZATION: [1,3,4,5,6,7],

  apiUrl: api_url,
  APP_BASE_URL: 'http://uat.proceum.com/',
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

  /* Change based on dev or uat (http or https) */
  SSL_ORIGIN: 'http',
}
