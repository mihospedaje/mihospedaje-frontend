import React, { Component } from 'react';
//import config from '../config.js'

class App extends Component {
  uploadImage() {
    const r = new XMLHttpRequest()
    const d = new FormData()
    const e = document.getElementsByClassName('input-image')[0].files[0]
    var u

    d.append('image', e)

    r.open('POST', 'https://api.imgur.com/3/image/')
    r.setRequestHeader('Access-Control-Allow-Headers','http://10.203.169.156:3000/')
    r.setRequestHeader('a545b95986cee31', `f53af107aa7df5dcc90e8da828e10fc21ba32744`)
    r.onreadystatechange = function () {
      if(r.status === 200 && r.readyState === 4) {
        let res = JSON.parse(r.responseText)
        u = `https://i.imgur.com/${res.data.id}.png`

        const d = document.createElement('div')
        d.className = 'image'
        document.getElementsByTagName('body')[0].appendChild(d)

        const i = document.createElement('img')
        i.className = 'image-src'
        i.src = u
        document.getElementsByClassName('image')[0].appendChild(i)

        const a = document.createElement('a')
        a.className= 'image-link'
        a.href = u
        document.getElementsByClassName('image')[0].appendChild(a)

        const p = document.createElement('p')
        p.className = 'image-url'
        p.innerHTML = u
        document.getElementsByClassName('image-link')[0].appendChild(p)
      }
    }
    r.send(d)
  }
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img className="App-logo" alt="logo" />
          <h2>Elige una imagen para subir a Imgur</h2>
        </div>
        <form>
          <input type="file" className="input-image" onChange={this.uploadImage.bind(this)}/>
        </form>
      </div>
    );
  }
}

export default App;
