clean:
	rm -rf node_modules
	rm -rf bin

go:
	PORT=8000 go run ./api/*.go

go-build:
	go build -o bin -v ./api

react-build:
	rm -rf ./static/bundle
	npm run build

react-dev:
	rm -rf ./static/bundle
	npm run dev

lint:
	npm run lint
	gofmt -l -w .