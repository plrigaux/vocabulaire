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

  rawInput = `Semaine 1

La lettre S entre deux voyelles fait le son [z].
besoin n.
oser v.
présence n. f.
prison n. f
raison n. f
reposer v.
surprise n. f
visiter v.

Il faut écrire ss pour entendre le son [S].
assurer v.
casser v.
chaussure n. f.
dessous n. m./mot inv.
dessus n. m./mot inv.
messe n. f.
mission n. f.
passé n. m
poussière n. f
presser v.
ramasser v.
repasser v.
tresse n. fl

Semaine 2
Le son [gnl s'écrit gn.
éloigner v.
gagnant adj.
gagnante
magnifique adj.
signe n. rn.

La lettre g fait le son [g] devant a, o, u et devant une consonne.
à gauche mot inv.
agriculture n. f
dragon n. rn.
engager v.
garde n. rrt./n. f.
gard en n. m
gardienne n f.
globe n.
grave adj.
jungle n. f.
ogre n. rn.
ogresse n. E
rigoler v
Mot rebelle :
seconde n f.

Devant un e ou un i, il faut ajouter un u pour entendre le son [g].
fatiguer v.
guimauve n. f.
mangue n. f.
téléguider v

Semaine 3

Le son [é] à la fin d'un mot s'écrit souvent er.
bouger v.
dîner/diner n. m/v.
exister v.
laver v.
patiner v.
pleurer v.
prier v
ramener v.
rentrer v.
respirer v
sauter v.

Le son [é] la fin d'un nom féminin s'écrit le plus souvent ée.
arrivée n. f.
bouée n. f
entrée n. f.
pensée n. f.

Mots rebelles :
amitié n. fl
difficulté n
réalité n. fl
vérité n f.

Semaine 4

Des consonnes qui doublent ff, ll, mm, nn.  
ancien adj.
ancienne
annoncer v.
bulle n. f
difficile adj
dollar n. m.
échelle n. f.
gramme n. rn.
immense adj.
mademoiselle n. f.
mesdemoiselles n. f.
nommer v.
nouvelle n f.
pardonner v.
recommencer v.
ruelle n.
sommeil n. m
souffle n. m

Le son [ien] s'écrit le plus souvent ien,
bien n.
le mien pron.
la mienne pron.
les miens pron.
les miennes pron.
le sien pron.
la sienne pron.
les siens pron.
les siennes pron.
le tien pron.
la tienne pron.
les tiens pron.
les tiennes pron.
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
    result = result.replace(/pron[\.,]/g, 'PRON')
    result = result.replace(/v[\.,]/g, 'V')

    const semaines: Semaine[] = []

    let semaineObj: Semaine = {
      semaine: 0,
      groupes: []
    }

    const semRegEx = /semaine\s*(\d+)/i

    const lines: string[] = result.split('\n')
    console.log(lines)

    const regexpMots = /([A-zÀ-ÿ\s]+)\s+(NF|NM|ADJ|V|INV|PRON)/

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


*/
