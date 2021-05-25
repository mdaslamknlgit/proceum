import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';

const ELEMENT_DATA = [
  {
    sno: 1,
    Volume: 'UG MED VOL -1',
    Subject: 'Human anatomy',
    Chapter: 'N/A',
    Topic: 'Anatomical terminology',
    SubTopic: 'Demonstrate Positions & movements in human body',
    Actions: 'test',
  },
  {
    sno: 1,
    Volume: 'UG MED VOL -1',
    Subject: 'Human anatomy',
    Chapter: 'N/A',
    Topic: 'Anatomical terminology',
    SubTopic: 'Demonstrate Positions & movements in human body',
    Actions: 'test',
  },
  {
    sno: 1,
    Volume: 'UG MED VOL -1',
    Subject: 'Human anatomy',
    Chapter: 'N/A',
    Topic: 'Anatomical terminology',
    SubTopic: 'Demonstrate Positions & movements in human body',
    Actions: 'test',
  },
  {
    sno: 1,
    Volume: 'UG MED VOL -1',
    Subject: 'Human anatomy',
    Chapter: 'N/A',
    Topic: 'Anatomical terminology',
    SubTopic: 'Demonstrate Positions & movements in human body',
    Actions: 'test',
  },
  {
    sno: 1,
    Volume: 'UG MED VOL -1',
    Subject: 'Human anatomy',
    Chapter: 'N/A',
    Topic: 'Anatomical terminology',
    SubTopic: 'Demonstrate Positions & movements in human body',
    Actions: 'test',
  },
];
@Component({
  selector: 'app-maping',
  templateUrl: './maping.component.html',
  styleUrls: ['./maping.component.scss'],
})
export class MapingComponent implements OnInit {
  displayedColumns: string[] = [
    'sno',
    'Volume',
    'Subject',
    'Chapter',
    'Topic',
    'SubTopic',
    'Actions',
  ];
  dataSource = ELEMENT_DATA;

  modal_popup = false;
  constructor(private http: CommonService) {}

  ngOnInit(): void {
    let param = { url: 'get-content-list' };
  }
  openModal() {
    this.modal_popup = true;
  }
  closeModal() {
    this.modal_popup = false;
  }
}
