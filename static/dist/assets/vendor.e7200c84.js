var t = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {};

function e(t) {
    return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t
}

function r(t) {
    if (t.__esModule) return t;
    var e = Object.defineProperty({}, "__esModule", {
        value: !0
    });
    return Object.keys(t).forEach((function(r) {
        var n = Object.getOwnPropertyDescriptor(t, r);
        Object.defineProperty(e, r, n.get ? n : {
            enumerable: !0,
            get: function() {
                return t[r]
            }
        })
    })), e
}
var n = {
    exports: {}
};

function i() {}
i.prototype = {
    on: function(t, e, r) {
        var n = this.e || (this.e = {});
        return (n[t] || (n[t] = [])).push({
            fn: e,
            ctx: r
        }), this
    },
    once: function(t, e, r) {
        var n = this;

        function i() {
            n.off(t, i), e.apply(r, arguments)
        }
        return i._ = e, this.on(t, i, r)
    },
    emit: function(t) {
        for (var e = [].slice.call(arguments, 1), r = ((this.e || (this.e = {}))[t] || []).slice(), n = 0, i = r.length; n < i; n++) r[n].fn.apply(r[n].ctx, e);
        return this
    },
    off: function(t, e) {
        var r = this.e || (this.e = {}),
            n = r[t],
            i = [];
        if (n && e)
            for (var o = 0, a = n.length; o < a; o++) n[o].fn !== e && n[o].fn._ !== e && i.push(n[o]);
        return i.length ? r[t] = i : delete r[t], this
    }
}, n.exports = i, n.exports.TinyEmitter = i;
var o = n.exports;
class a {
    constructor(t) {
        this.wrap = document.querySelector("[data-router-wrapper]"), this.properties = t, this.Transition = t.transition ? new t.transition.class(this.wrap, t.transition.name) : null
    }
    setup() {
        this.onEnter && this.onEnter(), this.onEnterCompleted && this.onEnterCompleted()
    }
    add() {
        this.wrap.insertAdjacentHTML("beforeend", this.properties.view.outerHTML)
    }
    update() {
        document.title = this.properties.page.title
    }
    show(t) {
        return new Promise((async e => {
            this.update(), this.onEnter && this.onEnter(), this.Transition && await this.Transition.show(t), this.onEnterCompleted && this.onEnterCompleted(), e()
        }))
    }
    hide(t) {
        return new Promise((async e => {
            this.onLeave && this.onLeave(), this.Transition && await this.Transition.hide(t), this.onLeaveCompleted && this.onLeaveCompleted(), e()
        }))
    }
}
const s = new window.DOMParser;
class u {
    constructor(t, e) {
        this.renderers = t, this.transitions = e
    }
    getOrigin(t) {
        const e = t.match(/(https?:\/\/[\w\-.]+)/);
        return e ? e[1].replace(/https?:\/\//, "") : null
    }
    getPathname(t) {
        const e = t.match(/https?:\/\/.*?(\/[\w_\-./]+)/);
        return e ? e[1] : "/"
    }
    getAnchor(t) {
        const e = t.match(/(#.*)$/);
        return e ? e[1] : null
    }
    getParams(t) {
        const e = t.match(/\?([\w_\-.=&]+)/);
        if (!e) return null;
        const r = e[1].split("&"),
            n = {};
        for (let i = 0; i < r.length; i++) {
            const t = r[i].split("="),
                {
                    0: e
                } = t,
                {
                    1: o
                } = t;
            n[e] = o
        }
        return n
    }
    getDOM(t) {
        return "string" == typeof t ? s.parseFromString(t, "text/html") : t
    }
    getView(t) {
        return t.querySelector("[data-router-view]")
    }
    getSlug(t) {
        return t.getAttribute("data-router-view")
    }
    getRenderer(t) {
        if (!this.renderers) return Promise.resolve(a);
        if (t in this.renderers) {
            const e = this.renderers[t];
            return "function" != typeof e || a.isPrototypeOf(e) ? "function" == typeof e.then ? Promise.resolve(e).then((({
                default: t
            }) => t)) : Promise.resolve(e) : Promise.resolve(e()).then((({
                default: t
            }) => t))
        }
        return Promise.resolve(a)
    }
    getTransition(t) {
        return this.transitions ? t in this.transitions ? {
            class: this.transitions[t],
            name: t
        } : "default" in this.transitions ? {
            class: this.transitions.default,
            name: "default"
        } : null : null
    }
    getProperties(t) {
        const e = this.getDOM(t),
            r = this.getView(e),
            n = this.getSlug(r);
        return {
            page: e,
            view: r,
            slug: n,
            renderer: this.getRenderer(n, this.renderers),
            transition: this.getTransition(n, this.transitions)
        }
    }
    getLocation(t) {
        return {
            href: t,
            anchor: this.getAnchor(t),
            origin: this.getOrigin(t),
            params: this.getParams(t),
            pathname: this.getPathname(t)
        }
    }
}
console.log("code wizards");
var c = {
        Core: class extends o {
            constructor({
                renderers: t,
                transitions: e
            } = {}) {
                super(), this.Helpers = new u(t, e), this.Transitions = e, this.Contextual = !1, this.location = this.Helpers.getLocation(window.location.href), this.properties = this.Helpers.getProperties(document.cloneNode(!0)), this.popping = !1, this.running = !1, this.trigger = null, this.cache = new Map, this.cache.set(this.location.href, this.properties), this.properties.renderer.then((t => {
                    this.From = new t(this.properties), this.From.setup()
                })), this._navigate = this.navigate.bind(this), window.addEventListener("popstate", this.popState.bind(this)), this.links = document.querySelectorAll("a:not([target]):not([data-router-disabled])"), this.attach(this.links)
            }
            attach(t) {
                for (const e of t) e.addEventListener("click", this._navigate)
            }
            detach(t) {
                for (const e of t) e.removeEventListener("click", this._navigate)
            }
            navigate(t) {
                if (!t.metaKey && !t.ctrlKey) {
                    t.preventDefault();
                    const e = !!t.currentTarget.hasAttribute("data-transition") && t.currentTarget.dataset.transition;
                    this.redirect(t.currentTarget.href, e, t.currentTarget)
                }
            }
            redirect(t, e = !1, r = "script") {
                if (this.trigger = r, !this.running && t !== this.location.href) {
                    const r = this.Helpers.getLocation(t);
                    this.Contextual = !1, e && (this.Contextual = this.Transitions.contextual[e].prototype, this.Contextual.name = e), r.origin !== this.location.origin || r.anchor && r.pathname === this.location.pathname ? window.location.href = t : (this.location = r, this.beforeFetch())
                }
            }
            popState() {
                this.trigger = "popstate", this.Contextual = !1;
                const t = this.Helpers.getLocation(window.location.href);
                this.location.pathname !== t.pathname || !this.location.anchor && !t.anchor ? (this.popping = !0, this.location = t, this.beforeFetch()) : this.location = t
            }
            pushState() {
                this.popping || window.history.pushState(this.location, "", this.location.href)
            }
            async fetch() {
                const t = await fetch(this.location.href, {
                    mode: "same-origin",
                    method: "GET",
                    headers: {
                        "X-Requested-With": "Highway"
                    },
                    credentials: "same-origin"
                });
                if (t.status >= 200 && t.status < 300) return t.text();
                window.location.href = this.location.href
            }
            async beforeFetch() {
                this.pushState(), this.running = !0, this.emit("NAVIGATE_OUT", {
                    from: {
                        page: this.From.properties.page,
                        view: this.From.properties.view
                    },
                    trigger: this.trigger,
                    location: this.location
                });
                const t = {
                    trigger: this.trigger,
                    contextual: this.Contextual
                };
                if (this.cache.has(this.location.href)) await this.From.hide(t), this.properties = this.cache.get(this.location.href);
                else {
                    const e = await Promise.all([this.fetch(), this.From.hide(t)]);
                    this.properties = this.Helpers.getProperties(e[0]), this.cache.set(this.location.href, this.properties)
                }
                this.afterFetch()
            }
            async afterFetch() {
                const t = await this.properties.renderer;
                this.To = new t(this.properties), this.To.add(), this.emit("NAVIGATE_IN", {
                    to: {
                        page: this.To.properties.page,
                        view: this.To.wrap.lastElementChild
                    },
                    trigger: this.trigger,
                    location: this.location
                }), await this.To.show({
                    trigger: this.trigger,
                    contextual: this.Contextual
                }), this.popping = !1, this.running = !1, this.detach(this.links), this.links = document.querySelectorAll("a:not([target]):not([data-router-disabled])"), this.attach(this.links), this.emit("NAVIGATE_END", {
                    to: {
                        page: this.To.properties.page,
                        view: this.To.wrap.lastElementChild
                    },
                    from: {
                        page: this.From.properties.page,
                        view: this.From.properties.view
                    },
                    trigger: this.trigger,
                    location: this.location
                }), this.From = this.To, this.trigger = null
            }
        },
        Helpers: u,
        Renderer: a,
        Transition: class {
            constructor(t, e) {
                this.wrap = t, this.name = e
            }
            show({
                trigger: t,
                contextual: e
            }) {
                const r = this.wrap.lastElementChild,
                    n = this.wrap.firstElementChild;
                return new Promise((i => {
                    e ? (r.setAttribute("data-transition-in", e.name), r.removeAttribute("data-transition-out", e.name), e.in && e.in({
                        to: r,
                        from: n,
                        trigger: t,
                        done: i
                    })) : (r.setAttribute("data-transition-in", this.name), r.removeAttribute("data-transition-out", this.name), this.in && this.in({
                        to: r,
                        from: n,
                        trigger: t,
                        done: i
                    }))
                }))
            }
            hide({
                trigger: t,
                contextual: e
            }) {
                const r = this.wrap.firstElementChild;
                return new Promise((n => {
                    e ? (r.setAttribute("data-transition-out", e.name), r.removeAttribute("data-transition-in", e.name), e.out && e.out({
                        from: r,
                        trigger: t,
                        done: n
                    })) : (r.setAttribute("data-transition-out", this.name), r.removeAttribute("data-transition-in", this.name), this.out && this.out({
                        from: r,
                        trigger: t,
                        done: n
                    }))
                }))
            }
        }
    },
    l = {
        update: null,
        begin: null,
        loopBegin: null,
        changeBegin: null,
        change: null,
        changeComplete: null,
        loopComplete: null,
        complete: null,
        loop: 1,
        direction: "normal",
        autoplay: !0,
        timelineOffset: 0
    },
    h = {
        duration: 1e3,
        delay: 0,
        endDelay: 0,
        easing: "easeOutElastic(1, .5)",
        round: 0
    },
    p = ["translateX", "translateY", "translateZ", "rotate", "rotateX", "rotateY", "rotateZ", "scale", "scaleX", "scaleY", "scaleZ", "skew", "skewX", "skewY", "perspective", "matrix", "matrix3d"],
    d = {
        CSS: {},
        springs: {}
    };

function f(t, e, r) {
    return Math.min(Math.max(t, e), r)
}

function v(t, e) {
    return t.indexOf(e) > -1
}

function g(t, e) {
    return t.apply(null, e)
}
var _ = {
    arr: function(t) {
        return Array.isArray(t)
    },
    obj: function(t) {
        return v(Object.prototype.toString.call(t), "Object")
    },
    pth: function(t) {
        return _.obj(t) && t.hasOwnProperty("totalLength")
    },
    svg: function(t) {
        return t instanceof SVGElement
    },
    inp: function(t) {
        return t instanceof HTMLInputElement
    },
    dom: function(t) {
        return t.nodeType || _.svg(t)
    },
    str: function(t) {
        return "string" == typeof t
    },
    fnc: function(t) {
        return "function" == typeof t
    },
    und: function(t) {
        return void 0 === t
    },
    nil: function(t) {
        return _.und(t) || null === t
    },
    hex: function(t) {
        return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(t)
    },
    rgb: function(t) {
        return /^rgb/.test(t)
    },
    hsl: function(t) {
        return /^hsl/.test(t)
    },
    col: function(t) {
        return _.hex(t) || _.rgb(t) || _.hsl(t)
    },
    key: function(t) {
        return !l.hasOwnProperty(t) && !h.hasOwnProperty(t) && "targets" !== t && "keyframes" !== t
    }
};

function y(t) {
    var e = /\(([^)]+)\)/.exec(t);
    return e ? e[1].split(",").map((function(t) {
        return parseFloat(t)
    })) : []
}

function m(t, e) {
    var r = y(t),
        n = f(_.und(r[0]) ? 1 : r[0], .1, 100),
        i = f(_.und(r[1]) ? 100 : r[1], .1, 100),
        o = f(_.und(r[2]) ? 10 : r[2], .1, 100),
        a = f(_.und(r[3]) ? 0 : r[3], .1, 100),
        s = Math.sqrt(i / n),
        u = o / (2 * Math.sqrt(i * n)),
        c = u < 1 ? s * Math.sqrt(1 - u * u) : 0,
        l = u < 1 ? (u * s - a) / c : -a + s;

    function h(t) {
        var r = e ? e * t / 1e3 : t;
        return r = u < 1 ? Math.exp(-r * u * s) * (1 * Math.cos(c * r) + l * Math.sin(c * r)) : (1 + l * r) * Math.exp(-r * s), 0 === t || 1 === t ? t : 1 - r
    }
    return e ? h : function() {
        var e = d.springs[t];
        if (e) return e;
        for (var r = 1 / 6, n = 0, i = 0;;)
            if (1 === h(n += r)) {
                if (++i >= 16) break
            } else i = 0;
        var o = n * r * 1e3;
        return d.springs[t] = o, o
    }
}

function b(t) {
    return void 0 === t && (t = 10),
        function(e) {
            return Math.ceil(f(e, 1e-6, 1) * t) * (1 / t)
        }
}
var w, P, j = function() {
        var t = .1;

        function e(t, e) {
            return 1 - 3 * e + 3 * t
        }

        function r(t, e) {
            return 3 * e - 6 * t
        }

        function n(t) {
            return 3 * t
        }

        function i(t, i, o) {
            return ((e(i, o) * t + r(i, o)) * t + n(i)) * t
        }

        function o(t, i, o) {
            return 3 * e(i, o) * t * t + 2 * r(i, o) * t + n(i)
        }
        return function(e, r, n, a) {
            if (0 <= e && e <= 1 && 0 <= n && n <= 1) {
                var s = new Float32Array(11);
                if (e !== r || n !== a)
                    for (var u = 0; u < 11; ++u) s[u] = i(u * t, e, n);
                return function(t) {
                    return e === r && n === a || 0 === t || 1 === t ? t : i(c(t), r, a)
                }
            }

            function c(r) {
                for (var a = 0, u = 1; 10 !== u && s[u] <= r; ++u) a += t;
                --u;
                var c = a + (r - s[u]) / (s[u + 1] - s[u]) * t,
                    l = o(c, e, n);
                return l >= .001 ? function(t, e, r, n) {
                    for (var a = 0; a < 4; ++a) {
                        var s = o(e, r, n);
                        if (0 === s) return e;
                        e -= (i(e, r, n) - t) / s
                    }
                    return e
                }(r, c, e, n) : 0 === l ? c : function(t, e, r, n, o) {
                    var a, s, u = 0;
                    do {
                        (a = i(s = e + (r - e) / 2, n, o) - t) > 0 ? r = s : e = s
                    } while (Math.abs(a) > 1e-7 && ++u < 10);
                    return s
                }(r, a, a + t, e, n)
            }
        }
    }(),
    O = (w = {
        linear: function() {
            return function(t) {
                return t
            }
        }
    }, P = {
        Sine: function() {
            return function(t) {
                return 1 - Math.cos(t * Math.PI / 2)
            }
        },
        Circ: function() {
            return function(t) {
                return 1 - Math.sqrt(1 - t * t)
            }
        },
        Back: function() {
            return function(t) {
                return t * t * (3 * t - 2)
            }
        },
        Bounce: function() {
            return function(t) {
                for (var e, r = 4; t < ((e = Math.pow(2, --r)) - 1) / 11;);
                return 1 / Math.pow(4, 3 - r) - 7.5625 * Math.pow((3 * e - 2) / 22 - t, 2)
            }
        },
        Elastic: function(t, e) {
            void 0 === t && (t = 1), void 0 === e && (e = .5);
            var r = f(t, 1, 10),
                n = f(e, .1, 2);
            return function(t) {
                return 0 === t || 1 === t ? t : -r * Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1 - n / (2 * Math.PI) * Math.asin(1 / r)) * (2 * Math.PI) / n)
            }
        }
    }, ["Quad", "Cubic", "Quart", "Quint", "Expo"].forEach((function(t, e) {
        P[t] = function() {
            return function(t) {
                return Math.pow(t, e + 2)
            }
        }
    })), Object.keys(P).forEach((function(t) {
        var e = P[t];
        w["easeIn" + t] = e, w["easeOut" + t] = function(t, r) {
            return function(n) {
                return 1 - e(t, r)(1 - n)
            }
        }, w["easeInOut" + t] = function(t, r) {
            return function(n) {
                return n < .5 ? e(t, r)(2 * n) / 2 : 1 - e(t, r)(-2 * n + 2) / 2
            }
        }, w["easeOutIn" + t] = function(t, r) {
            return function(n) {
                return n < .5 ? (1 - e(t, r)(1 - 2 * n)) / 2 : (e(t, r)(2 * n - 1) + 1) / 2
            }
        }
    })), w);

function S(t, e) {
    if (_.fnc(t)) return t;
    var r = t.split("(")[0],
        n = O[r],
        i = y(t);
    switch (r) {
        case "spring":
            return m(t, e);
        case "cubicBezier":
            return g(j, i);
        case "steps":
            return g(b, i);
        default:
            return g(n, i)
    }
}

function T(t) {
    try {
        return document.querySelectorAll(t)
    } catch (e) {
        return
    }
}

function D(t, e) {
    for (var r = t.length, n = arguments.length >= 2 ? arguments[1] : void 0, i = [], o = 0; o < r; o++)
        if (o in t) {
            var a = t[o];
            e.call(n, a, o, t) && i.push(a)
        }
    return i
}

function k(t) {
    return t.reduce((function(t, e) {
        return t.concat(_.arr(e) ? k(e) : e)
    }), [])
}

function C(t) {
    return _.arr(t) ? t : (_.str(t) && (t = T(t) || t), t instanceof NodeList || t instanceof HTMLCollection ? [].slice.call(t) : [t])
}

function x(t, e) {
    return t.some((function(t) {
        return t === e
    }))
}

function A(t) {
    var e = {};
    for (var r in t) e[r] = t[r];
    return e
}

function I(t, e) {
    var r = A(t);
    for (var n in t) r[n] = e.hasOwnProperty(n) ? e[n] : t[n];
    return r
}

function E(t, e) {
    var r = A(t);
    for (var n in e) r[n] = _.und(t[n]) ? e[n] : t[n];
    return r
}

function M(t) {
    return _.rgb(t) ? (r = /rgb\((\d+,\s*[\d]+,\s*[\d]+)\)/g.exec(e = t)) ? "rgba(" + r[1] + ",1)" : e : _.hex(t) ? function(t) {
        var e = t.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (function(t, e, r, n) {
                return e + e + r + r + n + n
            })),
            r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);
        return "rgba(" + parseInt(r[1], 16) + "," + parseInt(r[2], 16) + "," + parseInt(r[3], 16) + ",1)"
    }(t) : _.hsl(t) ? function(t) {
        var e, r, n, i = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(t) || /hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)/g.exec(t),
            o = parseInt(i[1], 10) / 360,
            a = parseInt(i[2], 10) / 100,
            s = parseInt(i[3], 10) / 100,
            u = i[4] || 1;

        function c(t, e, r) {
            return r < 0 && (r += 1), r > 1 && (r -= 1), r < 1 / 6 ? t + 6 * (e - t) * r : r < .5 ? e : r < 2 / 3 ? t + (e - t) * (2 / 3 - r) * 6 : t
        }
        if (0 == a) e = r = n = s;
        else {
            var l = s < .5 ? s * (1 + a) : s + a - s * a,
                h = 2 * s - l;
            e = c(h, l, o + 1 / 3), r = c(h, l, o), n = c(h, l, o - 1 / 3)
        }
        return "rgba(" + 255 * e + "," + 255 * r + "," + 255 * n + "," + u + ")"
    }(t) : void 0;
    var e, r
}

function F(t) {
    var e = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(t);
    if (e) return e[1]
}

function V(t, e) {
    return _.fnc(t) ? t(e.target, e.id, e.total) : t
}

function N(t, e) {
    return t.getAttribute(e)
}

function B(t, e, r) {
    if (x([r, "deg", "rad", "turn"], F(e))) return e;
    var n = d.CSS[e + r];
    if (!_.und(n)) return n;
    var i = document.createElement(t.tagName),
        o = t.parentNode && t.parentNode !== document ? t.parentNode : document.body;
    o.appendChild(i), i.style.position = "absolute", i.style.width = 100 + r;
    var a = 100 / i.offsetWidth;
    o.removeChild(i);
    var s = a * parseFloat(e);
    return d.CSS[e + r] = s, s
}

function R(t, e, r) {
    if (e in t.style) {
        var n = e.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(),
            i = t.style[e] || getComputedStyle(t).getPropertyValue(n) || "0";
        return r ? B(t, i, r) : i
    }
}

function z(t, e) {
    return _.dom(t) && !_.inp(t) && (!_.nil(N(t, e)) || _.svg(t) && t[e]) ? "attribute" : _.dom(t) && x(p, e) ? "transform" : _.dom(t) && "transform" !== e && R(t, e) ? "css" : null != t[e] ? "object" : void 0
}

function L(t) {
    if (_.dom(t)) {
        for (var e, r = t.style.transform || "", n = /(\w+)\(([^)]*)\)/g, i = new Map; e = n.exec(r);) i.set(e[1], e[2]);
        return i
    }
}

function $(t, e, r, n) {
    var i = v(e, "scale") ? 1 : 0 + function(t) {
            return v(t, "translate") || "perspective" === t ? "px" : v(t, "rotate") || v(t, "skew") ? "deg" : void 0
        }(e),
        o = L(t).get(e) || i;
    return r && (r.transforms.list.set(e, o), r.transforms.last = e), n ? B(t, o, n) : o
}

function U(t, e, r, n) {
    switch (z(t, e)) {
        case "transform":
            return $(t, e, n, r);
        case "css":
            return R(t, e, r);
        case "attribute":
            return N(t, e);
        default:
            return t[e] || 0
    }
}

function q(t, e) {
    var r = /^(\*=|\+=|-=)/.exec(t);
    if (!r) return t;
    var n = F(t) || 0,
        i = parseFloat(e),
        o = parseFloat(t.replace(r[0], ""));
    switch (r[0][0]) {
        case "+":
            return i + o + n;
        case "-":
            return i - o + n;
        case "*":
            return i * o + n
    }
}

function H(t, e) {
    if (_.col(t)) return M(t);
    if (/\s/g.test(t)) return t;
    var r = F(t),
        n = r ? t.substr(0, t.length - r.length) : t;
    return e ? n + e : n
}

function W(t, e) {
    return Math.sqrt(Math.pow(e.x - t.x, 2) + Math.pow(e.y - t.y, 2))
}

function G(t) {
    for (var e, r = t.points, n = 0, i = 0; i < r.numberOfItems; i++) {
        var o = r.getItem(i);
        i > 0 && (n += W(e, o)), e = o
    }
    return n
}

function K(t) {
    if (t.getTotalLength) return t.getTotalLength();
    switch (t.tagName.toLowerCase()) {
        case "circle":
            return function(t) {
                return 2 * Math.PI * N(t, "r")
            }(t);
        case "rect":
            return function(t) {
                return 2 * N(t, "width") + 2 * N(t, "height")
            }(t);
        case "line":
            return function(t) {
                return W({
                    x: N(t, "x1"),
                    y: N(t, "y1")
                }, {
                    x: N(t, "x2"),
                    y: N(t, "y2")
                })
            }(t);
        case "polyline":
            return G(t);
        case "polygon":
            return function(t) {
                var e = t.points;
                return G(t) + W(e.getItem(e.numberOfItems - 1), e.getItem(0))
            }(t)
    }
}

function X(t, e) {
    var r = e || {},
        n = r.el || function(t) {
            for (var e = t.parentNode; _.svg(e) && _.svg(e.parentNode);) e = e.parentNode;
            return e
        }(t),
        i = n.getBoundingClientRect(),
        o = N(n, "viewBox"),
        a = i.width,
        s = i.height,
        u = r.viewBox || (o ? o.split(" ") : [0, 0, a, s]);
    return {
        el: n,
        viewBox: u,
        x: u[0] / 1,
        y: u[1] / 1,
        w: a,
        h: s,
        vW: u[2],
        vH: u[3]
    }
}

function J(t, e, r) {
    function n(r) {
        void 0 === r && (r = 0);
        var n = e + r >= 1 ? e + r : 0;
        return t.el.getPointAtLength(n)
    }
    var i = X(t.el, t.svg),
        o = n(),
        a = n(-1),
        s = n(1),
        u = r ? 1 : i.w / i.vW,
        c = r ? 1 : i.h / i.vH;
    switch (t.property) {
        case "x":
            return (o.x - i.x) * u;
        case "y":
            return (o.y - i.y) * c;
        case "angle":
            return 180 * Math.atan2(s.y - a.y, s.x - a.x) / Math.PI
    }
}

function Y(t, e) {
    var r = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g,
        n = H(_.pth(t) ? t.totalLength : t, e) + "";
    return {
        original: n,
        numbers: n.match(r) ? n.match(r).map(Number) : [0],
        strings: _.str(t) || e ? n.split(r) : []
    }
}

function Z(t) {
    return D(t ? k(_.arr(t) ? t.map(C) : C(t)) : [], (function(t, e, r) {
        return r.indexOf(t) === e
    }))
}

function Q(t) {
    var e = Z(t);
    return e.map((function(t, r) {
        return {
            target: t,
            id: r,
            total: e.length,
            transforms: {
                list: L(t)
            }
        }
    }))
}

function tt(t, e) {
    var r = A(e);
    if (/^spring/.test(r.easing) && (r.duration = m(r.easing)), _.arr(t)) {
        var n = t.length;
        2 === n && !_.obj(t[0]) ? t = {
            value: t
        } : _.fnc(e.duration) || (r.duration = e.duration / n)
    }
    var i = _.arr(t) ? t : [t];
    return i.map((function(t, r) {
        var n = _.obj(t) && !_.pth(t) ? t : {
            value: t
        };
        return _.und(n.delay) && (n.delay = r ? 0 : e.delay), _.und(n.endDelay) && (n.endDelay = r === i.length - 1 ? e.endDelay : 0), n
    })).map((function(t) {
        return E(t, r)
    }))
}

function et(t, e) {
    var r = [],
        n = e.keyframes;
    for (var i in n && (e = E(function(t) {
            for (var e = D(k(t.map((function(t) {
                    return Object.keys(t)
                }))), (function(t) {
                    return _.key(t)
                })).reduce((function(t, e) {
                    return t.indexOf(e) < 0 && t.push(e), t
                }), []), r = {}, n = function(n) {
                    var i = e[n];
                    r[i] = t.map((function(t) {
                        var e = {};
                        for (var r in t) _.key(r) ? r == i && (e.value = t[r]) : e[r] = t[r];
                        return e
                    }))
                }, i = 0; i < e.length; i++) n(i);
            return r
        }(n), e)), e) _.key(i) && r.push({
        name: i,
        tweens: tt(e[i], t)
    });
    return r
}

function rt(t, e) {
    var r;
    return t.tweens.map((function(n) {
        var i = function(t, e) {
                var r = {};
                for (var n in t) {
                    var i = V(t[n], e);
                    _.arr(i) && 1 === (i = i.map((function(t) {
                        return V(t, e)
                    }))).length && (i = i[0]), r[n] = i
                }
                return r.duration = parseFloat(r.duration), r.delay = parseFloat(r.delay), r
            }(n, e),
            o = i.value,
            a = _.arr(o) ? o[1] : o,
            s = F(a),
            u = U(e.target, t.name, s, e),
            c = r ? r.to.original : u,
            l = _.arr(o) ? o[0] : c,
            h = F(l) || F(u),
            p = s || h;
        return _.und(a) && (a = c), i.from = Y(l, p), i.to = Y(q(a, l), p), i.start = r ? r.end : 0, i.end = i.start + i.delay + i.duration + i.endDelay, i.easing = S(i.easing, i.duration), i.isPath = _.pth(o), i.isPathTargetInsideSVG = i.isPath && _.svg(e.target), i.isColor = _.col(i.from.original), i.isColor && (i.round = 1), r = i, i
    }))
}
var nt = {
    css: function(t, e, r) {
        return t.style[e] = r
    },
    attribute: function(t, e, r) {
        return t.setAttribute(e, r)
    },
    object: function(t, e, r) {
        return t[e] = r
    },
    transform: function(t, e, r, n, i) {
        if (n.list.set(e, r), e === n.last || i) {
            var o = "";
            n.list.forEach((function(t, e) {
                o += e + "(" + t + ") "
            })), t.style.transform = o
        }
    }
};

function it(t, e) {
    Q(t).forEach((function(t) {
        for (var r in e) {
            var n = V(e[r], t),
                i = t.target,
                o = F(n),
                a = U(i, r, o, t),
                s = q(H(n, o || F(a)), a),
                u = z(i, r);
            nt[u](i, r, s, t.transforms, !0)
        }
    }))
}

function ot(t, e) {
    return D(k(t.map((function(t) {
        return e.map((function(e) {
            return function(t, e) {
                var r = z(t.target, e.name);
                if (r) {
                    var n = rt(e, t),
                        i = n[n.length - 1];
                    return {
                        type: r,
                        property: e.name,
                        animatable: t,
                        tweens: n,
                        duration: i.end,
                        delay: n[0].delay,
                        endDelay: i.endDelay
                    }
                }
            }(t, e)
        }))
    }))), (function(t) {
        return !_.und(t)
    }))
}

function at(t, e) {
    var r = t.length,
        n = function(t) {
            return t.timelineOffset ? t.timelineOffset : 0
        },
        i = {};
    return i.duration = r ? Math.max.apply(Math, t.map((function(t) {
        return n(t) + t.duration
    }))) : e.duration, i.delay = r ? Math.min.apply(Math, t.map((function(t) {
        return n(t) + t.delay
    }))) : e.delay, i.endDelay = r ? i.duration - Math.max.apply(Math, t.map((function(t) {
        return n(t) + t.duration - t.endDelay
    }))) : e.endDelay, i
}
var st = 0;
var ut = [],
    ct = function() {
        var t;

        function e(r) {
            for (var n = ut.length, i = 0; i < n;) {
                var o = ut[i];
                o.paused ? (ut.splice(i, 1), n--) : (o.tick(r), i++)
            }
            t = i > 0 ? requestAnimationFrame(e) : void 0
        }
        return "undefined" != typeof document && document.addEventListener("visibilitychange", (function() {
                ht.suspendWhenDocumentHidden && (lt() ? t = cancelAnimationFrame(t) : (ut.forEach((function(t) {
                    return t._onDocumentVisibility()
                })), ct()))
            })),
            function() {
                t || lt() && ht.suspendWhenDocumentHidden || !(ut.length > 0) || (t = requestAnimationFrame(e))
            }
    }();

function lt() {
    return !!document && document.hidden
}

function ht(t) {
    void 0 === t && (t = {});
    var e, r = 0,
        n = 0,
        i = 0,
        o = 0,
        a = null;

    function s(t) {
        var e = window.Promise && new Promise((function(t) {
            return a = t
        }));
        return t.finished = e, e
    }
    var u = function(t) {
        var e = I(l, t),
            r = I(h, t),
            n = et(r, t),
            i = Q(t.targets),
            o = ot(i, n),
            a = at(o, r),
            s = st;
        return st++, E(e, {
            id: s,
            children: [],
            animatables: i,
            animations: o,
            duration: a.duration,
            delay: a.delay,
            endDelay: a.endDelay
        })
    }(t);

    function c() {
        var t = u.direction;
        "alternate" !== t && (u.direction = "normal" !== t ? "normal" : "reverse"), u.reversed = !u.reversed, e.forEach((function(t) {
            return t.reversed = u.reversed
        }))
    }

    function p(t) {
        return u.reversed ? u.duration - t : t
    }

    function d() {
        r = 0, n = p(u.currentTime) * (1 / ht.speed)
    }

    function v(t, e) {
        e && e.seek(t - e.timelineOffset)
    }

    function g(t) {
        for (var e = 0, r = u.animations, n = r.length; e < n;) {
            var i = r[e],
                o = i.animatable,
                a = i.tweens,
                s = a.length - 1,
                c = a[s];
            s && (c = D(a, (function(e) {
                return t < e.end
            }))[0] || c);
            for (var l = f(t - c.start - c.delay, 0, c.duration) / c.duration, h = isNaN(l) ? 1 : c.easing(l), p = c.to.strings, d = c.round, v = [], g = c.to.numbers.length, _ = void 0, y = 0; y < g; y++) {
                var m = void 0,
                    b = c.to.numbers[y],
                    w = c.from.numbers[y] || 0;
                m = c.isPath ? J(c.value, h * b, c.isPathTargetInsideSVG) : w + h * (b - w), d && (c.isColor && y > 2 || (m = Math.round(m * d) / d)), v.push(m)
            }
            var P = p.length;
            if (P) {
                _ = p[0];
                for (var j = 0; j < P; j++) {
                    p[j];
                    var O = p[j + 1],
                        S = v[j];
                    isNaN(S) || (_ += O ? S + O : S + " ")
                }
            } else _ = v[0];
            nt[i.type](o.target, i.property, _, o.transforms), i.currentValue = _, e++
        }
    }

    function _(t) {
        u[t] && !u.passThrough && u[t](u)
    }

    function y(t) {
        var l = u.duration,
            h = u.delay,
            d = l - u.endDelay,
            y = p(t);
        u.progress = f(y / l * 100, 0, 100), u.reversePlayback = y < u.currentTime, e && function(t) {
            if (u.reversePlayback)
                for (var r = o; r--;) v(t, e[r]);
            else
                for (var n = 0; n < o; n++) v(t, e[n])
        }(y), !u.began && u.currentTime > 0 && (u.began = !0, _("begin")), !u.loopBegan && u.currentTime > 0 && (u.loopBegan = !0, _("loopBegin")), y <= h && 0 !== u.currentTime && g(0), (y >= d && u.currentTime !== l || !l) && g(l), y > h && y < d ? (u.changeBegan || (u.changeBegan = !0, u.changeCompleted = !1, _("changeBegin")), _("change"), g(y)) : u.changeBegan && (u.changeCompleted = !0, u.changeBegan = !1, _("changeComplete")), u.currentTime = f(y, 0, l), u.began && _("update"), t >= l && (n = 0, u.remaining && !0 !== u.remaining && u.remaining--, u.remaining ? (r = i, _("loopComplete"), u.loopBegan = !1, "alternate" === u.direction && c()) : (u.paused = !0, u.completed || (u.completed = !0, _("loopComplete"), _("complete"), !u.passThrough && "Promise" in window && (a(), s(u)))))
    }
    return s(u), u.reset = function() {
        var t = u.direction;
        u.passThrough = !1, u.currentTime = 0, u.progress = 0, u.paused = !0, u.began = !1, u.loopBegan = !1, u.changeBegan = !1, u.completed = !1, u.changeCompleted = !1, u.reversePlayback = !1, u.reversed = "reverse" === t, u.remaining = u.loop, e = u.children;
        for (var r = o = e.length; r--;) u.children[r].reset();
        (u.reversed && !0 !== u.loop || "alternate" === t && 1 === u.loop) && u.remaining++, g(u.reversed ? u.duration : 0)
    }, u._onDocumentVisibility = d, u.set = function(t, e) {
        return it(t, e), u
    }, u.tick = function(t) {
        i = t, r || (r = i), y((i + (n - r)) * ht.speed)
    }, u.seek = function(t) {
        y(p(t))
    }, u.pause = function() {
        u.paused = !0, d()
    }, u.play = function() {
        u.paused && (u.completed && u.reset(), u.paused = !1, ut.push(u), d(), ct())
    }, u.reverse = function() {
        c(), u.completed = !u.reversed, d()
    }, u.restart = function() {
        u.reset(), u.play()
    }, u.remove = function(t) {
        dt(Z(t), u)
    }, u.reset(), u.autoplay && u.play(), u
}

function pt(t, e) {
    for (var r = e.length; r--;) x(t, e[r].animatable.target) && e.splice(r, 1)
}

function dt(t, e) {
    var r = e.animations,
        n = e.children;
    pt(t, r);
    for (var i = n.length; i--;) {
        var o = n[i],
            a = o.animations;
        pt(t, a), a.length || o.children.length || n.splice(i, 1)
    }
    r.length || n.length || e.pause()
}
ht.version = "3.2.1", ht.speed = 1, ht.suspendWhenDocumentHidden = !0, ht.running = ut, ht.remove = function(t) {
    for (var e = Z(t), r = ut.length; r--;) {
        dt(e, ut[r])
    }
}, ht.get = U, ht.set = it, ht.convertPx = B, ht.path = function(t, e) {
    var r = _.str(t) ? T(t)[0] : t,
        n = e || 100;
    return function(t) {
        return {
            property: t,
            el: r,
            svg: X(r),
            totalLength: K(r) * (n / 100)
        }
    }
}, ht.setDashoffset = function(t) {
    var e = K(t);
    return t.setAttribute("stroke-dasharray", e), e
}, ht.stagger = function(t, e) {
    void 0 === e && (e = {});
    var r = e.direction || "normal",
        n = e.easing ? S(e.easing) : null,
        i = e.grid,
        o = e.axis,
        a = e.from || 0,
        s = "first" === a,
        u = "center" === a,
        c = "last" === a,
        l = _.arr(t),
        h = l ? parseFloat(t[0]) : parseFloat(t),
        p = l ? parseFloat(t[1]) : 0,
        d = F(l ? t[1] : t) || 0,
        f = e.start || 0 + (l ? h : 0),
        v = [],
        g = 0;
    return function(t, e, _) {
        if (s && (a = 0), u && (a = (_ - 1) / 2), c && (a = _ - 1), !v.length) {
            for (var y = 0; y < _; y++) {
                if (i) {
                    var m = u ? (i[0] - 1) / 2 : a % i[0],
                        b = u ? (i[1] - 1) / 2 : Math.floor(a / i[0]),
                        w = m - y % i[0],
                        P = b - Math.floor(y / i[0]),
                        j = Math.sqrt(w * w + P * P);
                    "x" === o && (j = -w), "y" === o && (j = -P), v.push(j)
                } else v.push(Math.abs(a - y));
                g = Math.max.apply(Math, v)
            }
            n && (v = v.map((function(t) {
                return n(t / g) * g
            }))), "reverse" === r && (v = v.map((function(t) {
                return o ? t < 0 ? -1 * t : -t : Math.abs(g - t)
            })))
        }
        return f + (l ? (p - h) / g : h) * (Math.round(100 * v[e]) / 100) + d
    }
}, ht.timeline = function(t) {
    void 0 === t && (t = {});
    var e = ht(t);
    return e.duration = 0, e.add = function(r, n) {
        var i = ut.indexOf(e),
            o = e.children;

        function a(t) {
            t.passThrough = !0
        }
        i > -1 && ut.splice(i, 1);
        for (var s = 0; s < o.length; s++) a(o[s]);
        var u = E(r, I(h, t));
        u.targets = u.targets || t.targets;
        var c = e.duration;
        u.autoplay = !1, u.direction = e.direction, u.timelineOffset = _.und(n) ? c : q(n, c), a(e), e.seek(u.timelineOffset);
        var l = ht(u);
        a(l), o.push(l);
        var p = at(o, t);
        return e.delay = p.delay, e.endDelay = p.endDelay, e.duration = p.duration, e.seek(0), e.reset(), e.autoplay && e.play(), e
    }, e
}, ht.easing = S, ht.penner = O, ht.random = function(t, e) {
    return Math.floor(Math.random() * (e - t + 1)) + t
};
var ft = {
        exports: {}
    },
    vt = {};
! function(e) {
    var r = Object.defineProperty,
        n = Object.defineProperties,
        i = Object.getOwnPropertyDescriptors,
        o = Object.getOwnPropertySymbols,
        a = Object.prototype.hasOwnProperty,
        s = Object.prototype.propertyIsEnumerable,
        u = (t, e, n) => e in t ? r(t, e, {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: n
        }) : t[e] = n;
    ((t, e) => {
        for (var n in (t => {
                r(t, "__esModule", {
                    value: !0
                })
            })(t), e) r(t, n, {
            get: e[n],
            enumerable: !0
        })
    })(e, {
        AbstractDerivation: () => oe,
        Atom: () => Oe,
        Box: () => Ce,
        ConstantDerivation: () => xe,
        DerivationFromSource: () => se,
        PointerProxy: () => Ge,
        Ticker: () => Ie,
        getPointerParts: () => de,
        isDerivation: () => Wt,
        isPointer: () => ge,
        iterateAndCountTicks: () => Ae,
        iterateOver: () => Ee,
        pointer: () => ve,
        prism: () => We,
        val: () => ke,
        valueDerivation: () => Te
    });
    var c = Array.isArray,
        l = "object" == typeof t && t && t.Object === Object && t,
        h = "object" == typeof self && self && self.Object === Object && self,
        p = l || h || Function("return this")(),
        d = p.Symbol,
        f = Object.prototype,
        v = f.hasOwnProperty,
        g = f.toString,
        _ = d ? d.toStringTag : void 0;
    var y = function(t) {
            var e = v.call(t, _),
                r = t[_];
            try {
                t[_] = void 0;
                var n = !0
            } catch (o) {}
            var i = g.call(t);
            return n && (e ? t[_] = r : delete t[_]), i
        },
        m = Object.prototype.toString;
    var b = function(t) {
            return m.call(t)
        },
        w = d ? d.toStringTag : void 0;
    var P = function(t) {
        return null == t ? void 0 === t ? "[object Undefined]" : "[object Null]" : w && w in Object(t) ? y(t) : b(t)
    };
    var j = function(t) {
        return null != t && "object" == typeof t
    };
    var O = function(t) {
            return "symbol" == typeof t || j(t) && "[object Symbol]" == P(t)
        },
        S = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
        T = /^\w*$/;
    var D = function(t, e) {
        if (c(t)) return !1;
        var r = typeof t;
        return !("number" != r && "symbol" != r && "boolean" != r && null != t && !O(t)) || (T.test(t) || !S.test(t) || null != e && t in Object(e))
    };
    var k = function(t) {
        var e = typeof t;
        return null != t && ("object" == e || "function" == e)
    };
    var C, x = function(t) {
            if (!k(t)) return !1;
            var e = P(t);
            return "[object Function]" == e || "[object GeneratorFunction]" == e || "[object AsyncFunction]" == e || "[object Proxy]" == e
        },
        A = p["__core-js_shared__"],
        I = (C = /[^.]+$/.exec(A && A.keys && A.keys.IE_PROTO || "")) ? "Symbol(src)_1." + C : "";
    var E = function(t) {
            return !!I && I in t
        },
        M = Function.prototype.toString;
    var F = function(t) {
            if (null != t) {
                try {
                    return M.call(t)
                } catch (e) {}
                try {
                    return t + ""
                } catch (e) {}
            }
            return ""
        },
        V = /^\[object .+?Constructor\]$/,
        N = Function.prototype,
        B = Object.prototype,
        R = N.toString,
        z = B.hasOwnProperty,
        L = RegExp("^" + R.call(z).replace(/[\\^$.*+?()[\]{}|]/g, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
    var $ = function(t) {
        return !(!k(t) || E(t)) && (x(t) ? L : V).test(F(t))
    };
    var U = function(t, e) {
        return null == t ? void 0 : t[e]
    };
    var q = function(t, e) {
            var r = U(t, e);
            return $(r) ? r : void 0
        },
        H = q(Object, "create");
    var W = function() {
        this.__data__ = H ? H(null) : {}, this.size = 0
    };
    var G = function(t) {
            var e = this.has(t) && delete this.__data__[t];
            return this.size -= e ? 1 : 0, e
        },
        K = Object.prototype.hasOwnProperty;
    var X = function(t) {
            var e = this.__data__;
            if (H) {
                var r = e[t];
                return "__lodash_hash_undefined__" === r ? void 0 : r
            }
            return K.call(e, t) ? e[t] : void 0
        },
        J = Object.prototype.hasOwnProperty;
    var Y = function(t) {
        var e = this.__data__;
        return H ? void 0 !== e[t] : J.call(e, t)
    };
    var Z = function(t, e) {
        var r = this.__data__;
        return this.size += this.has(t) ? 0 : 1, r[t] = H && void 0 === e ? "__lodash_hash_undefined__" : e, this
    };

    function Q(t) {
        var e = -1,
            r = null == t ? 0 : t.length;
        for (this.clear(); ++e < r;) {
            var n = t[e];
            this.set(n[0], n[1])
        }
    }
    Q.prototype.clear = W, Q.prototype.delete = G, Q.prototype.get = X, Q.prototype.has = Y, Q.prototype.set = Z;
    var tt = Q;
    var et = function() {
        this.__data__ = [], this.size = 0
    };
    var rt = function(t, e) {
        return t === e || t != t && e != e
    };
    var nt = function(t, e) {
            for (var r = t.length; r--;)
                if (rt(t[r][0], e)) return r;
            return -1
        },
        it = Array.prototype.splice;
    var ot = function(t) {
        var e = this.__data__,
            r = nt(e, t);
        return !(r < 0) && (r == e.length - 1 ? e.pop() : it.call(e, r, 1), --this.size, !0)
    };
    var at = function(t) {
        var e = this.__data__,
            r = nt(e, t);
        return r < 0 ? void 0 : e[r][1]
    };
    var st = function(t) {
        return nt(this.__data__, t) > -1
    };
    var ut = function(t, e) {
        var r = this.__data__,
            n = nt(r, t);
        return n < 0 ? (++this.size, r.push([t, e])) : r[n][1] = e, this
    };

    function ct(t) {
        var e = -1,
            r = null == t ? 0 : t.length;
        for (this.clear(); ++e < r;) {
            var n = t[e];
            this.set(n[0], n[1])
        }
    }
    ct.prototype.clear = et, ct.prototype.delete = ot, ct.prototype.get = at, ct.prototype.has = st, ct.prototype.set = ut;
    var lt = ct,
        ht = q(p, "Map");
    var pt = function() {
        this.size = 0, this.__data__ = {
            hash: new tt,
            map: new(ht || lt),
            string: new tt
        }
    };
    var dt = function(t) {
        var e = typeof t;
        return "string" == e || "number" == e || "symbol" == e || "boolean" == e ? "__proto__" !== t : null === t
    };
    var ft = function(t, e) {
        var r = t.__data__;
        return dt(e) ? r["string" == typeof e ? "string" : "hash"] : r.map
    };
    var vt = function(t) {
        var e = ft(this, t).delete(t);
        return this.size -= e ? 1 : 0, e
    };
    var gt = function(t) {
        return ft(this, t).get(t)
    };
    var _t = function(t) {
        return ft(this, t).has(t)
    };
    var yt = function(t, e) {
        var r = ft(this, t),
            n = r.size;
        return r.set(t, e), this.size += r.size == n ? 0 : 1, this
    };

    function mt(t) {
        var e = -1,
            r = null == t ? 0 : t.length;
        for (this.clear(); ++e < r;) {
            var n = t[e];
            this.set(n[0], n[1])
        }
    }
    mt.prototype.clear = pt, mt.prototype.delete = vt, mt.prototype.get = gt, mt.prototype.has = _t, mt.prototype.set = yt;
    var bt = mt;

    function wt(t, e) {
        if ("function" != typeof t || null != e && "function" != typeof e) throw new TypeError("Expected a function");
        var r = function() {
            var n = arguments,
                i = e ? e.apply(this, n) : n[0],
                o = r.cache;
            if (o.has(i)) return o.get(i);
            var a = t.apply(this, n);
            return r.cache = o.set(i, a) || o, a
        };
        return r.cache = new(wt.Cache || bt), r
    }
    wt.Cache = bt;
    var Pt = wt;
    var jt = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
        Ot = /\\(\\)?/g,
        St = function(t) {
            var e = Pt(t, (function(t) {
                    return 500 === r.size && r.clear(), t
                })),
                r = e.cache;
            return e
        }((function(t) {
            var e = [];
            return 46 === t.charCodeAt(0) && e.push(""), t.replace(jt, (function(t, r, n, i) {
                e.push(n ? i.replace(Ot, "$1") : r || t)
            })), e
        }));
    var Tt = function(t, e) {
            for (var r = -1, n = null == t ? 0 : t.length, i = Array(n); ++r < n;) i[r] = e(t[r], r, t);
            return i
        },
        Dt = d ? d.prototype : void 0,
        kt = Dt ? Dt.toString : void 0;
    var Ct = function t(e) {
        if ("string" == typeof e) return e;
        if (c(e)) return Tt(e, t) + "";
        if (O(e)) return kt ? kt.call(e) : "";
        var r = e + "";
        return "0" == r && 1 / e == -Infinity ? "-0" : r
    };
    var xt = function(t) {
        return null == t ? "" : Ct(t)
    };
    var At = function(t, e) {
        return c(t) ? t : D(t, e) ? [t] : St(xt(t))
    };
    var It = function(t) {
        if ("string" == typeof t || O(t)) return t;
        var e = t + "";
        return "0" == e && 1 / t == -Infinity ? "-0" : e
    };
    var Et = function(t, e) {
        for (var r = 0, n = (e = At(e, t)).length; null != t && r < n;) t = t[It(e[r++])];
        return r && r == n ? t : void 0
    };
    var Mt = function(t, e, r) {
        var n = null == t ? void 0 : Et(t, e);
        return void 0 === n ? r : n
    };
    var Ft = function(t, e) {
            return function(r) {
                return t(e(r))
            }
        }(Object.getPrototypeOf, Object),
        Vt = Function.prototype,
        Nt = Object.prototype,
        Bt = Vt.toString,
        Rt = Nt.hasOwnProperty,
        zt = Bt.call(Object);
    var Lt = function(t) {
        if (!j(t) || "[object Object]" != P(t)) return !1;
        var e = Ft(t);
        if (null === e) return !0;
        var r = Rt.call(e, "constructor") && e.constructor;
        return "function" == typeof r && r instanceof r && Bt.call(r) == zt
    };
    var $t, Ut, qt = function(t) {
            var e = null == t ? 0 : t.length;
            return e ? t[e - 1] : void 0
        },
        Ht = class {
            constructor() {
                this._lastTapperId = 0, this._tappers = new Map, this.tappable = new class {
                    constructor(t) {
                        this._untapFromSourceTimeout = null, this._cb = t => {
                            this._tappers.forEach((e => {
                                e(t)
                            }))
                        }, this._lastTapperId = 0, this._untapFromSource = null, this._props = t, this._tappers = new Map
                    }
                    _check() {
                        this._untapFromSource ? 0 === this._tappers.size && this._scheduleToUntapFromSource() : 0 !== this._tappers.size && (this._untapFromSource = this._props.tapToSource(this._cb))
                    }
                    _scheduleToUntapFromSource() {
                        null === this._untapFromSourceTimeout && (this._untapFromSourceTimeout = setTimeout((() => {
                            this._untapFromSourceTimeout = null, 0 === this._tappers.size && (this._untapFromSource(), this._untapFromSource = null)
                        }), 0))
                    }
                    tap(t) {
                        const e = this._lastTapperId++;
                        return this._tappers.set(e, t), this._check(), () => {
                            this._removeTapperById(e)
                        }
                    }
                    _removeTapperById(t) {
                        this._tappers.delete(t), this._check()
                    }
                }({
                    tapToSource: t => this._tap(t)
                })
            }
            _tap(t) {
                const e = this._lastTapperId++;
                return this._tappers.set(e, t), this._onNumberOfTappersChangeListener && this._onNumberOfTappersChangeListener(this._tappers.size), () => {
                    this._removeTapperById(e)
                }
            }
            _removeTapperById(t) {
                const e = this._tappers.size;
                this._tappers.delete(t);
                e !== this._tappers.size && this._onNumberOfTappersChangeListener && this._onNumberOfTappersChangeListener(this._tappers.size)
            }
            emit(t) {
                this._tappers.forEach((e => {
                    e(t)
                }))
            }
            hasTappers() {
                return 0 !== this._tappers.size
            }
            onNumberOfTappersChange(t) {
                this._onNumberOfTappersChangeListener = t
            }
        };

    function Wt(t) {
        return t && t.isDerivation && !0 === t.isDerivation
    }(Ut = $t || ($t = {}))[Ut.none = 0] = "none", Ut[Ut.dep = 1] = "dep", Ut[Ut.inner = 2] = "inner";
    var Gt = () => {
            class t extends oe {
                constructor(t, e) {
                    return super(), this._depDerivation = t, this._fn = e, this._innerDerivation = void 0, this._staleDependency = 1, this._addDependency(t), this
                }
                _recalculateHot() {
                    const t = this._staleDependency;
                    if (this._staleDependency = 0, 2 === t) return this._innerDerivation.getValue();
                    const e = this._fn(this._depDerivation.getValue());
                    return Wt(e) ? (this._innerDerivation = e, this._addDependency(e), e.getValue()) : e
                }
                _recalculateCold() {
                    const t = this._fn(this._depDerivation.getValue());
                    return Wt(t) ? t.getValue() : t
                }
                _recalculate() {
                    return this.isHot ? this._recalculateHot() : this._recalculateCold()
                }
                _reactToDependencyBecomingStale(t) {
                    const e = t === this._depDerivation ? 1 : 2;
                    if (2 === e && t !== this._innerDerivation) throw Error("got a _reactToDependencyBecomingStale() from neither the dep nor the inner derivation");
                    0 === this._staleDependency ? (this._staleDependency = e, 1 === e && this._removeInnerDerivation()) : 1 === this._staleDependency || 1 === e && (this._staleDependency = 1, this._removeInnerDerivation())
                }
                _removeInnerDerivation() {
                    this._innerDerivation && (this._removeDependency(this._innerDerivation), this._innerDerivation = void 0)
                }
                _keepHot() {
                    this._staleDependency = 1, this.getValue()
                }
                _becomeCold() {
                    this._staleDependency = 1, this._removeInnerDerivation()
                }
            }
            return t.displayName = "flatMap", t
        },
        Kt = void 0;
    var Xt = () => class extends oe {
            constructor(t, e) {
                super(), this._dep = t, this._fn = e, this._addDependency(t)
            }
            _recalculate() {
                return this._fn(this._dep.getValue())
            }
            _reactToDependencyBecomingStale() {}
        },
        Jt = void 0;
    var Yt = class {
        constructor() {
            this._head = void 0
        }
        peek() {
            return this._head && this._head.data
        }
        pop() {
            const t = this._head;
            if (t) return this._head = t.next, t.data
        }
        push(t) {
            const e = {
                next: this._head,
                data: t
            };
            this._head = e
        }
    };

    function Zt() {
        const t = new Yt,
            e = () => {};
        return {
            type: "Dataverse_discoveryMechanism",
            startIgnoringDependencies: () => {
                t.push(e)
            },
            stopIgnoringDependencies: () => {
                t.peek() !== e || t.pop()
            },
            reportResolutionStart: r => {
                const n = t.peek();
                n && n(r), t.push(e)
            },
            reportResolutionEnd: e => {
                t.pop()
            },
            pushCollector: e => {
                t.push(e)
            },
            popCollector: e => {
                if (t.peek() !== e) throw new Error("Popped collector is not on top of the stack");
                t.pop()
            }
        }
    }
    var {
        startIgnoringDependencies: Qt,
        stopIgnoringDependencies: te,
        reportResolutionEnd: ee,
        reportResolutionStart: re,
        pushCollector: ne,
        popCollector: ie
    } = function() {
        const e = "__dataverse_discoveryMechanism_sharedStack",
            r = "undefined" != typeof window ? window : void 0 !== t ? t : {};
        if (r) {
            const t = r[e];
            if (t && "object" == typeof t && "Dataverse_discoveryMechanism" === t.type) return t; {
                const t = Zt();
                return r[e] = t, t
            }
        }
        return Zt()
    }(), oe = class {
        constructor() {
            this.isDerivation = !0, this._didMarkDependentsAsStale = !1, this._isHot = !1, this._isFresh = !1, this._lastValue = void 0, this._dependents = new Set, this._dependencies = new Set, this._internal_markAsStale = t => {
                this._reactToDependencyBecomingStale(t), this._didMarkDependentsAsStale || (this._didMarkDependentsAsStale = !0, this._isFresh = !1, this._dependents.forEach((t => {
                    t(this)
                })))
            }
        }
        get isHot() {
            return this._isHot
        }
        _addDependency(t) {
            this._dependencies.has(t) || (this._dependencies.add(t), this._isHot && t.addDependent(this._internal_markAsStale))
        }
        _removeDependency(t) {
            this._dependencies.has(t) && (this._dependencies.delete(t), this._isHot && t.removeDependent(this._internal_markAsStale))
        }
        changes(t) {
            return new class {
                constructor(t, e) {
                    return this._possiblyMarkAsStale = () => {
                        this._ticker.onThisOrNextTick(this._refresh)
                    }, this._refresh = () => {
                        const t = this._derivation.getValue();
                        t === this._lastValue && !0 === this._lastValueRecorded || (this._lastValue = t, this._lastValueRecorded = !0, this._emitter.emit(t))
                    }, this._derivation = t, this._ticker = e, this._emitter = new Ht, this._emitter.onNumberOfTappersChange((() => {
                        this._reactToNumberOfTappersChange()
                    })), this._hadTappers = !1, this._lastValueRecorded = !1, this._lastValue = void 0, this
                }
                _reactToNumberOfTappersChange() {
                    const t = this._emitter.hasTappers();
                    t !== this._hadTappers && (this._hadTappers = t, t ? this._derivation.addDependent(this._possiblyMarkAsStale) : this._derivation.removeDependent(this._possiblyMarkAsStale))
                }
                tappable() {
                    return this._emitter.tappable
                }
            }(this, t).tappable()
        }
        changesWithoutValues() {
            return new class {
                constructor(t, e = !1) {
                    return this.dontEmitValues = e, this._possiblyMarkAsStale = () => {
                        this._emitter.emit(void 0)
                    }, this._derivation = t, this._emitter = new Ht, this._emitter.onNumberOfTappersChange((() => {
                        this._reactToNumberOfTappersChange()
                    })), this._hadTappers = !1, this
                }
                _reactToNumberOfTappersChange() {
                    const t = this._emitter.hasTappers();
                    t !== this._hadTappers && (this._hadTappers = t, t ? this._derivation.addDependent(this._possiblyMarkAsStale) : this._derivation.removeDependent(this._possiblyMarkAsStale))
                }
                tappable() {
                    return this._emitter.tappable
                }
            }(this).tappable()
        }
        keepHot() {
            return this.changesWithoutValues().tap((() => {}))
        }
        tapImmediate(t, e) {
            const r = this.changes(t).tap(e);
            return e(this.getValue()), r
        }
        addDependent(t) {
            const e = this._dependents.size > 0;
            this._dependents.add(t);
            e !== this._dependents.size > 0 && this._reactToNumberOfDependentsChange()
        }
        removeDependent(t) {
            const e = this._dependents.size > 0;
            this._dependents.delete(t);
            e !== this._dependents.size > 0 && this._reactToNumberOfDependentsChange()
        }
        _markAsStale(t) {
            this._internal_markAsStale(t)
        }
        getValue() {
            if (re(this), !this._isFresh) {
                const t = this._recalculate();
                this._lastValue = t, this._isHot && (this._isFresh = !0, this._didMarkDependentsAsStale = !1)
            }
            return ee(this), this._lastValue
        }
        _reactToNumberOfDependentsChange() {
            const t = this._dependents.size > 0;
            t !== this._isHot && (this._isHot = t, this._didMarkDependentsAsStale = !1, this._isFresh = !1, t ? (this._dependencies.forEach((t => {
                t.addDependent(this._internal_markAsStale)
            })), this._keepHot()) : (this._dependencies.forEach((t => {
                t.removeDependent(this._internal_markAsStale)
            })), this._becomeCold()))
        }
        _keepHot() {}
        _becomeCold() {}
        map(t) {
            return function(t, e) {
                return Jt || (Jt = Xt()), new Jt(t, e)
            }(this, t)
        }
        flatMap(t) {
            return function(t, e) {
                return Kt || (Kt = Gt()), new Kt(t, e)
            }(this, t)
        }
    }, ae = () => {}, se = class extends oe {
        constructor(t, e) {
            super(), this._tapToSource = t, this._getValueFromSource = e, this._untapFromChanges = ae, this._cachedValue = void 0, this._hasCachedValue = !1
        }
        _recalculate() {
            return this.isHot ? (this._hasCachedValue || (this._cachedValue = this._getValueFromSource(), this._hasCachedValue = !0), this._cachedValue) : this._getValueFromSource()
        }
        _keepHot() {
            this._hasCachedValue = !1, this._cachedValue = void 0, this._untapFromChanges = this._tapToSource((t => {
                this._hasCachedValue = !0, this._cachedValue = t, this._markAsStale(this)
            }))
        }
        _becomeCold() {
            this._untapFromChanges(), this._untapFromChanges = ae, this._hasCachedValue = !1, this._cachedValue = void 0
        }
        _reactToDependencyBecomingStale() {}
    }, ue = new WeakMap, ce = new WeakMap, le = Symbol("pointerMeta"), he = {
        get(t, e) {
            if (e === le) return ue.get(t);
            let r = ce.get(t);
            r || (r = new Map, ce.set(t, r));
            const n = r.get(e);
            if (void 0 !== n) return n;
            const i = ue.get(t),
                o = fe({
                    root: i.root,
                    path: [...i.path, e]
                });
            return r.set(e, o), o
        }
    }, pe = t => t[le], de = t => {
        const {
            root: e,
            path: r
        } = pe(t);
        return {
            root: e,
            path: r
        }
    };

    function fe(t) {
        var e;
        const r = {
                root: t.root,
                path: null != (e = t.path) ? e : []
            },
            n = {};
        return ue.set(n, r), new Proxy(n, he)
    }
    var ve = fe,
        ge = t => t && !!pe(t);
    var _e, ye, me = (t, e, r) => {
        if (0 === e.length) return r(t);
        if (Array.isArray(t)) {
            let [n, ...i] = e;
            n = parseInt(String(n), 10), isNaN(n) && (n = 0);
            const o = t[n],
                a = me(o, i, r);
            if (o === a) return t;
            const s = [...t];
            return s.splice(n, 1, a), s
        }
        if ("object" == typeof t && null !== t) {
            const [l, ...h] = e, p = t[l], d = me(p, h, r);
            if (p === d) return t;
            return c = ((t, e) => {
                for (var r in e || (e = {})) a.call(e, r) && u(t, r, e[r]);
                if (o)
                    for (var r of o(e)) s.call(e, r) && u(t, r, e[r]);
                return t
            })({}, t), n(c, i({
                [l]: d
            }))
        } {
            const [t, ...n] = e;
            return {
                [t]: me(void 0, n, r)
            }
        }
        var c
    };
    (ye = _e || (_e = {}))[ye.Dict = 0] = "Dict", ye[ye.Array = 1] = "Array", ye[ye.Other = 2] = "Other";
    var be = t => Array.isArray(t) ? 1 : Lt(t) ? 0 : 2,
        we = (t, e, r = be(t)) => 0 === r && "string" == typeof e || 1 === r && Pe(e) ? t[e] : void 0,
        Pe = t => {
            const e = "number" == typeof t ? t : parseInt(t, 10);
            return !isNaN(e) && e >= 0 && e < 1 / 0 && (0 | e) === e
        },
        je = class {
            constructor(t, e) {
                this._parent = t, this._path = e, this.children = new Map, this.identityChangeListeners = new Set
            }
            addIdentityChangeListener(t) {
                this.identityChangeListeners.add(t)
            }
            removeIdentityChangeListener(t) {
                this.identityChangeListeners.delete(t), this._checkForGC()
            }
            removeChild(t) {
                this.children.delete(t), this._checkForGC()
            }
            getChild(t) {
                return this.children.get(t)
            }
            getOrCreateChild(t) {
                let e = this.children.get(t);
                return e || (e = e = new je(this, this._path.concat([t])), this.children.set(t, e)), e
            }
            _checkForGC() {
                this.identityChangeListeners.size > 0 || this.children.size > 0 || this._parent && this._parent.removeChild(qt(this._path))
            }
        },
        Oe = class {
            constructor(t) {
                this.$$isIdentityDerivationProvider = !0, this.reduceState = (t, e) => {
                    const r = function(t, e, r) {
                        return 0 === e.length ? r(t) : me(t, e, r)
                    }(this.getState(), t, e);
                    return this.setState(r), r
                }, this._onPathValueChange = (t, e) => {
                    const r = this._getOrCreateScopeForPath(t);
                    r.identityChangeListeners.add(e);
                    return () => {
                        r.identityChangeListeners.delete(e)
                    }
                }, this._currentState = t, this._rootScope = new je(void 0, []), this.pointer = ve({
                    root: this,
                    path: []
                })
            }
            setState(t) {
                const e = this._currentState;
                this._currentState = t, this._checkUpdates(this._rootScope, e, t)
            }
            getState() {
                return this._currentState
            }
            getIn(t) {
                return 0 === t.length ? this.getState() : Mt(this.getState(), t)
            }
            setIn(t, e) {
                return this.reduceState(t, (() => e))
            }
            _checkUpdates(t, e, r) {
                if (e === r) return;
                if (t.identityChangeListeners.forEach((t => t(r))), 0 === t.children.size) return;
                const n = be(e),
                    i = be(r);
                2 === n && n === i || t.children.forEach(((t, o) => {
                    const a = we(e, o, n),
                        s = we(r, o, i);
                    this._checkUpdates(t, a, s)
                }))
            }
            _getOrCreateScopeForPath(t) {
                let e = this._rootScope;
                for (const r of t) e = e.getOrCreateChild(r);
                return e
            }
            getIdentityDerivation(t) {
                return new se((e => this._onPathValueChange(t, e)), (() => this.getIn(t)))
            }
        },
        Se = new WeakMap,
        Te = t => {
            const e = pe(t);
            let r = Se.get(e);
            if (!r) {
                const t = e.root;
                if ("object" != typeof(n = t) || null === n || !0 !== n.$$isIdentityDerivationProvider) throw new Error("Cannot run valueDerivation() on a pointer whose root is not an IdentityChangeProvider");
                const {
                    path: i
                } = e;
                r = t.getIdentityDerivation(i), Se.set(e, r)
            }
            var n;
            return r
        };
    var De, ke = t => ge(t) ? Te(t).getValue() : Wt(t) ? t.getValue() : t,
        Ce = class {
            constructor(t) {
                this._value = t, this._emitter = new Ht, this._publicDerivation = new se((t => this._emitter.tappable.tap(t)), this.get.bind(this))
            }
            set(t) {
                t !== this._value && (this._value = t, this._emitter.emit(t))
            }
            get() {
                return this._value
            }
            get derivation() {
                return this._publicDerivation
            }
        },
        xe = class extends oe {
            constructor(t) {
                return super(), this._v = t, this
            }
            _recalculate() {
                return this._v
            }
            _reactToDependencyBecomingStale() {}
        };

    function* Ae(t) {
        let e;
        if (ge(t)) e = Te(t);
        else {
            if (!Wt(t)) throw new Error("Only pointers and derivations are supported");
            e = t
        }
        let r = 0;
        const n = e.changesWithoutValues().tap((() => {
            r++
        }));
        try {
            for (;;) {
                const t = r;
                r = 0, yield {
                    value: e.getValue(),
                    ticks: t
                }
            }
        } finally {
            n()
        }
    }
    var Ie = class {
        constructor() {
            this._ticking = !1, this._scheduledForThisOrNextTick = new Set, this._scheduledForNextTick = new Set, this._timeAtCurrentTick = 0
        }
        static get raf() {
            return De || (De = function() {
                const t = new Ie;
                if ("undefined" != typeof window) {
                    const e = r => {
                        t.tick(r), window.requestAnimationFrame(e)
                    };
                    window.requestAnimationFrame(e)
                } else t.tick(0), setTimeout((() => t.tick(1)), 0), console.log("@theatre/dataverse is running in a server rather than in a browser. We haven't gotten around to testing server-side rendering, so if something is working in the browser but not on the server, please file a bug: https://github.com/theatre-js/theatre/issues/new");
                return t
            }()), De
        }
        onThisOrNextTick(t) {
            this._scheduledForThisOrNextTick.add(t)
        }
        onNextTick(t) {
            this._scheduledForNextTick.add(t)
        }
        offThisOrNextTick(t) {
            this._scheduledForThisOrNextTick.delete(t)
        }
        offNextTick(t) {
            this._scheduledForNextTick.delete(t)
        }
        get time() {
            return this._ticking ? this._timeAtCurrentTick : performance.now()
        }
        tick(t = performance.now()) {
            this._ticking = !0, this._timeAtCurrentTick = t, this._scheduledForNextTick.forEach((t => this._scheduledForThisOrNextTick.add(t))), this._scheduledForNextTick.clear(), this._tick(0), this._ticking = !1
        }
        _tick(t) {
            const e = this.time;
            if (t > 10 && console.warn("_tick() recursing for 10 times"), t > 100) throw new Error("Maximum recursion limit for _tick()");
            const r = this._scheduledForThisOrNextTick;
            if (this._scheduledForThisOrNextTick = new Set, r.forEach((t => {
                    t(e)
                })), this._scheduledForThisOrNextTick.size > 0) return this._tick(t + 1)
        }
    };

    function* Ee(t) {
        let e;
        if (ge(t)) e = Te(t);
        else {
            if (!Wt(t)) throw new Error("Only pointers and derivations are supported");
            e = t
        }
        const r = new Ie,
            n = e.changes(r).tap((t => {}));
        try {
            for (;;) r.tick(), yield e.getValue()
        } finally {
            n()
        }
    }
    var Me = () => {},
        Fe = class extends oe {
            constructor(t) {
                super(), this._fn = t, this._cacheOfDendencyValues = new Map, this._possiblyStaleDeps = new Set, this._prismScope = new Ve
            }
            _recalculate() {
                let t;
                if (this._possiblyStaleDeps.size > 0) {
                    let t = !1;
                    Qt();
                    for (const e of this._possiblyStaleDeps)
                        if (this._cacheOfDendencyValues.get(e) !== e.getValue()) {
                            t = !0;
                            break
                        }
                    if (te(), this._possiblyStaleDeps.clear(), !t) return this._lastValue
                }
                const e = new Set;
                this._cacheOfDendencyValues.clear();
                const r = t => {
                    e.add(t), this._addDependency(t)
                };
                ne(r), Re.push(this._prismScope);
                try {
                    t = this._fn()
                } catch (n) {
                    console.error(n)
                } finally {
                    Re.pop() !== this._prismScope && console.warn("The Prism hook stack has slipped. This is a bug.")
                }
                return ie(r), this._dependencies.forEach((t => {
                    e.has(t) || this._removeDependency(t)
                })), this._dependencies = e, Qt(), e.forEach((t => {
                    this._cacheOfDendencyValues.set(t, t.getValue())
                })), te(), t
            }
            _reactToDependencyBecomingStale(t) {
                this._possiblyStaleDeps.add(t)
            }
            _keepHot() {
                this._prismScope = new Ve, Qt(), this.getValue(), te()
            }
            _becomeCold() {
                Ne(this._prismScope), this._prismScope = new Ve
            }
        },
        Ve = class {
            constructor() {
                this.isPrismScope = !0, this._subs = {}
            }
            sub(t) {
                return this._subs[t] || (this._subs[t] = new Ve), this._subs[t]
            }
            get subs() {
                return this._subs
            }
        };

    function Ne(t) {
        for (const e of Object.values(t.subs)) Ne(e);
        ! function(t) {
            const e = Le.get(t);
            if (e)
                for (const r of e.values()) Be(r.cleanup, void 0);
            Le.delete(t)
        }(t)
    }

    function Be(t, e) {
        try {
            return {
                value: t(),
                ok: !0
            }
        } catch (r) {
            return setTimeout((function() {
                throw r
            })), {
                value: e,
                ok: !1
            }
        }
    }
    var Re = new Yt,
        ze = new WeakMap,
        Le = new WeakMap,
        $e = new WeakMap;

    function Ue(t, e) {
        if (void 0 === t || void 0 === e) return !0;
        const r = t.length;
        if (r !== e.length) return !0;
        for (let n = 0; n < r; n++)
            if (t[n] !== e[n]) return !0;
        return !1
    }

    function qe(t, e, r) {
        const n = Re.peek();
        if (!n) throw new Error("prism.memo() is called outside of a prism() call.");
        let i = $e.get(n);
        i || (i = new Map, $e.set(n, i));
        let o = i.get(t);
        return void 0 === o && (o = {
            cachedValue: null,
            deps: void 0
        }, i.set(t, o)), Ue(o.deps, r) && (Qt(), o.cachedValue = Be(e, void 0).value, te(), o.deps = r), o.cachedValue
    }
    var He = t => new Fe(t);
    He.ref = function(t, e) {
        const r = Re.peek();
        if (!r) throw new Error("prism.ref() is called outside of a prism() call.");
        let n = ze.get(r);
        void 0 === n && (n = new Map, ze.set(r, n));
        let i = n.get(t);
        if (void 0 !== i) return i; {
            const r = {
                current: e
            };
            return n.set(t, r), r
        }
    }, He.effect = function(t, e, r) {
        const n = Re.peek();
        if (!n) throw new Error("prism.effect() is called outside of a prism() call.");
        let i = Le.get(n);
        void 0 === i && (i = new Map, Le.set(n, i));
        let o = i.get(t);
        void 0 === o && (o = {
            cleanup: Me,
            deps: void 0
        }, i.set(t, o)), Ue(o.deps, r) && (o.cleanup(), Qt(), o.cleanup = Be(e, Me).value, te(), o.deps = r)
    }, He.memo = qe, He.ensurePrism = function() {
        if (!Re.peek()) throw new Error("The parent function is called outside of a prism() call.")
    }, He.state = function(t, e) {
        const {
            b: r,
            setValue: n
        } = He.memo("state/" + t, (() => {
            const t = new Ce(e);
            return {
                b: t,
                setValue: e => t.set(e)
            }
        }), []);
        return [r.derivation.getValue(), n]
    }, He.scope = function(t, e) {
        const r = Re.peek();
        if (!r) throw new Error("prism.scope() is called outside of a prism() call.");
        const n = r.sub(t);
        Re.push(n);
        const i = Be(e, void 0).value;
        return Re.pop(), i
    }, He.sub = function(t, e, r) {
        return qe(t, (() => He(e)), r).getValue()
    }, He.inPrism = function() {
        return !!Re.peek()
    };
    var We = He,
        Ge = class {
            constructor(t) {
                this.$$isIdentityDerivationProvider = !0, this._currentPointerBox = new Ce(t), this.pointer = ve({
                    root: this,
                    path: []
                })
            }
            setPointer(t) {
                this._currentPointerBox.set(t)
            }
            getIdentityDerivation(t) {
                return this._currentPointerBox.derivation.flatMap((e => {
                    const r = t.reduce(((t, e) => t[e]), e);
                    return Te(r)
                }))
            }
        }
}(vt),
function(e, r) {
    var n = Object.create,
        i = Object.defineProperty,
        o = Object.defineProperties,
        a = Object.getOwnPropertyDescriptor,
        s = Object.getOwnPropertyDescriptors,
        u = Object.getOwnPropertyNames,
        c = Object.getOwnPropertySymbols,
        l = Object.getPrototypeOf,
        h = Object.prototype.hasOwnProperty,
        p = Object.prototype.propertyIsEnumerable,
        d = (t, e, r) => e in t ? i(t, e, {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: r
        }) : t[e] = r,
        f = (t, e) => {
            for (var r in e || (e = {})) h.call(e, r) && d(t, r, e[r]);
            if (c)
                for (var r of c(e)) p.call(e, r) && d(t, r, e[r]);
            return t
        },
        v = (t, e) => o(t, s(e)),
        g = t => i(t, "__esModule", {
            value: !0
        }),
        _ = (t, e) => function() {
            return e || (0, t[Object.keys(t)[0]])((e = {
                exports: {}
            }).exports, e), e.exports
        },
        y = (t, e) => {
            for (var r in g(t), e) i(t, r, {
                get: e[r],
                enumerable: !0
            })
        },
        m = t => ((t, e, r) => {
            if (e && "object" == typeof e || "function" == typeof e)
                for (let n of u(e)) h.call(t, n) || "default" === n || i(t, n, {
                    get: () => e[n],
                    enumerable: !(r = a(e, n)) || r.enumerable
                });
            return t
        })(g(i(null != t ? n(l(t)) : {}, "default", t && t.__esModule && "default" in t ? {
            get: () => t.default,
            enumerable: !0
        } : {
            value: t,
            enumerable: !0
        })), t),
        b = (t, e, r) => (d(t, "symbol" != typeof e ? e + "" : e, r), r),
        w = _({
            "../node_modules/timing-function/lib/UnitBezier.js" (t, e) {
                e.exports = function() {
                    function t(t, e, r, n) {
                        this.set(t, e, r, n)
                    }
                    return t.prototype.set = function(t, e, r, n) {
                        this._cx = 3 * t, this._bx = 3 * (r - t) - this._cx, this._ax = 1 - this._cx - this._bx, this._cy = 3 * e, this._by = 3 * (n - e) - this._cy, this._ay = 1 - this._cy - this._by
                    }, t.epsilon = 1e-6, t.prototype._sampleCurveX = function(t) {
                        return ((this._ax * t + this._bx) * t + this._cx) * t
                    }, t.prototype._sampleCurveY = function(t) {
                        return ((this._ay * t + this._by) * t + this._cy) * t
                    }, t.prototype._sampleCurveDerivativeX = function(t) {
                        return (3 * this._ax * t + 2 * this._bx) * t + this._cx
                    }, t.prototype._solveCurveX = function(t, e) {
                        var r, n, i, o, a, s;
                        for (i = void 0, o = void 0, a = void 0, s = void 0, r = void 0, n = void 0, a = t, n = 0; n < 8;) {
                            if (s = this._sampleCurveX(a) - t, Math.abs(s) < e) return a;
                            if (r = this._sampleCurveDerivativeX(a), Math.abs(r) < e) break;
                            a -= s / r, n++
                        }
                        if ((a = t) < (i = 0)) return i;
                        if (a > (o = 1)) return o;
                        for (; i < o;) {
                            if (s = this._sampleCurveX(a), Math.abs(s - t) < e) return a;
                            t > s ? i = a : o = a, a = .5 * (o - i) + i
                        }
                        return a
                    }, t.prototype.solve = function(t, e) {
                        return this._sampleCurveY(this._solveCurveX(t, e))
                    }, t.prototype.solveSimple = function(t) {
                        return this._sampleCurveY(this._solveCurveX(t, 1e-6))
                    }, t
                }()
            }
        }),
        P = _({
            "../node_modules/levenshtein-edit-distance/index.js" (t, e) {
                var r, n;
                r = [], n = [], e.exports = function(t, e, i) {
                    var o, a, s, u, c, l, h, p;
                    if (t === e) return 0;
                    if (o = t.length, a = e.length, 0 === o) return a;
                    if (0 === a) return o;
                    for (i && (t = t.toLowerCase(), e = e.toLowerCase()), h = 0; h < o;) n[h] = t.charCodeAt(h), r[h] = ++h;
                    for (p = 0; p < a;)
                        for (s = e.charCodeAt(p), u = c = p++, h = -1; ++h < o;) l = s === n[h] ? c : c + 1, c = r[h], r[h] = u = c > u ? l > u ? u + 1 : l : l > c ? c + 1 : l;
                    return u
                }
            }
        }),
        j = _({
            "../node_modules/propose/propose.js" (t, e) {
                var r = P();
                e.exports = function() {
                    var t, e, n, i, o, a = 0,
                        s = arguments[0],
                        u = arguments[1],
                        c = u.length,
                        l = arguments[2];
                    l && (i = l.threshold, o = l.ignoreCase), void 0 === i && (i = 0);
                    for (var h = 0; h < c; ++h)(t = (e = o ? r(s, u[h], !0) : r(s, u[h])) > s.length ? 1 - e / u[h].length : 1 - e / s.length) > a && (a = t, n = u[h]);
                    return a >= i ? n : null
                }
            }
        }),
        O = _({
            "../node_modules/fast-deep-equal/index.js" (t, e) {
                e.exports = function t(e, r) {
                    if (e === r) return !0;
                    if (e && r && "object" == typeof e && "object" == typeof r) {
                        if (e.constructor !== r.constructor) return !1;
                        var n, i, o;
                        if (Array.isArray(e)) {
                            if ((n = e.length) != r.length) return !1;
                            for (i = n; 0 != i--;)
                                if (!t(e[i], r[i])) return !1;
                            return !0
                        }
                        if (e.constructor === RegExp) return e.source === r.source && e.flags === r.flags;
                        if (e.valueOf !== Object.prototype.valueOf) return e.valueOf() === r.valueOf();
                        if (e.toString !== Object.prototype.toString) return e.toString() === r.toString();
                        if ((n = (o = Object.keys(e)).length) !== Object.keys(r).length) return !1;
                        for (i = n; 0 != i--;)
                            if (!Object.prototype.hasOwnProperty.call(r, o[i])) return !1;
                        for (i = n; 0 != i--;) {
                            var a = o[i];
                            if (!t(e[a], r[a])) return !1
                        }
                        return !0
                    }
                    return e != e && r != r
                }
            }
        });
    y(r, {
        getProject: () => $a,
        onChange: () => qa,
        types: () => po,
        val: () => Ha
    });
    var S = {};
    y(S, {
        getProject: () => $a,
        onChange: () => qa,
        types: () => po,
        val: () => Ha
    });
    var T = m(vt),
        D = new class {
            constructor() {
                b(this, "atom", new T.Atom({
                    projects: {}
                }))
            }
            add(t, e) {
                this.atom.reduceState(["projects", t], (() => e))
            }
            get(t) {
                return this.atom.getState().projects[t]
            }
            has(t) {
                return !!this.get(t)
            }
        },
        k = new WeakMap;

    function C(t) {
        return k.get(t)
    }

    function x(t, e) {
        k.set(t, e)
    }
    var A = [],
        I = Array.isArray,
        E = "object" == typeof t && t && t.Object === Object && t,
        M = "object" == typeof self && self && self.Object === Object && self,
        F = E || M || Function("return this")(),
        V = F.Symbol,
        N = Object.prototype,
        B = N.hasOwnProperty,
        R = N.toString,
        z = V ? V.toStringTag : void 0;
    var L = function(t) {
            var e = B.call(t, z),
                r = t[z];
            try {
                t[z] = void 0;
                var n = !0
            } catch (o) {}
            var i = R.call(t);
            return n && (e ? t[z] = r : delete t[z]), i
        },
        $ = Object.prototype.toString;
    var U = function(t) {
            return $.call(t)
        },
        q = V ? V.toStringTag : void 0;
    var H = function(t) {
        return null == t ? void 0 === t ? "[object Undefined]" : "[object Null]" : q && q in Object(t) ? L(t) : U(t)
    };
    var W = function(t) {
        return null != t && "object" == typeof t
    };
    var G = function(t) {
            return "symbol" == typeof t || W(t) && "[object Symbol]" == H(t)
        },
        K = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
        X = /^\w*$/;
    var J = function(t, e) {
        if (I(t)) return !1;
        var r = typeof t;
        return !("number" != r && "symbol" != r && "boolean" != r && null != t && !G(t)) || (X.test(t) || !K.test(t) || null != e && t in Object(e))
    };
    var Y = function(t) {
        var e = typeof t;
        return null != t && ("object" == e || "function" == e)
    };
    var Z, Q = function(t) {
            if (!Y(t)) return !1;
            var e = H(t);
            return "[object Function]" == e || "[object GeneratorFunction]" == e || "[object AsyncFunction]" == e || "[object Proxy]" == e
        },
        tt = F["__core-js_shared__"],
        et = (Z = /[^.]+$/.exec(tt && tt.keys && tt.keys.IE_PROTO || "")) ? "Symbol(src)_1." + Z : "";
    var rt = function(t) {
            return !!et && et in t
        },
        nt = Function.prototype.toString;
    var it = function(t) {
            if (null != t) {
                try {
                    return nt.call(t)
                } catch (e) {}
                try {
                    return t + ""
                } catch (e) {}
            }
            return ""
        },
        ot = /^\[object .+?Constructor\]$/,
        at = Function.prototype,
        st = Object.prototype,
        ut = at.toString,
        ct = st.hasOwnProperty,
        lt = RegExp("^" + ut.call(ct).replace(/[\\^$.*+?()[\]{}|]/g, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
    var ht = function(t) {
        return !(!Y(t) || rt(t)) && (Q(t) ? lt : ot).test(it(t))
    };
    var pt = function(t, e) {
        return null == t ? void 0 : t[e]
    };
    var dt = function(t, e) {
            var r = pt(t, e);
            return ht(r) ? r : void 0
        },
        ft = dt(Object, "create");
    var gt = function() {
        this.__data__ = ft ? ft(null) : {}, this.size = 0
    };
    var _t = function(t) {
            var e = this.has(t) && delete this.__data__[t];
            return this.size -= e ? 1 : 0, e
        },
        yt = Object.prototype.hasOwnProperty;
    var mt = function(t) {
            var e = this.__data__;
            if (ft) {
                var r = e[t];
                return "__lodash_hash_undefined__" === r ? void 0 : r
            }
            return yt.call(e, t) ? e[t] : void 0
        },
        bt = Object.prototype.hasOwnProperty;
    var wt = function(t) {
        var e = this.__data__;
        return ft ? void 0 !== e[t] : bt.call(e, t)
    };
    var Pt = function(t, e) {
        var r = this.__data__;
        return this.size += this.has(t) ? 0 : 1, r[t] = ft && void 0 === e ? "__lodash_hash_undefined__" : e, this
    };

    function jt(t) {
        var e = -1,
            r = null == t ? 0 : t.length;
        for (this.clear(); ++e < r;) {
            var n = t[e];
            this.set(n[0], n[1])
        }
    }
    jt.prototype.clear = gt, jt.prototype.delete = _t, jt.prototype.get = mt, jt.prototype.has = wt, jt.prototype.set = Pt;
    var Ot = jt;
    var St = function() {
        this.__data__ = [], this.size = 0
    };
    var Tt = function(t, e) {
        return t === e || t != t && e != e
    };
    var Dt = function(t, e) {
            for (var r = t.length; r--;)
                if (Tt(t[r][0], e)) return r;
            return -1
        },
        kt = Array.prototype.splice;
    var Ct = function(t) {
        var e = this.__data__,
            r = Dt(e, t);
        return !(r < 0) && (r == e.length - 1 ? e.pop() : kt.call(e, r, 1), --this.size, !0)
    };
    var xt = function(t) {
        var e = this.__data__,
            r = Dt(e, t);
        return r < 0 ? void 0 : e[r][1]
    };
    var At = function(t) {
        return Dt(this.__data__, t) > -1
    };
    var It = function(t, e) {
        var r = this.__data__,
            n = Dt(r, t);
        return n < 0 ? (++this.size, r.push([t, e])) : r[n][1] = e, this
    };

    function Et(t) {
        var e = -1,
            r = null == t ? 0 : t.length;
        for (this.clear(); ++e < r;) {
            var n = t[e];
            this.set(n[0], n[1])
        }
    }
    Et.prototype.clear = St, Et.prototype.delete = Ct, Et.prototype.get = xt, Et.prototype.has = At, Et.prototype.set = It;
    var Mt = Et,
        Ft = dt(F, "Map");
    var Vt = function() {
        this.size = 0, this.__data__ = {
            hash: new Ot,
            map: new(Ft || Mt),
            string: new Ot
        }
    };
    var Nt = function(t) {
        var e = typeof t;
        return "string" == e || "number" == e || "symbol" == e || "boolean" == e ? "__proto__" !== t : null === t
    };
    var Bt = function(t, e) {
        var r = t.__data__;
        return Nt(e) ? r["string" == typeof e ? "string" : "hash"] : r.map
    };
    var Rt = function(t) {
        var e = Bt(this, t).delete(t);
        return this.size -= e ? 1 : 0, e
    };
    var zt = function(t) {
        return Bt(this, t).get(t)
    };
    var Lt = function(t) {
        return Bt(this, t).has(t)
    };
    var $t = function(t, e) {
        var r = Bt(this, t),
            n = r.size;
        return r.set(t, e), this.size += r.size == n ? 0 : 1, this
    };

    function Ut(t) {
        var e = -1,
            r = null == t ? 0 : t.length;
        for (this.clear(); ++e < r;) {
            var n = t[e];
            this.set(n[0], n[1])
        }
    }
    Ut.prototype.clear = Vt, Ut.prototype.delete = Rt, Ut.prototype.get = zt, Ut.prototype.has = Lt, Ut.prototype.set = $t;
    var qt = Ut;

    function Ht(t, e) {
        if ("function" != typeof t || null != e && "function" != typeof e) throw new TypeError("Expected a function");
        var r = function() {
            var n = arguments,
                i = e ? e.apply(this, n) : n[0],
                o = r.cache;
            if (o.has(i)) return o.get(i);
            var a = t.apply(this, n);
            return r.cache = o.set(i, a) || o, a
        };
        return r.cache = new(Ht.Cache || qt), r
    }
    Ht.Cache = qt;
    var Wt = Ht;
    var Gt = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
        Kt = /\\(\\)?/g,
        Xt = function(t) {
            var e = Wt(t, (function(t) {
                    return 500 === r.size && r.clear(), t
                })),
                r = e.cache;
            return e
        }((function(t) {
            var e = [];
            return 46 === t.charCodeAt(0) && e.push(""), t.replace(Gt, (function(t, r, n, i) {
                e.push(n ? i.replace(Kt, "$1") : r || t)
            })), e
        }));
    var Jt = function(t, e) {
            for (var r = -1, n = null == t ? 0 : t.length, i = Array(n); ++r < n;) i[r] = e(t[r], r, t);
            return i
        },
        Yt = V ? V.prototype : void 0,
        Zt = Yt ? Yt.toString : void 0;
    var Qt = function t(e) {
        if ("string" == typeof e) return e;
        if (I(e)) return Jt(e, t) + "";
        if (G(e)) return Zt ? Zt.call(e) : "";
        var r = e + "";
        return "0" == r && 1 / e == -Infinity ? "-0" : r
    };
    var te = function(t) {
        return null == t ? "" : Qt(t)
    };
    var ee = function(t, e) {
        return I(t) ? t : J(t, e) ? [t] : Xt(te(t))
    };
    var re = function(t) {
        if ("string" == typeof t || G(t)) return t;
        var e = t + "";
        return "0" == e && 1 / t == -Infinity ? "-0" : e
    };
    var ne = function(t, e) {
        for (var r = 0, n = (e = ee(e, t)).length; null != t && r < n;) t = t[re(e[r++])];
        return r && r == n ? t : void 0
    };
    var ie = function(t, e, r) {
        var n = null == t ? void 0 : ne(t, e);
        return void 0 === n ? r : n
    };
    var oe = class {
            constructor() {
                b(this, "_values", {})
            }
            get(t, e) {
                if (this.has(t)) return this._values[t]; {
                    const r = e();
                    return this._values[t] = r, r
                }
            }
            has(t) {
                return this._values.hasOwnProperty(t)
            }
        },
        ae = m(vt),
        se = function() {
            try {
                var t = dt(Object, "defineProperty");
                return t({}, "", {}), t
            } catch (e) {}
        }();
    var ue = function(t, e, r) {
            "__proto__" == e && se ? se(t, e, {
                configurable: !0,
                enumerable: !0,
                value: r,
                writable: !0
            }) : t[e] = r
        },
        ce = Object.prototype.hasOwnProperty;
    var le = function(t, e, r) {
            var n = t[e];
            ce.call(t, e) && Tt(n, r) && (void 0 !== r || e in t) || ue(t, e, r)
        },
        he = /^(?:0|[1-9]\d*)$/;
    var pe = function(t, e) {
        var r = typeof t;
        return !!(e = null == e ? 9007199254740991 : e) && ("number" == r || "symbol" != r && he.test(t)) && t > -1 && t % 1 == 0 && t < e
    };
    var de = function(t, e, r, n) {
        if (!Y(t)) return t;
        for (var i = -1, o = (e = ee(e, t)).length, a = o - 1, s = t; null != s && ++i < o;) {
            var u = re(e[i]),
                c = r;
            if ("__proto__" === u || "constructor" === u || "prototype" === u) return t;
            if (i != a) {
                var l = s[u];
                void 0 === (c = n ? n(l, u, s) : void 0) && (c = Y(l) ? l : pe(e[i + 1]) ? [] : {})
            }
            le(s, u, c), s = s[u]
        }
        return t
    };
    var fe = function(t, e, r) {
            return null == t ? t : de(t, e, r)
        },
        ve = new WeakMap;

    function ge(t) {
        if (ve.has(t)) return ve.get(t);
        const e = "compound" === t.type ? function(t) {
            const e = {};
            for (const [r, n] of Object.entries(t.props)) e[r] = ge(n);
            return e
        }(t) : "enum" === t.type ? function(t) {
            const e = {
                $case: t.defaultCase
            };
            for (const [r, n] of Object.entries(t.cases)) e[r] = ge(n);
            return e
        }(t) : t.default;
        return ve.set(t, e), e
    }
    var _e = m(vt),
        ye = m(w());

    function me(t, e, r) {
        return (0, _e.prism)((() => {
            const n = (0, _e.val)(e);
            return _e.prism.memo("driver", (() => n ? "BasicKeyframedTrack" === n.type ? function(t, e, r) {
                return (0, _e.prism)((() => {
                    let t = _e.prism.ref("state", {
                            started: !1
                        }),
                        n = t.current;
                    const i = r.getValue();
                    return (!n.started || i < n.validFrom || n.validTo <= i) && (t.current = n = function(t, e, r) {
                        const n = e.getValue();
                        if (0 === r.keyframes.length) return {
                            started: !0,
                            validFrom: -1 / 0,
                            validTo: 1 / 0,
                            der: be
                        };
                        let i = 0;
                        for (;;) {
                            const t = r.keyframes[i];
                            if (!t) return we.error;
                            const o = i === r.keyframes.length - 1;
                            if (n < t.position) return 0 === i ? we.beforeFirstKeyframe(t) : we.error;
                            if (t.position === n) return o ? we.lastKeyframe(t) : we.between(t, r.keyframes[i + 1], e);
                            if (i === r.keyframes.length - 1) return we.lastKeyframe(t); {
                                const o = i + 1;
                                if (r.keyframes[o].position <= n) {
                                    i = o;
                                    continue
                                }
                                return we.between(t, r.keyframes[i + 1], e)
                            }
                        }
                    }(0, r, e)), n.der.getValue()
                }))
            }(0, n, r) : (t.logger.error("Track type not yet supported."), new _e.ConstantDerivation(void 0)) : new _e.ConstantDerivation(void 0)), [n]).getValue()
        }))
    }
    var be = new _e.ConstantDerivation(void 0);
    var we = {
        beforeFirstKeyframe: t => ({
            started: !0,
            validFrom: -1 / 0,
            validTo: t.position,
            der: new _e.ConstantDerivation({
                left: t.value,
                progression: 0
            })
        }),
        lastKeyframe: t => ({
            started: !0,
            validFrom: t.position,
            validTo: 1 / 0,
            der: new _e.ConstantDerivation({
                left: t.value,
                progression: 0
            })
        }),
        between(t, e, r) {
            if (!t.connectedRight) return {
                started: !0,
                validFrom: t.position,
                validTo: e.position,
                der: new _e.ConstantDerivation({
                    left: t.value,
                    progression: 0
                })
            };
            const n = new ye.default(t.handles[2], t.handles[3], e.handles[0], e.handles[1]),
                i = (0, _e.prism)((() => {
                    const i = (r.getValue() - t.position) / (e.position - t.position);
                    const o = n.solveSimple(i);
                    return {
                        left: t.value,
                        right: e.value,
                        progression: o
                    }
                }));
            return {
                started: !0,
                validFrom: t.position,
                validTo: e.position,
                der: i
            }
        },
        error: {
            started: !0,
            validFrom: -1 / 0,
            validTo: 1 / 0,
            der: be
        }
    };

    function Pe(t, e, r) {
        const n = r.get(t);
        if (n && n.override === e) return n.merged;
        const i = f({}, t);
        for (const o of Object.keys(e)) {
            const n = e[o],
                a = t[o];
            i[o] = "object" == typeof n && "object" == typeof a ? Pe(a, n, r) : void 0 === n ? a : n
        }
        return r.set(t, {
            override: e,
            merged: i
        }), i
    }

    function je(t, e) {
        let r = t;
        for (const n of e) r = r[n];
        return r
    }
    var Oe = m(vt),
        Se = m(vt),
        Te = m(vt).Ticker.raf,
        De = m(vt);

    function ke(t) {
        return "compound" === t.type || "enum" === t.type
    }

    function Ce(t, e) {
        if (!t) return;
        const [r, ...n] = e;
        if (void 0 === r) return t;
        if (!ke(t)) return;
        return Ce("enum" === t.type ? t.cases[r] : t.props[r], n)
    }
    var xe, Ae, Ie, Ee, Me, Fe, Ve, Ne;

    function Be(t) {
        return function(e, r) {
            return t(e, r())
        }
    }(Ae = xe || (xe = {}))[Ae.GENERAL = 1] = "GENERAL", Ae[Ae.TODO = 2] = "TODO", Ae[Ae.TROUBLESHOOTING = 4] = "TROUBLESHOOTING", (Ee = Ie || (Ie = {}))[Ee.INTERNAL = 8] = "INTERNAL", Ee[Ee.DEV = 16] = "DEV", Ee[Ee.PUBLIC = 32] = "PUBLIC", (Fe = Me || (Me = {}))[Fe.TRACE = 64] = "TRACE", Fe[Fe.DEBUG = 128] = "DEBUG", Fe[Fe.WARN = 256] = "WARN", Fe[Fe.ERROR = 512] = "ERROR", (Ne = Ve || (Ve = {}))[Ne.ERROR_PUBLIC = 545] = "ERROR_PUBLIC", Ne[Ne.ERROR_DEV = 529] = "ERROR_DEV", Ne[Ne._HMM = 524] = "_HMM", Ne[Ne._TODO = 522] = "_TODO", Ne[Ne._ERROR = 521] = "_ERROR", Ne[Ne.WARN_PUBLIC = 289] = "WARN_PUBLIC", Ne[Ne.WARN_DEV = 273] = "WARN_DEV", Ne[Ne._KAPOW = 268] = "_KAPOW", Ne[Ne._WARN = 265] = "_WARN", Ne[Ne.DEBUG_DEV = 145] = "DEBUG_DEV", Ne[Ne._DEBUG = 137] = "_DEBUG", Ne[Ne.TRACE_DEV = 81] = "TRACE_DEV", Ne[Ne._TRACE = 73] = "_TRACE";
    var Re = {
        _hmm: ze(524),
        _todo: ze(522),
        _error: ze(521),
        errorDev: ze(529),
        errorPublic: ze(545),
        _kapow: ze(268),
        _warn: ze(265),
        warnDev: ze(273),
        warnPublic: ze(289),
        _debug: ze(137),
        debugDev: ze(145),
        _trace: ze(73),
        traceDev: ze(81)
    };

    function ze(t) {
        return Object.freeze({
            audience: Le(t, 8) ? "internal" : Le(t, 16) ? "dev" : "public",
            category: Le(t, 4) ? "troubleshooting" : Le(t, 2) ? "todo" : "general",
            level: Le(t, 512) ? 512 : Le(t, 256) ? 256 : Le(t, 128) ? 128 : 64
        })
    }

    function Le(t, e) {
        return (t & e) === e
    }

    function $e(t, e) {
        return (32 == (32 & e) || (16 == (16 & e) ? t.dev : 8 == (8 & e) && t.internal)) && t.min <= e
    }
    var Ue = {
        loggingConsoleStyle: !0,
        loggerConsoleStyle: !0,
        includes: Object.freeze({
            internal: !1,
            dev: !1,
            min: 256
        }),
        filtered: function() {},
        include: function() {
            return {}
        },
        create: null,
        creatExt: null,
        named(t, e, r) {
            return this.create({
                names: [...t.names, {
                    name: e,
                    key: r
                }]
            })
        },
        style: {
            bold: void 0,
            italic: void 0,
            cssMemo: new Map([
                ["", ""]
            ]),
            collapseOnRE: /[a-z- ]+/g,
            color: void 0,
            collapsed(t) {
                if (t.length < 5) return t;
                const e = t.replace(this.collapseOnRE, "");
                return this.cssMemo.has(e) || this.cssMemo.set(e, this.css(t)), e
            },
            css(t) {
                var e, r, n, i;
                const o = this.cssMemo.get(t);
                if (o) return o;
                let a = `color:${null!=(r=null==(e=this.color)?void 0:e.call(this,t))?r:`hsl(${(t.charCodeAt(0)+t.charCodeAt(t.length-1))%360}, 100%, 60%)`}`;
                return (null == (n = this.bold) ? void 0 : n.test(t)) && (a += ";font-weight:600"), (null == (i = this.italic) ? void 0 : i.test(t)) && (a += ";font-style:italic"), this.cssMemo.set(t, a), a
            }
        }
    };

    function qe(t = console, e = {}) {
        const r = v(f({}, Ue), {
                includes: f({}, Ue.includes)
            }),
            n = {
                styled: Ge.bind(r, t),
                noStyle: Ke.bind(r, t)
            },
            i = We.bind(r);

        function o() {
            return r.loggingConsoleStyle && r.loggerConsoleStyle ? n.styled : n.noStyle
        }
        return r.create = o(), {
            configureLogger(t) {
                var e;
                "console" === t ? (r.loggerConsoleStyle = Ue.loggerConsoleStyle, r.create = o()) : "console" === t.type ? (r.loggerConsoleStyle = null != (e = t.style) ? e : Ue.loggerConsoleStyle, r.create = o()) : "keyed" === t.type ? (r.creatExt = e => t.keyed(e.names), r.create = i) : "named" === t.type && (r.creatExt = He.bind(null, t.named), r.create = i)
            },
            configureLogging(t) {
                var e, n, i, a, s;
                r.includes.dev = null != (e = t.dev) ? e : Ue.includes.dev, r.includes.internal = null != (n = t.internal) ? n : Ue.includes.internal, r.includes.min = null != (i = t.min) ? i : Ue.includes.min, r.include = null != (a = t.include) ? a : Ue.include, r.loggingConsoleStyle = null != (s = t.consoleStyle) ? s : Ue.loggingConsoleStyle, r.create = o()
            },
            getLogger: () => r.create({
                names: []
            })
        }
    }

    function He(t, e) {
        const r = [];
        for (let {
                name: n,
                key: i
            } of e.names) r.push(null == i ? n : `${n} (${i})`);
        return t(r)
    }

    function We(t) {
        const e = f(f({}, this.includes), this.include(t)),
            r = this.filtered,
            n = this.named.bind(this, t),
            i = this.creatExt(t),
            o = $e(e, 524),
            a = $e(e, 522),
            s = $e(e, 521),
            u = $e(e, 529),
            c = $e(e, 545),
            l = $e(e, 265),
            h = $e(e, 268),
            p = $e(e, 273),
            d = $e(e, 289),
            v = $e(e, 137),
            g = $e(e, 145),
            _ = $e(e, 73),
            y = $e(e, 81),
            m = o ? i.error.bind(i, Re._hmm) : r.bind(t, 524),
            b = a ? i.error.bind(i, Re._todo) : r.bind(t, 522),
            w = s ? i.error.bind(i, Re._error) : r.bind(t, 521),
            P = u ? i.error.bind(i, Re.errorDev) : r.bind(t, 529),
            j = c ? i.error.bind(i, Re.errorPublic) : r.bind(t, 545),
            O = h ? i.warn.bind(i, Re._kapow) : r.bind(t, 268),
            S = l ? i.warn.bind(i, Re._warn) : r.bind(t, 265),
            T = p ? i.warn.bind(i, Re.warnDev) : r.bind(t, 273),
            D = d ? i.warn.bind(i, Re.warnPublic) : r.bind(t, 273),
            k = v ? i.debug.bind(i, Re._debug) : r.bind(t, 137),
            C = g ? i.debug.bind(i, Re.debugDev) : r.bind(t, 145),
            x = _ ? i.trace.bind(i, Re._trace) : r.bind(t, 73),
            A = y ? i.trace.bind(i, Re.traceDev) : r.bind(t, 81),
            I = {
                _hmm: m,
                _todo: b,
                _error: w,
                errorDev: P,
                errorPublic: j,
                _kapow: O,
                _warn: S,
                warnDev: T,
                warnPublic: D,
                _debug: k,
                debugDev: C,
                _trace: x,
                traceDev: A,
                lazy: {
                    _hmm: o ? Be(m) : m,
                    _todo: a ? Be(b) : b,
                    _error: s ? Be(w) : w,
                    errorDev: u ? Be(P) : P,
                    errorPublic: c ? Be(j) : j,
                    _kapow: h ? Be(O) : O,
                    _warn: l ? Be(S) : S,
                    warnDev: p ? Be(T) : T,
                    warnPublic: d ? Be(D) : D,
                    _debug: v ? Be(k) : k,
                    debugDev: g ? Be(C) : C,
                    _trace: _ ? Be(x) : x,
                    traceDev: y ? Be(A) : A
                },
                named: n,
                utilFor: {
                    internal: () => ({
                        debug: I._debug,
                        error: I._error,
                        warn: I._warn,
                        trace: I._trace,
                        named: (t, e) => I.named(t, e).utilFor.internal()
                    }),
                    dev: () => ({
                        debug: I.debugDev,
                        error: I.errorDev,
                        warn: I.warnDev,
                        trace: I.traceDev,
                        named: (t, e) => I.named(t, e).utilFor.dev()
                    }),
                    public: () => ({
                        error: I.errorPublic,
                        warn: I.warnPublic,
                        debug(t, e) {
                            I._warn(`(public "debug" filtered out) ${t}`, e)
                        },
                        trace(t, e) {
                            I._warn(`(public "trace" filtered out) ${t}`, e)
                        },
                        named: (t, e) => I.named(t, e).utilFor.public()
                    })
                }
            };
        return I
    }

    function Ge(t, e) {
        const r = f(f({}, this.includes), this.include(e)),
            n = [];
        let i = "";
        for (let u = 0; u < e.names.length; u++) {
            const {
                name: t,
                key: r
            } = e.names[u];
            if (i += ` %c${t}`, n.push(this.style.css(t)), null != r) {
                const t = `%c#${r}`;
                i += t, n.push(this.style.css(t))
            }
        }
        const o = this.filtered,
            a = this.named.bind(this, e),
            s = [i, ...n];
        return Xe(o, e, r, t, s, function(t) {
            const e = t.slice(0);
            for (let r = 1; r < e.length; r++) e[r] += ";background-color:#e0005a;padding:2px;color:white";
            return e
        }(s), a)
    }

    function Ke(t, e) {
        const r = f(f({}, this.includes), this.include(e));
        let n = "";
        for (let o = 0; o < e.names.length; o++) {
            const {
                name: t,
                key: r
            } = e.names[o];
            n += ` ${t}`, null != r && (n += `#${r}`)
        }
        const i = [n];
        return Xe(this.filtered, e, r, t, i, i, this.named.bind(this, e))
    }

    function Xe(t, e, r, n, i, o, a) {
        const s = $e(r, 524),
            u = $e(r, 522),
            c = $e(r, 521),
            l = $e(r, 529),
            h = $e(r, 545),
            p = $e(r, 265),
            d = $e(r, 268),
            f = $e(r, 273),
            v = $e(r, 289),
            g = $e(r, 137),
            _ = $e(r, 145),
            y = $e(r, 73),
            m = $e(r, 81),
            b = s ? n.error.bind(n, ...i) : t.bind(e, 524),
            w = u ? n.error.bind(n, ...i) : t.bind(e, 522),
            P = c ? n.error.bind(n, ...i) : t.bind(e, 521),
            j = l ? n.error.bind(n, ...i) : t.bind(e, 529),
            O = h ? n.error.bind(n, ...i) : t.bind(e, 545),
            S = d ? n.warn.bind(n, ...o) : t.bind(e, 268),
            T = p ? n.warn.bind(n, ...i) : t.bind(e, 265),
            D = f ? n.warn.bind(n, ...i) : t.bind(e, 273),
            k = v ? n.warn.bind(n, ...i) : t.bind(e, 273),
            C = g ? n.info.bind(n, ...i) : t.bind(e, 137),
            x = _ ? n.info.bind(n, ...i) : t.bind(e, 145),
            A = y ? n.debug.bind(n, ...i) : t.bind(e, 73),
            I = m ? n.debug.bind(n, ...i) : t.bind(e, 81),
            E = {
                _hmm: b,
                _todo: w,
                _error: P,
                errorDev: j,
                errorPublic: O,
                _kapow: S,
                _warn: T,
                warnDev: D,
                warnPublic: k,
                _debug: C,
                debugDev: x,
                _trace: A,
                traceDev: I,
                lazy: {
                    _hmm: s ? Be(b) : b,
                    _todo: u ? Be(w) : w,
                    _error: c ? Be(P) : P,
                    errorDev: l ? Be(j) : j,
                    errorPublic: h ? Be(O) : O,
                    _kapow: d ? Be(S) : S,
                    _warn: p ? Be(T) : T,
                    warnDev: f ? Be(D) : D,
                    warnPublic: v ? Be(k) : k,
                    _debug: g ? Be(C) : C,
                    debugDev: _ ? Be(x) : x,
                    _trace: y ? Be(A) : A,
                    traceDev: m ? Be(I) : I
                },
                named: a,
                utilFor: {
                    internal: () => ({
                        debug: E._debug,
                        error: E._error,
                        warn: E._warn,
                        trace: E._trace,
                        named: (t, e) => E.named(t, e).utilFor.internal()
                    }),
                    dev: () => ({
                        debug: E.debugDev,
                        error: E.errorDev,
                        warn: E.warnDev,
                        trace: E.traceDev,
                        named: (t, e) => E.named(t, e).utilFor.dev()
                    }),
                    public: () => ({
                        error: E.errorPublic,
                        warn: E.warnPublic,
                        debug(t, e) {
                            E._warn(`(public "debug" filtered out) ${t}`, e)
                        },
                        trace(t, e) {
                            E._warn(`(public "trace" filtered out) ${t}`, e)
                        },
                        named: (t, e) => E.named(t, e).utilFor.public()
                    })
                }
            };
        return E
    }
    var Je = qe(console, {
        _debug: function() {},
        _error: function() {}
    });
    Je.configureLogging({
        dev: !0,
        min: Me.TRACE
    });
    var Ye = Je.getLogger().named("Theatre.js (default logger)").utilFor.dev(),
        Ze = new WeakMap;

    function Qe(t, e, r) {
        for (const [n, i] of Object.entries(e.props))
            if (!ke(i)) {
                const e = [...t, n];
                r.set(JSON.stringify(e), r.size), tr(e, i, r)
            }
        for (const [n, i] of Object.entries(e.props))
            if (ke(i)) {
                const e = [...t, n];
                r.set(JSON.stringify(e), r.size), tr(e, i, r)
            }
    }

    function tr(t, e, r) {
        if ("compound" === e.type) Qe(t, e, r);
        else {
            if ("enum" === e.type) throw new Error("Enums aren't supported yet");
            r.set(JSON.stringify(t), r.size)
        }
    }

    function er(t) {
        try {
            return JSON.parse(t)
        } catch (e) {
            return void Ye.warn(`property ${JSON.stringify(t)} cannot be parsed. Skipping.`)
        }
    }
    var rr = m(vt);
    m(j());
    var nr = class extends Error {},
        ir = class extends nr {},
        or = m(vt),
        ar = m(vt),
        sr = /\s/;
    var ur = function(t) {
            for (var e = t.length; e-- && sr.test(t.charAt(e)););
            return e
        },
        cr = /^\s+/;
    var lr = function(t) {
            return t ? t.slice(0, ur(t) + 1).replace(cr, "") : t
        },
        hr = /^[-+]0x[0-9a-f]+$/i,
        pr = /^0b[01]+$/i,
        dr = /^0o[0-7]+$/i,
        fr = parseInt;
    var vr = function(t) {
            if ("number" == typeof t) return t;
            if (G(t)) return NaN;
            if (Y(t)) {
                var e = "function" == typeof t.valueOf ? t.valueOf() : t;
                t = Y(e) ? e + "" : e
            }
            if ("string" != typeof t) return 0 === t ? t : +t;
            t = lr(t);
            var r = pr.test(t);
            return r || dr.test(t) ? fr(t.slice(2), r ? 2 : 8) : hr.test(t) ? NaN : +t
        },
        gr = 1 / 0;
    var _r = function(t) {
        return t ? (t = vr(t)) === gr || t === -1 / 0 ? 17976931348623157e292 * (t < 0 ? -1 : 1) : t == t ? t : 0 : 0 === t ? t : 0
    };
    var yr = function(t) {
        var e = _r(t),
            r = e % 1;
        return e == e ? r ? e - r : e : 0
    };
    var mr = function(t) {
            return t
        },
        br = dt(F, "WeakMap");
    var wr = function(t) {
        return "number" == typeof t && t > -1 && t % 1 == 0 && t <= 9007199254740991
    };
    var Pr = function(t) {
            return null != t && wr(t.length) && !Q(t)
        },
        jr = Object.prototype;
    var Or = function(t) {
        var e = t && t.constructor;
        return t === ("function" == typeof e && e.prototype || jr)
    };
    var Sr = function(t, e) {
        for (var r = -1, n = Array(t); ++r < t;) n[r] = e(r);
        return n
    };
    var Tr = function(t) {
            return W(t) && "[object Arguments]" == H(t)
        },
        Dr = Object.prototype,
        kr = Dr.hasOwnProperty,
        Cr = Dr.propertyIsEnumerable,
        xr = Tr(function() {
            return arguments
        }()) ? Tr : function(t) {
            return W(t) && kr.call(t, "callee") && !Cr.call(t, "callee")
        };
    var Ar = function() {
            return !1
        },
        Ir = r && !r.nodeType && r,
        Er = Ir && e && !e.nodeType && e,
        Mr = Er && Er.exports === Ir ? F.Buffer : void 0,
        Fr = (Mr ? Mr.isBuffer : void 0) || Ar,
        Vr = {};
    Vr["[object Float32Array]"] = Vr["[object Float64Array]"] = Vr["[object Int8Array]"] = Vr["[object Int16Array]"] = Vr["[object Int32Array]"] = Vr["[object Uint8Array]"] = Vr["[object Uint8ClampedArray]"] = Vr["[object Uint16Array]"] = Vr["[object Uint32Array]"] = !0, Vr["[object Arguments]"] = Vr["[object Array]"] = Vr["[object ArrayBuffer]"] = Vr["[object Boolean]"] = Vr["[object DataView]"] = Vr["[object Date]"] = Vr["[object Error]"] = Vr["[object Function]"] = Vr["[object Map]"] = Vr["[object Number]"] = Vr["[object Object]"] = Vr["[object RegExp]"] = Vr["[object Set]"] = Vr["[object String]"] = Vr["[object WeakMap]"] = !1;
    var Nr = function(t) {
        return W(t) && wr(t.length) && !!Vr[H(t)]
    };
    var Br = function(t) {
            return function(e) {
                return t(e)
            }
        },
        Rr = r && !r.nodeType && r,
        zr = Rr && e && !e.nodeType && e,
        Lr = zr && zr.exports === Rr && E.process,
        $r = function() {
            try {
                var t = zr && zr.require && zr.require("util").types;
                return t || Lr && Lr.binding && Lr.binding("util")
            } catch (e) {}
        }(),
        Ur = $r && $r.isTypedArray,
        qr = Ur ? Br(Ur) : Nr,
        Hr = Object.prototype.hasOwnProperty;
    var Wr = function(t, e) {
        var r = I(t),
            n = !r && xr(t),
            i = !r && !n && Fr(t),
            o = !r && !n && !i && qr(t),
            a = r || n || i || o,
            s = a ? Sr(t.length, String) : [],
            u = s.length;
        for (var c in t) !e && !Hr.call(t, c) || a && ("length" == c || i && ("offset" == c || "parent" == c) || o && ("buffer" == c || "byteLength" == c || "byteOffset" == c) || pe(c, u)) || s.push(c);
        return s
    };
    var Gr = function(t, e) {
            return function(r) {
                return t(e(r))
            }
        },
        Kr = Gr(Object.keys, Object),
        Xr = Object.prototype.hasOwnProperty;
    var Jr = function(t) {
        if (!Or(t)) return Kr(t);
        var e = [];
        for (var r in Object(t)) Xr.call(t, r) && "constructor" != r && e.push(r);
        return e
    };
    var Yr = function(t) {
        return Pr(t) ? Wr(t) : Jr(t)
    };
    var Zr = function(t, e) {
            for (var r = -1, n = e.length, i = t.length; ++r < n;) t[i + r] = e[r];
            return t
        },
        Qr = Gr(Object.getPrototypeOf, Object),
        tn = Function.prototype,
        en = Object.prototype,
        rn = tn.toString,
        nn = en.hasOwnProperty,
        on = rn.call(Object);
    var an = function(t) {
        if (!W(t) || "[object Object]" != H(t)) return !1;
        var e = Qr(t);
        if (null === e) return !0;
        var r = nn.call(e, "constructor") && e.constructor;
        return "function" == typeof r && r instanceof r && rn.call(r) == on
    };
    var sn = function(t, e, r) {
        var n = -1,
            i = t.length;
        e < 0 && (e = -e > i ? 0 : i + e), (r = r > i ? i : r) < 0 && (r += i), i = e > r ? 0 : r - e >>> 0, e >>>= 0;
        for (var o = Array(i); ++n < i;) o[n] = t[n + e];
        return o
    };
    var un = function(t, e, r) {
            var n = t.length;
            return r = void 0 === r ? n : r, !e && r >= n ? t : sn(t, e, r)
        },
        cn = RegExp("[\\u200d\\ud800-\\udfff\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff\\ufe0e\\ufe0f]");
    var ln = function(t) {
        return cn.test(t)
    };
    var hn = function(t) {
            return t.split("")
        },
        pn = "[\\ud800-\\udfff]",
        dn = "[\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff]",
        fn = "\\ud83c[\\udffb-\\udfff]",
        vn = "[^\\ud800-\\udfff]",
        gn = "(?:\\ud83c[\\udde6-\\uddff]){2}",
        _n = "[\\ud800-\\udbff][\\udc00-\\udfff]",
        yn = "(?:" + dn + "|" + fn + ")" + "?",
        mn = "[\\ufe0e\\ufe0f]?",
        bn = mn + yn + ("(?:\\u200d(?:" + [vn, gn, _n].join("|") + ")" + mn + yn + ")*"),
        wn = "(?:" + [vn + dn + "?", dn, gn, _n, pn].join("|") + ")",
        Pn = RegExp(fn + "(?=" + fn + ")|" + wn + bn, "g");
    var jn = function(t) {
        return t.match(Pn) || []
    };
    var On = function(t) {
        return ln(t) ? jn(t) : hn(t)
    };
    var Sn = function(t, e, r) {
        return t == t && (void 0 !== r && (t = t <= r ? t : r), void 0 !== e && (t = t >= e ? t : e)), t
    };
    var Tn = function(t, e, r) {
        return void 0 === r && (r = e, e = void 0), void 0 !== r && (r = (r = vr(r)) == r ? r : 0), void 0 !== e && (e = (e = vr(e)) == e ? e : 0), Sn(vr(t), e, r)
    };
    var Dn = function() {
        this.__data__ = new Mt, this.size = 0
    };
    var kn = function(t) {
        var e = this.__data__,
            r = e.delete(t);
        return this.size = e.size, r
    };
    var Cn = function(t) {
        return this.__data__.get(t)
    };
    var xn = function(t) {
        return this.__data__.has(t)
    };
    var An = function(t, e) {
        var r = this.__data__;
        if (r instanceof Mt) {
            var n = r.__data__;
            if (!Ft || n.length < 199) return n.push([t, e]), this.size = ++r.size, this;
            r = this.__data__ = new qt(n)
        }
        return r.set(t, e), this.size = r.size, this
    };

    function In(t) {
        var e = this.__data__ = new Mt(t);
        this.size = e.size
    }
    In.prototype.clear = Dn, In.prototype.delete = kn, In.prototype.get = Cn, In.prototype.has = xn, In.prototype.set = An;
    var En = In;
    var Mn = function(t, e) {
        for (var r = -1, n = null == t ? 0 : t.length, i = 0, o = []; ++r < n;) {
            var a = t[r];
            e(a, r, t) && (o[i++] = a)
        }
        return o
    };
    var Fn = function() {
            return []
        },
        Vn = Object.prototype.propertyIsEnumerable,
        Nn = Object.getOwnPropertySymbols,
        Bn = Nn ? function(t) {
            return null == t ? [] : (t = Object(t), Mn(Nn(t), (function(e) {
                return Vn.call(t, e)
            })))
        } : Fn;
    var Rn = function(t, e, r) {
        var n = e(t);
        return I(t) ? n : Zr(n, r(t))
    };
    var zn = function(t) {
            return Rn(t, Yr, Bn)
        },
        Ln = dt(F, "DataView"),
        $n = dt(F, "Promise"),
        Un = dt(F, "Set"),
        qn = "[object Map]",
        Hn = "[object Promise]",
        Wn = "[object Set]",
        Gn = "[object WeakMap]",
        Kn = "[object DataView]",
        Xn = it(Ln),
        Jn = it(Ft),
        Yn = it($n),
        Zn = it(Un),
        Qn = it(br),
        ti = H;
    (Ln && ti(new Ln(new ArrayBuffer(1))) != Kn || Ft && ti(new Ft) != qn || $n && ti($n.resolve()) != Hn || Un && ti(new Un) != Wn || br && ti(new br) != Gn) && (ti = function(t) {
        var e = H(t),
            r = "[object Object]" == e ? t.constructor : void 0,
            n = r ? it(r) : "";
        if (n) switch (n) {
            case Xn:
                return Kn;
            case Jn:
                return qn;
            case Yn:
                return Hn;
            case Zn:
                return Wn;
            case Qn:
                return Gn
        }
        return e
    });
    var ei = ti,
        ri = F.Uint8Array;
    var ni = function(t) {
        return this.__data__.set(t, "__lodash_hash_undefined__"), this
    };
    var ii = function(t) {
        return this.__data__.has(t)
    };

    function oi(t) {
        var e = -1,
            r = null == t ? 0 : t.length;
        for (this.__data__ = new qt; ++e < r;) this.add(t[e])
    }
    oi.prototype.add = oi.prototype.push = ni, oi.prototype.has = ii;
    var ai = oi;
    var si = function(t, e) {
        for (var r = -1, n = null == t ? 0 : t.length; ++r < n;)
            if (e(t[r], r, t)) return !0;
        return !1
    };
    var ui = function(t, e) {
        return t.has(e)
    };
    var ci = function(t, e, r, n, i, o) {
        var a = 1 & r,
            s = t.length,
            u = e.length;
        if (s != u && !(a && u > s)) return !1;
        var c = o.get(t),
            l = o.get(e);
        if (c && l) return c == e && l == t;
        var h = -1,
            p = !0,
            d = 2 & r ? new ai : void 0;
        for (o.set(t, e), o.set(e, t); ++h < s;) {
            var f = t[h],
                v = e[h];
            if (n) var g = a ? n(v, f, h, e, t, o) : n(f, v, h, t, e, o);
            if (void 0 !== g) {
                if (g) continue;
                p = !1;
                break
            }
            if (d) {
                if (!si(e, (function(t, e) {
                        if (!ui(d, e) && (f === t || i(f, t, r, n, o))) return d.push(e)
                    }))) {
                    p = !1;
                    break
                }
            } else if (f !== v && !i(f, v, r, n, o)) {
                p = !1;
                break
            }
        }
        return o.delete(t), o.delete(e), p
    };
    var li = function(t) {
        var e = -1,
            r = Array(t.size);
        return t.forEach((function(t, n) {
            r[++e] = [n, t]
        })), r
    };
    var hi = function(t) {
            var e = -1,
                r = Array(t.size);
            return t.forEach((function(t) {
                r[++e] = t
            })), r
        },
        pi = V ? V.prototype : void 0,
        di = pi ? pi.valueOf : void 0;
    var fi = function(t, e, r, n, i, o, a) {
            switch (r) {
                case "[object DataView]":
                    if (t.byteLength != e.byteLength || t.byteOffset != e.byteOffset) return !1;
                    t = t.buffer, e = e.buffer;
                case "[object ArrayBuffer]":
                    return !(t.byteLength != e.byteLength || !o(new ri(t), new ri(e)));
                case "[object Boolean]":
                case "[object Date]":
                case "[object Number]":
                    return Tt(+t, +e);
                case "[object Error]":
                    return t.name == e.name && t.message == e.message;
                case "[object RegExp]":
                case "[object String]":
                    return t == e + "";
                case "[object Map]":
                    var s = li;
                case "[object Set]":
                    var u = 1 & n;
                    if (s || (s = hi), t.size != e.size && !u) return !1;
                    var c = a.get(t);
                    if (c) return c == e;
                    n |= 2, a.set(t, e);
                    var l = ci(s(t), s(e), n, i, o, a);
                    return a.delete(t), l;
                case "[object Symbol]":
                    if (di) return di.call(t) == di.call(e)
            }
            return !1
        },
        vi = Object.prototype.hasOwnProperty;
    var gi = function(t, e, r, n, i, o) {
            var a = 1 & r,
                s = zn(t),
                u = s.length;
            if (u != zn(e).length && !a) return !1;
            for (var c = u; c--;) {
                var l = s[c];
                if (!(a ? l in e : vi.call(e, l))) return !1
            }
            var h = o.get(t),
                p = o.get(e);
            if (h && p) return h == e && p == t;
            var d = !0;
            o.set(t, e), o.set(e, t);
            for (var f = a; ++c < u;) {
                var v = t[l = s[c]],
                    g = e[l];
                if (n) var _ = a ? n(g, v, l, e, t, o) : n(v, g, l, t, e, o);
                if (!(void 0 === _ ? v === g || i(v, g, r, n, o) : _)) {
                    d = !1;
                    break
                }
                f || (f = "constructor" == l)
            }
            if (d && !f) {
                var y = t.constructor,
                    m = e.constructor;
                y == m || !("constructor" in t) || !("constructor" in e) || "function" == typeof y && y instanceof y && "function" == typeof m && m instanceof m || (d = !1)
            }
            return o.delete(t), o.delete(e), d
        },
        _i = "[object Arguments]",
        yi = "[object Array]",
        mi = "[object Object]",
        bi = Object.prototype.hasOwnProperty;
    var wi = function(t, e, r, n, i, o) {
        var a = I(t),
            s = I(e),
            u = a ? yi : ei(t),
            c = s ? yi : ei(e),
            l = (u = u == _i ? mi : u) == mi,
            h = (c = c == _i ? mi : c) == mi,
            p = u == c;
        if (p && Fr(t)) {
            if (!Fr(e)) return !1;
            a = !0, l = !1
        }
        if (p && !l) return o || (o = new En), a || qr(t) ? ci(t, e, r, n, i, o) : fi(t, e, u, r, n, i, o);
        if (!(1 & r)) {
            var d = l && bi.call(t, "__wrapped__"),
                f = h && bi.call(e, "__wrapped__");
            if (d || f) {
                var v = d ? t.value() : t,
                    g = f ? e.value() : e;
                return o || (o = new En), i(v, g, r, n, o)
            }
        }
        return !!p && (o || (o = new En), gi(t, e, r, n, i, o))
    };
    var Pi = function t(e, r, n, i, o) {
        return e === r || (null == e || null == r || !W(e) && !W(r) ? e != e && r != r : wi(e, r, n, i, t, o))
    };
    var ji = function(t, e, r, n) {
        var i = r.length,
            o = i,
            a = !n;
        if (null == t) return !o;
        for (t = Object(t); i--;) {
            var s = r[i];
            if (a && s[2] ? s[1] !== t[s[0]] : !(s[0] in t)) return !1
        }
        for (; ++i < o;) {
            var u = (s = r[i])[0],
                c = t[u],
                l = s[1];
            if (a && s[2]) {
                if (void 0 === c && !(u in t)) return !1
            } else {
                var h = new En;
                if (n) var p = n(c, l, u, t, e, h);
                if (!(void 0 === p ? Pi(l, c, 3, n, h) : p)) return !1
            }
        }
        return !0
    };
    var Oi = function(t) {
        return t == t && !Y(t)
    };
    var Si = function(t) {
        for (var e = Yr(t), r = e.length; r--;) {
            var n = e[r],
                i = t[n];
            e[r] = [n, i, Oi(i)]
        }
        return e
    };
    var Ti = function(t, e) {
        return function(r) {
            return null != r && (r[t] === e && (void 0 !== e || t in Object(r)))
        }
    };
    var Di = function(t) {
        var e = Si(t);
        return 1 == e.length && e[0][2] ? Ti(e[0][0], e[0][1]) : function(r) {
            return r === t || ji(r, t, e)
        }
    };
    var ki = function(t, e) {
        return null != t && e in Object(t)
    };
    var Ci = function(t, e, r) {
        for (var n = -1, i = (e = ee(e, t)).length, o = !1; ++n < i;) {
            var a = re(e[n]);
            if (!(o = null != t && r(t, a))) break;
            t = t[a]
        }
        return o || ++n != i ? o : !!(i = null == t ? 0 : t.length) && wr(i) && pe(a, i) && (I(t) || xr(t))
    };
    var xi = function(t, e) {
        return null != t && Ci(t, e, ki)
    };
    var Ai = function(t, e) {
        return J(t) && Oi(e) ? Ti(re(t), e) : function(r) {
            var n = ie(r, t);
            return void 0 === n && n === e ? xi(r, t) : Pi(e, n, 3)
        }
    };
    var Ii = function(t) {
        return function(e) {
            return null == e ? void 0 : e[t]
        }
    };
    var Ei = function(t) {
        return function(e) {
            return ne(e, t)
        }
    };
    var Mi = function(t) {
        return J(t) ? Ii(re(t)) : Ei(t)
    };
    var Fi = function(t) {
        return "function" == typeof t ? t : null == t ? mr : "object" == typeof t ? I(t) ? Ai(t[0], t[1]) : Di(t) : Mi(t)
    };
    var Vi = function(t) {
        return function(e, r, n) {
            for (var i = -1, o = Object(e), a = n(e), s = a.length; s--;) {
                var u = a[t ? s : ++i];
                if (!1 === r(o[u], u, o)) break
            }
            return e
        }
    }();
    var Ni = function(t, e) {
        return t && Vi(t, e, Yr)
    };
    var Bi = function(t, e) {
            var r = {};
            return e = Fi(e), Ni(t, (function(t, n, i) {
                ue(r, n, e(t, n, i))
            })), r
        },
        Ri = Math.floor;
    var zi = function(t, e) {
            var r = "";
            if (!t || e < 1 || e > 9007199254740991) return r;
            do {
                e % 2 && (r += t), (e = Ri(e / 2)) && (t += t)
            } while (e);
            return r
        },
        Li = Ii("length"),
        $i = "[\\ud800-\\udfff]",
        Ui = "[\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff]",
        qi = "\\ud83c[\\udffb-\\udfff]",
        Hi = "[^\\ud800-\\udfff]",
        Wi = "(?:\\ud83c[\\udde6-\\uddff]){2}",
        Gi = "[\\ud800-\\udbff][\\udc00-\\udfff]",
        Ki = "(?:" + Ui + "|" + qi + ")" + "?",
        Xi = "[\\ufe0e\\ufe0f]?",
        Ji = Xi + Ki + ("(?:\\u200d(?:" + [Hi, Wi, Gi].join("|") + ")" + Xi + Ki + ")*"),
        Yi = "(?:" + [Hi + Ui + "?", Ui, Wi, Gi, $i].join("|") + ")",
        Zi = RegExp(qi + "(?=" + qi + ")|" + Yi + Ji, "g");
    var Qi = function(t) {
        for (var e = Zi.lastIndex = 0; Zi.test(t);) ++e;
        return e
    };
    var to = function(t) {
            return ln(t) ? Qi(t) : Li(t)
        },
        eo = Math.ceil;
    var ro = function(t, e) {
        var r = (e = void 0 === e ? " " : Qt(e)).length;
        if (r < 2) return r ? zi(e, t) : e;
        var n = zi(e, eo(t / to(e)));
        return ln(e) ? un(On(n), 0, t).join("") : n.slice(0, t)
    };
    var no = function(t, e, r) {
        t = te(t);
        var n = (e = yr(e)) ? to(t) : 0;
        return e && n < e ? ro(e - n, r) + t : t
    };

    function io() {
        let t, e;
        const r = new Promise(((r, i) => {
                t = t => {
                    r(t), n.status = "resolved"
                }, e = t => {
                    i(t), n.status = "rejected"
                }
            })),
            n = {
                resolve: t,
                reject: e,
                promise: r,
                status: "pending"
            };
        return n
    }
    var oo = () => {},
        ao = m(vt),
        so = m(vt);
    var uo = class {
            constructor(t) {
                this._fps = t
            }
            formatSubUnitForGrid(t) {
                const e = t % 1,
                    r = 1 / this._fps;
                return Math.round(e / r) + "f"
            }
            formatFullUnitForGrid(t) {
                let e = t,
                    r = "";
                if (e >= ho) {
                    r += Math.floor(e / ho) + "h", e %= ho
                }
                if (e >= lo) {
                    r += Math.floor(e / lo) + "m", e %= lo
                }
                if (e >= co) {
                    r += Math.floor(e / co) + "s", e %= co
                }
                const n = 1 / this._fps;
                if (e >= n) {
                    r += Math.floor(e / n) + "f", e %= n
                }
                return 0 === r.length ? "0s" : r
            }
            formatForPlayhead(t) {
                let e = t,
                    r = "";
                if (e >= ho) {
                    const t = Math.floor(e / ho);
                    r += no(t.toString(), 2, "0") + "h", e %= ho
                }
                if (e >= lo) {
                    const t = Math.floor(e / lo);
                    r += no(t.toString(), 2, "0") + "m", e %= lo
                } else r.length > 0 && (r += "00m");
                if (e >= co) {
                    const t = Math.floor(e / co);
                    r += no(t.toString(), 2, "0") + "s", e %= co
                } else r += "00s";
                const n = 1 / this._fps;
                if (e >= n) {
                    const t = Math.round(e / n);
                    r += no(t.toString(), 2, "0") + "f", e %= n
                } else if (e / n > .98) {
                    r += no(1..toString(), 2, "0") + "f", e %= n
                } else r += "00f";
                return 0 === r.length ? "00s00f" : r
            }
            formatBasic(t) {
                return t.toFixed(2) + "s"
            }
        },
        co = 1,
        lo = 60 * co,
        ho = 60 * lo,
        po = {};

    function fo(t, e) {
        return t.length <= e ? t : t.substr(0, e - 3) + "..."
    }
    y(po, {
        boolean: () => xo,
        compound: () => Po,
        number: () => jo,
        rgba: () => Do,
        string: () => Eo,
        stringLiteral: () => Fo
    });
    var vo = t => "string" == typeof t ? `string("${fo(t,10)}")` : "number" == typeof t ? `number(${fo(String(t),10)})` : null === t ? "null" : void 0 === t ? "undefined" : "boolean" == typeof t ? String(t) : Array.isArray(t) ? "array" : "object" == typeof t ? "object" : "unknown";

    function go(t) {
        return v(f({}, t), {
            toString() {
                return function(t) {
                    return `#${(255*t.r|256).toString(16).slice(1)+(255*t.g|256).toString(16).slice(1)+(255*t.b|256).toString(16).slice(1)+(255*t.a|256).toString(16).slice(1)}`
                }(this)
            }
        })
    }

    function _o(t) {
        function e(t) {
            return t >= .04045 ? ((t + .055) / 1.055) ** 2.4 : t / 12.92
        }
        return {
            r: e(t.r),
            g: e(t.g),
            b: e(t.b),
            a: t.a
        }
    }

    function yo(t) {
        let e = .4122214708 * t.r + .5363325363 * t.g + .0514459929 * t.b,
            r = .2119034982 * t.r + .6806995451 * t.g + .1073969566 * t.b,
            n = .0883024619 * t.r + .2817188376 * t.g + .6299787005 * t.b,
            i = Math.cbrt(e),
            o = Math.cbrt(r),
            a = Math.cbrt(n);
        return {
            L: .2104542553 * i + .793617785 * o - .0040720468 * a,
            a: 1.9779984951 * i - 2.428592205 * o + .4505937099 * a,
            b: .0259040371 * i + .7827717662 * o - .808675766 * a,
            alpha: t.a
        }
    }
    var mo = Symbol("TheatrePropType_Basic");

    function bo(t) {
        return "object" == typeof t && !!t && "TheatrePropType" === t[mo]
    }

    function wo(t) {
        if ("number" == typeof t) return jo(t);
        if ("boolean" == typeof t) return xo(t);
        if ("string" == typeof t) return Eo(t);
        if ("object" == typeof t && t) {
            if (bo(t)) return t;
            if (an(t)) return Po(t);
            throw new ir(`This value is not a valid prop type: ${vo(t)}`)
        }
        throw new ir(`This value is not a valid prop type: ${vo(t)}`)
    }
    var Po = (t, e = {}) => {
            const r = function(t) {
                    const e = {};
                    for (const r of Object.keys(t)) {
                        const n = t[r];
                        bo(n) ? e[r] = n : e[r] = wo(n)
                    }
                    return e
                }(t),
                n = new WeakMap;
            return {
                type: "compound",
                props: r,
                valueType: null,
                [mo]: "TheatrePropType",
                label: e.label,
                default: Bi(r, (t => t.default)),
                deserializeAndSanitize: t => {
                    if ("object" != typeof t || !t) return;
                    if (n.has(t)) return n.get(t);
                    const e = {};
                    let i = !1;
                    for (const [n, o] of Object.entries(r))
                        if (Object.prototype.hasOwnProperty.call(t, n)) {
                            const r = o.deserializeAndSanitize(t[n]);
                            null != r && (i = !0, e[n] = r)
                        }
                    return n.set(t, e), i ? e : void 0
                }
            }
        },
        jo = (t, e = {}) => {
            var r;
            return v(f({
                type: "number",
                valueType: 0,
                default: t,
                [mo]: "TheatrePropType"
            }, e || {}), {
                label: e.label,
                nudgeFn: null != (r = e.nudgeFn) ? r : Vo,
                nudgeMultiplier: "number" == typeof e.nudgeMultiplier ? e.nudgeMultiplier : 1,
                interpolate: To,
                deserializeAndSanitize: Oo(e.range)
            })
        },
        Oo = t => t ? e => {
            if ("number" == typeof e && isFinite(e)) return Tn(e, t[0], t[1])
        } : So,
        So = t => "number" == typeof t && isFinite(t) ? t : void 0,
        To = (t, e, r) => t + r * (e - t),
        Do = (t = {
            r: 0,
            g: 0,
            b: 0,
            a: 1
        }, e = {}) => {
            const r = {};
            for (const n of ["r", "g", "b", "a"]) r[n] = Math.min(Math.max(t[n], 0), 1);
            return {
                type: "rgba",
                valueType: null,
                default: go(r),
                [mo]: "TheatrePropType",
                label: e.label,
                interpolate: Co,
                deserializeAndSanitize: ko
            }
        },
        ko = t => {
            if (!t) return;
            let e = !0;
            for (const n of ["r", "g", "b", "a"]) Object.prototype.hasOwnProperty.call(t, n) && "number" == typeof t[n] || (e = !1);
            if (!e) return;
            const r = {};
            for (const n of ["r", "g", "b", "a"]) r[n] = Math.min(Math.max(t[n], 0), 1);
            return go(r)
        },
        Co = (t, e, r) => {
            const n = yo(_o(t)),
                i = yo(_o(e));
            return go(function(t) {
                function e(t) {
                    return t >= .0031308 ? 1.055 * t ** (1 / 2.4) - .055 : 12.92 * t
                }
                return {
                    r: e(t.r),
                    g: e(t.g),
                    b: e(t.b),
                    a: t.a
                }
            }(function(t) {
                let e = t.L + .3963377774 * t.a + .2158037573 * t.b,
                    r = t.L - .1055613458 * t.a - .0638541728 * t.b,
                    n = t.L - .0894841775 * t.a - 1.291485548 * t.b,
                    i = e * e * e,
                    o = r * r * r,
                    a = n * n * n;
                return {
                    r: 4.0767416621 * i - 3.3077115913 * o + .2309699292 * a,
                    g: -1.2684380046 * i + 2.6097574011 * o - .3413193965 * a,
                    b: -.0041960863 * i - .7034186147 * o + 1.707614701 * a,
                    a: t.alpha
                }
            }({
                L: (1 - r) * n.L + r * i.L,
                a: (1 - r) * n.a + r * i.a,
                b: (1 - r) * n.b + r * i.b,
                alpha: (1 - r) * n.alpha + r * i.alpha
            })))
        },
        xo = (t, e = {}) => {
            var r;
            return {
                type: "boolean",
                default: t,
                valueType: null,
                [mo]: "TheatrePropType",
                label: e.label,
                interpolate: null != (r = e.interpolate) ? r : Io,
                deserializeAndSanitize: Ao
            }
        },
        Ao = t => "boolean" == typeof t ? t : void 0;

    function Io(t) {
        return t
    }
    var Eo = (t, e = {}) => {
        var r;
        return {
            type: "string",
            default: t,
            valueType: null,
            [mo]: "TheatrePropType",
            label: e.label,
            interpolate: null != (r = e.interpolate) ? r : Io,
            deserializeAndSanitize: Mo
        }
    };

    function Mo(t) {
        return "string" == typeof t ? t : void 0
    }

    function Fo(t, e, r = {}) {
        var n, i;
        return {
            type: "stringLiteral",
            default: t,
            valuesAndLabels: f({}, e),
            [mo]: "TheatrePropType",
            valueType: null,
            as: null != (n = r.as) ? n : "menu",
            label: r.label,
            interpolate: null != (i = r.interpolate) ? i : Io,
            deserializeAndSanitize(t) {
                if ("string" == typeof t) return Object.prototype.hasOwnProperty.call(e, t) ? t : void 0
            }
        }
    }
    var Vo = ({
        config: t,
        deltaX: e,
        deltaFraction: r,
        magnitude: n
    }) => {
        const {
            range: i
        } = t;
        return i ? r * (i[1] - i[0]) * n * t.nudgeMultiplier : e * n * t.nudgeMultiplier
    };

    function No(t, e) {
        return t.replace(/^[\s\/]*/, "").replace(/[\s\/]*$/, "").replace(/\s*\/\s*/g, " / ")
    }
    m(O());
    var Bo, Ro, zo = m(vt),
        Lo = m(vt),
        $o = m(vt),
        Uo = t => new Promise((e => setTimeout(e, t)));

    function qo(t) {
        for (var e = arguments.length, r = Array(e > 1 ? e - 1 : 0), n = 1; n < e; n++) r[n - 1] = arguments[n];
        throw Error("[Immer] minified error nr: " + t + (r.length ? " " + r.map((function(t) {
            return "'" + t + "'"
        })).join(",") : "") + ". Find the full error at: https://bit.ly/3cXEKWf")
    }

    function Ho(t) {
        return !!t && !!t[ka]
    }

    function Wo(t) {
        return !!t && (function(t) {
            if (!t || "object" != typeof t) return !1;
            var e = Object.getPrototypeOf(t);
            if (null === e) return !0;
            var r = Object.hasOwnProperty.call(e, "constructor") && e.constructor;
            return r === Object || "function" == typeof r && Function.toString.call(r) === Ca
        }(t) || Array.isArray(t) || !!t[Da] || !!t.constructor[Da] || Yo(t) || Zo(t))
    }

    function Go(t, e, r) {
        void 0 === r && (r = !1), 0 === Ko(t) ? (r ? Object.keys : xa)(t).forEach((function(n) {
            r && "symbol" == typeof n || e(n, t[n], t)
        })) : t.forEach((function(r, n) {
            return e(n, r, t)
        }))
    }

    function Ko(t) {
        var e = t[ka];
        return e ? e.i > 3 ? e.i - 4 : e.i : Array.isArray(t) ? 1 : Yo(t) ? 2 : Zo(t) ? 3 : 0
    }

    function Xo(t, e) {
        return 2 === Ko(t) ? t.has(e) : Object.prototype.hasOwnProperty.call(t, e)
    }

    function Jo(t, e, r) {
        var n = Ko(t);
        2 === n ? t.set(e, r) : 3 === n ? (t.delete(e), t.add(r)) : t[e] = r
    }

    function Yo(t) {
        return ja && t instanceof Map
    }

    function Zo(t) {
        return Oa && t instanceof Set
    }

    function Qo(t) {
        return t.o || t.t
    }

    function ta(t) {
        if (Array.isArray(t)) return Array.prototype.slice.call(t);
        var e = Aa(t);
        delete e[ka];
        for (var r = xa(e), n = 0; n < r.length; n++) {
            var i = r[n],
                o = e[i];
            !1 === o.writable && (o.writable = !0, o.configurable = !0), (o.get || o.set) && (e[i] = {
                configurable: !0,
                writable: !0,
                enumerable: o.enumerable,
                value: t[i]
            })
        }
        return Object.create(Object.getPrototypeOf(t), e)
    }

    function ea(t, e) {
        return void 0 === e && (e = !1), na(t) || Ho(t) || !Wo(t) || (Ko(t) > 1 && (t.set = t.add = t.clear = t.delete = ra), Object.freeze(t), e && Go(t, (function(t, e) {
            return ea(e, !0)
        }), !0)), t
    }

    function ra() {
        qo(2)
    }

    function na(t) {
        return null == t || "object" != typeof t || Object.isFrozen(t)
    }

    function ia(t) {
        var e = Ia[t];
        return e || qo(18, t), e
    }

    function oa() {
        return Ro
    }

    function aa(t, e) {
        e && (ia("Patches"), t.u = [], t.s = [], t.v = e)
    }

    function sa(t) {
        ua(t), t.p.forEach(la), t.p = null
    }

    function ua(t) {
        t === Ro && (Ro = t.l)
    }

    function ca(t) {
        return Ro = {
            p: [],
            l: Ro,
            h: t,
            m: !0,
            _: 0
        }
    }

    function la(t) {
        var e = t[ka];
        0 === e.i || 1 === e.i ? e.j() : e.O = !0
    }

    function ha(t, e) {
        e._ = e.p.length;
        var r = e.p[0],
            n = void 0 !== t && t !== r;
        return e.h.g || ia("ES5").S(e, t, n), n ? (r[ka].P && (sa(e), qo(4)), Wo(t) && (t = pa(e, t), e.l || fa(e, t)), e.u && ia("Patches").M(r[ka], t, e.u, e.s)) : t = pa(e, r, []), sa(e), e.u && e.v(e.u, e.s), t !== Ta ? t : void 0
    }

    function pa(t, e, r) {
        if (na(e)) return e;
        var n = e[ka];
        if (!n) return Go(e, (function(i, o) {
            return da(t, n, e, i, o, r)
        }), !0), e;
        if (n.A !== t) return e;
        if (!n.P) return fa(t, n.t, !0), n.t;
        if (!n.I) {
            n.I = !0, n.A._--;
            var i = 4 === n.i || 5 === n.i ? n.o = ta(n.k) : n.o;
            Go(3 === n.i ? new Set(i) : i, (function(e, o) {
                return da(t, n, i, e, o, r)
            })), fa(t, i, !1), r && t.u && ia("Patches").R(n, r, t.u, t.s)
        }
        return n.o
    }

    function da(t, e, r, n, i, o) {
        if (Ho(i)) {
            var a = pa(t, i, o && e && 3 !== e.i && !Xo(e.D, n) ? o.concat(n) : void 0);
            if (Jo(r, n, a), !Ho(a)) return;
            t.m = !1
        }
        if (Wo(i) && !na(i)) {
            if (!t.h.F && t._ < 1) return;
            pa(t, i), e && e.A.l || fa(t, i)
        }
    }

    function fa(t, e, r) {
        void 0 === r && (r = !1), t.h.F && t.m && ea(e, r)
    }

    function va(t, e) {
        var r = t[ka];
        return (r ? Qo(r) : t)[e]
    }

    function ga(t, e) {
        if (e in t)
            for (var r = Object.getPrototypeOf(t); r;) {
                var n = Object.getOwnPropertyDescriptor(r, e);
                if (n) return n;
                r = Object.getPrototypeOf(r)
            }
    }

    function _a(t) {
        t.P || (t.P = !0, t.l && _a(t.l))
    }

    function ya(t) {
        t.o || (t.o = ta(t.t))
    }

    function ma(t, e, r) {
        var n = Yo(e) ? ia("MapSet").N(e, r) : Zo(e) ? ia("MapSet").T(e, r) : t.g ? function(t, e) {
            var r = Array.isArray(t),
                n = {
                    i: r ? 1 : 0,
                    A: e ? e.A : oa(),
                    P: !1,
                    I: !1,
                    D: {},
                    l: e,
                    t: t,
                    k: null,
                    o: null,
                    j: null,
                    C: !1
                },
                i = n,
                o = Ea;
            r && (i = [n], o = Ma);
            var a = Proxy.revocable(i, o),
                s = a.revoke,
                u = a.proxy;
            return n.k = u, n.j = s, u
        }(e, r) : ia("ES5").J(e, r);
        return (r ? r.A : oa()).p.push(n), n
    }

    function ba(t) {
        return Ho(t) || qo(22, t),
            function t(e) {
                if (!Wo(e)) return e;
                var r, n = e[ka],
                    i = Ko(e);
                if (n) {
                    if (!n.P && (n.i < 4 || !ia("ES5").K(n))) return n.t;
                    n.I = !0, r = wa(e, i), n.I = !1
                } else r = wa(e, i);
                return Go(r, (function(e, i) {
                    n && function(t, e) {
                        return 2 === Ko(t) ? t.get(e) : t[e]
                    }(n.t, e) === i || Jo(r, e, t(i))
                })), 3 === i ? new Set(r) : r
            }(t)
    }

    function wa(t, e) {
        switch (e) {
            case 2:
                return new Map(t);
            case 3:
                return Array.from(t)
        }
        return ta(t)
    }
    var Pa = "undefined" != typeof Symbol && "symbol" == typeof Symbol("x"),
        ja = "undefined" != typeof Map,
        Oa = "undefined" != typeof Set,
        Sa = "undefined" != typeof Proxy && void 0 !== Proxy.revocable && "undefined" != typeof Reflect,
        Ta = Pa ? Symbol.for("immer-nothing") : ((Bo = {})["immer-nothing"] = !0, Bo),
        Da = Pa ? Symbol.for("immer-draftable") : "__$immer_draftable",
        ka = Pa ? Symbol.for("immer-state") : "__$immer_state",
        Ca = "" + Object.prototype.constructor,
        xa = "undefined" != typeof Reflect && Reflect.ownKeys ? Reflect.ownKeys : void 0 !== Object.getOwnPropertySymbols ? function(t) {
            return Object.getOwnPropertyNames(t).concat(Object.getOwnPropertySymbols(t))
        } : Object.getOwnPropertyNames,
        Aa = Object.getOwnPropertyDescriptors || function(t) {
            var e = {};
            return xa(t).forEach((function(r) {
                e[r] = Object.getOwnPropertyDescriptor(t, r)
            })), e
        },
        Ia = {},
        Ea = {
            get: function(t, e) {
                if (e === ka) return t;
                var r, n, i, o = Qo(t);
                if (!Xo(o, e)) return r = t, (i = ga(o, e)) ? "value" in i ? i.value : null === (n = i.get) || void 0 === n ? void 0 : n.call(r.k) : void 0;
                var a = o[e];
                return t.I || !Wo(a) ? a : a === va(t.t, e) ? (ya(t), t.o[e] = ma(t.A.h, a, t)) : a
            },
            has: function(t, e) {
                return e in Qo(t)
            },
            ownKeys: function(t) {
                return Reflect.ownKeys(Qo(t))
            },
            set: function(t, e, r) {
                var n = ga(Qo(t), e);
                if (null == n ? void 0 : n.set) return n.set.call(t.k, r), !0;
                if (!t.P) {
                    var i = va(Qo(t), e),
                        o = null == i ? void 0 : i[ka];
                    if (o && o.t === r) return t.o[e] = r, t.D[e] = !1, !0;
                    if (function(t, e) {
                            return t === e ? 0 !== t || 1 / t == 1 / e : t != t && e != e
                        }(r, i) && (void 0 !== r || Xo(t.t, e))) return !0;
                    ya(t), _a(t)
                }
                return t.o[e] === r && "number" != typeof r && (void 0 !== r || e in t.o) || (t.o[e] = r, t.D[e] = !0, !0)
            },
            deleteProperty: function(t, e) {
                return void 0 !== va(t.t, e) || e in t.t ? (t.D[e] = !1, ya(t), _a(t)) : delete t.D[e], t.o && delete t.o[e], !0
            },
            getOwnPropertyDescriptor: function(t, e) {
                var r = Qo(t),
                    n = Reflect.getOwnPropertyDescriptor(r, e);
                return n ? {
                    writable: !0,
                    configurable: 1 !== t.i || "length" !== e,
                    enumerable: n.enumerable,
                    value: r[e]
                } : n
            },
            defineProperty: function() {
                qo(11)
            },
            getPrototypeOf: function(t) {
                return Object.getPrototypeOf(t.t)
            },
            setPrototypeOf: function() {
                qo(12)
            }
        },
        Ma = {};
    Go(Ea, (function(t, e) {
        Ma[t] = function() {
            return arguments[0] = arguments[0][0], e.apply(this, arguments)
        }
    })), Ma.deleteProperty = function(t, e) {
        return Ea.deleteProperty.call(this, t[0], e)
    }, Ma.set = function(t, e, r) {
        return Ea.set.call(this, t[0], e, r, t[0])
    };
    var Fa = new(function() {
        function t(t) {
            var e = this;
            this.g = Sa, this.F = !0, this.produce = function(t, r, n) {
                if ("function" == typeof t && "function" != typeof r) {
                    var i = r;
                    r = t;
                    var o = e;
                    return function(t) {
                        var e = this;
                        void 0 === t && (t = i);
                        for (var n = arguments.length, a = Array(n > 1 ? n - 1 : 0), s = 1; s < n; s++) a[s - 1] = arguments[s];
                        return o.produce(t, (function(t) {
                            var n;
                            return (n = r).call.apply(n, [e, t].concat(a))
                        }))
                    }
                }
                var a;
                if ("function" != typeof r && qo(6), void 0 !== n && "function" != typeof n && qo(7), Wo(t)) {
                    var s = ca(e),
                        u = ma(e, t, void 0),
                        c = !0;
                    try {
                        a = r(u), c = !1
                    } finally {
                        c ? sa(s) : ua(s)
                    }
                    return "undefined" != typeof Promise && a instanceof Promise ? a.then((function(t) {
                        return aa(s, n), ha(t, s)
                    }), (function(t) {
                        throw sa(s), t
                    })) : (aa(s, n), ha(a, s))
                }
                if (!t || "object" != typeof t) {
                    if ((a = r(t)) === Ta) return;
                    return void 0 === a && (a = t), e.F && ea(a, !0), a
                }
                qo(21, t)
            }, this.produceWithPatches = function(t, r) {
                return "function" == typeof t ? function(r) {
                    for (var n = arguments.length, i = Array(n > 1 ? n - 1 : 0), o = 1; o < n; o++) i[o - 1] = arguments[o];
                    return e.produceWithPatches(r, (function(e) {
                        return t.apply(void 0, [e].concat(i))
                    }))
                } : [e.produce(t, r, (function(t, e) {
                    n = t, i = e
                })), n, i];
                var n, i
            }, "boolean" == typeof(null == t ? void 0 : t.useProxies) && this.setUseProxies(t.useProxies), "boolean" == typeof(null == t ? void 0 : t.autoFreeze) && this.setAutoFreeze(t.autoFreeze)
        }
        var e = t.prototype;
        return e.createDraft = function(t) {
            Wo(t) || qo(8), Ho(t) && (t = ba(t));
            var e = ca(this),
                r = ma(this, t, void 0);
            return r[ka].C = !0, ua(e), r
        }, e.finishDraft = function(t, e) {
            var r = (t && t[ka]).A;
            return aa(r, e), ha(void 0, r)
        }, e.setAutoFreeze = function(t) {
            this.F = t
        }, e.setUseProxies = function(t) {
            t && !Sa && qo(20), this.g = t
        }, e.applyPatches = function(t, e) {
            var r;
            for (r = e.length - 1; r >= 0; r--) {
                var n = e[r];
                if (0 === n.path.length && "replace" === n.op) {
                    t = n.value;
                    break
                }
            }
            var i = ia("Patches").$;
            return Ho(t) ? i(t, e) : this.produce(t, (function(t) {
                return i(t, e.slice(r + 1))
            }))
        }, t
    }());
    Fa.produce, Fa.produceWithPatches.bind(Fa), Fa.setAutoFreeze.bind(Fa), Fa.setUseProxies.bind(Fa), Fa.applyPatches.bind(Fa), Fa.createDraft.bind(Fa), Fa.finishDraft.bind(Fa);
    var Va = {
        currentProjectStateDefinitionVersion: "0.4.0"
    };
    async function Na(t, e, r) {
        await Uo(0), t.transaction((({
            drafts: t
        }) => {
            var n;
            const i = e.address.projectId;

            function o() {
                t.ephemeral.coreByProject[i].loadingState = {
                    type: "loaded"
                }
            }
            t.ephemeral.coreByProject[i] = {
                lastExportedObject: null,
                loadingState: {
                    type: "loading"
                }
            }, t.ahistoric.coreByProject[i] = {
                ahistoricStuff: ""
            };
            const a = null == (Ho(s = t.historic) || qo(23, s), n = s[ka].t) ? void 0 : n.coreByProject[e.address.projectId];
            var s, u, c;
            a ? r && -1 == a.revisionHistory.indexOf(r.revisionHistory[0]) ? (u = r, t.ephemeral.coreByProject[i].loadingState = {
                type: "browserStateIsNotBasedOnDiskState",
                onDiskState: u
            }) : o() : r ? (c = r, t.ephemeral.coreByProject[i].loadingState = {
                type: "loaded"
            }, t.historic.coreByProject[i] = c) : (t.ephemeral.coreByProject[i].loadingState = {
                type: "loaded"
            }, t.historic.coreByProject[i] = {
                sheetsById: {},
                definitionVersion: Va.currentProjectStateDefinitionVersion,
                revisionHistory: []
            })
        }))
    }

    function Ba() {}

    function Ra(t) {
        var e, r;
        const n = (null == (e = null == t ? void 0 : t.logging) ? void 0 : e.internal) ? null != (r = t.logging.min) ? r : Me.WARN : 1 / 0,
            i = n <= Me.DEBUG,
            o = n <= Me.ERROR,
            a = qe(void 0, {
                _debug: i ? console.debug.bind(console, "_coreLogger(TheatreInternalLogger) debug") : Ba,
                _error: o ? console.error.bind(console, "_coreLogger(TheatreInternalLogger) error") : Ba
            });
        if (t) {
            const {
                logger: e,
                logging: r
            } = t;
            e && a.configureLogger(e), r ? a.configureLogging(r) : a.configureLogging({
                dev: !1
            })
        }
        return a.getLogger().named("Theatre")
    }
    m(O());
    var za = m(vt),
        La = m(vt);

    function $a(t, e = {}) {
        const r = D.get(t);
        if (r) return r.publicApi;
        const n = Ra(e.experiments).named("Project", t);
        return e.state ? (Ua(t, e.state), n._debug("deep validated config.state on disk")) : n._debug("no config.state"), new class {
            get type() {
                return "Theatre_Project_PublicAPI"
            }
            constructor(t, e = {}) {
                x(this, new class {
                    constructor(t, e = {}, r) {
                        var n;
                        this.config = e, this.publicApi = r, b(this, "pointers"), b(this, "_pointerProxies"), b(this, "address"), b(this, "_readyDeferred"), b(this, "_sheetTemplates", new $o.Atom({})), b(this, "sheetTemplatesP", this._sheetTemplates.pointer), b(this, "_studio"), b(this, "type", "Theatre_Project"), b(this, "_logger"), this._logger = Ra(e.experiments).named("Project", t), this._logger.traceDev("creating project"), this.address = {
                            projectId: t
                        }, this._logger._kapow('this is a "kapow"');
                        const i = new $o.Atom({
                            ahistoric: {
                                ahistoricStuff: ""
                            },
                            historic: null != (n = e.state) ? n : {
                                sheetsById: {},
                                definitionVersion: Va.currentProjectStateDefinitionVersion,
                                revisionHistory: []
                            },
                            ephemeral: {
                                loadingState: {
                                    type: "loaded"
                                },
                                lastExportedObject: null
                            }
                        });
                        this._pointerProxies = {
                            historic: new Lo.PointerProxy(i.pointer.historic),
                            ahistoric: new Lo.PointerProxy(i.pointer.ahistoric),
                            ephemeral: new Lo.PointerProxy(i.pointer.ephemeral)
                        }, this.pointers = {
                            historic: this._pointerProxies.historic.pointer,
                            ahistoric: this._pointerProxies.ahistoric.pointer,
                            ephemeral: this._pointerProxies.ephemeral.pointer
                        }, D.add(t, this), this._readyDeferred = io(), e.state ? setTimeout((() => {
                            this._studio || (this._readyDeferred.resolve(void 0), this._logger._trace("ready deferred resolved with no state"))
                        }), 0) : setTimeout((() => {
                            if (!this._studio) throw new Error(`Argument config.state in Theatre.getProject("${t}", config) is empty. This is fine while you are using @theatre/core along with @theatre/sutdio. But since @theatre/studio is not loaded, the state of project "${t}" will be empty.\n\nTo fix this, you need to add @theatre/studio into the bundle and export the projet's state. Learn how to do that at https://docs.theatrejs.com/in-depth/#exporting`)
                        }), 1e3)
                    }
                    attachToStudio(t) {
                        if (this._studio) {
                            if (this._studio !== t) throw new Error(`Project ${this.address.projectId} is already attached to studio ${this._studio.address.studioId}`);
                            this._logger.warnDev(`Project ${this.address.projectId} is already attached to studio ${this._studio.address.studioId}`)
                        } else this._studio = t, t.initialized.then((async () => {
                            await Na(t, this, this.config.state), this._pointerProxies.historic.setPointer(t.atomP.historic.coreByProject[this.address.projectId]), this._pointerProxies.ahistoric.setPointer(t.atomP.ahistoric.coreByProject[this.address.projectId]), this._pointerProxies.ephemeral.setPointer(t.atomP.ephemeral.coreByProject[this.address.projectId]), this._readyDeferred.resolve(void 0)
                        }))
                    }
                    get isAttachedToStudio() {
                        return !!this._studio
                    }
                    get ready() {
                        return this._readyDeferred.promise
                    }
                    isReady() {
                        return "resolved" === this._readyDeferred.status
                    }
                    getOrCreateSheet(t, e = "default") {
                        let r = this._sheetTemplates.getState()[t];
                        return r || (r = new class {
                            constructor(t, e) {
                                this.project = t, b(this, "type", "Theatre_SheetTemplate"), b(this, "address"), b(this, "_instances", new rr.Atom({})), b(this, "instancesP", this._instances.pointer), b(this, "_objectTemplates", new rr.Atom({})), b(this, "objectTemplatesP", this._objectTemplates.pointer), this.address = v(f({}, t.address), {
                                    sheetId: e
                                })
                            }
                            getInstance(t) {
                                let e = this._instances.getState()[t];
                                return e || (e = new class {
                                    constructor(t, e) {
                                        this.template = t, this.instanceId = e, b(this, "_objects", new zo.Atom({})), b(this, "_sequence"), b(this, "address"), b(this, "publicApi"), b(this, "project"), b(this, "objectsP", this._objects.pointer), b(this, "type", "Theatre_Sheet"), b(this, "_logger"), this._logger = t.project._logger.named("Sheet", e), this._logger._trace("creating sheet"), this.project = t.project, this.address = v(f({}, t.address), {
                                            sheetInstanceId: this.instanceId
                                        }), this.publicApi = new class {
                                            get type() {
                                                return "Theatre_Sheet_PublicAPI"
                                            }
                                            constructor(t) {
                                                x(this, t)
                                            }
                                            object(t, e) {
                                                const r = C(this),
                                                    n = No(t),
                                                    i = r.getObject(n);
                                                if (i) return i.publicApi; {
                                                    const t = Po(e);
                                                    return r.createObject(n, null, t).publicApi
                                                }
                                            }
                                            get sequence() {
                                                return C(this).getSequence().publicApi
                                            }
                                            get project() {
                                                return C(this).project.publicApi
                                            }
                                            get address() {
                                                return f({}, C(this).address)
                                            }
                                        }(this)
                                    }
                                    createObject(t, e, r) {
                                        const n = this.template.getObjectTemplate(t, e, r).createInstance(this, e, r);
                                        return this._objects.setIn([t], n), n
                                    }
                                    getObject(t) {
                                        return this._objects.getState()[t]
                                    }
                                    getSequence() {
                                        if (!this._sequence) {
                                            const t = (0, zo.valueDerivation)(this.project.pointers.historic.sheetsById[this.address.sheetId].sequence.length).map((t => "number" == typeof t ? t : 10)),
                                                e = (0, zo.valueDerivation)(this.project.pointers.historic.sheetsById[this.address.sheetId].sequence.subUnitsPerUnit).map((t => "number" == typeof t ? t : 30));
                                            this._sequence = new class {
                                                constructor(t, e, r, n, i) {
                                                    this._project = t, this._sheet = e, this._lengthD = r, this._subUnitsPerUnitD = n, b(this, "address"), b(this, "publicApi"), b(this, "_playbackControllerBox"), b(this, "_statePointerDerivation"), b(this, "_positionD"), b(this, "_positionFormatterD"), b(this, "_playableRangeD"), b(this, "pointer", (0, or.pointer)({
                                                        root: this,
                                                        path: []
                                                    })), b(this, "$$isIdentityDerivationProvider", !0), b(this, "_logger"), b(this, "closestGridPosition", (t => {
                                                        const e = 1 / this.subUnitsPerUnit;
                                                        return parseFloat((Math.round(t / e) * e).toFixed(3))
                                                    })), this._logger = t._logger.named("Sheet", e.address.sheetId).named("Instance", e.address.sheetInstanceId), this.address = v(f({}, this._sheet.address), {
                                                        sequenceName: "default"
                                                    }), this.publicApi = new class {
                                                        get type() {
                                                            return "Theatre_Sequence_PublicAPI"
                                                        }
                                                        constructor(t) {
                                                            x(this, t)
                                                        }
                                                        play(t) {
                                                            const e = C(this);
                                                            if (e._project.isReady()) return e.play(t); {
                                                                const t = io();
                                                                return t.resolve(!0), t.promise
                                                            }
                                                        }
                                                        pause() {
                                                            C(this).pause()
                                                        }
                                                        get position() {
                                                            return C(this).position
                                                        }
                                                        set position(t) {
                                                            C(this).position = t
                                                        }
                                                        async attachAudio(t) {
                                                            const {
                                                                audioContext: e,
                                                                destinationNode: r,
                                                                decodedBuffer: n,
                                                                gainNode: i
                                                            } = await async function(t) {
                                                                function e() {
                                                                    if (t.audioContext) return Promise.resolve(t.audioContext);
                                                                    const e = new AudioContext;
                                                                    return "running" === e.state || "undefined" == typeof window ? Promise.resolve(e) : new Promise((t => {
                                                                        const r = () => {
                                                                                e.resume()
                                                                            },
                                                                            n = ["mousedown", "keydown", "touchstart"],
                                                                            i = {
                                                                                capture: !0,
                                                                                passive: !1
                                                                            };
                                                                        n.forEach((t => {
                                                                            window.addEventListener(t, r, i)
                                                                        })), e.addEventListener("statechange", (() => {
                                                                            "running" === e.state && (n.forEach((t => {
                                                                                window.removeEventListener(t, r, i)
                                                                            })), t(e))
                                                                        }))
                                                                    }))
                                                                }
                                                                async function r() {
                                                                    if (t.source instanceof AudioBuffer) return t.source;
                                                                    const e = io();
                                                                    if ("string" != typeof t.source) throw new Error("Error validating arguments to sequence.attachAudio(). args.source must either be a string or an instance of AudioBuffer.");
                                                                    let r, i, o;
                                                                    try {
                                                                        r = await fetch(t.source)
                                                                    } catch (a) {
                                                                        throw console.error(a), new Error(`Could not fetch '${t.source}'. Network error logged above.`)
                                                                    }
                                                                    try {
                                                                        i = await r.arrayBuffer()
                                                                    } catch (a) {
                                                                        throw console.error(a), new Error(`Could not read '${t.source}' as an arrayBuffer.`)
                                                                    }(await n).decodeAudioData(i, e.resolve, e.reject);
                                                                    try {
                                                                        o = await e.promise
                                                                    } catch (a) {
                                                                        throw console.error(a), new Error(`Could not decode ${t.source} as an audio file.`)
                                                                    }
                                                                    return o
                                                                }
                                                                const n = e(),
                                                                    i = r(),
                                                                    [o, a] = await Promise.all([n, i]),
                                                                    s = t.destinationNode || o.destination,
                                                                    u = o.createGain();
                                                                return u.connect(s), {
                                                                    audioContext: o,
                                                                    decodedBuffer: a,
                                                                    gainNode: u,
                                                                    destinationNode: s
                                                                }
                                                            }(t), o = new class {
                                                                constructor(t, e, r, n) {
                                                                    this._ticker = t, this._decodedBuffer = e, this._audioContext = r, this._nodeDestination = n, b(this, "_mainGain"), b(this, "_state", new so.Atom({
                                                                        position: 0,
                                                                        playing: !1
                                                                    })), b(this, "statePointer"), b(this, "_stopPlayCallback", oo), this.statePointer = this._state.pointer, this._mainGain = this._audioContext.createGain(), this._mainGain.connect(this._nodeDestination)
                                                                }
                                                                playDynamicRange(t) {
                                                                    throw new Error("Method not implemented.")
                                                                }
                                                                get _playing() {
                                                                    return this._state.getState().playing
                                                                }
                                                                set _playing(t) {
                                                                    this._state.setIn(["playing"], t)
                                                                }
                                                                destroy() {}
                                                                pause() {
                                                                    this._stopPlayCallback(), this._playing = !1, this._stopPlayCallback = oo
                                                                }
                                                                gotoPosition(t) {
                                                                    this._updatePositionInState(t)
                                                                }
                                                                _updatePositionInState(t) {
                                                                    this._state.reduceState(["position"], (() => t))
                                                                }
                                                                getCurrentPosition() {
                                                                    return this._state.getState().position
                                                                }
                                                                play(t, e, r, n) {
                                                                    this._playing && this.pause(), this._playing = !0;
                                                                    const i = this._ticker;
                                                                    let o = this.getCurrentPosition();
                                                                    const a = e[1] - e[0];
                                                                    if ("normal" !== n) throw new ir(`Audio-controlled sequences can only be played in the "normal" direction. '${n}' given.`);
                                                                    (o < e[0] || o > e[1] || o === e[1]) && this._updatePositionInState(e[0]), o = this.getCurrentPosition();
                                                                    const s = io(),
                                                                        u = this._audioContext.createBufferSource();
                                                                    u.buffer = this._decodedBuffer, u.connect(this._mainGain), u.playbackRate.value = r, t > 1e3 && (console.warn("Audio-controlled sequences cannot have an iterationCount larger than 1000. It has been clamped to 1000."), t = 1e3), t > 1 && (u.loop = !0, u.loopStart = e[0], u.loopEnd = e[1]);
                                                                    const c = i.time;
                                                                    let l = o - e[0];
                                                                    const h = a * t;
                                                                    u.start(0, o, h - l);
                                                                    const p = t => {
                                                                            const n = Math.max(t - c, 0) / 1e3,
                                                                                i = Math.min(n * r + l, h);
                                                                            if (i !== h) {
                                                                                let t = i / a % 1 * a;
                                                                                this._updatePositionInState(t + e[0]), f()
                                                                            } else this._updatePositionInState(e[1]), this._playing = !1, d(), s.resolve(!0)
                                                                        },
                                                                        d = () => {
                                                                            u.stop(), u.disconnect()
                                                                        };
                                                                    this._stopPlayCallback = () => {
                                                                        d(), i.offThisOrNextTick(p), i.offNextTick(p), this._playing && s.resolve(!1)
                                                                    };
                                                                    const f = () => i.onNextTick(p);
                                                                    return i.onThisOrNextTick(p), s.promise
                                                                }
                                                            }(Te, n, e, i);
                                                            return C(this).replacePlaybackController(o), {
                                                                audioContext: e,
                                                                destinationNode: r,
                                                                decodedBuffer: n,
                                                                gainNode: i
                                                            }
                                                        }
                                                        get pointer() {
                                                            return C(this).pointer
                                                        }
                                                    }(this), this._playbackControllerBox = new ar.Box(null != i ? i : new class {
                                                        constructor(t) {
                                                            this._ticker = t, b(this, "_stopPlayCallback", oo), b(this, "_state", new ao.Atom({
                                                                position: 0,
                                                                playing: !1
                                                            })), b(this, "statePointer"), this.statePointer = this._state.pointer
                                                        }
                                                        destroy() {}
                                                        pause() {
                                                            this._stopPlayCallback(), this.playing = !1, this._stopPlayCallback = oo
                                                        }
                                                        gotoPosition(t) {
                                                            this._updatePositionInState(t)
                                                        }
                                                        _updatePositionInState(t) {
                                                            this._state.reduceState(["position"], (() => t))
                                                        }
                                                        getCurrentPosition() {
                                                            return this._state.getState().position
                                                        }
                                                        get playing() {
                                                            return this._state.getState().playing
                                                        }
                                                        set playing(t) {
                                                            this._state.setIn(["playing"], t)
                                                        }
                                                        play(t, e, r, n) {
                                                            this.playing && this.pause(), this.playing = !0;
                                                            const i = this._ticker,
                                                                o = e[1] - e[0]; {
                                                                const t = this.getCurrentPosition();
                                                                t < e[0] || t > e[1] ? "normal" === n || "alternate" === n ? this._updatePositionInState(e[0]) : "reverse" !== n && "alternateReverse" !== n || this._updatePositionInState(e[1]) : "normal" === n || "alternate" === n ? t === e[1] && this._updatePositionInState(e[0]) : t === e[0] && this._updatePositionInState(e[1])
                                                            }
                                                            const a = io(),
                                                                s = i.time,
                                                                u = o * t;
                                                            let c = this.getCurrentPosition() - e[0];
                                                            "reverse" !== n && "alternateReverse" !== n || (c = e[1] - this.getCurrentPosition());
                                                            const l = i => {
                                                                const l = Math.max(i - s, 0) / 1e3,
                                                                    p = Math.min(l * r + c, u);
                                                                if (p !== u) {
                                                                    const t = Math.floor(p / o);
                                                                    let r = p / o % 1 * o;
                                                                    if ("normal" !== n)
                                                                        if ("reverse" === n) r = o - r;
                                                                        else {
                                                                            const e = t % 2 == 0;
                                                                            "alternate" === n ? e || (r = o - r) : e && (r = o - r)
                                                                        }
                                                                    this._updatePositionInState(r + e[0]), h()
                                                                } else {
                                                                    if ("normal" === n) this._updatePositionInState(e[1]);
                                                                    else if ("reverse" === n) this._updatePositionInState(e[0]);
                                                                    else {
                                                                        const r = (t - 1) % 2 == 0;
                                                                        "alternate" === n ? r ? this._updatePositionInState(e[1]) : this._updatePositionInState(e[0]) : r ? this._updatePositionInState(e[0]) : this._updatePositionInState(e[1])
                                                                    }
                                                                    this.playing = !1, a.resolve(!0)
                                                                }
                                                            };
                                                            this._stopPlayCallback = () => {
                                                                i.offThisOrNextTick(l), i.offNextTick(l), this.playing && a.resolve(!1)
                                                            };
                                                            const h = () => i.onNextTick(l);
                                                            return i.onThisOrNextTick(l), a.promise
                                                        }
                                                        playDynamicRange(t) {
                                                            this.playing && this.pause(), this.playing = !0;
                                                            const e = this._ticker,
                                                                r = io(),
                                                                n = t.keepHot();
                                                            r.promise.then(n, n);
                                                            let i = e.time;
                                                            const o = e => {
                                                                const r = Math.max(e - i, 0);
                                                                i = e;
                                                                const n = r / 1e3,
                                                                    o = this.getCurrentPosition(),
                                                                    s = t.getValue();
                                                                if (o < s[0] || o > s[1]) this.gotoPosition(s[0]);
                                                                else {
                                                                    let t = o + n;
                                                                    t > s[1] && (t = s[0] + (t - s[1])), this.gotoPosition(t)
                                                                }
                                                                a()
                                                            };
                                                            this._stopPlayCallback = () => {
                                                                e.offThisOrNextTick(o), e.offNextTick(o), r.resolve(!1)
                                                            };
                                                            const a = () => e.onNextTick(o);
                                                            return e.onThisOrNextTick(o), r.promise
                                                        }
                                                    }(Te)), this._statePointerDerivation = this._playbackControllerBox.derivation.map((t => t.statePointer)), this._positionD = this._statePointerDerivation.flatMap((t => (0, ar.valueDerivation)(t.position))), this._positionFormatterD = this._subUnitsPerUnitD.map((t => new uo(t)))
                                                }
                                                getIdentityDerivation(t) {
                                                    if (0 === t.length) return (0, ar.prism)((() => ({
                                                        length: (0, ar.val)(this.pointer.length),
                                                        playing: (0, ar.val)(this.pointer.playing),
                                                        position: (0, ar.val)(this.pointer.position)
                                                    })));
                                                    if (t.length > 1) return (0, ar.prism)((() => {}));
                                                    const [e] = t;
                                                    return "length" === e ? this._lengthD : "position" === e ? this._positionD : "playing" === e ? (0, ar.prism)((() => (0, ar.val)(this._statePointerDerivation.getValue().playing))) : (0, ar.prism)((() => {}))
                                                }
                                                get positionFormatter() {
                                                    return this._positionFormatterD.getValue()
                                                }
                                                get derivationToStatePointer() {
                                                    return this._statePointerDerivation
                                                }
                                                get length() {
                                                    return this._lengthD.getValue()
                                                }
                                                get positionDerivation() {
                                                    return this._positionD
                                                }
                                                get position() {
                                                    return this._playbackControllerBox.get().getCurrentPosition()
                                                }
                                                get subUnitsPerUnit() {
                                                    return this._subUnitsPerUnitD.getValue()
                                                }
                                                get positionSnappedToGrid() {
                                                    return this.closestGridPosition(this.position)
                                                }
                                                set position(t) {
                                                    let e = t;
                                                    this.pause(), e > this.length && (e = this.length);
                                                    const r = this.length;
                                                    this._playbackControllerBox.get().gotoPosition(e > r ? r : e)
                                                }
                                                getDurationCold() {
                                                    return this._lengthD.getValue()
                                                }
                                                get playing() {
                                                    return (0, ar.val)(this._playbackControllerBox.get().statePointer.playing)
                                                }
                                                _makeRangeFromSequenceTemplate() {
                                                    return (0, ar.prism)((() => [0, (0, ar.val)(this._lengthD)]))
                                                }
                                                playDynamicRange(t) {
                                                    return this._playbackControllerBox.get().playDynamicRange(t)
                                                }
                                                async play(t) {
                                                    const e = this.length,
                                                        r = t && t.range ? t.range : [0, e],
                                                        n = t && "number" == typeof t.iterationCount ? t.iterationCount : 1,
                                                        i = t && void 0 !== t.rate ? t.rate : 1,
                                                        o = t && t.direction ? t.direction : "normal";
                                                    return await this._play(n, [r[0], r[1]], i, o)
                                                }
                                                _play(t, e, r, n) {
                                                    return this._playbackControllerBox.get().play(t, e, r, n)
                                                }
                                                pause() {
                                                    this._playbackControllerBox.get().pause()
                                                }
                                                replacePlaybackController(t) {
                                                    this.pause();
                                                    const e = this._playbackControllerBox.get();
                                                    this._playbackControllerBox.set(t);
                                                    const r = e.getCurrentPosition();
                                                    e.destroy(), t.gotoPosition(r)
                                                }
                                            }(this.template.project, this, t, e)
                                        }
                                        return this._sequence
                                    }
                                }(this, t), this._instances.setIn([t], e)), e
                            }
                            getObjectTemplate(t, e, r) {
                                let n = this._objectTemplates.getState()[t];
                                return n || (n = new class {
                                    constructor(t, e, r, n) {
                                        this.sheetTemplate = t, b(this, "address"), b(this, "type", "Theatre_SheetObjectTemplate"), b(this, "_config"), b(this, "_cache", new oe), b(this, "project"), this.address = v(f({}, t.address), {
                                            objectKey: e
                                        }), this._config = new ae.Atom(n), this.project = t.project
                                    }
                                    get config() {
                                        return this._config.getState()
                                    }
                                    createInstance(t, e, r) {
                                        return this._config.setState(r), new class {
                                            constructor(t, e, r) {
                                                this.sheet = t, this.template = e, this.nativeObject = r, b(this, "$$isIdentityDerivationProvider", !0), b(this, "address"), b(this, "publicApi"), b(this, "_initialValue", new Se.Atom({})), b(this, "_cache", new oe), b(this, "_logger"), b(this, "_internalUtilCtx"), this._logger = t._logger.named("SheetObject", e.address.objectKey), this._logger._trace("creating object"), this._internalUtilCtx = {
                                                    logger: this._logger.utilFor.internal()
                                                }, this.address = v(f({}, e.address), {
                                                    sheetInstanceId: t.address.sheetInstanceId
                                                }), this.publicApi = new class {
                                                    constructor(t) {
                                                        b(this, "_cache", new oe), x(this, t)
                                                    }
                                                    get type() {
                                                        return "Theatre_SheetObject_PublicAPI"
                                                    }
                                                    get props() {
                                                        return C(this).propsP
                                                    }
                                                    get sheet() {
                                                        return C(this).sheet.publicApi
                                                    }
                                                    get project() {
                                                        return C(this).sheet.project.publicApi
                                                    }
                                                    get address() {
                                                        return f({}, C(this).address)
                                                    }
                                                    _valuesDerivation() {
                                                        return this._cache.get("onValuesChangeDerivation", (() => {
                                                            const t = C(this);
                                                            return (0, De.prism)((() => (0, De.val)(t.getValues().getValue())))
                                                        }))
                                                    }
                                                    onValuesChange(t) {
                                                        return this._valuesDerivation().tapImmediate(Te, t)
                                                    }
                                                    get value() {
                                                        return this._valuesDerivation().getValue()
                                                    }
                                                    set initialValue(t) {
                                                        C(this).setInitialValue(t)
                                                    }
                                                }(this)
                                            }
                                            get type() {
                                                return "Theatre_SheetObject"
                                            }
                                            getValues() {
                                                return this._cache.get("getValues()", (() => (0, Se.prism)((() => {
                                                    const t = Pe((0, Se.val)(this.template.getDefaultValues()), (0, Se.val)(this._initialValue.pointer), Se.prism.memo("withInitialCache", (() => new WeakMap), []));
                                                    let e, r = Pe(t, (0, Se.val)(this.template.getStaticValues()), Se.prism.memo("withStatics", (() => new WeakMap), [])); {
                                                        const t = Se.prism.memo("seq", (() => this.getSequencedValues()), []),
                                                            n = Se.prism.memo("withSeqsCache", (() => new WeakMap), []);
                                                        e = (0, Se.val)((0, Se.val)(t)), r = Pe(r, e, n)
                                                    }
                                                    return ((t, e) => {
                                                        const r = Oe.prism.memo(t, (() => new Oe.Atom(e)), []);
                                                        return r.setState(e), r
                                                    })("finalAtom", r).pointer
                                                }))))
                                            }
                                            getValueByPointer(t) {
                                                const e = (0, Se.val)(this.getValues()),
                                                    {
                                                        path: r
                                                    } = (0, Se.getPointerParts)(t);
                                                return (0, Se.val)(je(e, r))
                                            }
                                            getIdentityDerivation(t) {
                                                return (0, Se.prism)((() => {
                                                    const e = (0, Se.val)(this.getValues());
                                                    return (0, Se.val)(je(e, t))
                                                }))
                                            }
                                            getSequencedValues() {
                                                return (0, Se.prism)((() => {
                                                    const t = Se.prism.memo("tracksToProcess", (() => this.template.getArrayOfValidSequenceTracks()), []),
                                                        e = (0, Se.val)(t),
                                                        r = new Se.Atom({});
                                                    return Se.prism.effect("processTracks", (() => {
                                                        const t = [];
                                                        for (const {
                                                                trackId: n,
                                                                pathToProp: i
                                                            } of e) {
                                                            const e = this._trackIdToDerivation(n),
                                                                o = Ce(this.template.config, i),
                                                                a = o.deserializeAndSanitize,
                                                                s = o.interpolate,
                                                                u = () => {
                                                                    const t = e.getValue();
                                                                    if (!t) return r.setIn(i, void 0);
                                                                    const n = a(t.left),
                                                                        u = void 0 === n ? o.default : n;
                                                                    if (void 0 === t.right) return r.setIn(i, u);
                                                                    const c = a(t.right),
                                                                        l = void 0 === c ? o.default : c;
                                                                    return r.setIn(i, s(u, l, t.progression))
                                                                },
                                                                c = e.changesWithoutValues().tap(u);
                                                            u(), t.push(c)
                                                        }
                                                        return () => {
                                                            for (const e of t) e()
                                                        }
                                                    }), e), r.pointer
                                                }))
                                            }
                                            _trackIdToDerivation(t) {
                                                const e = this.template.project.pointers.historic.sheetsById[this.address.sheetId].sequence.tracksByObject[this.address.objectKey].trackData[t],
                                                    r = this.sheet.getSequence().positionDerivation;
                                                return me(this._internalUtilCtx, e, r)
                                            }
                                            get propsP() {
                                                return this._cache.get("propsP", (() => (0, Se.pointer)({
                                                    root: this,
                                                    path: []
                                                })))
                                            }
                                            validateValue(t, e) {}
                                            setInitialValue(t) {
                                                this.validateValue(this.propsP, t), this._initialValue.setState(t)
                                            }
                                        }(t, this, e)
                                    }
                                    overrideConfig(t) {
                                        this._config.setState(t)
                                    }
                                    getDefaultValues() {
                                        return this._cache.get("getDefaultValues()", (() => (0, ae.prism)((() => function(t) {
                                            return ge(t)
                                        }((0, ae.val)(this._config.pointer))))))
                                    }
                                    getStaticValues() {
                                        return this._cache.get("getDerivationOfStatics", (() => (0, ae.prism)((() => {
                                            var t;
                                            const e = this.sheetTemplate.project.pointers.historic.sheetsById[this.address.sheetId],
                                                r = null != (t = (0, ae.val)(e.staticOverrides.byObject[this.address.objectKey])) ? t : {};
                                            return (0, ae.val)(this._config.pointer).deserializeAndSanitize(r) || {}
                                        }))))
                                    }
                                    getArrayOfValidSequenceTracks() {
                                        return this._cache.get("getArrayOfValidSequenceTracks", (() => (0, ae.prism)((() => {
                                            const t = this.project.pointers.historic.sheetsById[this.address.sheetId],
                                                e = (0, ae.val)(t.sequence.tracksByObject[this.address.objectKey].trackIdByPropPath);
                                            if (!e) return A;
                                            const r = [];
                                            if (!e) return A;
                                            const n = Object.entries(e);
                                            for (const [o, a] of n) {
                                                const t = er(o);
                                                if (!t) continue;
                                                const e = Ce(this.config, t);
                                                e && !ke(e) && r.push({
                                                    pathToProp: t,
                                                    trackId: a
                                                })
                                            }
                                            const i = function(t) {
                                                const e = Ze.get(t);
                                                if (e) return e;
                                                const r = new Map;
                                                return Ze.set(t, r), Qe([], t, r), r
                                            }(this.config);
                                            return r.sort(((t, e) => {
                                                const r = t.pathToProp,
                                                    n = e.pathToProp;
                                                return i.get(JSON.stringify(r)) > i.get(JSON.stringify(n)) ? 1 : -1
                                            })), 0 === r.length ? A : r
                                        }))))
                                    }
                                    getMapOfValidSequenceTracks_forStudio() {
                                        return this._cache.get("getMapOfValidSequenceTracks_forStudio", (() => this.getArrayOfValidSequenceTracks().map((t => {
                                            let e = {};
                                            for (const {
                                                    pathToProp: r,
                                                    trackId: n
                                                } of t) fe(e, r, n);
                                            return e
                                        }))))
                                    }
                                    getDefaultsAtPointer(t) {
                                        const {
                                            path: e
                                        } = (0, ae.getPointerParts)(t);
                                        return function(t, e) {
                                            return 0 === e.length ? t : ie(t, e)
                                        }(this.getDefaultValues().getValue(), e)
                                    }
                                }(this, t, e, r), this._objectTemplates.setIn([t], n)), n
                            }
                        }(this, t), this._sheetTemplates.setIn([t], r)), r.getInstance(e)
                    }
                }(t, e, this))
            }
            get ready() {
                return C(this).ready
            }
            get isReady() {
                return C(this).isReady()
            }
            get address() {
                return f({}, C(this).address)
            }
            sheet(t, e = "default") {
                const r = No(t);
                return C(this).getOrCreateSheet(r, e).publicApi
            }
        }(t, e)
    }
    var Ua = (t, e) => {
        ((t, e) => {
            if (Array.isArray(e) || null == e || e.definitionVersion !== Va.currentProjectStateDefinitionVersion) throw new ir(`Error validating conf.state in Theatre.getProject(${JSON.stringify(t)}, conf). The state seems to be formatted in a way that is unreadable to Theatre.js. Read more at https://docs.theatrejs.com`)
        })(t, e)
    };

    function qa(t, e) {
        if ((0, za.isPointer)(t)) {
            return (0, La.valueDerivation)(t).tapImmediate(Te, e)
        }
        if ((0, La.isDerivation)(t)) return t.tapImmediate(Te, e);
        throw new Error("Called onChange(p) where p is neither a pointer nor a derivation.")
    }

    function Ha(t) {
        if ((0, za.isPointer)(t)) return (0, La.valueDerivation)(t).getValue();
        throw new Error("Called val(p) where p is not a pointer.")
    }
    var Wa = "__TheatreJS_CoreBundle";
    ! function() {
        if ("undefined" == typeof window) return;
        const t = window[Wa];
        if (void 0 !== t) throw "object" == typeof t && t && "string" == typeof t.version ? new Error("It seems that the module '@theatre/core' is loaded more than once. This could have two possible causes:\n1. You might have two separate versions of theatre in node_modules.\n2. Or this might be a bundling misconfiguration, in case you're using a bundler like Webpack/ESBuild/Rollup.\n\nNote that it **is okay** to import '@theatre/core' multiple times. But those imports should point to the same module.") : new Error(`The variable window.${Wa} seems to be already set by a module other than @theatre/core.`);
        const e = new class {
            constructor() {
                b(this, "_studio")
            }
            get type() {
                return "Theatre_CoreBundle"
            }
            get version() {
                return "0.5.0-rc.1"
            }
            getBitsForStudio(t, e) {
                if (this._studio) throw new Error("@theatre/core is already attached to @theatre/studio");
                this._studio = t, e({
                    projectsP: D.atom.pointer.projects,
                    privateAPI: C,
                    coreExports: S
                })
            }
        };
        window[Wa] = e;
        const r = window.__TheatreJS_StudioBundle;
        r && null !== r && "Theatre_StudioBundle" === r.type && r.registerCoreBundle(e)
    }
    /**
     * @license
     * Lodash (Custom Build) <https://lodash.com/>
     * Build: `lodash modularize exports="es" -o ./`
     * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
     * Released under MIT license <https://lodash.com/license>
     * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
     * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
     */
    ()
}(ft, ft.exports);
export {
    c as H, ht as a, e as b, t as c, ft as d, vt as e, r as g
};