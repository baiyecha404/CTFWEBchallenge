FROM golang:1.14-alpine AS builder

WORKDIR /go/src/auth
COPY . .
RUN go get && GOARCH=amd64 CGO_ENABLED=0 GOOS=linux go build -ldflags='-s -w -extldflags "-static"' -o=./server

FROM scratch

COPY --from=builder /go/src/auth/server /server
CMD ["/server"]