import { Component, OnInit, ViewChild } from '@angular/core';
import { Theme, Semaine, Groupe, Mot } from '../vocabulaire/vocabulaireInterfaces';
import { CardComponent } from '../card/card.component';

import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import themes from '../vocabulaire/vocBuilder';

@Component({
  selector: 'app-cardcontrol',
  templateUrl: './cardcontrol.component.html',
  styleUrls: ['./cardcontrol.component.scss']
})
export class CardcontrolComponent implements OnInit {

  theme: Theme | null = null;
  semaine: Semaine | null = null;
  themes: Theme[] = themes
  groupe: Groupe | null = null;
  mot: Mot | null = null;
  mots: Mot[] = []
  motIndex: number = 0
  private _isWriting = false
  shuffle = false;
  article: "unune" | "lela" = "unune"

  private _prevDisabled: boolean = true
  private _nextDisabled: boolean = true

  @ViewChild(CardComponent)
  private cardComponent!: CardComponent;
  constructor() { }

  ngOnInit(): void {

  }

  getSemaines(): Semaine[] {
    //let theme = this.themes.find( (t : Theme) => t.theme == this.theme.theme)

    if (this.theme) {
      return this.theme.semaines ?? [];
    }

    return [];
  }

  shuffleArray(array: any) {
    if (!this.shuffle) {
      return;
    }

    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  crunchMot(m: Mot, indice: string) {
    m.indice = indice
    if (Array.isArray(m.classe)) {
      if (m.classe.length >= 1) {
        let cls = m.classe[0]
        let isNom = cls == "NM" || cls == "NF"
        if (isNom && m.fem) {
          let newMot: Mot = {
            mot: m.fem,
            classe: "NF",
            indice: indice
          }
          this.mots.push(newMot)
        }
      }
    } else if (m.classe == "ADJ") {
      if (m.fem) {
        let newMot: Mot = {
          mot: m.fem,
          classe: "ADJ",
          indice: indice,
          genre: "FEM"
        }
        m.genre = "MAS"
        this.mots.push(m)
        m = newMot
      }
    }

    this.mots.push(m)
  }

  onChangeTheme(theme: Theme) {
    this.theme = theme
    if (theme.mots) {
      this.semaine = null
      this.mots = []
      this.motIndex = -1;
      theme.mots.forEach(m => { this.crunchMot(m, "") });

      this.shuffleArray(this.mots)
      this.next();
    }
  }

  onChangeSemaine(semaine: Semaine) {
    //onsole.log(semaine)
    this.semaine = semaine

    this.mots = []
    this.motIndex = -1;
    this.semaine.groupes.forEach((group: Groupe) => {
      let indice = group.indice
      group.mots.forEach(mot => {
        this.crunchMot(mot, indice)
      });
    })
    this.next();
  }

  onChangeToggle(event: MatSlideToggleChange) {
    console.log(event)

    if (this.semaine) {
      this.onChangeSemaine(this.semaine)
      return
    }

    if (this.theme?.mots) {
      this.onChangeTheme(this.theme)
      return
    }
  }

  next() {
    console.log("next - " + this.motIndex)
    let index = this.motIndex + 1
    this.setMot(index)
    console.log("next - " + this.motIndex)
  }

  previous() {
    let index = this.motIndex - 1
    this.setMot(index)
  }

  private setMot(index: number) {
    //console.log("setMot - index " + index)
    if (index >= 0 && index < this.mots.length) {

      this.motIndex = index
      this.mot = this.mots[this.motIndex]
      //console.log("setMot - new mot " + this.motIndex + " mot " + this.mot.mot)
      this.cardComponent.newWord(this.mot)

      this._prevDisabled = false
      this._nextDisabled = false
      //console.log("setMot - index " + index)
    }

    if (index <= 0) {
      //console.log("setMot - prevDisabled " + index)
      this._prevDisabled = true
    } else if (index >= this.mots.length - 1) {
      //console.log("setMot - nextDisabled " + index)
      this._nextDisabled = true
    }
    //console.log(this)
  }

  checkWritingState(isWriting: boolean) {
    console.log(`isWriting ${isWriting}`)
    this._isWriting = isWriting
  }

  prevDisabled(): boolean {
    if (this._isWriting) {
      return true
    }

    return this._prevDisabled
  }

  nextDisabled(): boolean {
    if (this._isWriting) {
      return true
    }

    return this._nextDisabled
  }
}
