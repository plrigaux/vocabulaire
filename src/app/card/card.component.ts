import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Mot } from '../vocabulaire/vocabulaireInterfaces';

/** Error when invalid control is dirty, touched, or submitted. */

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  userInput: string = ""
  given: string = ""
  mot: Mot | null = null;
  prefix = ""

  frenchVoices: SpeechSynthesisVoice[] = []
  selectedVoice: SpeechSynthesisVoice | null = null
  voices: SpeechSynthesisVoice[] = []
  validation: boolean = false

  //pitch: number = 1
  volume: number = 100

  //@ViewChild('answerInput', { static: true }) answerInput!: MatInput;
  @ViewChild('answerInput') answerInput!: ElementRef;


  readonly pitchMin = 0
  readonly pitchMax = 2
  pitch = 1
  
  readonly rateMin = 0.1
  readonly rateMax = 10
  rate = 1



  constructor() { // Injecting the ReactiveForms FormBuilder.

  }

  changePitch(newPitch : number) {
    this.pitch = newPitch
  }
 
  changeRate(newRate : number) {
    this.rate = newRate
  }

  changeVolume(volume : number) {
    this.volume = volume
  }

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
    this.prefix = ""
    this.userInput = "";
    console.log(this.answerInput)
    setTimeout(() => {
      this.answerInput.nativeElement.focus();
      console.log("    this.answerInput.focus(); ")
    }, 250)

    this.given = "";
    this.validation = false;
    window.speechSynthesis.cancel()
    this.play()
  }

  private listVoices() {
    console.log("list voices")
    this.voices = speechSynthesis.getVoices();

    this.voices.forEach(voice => {

      //console.log(voice.name)

      if (voice.lang.startsWith("fr")) {
        this.frenchVoices.push(voice);
      }
    });

    if (this.frenchVoices.length > 0) {
      this.setVoice(this.frenchVoices[0])
    }
  }

  setVoice(voice: SpeechSynthesisVoice) {
    this.selectedVoice = voice;
  }

  validate(): void {
    console.log("validate")

    this.given = this.userInput
    this.validation = true
  }

  play() {
    if (this.mot) {

      let text = this.generateText(this.mot)

      let to_speak = new SpeechSynthesisUtterance(text);

      if (this.selectedVoice) {
        to_speak.voice = this.selectedVoice
      }

      to_speak.pitch = this.pitch
      to_speak.rate = this.rate
      to_speak.volume = this.volume / 100


      window.speechSynthesis.speak(to_speak);
    }
  }

  private generateText(mot: Mot): string {
    let text = ""
    switch (mot.classe) {
      case "NM":
        text = this.apostrophe("le", mot.mot)
        break;
      case "NF":
        text = this.apostrophe("la", mot.mot)
        break;
      default:
        text = mot.mot
    }

    return text
  }

  private apostrophe(determinant: string, mot: string) {
    let premiereLettre = mot.charAt(0)

    let text = ""
    if (/[aáàâäãåeéèêëiíìîïoóòôöõuúùûüyýÿæœÁÀÂÄÃÅÉÈÊËÍÌÎÏÓÒÔÖÕÚÙÛÜÝŸ]/.test(premiereLettre)) {
      this.prefix = "l'"
    } else {
      this.prefix = determinant + " "
    }

    text = this.prefix + mot
    return text
  }

  getMot(): string {
    return this.mot ? this.mot.mot : ""
  }

  validationDisable(): boolean {
    return this.userInput === '' || this.mot == null
  }

  playDisable(): boolean {
    return this.mot == null
  }
}

