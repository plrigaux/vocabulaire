import vocabulaire from '../../resources/vocabulaire.json'
import stValentin from '../../resources/themes1.json'
import theme4 from '../../resources/vocabulaire_th4.json'
import theme5 from '../../resources/vocabulaire_th5.json'
import { Theme } from './vocabulaireInterfaces'
import JSON5 from 'json5'

//const themes: Theme[] = vocabulaire
const themes: Theme[] = []

const getVocabularyAsset = (file: string): Promise<any> => {
  return fetch(file)
    .then(response => response.text())
    .then(text => {
      // Do something with your data
      //console.log(text)
      let data : any = JSON5.parse(text)
      //console.log(data)
      return data
    }).catch(console.error);
}

//JSON5.parse(text2)

//themes.push(...theme4, ...theme5, ...stValentin)
Promise.all([
  getVocabularyAsset('./assets/voc4_th1.json5'),
  getVocabularyAsset('./assets/voc4_th2.json5'),
  getVocabularyAsset('./assets/voc4_th3.json5')
]).then(data => {

  data.forEach(inData => {

    if (Array.isArray(inData)) {
      inData.forEach(ininData => {
        themes.push(ininData)
      })
    } else {
      themes.push(inData)
    }
  })
  console.log(themes)
})

//export default themes
