import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NumbersonlyDirective } from '../shared/directives/numbersonly.directive';
import { AlphabetOnlyDirective } from '../shared/directives/alphabet-only.directive';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatBadgeModule } from '@angular/material/badge';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MatNativeDateModule } from '@angular/material/core';
import { MomentDateModule } from '@angular/material-moment-adapter';
import { MatTreeModule } from '@angular/material/tree';
import { InputTrimModule } from 'ng2-trim-directive';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import {MatStepperModule} from '@angular/material/stepper';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

@NgModule({
  declarations: [NumbersonlyDirective, AlphabetOnlyDirective],
  imports: [
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatTooltipModule,
    MatToolbarModule,
    MatSidenavModule,
    MatMenuModule,
    MatGridListModule,
    MatProgressBarModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatRadioModule,
    MatCheckboxModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatExpansionModule,
    MatBadgeModule,
    NgMultiSelectDropDownModule,
    MomentDateModule,
    MatTreeModule,
    NgxMatSelectSearchModule,
    MatStepperModule,
    MatSlideToggleModule,
  ],
  exports: [
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatIconModule,
    NumbersonlyDirective,
    AlphabetOnlyDirective,
    FormsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatMenuModule,
    MatGridListModule,
    MatProgressBarModule,
    MatListModule,
    MatCardModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatRadioModule,
    MatCheckboxModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatExpansionModule,
    MatBadgeModule,
    NgMultiSelectDropDownModule,
    MomentDateModule,
    MatTreeModule,
    InputTrimModule,
    NgxMatSelectSearchModule,
    MatStepperModule,
    MatSlideToggleModule,
  ],
})
export class MaterialModule {}
