const express = require('express')
const path = require('path')
const hbs = require('hbs')
const fs = require('fs')
const bent = require('bent')

const getJSON = bent('json')

const app = express()

const packageJson = fs.readFileSync('./package.json')

const version = JSON.parse(packageJson).dependencies || 0

// Define paths for Express config
const viewsPath = path.join(__dirname, './views')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
app.use(express.json())

// Server port
const PORT = 3000
const URL = 'https://nodejs.org/dist/index.json'
app.get('/dependencies',(req,res) => {

    res.render('dependencies', {
        title : 'Dependeincies used in this app',
        version : version
    })

})

 app.get('/minimum-secure',async (req,res) => {

    try {
        var versions ={}
        let jsonArrayObject = await getJSON(URL)

        for(i in jsonArrayObject){
            if(jsonArrayObject[i].security){
                versions["v"+i]=jsonArrayObject[i]
            }
        }
        res.send(versions)

    } catch (error) {
        res.send("Error")
    }
})
app.get('/latest-releases',async (req,res) => {

    try {
        var resLatestReleases = {}
        let jsonArrayObject = await getJSON(URL)
        for(i in jsonArrayObject){
            var verString = jsonArrayObject[i].version
            var version = verString.split(".")[0];
            resLatestReleases[version]=jsonArrayObject[i]
        }
        res.send(resLatestReleases)

    } catch (error) {
        res.send("Error")
    }

})

app.listen(PORT)

// Expose 'app' so it can be reused for testing 
exports = module.exports = app;