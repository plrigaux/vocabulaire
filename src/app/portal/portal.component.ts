import { Component, OnDestroy, OnInit } from '@angular/core'
import { MatRadioChange } from '@angular/material/radio'
import { Subscription } from 'rxjs'
import { ThemeSetterService } from '../theme-setter.service'

@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.scss']
})
export class PortalComponent implements OnInit, OnDestroy {
  constructor (private configSrv: ThemeSetterService) {}

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

  private myEventSubscriptions: Subscription[] = []
  previoustheme: string | null = null
  cur_theme: string | null = null

  ngOnInit(): void {
    this.myEventSubscriptions.push(this.configSrv.subscribe({
      next: (th : string) => {
        this.cur_theme = th;
        this.setTheme();
      }
    }));
  }

  ngOnDestroy(): void {
    this.myEventSubscriptions.forEach(subscription => subscription.unsubscribe());
  }

  menuThemeRadioChange (event: MatRadioChange) {
    console.log(event)
    //console.log(`currentTheme: ${this.currentTheme}`);
    //this.currentTheme = event.value

    if (this.cur_theme) {
      this.configSrv.next(this.cur_theme)
      this.setTheme()
    }
  }

  setTheme () {
    if (this.previoustheme == this.cur_theme) {
      return
    }

    if (this.previoustheme) {
      document.body.classList.remove(this.previoustheme)
    }

    if (this.cur_theme) {
      document.body.classList.add(this.cur_theme)
      this.previoustheme = this.cur_theme
    }
  }
}
