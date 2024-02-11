(async () => {
    await import(chrome.extension.getURL('web-ext-library/content.js'))

    var UMES = new UMES_ContentScript()

    console.log(UMES)

    UMES.setMessageContainer(".n5hs2j7m", "div[role='row'] .selectable-text span", (message) => {
        console.log("[UMES]", message)
        
        if (message == null) {
            return
        }

        var content = message.textContent
        
        if (UMES.isUMESMessage(content)) {
            UMES.decryptMessage(content, (decrypted) => {
                message.textContent = decrypted
            })
        }
    })

    UMES.injectScript("src/script.js")
})()