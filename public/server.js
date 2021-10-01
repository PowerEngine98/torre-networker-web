require('dotenv').config()
const express = require('express')
const app = express()
const fetch = require('node-fetch')

const {
    app_port,
    bio_profile_url,
    search_people_url
} = process.env

app.listen(app_port, () => {
    console.clear()
    console.log('-------------------------------')
    console.log()
    console.log('Torre - Networker')
    console.log()
    console.log('-------------------------------')
    console.log('Server listening to port ' + app_port)
    console.log('Local time: ' + new Date().toLocaleString())
})

//Cors middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', '*')
    res.header('Access-Control-Allow-Methods', '*')
    if (req.method == 'OPTIONS') {
        res.sendStatus(200)
    }
    else {
        next()
    }
})

//Json body
app.use(express.json())

//Proxy

let headers = {
    'Content-Type': 'application/json'
}

app.post('/api/user/', async (req, res) => {
    try {
        let body = req.body
        if (!body) {
            return res.status(400).json({ error: 'missing payload' })
        }
        const { username, organizations } = body
        if (!username) {
            return res.status(400).json({ error: 'invalid username' })
        }
        if (!organizations || !Array.isArray(organizations)) {
            return res.status(400).json({ error: 'invalid organizations array' })
        }
        let user = await getUser(username)
        if (!user) {
            return res.sendStatus(404)
        }
        res.json(user)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.post('/api/organizations/', async (req, res) => {
    try {
        let body = req.body
        if (!body) {
            return res.status(400).json({ error: 'missing payload' })
        }
        const { user_organizations, users, organizations, limit, limit_per_organization } = body
        if (!user_organizations || !Array.isArray(user_organizations)) {
            return res.status(400).json({ error: 'invalid user_organizations array' })
        }
        if (!users || !Array.isArray(users)) {
            throw new ApiError(ErrorCode.BAD_REQUEST, 'invalid users array')
        }
        if (!organizations || !Array.isArray(organizations)) {
            return res.status(400).json({ error: 'invalid organizations array' })
        }
        if (!Number.isInteger(Number(limit))) {
            return res.status(400).json({ error: 'invalid limit' })
        }
        if (!Number.isInteger(Number(limit))) {
            return res.status(400).json({ error: 'invalid limit_per_organization' })
        }
        res.json(await getOrganizations(user_organizations, organizations, users, limit, limit_per_organization))
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

async function getUser(username) {
    let user_bio = await fetch(bio_profile_url + username).then(res => res.json())
    let person = user_bio.person
    if (!person) {
        return undefined
    }
    let user = {
        id: person.publicId,
        name: person.name,
        username: person.publicId,
        headline: person.professionalHeadline,
        weight: person.weight,
        photo: person.pictureThumbnail,
    }
    //Flatten the job organizations where the user had infuence
    user.organizations = user_bio.experiences
        .filter(experience => experience.category == 'jobs')
        .reduce((organizations, experience) => organizations.concat(experience.organizations.map(organization => organization.name)), [])
        .filter((organization_name, index, array) => array.indexOf(organization_name) == index)
    return user
}

async function getOrganizations(user_organizations, organizations, users, limit, limit_per_organization) {
    let total = 0
    async function getOrganizationMembers(organization_name) {
        if (total >= limit) {
            return []
        }
        let options = {
            organization: {
                term: organization_name
            }
        }
        let search_result = await fetch(search_people_url, {
            method: 'post',
            body: JSON.stringify(options),
            headers: headers
        }).then(res => res.json())
        let members = []
        if (search_result.results) {
            let results = search_result.results
                .filter(result => !users.includes(result.username))
                .sort((r1, r2) => r2.weight - r1.weight)
                .slice(0, limit_per_organization)
            for (let result of results) {
                users.push(result.username)
                members.push(getUser(result.username))
                total++
                if (total >= limit) {
                    break
                }
            }
        }
        return Promise.all(members)
    }
    //Get the organization names that have not been loaded before removing repeated organizations
    let organization_names = user_organizations.filter(organization_name => !organizations.includes(organization_name))
    let results = []
    for (let organization_name of organization_names) {
        let organization = {
            name: organization_name,
            members: await getOrganizationMembers(organization_name)
        }
        if (organization.members.length > 0) {
            results.push(organization)
        }
    }
    return Promise.all(results)
}

//Serve the web app
app.use(express.static(__dirname))

app.get('/*', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})