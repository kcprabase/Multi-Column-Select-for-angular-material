import { Component, Input, OnInit, EventEmitter, Output,
   ViewChild, OnDestroy, forwardRef, AfterViewInit, ElementRef } from '@angular/core';
import { MatTableDataSource } from "@angular/material";
import { SelectionModel } from "@angular/cdk/collections";
import { ControlValueAccessor, NG_VALUE_ACCESSOR,
   NG_VALIDATORS, FormControl, AbstractControl } from '@angular/forms';


@Component({
  selector: 'multi-column-select',
  templateUrl: './multi-column-select.component.html',
  styleUrls: ['./multi-column-select.component.css'],
    providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiColumnSelectComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useValue: (c: FormControl) => {
        let err = {
          required: {
            given: c.value,
            message: "This field is required"
          }
        };

        if (c.validator) {
          const validator = c.validator({} as AbstractControl);
          if (validator && validator.required) {
           // req.required = true;
            return (c.value == null || c.value == undefined) ? err : null;
          }
        }
        return null;
      },
      multi: true
    }
  ]
})
export class MultiColumnSelectComponent implements ControlValueAccessor, OnInit, OnDestroy {

  @ViewChild('searchInput') searchInput: any;
  @ViewChild('zsContainer') container: ElementRef;

  rows: MatTableDataSource<any>;
  displayWith: any;
  selectedId: any = [];
  selectedName: any = [];
  ngModelSelected: any[];
  displayedColumns: any;
  hiddenColumns: any[];
  //inputText: string = ''; //for ngModel
  selection: SelectionModel<any>;
  required: boolean = false;
  lastSearchText: string = '';
  @Input() placeholder: string;
  @Input() columns: any[] = [];
  @Input() disabled: boolean = false;
  @Input() validationJson: any;
  @Input() multiple: boolean;
  @Input() closeOnSelect: boolean = true;
  @Input() nameField: string;
  @Input() valueField: string;
  @Input() floatLabel: string = "auto";
  @Input() emitKeyUp: boolean = false;
  //@Input() value: any;

  /**
    * required: data array must have id in first column and name in second
  */
  @Input('options')
  set val(val: any[]) {
    this.updateTable(val);
  };

  @Output() onTextEnter = new EventEmitter<string>();
  @Output() selectEvent = new EventEmitter<any>();
  @Output() keyUp = new EventEmitter<any>();
  @Output() zenSelectInit = new EventEmitter<any>();

  private allowPropagate: boolean = false;

  constructor(
  ) {
    this.hiddenColumns = ["selected"];
    this.selection = new SelectionModel<any>(false, []);
  }

  ngOnInit(): void {
    if (this.multiple) {
      this.selection = new SelectionModel<any>(this.multiple, []);
    }
    this.selectedValuesToArray();
    this.selection.onChange.subscribe(data => {
      this.selectedValuesToArray();
      this.selectEvent.emit(this.selection.selected);
    });
    if (this.container.nativeElement.parentElement.hasAttribute("required"))
      this.required = true;

    this.zenSelectInit.emit(this);
  }

  //------------------------------------------------ Control value accessor
  propagateChange = (_: any) => { };
  onTouched = (_: boolean) => { };

  writeValue(obj: any): void {
    if (obj !== undefined) {
      if (obj == null) {
        this.selection.clear();
        return;
      }
      if (!this.multiple) {
        obj = [obj];
      }
      if (this.rows && this.rows.data && this.rows.data.length > 0) {
        const sel = this.rows.data.filter(x => obj.includes(x[this.valueField]));
        sel.map(r => {
          this.selection.select(r);
        })
      }
      else {
        this.ngModelSelected = obj;
      }
      //   const sel = this._rows.find(x => x[this.valueField] == obj);
      //   this.selection.select(sel);
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  //------------------------------------------------ Control value accessor

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.rows.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.rows.data.forEach(row => this.selection.select(row));
    //   this.manageSelectEvent();
  }

  clear() {
    this.allowPropagate = true;
    this.searchInput.nativeElement.value = "";
    this.selection.clear();
    this.selectedValuesToArray();
  }

  erase() { }

  getData(searchText) {
    if ((this.rows.filteredData && this.rows.filteredData.length > 0) || searchText == '' || searchText == this.lastSearchText) {
      this.lastSearchText = searchText;
      return;
    }

      this.onTextEnter.emit(searchText);

    this.lastSearchText = searchText;
  }

  updateTable(val) {
    //   this._rows = val;
    if (val == null || val.length == 0 || val.constructor !== Array) {

      this.selectedId = []; this.selectedName = [];
      //  return; //commented this return  and the followng if statement converted to else if to remove data if null

    } else if (val) {
      if (this.columns.length == 0) {
        this.columns = Object.getOwnPropertyNames(val[0]);
      }

      if (!this.valueField)
        this.valueField = this.columns[0];
      if (!this.nameField)
        this.nameField = this.columns[1];
     
      //this.hiddenColumns.push(this.columns[0]);
      this.hiddenColumns.push(this.valueField);

      this.displayedColumns = this.multiple ? ["select"].concat(this.columns) : this.columns;

      val.map(r => {
        if (r.selected) {
          this.selection.select(r);
        }
      });

      if (this.ngModelSelected && this.ngModelSelected.length > 0) {
        const sel = val.filter(x => this.ngModelSelected.includes(x[this.valueField]));
        sel.map(r => {
          this.selection.select(r);
        })
        this.ngModelSelected = [];
      }
    } else {
      this.columns = null;
    }

    this.rows = new MatTableDataSource(val);
  }

  onSelect(row, $event?) {
    this.allowPropagate = true;
    //if (this.inputText != this.lastSearchText)
    //  return;
    if ($event && !$event.hasOwnProperty("checked") && (this.multiple || !this.closeOnSelect)) {
      $event.stopPropagation();
    }
    if (this.multiple)
      this.selection.toggle(row); //important do not delete.
    else
      this.selection.select(row);
    // this.selection.select($event.option.value); //this is used for optionSelected of MatAutoComplete. Update: Event not used now.. so commented.

    this.searchInput.nativeElement.value = "";

  }

  selectedValuesToArray() {

    //is already handled by selection.onChange defined in ngOninit. delete this when being sure that this is not needed
    this.selectedId = this.getPropertyArray(this.selection.selected, this.valueField);// this.columns[0]);
    this.selectedName = this.getPropertyArray(this.selection.selected, this.nameField);// this.columns[1]);
    //this.selectEvent.emit(this.selection.selected);
    if (this.selectedName.includes(this.searchInput.nativeElement.value))
      this.searchInput.nativeElement.value = '';
    //if multiple.... set selectedName = ['firstValue', 'and count-1 more...']
    if (this.multiple && this.selectedName.length > 1) this.selectedName = [this.selectedName[0], 'and ' + (this.selectedName.length - 1) + ' more...'];
    if (this.allowPropagate) this.propagateChange(this.multiple ? this.selectedId : this.selectedId[0]);//this should propagate value as array only if multiple = true
  }

    /**
 * Being used. dont delete
 * @param objArray [{id:1, name:"name1"},{id:2, name:"name2"},{id:3, name:"name3"}]
 * @param property "id"
 * returns: [1,2,3]
 */
getPropertyArray(objArray, property) {

  if (property == null) return [];
  let arr = [];
  objArray.map(x => {
    arr.push(x[property]);
  })
  return arr;
}

  filter(text) {
    this.rows.filter = text.trim();
    if (this.emitKeyUp)
      this.keyUp.emit(text);
  }

  onBlur() {
    this.onTouched(true);
  }

  isHiddenColumn(col) {
    if (this.hiddenColumns.includes(col))
      return true;
    return false;
  }

  ngOnDestroy(): void {
  }
}
