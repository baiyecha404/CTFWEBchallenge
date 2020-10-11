package main

import (
	//	"github.com/dgrijalva/jwt-go"

	"crypto/x509"
	"encoding/base64"
	"encoding/pem"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
)

func waitFile(path string) {
	for {
		if _, err := os.Stat(path); os.IsNotExist(err) {
			time.Sleep(1 * time.Second)
		} else {
			break
		}
	}
}

func main() {
	// load private key
	waitFile("/cert/service-b.key")
	rawPrivateKey, err := ioutil.ReadFile("/cert/service-b.key")
	if err != nil {
		return
	}
	privateKeyBlock, _ := pem.Decode(rawPrivateKey)
	privateKey, err := x509.ParsePKCS1PrivateKey(privateKeyBlock.Bytes)
	if err != nil {
		return
	}

	// load certificate (that corresponds to the private key)
	waitFile("/cert/service-b.crt")
	rawCrt, err := ioutil.ReadFile("/cert/service-b.crt")
	if err != nil {
		return
	}
	certsKeyBlock, _ := pem.Decode(rawCrt)
	certs, err := x509.ParseCertificates(certsKeyBlock.Bytes)
	if err != nil {
		return
	}
	encodedCert := base64.StdEncoding.EncodeToString(certs[0].Raw)

	http.HandleFunc("/cert.crt", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "%s", string(rawCrt))
	})

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		log.Printf("default: %v", r)
		if r.Method == http.MethodPost {
			// get id from request
			if err := r.ParseForm(); err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
			params := r.PostForm

			// prepare JWT structure
			claims := jwt.MapClaims{
				"sub":    params.Get("id"),
				"role":   "user",
				"issuer": "service-b",
			}
			token := jwt.NewWithClaims(jwt.SigningMethodRS256, claims)

			if params.Get("param") == "x5u" {
				// use x5u claim to tell the proxy the following things.
				// - this token is signed by service B.
				// - the certificate that corresponds to the signing key is located at `/cert.crt`.
				token.Header["x5u"] = "http://service-b/cert.crt"
			} else {
				// use x5c claim to tell the proxy the following things.
				// - this token is signed by service B.
				// - the certificate that corresponds to the signing key is certs[0].
				token.Header["x5c"] = []string{encodedCert}
			}

			// sign & serialize JWT
			tokenStr, err := token.SignedString(privateKey)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				return
			}

			// pass the token to the proxy
			http.Redirect(w, r, fmt.Sprintf("%s?token=%s", os.Getenv("PROXY_TOKEN_ENDPOINT"), tokenStr), 302)
		} else {
			w.Header().Set("Content-Type", "text/html")
			fmt.Fprintf(w, "<h1>Log in to Service A from Service B</h1>")
			fmt.Fprintf(w, "This is service B, but you can log in to service A from here thanks to JWT! ")
			fmt.Fprintf(w, `<form method="POST">`)
			fmt.Fprintf(w, `<input type="text" name="id" placeholder="your name">`)
			fmt.Fprintf(w, `<select name="param"><option value="x5u">Use x5u in JWT</option><option value="x5c">Use x5c in JWT</option></select>`)
			fmt.Fprintf(w, `<input type="submit" value="Go">`)
			fmt.Fprintf(w, `</form>`)
		}
	})

	addr := ":80"
	log.Printf("Listening at %s", addr)
	log.Fatal(http.ListenAndServe(addr, nil))
}
