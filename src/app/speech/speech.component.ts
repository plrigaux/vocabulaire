import { Component, OnInit } from '@angular/core';


@Component({
    selector: 'app-speech',
    templateUrl: './speech.component.html',
    styleUrls: ['./speech.component.scss'],
    standalone: false
})
export class SpeechComponent implements OnInit {

  constructor() { }

  voices: SpeechSynthesisVoice[] = [];
  selectedVoice: string = "";
  textToSpeak : string = "Mange du caca";
  pitch : number = 1
  rate : number = 1


  ngOnInit(): void {
    if (typeof speechSynthesis === 'undefined') {
      console.error("no " + speechSynthesis);
    }

    this.voices = window.speechSynthesis.getVoices();
    console.log(this.voices)


    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = () => {
        this.listVoices()
      }
    }
  }

  private listVoices() {
    console.log("list voices")
    this.voices = speechSynthesis.getVoices();

    this.voices.forEach(voice => {

      let str: string = voice.name + ' (' + voice.lang + ')';

      if (voice.default) {
        str += ' -- DEFAULT';
        this.selectedVoice = voice.name;
      }

      console.log(str)
      console.log(voice)
    });
  }

  public test(): void {
  
    let to_speak = new SpeechSynthesisUtterance(this.textToSpeak);

    let voice: SpeechSynthesisVoice | undefined = this.voices.find(voice => voice.name == this.selectedVoice);
    if (voice) {
      to_speak.voice = voice
    }

    to_speak.rate = this.rate
    to_speak.pitch = this.pitch

    window.speechSynthesis.speak(to_speak);
  }
}
