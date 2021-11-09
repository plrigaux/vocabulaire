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

  frenchVoices: SpeechSynthesisVoice[] = []
  selectedVoice: SpeechSynthesisVoice | null = null

  constructor() { }

  ngOnInit(): void {

    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = () => {
        this.listVoices()
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes)
    console.log(this.mot)

    if (this.mot) {
      let to_speak = new SpeechSynthesisUtterance(this.mot.mot);

      if (this.selectedVoice) {
        to_speak.voice = this.selectedVoice
      }

      window.speechSynthesis.speak(to_speak);
    }
  }

  private listVoices() {
    console.log("list voices")
    let voices = speechSynthesis.getVoices();

    voices.forEach(voice => {

      console.log(voice.name)

      if (voice.lang.startsWith("fr")) {
        this.frenchVoices.push(voice);
      }

      if (this.frenchVoices.length > 0) {
        this.selectedVoice = this.frenchVoices[0]
      }
    });
  }

  validate(): void {
    console.log("validate")
  }
}
