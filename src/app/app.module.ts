import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SpeechComponent } from './speech/speech.component';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { VocabulaireComponent } from './vocabulaire/vocabulaire.component';
import { CardComponent } from './card/card.component';
import { CardcontrolComponent } from './cardcontrol/cardcontrol.component';
import { CorrectorComponent } from './corrector/corrector.component';
import { CorrectorDisplayTestComponent } from './corrector-display-test/corrector-display-test.component';
import { PortalComponent } from './portal/portal.component'

@NgModule({
  declarations: [
    AppComponent,
    SpeechComponent,
    VocabulaireComponent,
    CardComponent,
    CardcontrolComponent,
    CorrectorComponent,
    CorrectorDisplayTestComponent,
    PortalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatSliderModule,
    MatCardModule,
    MatTooltipModule,
    MatIconModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
