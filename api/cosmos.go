package main

import "time"

type CosmosDBPersistence struct {
	Host                   string
	DatabaseName           string
	ContainerName          string
	AzureADTenantID        string
	AzureADAppClientID     string
	AzureADAppClientSecret string
	AzureADToken           *AzureADToken
	URL                    string
	RetryAmount            int
	RetryIntervalSecs      int
}

func InitCosmosDBPersistence(config MainConfig) (*CosmosDBPersistence, error) {
	// TO-DO
	return nil, nil
}

func (p CosmosDBPersistence) GetDatabaseInfo() error {
	// TO-DO
	return nil
}

func (p CosmosDBPersistence) ModifyDocumentByID(id string, data interface{}, rev string) error {
	// TO-DO
	return nil
}

func (p CosmosDBPersistence) GetDocumentByID(id string) (Document, error) {
	// TO-DO
	return nil, nil
}

func getAzureADToken(clientID string, clientSecret string) (*AzureADToken, error) {
	// TO-DO
	return nil, nil
}

func (t AzureADToken) isExpired() bool {
	return time.Now().Unix() > int64(t.ExpirationEpoch)
}
