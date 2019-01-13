package main

import (
	"fmt"
	"log"
	"strconv"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/liusining/what-i-searched/backend/mydb"
)

func main() {
	lambda.Start(get)
}

func get() (events.APIGatewayProxyResponse, error) {
	resp := events.APIGatewayProxyResponse{}
	db := mydb.NewDB()
	count, err := mydb.GetCount(db)
	if err != nil {
		errStr := fmt.Sprintf("get count: %s", err)
		log.Printf(errStr)
		e := mydb.TellMe("What I Searched Error", fmt.Sprintf("[get] error: %s\n", errStr))
		if e != nil {
			log.Printf("send sns msg: %s\n", e)
		}
		resp.StatusCode = 400
		resp.Body = errStr
		return resp, err
	}
	resp.StatusCode = 200
	resp.Body = strconv.FormatInt(count, 10)
	return resp, nil
}
