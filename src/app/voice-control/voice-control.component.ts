import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { VoiceControlService } from './voice-control.service';


export interface VolumeDialogData {
  pitch: number;
  rate: number;
  volume: number;
  selectedVoice: SpeechSynthesisVoice | null
}

@Component({
  selector: 'app-voice-control',
  templateUrl: './voice-control.component.html',
  styleUrls: ['./voice-control.component.scss']
})
export class VoiceControlComponent implements OnInit {
  readonly pitchMin = 0
  readonly pitchMax = 2


  readonly rateMin = 0.1
  readonly rateMax = 10

  constructor(
    public dialogRef: MatDialogRef<VoiceControlComponent>,
    @Inject(MAT_DIALOG_DATA) public data: VolumeDialogData,
    public voiceService: VoiceControlService) {

  }

  ngOnInit(): void {

  }



  onNoClick(): void {
    this.dialogRef.close();
  }

  changePitch(newPitch: number) {
    this.data.pitch = newPitch
  }

  changeRate(newRate: number) {
    this.data.rate = newRate
  }

  changeVolume(volume: number) {
    this.data.volume = volume
  }

  getVoices() {
    return this.voiceService.getVoices();
  }

  getVoice() {
    if (this.data.selectedVoice == null) {
      return this.voiceService.getSelectedVoice()
    }
    return this.data.selectedVoice;
  }

  setVoice(voice: MatSelectChange) {
    console.log(voice)
    this.data.selectedVoice = voice.value;
  }
}
