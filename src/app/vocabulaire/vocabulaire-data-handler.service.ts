import { Injectable } from '@angular/core'
import {
  Mot,
  MotClasse,
  MotGenre,
  MotNombre,
  MotTI,
  Semaine,
  Serie,
  Theme
} from './vocabulaireInterfaces'
import JSON5 from 'json5'
import { marked } from 'marked'

@Injectable({
  providedIn: 'root'
})
export class VocabulaireDataHandlerService {
  private themes: Theme[] = []
  private themes_map: Map<number | string, Theme> = new Map()
  private themes_semaine_map: Map<string, Semaine> = new Map()
  private themes_serie_map: Map<string, Serie> = new Map()


  private fetcher: Promise<void>
  constructor() {
    this.fetcher = Promise.all([
      /*this.getVocabularyAsset('./assets/voc4_th1.json5'),
      this.getVocabularyAsset('./assets/voc4_th2.json5'),
      this.getVocabularyAsset('./assets/voc4_th3.json5'),
      this.getVocabularyAsset('./assets/voc4_th4.json5'),
      this.getVocabularyAsset('./assets/voc4_th5.json5'),
      this.getVocabularyAsset('./assets/voc4_th6.json5'),*/
      this.getVocabularyAsset('./assets/voc5_th1.json5')
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
                g.indice = marked.parseInline(g.indice)
                for (let m of g.mots) {
                  crunchMot(m as Mot, g.indice, mots)
                }
                g.mots = mots
              }
            }
          } else if (t.series) {
            const serie = t.series as Serie[]
            for (let s of serie) {
              const mots: MotTI[] = []
              for (let m of s.mots) {
                crunchMot(m as Mot, '', mots)
              }
              s.mots = mots
            }
          } else if (t.mots) {
            const mots: MotTI[] = []
            for (let m of t.mots) {
              crunchMot(m as Mot, '', mots)
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
          } else if (t.series) {
            const series = t.series as Serie[]
            for (let s of series) {
              this.themes_serie_map.set(`${t_id}_${s.id}`, s)
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

  getThemes(): Theme[] {
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

  async getThemeById(theme_id: number | string): Promise<Theme | undefined> {
    return this.fetcher.then(() => {
      console.log('getThemeById', theme_id)
      return this.themes_map.get(theme_id)
    })
  }

  async getSemaineById(
    theme: Theme,
    semaine_id: number
  ): Promise<Semaine | undefined> {
    return this.fetcher.then(() => {
      console.log('getSemaineById', theme.theme, semaine_id)
      return this.themes_semaine_map.get(`${theme.theme}_${semaine_id}`)
    })
  }

  async getSerieById(
    theme: Theme,
    serie_id: number
  ): Promise<Serie | undefined> {
    return this.fetcher.then(() => {
      console.log('getSerieById', theme.theme, serie_id)
      return this.themes_serie_map.get(`${theme.theme}_${serie_id}`)
    })
  }
}

const createMotTI = (m: Mot, indice: string): MotTI => {

  let genre = MotGenre.NA
  if (m.genre) {
    genre = m.genre
  }

  let nombre = MotNombre.NA
  if (m.nombre) {
    console.warn("TM", m.nombre, m)
    nombre = m.nombre
  }

  const newMot: MotTI = {
    mot: m.mot,
    classe: MotClasse.NA,
    indice: indice,
    genre: genre,
    nombre: nombre
  }

  if (m.alt) {
    newMot.alt = m.alt
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

  const newClasse = new Set<MotClasse>()
  classe.forEach((cls: string) => {
    if (cls == 'NM') {
      newClasse.add(MotClasse.NOM)
      newMot.genre = setGenre(newMot.genre, MotGenre.MASCULIN)
    } else if (cls == 'NF') {
      newClasse.add(MotClasse.NOM)
      newMot.genre = setGenre(newMot.genre, MotGenre.FEMININ)
    } else {
      let mot_classe = map_string_to_MotClass(cls);
      newClasse.add(mot_classe)
    }

    if (m.fem) {
      let newMot2: MotTI = createMotTI(m, indice)
      newMot2.mot = m.fem
      newMot2.genre = MotGenre.FEMININ
      newMot.genre = MotGenre.MASCULIN
      newMot2.classe = map_string_to_MotClass(cls)
      mots.push(newMot2)
    }
  })

  const newClasseArr = [...newClasse]
  newMot.classe = newClasseArr.length > 1 ? newClasseArr : newClasseArr[0]
}

const map_string_to_MotClass = (string_class: string): MotClasse => {
  let c = MotClasse.NA
  switch (string_class) {
    case 'V':
      c = MotClasse.V
      break
    case 'ADJ':
      c = MotClasse.ADJ
      break
    case 'ADV':
      c = MotClasse.ADV
      break
    case 'INV':
      c = MotClasse.INV
      break
    case 'DET':
      c = MotClasse.DET
      break
    case 'PRON':
      c = MotClasse.PRON
      break
    case 'NOM':
    case 'NI':
    case 'NF':
    case 'NM':
      c = MotClasse.NOM
      break

    default:
      console.warn("Mapping to MotClass FAILED! input:", string_class)
      c = MotClasse.NA
  }

  return c
}

const setGenre = (current_genre: MotGenre, new_genre: MotGenre): MotGenre => {
  let genre: MotGenre = current_genre ? current_genre : MotGenre.NA
  return genre | new_genre
}