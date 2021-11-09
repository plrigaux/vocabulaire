import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VocabulaireComponent } from './vocabulaire/vocabulaire.component';
import { SpeechComponent } from './speech/speech.component'; 

const routes: Routes = [
  { path: '', component: SpeechComponent },
  { path: 'vocabulaire', component: VocabulaireComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

