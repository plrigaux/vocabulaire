import { Component, OnInit } from '@angular/core';
import vocabulaire from '../../resources/vocabulaire.json';
import stValentin from '../../resources/themes1.json';
import themes from './vocBuilder';
import { Theme } from './vocabulaireInterfaces';

@Component({
  selector: 'app-vocabulaire',
  templateUrl: './vocabulaire.component.html',
  styleUrls: ['./vocabulaire.component.scss']
})
export class VocabulaireComponent implements OnInit {

  themes: Theme[] = themes

  constructor() { }

  ngOnInit(): void {
  
  }

}
