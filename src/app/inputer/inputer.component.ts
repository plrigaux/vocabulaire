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

  rawInput = `Semaine 3

Le h muet 
avant-hier mot inv. 
de bonne heure mot inv.
en haut mot inv.
habitude n. f,
héros n. m.
héroïne n, f.
hésiter v.
hier mot inv.
hockey n. m,
horizon n. m.
huile n. f,
hurler v.
théâtre n. rn.
thon n. rn.

Le son [ch] s'écrit ch.
brioche n, f,
chance n. f.
chapit
re n. m.
chuchoter v,
proche adj.
rechercher v.

Semaine 4

Le son [f] s'écrit le plus souvent f.
bref mot inv.
cafétéria n. f
canif n. m.
chef n, m./n. f.
définir v,
façon n. f.
fanfare n, f,
fermé adj.
fermée
fêter v.
forme n. f.
foule n. f.
fumer v,
préféré adj./n, m.
préférée adj./n, f,
profiter v.
refaire v.
sauf mot inv.
transformer v.

Le son [f] s'écrit parfois ph.
catastrophe n. f.
nénuphar/nénufar n. m.
paragraphe n. m.
phare n. m.

Semaine 5

Le son [o] s'écrit au ou o au début d'un mot.
aube n. f.
aucun dét.
aucune
aucuns
aucunes
auprès de mot inv.
autant mot inv.
automobile n. f.
autre pron.
obliger v.
observer v.

Le son [o] s'écrit o, ô ou au à l'intérieur d'un mot.
adorer v.
côte n. f.
drôle adj.
épaule n. f.
plutôt mot inv.
rôle n, m.
tôt mot inv.

Le son [o] s'écrit le plus souvent eau à la fin d'un mot.
anneau n. m.
gâteau n. m.
rideau n. m.

Mots rebelles:
métro n. rn.
numéro n. m.
piano n. rn.
  
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
