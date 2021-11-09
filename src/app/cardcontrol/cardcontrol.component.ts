import { Component, OnInit } from '@angular/core';
import { Theme, Semaine } from '../vocabulaire/vocabulaireInterfaces';
import vocabulaire from '../../resources/vocabulaire.json';

@Component({
  selector: 'app-cardcontrol',
  templateUrl: './cardcontrol.component.html',
  styleUrls: ['./cardcontrol.component.scss']
})
export class CardcontrolComponent implements OnInit {

  theme : Theme | null = null;
  semaine : Semaine | null = null;
  themes : Theme[] = vocabulaire

  constructor() { }

  ngOnInit(): void {
  }

  getSemaines() : Semaine[] {
    //let theme = this.themes.find( (t : Theme) => t.theme == this.theme.theme)
    
    if (this.theme) {
      return this.theme.semaines;
    } 
    
    return [];
  }

  setSemaine(sem : string) {

  }
}
