import vocabulaire from '../../resources/vocabulaire.json'
import stValentin from '../../resources/themes1.json'
import theme4 from '../../resources/vocabulaire_th4.json'
import theme5 from '../../resources/vocabulaire_th5.json'
import { Theme } from './vocabulaireInterfaces'
import JSON5 from 'json5'

//const themes: Theme[] = vocabulaire
const themes: Theme[] = []

const getVocabularyAsset = (file: string) => {
  fetch(file)
    .then(response => response.text())
    .then(text => {
      // Do something with your data
      //console.log(text)
      let data = JSON5.parse(text)
      //console.log(data)
      themes.push(...data)
    })
}

//JSON5.parse(text2)

//themes.push(...theme4, ...theme5, ...stValentin)

getVocabularyAsset('./assets/voc4_th1.json5')
getVocabularyAsset('./assets/voc4_th2.json5')

export default themes
