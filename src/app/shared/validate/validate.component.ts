import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {AbstractControl, FormControl} from "@angular/forms";

@Component({
  selector: 'app-validate',
  templateUrl: './validate.component.html',
  styleUrls: ['./validate.component.scss']
})
export class ValidateComponent implements OnInit, OnChanges {
  @Input() formName!: FormControl;
  @Input() message: any;
  @Input() checkSearch?: string;
  @Input() AttrValue ?:string;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }


  ngOnInit(): void {
  }

}
