import { Pipe, PipeTransform} from '@angular/core';
@Pipe({
    name: 'highlight'
})
export class HighlightSearch implements PipeTransform {
transform(value: any, args: any): any {
	if (!args) {return value;}
		let searchKey =  args.split(' ');
		if(searchKey.length > 0){
			searchKey.forEach((opt, index) => {
		      var reText = new RegExp(opt, 'gi');
				value = value.replace(reText, "<mark>$&</mark>");
	        })
	        return value;
		}	    
	}
}