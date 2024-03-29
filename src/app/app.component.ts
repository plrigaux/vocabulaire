import { Component, OnDestroy, OnInit } from '@angular/core'
import { MatDialog as MatDialog } from '@angular/material/dialog'
import { MatRadioChange as MatRadioChange } from '@angular/material/radio'
import { Subscription } from 'rxjs'
import { ThemeSetterService } from './theme-setter.service'
import {
  VoiceControlComponent,
  VolumeDialogData
} from './voice-control/voice-control.component'
import { VoiceControlService } from './voice-control/voice-control.service'
import { Semaine, Theme } from './vocabulaire/vocabulaireInterfaces'
import {
  AppConfig,
  COLOR_THEMES,
  DEFAULT_CONFIG,
  ThemeSemaine,
  ThemeSerie,
  get_semaine_serie_id
} from './app-config'
import { VocabulaireDataHandlerService } from './vocabulaire/vocabulaire-data-handler.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'vocabulaire'
  constructor(
    private configSrv: ThemeSetterService,
    public dialog: MatDialog,
    public voiceService: VoiceControlService,
    private vocSrv: VocabulaireDataHandlerService
  ) { }

  get voc_themes(): Theme[] {
    return this.vocSrv.getThemes()
  }

  COLOR_THEMES = COLOR_THEMES

  private myEventSubscriptions: Subscription[] = []
  previoustheme: string | null = null

  app_config: AppConfig = { ...DEFAULT_CONFIG }

  ngOnInit(): void {
    this.myEventSubscriptions.push(
      this.configSrv.subscribe({
        next: (config: AppConfig) => {
          this.app_config = config
          this.setTheme()
        }
      })
    )
  }

  ngOnDestroy(): void {
    this.myEventSubscriptions.forEach(subscription =>
      subscription.unsubscribe()
    )
  }

  menuThemeRadioChange(event: MatRadioChange) {
    console.log(event)
    this.configSrv.next(this.app_config)
    this.setTheme()
  }

  menuVocThemeRadioChange(event: MatRadioChange) {
    console.warn('sem', event)
    this.app_config.theme_semaine = event.value
    this.configSrv.next(this.app_config)
  }

  setTheme() {
    if (this.previoustheme == this.app_config.color_theme) {
      return
    }

    if (this.previoustheme) {
      document.body.classList.remove(this.previoustheme)
    }

    document.body.classList.add(this.app_config.color_theme)
    this.previoustheme = this.app_config.color_theme
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(VoiceControlComponent, {
      width: '350px'
    })

    dialogRef.afterClosed().subscribe((result: VolumeDialogData) => {
      console.log('The dialog was closed')
    })
  }

  getSemaineValue(theme: number, semaine: number): ThemeSemaine {
    return { theme: theme, semaine: semaine }
  }

  getSerieValue(theme: number, id: number): ThemeSerie {
    return { theme: theme, serie: id }
  }

  isSemaineChecked(theme: number, semaine: number): boolean {
    if (this.app_config.theme_semaine) {
      if (
        theme == this.app_config.theme_semaine.theme &&
        semaine == get_semaine_serie_id(this.app_config.theme_semaine)
      ) {
        return true
      }
    }
    return false
  }

  nextTheme() {
    const curTheme = this.app_config.theme_semaine.theme
    const curSemaine =  get_semaine_serie_id(this.app_config.theme_semaine)

    let theme = this.voc_themes.find(t => t.theme == curTheme)

    if (!theme || !theme.semaines) {
      return
    }

    const semaines: Semaine[] = theme.semaines

    let semaineIndex = semaines.findIndex(s => s.semaine == curSemaine)

    if (semaineIndex < semaines.length - 1) {
      semaineIndex += 1
      this.setThemeSemaine(theme.theme, semaines[semaineIndex].semaine)
    } else {
      const themeIndex = this.voc_themes.findIndex(t => t.theme == curTheme)

      if (themeIndex < this.voc_themes.length - 1) {
        theme = this.voc_themes[themeIndex + 1]
        if (theme.semaines) {
          semaineIndex = 0
          this.setThemeSemaine(
            theme.theme,
            theme.semaines[semaineIndex].semaine
          )
        }
      }
    }
  }

  previousTheme() {
    const curTheme = this.app_config.theme_semaine.theme
    const curSemaine =  get_semaine_serie_id(this.app_config.theme_semaine)

    let theme = this.voc_themes.find(t => t.theme == curTheme)

    if (!theme || !theme.semaines || !theme.series) {
      return
    }

    const semaines: Semaine[] = theme.semaines

    let semaineIndex = semaines.findIndex(s => s.semaine == curSemaine)

    if (semaineIndex > 0) {
      semaineIndex -= 1
      this.setThemeSemaine(theme.theme, semaines[semaineIndex].semaine)
    } else {
      const themeIndex = this.voc_themes.findIndex(t => t.theme == curTheme)

      if (themeIndex > 0) {
        theme = this.voc_themes[themeIndex - 1]
        if (theme.semaines) {
          semaineIndex = theme.semaines.length - 1
          this.setThemeSemaine(
            theme.theme,
            theme.semaines[semaineIndex].semaine
          )
        }
      }
    }
  }

  setThemeSemaine(theme: number | string, semaine: number) {
    this.app_config.theme_semaine = {
      theme: theme,
      semaine: semaine
    }

    this.configSrv.next(this.app_config)
  }
}


