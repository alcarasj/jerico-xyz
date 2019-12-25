GO_BUILD_ENV := CGO_ENABLED=0 GOOS=linux GOARCH=amd64
DOCKER_BUILD=$(shell pwd)/.docker_build
DOCKER_CMD=$(DOCKER_BUILD)/jerico-xyz

$(DOCKER_CMD): clean
	mkdir -p $(DOCKER_BUILD)
	$(GO_BUILD_ENV) go build -v -o $(DOCKER_CMD) .

clean:
	rm -rf $(DOCKER_BUILD)
	rm -rf node_modules
	rm -rf bin

heroku: $(DOCKER_CMD)
	heroku container:push web

go:
	PORT=8000 go run main.go

go-build:
	go build -o bin/jerico-xyz -v .

react-build:
	npm run build

react-dev:
	npm run dev

deploy:
	git push heroku master