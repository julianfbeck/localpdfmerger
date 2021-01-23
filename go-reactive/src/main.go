package main

import (
	"fmt"
	"syscall/js"
)

var c chan bool

func init() {
	fmt.Println("Hello, WebAssembly!")
	c = make(chan bool)
}

func main() {
	js.Global().Set("sayHelloJS", js.FuncOf(SayHello))
	println("Done.. done.. done...")
	<-c
}

// SayHello simply set the textConent of our element based on the value it receives (i.e the value from the input box)
// the element MUST exist else it'll throw an exception
func SayHello(jsV js.Value, inputs []js.Value) interface{} {
	message := inputs[0].String()
	h := js.Global().Get("document").Call("getElementById", "message")
	h.Set("textContent", message)
	return nil
}
