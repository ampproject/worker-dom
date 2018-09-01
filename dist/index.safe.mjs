var ba="a abbr acronym address area article aside audio b bdi bdo big blink blockquote body br button canvas caption center cite code col colgroup content data datalist dd decorator del details dfn dir div dl dt element em fieldset figcaption figure font footer form h1 h2 h3 h4 h5 h6 head header hgroup hr html i img input ins kbd label legend li main map mark marquee menu menuitem meter nav nobr ol optgroup option output p pre progress q rp rt ruby s samp section select shadow small source spacer span strike strong style sub summary sup table tbody td template textarea tfoot th thead time tr track tt u ul var video wbr".split(" "),
ca="svg a altglyph altglyphdef altglyphitem animatecolor animatemotion animatetransform audio canvas circle clippath defs desc ellipse filter font g glyph glyphref hkern image line lineargradient marker mask metadata mpath path pattern polygon polyline radialgradient rect stop style switch symbol text textpath title tref tspan video view vkern".split(" "),da="feBlend feColorMatrix feComponentTransfer feComposite feConvolveMatrix feDiffuseLighting feDisplacementMap feDistantLight feFlood feFuncA feFuncB feFuncG feFuncR feGaussianBlur feMerge feMergeNode feMorphology feOffset fePointLight feSpecularLighting feSpotLight feTile feTurbulence".split(" "),
ea="math menclose merror mfenced mfrac mglyph mi mlabeledtr mmuliscripts mn mo mover mpadded mphantom mroot mrow ms mpspace msqrt mystyle msub msup msubsup mtable mtd mtext mtr munder munderover".split(" "),fa=["#text"],ha="accept action align alt autocomplete background bgcolor border cellpadding cellspacing checked cite class clear color cols colspan coords crossorigin datetime default dir disabled download enctype face for headers height hidden high href hreflang id integrity ismap label lang list loop low max maxlength media method min multiple name noshade novalidate nowrap open optimum pattern placeholder poster preload pubdate radiogroup readonly rel required rev reversed role rows rowspan spellcheck scope selected shape size sizes span srclang start src srcset step style summary tabindex title type usemap valign value width xmlns".split(" "),
f="accent-height accumulate additivive alignment-baseline ascent attributename attributetype azimuth basefrequency baseline-shift begin bias by class clip clip-path clip-rule color color-interpolation color-interpolation-filters color-profile color-rendering cx cy d dx dy diffuseconstant direction display divisor dur edgemode elevation end fill fill-opacity fill-rule filter flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight fx fy g1 g2 glyph-name glyphref gradientunits gradienttransform height href id image-rendering in in2 k k1 k2 k3 k4 kerning keypoints keysplines keytimes lang lengthadjust letter-spacing kernelmatrix kernelunitlength lighting-color local marker-end marker-mid marker-start markerheight markerunits markerwidth maskcontentunits maskunits max mask media method mode min name numoctaves offset operator opacity order orient orientation origin overflow paint-order path pathlength patterncontentunits patterntransform patternunits points preservealpha preserveaspectratio r rx ry radius refx refy repeatcount repeatdur restart result rotate scale seed shape-rendering specularconstant specularexponent spreadmethod stddeviation stitchtiles stop-color stop-opacity stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke stroke-width style surfacescale tabindex targetx targety transform text-anchor text-decoration text-rendering textlength type u1 u2 unicode values viewbox visibility vert-adv-y vert-origin-x vert-origin-y width word-spacing wrap writing-mode xchannelselector ychannelselector x x1 x2 xmlns y y1 y2 z zoomandpan".split(" "),
ia="accent accentunder align bevelled close columnsalign columnlines columnspan denomalign depth dir display displaystyle fence frame height href id largeop length linethickness lspace lquote mathbackground mathcolor mathsize mathvariant maxsize minsize movablelimits notation numalign open rowalign rowlines rowspacing rowspan rspace rquote scriptlevel scriptminsize scriptsizemultiplier selection separator separators stretchy subscriptshift supscriptshift symmetric voffset width xmlns".split(" "),
n=["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"];function t(a,b){for(var c=b.length;c--;)"string"===typeof b[c]&&(b[c]=b[c].toLowerCase()),a[b[c]]=!0;return a}function ja(a){var b={},c=void 0;for(c in a)Object.prototype.hasOwnProperty.call(a,c)&&(b[c]=a[c]);return b}
var ka=/\{\{[\s\S]*|[\s\S]*\}\}/gm,la=/<%[\s\S]*|[\s\S]*%>/gm,ma=/^data-[\-\w.\u00B7-\uFFFF]/,na=/^aria-[\-\w]+$/,oa=/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,pa=/^(?:\w+script|data):/i,qa=/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205f\u3000]/g,z="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"===typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a};
function A(a){if(Array.isArray(a)){for(var b=0,c=Array(a.length);b<a.length;b++)c[b]=a[b];return c}return Array.from(a)}
function ra(){function a(a){var v;d("beforeSanitizeAttributes",a,null);var c=a.attributes;if(c){var p={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:m};for(v=c.length;v--;){var e=c[v];var q=e.name;e=e.value.trim();var g=q.toLowerCase();p.attrName=g;p.attrValue=e;p.keepAttr=!0;d("uponSanitizeAttribute",a,p);e=p.attrValue;if("name"===g&&"IMG"===a.nodeName&&c.id){var k=c.id;c=Array.prototype.slice.apply(c);w("id",a);w(q,a);c.indexOf(k)>v&&a.setAttribute("id",k.value)}else if("INPUT"!==a.nodeName||
"type"!==g||"file"!==e||!m[g]&&Q[g])"id"===q&&a.setAttribute(q,""),w(q,a);else continue;if(p.keepAttr&&(k=a.nodeName.toLowerCase(),b(k,g,e)))try{a.setAttribute(q,e),h.removed.pop()}catch(ob){}}d("afterSanitizeAttributes",a,null)}}function b(a,b,c){if(ta&&("id"===b||"name"===b)&&(c in x||c in Qa))return!1;G&&(c=c.replace(ka," "),c=c.replace(la," "));if(!R||!ma.test(b))if(!ua||!na.test(b))if(!m[b]||Q[b]||!(va[b]||S.test(c.replace(qa,""))||("src"===b||"xlink:href"===b)&&0===c.indexOf("data:")&&Ra[a]||
wa&&!pa.test(c.replace(qa,"")))&&c)return!1;return!0}function c(a){d("beforeSanitizeElements",a,null);var b=a instanceof Sa||a instanceof Ta?!1:"string"===typeof a.nodeName&&"string"===typeof a.textContent&&"function"===typeof a.removeChild&&a.attributes instanceof Ua&&"function"===typeof a.removeAttribute&&"function"===typeof a.setAttribute?!1:!0;if(b)return T(a),!0;b=a.nodeName.toLowerCase();d("uponSanitizeElement",a,{tagName:b,allowedTags:k});if(!k[b]||U[b]){if(V&&!Va[b]&&"function"===typeof a.insertAdjacentHTML)try{a.insertAdjacentHTML("AfterEnd",
a.innerHTML)}catch(P){}T(a);return!0}!xa||a.firstElementChild||a.content&&a.content.firstElementChild||!/</g.test(a.textContent)||(h.removed.push({element:a.cloneNode()}),a.innerHTML=a.innerHTML?a.innerHTML.replace(/</g,"&lt;"):a.textContent.replace(/</g,"&lt;"));G&&3===a.nodeType&&(b=a.textContent,b=b.replace(ka," "),b=b.replace(la," "),a.textContent!==b&&(h.removed.push({element:a.cloneNode()}),a.textContent=b));d("afterSanitizeElements",a,null);return!1}function d(a,b,c){u[a]&&u[a].forEach(function(a){a.call(h,
b,c,H)})}function e(a){return"object"===("undefined"===typeof I?"undefined":z(I))?a instanceof I:a&&"object"===("undefined"===typeof a?"undefined":z(a))&&"number"===typeof a.nodeType&&"string"===typeof a.nodeName}function p(a){return Wa.call(a.ownerDocument||a,a,J.SHOW_ELEMENT|J.SHOW_COMMENT|J.SHOW_TEXT,function(){return J.FILTER_ACCEPT},!1)}function q(a){var b=void 0;W&&(a="<remove></remove>"+a);if(ya)try{b=(new Xa).parseFromString(a,"text/html")}catch(nb){}za&&t(U,["title"]);if(!b||!b.documentElement){b=
X.createHTMLDocument("");var c=b.body;c.parentNode.removeChild(c.parentNode.firstElementChild);c.outerHTML=a}return Ya.call(b,B?"html":"body")[0]}function w(a,b){try{h.removed.push({attribute:b.getAttributeNode(a),from:b})}catch(P){h.removed.push({attribute:null,from:b})}b.removeAttribute(a)}function T(a){h.removed.push({element:a});try{a.parentNode.removeChild(a)}catch(l){a.outerHTML=""}}function Y(a){"object"!==("undefined"===typeof a?"undefined":z(a))&&(a={});k="ALLOWED_TAGS"in a?t({},a.ALLOWED_TAGS):
Aa;m="ALLOWED_ATTR"in a?t({},a.ALLOWED_ATTR):Ba;U="FORBID_TAGS"in a?t({},a.FORBID_TAGS):{};Q="FORBID_ATTR"in a?t({},a.FORBID_ATTR):{};y="USE_PROFILES"in a?a.USE_PROFILES:!1;ua=!1!==a.ALLOW_ARIA_ATTR;R=!1!==a.ALLOW_DATA_ATTR;wa=a.ALLOW_UNKNOWN_PROTOCOLS||!1;xa=a.SAFE_FOR_JQUERY||!1;G=a.SAFE_FOR_TEMPLATES||!1;B=a.WHOLE_DOCUMENT||!1;C=a.RETURN_DOM||!1;Z=a.RETURN_DOM_FRAGMENT||!1;Ca=a.RETURN_DOM_IMPORT||!1;W=a.FORCE_BODY||!1;ta=!1!==a.SANITIZE_DOM;V=!1!==a.KEEP_CONTENT;K=a.IN_PLACE||!1;S=a.ALLOWED_URI_REGEXP||
S;G&&(R=!1);Z&&(C=!0);y&&(k=t({},[].concat(A(fa))),m=[],!0===y.html&&(t(k,ba),t(m,ha)),!0===y.svg&&(t(k,ca),t(m,f),t(m,n)),!0===y.svgFilters&&(t(k,da),t(m,f),t(m,n)),!0===y.mathMl&&(t(k,ea),t(m,ia),t(m,n)));a.ADD_TAGS&&(k===Aa&&(k=ja(k)),t(k,a.ADD_TAGS));a.ADD_ATTR&&(m===Ba&&(m=ja(m)),t(m,a.ADD_ATTR));a.ADD_URI_SAFE_ATTR&&t(va,a.ADD_URI_SAFE_ATTR);V&&(k["#text"]=!0);B&&t(k,["html","head","body"]);k.table&&t(k,["tbody"]);Object&&"freeze"in Object&&Object.freeze(a);H=a}function h(a){return ra(a)}var g=
0<arguments.length&&void 0!==arguments[0]?arguments[0]:"undefined"===typeof window?null:window;h.version="1.0.7";h.removed=[];if(!g||!g.document||9!==g.document.nodeType)return h.isSupported=!1,h;var Da=g.document,ya=!1,za=!1,x=g.document,Ea=g.DocumentFragment,I=g.Node,J=g.NodeFilter,r=g.NamedNodeMap,Ua=void 0===r?g.NamedNodeMap||g.MozNamedAttrMap:r,Sa=g.Text,Ta=g.Comment,Xa=g.DOMParser;"function"===typeof g.HTMLTemplateElement&&(r=x.createElement("template"),r.content&&r.content.ownerDocument&&(x=
r.content.ownerDocument));r=x;var X=r.implementation,Wa=r.createNodeIterator,Ya=r.getElementsByTagName,Za=r.createDocumentFragment,$a=Da.importNode,u={};h.isSupported=X&&"undefined"!==typeof X.createHTMLDocument&&9!==x.documentMode;var S=oa,k=null,Aa=t({},[].concat(A(ba),A(ca),A(da),A(ea),A(fa))),m=null,Ba=t({},[].concat(A(ha),A(f),A(ia),A(n))),U=null,Q=null,ua=!0,R=!0,wa=!1,xa=!1,G=!1,B=!1,aa=!1,W=!1,C=!1,Z=!1,Ca=!1,ta=!0,V=!0,K=!1,y={},Va=t({},"audio head math script style template svg video".split(" ")),
Ra=t({},["audio","video","img","source","image"]),va=t({},"alt class for id label name pattern placeholder summary title value style xmlns".split(" ")),H=null,Qa=x.createElement("form");if(h.isSupported){try{q('<svg><p><style><img src="</style><img src=x onerror=alert(1)//">').querySelector("svg img")&&(ya=!0)}catch(v){}try{q("<x/><title>&lt;/title&gt;&lt;img&gt;").querySelector("title").textContent.match(/<\/title/)&&(za=!0)}catch(v){}}var ab=function P(b){var l,e=p(b);for(d("beforeSanitizeShadowDOM",
b,null);l=e.nextNode();)d("uponSanitizeShadowNode",l,null),c(l)||(l.content instanceof Ea&&P(l.content),a(l));d("afterSanitizeShadowDOM",b,null)};h.sanitize=function(b,d){var l=void 0,k=void 0;b||(b="\x3c!--\x3e");if("string"!==typeof b&&!e(b)){if("function"!==typeof b.toString)throw new TypeError("toString is not a function");b=b.toString();if("string"!==typeof b)throw new TypeError("dirty is not a string, aborting");}if(!h.isSupported){if("object"===z(g.toStaticHTML)||"function"===typeof g.toStaticHTML){if("string"===
typeof b)return g.toStaticHTML(b);if(e(b))return g.toStaticHTML(b.outerHTML)}return b}aa||Y(d);h.removed=[];if(!K)if(b instanceof I)l=q("\x3c!--\x3e"),d=l.ownerDocument.importNode(b,!0),1===d.nodeType&&"BODY"===d.nodeName?l=d:l.appendChild(d);else{if(!C&&!B&&-1===b.indexOf("<"))return b;l=q(b);if(!l)return C?null:""}l&&W&&T(l.firstChild);for(var m=p(K?b:l);d=m.nextNode();)3===d.nodeType&&d===k||c(d)||(d.content instanceof Ea&&ab(d.content),a(d),k=d);if(K)return b;if(C){if(Z)for(b=Za.call(l.ownerDocument);l.firstChild;)b.appendChild(l.firstChild);
else b=l;Ca&&(b=$a.call(Da,b,!0));return b}return B?l.outerHTML:l.innerHTML};h.setConfig=function(a){Y(a);aa=!0};h.clearConfig=function(){H=null;aa=!1};h.isValidAttribute=function(a,c,d){H||Y({});a=a.toLowerCase();c=c.toLowerCase();return b(a,c,d)};h.addHook=function(a,b){"function"===typeof b&&(u[a]=u[a]||[],u[a].push(b))};h.removeHook=function(a){u[a]&&u[a].pop()};h.removeHooks=function(a){u[a]&&(u[a]=[])};h.removeAllHooks=function(){u={}};return h}var sa=ra();const Fa={};
class Ga{sanitize(a){sa.sanitize(a,{IN_PLACE:!0})}validAttribute(a,b,c){return sa.isValidAttribute(a,b,c)}validProperty(a,b,c){const d=Fa[b];return d?this.validAttribute(a,d,c):this.validAttribute(a,b,c)}}let Ha=0;const Ia=new Map;function D(a){return Ia.get(a)||""}let Ja,Ka;function La(a){Ja=new Map([[1,a],[2,a]]);Ka=a}function E(a){return 3===("nodeType"in a?a.nodeType:a[0])}
function Ma(a){if(E(a)){var b=document.createTextNode(D(a[5]));F(b,a[7]);return b}b=(b=void 0!==a[6]?D(a[6]):void 0)?document.createElementNS(b,D(a[1])):document.createElement(D(a[1]));F(b,a[7]);return b}function L(a){return(a=Ja.get(a))&&"BODY"===a.nodeName?Ka:a}function F(a,b){a._index_=b;Ja.set(b,a)}
function Na(a,b){return Oa(b)?Promise.all([fetch(a).then((a)=>a.text()),fetch(b).then((a)=>a.text())]).then(([a,d])=>{const c=[];for(let a in document.body.style)c.push(`'${a}'`);a=`\n          'use strict';\n          ${a}\n          (function() {\n            var self = this;\n            var window = this;\n            var document = this.document;\n            var localStorage = this.localStorage;\n            var location = this.location;\n            var defaultView = document.defaultView;\n            var Node = defaultView.Node;\n            var Text = defaultView.Text;\n            var Element = defaultView.Element;\n            var SVGElement = defaultView.SVGElement;\n            var Document = defaultView.Document;\n            var Event = defaultView.Event;\n            var MutationObserver = defaultView.MutationObserver;\n\n            function addEventListener(type, handler) {\n              return document.addEventListener(type, handler);\n            }\n            function removeEventListener(type, handler) {\n              return document.removeEventListener(type, handler);\n            }\n            this.appendKeys([${c}]);\n            ${d}\n          }).call(WorkerThread.workerDOM);\n//# sourceURL=${encodeURI(b)}`;return new Worker(URL.createObjectURL(new Blob([a])))}).catch(()=>
null):new Promise(()=>null)}function Oa(a){if(window.URL&&window.URL.prototype&&"href"in window.URL.prototype)return(new URL(a,location.href)).hostname===location.hostname;const b=document.createElement("a");b.href=a;b.protocol||(b.href=b.href);return b.hostname===location.hostname}
const Pa=[],M=(a,b)=>{b&&"value"in b&&null===b.onchange&&(b.onchange=()=>{a.postMessage({9:5,38:{7:b._index_,18:b.value}})})},bb=(a,b)=>(c)=>{var d=c.currentTarget;d&&"value"in d&&(d=c.currentTarget,a.postMessage({9:5,38:{7:d._index_,18:d.value}}));a.postMessage({9:1,37:{7:b,22:c.bubbles,23:c.cancelable,24:c.cancelBubble,25:{7:c.currentTarget._index_,8:1},26:c.defaultPrevented,27:c.eventPhase,28:c.isTrusted,29:c.returnValue,10:{7:c.target._index_,8:1},
30:c.timeStamp,9:c.type,32:"keyCode"in c?c.keyCode:void 0}})};function cb(a,b){const c=L(b[10]);(b[21]||[]).forEach((b)=>{db(a,c,!1,D(b[9]),b[33])});(b[20]||[]).forEach((b)=>{db(a,c,!0,D(b[9]),b[33])})}function db(a,b,c,d,e){let p=null!==b.onchange;const q=b&&"value"in b,w="change"===d;c?(w&&(p=!0,b.onchange=null),b.addEventListener(d,Pa[e]=bb(a,b._index_))):(w&&(p=!1),b.removeEventListener(d,Pa[e]));q&&!p&&M(a,b)}function eb(a){return 0<a.length&&[].every.call(a,E)}
function N(a,b,c){[].forEach.call(b.childNodes,(a)=>a.remove());a.forEach((a,e)=>{const d=Ma(a);(a[2]||[]).forEach((a)=>{const b=D(a[0]);"null"!==b?d.setAttributeNS(b,D(a[1]),D(a[2])):d.setAttribute(D(a[1]),D(a[2]))});b.appendChild(d);M(c,d);N(a[4]||[],b.childNodes[e],c)})}
function fb(a,b,c){var d=E(a),e=E(b);if(d||e)d&&e&&(F(b,a[7]),b.textContent=D(a[5]),M(c,b));else if(d=a[4]||[],d.length!==b.childNodes.length)if(eb(d)&&eb(b.childNodes))N(d,b,c);else{e=d.filter((a)=>!E(a));const p=[].filter.call(b.childNodes,(a)=>!E(a));e.length===p.length&&(F(b,a[7]),N(d,b,c))}else F(b,a[7]),M(c,b),d.forEach((a,d)=>fb(a,b.childNodes[d],c))}
function gb(a,b,c,d,e){b.forEach((a)=>{Ia.set(++Ha,a)});0===d.childNodes.length?N(a[4]||[],d,e):fb(a,d,e);c.forEach((a)=>{const b=L(a[7]);b&&db(e,b,!0,D(a[9]),a[33])})}let O=[],hb=!1,ib;
const jb={2(a,b,c){(a[12]||[]).forEach((a)=>L(a[7]).remove());const d=a[11],e=a[14];d&&d.forEach((a)=>{let d=L(a[7]);d||(d=Ma(a),c&&c.sanitize(d));b.insertBefore(d,e&&L(e[7])||null)})},0(a,b,c){const d=void 0!==a[15]?D(a[15]):null;a=void 0!==a[18]?D(a[18]):null;null==d||null==a||c&&!c.validAttribute(b.nodeName,d,a)||b.setAttribute(d,a)},1(a,b){if(a=a[18])b.textContent=D(a)},3(a,b,c){const d=void 0!==a[17]?D(a[17]):null;a=void 0!==a[18]?D(a[18]):null;d&&a&&(!c||c.validProperty(b.nodeName,d,
a))&&(b[d]=a)},4(a){cb(ib,a)}};function kb(a,b,c,d){b.forEach((a)=>{Ia.set(++Ha,a)});a.forEach((a)=>Ma(a));O=O.concat(c);hb||(hb=!0,requestAnimationFrame(()=>lb(d)))}function lb(a){O.forEach((b)=>{jb[b[9]](b,L(b[10]),a)});O=[];hb=!1}function mb(a,b,c){const d=a.getAttribute("src");null!==d&&Na(b,d).then((b)=>{null!==b&&(La(a),ib=b,b.onmessage=({data:d})=>{switch(d[9]){case 2:gb(d[35],d[39],d[20],a,b);break;case 3:kb(d[35],d[39],d[34],c)}})})}var upgradeElement=function(a,b){mb(a,b,new Ga)};export{upgradeElement};
//# sourceMappingURL=index.safe.mjs.map
