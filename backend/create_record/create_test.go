package main

import (
	"context"
	"fmt"
	"testing"
	"time"

	"github.com/aws/aws-lambda-go/events"
)

func TestCreate(t *testing.T) {
	ctx := context.Background()
	e := events.APIGatewayProxyRequest{
		Body: fmt.Sprintf("{\"timestamp\":\"%d\",\"keywords\":\"test test test\"}", time.Now().Unix()*1000),
	}
	resp, err := create(ctx, e)
	if err != nil {
		fmt.Printf("response: %#v\n", resp)
		t.Errorf("create() err: %s\n", err)
		return
	}
	if resp.StatusCode != 200 {
		fmt.Printf("response: %#v\n", resp)
		t.Errorf("wrong reponse!")
	}
}
