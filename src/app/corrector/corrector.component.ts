import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SequenceMatcher } from 'difflib-ts';

@Component({
  selector: 'app-corrector',
  templateUrl: './corrector.component.html',
  styleUrls: ['./corrector.component.scss']
})
export class CorrectorComponent implements OnInit, OnChanges {

  @Input()
  given: string = ""

  @Input()
  correct: string = ""

  givenElems: Truc[] = []
  correctElems: Truc[] = []


  constructor() { }

  ngOnInit(): void {
    
  }

  ngOnChanges(changes: SimpleChanges) {
    const log: string[] = [];
    for (const propName in changes) {
      const changedProp = changes[propName];
      const to = JSON.stringify(changedProp.currentValue);
      if (changedProp.isFirstChange()) {
        console.log(`Initial value of ${propName} set to ${to}`);
      } else {
        const from = JSON.stringify(changedProp.previousValue);
        console.log(`${propName} changed from ${from} to ${to}`);
      }
    }
    this.bigFunc(this.given, this.correct);
  }

  setClassGiven(elem: Truc): string {
    return elem.ok ? "typeGood" : "typeBad";
  }

  setClassCorrect(elem: Truc): string {
    return elem.ok ? "typeGood" : "typeMissed";
  }



  bigFunc(given: string, correct: string) {
    let matchingBlock = this.tokenizeComparison(given, correct)

    this.givenElems = []
    this.correctElems = []
    let givenPoint = 0
    let correctPoint = 0

    matchingBlock.forEach((line: number[]) => {
      const x = line[0]
      const y = line[1]
      const cnt = line[2]

      let offby = 0
      if (cnt && y - offby > x) {

        let obj: Truc = {
          ok: false,
          text: "-".repeat(y - x - offby)
        }

        this.givenElems.push(obj)
        offby = y - x
      }

      this.logBad(givenPoint, x, given, this.givenElems)
      this.logBad(correctPoint, y, correct, this.correctElems)
      givenPoint = x + cnt
      correctPoint = y + cnt
      // log the match
      this.logGood(x, cnt, given, this.givenElems)
      this.logGood(y, cnt, correct, this.correctElems)
    })
  }

  logBad(old: number, neww: number, s: string, array: any[]): void {
    if (old != neww) {
      let obj: Truc = {
        ok: false,
        text: s.substring(old, neww)
      }

      array.push(obj)
    }
  }

  logGood(start: number, cnt: number, s: string, array: any[]): void {
    if (cnt) {
      let obj: Truc = {
        ok: true,
        text: s.substring(start, start + cnt)
      }
      array.push(obj)
    }
  }

  tokenizeComparison(given: string, correct: string): number[][] {
    let s = new SequenceMatcher(null, given, correct)
    let mb: number[][] = s.getMatchingBlocks()
    console.log(" PIZZA")
    console.log(mb)
    return mb;
  }
}

interface Truc {
  ok: boolean,
  text: string
}