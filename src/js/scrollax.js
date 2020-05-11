if (
	navigator.platform.toUpperCase().indexOf('MAC') === -1 &&
	!navigator.userAgent.match(/(Android|iPod|iPhone|iPad|IEMobile|Opera Mini|BlackBerry)/) &&
	jQuery(window).width() > 991
) {
	function ssc_init() {
		if (!document.body) return;
		var e = document.body;
		var t = document.documentElement;
		var n = window.innerHeight;
		var r = e.scrollHeight;
		ssc_root = document.compatMode.indexOf('CSS') >= 0 ? t : e;
		ssc_activeElement = e;
		ssc_initdone = true;
		if (top != self) {
			ssc_frame = true;
		} else if (r > n && (e.offsetHeight <= n || t.offsetHeight <= n)) {
			ssc_root.style.height = 'auto';
			if (ssc_root.offsetHeight <= n) {
				var i = document.createElement('div');
				i.style.clear = 'both';
				e.appendChild(i);
			}
		}
		if (!ssc_fixedback) {
			e.style.backgroundAttachment = 'scroll';
			t.style.backgroundAttachment = 'scroll';
		}
		if (ssc_keyboardsupport) {
			ssc_addEvent('keydown', ssc_keydown);
		}
	}
	function ssc_scrollArray(e, t, n, r) {
		r || (r = 1e3);
		ssc_directionCheck(t, n);
		ssc_que.push({ x: t, y: n, lastX: t < 0 ? 0.99 : -0.99, lastY: n < 0 ? 0.99 : -0.99, start: +new Date() });
		if (ssc_pending) {
			return;
		}
		var i = function() {
			var s = +new Date();
			var o = 0;
			var u = 0;
			for (var a = 0; a < ssc_que.length; a++) {
				var f = ssc_que[a];
				var l = s - f.start;
				var c = l >= ssc_animtime;
				var h = c ? 1 : l / ssc_animtime;
				if (ssc_pulseAlgorithm) {
					h = ssc_pulse(h);
				}
				var p = (f.x * h - f.lastX) >> 0;
				var d = (f.y * h - f.lastY) >> 0;
				o += p;
				u += d;
				f.lastX += p;
				f.lastY += d;
				if (c) {
					ssc_que.splice(a, 1);
					a--;
				}
			}
			if (t) {
				var v = e.scrollLeft;
				e.scrollLeft += o;
				if (o && e.scrollLeft === v) {
					t = 0;
				}
			}
			if (n) {
				var m = e.scrollTop;
				e.scrollTop += u;
				if (u && e.scrollTop === m) {
					n = 0;
				}
			}
			if (!t && !n) {
				ssc_que = [];
			}
			if (ssc_que.length) {
				setTimeout(i, r / ssc_framerate + 1);
			} else {
				ssc_pending = false;
			}
		};
		setTimeout(i, 0);
		ssc_pending = true;
	}
	function ssc_wheel(e) {
		if (!ssc_initdone) {
			ssc_init();
		}
		var t = e.target;
		var n = ssc_overflowingAncestor(t);
		if (
			!n ||
			e.defaultPrevented ||
			ssc_isNodeName(ssc_activeElement, 'embed') ||
			(ssc_isNodeName(t, 'embed') && /\.pdf/i.test(t.src))
		) {
			return true;
		}
		var r = e.wheelDeltaX || 0;
		var i = e.wheelDeltaY || 0;
		if (!r && !i) {
			i = e.wheelDelta || 0;
		}
		if (Math.abs(r) > 1.2) {
			r *= ssc_stepsize / 120;
		}
		if (Math.abs(i) > 1.2) {
			i *= ssc_stepsize / 120;
		}
		ssc_scrollArray(n, -r, -i);
		e.preventDefault();
	}
	function ssc_keydown(e) {
		var t = e.target;
		var n = e.ctrlKey || e.altKey || e.metaKey;
		if (/input|textarea|embed/i.test(t.nodeName) || t.isContentEditable || e.defaultPrevented || n) {
			return true;
		}
		if (ssc_isNodeName(t, 'button') && e.keyCode === ssc_key.spacebar) {
			return true;
		}
		var r,
			i = 0,
			s = 0;
		var o = ssc_overflowingAncestor(ssc_activeElement);
		var u = o.clientHeight;
		if (o == document.body) {
			u = window.innerHeight;
		}
		switch (e.keyCode) {
			case ssc_key.up:
				s = -ssc_arrowscroll;
				break;
			case ssc_key.down:
				s = ssc_arrowscroll;
				break;
			case ssc_key.spacebar:
				r = e.shiftKey ? 1 : -1;
				s = -r * u * 0.9;
				break;
			case ssc_key.pageup:
				s = -u * 0.9;
				break;
			case ssc_key.pagedown:
				s = u * 0.9;
				break;
			case ssc_key.home:
				s = -o.scrollTop;
				break;
			case ssc_key.end:
				var a = o.scrollHeight - o.scrollTop - u;
				s = a > 0 ? a + 10 : 0;
				break;
			case ssc_key.left:
				i = -ssc_arrowscroll;
				break;
			case ssc_key.right:
				i = ssc_arrowscroll;
				break;
			default:
				return true;
		}
		ssc_scrollArray(o, i, s);
		e.preventDefault();
	}
	function ssc_mousedown(e) {
		ssc_activeElement = e.target;
	}
	function ssc_setCache(e, t) {
		for (var n = e.length; n--; ) ssc_cache[ssc_uniqueID(e[n])] = t;
		return t;
	}
	function ssc_overflowingAncestor(e) {
		var t = [];
		var n = ssc_root.scrollHeight;
		do {
			var r = ssc_cache[ssc_uniqueID(e)];
			if (r) {
				return ssc_setCache(t, r);
			}
			t.push(e);
			if (n === e.scrollHeight) {
				if (!ssc_frame || ssc_root.clientHeight + 10 < n) {
					return ssc_setCache(t, document.body);
				}
			} else if (e.clientHeight + 10 < e.scrollHeight) {
				overflow = getComputedStyle(e, '').getPropertyValue('overflow');
				if (overflow === 'scroll' || overflow === 'auto') {
					return ssc_setCache(t, e);
				}
			}
		} while ((e = e.parentNode));
	}
	function ssc_addEvent(e, t, n) {
		window.addEventListener(e, t, n || false);
	}
	function ssc_removeEvent(e, t, n) {
		window.removeEventListener(e, t, n || false);
	}
	function ssc_isNodeName(e, t) {
		return e.nodeName.toLowerCase() === t.toLowerCase();
	}
	function ssc_directionCheck(e, t) {
		e = e > 0 ? 1 : -1;
		t = t > 0 ? 1 : -1;
		if (ssc_direction.x !== e || ssc_direction.y !== t) {
			ssc_direction.x = e;
			ssc_direction.y = t;
			ssc_que = [];
		}
	}
	function ssc_pulse_(e) {
		var t, n, r;
		e = e * ssc_pulseScale;
		if (e < 1) {
			t = e - (1 - Math.exp(-e));
		} else {
			n = Math.exp(-1);
			e -= 1;
			r = 1 - Math.exp(-e);
			t = n + r * (1 - n);
		}
		return t * ssc_pulseNormalize;
	}
	function ssc_pulse(e) {
		if (e >= 1) return 1;
		if (e <= 0) return 0;
		if (ssc_pulseNormalize == 1) {
			ssc_pulseNormalize /= ssc_pulse_(1);
		}
		return ssc_pulse_(e);
	}
	var ssc_framerate = 150;
	var ssc_animtime = 500;
	var ssc_stepsize = 150;
	var ssc_pulseAlgorithm = true;
	var ssc_pulseScale = 6;
	var ssc_pulseNormalize = 1;
	var ssc_keyboardsupport = true;
	var ssc_arrowscroll = 50;
	var ssc_frame = false;
	var ssc_direction = { x: 0, y: 0 };
	var ssc_initdone = false;
	var ssc_fixedback = true;
	var ssc_root = document.documentElement;
	var ssc_activeElement;
	var ssc_key = { left: 37, up: 38, right: 39, down: 40, spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36 };
	var ssc_que = [];
	var ssc_pending = false;
	var ssc_cache = {};
	setInterval(function() {
		ssc_cache = {};
	}, 10 * 1e3);
	var ssc_uniqueID = (function() {
		var e = 0;
		return function(t) {
			return t.ssc_uniqueID || (t.ssc_uniqueID = e++);
		};
	})();
	var ischrome = /chrome/.test(navigator.userAgent.toLowerCase());
	if (ischrome) {
		ssc_addEvent('mousedown', ssc_mousedown);
		ssc_addEvent('mousewheel', ssc_wheel);
		ssc_addEvent('load', ssc_init);
	}
}
(function(e) {
	'function' === typeof define && define.amd
		? define([ 'jquery' ], e)
		: 'undefined' !== typeof exports ? (module.exports = e(require('jquery'))) : e(jQuery);
})(function(e) {
	function W(a) {
		if (console && console.warn) console.warn('Scrollax: ' + a);
		else throw 'Scrollax: ' + a;
	}
	function ka(a) {
		var g = !!('pageYOffset' in a);
		return {
			width: g
				? window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
				: a.offsetWidth,
			height: g
				? window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
				: a.offsetHeight,
			left: a[g ? 'pageXOffset' : 'scrollLeft'],
			top: a[g ? 'pageYOffset' : 'scrollTop']
		};
	}
	function X(a) {
		return ((a = a.data('scrollax')) && eval('({' + a + '})')) || {};
	}
	function Y(a) {
		var g, c;
		return !!(
			a &&
			'object' === typeof a &&
			'object' === typeof a.window &&
			a.window == a &&
			a.setTimeout &&
			a.alert &&
			(g = a.document) &&
			'object' === typeof g &&
			(c = g.defaultView || g.parentWindow) &&
			'object' === typeof c &&
			c == a
		);
	}
	var v = Array.prototype,
		C = v.push,
		Z = v.splice,
		aa = Object.prototype.hasOwnProperty,
		la = /[-+]?\d+(\.\d+)?/g,
		ma = 'translateX translateY rotate rotateX rotateY rotateZ skewX skewY scaleX scaleY'.split(' '),
		ba = e(window),
		ca = e(document.body),
		da,
		ea,
		L,
		M,
		N,
		q = function(a, g, c) {
			function k() {
				O = fa ? ca.find(ga) : P.find(ga);
				x.length = 0;
				r = !!t.horizontal;
				O.each(na);
				d();
				t.performanceTrick && (F = fa ? ca : P);
				u('load');
				return f;
			}
			function l() {
				G && (G = clearTimeout(G));
				G = setTimeout(function() {
					f.reload();
				});
			}
			function d() {
				var ha = x.length;
				t.performanceTrick &&
					F &&
					(clearTimeout(ia),
					Q || (F.addClass('scrollax-performance'), (Q = !0)),
					(ia = setTimeout(function() {
						F.removeClass('scrollax-performance');
						Q = !1;
					}, 100)));
				if (ha) {
					H = ka(a);
					for (var c = 0; c < ha; c++)
						(I = x[c]),
							(y = L(I.element, a)),
							0 > y[r ? 'right' : 'bottom'] ||
								y[r ? 'left' : 'top'] > H[r ? 'width' : 'height'] ||
								((ja = I.options),
								(R = ja.offset || t.offset || 0),
								(J = y[r ? 'right' : 'bottom']),
								(z = y[r ? 'width' : 'height']),
								(A = (z - J + R) / z),
								0 > A &&
									((J = y[r ? 'left' : 'top']),
									(z = H[r ? 'width' : 'height']),
									(A = -1 + (z - J + R) / z)),
								1 < A || -1 > A || b(I, A, r));
					u('scroll', H);
				}
			}
			function b(a, b) {
				S = a.parallaxElements;
				var c = S.length;
				if (c)
					for (var f = 0; f < c; f++) {
						T = S[f];
						var g = (oa = T.element),
							d = b;
						U = T.properties || (r ? { translateX: '100%' } : { translateY: '100%' });
						D = '';
						for (B in U) {
							n = U[B];
							if ('number' === typeof n) n *= d;
							else if ('string' === typeof n)
								for (K = n.match(la), m = 0, E = K.length; m < E; m++)
									n = n.replace(K[m], parseFloat(K[m] * d));
							if (-1 !== e.inArray(B, ma)) D += B + '(' + n + ')';
							else {
								var k = g.style,
									l = B,
									h;
								'opacity' === B
									? ((h = 0 > d ? 1 + n : 1 - n), (h = 0 > h ? 0 : 1 < h ? 1 : h))
									: (h = n);
								k[l] = h;
							}
						}
						D && (g.style[da] = ea + D);
					}
			}
			function pa(a) {
				return 'undefined' !== typeof a
					? ('number' !== typeof a && 'string' !== typeof a) || '' === a || isNaN(a)
						? O.index(a)
						: 0 <= a && a < x.length ? a : -1
					: -1;
			}
			function u(a, b) {
				if (h[a]) {
					E = h[a].length;
					for (m = V.length = 0; m < E; m++) C.call(V, h[a][m]);
					for (m = 0; m < E; m++) V[m].call(f, a, b);
				}
			}
			function p(a, b) {
				for (var c = 0, f = h[a].length; c < f; c++) if (h[a][c] === b) return c;
				return -1;
			}
			var f = this,
				P = (a && e(a).eq(0)) || ba,
				w = q.instances,
				v = null;
			a = P[0];
			e.each(w, function(b, c) {
				b && b.frame === a && (v = !0);
			});
			if (!a || v)
				v
					? W('Scrollax: Scrollax has been initialized for this frame!')
					: W('Scrollax: Frame is not available!');
			else {
				var t = e.extend({}, q.defaults, g),
					x = [],
					O = null,
					ga = t.parentSelector || '[data-scrollax-parent]',
					qa = t.elementsSelector || '[data-scrollax]',
					h = {},
					V = [],
					G,
					fa = Y(a),
					m,
					E,
					F,
					ia,
					Q,
					H,
					r,
					R,
					y,
					I,
					ja,
					A,
					J,
					z,
					S,
					T,
					oa,
					U,
					B,
					n,
					D,
					K;
				f.frame = a;
				f.options = t;
				f.parents = x;
				f.initialized = !1;
				f.reload = k;
				var na = function(a, b) {
					var c = e(b),
						f = X(e(b)),
						d = {};
					d.element = b;
					d.options = f;
					d.parallaxElements = [];
					c.find(qa).each(function(a, b) {
						var c = X(e(b));
						c.element = b;
						C.call(d.parallaxElements, c);
					});
					C.call(x, d);
				};
				f.scroll = d;
				f.getIndex = pa;
				f.one = function(a, b) {
					function c() {
						b.apply(f, arguments);
						f.off(a, c);
					}
					f.on(a, c);
					return f;
				};
				f.on = function(a, b) {
					if ('object' === typeof a)
						for (var c in a) {
							if (aa.call(a, c)) f.on(c, a[c]);
						}
					else if ('function' === typeof b) {
						c = a.split(' ');
						for (var d = 0, g = c.length; d < g; d++)
							(h[c[d]] = h[c[d]] || []), -1 === p(c[d], b) && C.call(h[c[d]], b);
					} else if ('array' === typeof b) for (c = 0, d = b.length; c < d; c++) f.on(a, b[c]);
					return f;
				};
				f.off = function(a, c) {
					if (c instanceof Array) for (var b = 0, d = c.length; b < d; b++) f.off(a, c[b]);
					else
						for (var b = a.split(' '), d = 0, g = b.length; d < g; d++)
							if (((h[b[d]] = h[b[d]] || []), 'undefined' === typeof c)) h[b[d]].length = 0;
							else {
								var k = p(b[d], c);
								-1 !== k && Z.call(h[b[d]], k, 1);
							}
					return f;
				};
				f.set = function(a, b) {
					e.isPlainObject(a) ? e.extend(t, a) : aa.call(t, a) && (t[a] = b);
					k();
					return f;
				};
				f.destroy = function() {
					N(window, 'resize', l);
					N(a, 'scroll', d);
					e.each(w, function(b, c) {
						b && b.frame === a && Z.call(q.instances, c, 1);
					});
					x.length = 0;
					f.initialized = !1;
					u('destroy');
					return f;
				};
				f.init = function() {
					if (!f.initialized)
						return (
							f.on(c),
							k(),
							M(window, 'resize', l),
							M(a, 'scroll', d),
							C.call(q.instances, f),
							(f.initialized = !0),
							u('initialized'),
							f
						);
				};
			}
		};
	q.instances = [];
	(function() {
		var a, g, c, k, l, d, b, e;
		L = function(u, p) {
			g = u.ownerDocument || u;
			c = g.documentElement;
			k = Y(p) ? p : g.defaultView || window;
			p = p && p !== g ? p : c;
			l = (k.pageYOffset || c.scrollTop) - c.clientTop;
			d = (k.pageXOffset || c.scrollLeft) - c.clientLeft;
			b = { top: 0, left: 0 };
			if (u && u.getBoundingClientRect) {
				var f = {},
					q = u.getBoundingClientRect();
				for (a in q) f[a] = q[a];
				b = f;
				b.width = b.right - b.left;
				b.height = b.bottom - b.top;
			} else return null;
			if (p === k) return b;
			b.top += l;
			b.left += d;
			b.right += d;
			b.bottom += l;
			if (p === c) return b;
			e = L(p);
			b.left -= e.left;
			b.right -= e.left;
			b.top -= e.top;
			b.bottom -= e.top;
			return b;
		};
	})();
	(function() {
		function a() {
			this.returnValue = !1;
		}
		function g() {
			this.cancelBubble = !0;
		}
		M = window.addEventListener
			? function(a, g, e, d) {
					a.addEventListener(g, e, d || !1);
					return e;
				}
			: function(c, e, l) {
					var d = e + l;
					c[d] =
						c[d] ||
						function() {
							var b = window.event;
							b.target = b.srcElement;
							b.preventDefault = a;
							b.stopPropagation = g;
							l.call(c, b);
						};
					c.attachEvent('on' + e, c[d]);
					return l;
				};
		N = window.removeEventListener
			? function(a, g, e, d) {
					a.removeEventListener(g, e, d || !1);
					return e;
				}
			: function(a, g, e) {
					var d = g + e;
					a.detachEvent('on' + g, a[d]);
					try {
						delete a[d];
					} catch (b) {
						a[d] = void 0;
					}
					return e;
				};
	})();
	(function() {
		function a(a) {
			for (var e = 0, d = g.length; e < d; e++) {
				var b = g[e] ? g[e] + a.charAt(0).toUpperCase() + a.slice(1) : a;
				if (null != c.style[b]) return b;
			}
		}
		var g = [ '', 'webkit', 'moz', 'ms', 'o' ],
			c = document.createElement('div');
		da = a('transform');
		ea = a('perspective') ? 'translateZ(0) ' : '';
	})();
	q.defaults = { horizontal: !1, offset: 0, parentSelector: null, elementsSelector: null, performanceTrick: !1 };
	window.Scrollax = q;
	e.fn.Scrollax = function(a, g) {
		var c, k;
		if (!e.isPlainObject(a)) {
			if ('string' === typeof a || !1 === a) (c = !1 === a ? 'destroy' : a), (k = slice.call(arguments, 1));
			a = {};
		}
		return this.each(function(l, d) {
			var b = e.data(d, 'scrollax');
			b || c ? b && c && b[c] && b[c].apply(b, k) : e.data(d, 'scrollax', new q(d, a, g).init());
		});
	};
	e.Scrollax = function(a, e) {
		ba.Scrollax(a, e);
	};
	var v = document.head || document.getElementsByTagName('head')[0],
		w = document.createElement('style');
	w.type = 'text/css';
	w.styleSheet
		? (w.styleSheet.cssText =
				'.scrollax-performance, .scrollax-performance *, .scrollax-performance *:before, .scrollax-performance *:after { pointer-events: none !important; -webkit-animation-play-state: paused !important; animation-play-state: paused !important; };')
		: w.appendChild(
				document.createTextNode(
					'.scrollax-performance, .scrollax-performance *, .scrollax-performance *:before, .scrollax-performance *:after { pointer-events: none !important; -webkit-animation-play-state: paused !important; animation-play-state: paused !important; };'
				)
			);
	v.appendChild(w);
	return q;
});
