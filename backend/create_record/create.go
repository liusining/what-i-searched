package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/liusining/what-i-searched/backend/mydb"
)

func main() {
	lambda.Start(create)
}

func create(ctx context.Context, e events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	resp := events.APIGatewayProxyResponse{}
	type body struct {
		Timestamp string `json:"timestamp"`
		Keywords  string `json:"keywords"`
		Engine    string `json:"engine"`
	}
	record := &body{}
	err := json.Unmarshal([]byte(e.Body), record)
	if err != nil {
		errStr := fmt.Sprintf("parse request body: %s\n", err)
		log.Printf(errStr)
		e := mydb.TellMe("What I Searched Error", fmt.Sprintf("[create] request body: %s\nerror: %s\n", e.Body, errStr))
		if e != nil {
			log.Printf("send sns msg: %s\n", e)
		}
		resp.StatusCode = 400
		resp.Body = errStr
		return resp, err
	}
	db := mydb.NewDB()
	err = mydb.CreateRecord(db, record.Timestamp, record.Keywords, record.Engine)
	if err != nil {
		errStr := fmt.Sprintf("upload record: %s\n", err)
		log.Printf(errStr)
		e := mydb.TellMe("What I Searched Error", fmt.Sprintf("[create] request body: %s\nerror: %s\n", e.Body, errStr))
		if e != nil {
			log.Printf("send sns msg: %s\n", e)
		}
		resp.StatusCode = 400
		resp.Body = errStr
		return resp, err
	}
	resp.StatusCode = 200
	resp.Body = "OK"
	return resp, nil
}
