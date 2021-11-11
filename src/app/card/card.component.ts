import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Mot } from '../vocabulaire/vocabulaireInterfaces';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  userInput: string = ""
  given: string = ""
  mot: Mot | null = null;

  frenchVoices: SpeechSynthesisVoice[] = []
  selectedVoice: SpeechSynthesisVoice | null = null
  validation: boolean = false

  //@ViewChild('answerInput', { static: true }) answerInput!: MatInput;
  @ViewChild('answerInput') answerInput! :ElementRef;

  constructor() { }

  ngOnInit(): void {

    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = () => {
        this.listVoices()
      }
    }
  }

  newWord(mot: Mot) {
    console.log("newWord" + mot.mot)
    this.mot = mot;
    this.userInput = "";
    console.log(this.answerInput)
    this.answerInput.nativeElement.focus();
    console.log("    this.answerInput.focus(); ")
    this.given = "";
    this.validation = false;
    this.play()
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

    this.given = this.userInput
    this.validation = true
  }

  play() {
    if (this.mot) {
      let to_speak = new SpeechSynthesisUtterance(this.mot.mot);

      if (this.selectedVoice) {
        to_speak.voice = this.selectedVoice
      }

      window.speechSynthesis.speak(to_speak);
    }
  }

  getMot(): string {
    return this.mot ? this.mot.mot : ""
  }
}
