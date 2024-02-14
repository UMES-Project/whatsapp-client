const serverInput = document.getElementById("serverInput")
const testConnection = document.getElementById("testConnection")

setTimeout(async () => {
    var storage = await browser.storage.local.get('server');
    
    if (!storage.server) {
        storage.server = "https://api.umes.org"
        await browser.storage.local.set(storage);
    }

    serverInput.value = storage.server
}, 0)

serverInput.addEventListener("input", async () => {
    await browser.storage.local.set({
        server: serverInput.value
    });
    document.querySelector("p").textContent = serverInput.value
})

testConnection.addEventListener("click", async () => {
    var storage = await browser.storage.local.get('server');

    browser.runtime.sendMessage({ action: "UMES_makeRequest", url: `${storage.server}/api/info` }, (res) => {
        if (!res.success) {
            document.querySelector("p").textContent = "Error: " + res.error
            return
        }
        
        document.querySelector("p").textContent = "Server Name: " + res.json.server_name
    });
})