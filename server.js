const path = require("path");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "client2", "build")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client2", "build", "index.html"));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

