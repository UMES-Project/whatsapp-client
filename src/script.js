var UMES = new UMES_Script()

function load() {
    var oldSend = window.send

    window.send = (data) => {

        if (data.cmd == "chat") {
            UMES.encryptMessage(data.text, (public_id, key) => {
                data.text = `[UMES]${public_id}:${key}`
                oldSend(data)
            })
        } else {
            oldSend(data)
        }
    }
}

function log(...args) {
    console.log("[UMES]", ...args)
}

window.webpackChunkwhatsapp_web_client.push(
    [
        [Math.random()],
        {},
        (req) => {
            log("Found require", req)

            var waitFor = setInterval(() => {
                try {
                    var msgMod = req("498703")
                    clearInterval(waitFor)
                } catch (e) {
                    log("ERROR", e)
                    return
                }

                log("msgMod found:", msgMod)

                msgMod._sendTextMsgToChat = msgMod.sendTextMsgToChat

                msgMod.sendTextMsgToChat = (...args) => {

                    UMES.encryptMessage(args[1], (public_id, key) => {
                        args[1] = `[UMES]${public_id}:${key}`
                        log("sendTextMsgToChat", args)
                        msgMod._sendTextMsgToChat(...args)
                    })
                }
            }, 1)
        }
    ]
)