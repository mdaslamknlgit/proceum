import { Directive, HostListener, ElementRef, OnInit } from '@angular/core';
//import * as $ from '../../../assets/ckeditor/plugins/slideshow/3rdParty/jquery.min.js';
declare var $;
window['$'] = window['jQuery'] = $;
//var jQuery = $;

@Directive({ selector: '[runScripts]' })
export class RunScriptsDirective implements OnInit {
    constructor(private elementRef: ElementRef) { }
    ngOnInit(): void {
        setTimeout(() => { // wait for DOM rendering
            this.reinsertScripts();
        });
    }
    reinsertScripts(): void {
        const scripts = <HTMLScriptElement[]>this.elementRef.nativeElement.getElementsByTagName('script');
        const scriptsInitialLength = scripts.length;
        //if($.fn.jquery == undefined)
          //  return ;
            //else
            console.log(window['$'].fn.jquery, window['jQuery'].fn.jquery)
            console.log($.fn.jquery)
        for (let i = 0; i < scriptsInitialLength; i++) {
            const script = scripts[i];
            const scriptCopy = <HTMLScriptElement>document.createElement('script');
            scriptCopy.type = script.type ? script.type : 'text/javascript';
            if (script.innerHTML) {
                //console.log(script.innerHTML);
                scriptCopy.innerHTML = script.innerHTML;
            }
            else if (script.src) {
                //scriptCopy.src = script.src;                
            }
            scriptCopy.async = false;
            script.parentNode.replaceChild(scriptCopy,script);
        }
    }
}