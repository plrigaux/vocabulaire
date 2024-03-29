import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
  Input,
  SimpleChanges,
  SimpleChange
} from '@angular/core'
import { Mot, MotGenre, MotNombre, MotTI } from '../vocabulaire/vocabulaireInterfaces'
import { MatDialog as MatDialog } from '@angular/material/dialog'
import {
  VoiceControlComponent,
  VolumeDialogData
} from '../voice-control/voice-control.component'
import { VoiceControlService } from '../voice-control/voice-control.service'
import { MatSnackBar as MatSnackBar } from '@angular/material/snack-bar'


/** Error when invalid control is dirty, touched, or submitted. */

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  private _userInput: string = ''

  set userInput(v: string) {
    this._userInput = v
    this.checkIsWriting()
  }

  get userInput() {
    return this._userInput
  }

  given: string = ''
  mot: MotTI | null = null
  _prefix = ''
  selectedVoice: SpeechSynthesisVoice | null = null
  validation: boolean = false


  @Input()
  article: 'unune' | 'lela' | null = null

  //@ViewChild('answerInput', { static: true }) answerInput!: MatInput;
  @ViewChild('answerInput') answerInput!: ElementRef

  @Output()
  isWriting = new EventEmitter<boolean>()

  showIndice = false

  constructor(
    public dialog: MatDialog,
    public voiceService: VoiceControlService,
    private _snackBar: MatSnackBar
  ) { }

  get prefix(): string {
    return this._prefix
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(VoiceControlComponent, {
      width: '350px'
    })

    dialogRef.afterClosed().subscribe((result: VolumeDialogData) => {
      console.log('The dialog was closed')
    })
  }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges) {
    const article: SimpleChange = changes['article']

    if (!article.firstChange) {
      this.play()
    }
  }

  newWord(mot: MotTI) {
    console.log('newWord', mot)
    this.mot = mot
    this._prefix = ''
    this.userInput = ''
    console.log(this.answerInput)

    this.given = ''
    this.validation = false

    window.speechSynthesis.cancel()
    this.play()
    this.focusInput()
    this.checkIsWriting()
    this.successHasBeenPraise = false
  }

  focusInput() {
    setTimeout(() => {
      this.answerInput.nativeElement.focus()
      console.log('this.answerInput.focus(); ')
    }, 250)
  }

  validate(): void {
    console.log('validate')

    //setting given triggers validation
    this.given = this.userInput
    this.validation = true
    //this.focusInput()
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
    this.play()
    this.focusInput()
  }

  play() {
    if (this.mot) {
      let text = this.generateText(this.mot)
      this.voiceService.play(text)
    }
  }

  private generateText(mot: MotTI): string {
    let text = ''
    let cls = Array.isArray(mot.classe) ? mot.classe[0] : mot.classe
    switch (cls) {
      case 'NOM':
        text = this.apostrophe(mot.mot, mot.genre, mot.nombre)
        break
      case 'ADJ':
        text = this.adjective(mot)
        break
      case 'V':
        text = mot.mot
        this._prefix = '<i>verbe</i>'
        break
      default:
        text = mot.mot
    }

    return text
  }

  private adjective(mot: MotTI): string {
    switch (mot.genre) {
      case MotGenre.FEMININ:
        this._prefix = '<i>adjectif féminin'

        if (MotNombre.PLURIEL == mot.nombre) {
          this._prefix += ' pluriel'
        }

        this._prefix += '</i>'
        break
      case MotGenre.MASCULIN:
        this._prefix = '<i>adjectif masculin</i>'
        break
      default:
        this._prefix = '<i>adjectif</i>'
    }

    return mot.mot
  }

  voyelRegEx = /[aáàâäãåeéèêëiíìîïoóòôöõuúùûüyýÿæœAÁÀÂÄÃÅEÉÈÊËIÍÌÎÏOÓÒÔÖÕUÚÙÛÜYÝŸ]/

  private apostrophe(mot: string, genre: MotGenre, nombre: MotNombre) {
    let text = ''
    const feminin = genre == MotGenre.FEMININ || genre == MotGenre.EPICENE
    if (this.article == ARTICE_INDET) {
      let determinant = feminin ? 'une' : 'un'
      if (nombre == MotNombre.PLURIEL) {
        determinant = "des"
      }
      this._prefix = determinant + ' '
    } else {
      let determinant = feminin ? 'la' : 'le'
      let premiereLettre = mot.charAt(0)

      if (nombre == MotNombre.PLURIEL) {
        determinant = "les"
        premiereLettre = 'b' //not a voyelle
      }

      if (
        this.voyelRegEx.test(
          premiereLettre
        )
      ) {
        this._prefix = "l'"
      } else {
        this._prefix = determinant + ' '
      }
    }

    text = this._prefix + mot
    return text
  }

  getMot(): string[] {
    if (!this.mot) {
      return []
    }

    const list_mots: string[] = [this.mot.mot]
    if (this.mot.alt) {
      list_mots.push(this.mot.alt)
    }
    return list_mots
  }

  getIndice(): string {
    return this.mot?.indice ? this.mot.indice : ''
  }

  validationDisable(): boolean {
    return this.userInput === '' || this.mot == null
  }

  playDisable(): boolean {
    return this.mot == null
  }

  successHasBeenPraise = false
  handleSucces(success: boolean) {
    if (!this.successHasBeenPraise && success && this.validation) {
      this.successHasBeenPraise = true
      this._snackBar.open('Bravo!', '', {
        duration: 2 * 1000
      })
    }
  }

  showIndiceToggle($event: MouseEvent) {
    console.log($event)
    this.showIndice = this.showIndice ? false : true
  }
}

const ARTICE_INDET = 'unune' 
