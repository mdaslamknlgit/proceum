import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafePipe } from './pipes/safe.pipe';
import { MaterialModule } from '../material/material.module';
import { CalculatorComponent } from './calculator/calculator.component';


@NgModule({
  declarations: [SafePipe, CalculatorComponent],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports:[SafePipe,MaterialModule, CalculatorComponent]
})
export class SharedModule { }
