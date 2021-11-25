import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class VoiceControlService {

    voices: SpeechSynthesisVoice[] = []
    frenchVoices: SpeechSynthesisVoice[] = []
    selectedVoice: SpeechSynthesisVoice | null = null
    //static instances = 0
    //thisinstanceId = 0
    //pitch: number = 1
    volume: number = 75
    pitch = 1
    rate = 1

    constructor() {
        console.log("VoiceService")
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = () => {
                this.listVoices()
            }
        }
        //console.log(this.voices)
        //console.log("Voices: " + this.voices.length)

        //VoiceControlService.instances += 1
        //this.thisinstanceId = VoiceControlService.instances
        //console.log(`VoiceControlService this.thisinstanceId ${this.thisinstanceId}`)
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
        this.selectedVoice = voice;
    }

    getVoices(): SpeechSynthesisVoice[] {
        return this.voices
    }

    getSelectedVoice(): SpeechSynthesisVoice | null {
        if (this.selectedVoice == null) {
            this.listVoices();
        }
        return this.selectedVoice
    }

    play(text: string) {
        let to_speak = new SpeechSynthesisUtterance(text);

        if (this.selectedVoice) {
            to_speak.voice = this.selectedVoice
        } else {
            this.selectedVoice = this.getSelectedVoice()
            if (this.selectedVoice) {
                to_speak.voice = this.selectedVoice
            }
        }

        to_speak.pitch = this.pitch
        to_speak.rate = this.rate
        to_speak.volume = this.volume / 100

        window.speechSynthesis.speak(to_speak);
    }

}
