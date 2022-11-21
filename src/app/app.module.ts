import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { SpeechComponent } from './speech/speech.component'
import { FormsModule } from '@angular/forms'
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select'
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input'
import { MatLegacySliderModule as MatSliderModule } from '@angular/material/legacy-slider'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'
import { VocabulaireComponent } from './vocabulaire/vocabulaire.component'
import { CardComponent } from './card/card.component'
import { CardcontrolComponent } from './cardcontrol/cardcontrol.component'
import { CorrectorComponent } from './corrector/corrector.component'
import { CorrectorDisplayTestComponent } from './corrector-display-test/corrector-display-test.component'
import { PortalComponent } from './portal/portal.component'
import { ReactiveFormsModule } from '@angular/forms'
import { InputSliderComponent } from './input-slider/input-slider.component'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatNativeDateModule } from '@angular/material/core'
import { VoiceControlComponent } from './voice-control/voice-control.component'
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog'
//import { MatSelectChange } from '@angular/material/select';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle'
import { MatButtonToggleModule } from '@angular/material/button-toggle'
import { InputerComponent } from './inputer/inputer.component'
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio'
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox'
import {MatLegacySnackBarModule as MatSnackBarModule} from '@angular/material/legacy-snack-bar';
@NgModule({
  declarations: [
    AppComponent,
    SpeechComponent,
    VocabulaireComponent,
    CardComponent,
    CardcontrolComponent,
    CorrectorComponent,
    CorrectorDisplayTestComponent,
    PortalComponent,
    InputSliderComponent,
    VoiceControlComponent,
    InputerComponent
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
    FormsModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatNativeDateModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    MatRadioModule,
    MatMenuModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatSnackBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
