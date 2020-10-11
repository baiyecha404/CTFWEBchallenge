package main

import (
	"crypto/x509"
	"encoding/pem"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
)

const (
	AUTH_TOKEN_COOKIE = "auth_token"
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
	// load CA cert
	waitFile("/cert/root.crt")
	rawCrt, err := ioutil.ReadFile("/cert/root.crt")
	if err != nil {
		panic("failed to load root cert. " + err.Error())
	}
	certs, err := parseCRT(rawCrt)
	if err != nil {
		panic("failed to load root cert. " + err.Error())
	}
	rootCert := certs[0]

	// load private key
	waitFile("/cert/root.key")
	rawPrivateKey, err := ioutil.ReadFile("/cert/root.key")
	if err != nil {
		panic("failed to load private key of root cert. " + err.Error())
	}
	privateKeyBlock, _ := pem.Decode(rawPrivateKey)
	if privateKeyBlock == nil {
		panic("failed to decode key")
	}
	if privateKeyBlock.Type != "RSA PRIVATE KEY" {
		panic("invalid keyblock type: " + privateKeyBlock.Type)
	}
	privateKey, err := x509.ParsePKCS1PrivateKey(privateKeyBlock.Bytes)
	if err != nil {
		panic("failed to load private key of root cert. " + err.Error())
	}
	rootPool := x509.NewCertPool()
	rootPool.AddCert(rootCert)

	http.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {
		log.Printf("login: %v", r)

		if r.Method == http.MethodPost {
			if err := r.ParseForm(); err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
			params := r.PostForm

			claims := jwt.MapClaims{
				"sub":    params.Get("id"),
				"role":   "user",
				"issuer": "proxy",
			}
			token := jwt.NewWithClaims(jwt.SigningMethodRS256, claims)
			tokenStr, err := token.SignedString(privateKey)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				return
			}

			http.SetCookie(w, &http.Cookie{
				Name:  AUTH_TOKEN_COOKIE,
				Value: tokenStr,
				Path:  "/",
			})
			http.Redirect(w, r, "/", 302)
		} else {
			w.Header().Set("Content-Type", "text/html")
			fmt.Fprintf(w, "<h1>Log in to Service A</h1>")
			fmt.Fprintf(w, `You should enter your name before access to our cool application!`)
			fmt.Fprintf(w, `<form method="POST"><input type="text" name="id" placeholder="your name"><input type="submit" value="Go"></form>`)
		}
	})

	http.HandleFunc("/validate", func(w http.ResponseWriter, r *http.Request) {
		log.Printf("validate: %v", r)

		var authToken string
		ok := false
		for _, cookie := range r.Cookies() {
			if cookie.Name == AUTH_TOKEN_COOKIE {
				authToken = cookie.Value
				ok = true
			}
		}
		if !ok {
			// there's no auth token in cookies.
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		token, err := jwt.Parse(authToken, generateKeySelector(&privateKey.PublicKey))
		if err != nil {
			// auth token is weird.
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		if ok := validateTokenHeader(token, rootPool); !ok {
			// the header seems to be broken.
			w.WriteHeader(http.StatusForbidden)
			return
		}

		if !token.Valid {
			// the signature is broken.
			w.WriteHeader(http.StatusForbidden)
			return
		}

		claims := token.Claims.(jwt.MapClaims)
		w.Header().Set("x-auth-uid", claims["sub"].(string))
		w.Header().Set("x-auth-issuer", claims["issuer"].(string))
		w.Header().Set("x-auth-role", claims["role"].(string))
	})

	http.HandleFunc("/logout", func(w http.ResponseWriter, r *http.Request) {
		cookie := &http.Cookie{
			Name:    AUTH_TOKEN_COOKIE,
			Value:   "",
			Path:    "/",
			Expires: time.Unix(0, 0),
		}
		http.SetCookie(w, cookie)
		http.Redirect(w, r, "/", 302)
	})

	http.HandleFunc("/external", func(w http.ResponseWriter, r *http.Request) {
		params := r.URL.Query()
		token := params.Get("token")
		cookie := &http.Cookie{
			Name:  AUTH_TOKEN_COOKIE,
			Value: token,
			Path:  "/",
		}
		http.SetCookie(w, cookie)
		http.Redirect(w, r, "/", 302)
	})

	addr := ":80"
	log.Printf("Listening at %s", addr)
	log.Fatal(http.ListenAndServe(addr, nil))
}
