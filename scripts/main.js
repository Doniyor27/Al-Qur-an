search.onkeyup = async (event) => {
  try {
      if(event.keyCode == 13) {
      let response = await fetch(`https://api.quran.sutanlab.id/surah/${search.value}`)
      let translate = await fetch(`https://quranenc.com/api/translation/sura/uzbek_mansour/${search.value}`)
      response = await response.json()
      translate = await translate.json()

      if(response.code != 200) throw new Error('Server error!')

        let { data: { verses }} = response
        let { result: tafsirs } = translate

      title.textContent = (response.data.name.transliteration.en)
      res.innerHTML = null

      for(let i=0; i<verses.length; i++) {

        let li=document.createElement('li')
        let h2=document.createElement('h2')
        let h4=document.createElement('h4')

        h2.textContent = `${verses[i].text.arab} (${+i + 1})`
        h4.textContent = tafsirs[i].translation
        li.append(h2)
        li.append(h4)
        res.append(li)

        li.onclick = () => {
          audio_wrapper.innerHTML = null
          let audio = document.createElement('audio')
          let source = document.createElement('source')
          source.src = verses[i].audio.primary
          audio.append(source)
          audio_wrapper.append(audio)
          audio.play()

          let actives = document.querySelectorAll('.active')
          actives.forEach(el => el.classList.remove('active'))
          li.classList.add('active')
        }
        
      }

      let index = 0
      function readQuranAyats (index) {
        let actives = document.querySelectorAll('.active')
        actives.forEach(el => el.classList.remove('active'))

        let items = document.querySelectorAll('li')
        items[index].classList.add('active')
        let audio = document.createElement('audio')
        let source = document.createElement('source')
        source.src = verses[index].audio.primary
        audio.append(source)
        audio_wrapper.append(audio)
        audio.play()
        audio.onended = () => {
          if(index < verses.length) {
            return readQuranAyats(index +1)
          }
        }
      }
      readAll.onclick = () => {
        readQuranAyats(index)
      }
    }
  } catch(error) {
    console.log(error.message);
  }
}