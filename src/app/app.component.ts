import { Component, OnDestroy, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { MatRadioChange } from '@angular/material/radio'
import { Subscription } from 'rxjs'
import { ThemeSetterService } from './theme-setter.service'
import {
  VoiceControlComponent,
  VolumeDialogData
} from './voice-control/voice-control.component'
import { VoiceControlService } from './voice-control/voice-control.service'
import { Theme } from './vocabulaire/vocabulaireInterfaces'
import { AppConfig, COLOR_THEMES, DEFAULT_CONFIG, ThemeSemaine } from './app-config'
import { VocabulaireDataHandlerService } from './vocabulaire/vocabulaire-data-handler.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'vocabulaire'
  constructor (
    private configSrv: ThemeSetterService,
    public dialog: MatDialog,
    public voiceService: VoiceControlService,
    private vocSrv: VocabulaireDataHandlerService) {}


  get voc_themes (): Theme[] {
    return this.vocSrv.getThemes()
  }

  COLOR_THEMES = COLOR_THEMES

  private myEventSubscriptions: Subscription[] = []
  previoustheme: string | null = null

  app_config: AppConfig = { ...DEFAULT_CONFIG }

  ngOnInit (): void {
    this.myEventSubscriptions.push(
      this.configSrv.subscribe({
        next: (config: AppConfig) => {
          this.app_config = config
          this.setTheme()
        }
      })
    )
  }

  ngOnDestroy (): void {
    this.myEventSubscriptions.forEach(subscription =>
      subscription.unsubscribe()
    )
  }

  menuThemeRadioChange (event: MatRadioChange) {
    console.log(event)
    this.configSrv.next(this.app_config)
    this.setTheme()
  }

  menuVocThemeRadioChange (event: MatRadioChange) {
    console.warn('sem', event)
    this.app_config.theme_semaine = event.value
    this.configSrv.next(this.app_config)
  }

  setTheme () {
    if (this.previoustheme == this.app_config.color_theme) {
      return
    }

    if (this.previoustheme) {
      document.body.classList.remove(this.previoustheme)
    }

    document.body.classList.add(this.app_config.color_theme)
    this.previoustheme = this.app_config.color_theme
  }

  openDialog (): void {
    const dialogRef = this.dialog.open(VoiceControlComponent, {
      width: '350px'
    })

    dialogRef.afterClosed().subscribe((result: VolumeDialogData) => {
      console.log('The dialog was closed')
    })
  }

  getSemaineValue (theme: number, semaine: number): ThemeSemaine {
    return { theme: theme, semaine: semaine }
  }

  isSemaineChecked (theme: number, semaine: number): boolean {
    if (this.app_config.theme_semaine) {
      if (
        theme == this.app_config.theme_semaine.theme &&
        semaine == this.app_config.theme_semaine.semaine
      ) {
        return true
      }
    }

    return false
  }
}

