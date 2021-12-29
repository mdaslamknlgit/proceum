import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-curriculam',
    templateUrl: './curriculam.component.html',
    styleUrls: ['./curriculam.component.scss'],
})
export class CurriculamComponent implements OnInit {
    pageSizeOptions = environment.page_size_options;
    public is_list_loading = false;
    displayedColumns: string[] = ['id', 'name', 'created_at', 'updated_at', 'actions', 'status'];
    view_model_status = false;
    public curriculum_name = '';
    public steps = ['step_' + 0];
    public step_flags = {'step_0':''};
    public selected_step_flags = [];
    public items = [{flag:"Subject", value: "subject"}, {flag:"Chapter", value: "chapter"}, {flag:"Topic", value: "topic"}, {flag:"Sub Topic", value: "sub_topic"}]
    public curriculum_id = '';
    dataSource = new MatTableDataSource();
    @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    public page = 0;
    public model_status = false;
    public edit_model_status = false;
    popoverTitle = '';
    popoverMessage = '';
    confirmClicked = false;
    cancelClicked = false;
    search_text = '';
    duplicate_error = false;
    duplicate_error_value = '';
    public course_usage = 1;
    public exam_template = 1;
    public active_tab_index = 0;
    public tab_title = "Course";
    //public qbank_type = '';
    constructor(private http: CommonService, public toster: ToastrService, private route: Router, public translate: TranslateService) {
        this.translate.setDefaultLang(this.http.lang);
    }
    ngOnInit(): void {
        //this.step_flags['step_0'] = '0';
        this.getCurriculums();
    }
    drop(event: CdkDragDrop < string[] > ) {
        alert();
        moveItemInArray(
            this.displayedColumns,
            event.previousIndex,
            event.currentIndex
        );
    }
    getCurriculums() {
        this.is_list_loading = false;
        this.dataSource = new MatTableDataSource([]);
        let param = {
            url: 'get-courses',
            usage_type: this.course_usage
        };
        this.http.post(param).subscribe((res) => {
            this.is_list_loading = true;
            if (res['error'] == false) {
                this.dataSource = new MatTableDataSource(res['data']['curriculums']);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            } else {
                this.toster.info(res['message'], 'Info');
            }
        });
    }
    switchTab(event) {
        this.active_tab_index = event.index;
        if (this.active_tab_index == 0) {
            this.tab_title = "Course";
            this.course_usage = 1;
            this.getCurriculums();
        } else {
            this.tab_title = "QBank";
            this.course_usage = 2;
            this.getCurriculums();
        }
    }
    toggleModel() {
        this.model_status = !this.model_status;
        this.steps = ['step_' + 0];
        this.step_flags = {'step_0':''};
        ( < HTMLFormElement > document.getElementById('curriculum_form')).reset();
        ( < HTMLFormElement > document.getElementById('edit_curriculum_form')).reset();
    }
    addStep() {
        let length = this.steps.length;
        this.steps.push('step_' + length);
        this.steps['step_' + length] = '';
        this.step_flags['step_' + length] = '';
    }
    setFlag(step, value, key){
        this.step_flags[step] = value;

        console.log(this.step_flags);
    }
    removeStep(i) {
        this.steps.splice(i, 1);
        this.step_flags['step_' + i] = '';
    }
    checkDuplicate(this_value, step) {
        let arr = this.steps;
        this.duplicate_error_value = '';
        this.duplicate_error = false;
        arr.forEach((val) => {
            if (
                arr[val] == this_value &&
                this_value != null &&
                this_value != '' &&
                val != step
            ) {
                this.duplicate_error = true;
                this.duplicate_error_value = this_value;
            } else {}
        });
        if (this.duplicate_error) {
            //this.toster.error('Duplicate Level names not allowed', 'Error');
        }
    }
    resetDuplicates(step) {
        this.steps[step] = '';
        this.duplicate_error_value = '';
        this.duplicate_error = false;
    }
    createCurriculum() {
        if (this.duplicate_error) {
            this.toster.error('Duplicate Level names not allowed');
            return false;
        }
        let steps = [];
        this.steps.forEach((step) => {
            steps.push(this.steps[step]);
        });
        let param = {
            url: 'curriculum',
            curriculum_name: this.curriculum_name,
            usage_type: this.course_usage,
            curriculum_steps: steps,
            flags: this.step_flags,
            exam_template: this.exam_template
            //qbank_type: this.qbank_type
        };
        this.http.post(param).subscribe((res) => {
            if (res['error'] == false) {
                this.toster.success(res['message'], 'Success', {
                    closeButton: true
                });
                this.steps = ['step_' + 0];
                this.toggleModel();
                this.getCurriculums();
            } else {
                let message = res['errors'] ?
                    res['errors'] :
                    res['message'];
                this.toster.error(message, 'Error', {
                    closeButton: true
                });
            }
        });
    }
    viewCurriculum(param) {
        this.view_model_status = !this.view_model_status;
    }
    editCurriculum(param) {
        this.duplicate_error = false;
        this.edit_model_status = !this.edit_model_status;
        this.curriculum_name = param['name'];
        this.exam_template = param['exam_template'];
        //this.qbank_type = param['qbank_type'];
        this.course_usage = param['usage_type'];
        this.curriculum_id = param['id'];
        param['url'] = 'curriculum/get-steps/' + this.curriculum_id;
        this.http.get(param).subscribe((res) => {
            if (res['error'] == false) {
                this.steps = [];
                res['data']['curriculum_steps'].forEach((row) => {
                    let length = this.steps.length;
                    this.steps.push('step_' + length);
                    this.steps['step_' + length] = row['display_label'];
                    this.step_flags['step_' + length] = row['flag'];
                });
            }
        });
    }
    updateCurriculum() {
        if (this.duplicate_error) {
            this.toster.error('Duplicate Level names not allowed');
            return false;
        }
        let steps = [];
        this.steps.forEach((step) => {
            steps.push(this.steps[step]);
        });
        let param = {
            url: 'curriculum/' + this.curriculum_id,
            curriculum_name: this.curriculum_name,
            curriculum_steps: steps,
            usage_type: this.course_usage,
            exam_template: this.exam_template
            //qbank_type:this.qbank_type
        };
        this.http.put(param).subscribe((res) => {
            if (res['error'] == false) {
                this.toster.success(res['message'], 'Success', {
                    closeButton: true
                });
                ( < HTMLFormElement > (
                    document.getElementById('edit_curriculum_form')
                )).reset();
                this.edit_model_status = !this.edit_model_status;
                this.getCurriculums();
            } else {
                this.toster.error(res['errors'], 'Error', {
                    closeButton: true
                });
            }
        });
    }
    deleteCurriculum(curriculum_id, status) {
        status = status == 1 ? '0' : '1';
        let param = {
            url: 'curriculum-status/' + curriculum_id + '/' + status,
        };
        this.http.post(param).subscribe((res) => {
            if (res['error'] == false) {
                this.toster.success(res['message'], 'Success', {
                    closeButton: true
                });
                this.getCurriculums();
            } else {
                this.toster.error(res['message'], res['message'], {
                    closeButton: true
                });
            }
        });
    }
    public getServerData(event ? : PageEvent) {}
    public doFilter() {
        let value = this.search_text;
        this.dataSource.filter = value.trim().toLocaleLowerCase();
    }
    public navigateTo(curriculum_id) {
        let param = {
            url: 'curriculum/' + curriculum_id
        };
        this.http.get(param).subscribe((res) => {
            if (res['error'] == false) {
                this.route.navigateByUrl(
                    '/admin/curriculum/' +
                    curriculum_id +
                    '/' +
                    res['data']['result']['level_number']
                );
            }
        });
    }
}