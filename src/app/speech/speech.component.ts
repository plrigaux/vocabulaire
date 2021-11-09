import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-speech',
  templateUrl: './speech.component.html',
  styleUrls: ['./speech.component.scss']
})
export class SpeechComponent implements OnInit {

  constructor() { }

  voices : SpeechSynthesisVoice[] = [];
  selected : boolean = false;
  voice : string = "";

  ngOnInit(): void {
    if(typeof speechSynthesis === 'undefined') {
      console.error("no " + speechSynthesis);
    }

    this.voices = speechSynthesis.getVoices();
    console.log(this.voices)
  }

  public test() : void {
    console.log("test")
    let to_speak = new SpeechSynthesisUtterance("This is a test");

    window.speechSynthesis.speak(to_speak);
  }
}
