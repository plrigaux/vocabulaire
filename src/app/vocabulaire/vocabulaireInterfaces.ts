export interface Theme {
  theme: number | string
  semaines?: any
  mots?: Mot[]
}

export interface Semaine {
  semaine: number
  groupes: Groupe[]
}

export interface Groupe {
  indice: string
  mots: Mot[]
}

type MotClasse =
  | 'ADJ'
  | 'V'
  | 'NF'
  | 'NM'
  | 'MI'
  | 'INV'
  | 'DET'
  | 'PRON'
  | 'NOM'

export enum MotGenre {
  NA = 0,
  MASCULIN = 1,
  FEMININ = 2
}

export enum MotNombre {
  NA = 0,
  SINGULIER = 1,
  PLURIEL = 2
}

export interface Mot {
  mot: string
  alt?: string
  classe: MotClasse | MotClasse[] | string
  fem?: string
  detail?: string
  indice?: string
  genre?: MotGenre
  nombre?: MotNombre
}

export interface MotTI {
  mot: string
  classe: string | string[]
  detail?: string
  indice: string
  genre: MotGenre
  nombre: MotNombre
}
