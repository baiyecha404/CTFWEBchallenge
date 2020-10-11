package main

import (
	"crypto/rsa"
	"crypto/tls"
	"crypto/x509"
	"encoding/base64"
	"fmt"
	"io/ioutil"
	"net/http"
	"time"

	"github.com/dgrijalva/jwt-go"
)

func extractCertificatesX5U(x5u string) ([]*x509.Certificate, error) {
	c := &http.Client{
		Timeout: 5 * time.Second,
		Transport: &http.Transport{
			TLSClientConfig: &tls.Config{
				InsecureSkipVerify: true,
			},
		},
	}
	resp, err := c.Get(x5u)
	if err != nil {
		return nil, fmt.Errorf("failed to get certificate url. %w", err)
	}
	defer resp.Body.Close()

	rawCrt, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to load body of certificate. %w", err)
	}

	return parseCRT(rawCrt)
}

func extractCertificatesX5C(x5c []interface{}) ([]*x509.Certificate, error) {
	var certs []*x509.Certificate
	for _, encodedCert := range x5c {
		rawCert, err := base64.StdEncoding.DecodeString(encodedCert.(string))
		if err != nil {
			return nil, err
		}
		cert, err := x509.ParseCertificate(rawCert)
		if err != nil {
			return nil, err
		}
		certs = append(certs, cert)
	}
	return certs, nil
}

func extractCertificateChainFromHeader(token *jwt.Token) ([]*x509.Certificate, bool) {
	for k, v := range token.Header {
		if k == "x5u" || k == "x5c" {
			var certs []*x509.Certificate
			var err error
			if k == "x5u" {
				certs, err = extractCertificatesX5U(v.(string))
			} else if k == "x5c" {
				certs, err = extractCertificatesX5C(v.([]interface{}))
			}
			return certs, err == nil
		}
	}
	return nil, false
}

func validateTokenHeader(token *jwt.Token, rootPool *x509.CertPool) bool {
	// signing method must be RS256.
	if _, ok := token.Method.(*jwt.SigningMethodRSA); !ok {
		return false
	}

	// if x509 certs are specified in the JWT header,
	// they must be verified with our root CA!
	certs, ok := extractCertificateChainFromHeader(token)
	return !ok || verifyCertificates(certs, rootPool)
}

func generateKeySelector(defaultKey *rsa.PublicKey) func(*jwt.Token) (interface{}, error) {
	return func(token *jwt.Token) (interface{}, error) {
		// if x509 cert(s) are specified in the JWT header, use the first cert of them.
		certs, ok := extractCertificateChainFromHeader(token)
		if ok {
			firstKey, ok := certs[0].PublicKey.(*rsa.PublicKey)
			if !ok {
				return nil, fmt.Errorf("not a RSA public key")
			}
			return firstKey, nil
		}

		// if no keys are specified, use default key to validate.
		return defaultKey, nil
	}
}
