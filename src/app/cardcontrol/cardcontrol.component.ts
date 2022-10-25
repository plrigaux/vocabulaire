import { Component, OnInit, ViewChild } from '@angular/core'
import {
  Theme,
  Semaine,
  Groupe,
  Mot,
  MotTI,
  MotGenre,
  MotNombre
} from '../vocabulaire/vocabulaireInterfaces'
import { CardComponent } from '../card/card.component'

import { MatSlideToggleChange } from '@angular/material/slide-toggle'
import { AppConfig, DEFAULT_CONFIG, ThemeSemaine } from '../app-config'
import { ThemeSetterService } from '../theme-setter.service'
import { VocabulaireDataHandlerService } from '../vocabulaire/vocabulaire-data-handler.service'

@Component({
  selector: 'app-cardcontrol',
  templateUrl: './cardcontrol.component.html',
  styleUrls: ['./cardcontrol.component.scss']
})
export class CardcontrolComponent implements OnInit {
  theme: Theme | null = null
  semaine: Semaine | null = null
  groupe: Groupe | null = null
  mot: MotTI | null = null
  mots: MotTI[] = []
  motIndex: number = 0
  private _isWriting = false
  shuffle = false
  article: 'unune' | 'lela' = 'unune'

  private _prevDisabled: boolean = true
  private _nextDisabled: boolean = true
  private app_config: AppConfig = DEFAULT_CONFIG

  @ViewChild(CardComponent)
  private cardComponent!: CardComponent

  constructor (
    private configSrv: ThemeSetterService,
    private vocSrv: VocabulaireDataHandlerService
  ) {}

  get themes (): Theme[] {
    return this.vocSrv.getThemes()
  }

  ngOnInit (): void {
    console.log(
      'THS',
      this.vocSrv.getThemes(),
      this.vocSrv.getThemes().length,
      typeof this.vocSrv.getThemes(),
      this.vocSrv.getThemes().values()
    )

    this.configSrv.subscribe({
      next: async (config: AppConfig) => {
        this.app_config = config
        console.log('NEW CARD', config)
        await this.onChangeTheme(this.app_config.theme_semaine.theme)
        await this.onChangeSemaine(this.app_config.theme_semaine.semaine)
      }
    })
  }

  getSemaines (): Semaine[] {
    //let theme = this.themes.find( (t : Theme) => t.theme == this.theme.theme)

    if (this.theme) {
      return this.theme.semaines ?? []
    }

    return []
  }

  shuffleArray (array: any | null = null) {
    if (!this.shuffle) {
      return
    }

    if (!array) {
      array = this.mots
    }

    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
  }

  crunchMot (m: Mot, indice: string) {
    crunchMot(m, indice, this.mots)
  }

  private async onChangeTheme (theme_id: number | string) {
    const theme_obj = await this.vocSrv.getThemeById(theme_id)

    if (!theme_obj) {
      return
    }

    if (this.theme?.theme != theme_obj.theme) {
      this.semaine = null
    }

    this.theme = theme_obj

    if (this.theme.mots) {
      this.semaine = null
      this.mots = []
      this.motIndex = -1
      this.theme.mots.forEach(m => {
        this.crunchMot(m, '')
      })

      this.shuffleArray(this.mots)
      this.next()
    }
  }

  private async onChangeSemaine (semaine_id: number) {
    console.log('semaine_id', semaine_id)

    if (!this.theme) {
      console.log('No Theme')
      return
    }

    let sem: Semaine | undefined = await this.vocSrv.getSemaineById(
      this.theme,
      semaine_id
    )
    console.log('Sem', semaine_id, sem)
    if (!sem) {
      return
    }

    if (this.semaine?.semaine == semaine_id) {
      return
    }

    this.semaine = sem

    this.mots = []
    this.motIndex = -1
    this.semaine.groupes.forEach((group: Groupe) => {
      let indice = group.indice
      group.mots.forEach(mot => {
        this.crunchMot(mot, indice)
      })
    })
    this.next()
  }

  onChangeShuffleToggle (event: MatSlideToggleChange) {
    console.log(event)

    this.shuffleArray()
  }

  next () {
    console.log('next - ' + this.motIndex)
    let index = this.motIndex + 1
    this.setMot(index)
    console.log('next - ' + this.motIndex)
  }

  previous () {
    let index = this.motIndex - 1
    this.setMot(index)
  }

  private setMot (index: number) {
    //console.log("setMot - index " + index)
    if (index >= 0 && index < this.mots.length) {
      this.motIndex = index
      this.mot = this.mots[this.motIndex]
      //console.log("setMot - new mot " + this.motIndex + " mot " + this.mot.mot)
      this.cardComponent.newWord(this.mot)

      this._prevDisabled = false
      this._nextDisabled = false
      //console.log("setMot - index " + index)
    }

    if (index <= 0) {
      //console.log("setMot - prevDisabled " + index)
      this._prevDisabled = true
    } else if (index >= this.mots.length - 1) {
      //console.log("setMot - nextDisabled " + index)
      this._nextDisabled = true
    }
    //console.log(this)
  }

  checkWritingState (isWriting: boolean) {
    console.log(`isWriting ${isWriting}`)
    this._isWriting = isWriting
  }

  prevDisabled (): boolean {
    if (this._isWriting) {
      return true
    }

    return this._prevDisabled
  }

  nextDisabled (): boolean {
    if (this._isWriting) {
      return true
    }

    return this._nextDisabled
  }

  getLabel () {
    let label = ''

    if (this.theme) {
      label += 'Theme ' + this.theme.theme
    }

    if (this.semaine) {
      label += ' Semaine ' + this.semaine.semaine
    }

    return label
  }
}

export const createMotTI = (m: Mot, indice: string): MotTI => {
  const newMot: MotTI = {
    mot: m.mot,
    classe: m.classe,
    indice: indice,
    genre: MotGenre.NA,
    nombre: MotNombre.NA
  }

  return newMot
}

export const crunchMot = (m: Mot, indice: string, mots: MotTI[]) => {
  const newMot: MotTI = createMotTI(m, indice)
  mots.push(newMot)

  let classe: string[] = Array.isArray(m.classe) ? [...m.classe] : [m.classe]

  if (classe.length === 0) {
    console.warn("Le mot n'a pas de classe")
  }

  classe.forEach(cls => {
    if (cls == 'NM') {
      newMot.classe = 'NOM'
      newMot.genre = MotGenre.MASCULIN
    }

    if (cls == 'NF') {
      newMot.classe = 'NOM'
      newMot.genre = MotGenre.FEMININ
    }

    if (m.fem) {
      let newMot2: MotTI = createMotTI(m, indice)
      newMot2.mot = m.fem
      newMot2.genre = MotGenre.FEMININ
      newMot.genre = MotGenre.MASCULIN
      mots.push(newMot2)
    }
  })
}
