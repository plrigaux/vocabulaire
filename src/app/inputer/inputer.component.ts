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
  Semaine 1

  Le son [è] au début d'un mot s'écrit   le plus souvent   ai ou es.
  aide n. f.
  escalier n. m.
  espace n. m.
  espèce n. f.
  espoir n. m.
  esprit n. m.
  est n. m.

  Mot rebelle:
  être n. m.
  
  Le son [è] à l'intérieur   d'un mot s'écrit   souvent ai ou aî.
  capitaine n. m./n. f.
  connaître/connaitre v.
  contraire n. rn.
  disparaître/disparaitre v.
  fin de semaine n. f.
  laine n. f.
  maître/maitre n. m.
  maîtresse/maitresse n. f.
  marraine n. f.
  naître/naitre v.
  ordinaire adj.
  paix n. f.
  plaire v.

  Mot rebelle:
  ouest n. m.
  
  
  Semaine 2
  
  À l'intérieur d'un   mot, le son [è] peut   s'écrire è, ê ou ai.
  centimètre  n. m.
  colère n. f.
  extraordinaire adj.
  kilomètre n. m.
  matière n. f.
  misère n. f.
  mystère n. m.
  pêche n. f.
  poème n. m.
  prêt adj
  prête
  problème n. m.
  quatrième adj./n. m./n. f.
  rêve n. m.
  système n. rn.

  À la fin d'un mot, le son [è] s'écrit  le plus souvent et.
  bleuet n. m.
  effet n. m.
  objet n. m.
  secret adj./n. m.
  secrète adj
  sommet n. m.

  À la fin d'un mot,   le son [è] peut aussi   s'écrire ais.
  désormais mot inv.
  
  
  Semaine 3
  
  Des consonnes qui   doublent : cc, pp,   rr, tt.
  apparaître/apparaitre v.
  arracher v.
  arranger v.
  arrière n. m.
  attacher v.
  bizarre adj.
  bottine n. f.
  derrière n. m.
  échapper v.
  en arrière mot inv.
  grotte n. f.
  horreur n. f.
  occasion n. f.
  rapporter v.
  soccer n. m.
  terrible adj.

  Le son [èt] à la fin  d'un mot s'écrit le   plus souvent ette.
  bicyclette n. f.
  cachette n. f.
  lunette n. f.
  toilette n. f.

  Mot rebelle:
  net adj.
  nette
  
  Semaine 4
  
  Le son [ill] peut   s'écrire ill.
  abeille n. f.
  ailleurs mot inv.
  bouillir v.
  brouillard n. m
  caillou n. rn.
  cuiller/cuillère
  fillette n. f.
  médaille n. f.
  paille n. f.
  papillon n. m.
  veille f.

  Mot rebelle:
  travail n. rn.
  travaux
  
  Le son [ill] peut  s'écrire y.
  crayon n. m.
  effroyable adj
  ennuyer v.
  envoyer v.
  essayer v.
  incroyable adj.
  rayer v.
  royaume n. rn.
  voyou n. rn.
  
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
          console.warn('faulty line', line)
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
