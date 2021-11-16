export interface Theme {
    theme: number;
    semaines: any;

}

export interface Semaine {
    semaine: number;
    groupes: Groupe[];
}

export interface Groupe {
    indice: string;
    mots: Mot[];

}

type MotClasse = "ADJ" | "V" | "NF" | "NM" | "MI"

export interface Mot {
    mot: string,
    classe: MotClasse | MotClasse[]
    fem?: string
    detail?: string
}