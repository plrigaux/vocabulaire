import vocabulaire from '../../resources/vocabulaire.json';
import stValentin from '../../resources/themes1.json';
import theme4 from '../../resources/vocabulaire_th4.json';
import theme5 from '../../resources/vocabulaire_th5.json';
import { Theme } from './vocabulaireInterfaces';
 
const themes: Theme[] = vocabulaire

themes.push( ...theme4, ...theme5, ...stValentin)

export default themes


