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
import themes from './vocabulaire/vocBuilder'
import { Theme } from './vocabulaire/vocabulaireInterfaces'

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
    public voiceService: VoiceControlService
  ) {}

  public readonly themes = [
    { value: 'default-theme', label: 'Default' },
    { value: 'dark-theme', label: 'Dark' },
    { value: 'light-theme', label: 'Light' },
    { value: 'deeppurple-amber', label: 'Deep Purple & Amber' },
    { value: 'indigo-pink', label: 'Indigo & Pink' },
    { value: 'pink-bluegrey', label: 'Pink & Blue-grey' },
    { value: 'purple-green', label: 'Purple & Green' },
    { value: 'candy', label: 'Pumpkin' }
  ]

  voc_themes: Theme[] = themes

  private myEventSubscriptions: Subscription[] = []
  previoustheme: string | null = null
  current_color_theme: string | null = null
  current_theme_semaine: ThemeSemaine | null = null

  ngOnInit (): void {
    this.myEventSubscriptions.push(
      this.configSrv.subscribe({
        next: (th: string) => {
          this.current_color_theme = th
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
    //console.log(`currentTheme: ${this.currentTheme}`);
    //this.currentTheme = event.value

    if (this.current_color_theme) {
      this.configSrv.next(this.current_color_theme)
      this.setTheme()
    }
  }

  menuVocThemeRadioChange (event: MatRadioChange) {
    console.warn('sem', event)

    this.current_theme_semaine = event.value
    if (this.current_theme_semaine) {
      console.warn('value', this.current_theme_semaine)
    }
  }

  setTheme () {
    if (this.previoustheme == this.current_color_theme) {
      return
    }

    if (this.previoustheme) {
      document.body.classList.remove(this.previoustheme)
    }

    if (this.current_color_theme) {
      document.body.classList.add(this.current_color_theme)
      this.previoustheme = this.current_color_theme
    }
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
    if (this.current_theme_semaine) {
      if (theme == this.current_theme_semaine.theme && semaine == this.current_theme_semaine.semaine) {
        return true
      }
    }

    return false
  }
}

interface ThemeSemaine {
  theme: number
  semaine: number
}
