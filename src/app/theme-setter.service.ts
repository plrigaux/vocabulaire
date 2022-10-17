import { Injectable } from '@angular/core'
import { BehaviorSubject, Subscription } from 'rxjs'

const VOC_THEME = 'VOC_THEME'

@Injectable({
  providedIn: 'root'
})
export class ThemeSetterService {
  private configSource: BehaviorSubject<string> = new BehaviorSubject('')

  constructor () {
    this.loadConfig()
    //this.configObservable = this.configSource.asObservable();
  }

  subscribe (any: any): Subscription {
    return this.configSource.subscribe(any)
  }

  unsubscribe () {
    if (this.configSource) {
      this.configSource.unsubscribe()
    }
  }

  next (theme: string) {
    this.configSource.next(theme)

    this.saveConfig(theme)
  }

  private loadConfig () {
    let storedData = localStorage.getItem(VOC_THEME)

    if (storedData) {
      this.configSource.next(storedData)
    }
  }

  private saveConfig (theme: string) {
    localStorage.setItem(VOC_THEME, theme)
  }
}
