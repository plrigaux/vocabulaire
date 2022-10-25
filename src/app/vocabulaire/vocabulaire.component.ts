import { Component, OnInit } from '@angular/core'
import vocabulaire from '../../resources/vocabulaire.json'
import stValentin from '../../resources/themes1.json'
import { Mot, MotGenre, MotTI, Theme } from './vocabulaireInterfaces'
import { VocabulaireDataHandlerService } from './vocabulaire-data-handler.service'
import { ThemeSetterService } from '../theme-setter.service'
import { AppConfig, DEFAULT_CONFIG } from '../app-config'
import { crunchMot } from '../cardcontrol/cardcontrol.component'

@Component({
  selector: 'app-vocabulaire',
  templateUrl: './vocabulaire.component.html',
  styleUrls: ['./vocabulaire.component.scss']
})
export class VocabulaireComponent implements OnInit {
  app_config: AppConfig = DEFAULT_CONFIG

  get themes (): Theme[] {
    return this.vocSrv.getThemes()
  }

  constructor (
    private configSrv: ThemeSetterService,
    private vocSrv: VocabulaireDataHandlerService
  ) {}

  ngOnInit (): void {
    this.configSrv.subscribe({
      next: async (config: AppConfig) => {
        this.app_config = config
        console.log('NEW CARD', config)
      }
    })
  }

  getTransformedMot (mots: Mot[]): MotTI[] {
    const transformedMots: MotTI[] = []

    for (let m of mots) {
      crunchMot(m, '', transformedMots)
    }

    return transformedMots
  }

  getGenre (mot: MotTI): string {
    let genre
    switch (mot.genre) {
      case MotGenre.FEMININ:
        genre = 'FEMININ'
        break
      case MotGenre.MASCULIN:
        genre = 'MASCULIN'
        break
      default:
        genre = ''
    }
    return genre
  }
}
