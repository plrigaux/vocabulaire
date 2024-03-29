import { Component, OnInit, ViewChild } from '@angular/core'
import {
  Theme,
  Semaine,
  Groupe,
  MotTI,
  Serie
} from '../vocabulaire/vocabulaireInterfaces'
import { CardComponent } from '../card/card.component'

import { MatSlideToggleChange as MatSlideToggleChange } from '@angular/material/slide-toggle'
import { AppConfig, DEFAULT_CONFIG, ThemeSemaine, ThemeSerie, get_semaine_serie_id, is_serie } from '../app-config'
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
  serie: Serie | null = null
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

  constructor(
    private configSrv: ThemeSetterService,
    private vocSrv: VocabulaireDataHandlerService
  ) { }

  get themes(): Theme[] {
    return this.vocSrv.getThemes()
  }

  ngOnInit(): void {
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
        await this.onChangeSemaine(this.app_config.theme_semaine)
      }
    })
  }

  getSemaines(): Semaine[] {
    //let theme = this.themes.find( (t : Theme) => t.theme == this.theme.theme)

    if (this.theme) {
      return this.theme.semaines ?? []
    }

    return []
  }

  private shuffleArray(array: any | null = null) {
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

  private async onChangeTheme(theme_id: number | string) {
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
      this.shuffleArray(this.mots)
      this.next()
    }
  }

  private async onChangeSemaine(theme_semaine: ThemeSemaine | ThemeSerie) {
    console.log('theme_semaine', theme_semaine)

    if (!this.theme) {
      console.log('No Theme')
      return
    }

    if (is_serie(theme_semaine)) {
      const serie_id = get_semaine_serie_id(theme_semaine)
      let serie: Serie | undefined = await this.vocSrv.getSerieById(
        this.theme,
        serie_id
      )

      console.log('Serie', serie_id, serie)
      if (!serie) {
        return
      }

      if (this.serie?.id == serie_id) {
        return
      }

      this.serie = serie
      this.semaine = null
    } else {
      const semaine_id = get_semaine_serie_id(theme_semaine)
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
      this.serie = null
    }

    this.loadMots()
  }

  private loadMots() {
    if (!this.semaine && !this.serie) {
      return
    }

    this.mots = []
    this.motIndex = -1

    if (this.semaine) {
      this.semaine.groupes.forEach((group: Groupe) => {
        this.mots.push(...group.mots)
      })
    } else if (this.serie) {
      this.mots.push(...this.serie.mots)
    }
    this.next()
  }

  onChangeShuffleToggle(event: MatSlideToggleChange) {
    console.log(event)

    if (!this.shuffle) {
      this.loadMots();
      return
    }

    this.shuffleArray()
    this.motIndex = -1
    this.next()
  }

  next() {
    console.log('next - ' + this.motIndex)
    let index = this.motIndex + 1
    this.setMot(index)
    console.log('next - ' + this.motIndex)
  }

  previous() {
    let index = this.motIndex - 1
    this.setMot(index)
  }

  private setMot(index: number) {
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

  checkWritingState(isWriting: boolean) {
    console.log(`isWriting ${isWriting}`)
    this._isWriting = isWriting
  }

  prevDisabled(): boolean {
    if (this._isWriting) {
      return true
    }

    return this._prevDisabled
  }

  nextDisabled(): boolean {
    if (this._isWriting) {
      return true
    }

    return this._nextDisabled
  }

  getLabel() {
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
