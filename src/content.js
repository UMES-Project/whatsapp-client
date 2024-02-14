function addUMESButton(hoverToolsElement, id) {
    var UMESButton = document.createElement("img")
    UMESButton.src = browser.extension.getURL("assets/umes-icon.png")
    UMESButton.style = "height: 24px; opacity: 1; cursor: pointer"

    UMESButton.addEventListener("click", () => {
        var message = document.querySelector(`span[umes--id="${id}"]`)
        var newState = !(message.getAttribute("umes--decrypted") === 'true')

        message.textContent = message.getAttribute(newState ? "umes--decrypted-string" : "umes--original-string")
        UMESButton.style.opacity = newState ? "1" : "0.5"

        message.setAttribute("umes--decrypted", newState)
    })

    hoverToolsElement.appendChild(UMESButton)
}

(async () => {
    await import(chrome.extension.getURL('web-ext-library/content.js'))

    var storage = await browser.storage.local.get('server');

    var UMES = new UMES_ContentScript(storage.server || "http://localhost:5000/api")

    console.log(UMES)

    UMES.setMessageContainer(".n5hs2j7m", ".CzM4m", (node) => {
        console.log("[UMES] node:", node)
    
        if (node == null) {
            return
        }

        var message = node.querySelector(".selectable-text span")
        var messageHoverTools = node.querySelector(".FxqSn")

        console.log("[UMES] message:", message)
        console.log("[UMES] messageHoverTools:", messageHoverTools)

        if (message == null) {
            return
        }

        var content = message.textContent
        
        if (UMES.isUMESMessage(content)) {

            message.setAttribute("umes--original-string", message.textContent)

            UMES.decryptMessage(content, (decrypted) => {
                message.textContent = decrypted

                var id = Date.now() + Math.random()

                message.setAttribute("umes--decrypted-string", message.textContent)
                message.setAttribute("umes--decrypted", true)
                message.setAttribute("umes--id", id)
                addUMESButton(messageHoverTools, id)
            })
        }
    })

    UMES.injectScript("src/script.js")
})()