const express = require("express")
const app = express()
const path = require("path")
app.set("view engine","ejs")
app.use(express.json())
const fs = require("fs")

app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,"public")))

app.get('/',function(req,res){
    console.log("🔍 HOME ROUTE TRIGGERED - Reading files...")

    fs.readdir("./files",function(err,files){
        if(err){
            console.error("❌ ERROR reading files:", err.message)
            return res.status(500).send("Error reading files")
        }

        console.log("📁 FILES FOUND:", files)
        console.log("📊 Number of files:", files.length)
        res.render("index",{files:files})
    })
})

app.post("/create",function(req,res){
    fs.writeFile(`./files/${req.body.title.split(" ").join('')}.txt`,req.body.description,function(err){
    res.redirect("/")  
})
})

app.get("/files/",function(req,res){
    fs.readdir("./files",function(err,files){
        if(err){
            console.error("❌ ERROR reading files directory:", err.message)
            return res.status(500).send("Error reading files directory")
        }

        console.log("📁 FILES DIRECTORY:", files)
        res.send(`
            <h1>Files Directory</h1>
            <ul>
                ${files.map(file => `<li><a href="/files/${file}">${file}</a></li>`).join('')}
            </ul>
            <br><a href="/">← Back to Home</a>
        `)
    })
})

app.get("/files/:filename",function(req,res){
    const filePath = `./files/${req.params.filename}`

    fs.readFile(filePath, "utf-8", function(err, filedata){
        if(err){
            console.error("❌ ERROR reading file:", err.message)
            return res.status(404).send("File not found")
        }

        console.log("📖 FILE CONTENT:", filedata)
        res.send(`
            <h1>File: ${req.params.filename}</h1>
            <pre>${filedata}</pre>
            <br><a href="/files/">← Back to Files</a>
            <br><a href="/">← Back to Home</a>
        `)
    })
})

app.listen(3000,()=>{
    console.log("🚀 Server is running on port 3000")
    console.log("📡 Visit http://localhost:3000 to trigger file reading")
})
