import { Injectable } from '@angular/core'
import { BehaviorSubject, Subscription } from 'rxjs'
import { AppConfig, COLOR_THEMES, DEFAULT_CONFIG } from './app-config'

const VOC_THEME = 'VOC_THEME'

@Injectable({
  providedIn: 'root'
})
export class ThemeSetterService {
  private configSource: BehaviorSubject<AppConfig>

  constructor () {
    const default_config: AppConfig = DEFAULT_CONFIG
    this.configSource = new BehaviorSubject(default_config)
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

  next (config: AppConfig) {
    this.configSource.next(config)

    this.saveConfig(config)
  }

  private loadConfig () {
    let storedData = localStorage.getItem(VOC_THEME)

    if (storedData) {
      try {
        const config = JSON.parse(storedData) as AppConfig
        this.configSource.next(config)
      } catch (e) {
        console.warn(e)
      }
    }
  }

  private saveConfig (config: AppConfig) {
    const config_flat = JSON.stringify(config)
    localStorage.setItem(VOC_THEME, config_flat)
  }
}
