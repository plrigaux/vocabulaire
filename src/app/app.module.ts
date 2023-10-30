import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { ClipboardModule } from '@angular/cdk/clipboard';
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { SpeechComponent } from './speech/speech.component'
import { FormsModule } from '@angular/forms'
import { MatSelectModule as MatSelectModule } from '@angular/material/select'
import { MatFormFieldModule as MatFormFieldModule } from '@angular/material/form-field'
import { MatButtonModule as MatButtonModule } from '@angular/material/button'
import { MatInputModule as MatInputModule } from '@angular/material/input'
import { MatSliderModule as MatSliderModule } from '@angular/material/slider'
import { MatCardModule as MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'
import { MatTooltipModule as MatTooltipModule } from '@angular/material/tooltip'
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
import { MatDialogModule as MatDialogModule } from '@angular/material/dialog'
import { MatSlideToggleModule as MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatButtonToggleModule } from '@angular/material/button-toggle'
import { InputerComponent } from './inputer/inputer.component'
import { MatRadioModule as MatRadioModule } from '@angular/material/radio'
import { MatMenuModule as MatMenuModule } from '@angular/material/menu'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatCheckboxModule as MatCheckboxModule } from '@angular/material/checkbox'
import { MatSnackBarModule as MatSnackBarModule } from '@angular/material/snack-bar';
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
    MatSnackBarModule,
    ClipboardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
