clean:
	rm -rf static/bundle
	rm -rf bin
	rm -rf tmp

go:
	rm -rf bin
	go build -o ./bin/api -v ./api
	PORT=8000 ./bin/api

go-race:
	PORT=8000 go -race run ./api/*.go

go-prod:
	rm -rf bin
	go build -o ./bin/api -v ./api
	PORT=8000 MODE=PRODUCTION ./bin/api

go-debug-config:
	PORT=8000 MODE=DEBUG node ./scripts/generate-go-debug-config.js

go-build:
	rm -rf bin
	GOOS=linux GOARCH=amd64 go build -o ./bin/api -v ./api

react-build:
	rm -rf ./static/bundle
	npm run build

react-dev:
	rm -rf ./static/bundle
	npm run dev

lint:
	npm run lint
	gofmt -l -w .

docker-env-file:
	PORT=8000 MODE=CONTAINER node ./scripts/generate-docker-env-file.js

docker-build:
	make go-build
	make react-build
	docker build --platform linux/amd64 -t jerico-xyz:latest .

docker-build-arm64:
	make go-build
	make react-build
	docker build --platform linux/arm64 -t jerico-xyz:latest .

docker-run-local:
	make docker-env-file
	docker run -it -p 8000:8000 --env-file xyz.env jerico-xyz:latest

dockerhub-push:
	docker login
	docker tag jerico-xyz:latest alcarasj/jerico-xyz:latest
	docker push alcarasj/jerico-xyz