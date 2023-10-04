export interface Theme {
  theme: number
  description: string
  semaines?: any
  series?: Serie[]
  mots?: MotTI[]
}

export interface Serie {
  id: number
  mots: MotTI[]
}

export interface Semaine {
  semaine: number
  groupes: Groupe[]
}

export interface Groupe {
  indice: string
  mots: MotTI[]
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
  FEMININ = 2,
  EPICENE = 3
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
  alt?: string
  classe: string | string[]
  detail?: string
  indice: string
  genre: MotGenre
  nombre: MotNombre
}
