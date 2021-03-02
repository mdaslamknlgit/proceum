import { Component, OnInit } from '@angular/core';
import { from } from 'rxjs';
import { CommonService } from '../services/common.service';
@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit {
	loading: boolean;
	constructor(private loaderService: CommonService) {
		this.loaderService.isLoading.subscribe((v) => {
			this.loading = v;
		});
	}
  	ngOnInit(): void {
	}
}
