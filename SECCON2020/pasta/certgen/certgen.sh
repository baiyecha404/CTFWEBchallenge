#!/bin/sh

# generate self-signed root CA.
# service named `auth` trust this root CA and use it for verifying x5u/x5c
mkdir -p /certs/root
openssl genrsa -out /certs/root/root.key 4096 
openssl req -x509 -new -nodes -key /certs/root/root.key -sha256 -days 1024 -out /certs/root/root.crt \
    -subj "/C=JP/ST=Tokyo/L=/O=SECCON/OU=CA/CN=ca.seccon.example/emailAddress="

# issue a certificate for `service-b` with the root CA
mkdir -p /certs/service-b
openssl genrsa -out /certs/service-b/service-b.key 4096     
openssl req -new -sha256 -key /certs/service-b/service-b.key -out /certs/service-b/service-b.csr \
    -subj "/C=JP/ST=Tokyo/L=/O=SECCON/OU=CA/CN=service-b.seccon.example/emailAddress="
openssl x509 -req -in /certs/service-b/service-b.csr -CA /certs/root/root.crt -CAkey /certs/root/root.key -CAcreateserial -out /certs/service-b/service-b.crt -days 1000 -sha256

# verify (for a test)
openssl verify -CAfile /certs/root/root.crt /certs/service-b/service-b.crt 