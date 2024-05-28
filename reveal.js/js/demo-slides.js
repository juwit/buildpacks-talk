/**
 * Ugly code for demo slides
 */

/**
 * Sends a query to the gnome-server
 * @param path
 * @param body
 * @returns {Promise<any>}
 */
function gnome(path, body) {
    return fetch('http://localhost:7000' + path, {
        mode: 'cors',
        method: (body != null) ? 'POST' : 'GET',
        headers: {
            "Content-Type": "application/json",
        },
        body: (body != null) ? JSON.stringify(body) : null,
    }).then((r) => console.log(r));
}

/**
 * Ask gnome-server to bring window on front
 * @param element
 */
async function showWindow(windowName) {
    await gnome('/show-window', {windowName}).catch(() => null);
}

/**
 * Ask gnome-server to bring window on front
 * @param element
 */
async function firefox(url) {
    await gnome('/show-window', {windowName: "firefox", url}).catch(() => null);
}

/**
 * Asks gnome-server to type code in the tilix window
 * @param code
 * @returns {Promise<void>}
 */
async function typeInShell(code) {
    await gnome("/type", {type: code})
}

async function bashDemo(element) {
    await typeInShell(element.nextElementSibling.innerText)
}

async function intellijDemo() {
    await showWindow("idea");
}