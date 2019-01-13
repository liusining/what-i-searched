package main

import (
	"fmt"
	"testing"
)

func TestGet(t *testing.T) {
	resp, err := get()
	if err != nil {
		fmt.Printf("response: %#v\n", resp)
		t.Errorf("get() error: %s\n", err)
		return
	}
	if resp.StatusCode != 200 {
		fmt.Printf("response: %#v\n", resp)
		t.Errorf("wrong response")
	}
	fmt.Printf("count is %s\n", resp.Body)
}
