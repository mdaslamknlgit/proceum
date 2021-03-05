import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import { NumbersonlyDirective } from '../shared/directives/numbersonly.directive';
import { AlphabetOnlyDirective } from '../shared/directives/alphabet-only.directive';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [NumbersonlyDirective, AlphabetOnlyDirective],
  imports: [
    CommonModule, MatInputModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatTooltipModule
  ],
  exports: [
    MatInputModule , MatButtonModule, MatFormFieldModule, MatTooltipModule, MatIconModule, NumbersonlyDirective, AlphabetOnlyDirective, FormsModule
  ]
})
export class MaterialModule { }
