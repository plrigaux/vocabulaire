import { VolumeDialogData } from './voice-control/voice-control.component'

export interface AppConfig {
  color_theme: string
  theme_semaine: ThemeSemaine | ThemeSerie
  volumeData: VolumeDialogData
}



export const COLOR_THEMES = [
  { value: 'default-theme', label: 'Default' },
  { value: 'dark-theme', label: 'Dark' },
  { value: 'light-theme', label: 'Light' },
  { value: 'deeppurple-amber', label: 'Deep Purple & Amber' },
  { value: 'indigo-pink', label: 'Indigo & Pink' },
  { value: 'pink-bluegrey', label: 'Pink & Blue-grey' },
  { value: 'purple-green', label: 'Purple & Green' },
  { value: 'candy', label: 'Pumpkin' }
]

export const DEFAULT_VOLUME_DATA: VolumeDialogData = {
  volume: 0.75,
  pitch: 1,
  rate: 1,
  selectedVoice: null
}

export const DEFAULT_CONFIG: AppConfig = {
  color_theme: COLOR_THEMES[0].value,
  theme_semaine: { theme: 1, semaine: 1 },
  volumeData: DEFAULT_VOLUME_DATA
}

export interface ThemeSemaine {
  theme: number | string
  semaine: number
}

export interface ThemeSerie {
  theme: number 
  serie: number
}

export const get_semaine_serie_id = (obj: ThemeSemaine | ThemeSerie): number => {
  if ("semaine" in obj) {
    return obj.semaine
  }

  return obj.serie
}

export const is_serie = (obj: ThemeSemaine | ThemeSerie): boolean => {
  if ("semaine" in obj) {
    return false
  }

  return true
}