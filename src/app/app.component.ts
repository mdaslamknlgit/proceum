import { Component, Input } from '@angular/core';
import { NgWhiteboardService  } from 'ng-whiteboard';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  	whtbrdsts = 'none';
  	@Input() color: string = "#000";
	@Input() backgroundColor: string = 'transparent';
	@Input() size: string = "2px";
	//@Input() linejoin: 'miter' | 'round' | 'bevel' | 'miter-clip' | 'arcs';
	//@Input() linecap: 'butt' | 'square' | 'round';
	public main_div_height = 0;
	public main_div_width = 0;
	constructor(private toastr: ToastrService, private whiteboardService: NgWhiteboardService) {}
	ngOnInit() {
		var elmnt = document.getElementById("main_div");
		this.main_div_height = elmnt.scrollHeight;
		this.main_div_width = elmnt.scrollWidth;
	}
	tglwbrd(){
		if(this.whtbrdsts == 'none')
		{
			var elmnt = document.getElementById("main_div");
			this.main_div_height = elmnt.scrollHeight;
			this.main_div_width = elmnt.scrollWidth;
			this.whtbrdsts = 'block'
		}
		else{
			this.whtbrdsts = 'none';
		}
	}
	erase() {
		this.whiteboardService.erase();
		this.toastr.success('Clear!');
	}
	setSize(size) {
		this.size = size;
	}
	save() {
		this.whiteboardService.save();
	}
		undo() {
	this.whiteboardService.undo();
	}
	redo() {
		this.whiteboardService.redo();
	}
}
