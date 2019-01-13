package mydb

import (
	"fmt"
	"strconv"
	"time"
	"log"
	"strings"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/sns"
	"github.com/aws/aws-sdk-go/aws/awserr"
)

const (
	tableName   = "what_i_searched"
	countColumn = "0"
	topicArn    = "arn:aws:sns:ap-northeast-1:129453598127:TellMeSomething"
)

var awsSns *sns.SNS

func init() {
	awsSession := session.Must(session.NewSession(&aws.Config{
		Region: aws.String("ap-northeast-1")}))
	awsSns = sns.New(awsSession)
}

// NewDB generate a new dynamodb client
func NewDB() *dynamodb.DynamoDB {
	awsSession := session.Must(session.NewSession(&aws.Config{
		Region: aws.String("ap-northeast-1")}))
	db := dynamodb.New(awsSession)
	return db
}

// CreateRecord upload a search record to DB
func CreateRecord(db *dynamodb.DynamoDB, timestamp, keywords string) error {
	u, err := strconv.ParseInt(timestamp[:len(timestamp)-3], 10, 64)
	if err != nil {
		return fmt.Errorf("parse timestamp: %s", err)
	}
	zone := time.FixedZone("Asia/Beijing", 8*3600)
	uTime := time.Unix(u, 0).In(zone)
	humanDate := uTime.Format("2006-01-02")
	humanTime := uTime.Format("15:04:05 -0700")
	put := &dynamodb.Put{
		TableName: aws.String(tableName),
		Item: map[string]*dynamodb.AttributeValue{
			"Timestamp": {N: aws.String(timestamp)},
			"Date":      {S: aws.String(humanDate)},
			"Time":      {S: aws.String(humanTime)},
			"Keywords":  {S: aws.String(keywords)},
		},
	}
	update := &dynamodb.Update{ // update count
		ConditionExpression: aws.String("attribute_exists(#count)"),
		TableName:                 aws.String(tableName),
		ExpressionAttributeNames:  map[string]*string{"#count": aws.String("Count")},
		ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{":val": {N: aws.String("1")}},
		Key:                       map[string]*dynamodb.AttributeValue{"Timestamp": {N: aws.String(countColumn)}},
		UpdateExpression:          aws.String("SET #count = #count + :val"),
	}
	write := &dynamodb.TransactWriteItemsInput{
		ClientRequestToken: aws.String(timestamp),
		TransactItems: []*dynamodb.TransactWriteItem{
			{
				Put: put,
			},
			{
				Update: update,
			},
		},
	}
	_, err = db.TransactWriteItems(write)
	if err != nil {
		if awsErr, ok := err.(awserr.Error); ok {
			log.Printf("handling AWS err: (code) %s, (msg) %s\n", awsErr.Code(), awsErr.Message())
			if awsErr.Code() == "TransactionCanceledException" && strings.Contains(awsErr.Message(), "ConditionalCheckFailed") {
				putCount := &dynamodb.Put{ // set up count
					TableName: aws.String(tableName),
					Item: map[string]*dynamodb.AttributeValue{
						"Timestamp": {N: aws.String(countColumn)},
						"Count": {N: aws.String("1")},
					},
				}
				write.TransactItems[1] = &dynamodb.TransactWriteItem{Put: putCount}
				write.ClientRequestToken = aws.String("init")
				_, err = db.TransactWriteItems(write)
				if err != nil {
					return err
				}
				return nil
			}
		}
		return err
	}
	return nil
}

// TellMe send sns message to my email
func TellMe(subject, message string) error {
	input := &sns.PublishInput{
		Message:  aws.String(message),
		TopicArn: aws.String(topicArn),
		Subject:  aws.String(subject),
	}
	_, err := awsSns.Publish(input)
	if err != nil {
		return err
	}
	return nil
}
