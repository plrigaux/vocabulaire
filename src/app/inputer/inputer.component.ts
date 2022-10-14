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

  rawInput = `Semaine 4

  Le e muet à la fin d'un mot
  aventure NF
  boule NF
  détective n. m
  détective NF
  double ADJ/NM
  envie NF
  ile f.
  larme NF
  même ADJ
  meuble n. m,
  mode NF
  mode NM
  parole NF
  pire ADJ
  plume n, f,
  poitrine NF
  poursuivre v,
  promenade n. f,
  pupitre NM
  roue NF
  sortie NF
  statue NF
  utile ADJ
  vide ADJ`

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
    result = result.replace(/v[\.,]/g, 'V')
    result = result.replace(/adj[\.,]/g, 'ADJ')
    result = result.replace(/inv[\.,]/g, 'INV')

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

    const regexpMots = /([A-zÀ-ÿ\s]+)\s+(NF|NM|ADJ|V|INV)/
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
        } else {
          console.warn("faulty line",  line)
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
}
