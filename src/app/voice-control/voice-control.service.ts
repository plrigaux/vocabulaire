import { Injectable } from '@angular/core'
import { AppConfig, DEFAULT_CONFIG } from '../app-config'
import { ThemeSetterService } from '../theme-setter.service'
import { VolumeDialogData } from './voice-control.component'

@Injectable({
  providedIn: 'root'
})
export class VoiceControlService {
  //voices: SpeechSynthesisVoice[] = []
  voices_map: Map<String, SpeechSynthesisVoice> = new Map()
  app_config = DEFAULT_CONFIG
  frenchVoices: SpeechSynthesisVoice[] = []

  constructor (private configSrv: ThemeSetterService) {
    console.log('VoiceService')
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = () => {
        this.listVoices()
      }
    }

    this.configSrv.subscribe({
      next: (config: AppConfig) => {
        this.app_config = config
      }
    })
  }

  getVolumeData (): VolumeDialogData {
    return this.app_config.volumeData
  }

  setVolumeData (data: VolumeDialogData) {
    this.app_config.volumeData = data
    this.configSrv.next(this.app_config)
  }

  private listVoices () {
    console.log('list voices')

    const voices = speechSynthesis.getVoices()
    console.log(voices)
    voices.forEach(voice => {
      //console.log(voice.name)
      this.voices_map.set(voice.voiceURI, voice)

      if (voice.lang.startsWith('fr')) {
        this.frenchVoices.push(voice)
      }
    })

    if (this.frenchVoices.length > 0) {
      this.setVoice(this.frenchVoices[0])
    }
  }

  setVoice (voice: SpeechSynthesisVoice) {
    this.app_config.volumeData.selectedVoice = voice.voiceURI

    this.configSrv.next(this.app_config)
  }

  getVoices (): SpeechSynthesisVoice[] {
    return Array.from(this.voices_map.values())
  }

  getSelectedVoice (): SpeechSynthesisVoice | null {
    if (this.app_config.volumeData.selectedVoice == null) {
      this.listVoices()
    }
    return this.getVoice(this.app_config.volumeData.selectedVoice)
  }

  getVoice (voice_id: string | null): SpeechSynthesisVoice | null {
    let voice = voice_id ? this.voices_map.get(voice_id) : null
    if (voice) {
      return voice
    }
    return null
  }

  play (text: string, volumeData?: VolumeDialogData) {
    let vd = this.app_config.volumeData
    if (volumeData) {
      vd = volumeData
    }

    let to_speak = new SpeechSynthesisUtterance(text)

    if (vd.selectedVoice) {
      to_speak.voice = this.getVoice(vd.selectedVoice)
    } else {
      let selectedVoice = this.getSelectedVoice()
      //this.app_config.volumeData.selectedVoice = this.getSelectedVoice()
      if (selectedVoice) {
        to_speak.voice = selectedVoice
      }
    }

    to_speak.pitch = vd.pitch
    to_speak.rate = vd.rate
    to_speak.volume = vd.volume
    //for android, it seems to need to set the lang
    to_speak.lang = to_speak.voice?.lang ?? 'fr-FR'

    window.speechSynthesis.speak(to_speak)
  }

  cancel () {
    window.speechSynthesis.cancel()
  }
}
