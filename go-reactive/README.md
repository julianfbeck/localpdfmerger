### What, why?
Have you ever wanted to build something with WebAssembly and Go, as a React dev but scratch your head in confusion on how to start? Well, I had the same problem. This was why I decided to write this.


### Whats it based on?
Since create-react-app already did the heavyweight work on creating a new React project, I decided to use it. Although I had to eject. This isnt recommended unless you REALLY know what you're doing. But I had to. So be careful with the Webpack config.

Also for now, it uses the default Go compiler. I hope to use [tinygo](https://tinygo.org) so as to reduce the size of the compiled `.wasm` file

### Requirement
* npm/yarn as deemed fit (I used yarn for this though)
* Go 1.12+ (I built this with v1.12.7)
* Wasm supported browser. (I use brave as my daily driver and used it to test/run this).

### How to run
* clone this repo
* cd into the `src` folder and run ```GOOS=js GOARCH=wasm go build -o ../client/public/main.wasm```
* cd into the `client` folder (preferrably in a different terminal window/tab) and run: ```yarn start```
* Open `http://localhost:3000` and have fun 😉😉

## Project Structure
`src` folder contains the ```main.go``` file which we're compiling to WebAssembly.
`client` contains the normal (ejected) React app files and folders.

### Milestone
 [ ] Bash/Make file to install/build using tinygo
 [ ] DockerFile??
