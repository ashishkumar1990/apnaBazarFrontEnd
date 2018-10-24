import {Pipe, PipeTransform} from "@angular/core";
import {DomSanitizer} from "@angular/platform-browser";

let loadJsURL = function(url:string) {

    let canJsLoad = function(url:string) {
        if (!url) return false;
        let scripts = document.getElementsByTagName('script');
        for (var i = scripts.length; i--;) {
            // *td
            // better with substring or pos, make work with //
            if (scripts[i].src == url) return false;
        }
        return true;
    }


    // Load js url
    let insertJsUrl = function(url:string) {
        var script = document.createElement('script');
        script.setAttribute('src', url);
        document.body.appendChild(script);
    }

    if ( canJsLoad(url) ) {
        insertJsUrl(url)
    }
}

@Pipe({name: 'safeHtml'})
export class SafeHtmlPipe implements PipeTransform {
    constructor(private sanitized: DomSanitizer) {
    }

    transform(value: string) {
        return this.sanitized.bypassSecurityTrustHtml(value);
    }
}

@Pipe({name: 'checkScripts'})
export class CheckScriptsPipe implements PipeTransform {
    constructor(private sanitized: DomSanitizer) {
    }

    transform(value: string) {
        // [].forEach.call(this.divEl.nativeElement.querySelectorAll('script'), script => {
        //     const s = document.createElement('script')
        //     if (script.innerText) s.innerText = script.innerText
        //     if (script.src) s.src = script.src
        //     document.body.appendChild(s)
        // })
        let jsUrls = value.match(/<script[\s\S]*?>[\s\S]*?<\/script>/gi);

        if (jsUrls && jsUrls.length) {
            for (let url of jsUrls) {
                // var script = document.createElement('script');
                // // if(script && script.innerText){
                // //     script.innerText = url.innerText;
                // // }
                // script.innerHTML = "document.f1.submit();";
                // document.body.appendChild(script);
            }
        }

        return value;
    }
}
