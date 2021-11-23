import { Component, OnInit, Inject } from '@angular/core';


export class VoiceService {
    static voices: SpeechSynthesisVoice[] = []
    frenchVoices: SpeechSynthesisVoice[] = []
    selectedVoice!: SpeechSynthesisVoice

    constructor() {
        console.log("VoiceService")
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = () => {
                this.listVoices()
            }
        }
        console.log(VoiceService.voices)
        console.log("Voices: " + VoiceService.voices.length)
    }

    private listVoices() {
        console.log("list voices")


        VoiceService.voices = speechSynthesis.getVoices();
        console.log(VoiceService.voices)
        VoiceService.voices.forEach(voice => {

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

    getVoices() : SpeechSynthesisVoice[] {
        return VoiceService.voices
    }

    getSelectedVoice() : SpeechSynthesisVoice {
        return this.selectedVoice
    }
}