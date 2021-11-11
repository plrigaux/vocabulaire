import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VocabulaireComponent } from './vocabulaire/vocabulaire.component';
import { SpeechComponent } from './speech/speech.component'; 
import { CardcontrolComponent} from './cardcontrol/cardcontrol.component'
import { CorrectorDisplayTestComponent } from './corrector-display-test/corrector-display-test.component';
import { PortalComponent } from './portal/portal.component';

const routes: Routes = [
  { path: '', component: PortalComponent },
  { path: 'speech', component: SpeechComponent },
  { path: 'vocabulaire', component: VocabulaireComponent },
  { path: 'cardcontrol', component: CardcontrolComponent },
  { path: 'correctortest', component: CorrectorDisplayTestComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

