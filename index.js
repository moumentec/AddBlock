document.write;
var loadToc, loadCategories, _toc = {
    init: function () {
        var cfg = {
                homePage: window.location.origin
                , maxResults: 10
                , numChars: 270
                , thumbWidth: 640
                , thumbHeight: 360
                , navText: "المزيد من المواضيع"
                , resetToc: "جميع المواضيع"
                , noImage: ""
                , loading: ""
                , counting: ""
                , searching: "<span>أبحث عن موضوع</span>"
            }
            , w = window
            , d = document
            , el = function (id) {
                return d.getElementById(id);
            }
            , o = {
                a: el('feed-order')
                , b: el('label-sorter')
                    .parentNode
                , c: el('post-searcher')
                , d: el('feed-q')
                , e: el('result-desc')
                , f: el('feed-container')
                , g: el('feed-nav')
                , h: d.getElementsByTagName('head')[0]
                , i: 0
                , j: null
                , k: 'published'
                , l: 0
                , m: ""
            }
            , fn = {
                a: function () {
                    old = el('temporer-script');
                    old.parentNode.removeChild(old);
                }
                , b: function (param) {
                    var script = d.createElement('script');
                    script.type = "text/javascript";
                    script.id = "temporer-script";
                    script.src = param;
                    if (el('temporer-script')) fn.a();
                    o.h.appendChild(script);
                }
                , c: function (mode, tag, order) {
                    o.i++;
                    o.e.innerHTML = cfg.counting;
                    o.g.innerHTML = cfg[mode == 1 ? "searching" : "loading"];
                    if (mode === 0) {
                        fn.b(tag !== null ? cfg.homePage + '/feeds/posts/summary/-/' + tag + '?alt=json-in-script&start-index=' + ((o.i * cfg.maxResults) + 1) + '&max-results=' + cfg.maxResults + '&orderby=' + order + '&callback=loadToc' : cfg.homePage + '/feeds/posts/summary?alt=json-in-script&start-index=' + ((o.i * cfg.maxResults) + 1) + '&max-results=' + cfg.maxResults + '&orderby=' + order + '&callback=loadToc');
                    } else if (mode == 1) {
                        fn.b(cfg.homePage + '/feeds/posts/summary?alt=json-in-script&start-index=' + ((o.i * cfg.maxResults) + 1) + '&max-results=' + cfg.maxResults + '&q=' + tag + '&orderby=' + order + '&callback=loadToc');
                    }
                    o.j = (tag !== null) ? tag : null;
                    o.l = mode;
                    o.a.disabled = true;
                    o.b.children[0].disabled = true;
                }
                , d: function (json) {
                    var _h;
                    o.g.innerHTML = "";
                    o.e.innerHTML = o.l == 1 ? '<span>نتائج البحث عن الكلمة الرئيسية<b>' + o.m + '</b> (' + json.feed.openSearch$totalResults.$t + ' النتائج)</span>' : 'المجموع :  ' + json.feed.openSearch$totalResults.$t + ' موضوع';
                    if ("entry" in json.feed) {
                        var a = json.feed.entry
                            , b, c, _d, e = "0 Komentar"
                            , f = ""
                            , g;
                        for (var i = 0; i < cfg.maxResults; i++) {
                            if (i == a.length) break;
                            b = a[i].title.$t;
                            _d = ("summary" in a[i]) ? a[i].summary.$t.replace(/<br ?\/?>/ig, " ")
                                .replace(/<(.*?)>/g, "")
                                .replace(/<iframe/ig, "")
                                .substring(0, cfg.numChars) : "";
                            g = ("media$thumbnail" in a[i]) ? a[i].media$thumbnail.url.replace(/.*?:\/\//g, "//")
                                .replace(/\/s[0-9]+\-c/, "\/s" + cfg.thumbWidth + "") : cfg.noImage.replace(/\/s[0-9]+\-c/, "\/s" + cfg.thumbWidth + "");
                            for (var j = 0, jen = a[i].link.length; j < jen; j++) {
                                c = (a[i].link[j].rel == "alternate") ? a[i].link[j].href : "#";
                            }
                            for (var k = 0, ken = a[i].link.length; k < ken; k++) {
                                if (a[i].link[k].rel == "replies" && a[i].link[k].type == "text/html") {
                                    e = a[i].link[k].title;
                                    break;
                                }
                            }
                            _h = d.createElement('li');
                            _h.innerHTML = '<div class="inner"><a class="toc-img" href="' + c + '" target="_blank" title="' + b + '"><img style="width:' + cfg.thumbWidth + 'px;height:' + cfg.thumbHeight + 'px;" src="' + g + '" alt="' + b + '"></a><a class="toc-title" href="' + c + '" target="_blank" title="' + b + '">' + b + '</a><div class="news-text">' + _d + '</div></div>';
                            o.f.appendChild(_h);
                        }
                        _h = d.createElement('a');
                        _h.href = '#load-more';
                        _h.innerHTML = cfg.navText;
                        _h.onclick = function () {
                            fn.c(o.l, o.j, o.k);
                            return false;
                        };
                    } else {
                        _h = d.createElement('a');
                        _h.href = '#reset-content';
                        _h.innerHTML = cfg.resetToc;
                        _h.onclick = function () {
                            o.i = -1;
                            o.e.innerHTML = cfg.counting;
                            o.f.innerHTML = "";
                            fn.c(0, null, 'published');
                            o.a.innerHTML = o.a.innerHTML;
                            o.b.children[0].innerHTML = o.b.children[0].innerHTML;
                            return false;
                        };
                    }
                    o.g.appendChild(_h);
                    o.a.disabled = false;
                    o.b.children[0].disabled = false;
                }
                , e: function (json) {
                    var a = json.feed.category
                        , b = '<select id="label-sorter"><option value="" selected disabled>الأقسام</option>';
                    for (var i = 0, len = a.length; i < len; i++) {
                        b += '<option value="' + encodeURIComponent(a[i].term) + '">' + a[i].term.toLowerCase() + '</option>';
                    }
                    b += '</select>';
                    o.b.innerHTML = b;
                    o.b.children[0].onchange = function () {
                        o.i = -1;
                        o.f.innerHTML = "";
                        o.g.innerHTML = cfg.loading;
                        fn.c(0, this.value, o.k);
                    };
                }
            };
        loadToc = fn.d;
        loadCategories = fn.e;
        fn.b(cfg.homePage + '/feeds/posts/summary?alt=json-in-script&start-index=' + (o.i + 1) + '&max-results=' + cfg.maxResults + '&orderby=published&callback=loadToc');
        fn.b(cfg.homePage + '/feeds/posts/summary?alt=json-in-script&max-results=0&orderby=published&callback=loadCategories');
        o.a.onchange = function () {
            o.i = -1;
            o.f.innerHTML = "";
            o.g.innerHTML = cfg.counting;
            o.b.children[0].innerHTML = o.b.children[0].innerHTML;
            fn.c(0, null, this.value);
            o.k = this.value;
        };
        o.c.onsubmit = function () {
            o.i = -1;
            o.f.innerHTML = "";
            o.m = o.d.value;
            fn.c(1, o.d.value, o.k);
            return false;
        };
    }
};
_toc.init();
