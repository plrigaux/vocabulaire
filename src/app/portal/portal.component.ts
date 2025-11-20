import { Component, OnDestroy, OnInit } from '@angular/core'
import { Subscription } from 'rxjs'
import { AppConfig, DEFAULT_CONFIG } from '../app-config'
import { ThemeSetterService } from '../theme-setter.service'
import { VocabulaireDataHandlerService } from '../vocabulaire/vocabulaire-data-handler.service'
import { Theme } from '../vocabulaire/vocabulaireInterfaces'

@Component({
    selector: 'app-portal',
    templateUrl: './portal.component.html',
    styleUrls: ['./portal.component.scss'],
    standalone: false
})
export class PortalComponent implements OnInit {
  constructor(
    private configSrv: ThemeSetterService,
    private vocSrv: VocabulaireDataHandlerService
  ) { }

  get voc_themes(): Theme[] {
    return this.vocSrv.getThemes()
  }

  private myEventSubscriptions: Subscription[] = []
  app_config: AppConfig = { ...DEFAULT_CONFIG }

  ngOnInit(): void {
    this.myEventSubscriptions.push(
      this.configSrv.subscribe({
        next: (config: AppConfig) => {
          this.app_config = config
        }
      })
    )
  }


  practice(theme_id: number | string, semaine_id: number) {
    this.app_config.theme_semaine = { theme: Number(theme_id), semaine: semaine_id }
    this.configSrv.next(this.app_config)
  }

  practice_serie(theme_id: number, serie_id: number) {
    this.app_config.theme_semaine = { theme: theme_id, serie: serie_id }
    this.configSrv.next(this.app_config)
  }
}
