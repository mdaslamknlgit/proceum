import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';

@NgModule({
  declarations: [],
  imports: [
    CommonModule, MatInputModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatTooltipModule
  ],
  exports: [
    MatInputModule , MatButtonModule, MatFormFieldModule, MatTooltipModule, MatIconModule
  ]
})
export class MaterialModule { }
