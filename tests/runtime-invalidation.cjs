const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('content.js', 'utf8');
const helper = source.slice(source.indexOf('const lifecycle ='), source.indexOf('const t=t=>'));
async function scenario(mode, trigger) {
    let invalid = false, removed = 0, cleaned = 0, listener;
    const tasks = new Map(); let next = 0;
    const target = { addEventListener(type, fn) { listener = fn; }, removeEventListener() { removed++; } };
    const context = {
        chrome: { runtime: { get id() { return mode === 'missing' && invalid ? undefined : 'test'; },
            sendMessage() { if (invalid) { if (mode === 'reject') return Promise.reject(new Error('Extension context invalidated.')); throw new Error('Extension context invalidated.'); } return Promise.resolve('ok'); },
            getURL(path) { if (invalid) throw new Error('Extension context invalidated.'); return 'chrome-extension://test/' + path; },
            onMessage: { addListener(fn) { context.message = fn; }, removeListener() { removed++; } }
        } },
        setTimeout(fn) { tasks.set(++next, fn); return next; }, setInterval(fn) { tasks.set(++next, fn); return next; },
        clearTimeout(id) { tasks.delete(id); }, clearInterval(id) { tasks.delete(id); },
        document: { body: { style: { cursor: 'crosshair' } } },
        Ft: true, _: {}, Rt() { cleaned++; }, lt() {}, et() {}, rt() {}, Wt: {}, Ut: {}, ce: { remove() { cleaned++; } },
        target
    };
    vm.createContext(context); vm.runInContext(helper + '\nglobalThis.api = lifecycle;', context);
    const api = context.api;
    assert.equal(await api.runtime.sendMessage({}), 'ok');
    assert.equal(api.runtime.getURL('a'), 'chrome-extension://test/a');
    api.listen(target, 'click', () => api.runtime.sendMessage({}));
    api.runtime.onMessage.addListener(() => api.runtime.sendMessage({}));
    api.interval(() => api.runtime.sendMessage({}), 10);
    invalid = true;
    if (trigger === 'url') api.runtime.getURL('a');
    if (trigger === 'send') await api.runtime.sendMessage({});
    if (trigger === 'event') await listener();
    if (trigger === 'message') await context.message();
    if (trigger === 'timer') await [...tasks.values()][0]();
    await new Promise(resolve => setImmediate(resolve));
    for (const fn of [...tasks.values()]) fn();
    assert.equal(api.alive(), false);
    assert.ok(removed >= 2);
    assert.ok(cleaned >= 2);
    assert.equal(context.document.body.style.cursor, '');
    assert.equal(tasks.size <= 1, true); // mock does not auto-delete fired timeout
    await api.runtime.sendMessage({});
    await listener(); // stale queued event is inert
}
async function inFlight() {
    let reject, listener, finish, sends = 0, responses = 0;
    const tasks = new Map(); let next = 0;
    const warnings = [];
    const context = {
        chrome: { runtime: { id: 'test', getURL: p => p,
            sendMessage() { sends++; return new Promise((_, no) => { reject = no; }); },
            onMessage: { addListener(fn) { listener = fn; }, removeListener() {} } } },
        setTimeout(fn) { tasks.set(++next, fn); return next; },
        setInterval(fn) { tasks.set(++next, fn); return next; },
        clearTimeout(id) { tasks.delete(id); }, clearInterval(id) { tasks.delete(id); },
        console: { log() {}, warn(...args) { warnings.push(args); } },
        document: { body: { style: {} } }, Rt() {}, lt() {}, et() {}, rt() {}
    };
    vm.createContext(context);
    const session = source.slice(source.indexOf('var B=function'), source.indexOf('let J=null'));
    vm.runInContext(helper + session + '\nglobalThis.api=lifecycle; globalThis.beat=j;', context);
    context.api.interval(context.beat, 10);
    context.api.runtime.onMessage.addListener((m, s, respond) => {
        new Promise(resolve => { finish = resolve; }).then(() => respond({ ok: true }));
        return true;
    });
    assert.equal(listener({}, {}, () => { responses++; }), true);
    const pending = context.beat();
    reject(new Error('Extension context invalidated.'));
    await pending;
    finish(); await new Promise(resolve => setImmediate(resolve));
    assert.equal(responses, 0, 'stale async sendResponse is inert');
    assert.equal(sends, 1, 'no reconnect after in-flight invalidation');
    assert.equal(warnings.length, 0);
    assert.equal(context.api.alive(), false);
    assert.equal(tasks.size, 1, 'only deferred cleanup remains');
    await context.beat(); assert.equal(sends, 1);
    vm.runInContext('{' + helper + '\nglobalThis.api=lifecycle;}', context);
    const unrelated = new Error('network unavailable');
    context.chrome.runtime.sendMessage = () => Promise.reject(unrelated);
    await assert.rejects(context.api.runtime.sendMessage({}), error => error === unrelated);
    assert.equal(context.api.alive(), true);
    assert.throws(context.api.guard(() => { throw unrelated; }), error => error === unrelated);
    context.api.stop();
}
(async () => {
    new vm.Script(source);
    await inFlight();
    for (const mode of ['throw', 'reject', 'missing']) for (const trigger of ['url', 'send', 'event', 'message', 'timer']) await scenario(mode, trigger);
    assert.ok(source.includes('lifecycle.listen(katalonTab,'));
    console.log('PASS: 15 invalidation scenarios, in-flight heartbeat, async response, unrelated failures and bundle syntax; Katalon tab retained');
})();
