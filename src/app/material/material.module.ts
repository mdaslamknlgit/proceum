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
import { MatCheckboxModule} from '@angular/material/checkbox';
import { MatListModule} from '@angular/material/list';
import { MatCardModule} from '@angular/material/card';
import { MatTabsModule} from '@angular/material/tabs';
import { MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';

@NgModule({
  declarations: [NumbersonlyDirective, AlphabetOnlyDirective],
  imports: [
    CommonModule, MatInputModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatTooltipModule, MatToolbarModule, MatSidenavModule,MatMenuModule,
    MatGridListModule, MatProgressBarModule, MatTabsModule, MatCheckboxModule, MatRadioModule, MatSelectModule
  ],
  exports: [
    MatInputModule , MatButtonModule, MatFormFieldModule, MatTooltipModule, MatIconModule, NumbersonlyDirective, AlphabetOnlyDirective, FormsModule, MatToolbarModule, MatSidenavModule,
    MatMenuModule, MatGridListModule, MatProgressBarModule,MatListModule, MatCardModule, MatTabsModule, MatCheckboxModule, MatRadioModule, MatSelectModule
    ]
})
export class MaterialModule { }
