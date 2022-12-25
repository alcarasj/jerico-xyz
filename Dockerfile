FROM golang:alpine as builder

FROM scratch
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
ADD bin/api .
ADD static static
ADD templates templates
ADD package.json package.json
ENTRYPOINT ["/api"]