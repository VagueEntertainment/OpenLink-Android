
function oseed_auth(name, passphrase) {

    var http = new XMLHttpRequest()
    var url = "https://api.openseed.solutions/account.py"

    http.onreadystatechange = function () {
        if (http.readyState === 4) {

            if (http.responseText === 100) {
                console.log("Incorrect DevID")
            } else if (http.responseText === 101) {
                console.log("Incorrect AppID")
            } else {
                var raw = http.responseText
                if (raw.trim() !== "denied" || raw.trim() !== "-1") {
                    userid = raw.trim()
                    profile_steemName = name
                    window.username = name


                    save_user(userid, name, passphrase)
                    profile_check(userid)

                } else {
                    notify.themessage = "Password Incorrect"
                    notify.visible = true
                }
            }
        }
    }
    http.open('POST', url.trim(), true)
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    http.send("act=accountcheck&devid=" + devId + "&appid=" + appId
              + "&username=" + name + "&passphrase=" + passphrase)
}

function save_user(userid, name, passphrase) {

    window.userid = userid
    profile_steemName = name
    window.username = name

    var dataStr = "INSERT INTO openseed_account (id,name,passphrase) VALUES ('"
            + userid + "','" + name + "','" + passphrase + "')"
    db.transaction(function (tx) {
        tx.executeSql(dataStr)
    })
}

function heartbeat() {

    var http = new XMLHttpRequest()
    var url = "https://api.openseed.solutions/heartbeat.py"
    http.onreadystatechange = function () {

        if (http.readyState === 4) {
            if (http.responseText === "100") {
                console.log("Incorrect DevID")
            } else if (http.responseText === "101") {
                console.log("Incorrect AppID")
            } else {

                heart = http.responseText
                updateinterval = 5500
            }
        }

        if (heart == "OffLine") {
            updateinterval = 500 + updateinterval
        }
        heartbeats.interval = updateinterval
    }
    http.open('POST', url.trim(), true)
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    http.send("devid=" + devId + "&appid=" + appId + "&userid=" + userid)
}

function checkcreds(field, info) {

    var http = new XMLHttpRequest()
    var url = "https://api.openseed.solutions/account.py"
    http.onreadystatechange = function () {
        if (http.readyState === 4) {

            if (http.responseText === 100) {
                uniquemail = 100
                console.log("Incorrect DevID")
            } else if (http.responseText === 101) {

                uniquemail = 101
                console.log("Incorrect AppID")
            } else {

                if (field === "email") {
                    uniquemail = http.responseText
                }
                if (field === "username") {
                    uniquename = http.responseText
                }

                if (field === "account") {
                    uniqueaccount = http.responseText
                }

                if (field === "passphrase") {
                    uniqueid = http.responseText
                }
            }
        }
    }
    http.open('POST', url.trim(), true)
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    http.send("devid=" + devId + "&appid=" + appId + "&type=" + field + "&info=" + info)
}

function get_openseed_connections(account) {

    if (connections.length == 0) {
        var http = new XMLHttpRequest()
        var url = "https://api.openseed.solutions/connections.py"
        var raw
        http.onreadystatechange = function () {
            if (http.readyState === 4) {
                //console.log(http.responseText)
                if (http.responseText === 100) {
                    console.log("Incorrect DevID")
                } else if (http.responseText === 101) {
                    console.log("Incorrect AppID")
                } else {
                    raw = http.responseText
                    var data = raw.trim().split("\n")
                    contacts = data[0]
                    for (var num in data) {
                        if (num > 0) {
                            var dat = data[num].split(", ")
                            var theimg = ""
                            var thecontact = JSON.parse(
                                        dat[1].replace(/%3A/g,":")
                                        .replace(/%2C/g,",").replace(/%7B/g, "{")
                                        .replace(/%22/g, '"').replace(/%7D/g, "}")
                                        .replace(/%40/g, "@").replace(/%24/g, "$")
                                        .replace(/%3F/g, "?"))
                            var general = thecontact["data1"]
                            var steemProfile = thecontact["data5"]
                            if (steemProfile["profile"] !== undefined) {
                                theimg = steemProfile["profile"]["profile_image"]
                            }

                            addressBook.append({
                                                   "accountname": dat[0].split(
                                                       '"')[1],
                                                   "name": decodeURI(
                                                               general["name"]),
                                                   "img": theimg,
                                                   "about": decodeURI(
                                                                general["profession"]),
                                                   "company": decodeURI(
                                                                  general["company"]),
                                                   "index": num,
                                                   "openseed": true
                                               })
                        }
                    }
                }
            }
        }

        http.open('POST', url.trim(), true)
        http.setRequestHeader("Content-type",
                              "application/x-www-form-urlencoded")
        http.send('act=get_openseed&username=' + account)
    }
}

function get_profile(account) {

    var http = new XMLHttpRequest()
    var url = "https://api.openseed.solutions/connections.py"
    var raw
    http.onreadystatechange = function () {
        if (http.readyState === 4) {
            raw = http.responseText
            if (http.responseText === 100) {
                console.log("Incorrect DevID")
            } else if (http.responseText === 101) {
                console.log("Incorrect AppID")
            } else {
                raw = http.responseText
                //return raw
            }
        }
    }

    http.open('POST', url.trim(), false)
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    http.send('act=user_profile&username=' + account)

    if (raw.length > 10) {
        return raw
    } else {
        return '{"profile":"none"}'
    }
}

function get_steem_profile(account) {
    var http = new XMLHttpRequest()
    var url = "https://api.openseed.solutions/connections.py"
    var raw
    http.onreadystatechange = function () {
        if (http.readyState === 4) {
            raw = http.responseText
            if (http.responseText === 100) {
                console.log("Incorrect DevID")
            } else if (http.responseText === 101) {
                console.log("Incorrect AppID")
            } else {
                raw = http.responseText
                //return raw
            }
        }
    }

    http.open('POST', url.trim(), false)
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    http.send('act=profile_small&steem=' + account)

    if (raw.length > 10) {
        return raw
    } else {
        return '{"profile":"none"}'
    }
}

function create_user(username, email, passphrase, steemname) {
    var http = new XMLHttpRequest()
    var url = "https://api.openseed.solutions/account.py"
    var raw = ""
    http.onreadystatechange = function () {
        if (http.readyState === 4) {
            raw = http.responseText
            if (http.responseText === 100) {
                console.log("Incorrect DevID")
            } else if (http.responseText === 101) {
                console.log("Incorrect AppID")
            } else {
                raw = http.responseText
                if (raw.length > 10) {
                    theid = raw.trim()
                    save_user(theid, username, passphrase)
                } else {

                    //print(raw)
                }
            }
        }
    }
    http.open('POST', url.trim(), true)
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    http.send("act=create&devid=" + devId + "&appid=" + appId + "&username=" + username + "&email="
              + email + "&passphrase=" + passphrase + "&steemname=" + steemname)
}

function send_profile(account, data1, data2, data3, data4, data5) {
    var http = new XMLHttpRequest()
    var url = "https://api.openseed.solutions/account.py"
    var raw = ""
    http.onreadystatechange = function () {
        if (http.readyState === 4) {
            raw = http.responseText
            if (http.responseText === 100) {
                console.log("Incorrect DevID")
            } else if (http.responseText === 101) {
                console.log("Incorrect AppID")
            } else {
                raw = http.responseText
            }
        }
    }

    http.open('POST', url.trim(), true)
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    http.send('act=create_profile&theid=' + encodeURI(
                  account) + '&data1=' + encodeURI(data1) + '&data2=' + encodeURI(
                  data2) + '&data3=' + encodeURI(data3) + '&data4=' + encodeURI(
                  data4) + '&data5=' + encodeURI(data5) + '&thetype=1')

    if (raw.length > 4 && raw.trim() === userid) {
        print("Created")
        return 1
    } else {
        print("exists")

        return 2
    }
}

function check_Steem(account) {
    var http = new XMLHttpRequest()
    var url = "https://api.openseed.solutions/account.py"
    var raw = ""
    var use = 0
    http.onreadystatechange = function () {
        if (http.readyState === 4) {
            raw = http.responseText
            if (http.responseText === 100) {
                console.log("Incorrect DevID")
            } else if (http.responseText === 101) {
                console.log("Incorrect AppID")
            } else {
                raw = http.responseText
                if (raw !== "") {
                    if (raw.trim() === "1") {
                        inuse = 1
                        print("user exists")
                    } else {
                        inuse = 0
                        print("Free to create")
                    }
                }
            }
        }
    }
    http.open('POST', url.trim(), true)
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    http.send("act=steemcheck&devid=" + devId + "&appid=" + appId + "&steemname=" + account)
}

function profile(account) {
    var http = new XMLHttpRequest()
    var url = "https://api.openseed.solutions/connections.py"
    var raw = ""

    aname = ""
    aemail = ""
    aphone = ""
    acompany = ""
    aprofession = ""
    aimage = ""
    aabout = ""
    abanner = ""
    askills = []
    ainterests = []

    http.onreadystatechange = function () {
        if (http.readyState === 4) {
            raw = http.responseText
            if (http.responseText === 100) {
                console.log("Incorrect DevID")
            } else if (http.responseText === 101) {
                console.log("Incorrect AppID")
            } else {
                raw = http.responseText
                raw = raw.replace(/%3A/g,":")
                .replace(/%2C/g,",").replace(/%7B/g,"{")
                .replace(/%22/g,'"').replace(/%7D/g, "}")
                .replace(/%40/g, "@").replace(/%24/g, "$")
                .replace(/%3F/g, "?").replace(/%3D/g, "=")
                .replace(/%25/g, "%")

                var pfile = JSON.parse(raw)
                if (raw !== {
                            "profile": "Not found"
                        }) {
                    var general = pfile["data1"]
                    var info = pfile["data2"]
                    var sandi = pfile["data3"]
                    var steemProfile = pfile["data5"]
                    aname = decodeURI(general["name"])
                    aemail = decodeURI(general["email"])
                    aphone = decodeURI(general["phone"])
                    acompany = decodeURI(general["company"])
                    aprofession = decodeURI(general["profession"])
                    if (info["about"] !== undefined) {
                        aabout = decodeURI(info["about"])
                    }
                    if (sandi["interests"] !== undefined) {
                        ainterests = decodeURI(sandi["interests"]).split(",")
                    }
                    if (sandi["skills"] !== undefined) {
                        askills = decodeURI(sandi["skills"]).split(",")
                    }

                    if (steemProfile["profile"] !== undefined) {
                        if (steemProfile["profile"]["profile_image"] !== undefined) {
                            aimage = steemProfile["profile"]["profile_image"]
                        }

                        if (steemProfile["profile"]["about"] !== undefined) {
                            if (aabout == "") {
                                aabout = steemProfile["profile"]["about"]
                            }
                        }
                        if (steemProfile["profile"]["cover_image"] !== undefined) {
                            abanner = steemProfile["profile"]["cover_image"]
                        } else {
                            abanner = "qrc:/img/bg-splash-blue.png"
                        }
                    }
                }
            }
        }
    }

    http.open('POST', url.trim(), true)
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    http.send('act=user_profile&username=' + account)
}

function user_profile(account) {
    var http = new XMLHttpRequest()
    var url = "https://api.openseed.solutions/connections.py"
    var raw = ""

    profile_Name = ""
    profile_Email = ""
    profile_Phone = ""
    profile_Company = ""
    profile_Profession = ""
    profile_Image = ""
    profile_About = ""
    profile_Banner = ""
    profile_Skills = []
    profile_Interests = []

    http.onreadystatechange = function () {
        if (http.readyState === 4) {
            raw = http.responseText
            if (http.responseText === 100) {
                console.log("Incorrect DevID")
            } else if (http.responseText === 101) {
                console.log("Incorrect AppID")
            } else {
                raw = http.responseText
                raw = raw.trim().replace(/%3A/g, ":").replace(
                            /%2C/g, ",").replace(/%7B/g, "{").replace(
                            /%22/g, '"').replace(/%7D/g, "}").replace(
                            /%40/g, "@").replace(/%3F/g, "?").replace(
                            /%24/g, "$")
                var pfile = JSON.parse(raw)
                if (raw !== {
                            "profile": "Not found"
                        }) {
                    var general = pfile["data1"]
                    var info = pfile["data2"]
                    var sandi = pfile["data3"]
                    var steemProfile = pfile["data5"]
                    profile_Name = decodeURI(general["name"])
                    profile_Email = decodeURI(general["email"])
                    profile_Phone = decodeURI(general["phone"])
                    profile_Company = decodeURI(general["company"])
                    profile_Profession = decodeURI(general["profession"])
                    if (info["about"] !== undefined) {
                        profile_About = decodeURI(info["about"])
                    }
                    if (sandi["interests"] !== undefined) {
                        profile_Interests = decodeURI(
                                    sandi["interests"]).split(",")
                    }
                    if (sandi["skills"] !== undefined) {
                        profile_Skills = decodeURI(sandi["skills"]).split(",")
                    }

                    if (steemProfile["profile"] !== undefined) {
                        if (steemProfile["profile"]["profile_image"] !== undefined) {
                            profile_Image = steemProfile["profile"]["profile_image"]
                        }

                        if (steemProfile["profile"]["about"] !== undefined) {
                            if (profile_About == "") {
                                profile_About = steemProfile["profile"]["about"]
                            }
                        }
                        if (steemProfile["profile"]["cover_image"] !== undefined) {
                            profile_Banner = steemProfile["profile"]["cover_image"]
                        } else {
                            profile_Banner = "qrc:/img/bg-splash-blue.png"
                        }
                    }
                }
            }
        }
    }

    http.open('POST', url.trim(), true)
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    http.send('act=user_profile&username=' + account)
}

function profile_check(account) {
    var http = new XMLHttpRequest()
    var url = "https://api.openseed.solutions/connections.py"
    var raw
    http.onreadystatechange = function () {
        if (http.readyState === 4) {
            //console.log(http.responseText)
            if (http.responseText === 100) {
                console.log("Incorrect DevID")
            } else if (http.responseText === 101) {
                console.log("Incorrect AppID")
            } else {
                raw = http.responseText
                raw = raw.trim()
                if (raw !== '{"profile":"Not found"}') {
                    var info = raw.split("','")

                    var general = ""
                    var steemProfile = ""
                    if (info[0] !== "None'") {
                        general = JSON.parse(info[0])
                    }
                    if (info[4] !== "None'") {
                        steemProfile = JSON.parse(info[4])
                    }
                    profile_Name = general["name"]
                    profile_Email = general["email"]
                    profile_Phone = general["phone"]
                    profile_Company = general["company"]
                    profile_Profession = general["profession"]


                    /*if(info["about"] !== undefined) {
                        profile_About = info["about"]
                    }
                    if(sandi["interests"] !== undefined) {
                        profile_Interests = sandi["interests"].split(",")

                    }
                    if(sandi["skills"] !== undefined) {
                        profile_Skills = sandi["skills"].split(",")
                    } */
                    if (steemProfile["profile"] !== undefined) {
                        if (steemProfile["profile"]["profile_image"] !== undefined) {
                            profile_Image = steemProfile["profile"]["profile_image"]
                        }
                        if (steemProfile["profile"]["cover_image"] !== undefined) {
                            profile_Banner = steemProfile["profile"]["cover_image"]
                        }
                        if (steemProfile["profile"]["about"] !== undefined) {
                            profile_About = steemProfile["profile"]["about"]
                        }
                    }
                    swipeView.currentIndex = 6
                } else {

                    swipeView.currentIndex = 5
                }
            }
        }
    }

    http.open('POST', url.trim(), true)
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    http.send('act=profile&userid=' + account)
}

function send_request(username, requestname, response) {
    var http = new XMLHttpRequest()
    var url = "https://api.openseed.solutions/connections.py"
    var raw = ""
    http.onreadystatechange = function () {
        if (http.readyState === 4) {
            raw = http.responseText
            if (http.responseText === 100) {
                console.log("Incorrect DevID")
            } else if (http.responseText === 101) {
                console.log("Incorrect AppID")
            } else {
                raw = http.responseText
            }
        }
    }

    http.open('POST', url.trim(), true)
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    http.send('act=send_request&username=' + username + '&request='
              + requestname + '&response=' + response)

    if (raw.length > 4) {
        //print(raw)
        return 1
    } else {
        // print(raw)
        return 2
    }
}

function updates(userid, username, type, last) {
    var http = new XMLHttpRequest()
    var url = "https://api.openseed.solutions/updates.py"
    var raw = ""
    http.onreadystatechange = function () {
        if (http.readyState === 4) {
            raw = http.responseText
            if (http.responseText === 100) {
                console.log("Incorrect DevID")
            } else if (http.responseText === 101) {
                console.log("Incorrect AppID")
            } else {
                raw = http.responseText
                if (type === "requests") {
                    if (raw.length > 10) {
                        request.new_requests = raw
                    }
                }

                if (type === "status") {
                    status = raw.trim()
                }

                if (type === "request_status") {
                    linked = JSON.parse(raw.trim())["response"]

                }

                if (type === "chat") {
                    //print(raw.trim())
                    var returned = JSON.parse(raw.trim())
                    var loc = false
                    if (returned["type"] === userid) {
                        loc = true
                    }
                    if (returned["type"] !== "server") {
                        offset = 1
                        if (returned["index"] > chatWindow.last) {
                            chatWindow.last = returned["index"]
                            print("from update chat")
                            chatlog.insert(0, {
                                               "from": returned["type"],
                                               "local": loc,
                                               "message": returned["message"]
                                           })
                            chatList.currentIndex = 0
                            var attendees = userid + "," + username
                            if (returned["type"] !== userid) {
                                attendees = username + "," + userid
                            }
                            var dataStr = "INSERT INTO chatlog (id,attendees,message,date) VALUES ('"
                                    + returned["index"] + "','" + attendees + "','"
                                    + returned["message"] + "','" + returned["date"] + "')"
                            db.transaction(function (tx) {
                                tx.executeSql(dataStr)
                            })
                        }
                    } else {
                        if (offset <= 40) {
                            offset += 1
                        }
                    }
                }
            }
        }
    }
    http.open('POST', url.trim(), true)
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    http.send('act=' + type + '&appId=' + appId + '&devId=' + devId + '&username=' + username
              + '&userid=' + userid + '&type=' + type + '&data=' + last)
    gc()
}

function send_chat(username1, username2, message) {
    if (ekey == "") {
        ekey = load_key(username1, username2)
    }
    var secret =simp_crypt(ekey, message)
    //var secret = " "+message+" "
    var http = new XMLHttpRequest()
    var url = "https://api.openseed.solutions/chats.py"
    var raw = ""
    http.onreadystatechange = function () {
        if (http.readyState === 4) {
            raw = http.responseText
            if (http.responseText === 100) {
                console.log("Incorrect DevID")
            } else if (http.responseText === 101) {
                console.log("Incorrect AppID")
            } else {
                raw = http.responseText
            }
        }
    }

    http.open('POST', url.trim(), true)
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    http.send('act=send_chat&appId=' + appId + '&devId=' + devId + '&username='
              + username1 + '&othername=' + username2 + '&data=' + secret)

    if (raw.length > 4) {
        //print(raw)
        return 1
    } else {
        // print(raw)
        return 2
    }
}

function start_chat(username1, username2) {
    var http = new XMLHttpRequest()
    var url = "https://api.openseed.solutions/onetime.py"
    var raw = ""
    http.onreadystatechange = function () {
        if (http.readyState === 4) {
            raw = http.responseText
            if (http.responseText === 100) {
                console.log("Incorrect DevID")
            } else if (http.responseText === 101) {
                console.log("Incorrect AppID")
            } else {
                raw = http.responseText
                var dataStr = "INSERT INTO chatKeys (code,username1,username2) VALUES ('"
                        + raw.trim(
                            ) + "','" + username1 + "','" + username2 + "')"
                db.transaction(function (tx) {
                    tx.executeSql(dataStr)
                })
            }
        }
    }

    http.open('POST', url.trim(), true)
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    http.send('act=newkey&appId=' + appId + '&devId=' + devId + '&type=1&validusers='
              + username1 + ',' + username2 + '&register=' + username1)
}

function register_chat(username1, username2) {
    var http = new XMLHttpRequest()
    var url = "https://api.openseed.solutions/onetime.py"
    var raw = ""
    http.onreadystatechange = function () {
        if (http.readyState === 4) {
            raw = http.responseText
            if (http.responseText === 100) {
                console.log("Incorrect DevID")
            } else if (http.responseText === 101) {
                console.log("Incorrect AppID")
            } else {
                raw = http.responseText
                var dataStr = "INSERT INTO chatKeys (code,username1,username2) VALUES ('"
                        + raw.trim(
                            ) + "','" + username1 + "','" + username2 + "')"
                db.transaction(function (tx) {
                    tx.executeSql(dataStr)
                })
                return 1
            }
        }
    }

    http.open('POST', url.trim(), true)
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    http.send('act=getkey&appId=' + appId + '&devId=' + devId + '&type=1&validusers='
              + username1 + ',' + username2 + '&register=' + username1)
}

function check_chat(username1, username2) {
    var http = new XMLHttpRequest()
    var url = "https://api.openseed.solutions/chats.py"
    var raw = ""
    http.onreadystatechange = function () {
        if (http.readyState === 4) {
            raw = http.responseText
            if (http.responseText === 100) {
                console.log("Incorrect DevID")
            } else if (http.responseText === 101) {
                console.log("Incorrect AppID")
            } else {
                raw = http.responseText

                if (raw.trim() === "0") {
                    start_chat(username1, username2)
                }
                if (raw.trim() === "2") {
                    register_chat(username1, username2)
                }
                if (raw.trim() === "1") {
                    register_chat(username1, username2)
                }
                if (raw.trim() === "3") {
                    print("shrugs")
                }
            }
        }
    }

    http.open('POST', url.trim(), true)
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    http.send('act=check_chat&appId=' + appId + '&devId=' + devId + '&username='
              + username1 + '&othername=' + username2)
}

function retrieve_conversations(username) {
    var http = new XMLHttpRequest()
    var url = "https://api.openseed.solutions/chats.py"
    var raw = ""
    http.onreadystatechange = function () {
        if (http.readyState === 4) {
            raw = http.responseText
            if (http.responseText === 100) {
                console.log("Incorrect DevID")
            } else if (http.responseText === 101) {
                console.log("Incorrect AppID")
            } else {
                raw = http.responseText
                var consver = raw.trim().split("\n")
                if(consver[0].length !== 0) {
                    for (var i in consver) {
                        var decode = consver[i].replace("['", "").replace("']", "")
                        var con = JSON.parse(decode)

                        if (con["conversation"] !== undefined) {
                            rooms = consver.length

                            var memebers = con["conversation"].split(",")
                            var aname = ""
                            if (memebers[0] === username) {
                                aname = memebers[1]
                            } else {
                                aname = memebers[0]
                         }

                        var key = load_key(username, aname)

                        if (key === "") {
                            check_chat(username, aname)
                            key = load_key(username, aname)
                        }

                        var themessage = simp_decrypt(key,con["message"])

                        conversations.set(i, {
                                              "speaker": con["conversation"],
                                              "message": themessage,
                                              "accountname": aname,
                                              "a1": memebers[0],
                                              "a2": memebers[1]
                                          })

                        if (conversations.get(i)["message"] !== themessage && con["conversation"] !== username) {
                           notificationClient.notification = "New Message from: " + aname
                        }
                    }
                }
               }
            }
        }
    }

    http.open('POST', url.trim(), true)
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    http.send('act=conversations&appId=' + appId + '&devId=' + devId + '&username=' + username)
}

function load_key(username1, username2) {
    var key = ""
    var search1 = "SELECT code FROM chatKeys WHERE username1 LIKE '" + username1
            + "' AND username2 LIKE '" + username2 + "'"
    var search2 = "SELECT code FROM chatKeys WHERE username1 LIKE '" + username2
            + "' AND username2 LIKE '" + username1 + "'"

    db.transaction(function (tx) {
        var pull1 = tx.executeSql(search1)
        var pull2 = tx.executeSql(search2)
        if (pull1.rows.length === 1) {
            key = pull1.rows.item(0).code
        }
        if (pull2.rows.length === 1) {
            key = pull2.rows.item(0).code
        }
    })
    return key
}

function simp_crypt(key,raw_data) {
    var secret = ""
    var datanum = 0
    var offset = 0
    var data = raw_data.toString().replace(/%/g, ":percent:").replace(/&/g, ":ampersand:")
    print(data)
    var digits = ""
    //lets turn it into integers first//

    while (datanum < data.length) {
        var keynum = 0
        while (keynum < key.length) {
            var salt = Math.round(Math.random() * 40)
            if (keynum < data.length && salt % 3 == 0
                    && data[datanum] !== undefined) {
                if (data[datanum] === key[keynum]) {
                    var num = keynum
                    while (num < key.length) {
                        secret = secret + key[num]
                        num += 1
                        print(data[datanum], key[num])
                        if (data[datanum] !== key[num]) {
                            keynum = num
                            secret = secret + data[datanum]
                            print("shifting by:" + keynum)
                            break
                        } else {
                            secret = secret + key[num]
                        }
                    }
                    //secret = secret+data[datanum]
                } else {
                    secret = secret + data[datanum]
                }
                datanum += 1
            } else {
                if (keynum < key.length && key[keynum] !== undefined) {
                    secret = secret + key[keynum]
                } else {
                    keynum = 0
                    secret = secret + key[keynum]
                }
            }
            keynum += 1
        }
    }
    return secret
}

function simp_decrypt(key, raw_data) {
    var key_stretch = key
    var message = ""
    var datanum = 0
    var offset = 0
    var  data = decodeURI(
                raw_data.replace(/%3A/g,":")
                .replace(/%2C/g,",").replace(/%7B/g,"{")
                .replace(/%22/g,'"').replace(/%7D/g, "}")
                .replace(/%40/g, "@").replace(/%3F/g, "?")
                .replace(/%23/g, "#").replace(/%24/g, "$")
                .replace(/%3D/g, "=").replace(/%25/g, "%"))


    if (key_stretch !== "") {
        if (data.length > key_stretch.length) {
            while (key_stretch.length < data.length)
                key_stretch = key_stretch + key
        }

        while (datanum < data.length) {
            if (key_stretch[datanum] !== data[datanum]) {

                if (data[datanum] !== undefined) {
                    message = message + data[datanum]
                } else {
                    break
                }
            }
            datanum = datanum + 1
        }
    } else {
        message = data
    }
    return message.replace(":percent:", "%").replace(":ampersand:", "&")
}

function openseed_search(username) {
    var http = new XMLHttpRequest()
    var url = "https://api.openseed.solutions/account.py"
    var raw = ""
    searched.clear()
    http.onreadystatechange = function () {
        if (http.readyState === 4) {
            raw = http.responseText
            if (http.responseText === 100) {
                console.log("Incorrect DevID")
            } else if (http.responseText === 101) {
                console.log("Incorrect AppID")
            } else {
                raw = http.responseText
                var f = raw.trim().split("\n")

                for (var r in f) {

                    var found = JSON.parse(f[r])
                    var theimg = ""
                    if (found["steem"]["profile"] !== undefined) {
                        theimg = found["steem"]["profile"]["profile_image"]
                    }
                    searched.append({
                                        "accountname": found["account"],
                                        "name": found["profile"]["name"],
                                        "img": theimg,
                                        "about": found["profile"]["profession"],
                                        "company": found["profile"]["company"],
                                        "index": r,
                                        "openseed": true
                                    })
                }
            }
        }
    }

    http.open('POST', url.trim(), true)
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    http.send('act=search&appId=' + appId + '&devId=' + devId + '&username=' + username)
}

function get_around(currentcords) {

    var http = new XMLHttpRequest()
    var url = "https://api.openseed.solutions/account.py"
    var raw = ""
    //gps_collected.clear()
    http.onreadystatechange = function () {
        if (http.readyState === 4) {
            raw = http.responseText
            if (http.responseText === 100) {
                console.log("Incorrect DevID")
            } else if (http.responseText === 101) {
                console.log("Incorrect AppID")
            } else {
                raw = http.responseText
                var f = raw.trim().split("\n")
                for (var r in f) {
                    if (collected.indexOf(f[r]) === -1) {
                        collected.push(f[r])
                        var found = JSON.parse(f[r])
                        var theimg = ""
                        if (found["steem"]["profile"] !== undefined) {
                            theimg = found["steem"]["profile"]["profile_image"]
                        }
                        gps_collected.append({
                                                 "accountname": found["account"],
                                                 "name": found["profile"]["name"],
                                                 "img": theimg,
                                                 "about": found["profile"]["profession"],
                                                 "company": found["profile"]["company"],
                                                 "index": r,
                                                 "openseed": true
                                             })
                    }
                }
            }
        }
    }

    http.open('POST', url.trim(), true)
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    http.send('act=gps&appId=' + appId + '&devId=' + devId + '&cords='
              + currentcords + '&username=' + username)
}
