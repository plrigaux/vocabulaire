import { Component, OnInit } from '@angular/core'
import { Mot, Semaine, Groupe } from '../vocabulaire/vocabulaireInterfaces'
import JSON5 from 'json5'
import { Clipboard } from '@angular/cdk/clipboard'

@Component({
  selector: 'app-inputer',
  templateUrl: './inputer.component.html',
  styleUrls: ['./inputer.component.scss']
})
export class InputerComponent implements OnInit {
  constructor (private clipboard: Clipboard) {}

  rawInput = `
  Semaine 4

  Le son [ir] s'écrit le   plus souvent ir à la fin  d'un verbe à l'infinitif.
  contenir v.
  divertir v.
  partir v.
  punir v.
  réfléchir v.
  repartir v.
  réunir v,
  tenir v.

  Mots rebelles:
  élire v.
  sourire v,
  suffire v.

  Le son [oir] s'écrit le plus souvent oir à la fin d'un verbe à l'infinitif.
  apercevoir v,
  asseoir/assoir v.
  pouvoir v.
  revoir v.

  Le son [uir] s'écrit le plus souvent uire à la fin d'un verbe à l'infinitif.
  conduire v.
  construire v.
  détruire v.

  Le son [endre] s'écrit le plus souvent endre à la fin d'un verbe
  à l'infinitif.
  vendre v.
  suspendre v,
  
  Semaine 5
  
  Le s final muet 
  cas n. m.
  secours n. m.
  toutefois mot inv.
  Le x final muet
  croix n. f.
  perdrix n. f.

  Le t final muet 
  debout mot inv.
  pourtant mot inv.
  
  Mots composés
  à peu près mot inv.
  à travers mot inv.
  au lieu de mot inv.
  au milieu de mot inv.
  au moins mot inv.
  en avant mot inv.
  en bas mot inv.
  la plupart pron.
  la plupart des dét.
  là-bas mot inv.
  lors de mot inv.
  rendez-vous n. m.
  tout à coup mot inv.
    
  `

  transformed = ''

  ngOnInit (): void {
    if (this.rawInput.length > 0) {
      this.transform()
    }
  }

  transform () {
    console.log('trans', this.rawInput)

    let result = this.rawInput
    result = result.replace(/n[\.,]\s*(m|rn|rrt)[\.,]/g, 'NM')
    result = result.replace(/n[\.,]\s*f[\.,]/g, 'NF')
    result = result.replace(/adj[\.,]/g, 'ADJ')
    result = result.replace(/(mot inv|inv)[\.,]/g, 'INV')
    result = result.replace(/prom|pron[\.,]/g, 'PRON')
    result = result.replace(/v[\.,]/g, 'V')

    const semaines: Semaine[] = []

    let semaineObj: Semaine = {
      semaine: 0,
      groupes: []
    }

    const semRegEx = /semaine\s*(\d+)/i

    const lines: string[] = result.split('\n')
    console.log(lines)

    const regexpMots = /([A-zÀ-ÿ\s'-/]+)\s+(NF|NM|ADJ|V|INV|PRON)/

    let mots: Mot[] = []

    let previousLine = lines[0]
    for (const line of lines) {
      const matchSem = line.match(semRegEx)
      if (matchSem) {
        let sem = matchSem[1]
        console.log(`semaine num "${sem}" pint ${parseInt(sem)}`, matchSem)

        semaineObj = {
          semaine: 0,
          groupes: []
        }

        semaineObj.semaine = parseInt(sem)

        semaines.push(semaineObj)
        continue
      }

      const match = line.match(regexpMots)
      if (match) {
        //console.log('mot', match[1], 'classe', match[2])

        const mots_ = match[1].trim().split('/')

        const classe = match[2].trim()

        const motcl: Mot = {
          mot: mots_[0],
          classe: classe
        }

        if (mots.length > 1) {
          motcl.alt = mots_[1]
        }

        mots.push(motcl)
      } else {
        console.log('line not match', line, 'prev', previousLine)
        if (previousLine.trim().length === 0 && line.trim().length !== 0) {
          console.log('line not match prev', line)
          let groupe: any = {
            indice: line.trim(),
            mots: []
          }

          semaineObj.groupes.push(groupe)
          mots = groupe.mots
        } else if (this.is_last_an_adj(mots, line)) {
          console.log('fem', line)
        } else {
          console.warn('faulty line nb:', line)
        }
      }
      previousLine = line
    }

    console.log(mots)

    console.log('semaines', semaines)

    this.transformed = JSON5.stringify(semaines, null, 2)
  }

  copyResult () {
    this.clipboard.copy(this.transformed)
  }

  is_last_an_adj (mots: Mot[], line: string): boolean {
    const mot = mots[mots.length - 1]
    if (mot) {
      if (mot.classe === 'ADJ') {
        let fem = line.trim()
        if (fem) {
          mot.fem = fem
        }
      }
    }
    return false
  }
}

/*

 rawInput = `
Thème 4
  Semaine 1

  Le son [kl s'écrit le plus souvent qu et presque toujours que en fin de mot.
  bibliothèque n. f.
  cirque n. m.
  domestique adj.
  électrique adj.
  époque n. f,
  équipe n. f.
  expliquer v,
  jusqu'à mot inv.
  jusqu'au
  jusqu'aux
  lequel pron,
  laquelle
  lesquels
  lesquelles
  marquer v.
  phoque n, rn,
  puisque/puisqu' mot inv.
  quartier n, m,
  quelque chose pron.
  quelquefois mot inv.
  quitter v.
  quoi pron.
  réplique n. f.
  tandis que/tandis qu' mot inv.
  unique adj.

  Mots rebelles:
  bec n. m.
  lac n, m.

  Semaine 2
Le son [eur] à la fin d'un   mot s'écrit le plus souvent eur.
  chaleur n. f.
  directeur n, m.
  directrice n. f.
  douceur n. f.
  humeur n. f.
  joueur n. m.
  joueuse n. f.
  le leur pron,
  la leur
  les leurs
  odeur n. f.

  Le son [eu] à la fin d'un adjectif masculin s'écrit le plus souvent eux.
  affreux adj.
  affreuse
  chanceux adj.
  chanceuse
  creux adj.
  creuse
  curieux adj.
  curieuse
  dangereux adj.
  dangereuse
  délicieux adj.
  délicieuse
  malheureux adj.
  malheureuse
  merveilleux adj.
  merveilleuse
  nombreux adj.
  nombreuse

  Le son [al] à la fin d'un mot s'écrit le plus souvent al.
  amical adj.
  amicale
  amicaux
  amicales
  familial adj.
  familiale
  familiaux
  familiales
  médical adj.
  médicale
  médicaux
  médicales
  normal adj.
  normale
  normaux
  normales
  `
*/
