import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafePipe } from './pipes/safe.pipe';
import { MaterialModule } from '../material/material.module';
import { CalculatorComponent } from './calculator/calculator.component';
import { TranslateCompiler, TranslateLoader, TranslateModule } from '@ngx-translate/core';  
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
    return new TranslateHttpLoader(http);
}
const shared_modules = [MaterialModule, TranslateModule.forRoot({
    loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
    }
})];
@NgModule({
  declarations: [SafePipe, CalculatorComponent],
  imports: shared_modules,
  exports:[SafePipe,MaterialModule, CalculatorComponent, TranslateModule]
})
export class SharedModule { }
