package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
)

func main() {
	flag := os.Getenv("FLAG")

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		uid := r.Header.Get("x-auth-uid")
		issuer := r.Header.Get("x-auth-issuer")
		role := r.Header.Get("x-auth-role")

		w.Header().Set("Content-Type", "text/html")
		fmt.Fprintf(w, "<h1>Service A</h1>")
		fmt.Fprintf(w, "<p>hello! you are %s from %s, right?</p>", uid, issuer)
		fmt.Fprintf(w, `<a href="/proxy/logout">logout</a>`)
		if role == "admin" {
			fmt.Fprintf(w, "The flag is: %s", flag)
		}
	})

	addr := ":80"
	log.Printf("Listening at %s", addr)
	log.Fatal(http.ListenAndServe(addr, nil))
}
