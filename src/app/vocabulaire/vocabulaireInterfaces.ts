export interface Theme {
    theme: number | string;
    semaines?: any;
    mots?: Mot[]
}

export interface Semaine {
    semaine: number;
    groupes: Groupe[];
}

export interface Groupe {
    indice: string;
    mots: Mot[];

}

type MotClasse = "ADJ" | "V" | "NF" | "NM" | "MI" | "INV" | "DET" | "PORN"

export interface Mot {
    mot: string,
    classe: MotClasse | MotClasse[] | string
    fem?: string
    detail?: string
    indice?: string
    genre?: "MAS" | "FEM"
}