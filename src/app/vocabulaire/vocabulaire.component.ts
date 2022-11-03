import { Component, OnInit } from '@angular/core'
import vocabulaire from '../../resources/vocabulaire.json'
import stValentin from '../../resources/themes1.json'
import { Mot, MotGenre, MotTI, Theme } from './vocabulaireInterfaces'
import { VocabulaireDataHandlerService } from './vocabulaire-data-handler.service'
import { ThemeSetterService } from '../theme-setter.service'
import { AppConfig, DEFAULT_CONFIG } from '../app-config'

@Component({
  selector: 'app-vocabulaire',
  templateUrl: './vocabulaire.component.html',
  styleUrls: ['./vocabulaire.component.scss']
})
export class VocabulaireComponent implements OnInit {
  app_config: AppConfig = DEFAULT_CONFIG
  step: number | null = null

  constructor (
    private configSrv: ThemeSetterService,
    private vocSrv: VocabulaireDataHandlerService
  ) {}

  setStep (index: number | null) {
    this.step = index
  }

  get themes (): Theme[] {
    return this.vocSrv.getThemes()
  }
  ngOnInit (): void {
    this.configSrv.subscribe({
      next: async (config: AppConfig) => {
        this.app_config = config
        console.log('NEW CARD', config)
      }
    })
  }

  getType (mot: MotTI): string {
    return `${this.getClasse(mot)} ${this.getGenre(mot)}`
  }

  getClasse (mot: MotTI): string {
    let classe = ''
    if (Array.isArray(mot.classe)) {
    } else {
      classe = this.getClasseDetail(mot.classe)
    }

    return classe
  }

  getClasseDetail (classe: string): string {
    let cls: string
    switch (classe) {
      case 'V':
        cls = 'Verbe'
        break
      case 'ADJ':
        cls = 'Adjectif'
        break
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

      default:
        console.warn("getClasseDetail not found:", classe)
        cls = ''
    }

    return cls
  }

  getGenre (mot: MotTI): string {
    let genre
    switch (mot.genre) {
      case MotGenre.FEMININ:
        genre = 'Féminin'
        break
      case MotGenre.MASCULIN:
        genre = 'Masculin'
        break
      default:
        genre = ''
    }
    return genre
  }
}
