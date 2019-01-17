package mydb

import (
	"fmt"
	"testing"
	"time"
)

func TestCreateRecord(t *testing.T) {
	timestamp := fmt.Sprintf("%d", time.Now().Unix()*1000)
	db := NewDB()
	err := CreateRecord(db, timestamp, "test create record", "test-engine.com")
	if err != nil {
		t.Errorf("CreateRecord() err: %s\n", err)
	}
}

func TestGetCount(t *testing.T) {
	db := NewDB()
	count, err := GetCount(db)
	if err != nil {
		t.Errorf("GetCount() err: %s\n", err)
	}
	fmt.Printf("Count is %d\n", count)
}
