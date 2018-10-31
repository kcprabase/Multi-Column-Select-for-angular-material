import { Component, OnInit } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'multi-column-select';

  selectedId:any = 2;
  searchText:string;
  selectedObject: any;
  
  options: any = []; 

  ngOnInit(): void {
    this.options = [
      {id: 1, name:"john", gender: "male", age:20},
      {id: 2, name:"jina", gender: "female", age:22},
      {id: 3, name:"tom", gender: "male", age:23},
      {id: 4, name:"ram", gender: "male", age:24},
      {id: 5, name:"samy", gender: "female", age:25},
    ]
  }

  textEntered(e){
    this.searchText = e;
  }

  valueSelected(e){
    this.selectedObject = JSON.stringify(e);
  }
}
