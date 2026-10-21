const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('content.js', 'utf8');
const node = tag => ({tag, children: [], appendChild(child) { this.children.push(child); }, setAttribute(k,v) { this[k]=v; }});
let copied;
const context = {document: {createElement: node}, Dt: text => ({onclick() {copied=text;}, setAttribute(k,v) {this[k]=v;}}), zt: count => ({count}), Bt: stability => ({stability})};
vm.createContext(context);
vm.runInContext(source.slice(source.indexOf('const katalonSnippet ='), source.indexOf('const t=t=>')) + '\nthis.snippet=katalonSnippet;this.card=katalonCard;', context);
const element = {tagName:'input', attributes:{'data-test':'username'}};
const xpath = "//form[@aria-label='Login']//input[@data-test='username']";
const expected = `private TestObject txtUsername\n\ntxtUsername = createTestObjectByXpath('txtUsername', "${xpath}")`;
assert.equal(context.snippet(element,xpath),expected);
assert.equal(context.snippet({tagName:'button',attributes:{id:'save-order'}},'//button'),`private TestObject btnSaveOrder\n\nbtnSaveOrder = createTestObjectByXpath('btnSaveOrder', "//button")`);
assert.ok(context.snippet(element,'//input[@name="$foo"]\\\n').includes('\\$foo\\"]\\\\\\n'));
const card=context.card(element,{xpath,category:'Test ID'},1,{score:95});
assert.equal(card.children[0].children[0].textContent,'Field: txtUsername');
assert.equal(card.children[1].textContent,'XPath locator · Test ID');
assert.equal(card.children[2].tag,'pre');
const plaintext = node => node.children?.length ? node.children.map(plaintext).join('') : node.textContent || '';
const code = card.children[2].children[0];
assert.equal(plaintext(code),expected);
for (const [kind, text] of Object.entries({keyword:'private',type:'TestObject',function:'createTestObjectByXpath',variable:'txtUsername',punctuation:'='})) {
    assert.ok(code.children.some(span => span.className === 'xpath-finder-groovy-' + kind && span.textContent === text));
}
assert.deepEqual(Array.from(code.children.filter(span => span.className === 'xpath-finder-groovy-string'), span => span.textContent), ["'txtUsername'", `"${xpath}"`]);
const hostile = '//input[@title="<img src=x onerror=alert(1)> & </code><script>oops</script> \\" $foo"]';
const unsafeCard = context.card(element,{xpath:hostile},1,{});
const unsafeCode = unsafeCard.children[2].children[0];
assert.equal(plaintext(unsafeCode),context.snippet(element,hostile));
assert.ok(unsafeCode.children.every(span => span.tag === 'span' && !span.children.length && !('innerHTML' in span)));
unsafeCard.children[0].children[1].onclick();
assert.equal(copied,context.snippet(element,hostile));
card.children[0].children[1].onclick();
assert.equal(copied,expected);
assert.equal(card.children[3].children[0].count,1);
const css=fs.readFileSync('content.css','utf8');
assert.match(css,/overflow-x: auto; white-space: pre/);
assert.match(css,/font: 12px\/1.8/);
assert.match(css,/xpath-finder-dark \.xpath-finder-katalon-code/);
for (const kind of ['keyword','type','function','string','variable','punctuation']) {
    const rules = css.match(new RegExp('[^{}]*\\.xpath-finder-groovy-' + kind + ' \\{[^}]+\\}', 'g'));
    assert.equal(rules.length,2);
    assert.match(rules[1],/xpath-finder-dark/);
    assert.ok(rules.every(rule => /color: #[0-9a-f]{6}/.test(rule)));
    assert.notEqual(rules[0].match(/#[0-9a-f]{6}/)[0],rules[1].match(/#[0-9a-f]{6}/)[0]);
}
console.log('PASS: exact Katalon snippets, safe highlighting, palettes, escaping and copy payload');
