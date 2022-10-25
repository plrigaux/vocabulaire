import { Injectable } from '@angular/core'
import {
  Mot,
  MotGenre,
  MotNombre,
  MotTI,
  Semaine,
  Theme
} from './vocabulaireInterfaces'
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
      this.getVocabularyAsset('./assets/voc4_th4.json5'),
      this.getVocabularyAsset('./assets/voc4_th5.json5'),
      this.getVocabularyAsset('./assets/voc4_th6.json5')
    ])
      .then(data => {
        const list_of_theme = data.flat(1)
        console.log(list_of_theme)
        return list_of_theme
      })
      .then((themes: Theme[]) => {
        for (let t of themes) {
          const t_id: number | string = t.theme

          if (t.semaines) {
            const semaines = t.semaines as Semaine[]
            for (let s of semaines) {
              for (let g of s.groupes) {
                const mots: MotTI[] = []
                for (let m of g.mots) {
                  crunchMot(m as Mot, g.indice, mots)
                }
                g.mots = mots
              }
            }
          }

          if(t.mots) {
            const mots: MotTI[] = []
            for (let m of t.mots) {
              crunchMot(m as Mot, "", mots)
            }
            t.mots = mots
          }
        }
        return themes
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
        return themes
      })
      .then((themes: Theme[]) => {
        this.themes = themes
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

const createMotTI = (m: Mot, indice: string): MotTI => {
  const newMot: MotTI = {
    mot: m.mot,
    classe: m.classe,
    indice: indice,
    genre: MotGenre.NA,
    nombre: MotNombre.NA
  }

  if (m.genre) {
    newMot.genre = m.genre
  }

  if (m.nombre) {
    newMot.nombre = m.nombre
  }

  if (m.alt) {
    newMot.alt = m.alt
  }

  let formes_alternatives : string[] = m.mot.split('/')

  if (formes_alternatives.length > 1) {
    newMot.mot = formes_alternatives[0]
    newMot.alt = formes_alternatives[1]
  }

  return newMot
}

const crunchMot = (m: Mot, indice: string, mots: MotTI[]) => {
  const newMot: MotTI = createMotTI(m, indice)
  mots.push(newMot)

  let classe: string[] = Array.isArray(m.classe) ? [...m.classe] : [m.classe]

  if (classe.length === 0) {
    console.warn("Le mot n'a pas de classe")
  }

  classe.forEach(cls => {
    if (cls == 'NM') {
      newMot.classe = 'NOM'
      newMot.genre = MotGenre.MASCULIN
    }

    if (cls == 'NF') {
      newMot.classe = 'NOM'
      newMot.genre = MotGenre.FEMININ
    }

    if (m.fem) {
      let newMot2: MotTI = createMotTI(m, indice)
      newMot2.mot = m.fem
      newMot2.genre = MotGenre.FEMININ
      newMot.genre = MotGenre.MASCULIN
      mots.push(newMot2)
    }
  })
}
