import { Injectable } from '@angular/core';
import { VolumeDialogData } from './voice-control.component';

@Injectable({
    providedIn: 'root'
})
export class VoiceControlService {

    voices: SpeechSynthesisVoice[] = []
    frenchVoices: SpeechSynthesisVoice[] = []
    volumeData : VolumeDialogData = {
        volume : 0.75,
        pitch : 1,
        rate : 1,
        selectedVoice : null
    }

    constructor() {
        console.log("VoiceService")
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = () => {
                this.listVoices()
            }
        }
    }

    private listVoices() {
        console.log("list voices")


        this.voices = speechSynthesis.getVoices();
        console.log(this.voices)
        this.voices.forEach(voice => {

            //console.log(voice.name)

            if (voice.lang.startsWith("fr")) {
                this.frenchVoices.push(voice);
            }
        });

        if (this.frenchVoices.length > 0) {
            this.setVoice(this.frenchVoices[0])
        }
    }

    setVoice(voice: SpeechSynthesisVoice) {
        this.volumeData.selectedVoice = voice;
    }

    getVoices(): SpeechSynthesisVoice[] {
        return this.voices
    }

    getSelectedVoice(): SpeechSynthesisVoice | null {
        if (this.volumeData.selectedVoice == null) {
            this.listVoices();
        }
        return this.volumeData.selectedVoice
    }

    play(text: string, volumeData? : VolumeDialogData) {

        let vd = this.volumeData
        if (volumeData) {
            vd = volumeData
        }

        let to_speak = new SpeechSynthesisUtterance(text);

        if (vd.selectedVoice) {
            to_speak.voice = vd.selectedVoice
        } else {
            this.volumeData.selectedVoice = this.getSelectedVoice()
            if (vd.selectedVoice) {
                to_speak.voice = this.volumeData.selectedVoice
            }
        }

        to_speak.pitch = vd.pitch
        to_speak.rate = vd.rate
        to_speak.volume = vd.volume

        window.speechSynthesis.speak(to_speak);
    }

    cancel() {
        window.speechSynthesis.cancel()
    }

}
