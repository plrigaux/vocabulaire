import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
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

  voiceTest: string = "test de voix"

  data: VolumeDialogData
  constructor(
    public dialogRef: MatDialogRef<VoiceControlComponent>,
    public voiceService: VoiceControlService) {

    this.data = {
      ...voiceService.volumeData
    }
  }

  ngOnInit(): void {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onOkClick(): void {
    this.voiceService.volumeData = this.data
    this.dialogRef.close();
  }

  changePitch(newPitch: number) {
    this.data.pitch = newPitch
  }

  changeRate(newRate: number) {
    this.data.rate = newRate
  }

  changeVolume(volume: number) {
    this.data.volume = volume / 100
  }

  get volume() {
    return this.data.volume * 100
  }

  getVoices() : SpeechSynthesisVoice[] {
    return this.voiceService.getVoices();
  }

  getSelectedVoice() {
    if (this.data.selectedVoice == null) {
      return this.voiceService.getSelectedVoice()
    }
    return this.data.selectedVoice;
  }

  setSelectedVoice(voice: MatSelectChange) {
    //console.log(voice)

    let ssv : SpeechSynthesisVoice = voice.value
    this.data.selectedVoice = ssv;
  }

  playVoice() {
    this.voiceService.cancel()
    this.voiceService.play(this.voiceTest, this.data)
  }
}
