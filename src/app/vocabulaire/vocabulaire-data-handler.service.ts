import { Injectable } from '@angular/core'
import { Semaine, Theme } from './vocabulaireInterfaces'
import JSON5 from 'json5'

@Injectable({
  providedIn: 'root'
})
export class VocabulaireDataHandlerService {
  private themes: Theme[] = []
  private themes_map: Map<number | string, Theme> = new Map()
  private themes_semaine_map: Map<string, Semaine> = new Map()

  private fetcher: Promise<void>
  constructor () {
    this.fetcher = Promise.all([
      this.getVocabularyAsset('./assets/voc4_th1.json5'),
      this.getVocabularyAsset('./assets/voc4_th2.json5'),
      this.getVocabularyAsset('./assets/voc4_th3.json5'),
      this.getVocabularyAsset('./assets/voc4_th4.json5')
    ])
      .then(data => {
        data.forEach(inData => {
          if (Array.isArray(inData)) {
            inData.forEach(ininData => {
              this.themes.push(ininData)
            })
          } else {
            this.themes.push(inData)
          }
        })
        console.log(this.themes)
        return this.themes
      })
      .then((themes: Theme[]) => {
        for (let t of themes) {
          const t_id: number | string = t.theme
          this.themes_map.set(t_id, t)
          if (t.semaines) {
            const semaines = t.semaines as Semaine[]
            for (let s of semaines) {
              this.themes_semaine_map.set(`${t_id}_${s.semaine}`, s)
            }
          }
        }
      })
      .then(() => {
        console.log('loading finnished')
      })
  }

  getThemes (): Theme[] {
    return this.themes
  }

  private getVocabularyAsset = (file: string): Promise<any> => {
    return fetch(file)
      .then(response => response.text())
      .then(text => {
        // Do something with your data
        //console.log(text)
        let data: any = JSON5.parse(text)
        //console.log(data)
        return data
      })
      .catch(console.error)
  }

  async getThemeById (theme_id: number | string): Promise<Theme | undefined> {
    return this.fetcher.then(() => {
      console.log('getThemeById', theme_id)
      return this.themes_map.get(theme_id)
    })
  }

  async getSemaineById (
    theme: Theme,
    semaine_id: number
  ): Promise<Semaine | undefined> {
    return this.fetcher.then(() => {
      console.log('getSemaineById', theme.theme, semaine_id)
      return this.themes_semaine_map.get(`${theme.theme}_${semaine_id}`)
    })
  }
}
