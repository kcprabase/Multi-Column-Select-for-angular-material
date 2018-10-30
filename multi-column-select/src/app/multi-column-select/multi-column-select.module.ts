import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiColumnSelectComponent } from './multi-column-select.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatTableModule, MatCheckboxModule, MatInputModule,
    MatChipsModule, MatAutocompleteModule, MatIconModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    BrowserModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatTableModule,
    MatCheckboxModule,
    MatChipsModule,
    MatAutocompleteModule
  ],
  declarations: [    
    MultiColumnSelectComponent
  ],
  exports:[
    MultiColumnSelectComponent
  ],
  schemas:[NO_ERRORS_SCHEMA]
})
export class MultiColumnSelectModule { }
