import { Component, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'student-root',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss'],
})

export class StudentComponent {
  constructor(private router: Router) {}
  ngOnInit() {}
}
