import React, { Component } from 'react'
import './App.css'
class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      message: '',
      mod: null,
      inst: null
    }
  }

  async componentDidMount () {
    WebAssembly.instantiateStreaming(fetch("pdfcpu.wasm"),window.go.importObject).then((result) => {
      window.go.argv = ['pdfcpu.wasm', 'trim', '-pages', '1', '/test.pdf', '/first_page.pdf'];
            var st = Date.now();
            window.go.run(result.instance);
    })
    // WebAssembly.instantiateStreaming = async (resp, importObject) => {
    //   const source = await (await resp).arrayBuffer()
    //   return await WebAssembly.instantiate(source, importObject)
    // }
    // let { instance, module } = await WebAssembly.instantiateStreaming(fetch("main.wasm"), window.go.importObject)
    // await window.go.run(instance)
    // // saving to state.. tsk tsk not sure its the most optimal but i guess it works?? also, the value isnt that "big" anyway
    // this.setState({
    //   mod: module,
    //   inst: instance
    // })
  }

  handleChange = e => {
    e.preventDefault()
    this.setState({
      message: e.target.value
    })
  }

  handleSubmit = async e => {
    e.preventDefault()
    window.sayHelloJS(this.state.message)
  }

  render () {
    return (
      <div className='App'>
        <form>
          <input
            type='text'
            name=''
            id='userInput'
            onChange={e => this.handleChange(e)}
            style={{ marginTop: '100px' }}
          />
          <br />
          <button type='submit' onClick={e => this.handleSubmit(e)}>
            Click me to see MAGIC!!
          </button>
        </form>
        <br />
        <span id='message'>
          Ayomide Onigbinde wrote this!!😉...💕 from WebAssembly and Golang
        </span>
      </div>
    )
  }
}

export default App
