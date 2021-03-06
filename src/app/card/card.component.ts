import { Component, ElementRef, OnInit, ViewChild, Output, EventEmitter, Input, SimpleChanges, SimpleChange } from '@angular/core';
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

  private _userInput: string = ""

  set userInput(v: string) {
    this._userInput = v;
    this.checkIsWriting()
  }

  get userInput() {
    return this._userInput
  }

  given: string = ""
  mot: Mot | null = null;
  prefix = ""
  selectedVoice: SpeechSynthesisVoice | null = null
  validation: boolean = false

  @Input()
  article: "unune" | "lela" | null = null

  //@ViewChild('answerInput', { static: true }) answerInput!: MatInput;
  @ViewChild('answerInput') answerInput!: ElementRef;


  @Output()
  isWriting = new EventEmitter<boolean>();

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

  ngOnChanges(changes: SimpleChanges) {

    const article: SimpleChange = changes["article"];

    if (!article.firstChange) {
      this.play()
    }

  }

  newWord(mot: Mot) {
    console.log("newWord" + mot.mot)
    this.mot = mot;
    this.prefix = ""
    this.userInput = "";
    console.log(this.answerInput)

    this.given = "";
    this.validation = false;

    window.speechSynthesis.cancel()
    this.play()
    this.focusInput()
    this.checkIsWriting()
  }

  focusInput() {
    setTimeout(() => {
      this.answerInput.nativeElement.focus();
      console.log("this.answerInput.focus(); ")
    }, 250)
  }

  validate(): void {
    console.log("validate")

    //setting given triggers validation
    this.given = this.userInput
    this.validation = true
    this.focusInput()
    this.checkIsWriting()
  }

  checkIsWriting() {
    if (this.userInput.trim().length == 0) {
      this.emitIsWriting(false)
    } else {
      if (this.validation) {
        this.emitIsWriting(false)
      } else {
        this.emitIsWriting(true)
      }
    }
  }

  private _writingState: boolean | null = null
  private emitIsWriting(writingState: boolean) {
    if (this._writingState !== writingState) {
      this._writingState = writingState
      this.isWriting.emit(this._writingState)
    }
  }

  rePlay() {
    this.play();
    this.focusInput()
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
        text = this.apostrophe(mot.mot, false)
        break;
      case "NF":
        text = this.apostrophe(mot.mot, true)
        break;
      case "ADJ":
        text = this.adjective(mot)
        break
      default:
        text = mot.mot
    }

    return text
  }

  private adjective(mot: Mot): string {

    let text = ""
    switch (mot.genre) {
      case "FEM":
        this.prefix = "<i>adjectif f??minin</i>"
        break;
      case "MAS":
        this.prefix = "<i>adjectif masculin</i>"
        break;
      default:
        this.prefix = ""
    }

    return mot.mot;
  }

  private apostrophe(mot: string, feminin: boolean) {
    let text = ""
    if (this.article == "unune") {
      let determinant = feminin ? "une" : "un"
      this.prefix = determinant + " "
    } else {
      let determinant = feminin ? "la" : "le"

      let premiereLettre = mot.charAt(0)

      if (/[a????????????e????????i????????o??????????u????????y????????A????????????E????????I????????O??????????U????????Y????]/.test(premiereLettre)) {
        this.prefix = "l'"
      } else {
        this.prefix = determinant + " "
      }
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

