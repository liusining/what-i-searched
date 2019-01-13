package mydb

import (
	"fmt"
	"testing"
	"time"
)

func TestCreateRecord(t *testing.T) {
	timestamp := fmt.Sprintf("%d", time.Now().Unix()*1000)
	db := NewDB()
	err := CreateRecord(db, timestamp, "test create record")
	if err != nil {
		t.Errorf("CreateRecord() err: %s\n", err)
	}
}
