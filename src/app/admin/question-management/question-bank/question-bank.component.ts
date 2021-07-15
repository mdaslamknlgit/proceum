import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { environment } from 'src/environments/environment';
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
  symbol1: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H', symbol1: 'H' },
];

@Component({
  selector: 'app-question-bank',
  templateUrl: './question-bank.component.html',
  styleUrls: ['./question-bank.component.scss']
})
export class QuestionBankComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'q_bank_type',
    'description',
    'no_of_questions',
    'status',
    'actions',
  ];

  page_size_options = environment.page_size_options;
  // dataSource = ELEMENT_DATA;
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  q_bank_type = '';
  q_bank_id = '';
  description = '';
  status = '';
 

  public model_status = false;
  public edit_model_status = false;
  public search_box = '';
  is_loaded = true

  constructor(
    private http: CommonService,
    public toster: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getQBanks();
  }
  getQBanks() {
    let param = { url: 'qbank' };
    this.http.get(param).subscribe((res) => {
      if (res['error'] == false) {
        this.dataSource = new MatTableDataSource(res['data']['qbanks']);
        if (this.is_loaded == true || true) {
          this.is_loaded = false;
          //alert();
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      } else {
        this.toster.error(res['message'], 'Error', { closeButton: true });
      }
    });
  }

  createQBank() {
    let param = {
      url: 'qbank',
      q_bank_type: this.q_bank_type,
      description: this.description,
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.toster.success(res['message'], 'Success', { closeButton: true });
        this.getQBanks()
        this.toggleModel();
      } else {
        let message = res['errors']['q_bank_type']
          ? res['errors']['q_bank_type']
          : res['errors'];
        this.toster.error(message, 'Error', { closeButton: true });
      }
    });
  }

  editQBank(param) {
    this.edit_model_status = !this.edit_model_status;
    this.q_bank_id = param['id'];
    this.q_bank_type = param['q_bank_type'];
    this.description = param['description'];
    this.status = param['status']
  }

  updateQBank() {
    let param = {
      url: 'qbank/' + this.q_bank_id,
      q_bank_type: this.q_bank_type,
      description: this.description,
      status: this.status

    };

    this.http.put(param).subscribe((res) => {
      if (res['error'] == false) {
        this.toster.success(res['message'], 'Success', { closeButton: true });
        this.edit_model_status = !this.edit_model_status;
        this.getQBanks();
      } else {
        let message = res['errors']['q_bank_type']
          ? res['errors']['q_bank_type']
          : res['errors'];
        this.toster.error(message, 'Error', { closeButton: true });
      }
    });
  }

  public doFilter = () => {
    let value = this.search_box;
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  };

  toggleModel() {
    this.model_status = !this.model_status;
    (<HTMLFormElement>document.getElementById('q_bank_form')).reset();
    (<HTMLFormElement>document.getElementById('q_bank_form_edit')).reset();
  }

  deleteQBank(id, status) {
    let param = {
      url: 'qbank/delete',
      id: id,
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.toster.success(res['message'], 'Success', { closeButton: true });
        this.getQBanks();
      } else {
        this.toster.error(res['message'], res['message'], {
          closeButton: true,
        });
      }
    });
  }


  statusChange(status) {
    this.status = status;
  }

  openModel(e) {
    if (e.checked == true) {
      this.status = "1";
    } else {
      this.status = "0";
    }
  }

}
