import { Component, OnInit, ViewChild } from '@angular/core';
import { Theme, Semaine, Groupe, Mot } from '../vocabulaire/vocabulaireInterfaces';
import vocabulaire from '../../resources/vocabulaire.json';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-cardcontrol',
  templateUrl: './cardcontrol.component.html',
  styleUrls: ['./cardcontrol.component.scss']
})
export class CardcontrolComponent implements OnInit {

  theme: Theme | null = null;
  semaine: Semaine | null = null;
  themes: Theme[] = vocabulaire
  groupe: Groupe | null = null;
  mot: Mot | null = null;
  mots: Mot[] = []
  motIndex: number = 0

  @ViewChild(CardComponent)
  private cardComponent!: CardComponent;
  constructor() { }

  ngOnInit(): void {
  }

  getSemaines(): Semaine[] {
    //let theme = this.themes.find( (t : Theme) => t.theme == this.theme.theme)

    if (this.theme) {
      return this.theme.semaines;
    }

    return [];
  }

  onChangeSemaine(semaine: Semaine) {
    //onsole.log(semaine)
    this.semaine = semaine

    this.mots = []
    this.motIndex = -1;
    this.semaine.groupes.forEach((g: Groupe) => {

      let indice = g.indice
      g.mots.forEach(m => { this.mots.push(m) })
    });

    this.next();
  }

  next() {
    let index = this.motIndex + 1
    this.setMot(index)
  }

  previous() {
    let index = this.motIndex - 1
    this.setMot(index)
  }

  private setMot(index: number) {
    if (index >= 0 && index < this.mots.length) {
      this.mot = this.mots[index]
      this.motIndex = index
      this.cardComponent.newWord(this.mot)
    }
  }
}
