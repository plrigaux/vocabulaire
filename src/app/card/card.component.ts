import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Mot } from '../vocabulaire/vocabulaireInterfaces';
import { MatDialog } from '@angular/material/dialog';
import { VoiceControlComponent, VolumeDialogData } from '../voice-control/voice-control.component';
import { VoiceControlService } from '../voice-control/voice-control.service';

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

  //frenchVoices: SpeechSynthesisVoice[] = []
  selectedVoice: SpeechSynthesisVoice | null = null
  //voices: SpeechSynthesisVoice[] = []
  validation: boolean = false

  //pitch: number = 1
  volume: number = 100

  //@ViewChild('answerInput', { static: true }) answerInput!: MatInput;
  @ViewChild('answerInput') answerInput!: ElementRef;

  private pitch = 1
  private rate = 1

  constructor(public dialog: MatDialog, public voiceService: VoiceControlService) {

  }

  openDialog(): void {


    let voiceData: VolumeDialogData = {
      pitch: this.pitch,
      rate: this.rate,
      volume: this.volume,
      selectedVoice: this.selectedVoice
    }
    const dialogRef = this.dialog.open(VoiceControlComponent, {
      width: '350px',
      data: voiceData,
    });

    dialogRef.afterClosed().subscribe((result: VolumeDialogData) => {
      console.log('The dialog was closed');
      console.log(result);
      if (result) {
        this.pitch = result.pitch;
        this.rate = result.rate;
        this.volume = result.volume;
        this.selectedVoice = result.selectedVoice;
      }
    });
  }

  ngOnInit(): void {

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
      } else {
        this.selectedVoice = this.voiceService.getSelectedVoice()
        if (this.selectedVoice) {
          to_speak.voice = this.selectedVoice
        }
      }

      to_speak.pitch = this.pitch
      to_speak.rate = this.rate
      to_speak.volume = this.volume / 100


      window.speechSynthesis.speak(to_speak);
    }
  }

  private generateText(mot: Mot): string {
    let text = ""
    let cls = Array.isArray(mot.classe) ? mot.classe[0] : mot.classe
    switch (cls) {
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

  getIndice(): string {
    return this.mot?.indice ? this.mot.indice : ""
  }

  validationDisable(): boolean {
    return this.userInput === '' || this.mot == null
  }

  playDisable(): boolean {
    return this.mot == null
  }
}

