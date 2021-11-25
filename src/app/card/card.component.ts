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
  selectedVoice: SpeechSynthesisVoice | null = null
  validation: boolean = false

  //@ViewChild('answerInput', { static: true }) answerInput!: MatInput;
  @ViewChild('answerInput') answerInput!: ElementRef;

  constructor(public dialog: MatDialog, public voiceService: VoiceControlService) {

  }

  openDialog(): void {
    const dialogRef = this.dialog.open(VoiceControlComponent, {
      width: '350px'
    });

    dialogRef.afterClosed().subscribe((result: VolumeDialogData) => {
      console.log('The dialog was closed');
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

      this.voiceService.play(text)
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

