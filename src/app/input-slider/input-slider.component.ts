import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from './errorStateMatcher';

@Component({
  selector: 'app-input-slider',
  templateUrl: './input-slider.component.html',
  styleUrls: ['./input-slider.component.scss']
})
export class InputSliderComponent implements OnInit {

  @Input()
  _min: number = 0

  @Input()
  set min(v:number|string) {
    this._min = Number(v)
  }

  get min() : number {
    return this._min
  }
  
  _max: number = 0

  @Input()
  set max(v:number|string) {
    this._max = Number(v)
  }

  get max() : number {
    return this._max
  }

  

  @Input()
  step = "1"
  

  @Input()
  label = ""

  @Output() changeValue = new EventEmitter<number>();

  @Input()
  set value(value: number | null) {
    this.formControl.setValue(value)
  }

  formControl = new FormControl(1, [Validators.required]);
  matcher = new MyErrorStateMatcher();
  constructor() { }

  ngOnInit(): void {
    this.formControl.valueChanges.subscribe(
      (newValue) => {
        if (this.formControl.errors == null) {
          this.changeValue.emit(newValue);
        }
      }
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    //console.log(changes);

    if (changes["min"]) {
      console.log("MIN");
      this.formControl.addValidators(Validators.min(this.min))
    }

    if (changes["max"]) {
      this.formControl.addValidators(Validators.max(this.max))
    }
  }
}
