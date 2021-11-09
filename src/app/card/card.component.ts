import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Mot } from '../vocabulaire/vocabulaireInterfaces';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  value: string = ""

  @Input()
  mot: Mot | null = null;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes)
    console.log(this.mot)

    if (this.mot) {
      let to_speak = new SpeechSynthesisUtterance(this.mot.mot);

      window.speechSynthesis.speak(to_speak);
    }
  }
}
