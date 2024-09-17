import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { VocabulaireDataHandlerService } from '../vocabulaire/vocabulaire-data-handler.service';
import {
  Groupe,
  Mot,
  MotClasse,
  MotGenre,
  MotNombre,
  MotTI,
  Semaine,
  Serie,
  Theme
} from '../vocabulaire/vocabulaireInterfaces';


@Component({
  selector: 'app-mot-table',
  standalone: true,
  imports: [MatTableModule],
  templateUrl: './mot-table.component.html',
  styleUrl: './mot-table.component.scss'
})
export class MotTableComponent {
  constructor(
    private vocSrv: VocabulaireDataHandlerService
  ) {

    this.vocSrv.get_loaded().then(ths => {

      let dataSource: Mot[] = []
      ths.forEach(th => {
        if (th.series) {
          th.series.forEach(serie => {
            console.log("mots", serie.mots)
            dataSource.push(...serie.mots)
          })
        }
      })
      this.dataSource = dataSource;
      //console.log("dataSource.length", dataSource.length)
      //console.log("this.dataSource.length", this.dataSource.length)
    })

  }

  displayedColumns: string[] = ['mot', "classe", 'an'];
  dataSource: Mot[] = []
}
