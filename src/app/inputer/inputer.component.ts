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

  rawInput = `  Semaine 2

  Le son [é] au début   et à l'intérieur d'un mot s'écrit le plus souvent é.\n  Le son [él à la fin   d'un verbe à l'infinitif   s'écrit er.\nLe son [é] à la fin d'un mot s'écrit le plus souvent er.
  améliorer v,
  créer v,
  décider v.
  déclarer v.
  déjeuner n. m./v.
  détester v.
  éclair n. rn.
  éclairer v.
  éclater v.
  énorme adj.
  état n. rn.
  étudier v.
  éviter v.
  expérience n. f.
  léger adj.
  légère
  opéra n. m.
  pépin n. m.
  plancher n. rn.
  répéter v.
  réponse n. f.
  représenter v.
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
    result = result.replace(/n[\.,]\s*(m|rn)[\.,]/g, 'NM')
    result = result.replace(/n[\.,]\s*f[\.,]/g, 'NF')
    result = result.replace(/adj[\.,]/g, 'ADJ')
    result = result.replace(/(mot inv|inv)[\.,]/g, 'INV')
    result = result.replace(/pron[\.,]/g, 'PRON')
    result = result.replace(/v[\.,]/g, 'V')

    const semaineObj: Semaine = {
      semaine: 0,
      groupes: []
    }

    let match = result.match(/semaine\s*(\d+)/i)
    if (match) {
      let sem = match[1]
      console.log(`semaine num "${sem}" pint ${parseInt(sem)}`, match)
      semaineObj.semaine = parseInt(sem)
    }

    const lines: string[] = result.split('\n')
    console.log(lines)

    const regexpMots = /([A-zÀ-ÿ\s]+)\s+(NF|NM|ADJ|V|INV|PRON)/
    const regexpIndice = /./

    let mots: Mot[] = []

    let previousLine = lines[0]
    for (const line of lines) {
      const match = line.match(regexpMots)
      if (match) {
        //console.log('mot', match[1], 'classe', match[2])

        const mot = match[1].trim()
        const classe = match[2].trim()

        const motcl: Mot = {
          mot: mot,
          classe: classe
        }

        mots.push(motcl)
      } else {
        console.log('line not match', line, 'prev', previousLine)
        if (previousLine.trim().length === 0) {
          console.log('line not match prev', line)
          let groupe: Groupe = {
            indice: line.trim(),
            mots: []
          }

          semaineObj.groupes.push(groupe)
          mots = groupe.mots
        } else if (this.is_last_an_adj(mots, line)) {
          console.log('fem', line)
        } else {
          console.warn('faulty line', line)
        }
      }
      previousLine = line
    }

    console.log(mots)

    console.log('semaine', semaineObj)

    this.transformed = JSON5.stringify(semaineObj, null, 2)
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


*/
