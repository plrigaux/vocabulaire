import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VocabulaireComponent } from './vocabulaire/vocabulaire.component';
import { SpeechComponent } from './speech/speech.component'; 
import { CardcontrolComponent} from './cardcontrol/cardcontrol.component'

const routes: Routes = [
  { path: '', component: SpeechComponent },
  { path: 'vocabulaire', component: VocabulaireComponent },
  { path: 'cardcontrol', component: CardcontrolComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

