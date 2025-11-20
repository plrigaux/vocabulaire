import { Component, OnInit } from '@angular/core'
import vocabulaire from '../../resources/vocabulaire.json'
import stValentin from '../../resources/themes1.json'
import { Mot, MotGenre, MotNombre, MotTI, Theme } from './vocabulaireInterfaces'
import { VocabulaireDataHandlerService } from './vocabulaire-data-handler.service'
import { ThemeSetterService } from '../theme-setter.service'
import { AppConfig, DEFAULT_CONFIG } from '../app-config'

@Component({
    selector: 'app-vocabulaire',
    templateUrl: './vocabulaire.component.html',
    styleUrls: ['./vocabulaire.component.scss'],
    standalone: false
})
export class VocabulaireComponent implements OnInit {
  app_config: AppConfig = DEFAULT_CONFIG
  step: number | null = null

  constructor(
    private configSrv: ThemeSetterService,
    private vocSrv: VocabulaireDataHandlerService
  ) { }

  setStep(index: number | null) {
    this.step = index
  }

  get themes(): Theme[] {
    return this.vocSrv.getThemes()
  }
  ngOnInit(): void {
    this.configSrv.subscribe({
      next: async (config: AppConfig) => {
        this.app_config = config
        console.log('NEW CARD', config)
      }
    })
  }

  getType(mot: MotTI): string {
    return `${this.get_classe_label(mot)} ${this.getGenre(mot)} ${this.getNombre(mot)}`
  }

  get_classe_label(mot: MotTI): string {
    let classe_label = ''
    if (Array.isArray(mot.classe)) {
      //console.log('Claase array', mot)
      for (let c of mot.classe) {
        if (classe_label) {
          classe_label += ", "
        }
        classe_label += this.getClasseDetail(c, mot)
      }
    } else {
      classe_label = this.getClasseDetail(mot.classe, mot)
    }

    return classe_label
  }

  getClasseDetail(classe: string, mot: MotTI): string {
    let cls: string
    switch (classe) {
      case 'V':
        cls = 'Verbe'
        break
      case 'ADJ':
        cls = 'Adjectif'
        break
      case 'N':
      case 'NOM':
        cls = 'Nom'
        break
      case 'INV':
        cls = 'Mot invariable'
        break
      case 'DET':
        cls = 'Déterminant'
        break
      case 'PRON':
        cls = 'Pronom'
        break
      case 'ADV':
        cls = 'Adverbe'
        break
      case 'PREP':
        cls = 'Préposition'
        break
      case 'CONJ':
        cls = 'Conjonction'
        break
        
      default:
        console.warn('getClasseDetail not found: "', classe, "\"|", mot.mot, mot)
        cls = ''
    }

    return cls
  }

  getGenre(mot: MotTI): string {
    let genre
    switch (mot.genre) {
      case MotGenre.FEMININ:
        genre = 'Féminin'
        break
      case MotGenre.MASCULIN:
        genre = 'Masculin'
        break
      case MotGenre.EPICENE:
        genre = 'Masculin et Féminin'
        break
      default:
        genre = ''
    }
    return genre
  }

  getNombre(mot: MotTI): string {
    let nombre_label = ''

    if (MotNombre.PLURIEL == mot.nombre) {
      if ('NOM' == mot.classe || 'ADJ' == mot.classe) {
        nombre_label = 'Pluriel'
      }
    }
    return nombre_label
  }

  copyTheme(theme_id: number): string {
    let mots = ""


    let return_theme = this.themes.find(element => element.theme === theme_id)

    if (return_theme) {
      if (return_theme.series) {
        return_theme.series.forEach((element) => {
          element.mots.forEach(elemment_mot => {
            mots += elemment_mot.mot + "\n"
          })
        })
      }
    } else {
      console.warn("No them found for value:", theme_id)
    }

    return mots
  }


  copySerie(theme_id: number, serie_id: number): string {
    let mots = ""


    let return_theme = this.themes.find(element => element.theme === theme_id)

    if (return_theme) {
      if (return_theme.series) {
        return_theme.series.forEach((element) => {
          if (element.id === serie_id) {
            element.mots.forEach(elemment_mot => {
              mots += elemment_mot.mot + "\n"
            })
          }
        })
      }
    } else {
      console.warn("No them found for value:", theme_id)
    }

    return mots
  }
}
