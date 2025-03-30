package main

import (
	"embed"
	"fmt"
	"io/fs"
	"log"
	"net/http"
	"os/exec"
	"runtime"
)

//go:embed build/* build/images/* build/static/* build/static/js/* build/static/css/*
var content embed.FS

func main() {
	openBrowser("http://localhost:3000")

	subFS, err := fs.Sub(content, "build")
	if err != nil {
		log.Fatal(err)
	}

	http.Handle("/", http.FileServer(http.FS(subFS)))

	fmt.Println("Сайт доступний за адресою http://localhost:3000")
	log.Fatal(http.ListenAndServe(":3000", nil))
}

func openBrowser(url string) {
	var cmd string
	var args []string

	switch runtime.GOOS {
	case "windows":
		cmd = "cmd"
		args = []string{"/c", "start", url}
	case "darwin":
		cmd = "open"
		args = []string{url}
	default:
		cmd = "xdg-open"
		args = []string{url}
	}

	exec.Command(cmd, args...).Start()
}
