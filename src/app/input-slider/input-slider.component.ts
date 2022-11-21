import { coerceNumberProperty } from '@angular/cdk/coercion';
import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormControl, UntypedFormControl, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from './errorStateMatcher';

@Component({
  selector: 'app-input-slider',
  templateUrl: './input-slider.component.html',
  styleUrls: ['./input-slider.component.scss']
})
export class InputSliderComponent implements OnInit {


  private _min: number = 0

  @Input()
  set min(v: any) {
    this._min = coerceNumberProperty(v, 0)
  }

  get min(): number {
    return this._min
  }

  private _max: number = 0

  @Input()
  set max(v: any) {
    this._max = coerceNumberProperty(v, 0)
  }

  get max(): number {
    return this._max
  }

  @Input()
  step = "1"

  @Input()
  label = ""

  @Output() changeValue = new EventEmitter<number>();

  @Input()
  set value(value: number | null) {
    let v = coerceNumberProperty(value, 0)
    this.formControl.setValue(v)
  }

  formControl = new FormControl(1, [Validators.required]);
  matcher = new MyErrorStateMatcher();
  constructor() { }

  ngOnInit(): void {
    this.formControl.valueChanges.subscribe(
      (newValue :any) => {
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
