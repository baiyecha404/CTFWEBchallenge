package main

import (
	"crypto/x509"
	"encoding/pem"
	"fmt"
)

func parseCRT(rawCrt []byte) ([]*x509.Certificate, error) {
	certsKeyBlock, _ := pem.Decode(rawCrt)
	if certsKeyBlock == nil {
		return nil, fmt.Errorf("failed to decode cert")
	}
	if certsKeyBlock.Type != "CERTIFICATE" {
		return nil, fmt.Errorf("invalid keyblock type: %s", certsKeyBlock.Type)
	}
	certs, err := x509.ParseCertificates(certsKeyBlock.Bytes)
	if err != nil {
		return nil, fmt.Errorf("failed to parse cert: %w", err)
	}
	return certs, nil
}

func verifyCertificates(certs []*x509.Certificate, rootPool *x509.CertPool) bool {
	if len(certs) == 0 {
		return false
	}

	intermediatePool := x509.NewCertPool()
	for i, cert := range certs {
		if i > 0 {
			intermediatePool.AddCert(cert)
		}
	}

	opts := x509.VerifyOptions{
		Roots:         rootPool,
		Intermediates: intermediatePool,
	}

	if _, err := certs[0].Verify(opts); err != nil {
		return false
	}

	return true
}
