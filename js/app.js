/*!========================================================================
 *  hexo-theme-snippet: app.js v1.0.0
 * ======================================================================== */
// window.onload = function() {
    var $body = document.body,
        $mnav = document.getElementById("mnav"), //获取导航三角图标
        $mainMenu = document.getElementById("main-menu"), //手机导航
        $process = document.getElementById('process'), //进度条
        $ajaxImgs = document.querySelectorAll('.img-ajax'), //图片懒加载
        $commentsCounter = document.getElementById('comments-count'),
        $gitcomment = document.getElementById("gitcomment"),
        $backToTop = document.getElementById("back-to-top"),
        $toc = document.getElementById("article-toc"),
        $mainNavigation = document.querySelector(".main-navigation"),
        timer = null;

    //设备判断
    var isPC = true;
    (function(designPercent) {
        function params(u, p) {
            var m = new RegExp("(?:&|/?)" + p + "=([^&$]+)").exec(u);
            return m ? m[1] : '';
        }
        if (/iphone|ios|android|ipod/i.test(navigator.userAgent.toLowerCase()) == true && params(location.search, "from") != "mobile") {
            isPC = false;
        }
    })();

    //手机菜单导航
    $mnav.onclick = function() {
        var navOpen = $mainMenu.getAttribute("class");
        if (navOpen.indexOf("in") != '-1') {
            $mainMenu.setAttribute("class", "collapse navbar-collapse");
        } else {
            $mainMenu.setAttribute("class", "collapse navbar-collapse in");
        }
    };

    //首页文章图片懒加载
    function imgsAjax($targetEles) {
        if (!$targetEles) return;
        var _length = $targetEles.length;
        if (_length > 0) {
            var scrollBottom = getScrollTop() + window.innerHeight;
            for (var i = 0; i < _length; i++) {
                (function(index) {
                    var $this = $targetEles[index];
                    var $this_offsetZero = $this.getBoundingClientRect().top + window.pageYOffset - document.documentElement.clientTop;
                    if (scrollBottom >= $this_offsetZero && $this.getAttribute('data-src') && $this.getAttribute('data-src').length > 0) {
                        if ($this.nodeName.toLowerCase() === 'img') {
                            $this.src = $this.getAttribute('data-src');
                            $this.style.display = 'block';
                        } else {
                            var imgObj = new Image();
                            imgObj.onload = function() {
                                $this.innerHTML = "";
                            };
                            imgObj.src = $this.getAttribute('data-src');
                            $this.style.backgroundImage = "url(" + $this.getAttribute('data-src') + ")";
                        }
                        $this.removeAttribute('data-src'); //为了优化，移除
                    }
                })(i);
            }
        }
    }

    //获取滚动高度
    function getScrollTop() {
        return ($body.scrollTop || document.documentElement.scrollTop);
    }
    //滚动回调
    var scrollCallback = function() {
        if ($process) {
            $process.style.width = (getScrollTop() / ($body.scrollHeight - window.innerHeight)) * 100 + "%";
        }
        (isPC && getScrollTop() >= 300) ? $backToTop.removeAttribute("class", "hide"): $backToTop.setAttribute("class", "hide");
        imgsAjax($ajaxImgs);
    };
    scrollCallback();

    var fixToc = function () {
        if ($toc) {
            // var top = $toc.offsetTop;
            // var left = $toc.offsetLeft;
            // var width = $toc.offsetWidth;
            // if (getScrollTop() <= top) {
            //     $toc.style = "";
            // } else {
            //     $toc.style.position = "fixed";
            //     $toc.style.top = top + 'px';
            //     $toc.style.left = left + "px";
            //     $toc.style.width = width + "px"
            // }
            var google_banner_ads = document.querySelector('.google-auto-placed');
            var google_banner_ads_height = 0;
            if (google_banner_ads) google_banner_ads_height = google_banner_ads.offsetHeight;
            var top = $mainNavigation.offsetTop + $mainNavigation.offsetHeight + google_banner_ads_height + 30;
            if (getScrollTop() - top >= 0 && window.innerWidth > 990) {
                $toc.style.top = getScrollTop() - top + 'px';
            }else {
                $toc.style = "";
            }
        }
    }
    // 刷新进入无法自动显示右侧导航栏的bug
    document.onreadystatechange = fixToc;
    //监听滚动事件
    window.addEventListener('scroll', function() {
        fixToc();
        clearTimeout(timer);
        timer = setTimeout(function fn() {
            scrollCallback();
            // 侧边栏定位
            var titles = document.querySelectorAll('.post-body.post-content h1,.post-body.post-content h2,.post-body.post-content h3,.post-body.post-content h4,.post-body.post-content h5,.post-body.post-content h6');
            titles = Array.prototype.slice.call(titles).reverse();
            history.replaceState(null, '', location.href.replace(location.hash, ''));
            for (item of titles) {
                // console.log(item);
                document.querySelectorAll(`.toc a.toc-link`).forEach(i => {
                    i.removeAttribute('style');
                });
                if ((getScrollTop() - item.offsetTop) > 100) {
                    // console.log(`.toc a[href="#${item.getAttribute('id')}"]`);
                    // 记录当前位置
                    history.replaceState(null, '', location.href.replace(location.hash, '') + '#' + item.getAttribute('id'));
                    var right_current = document.querySelector(`.toc a.toc-link[href="#${item.getAttribute('id')}"]`);
                    right_current.setAttribute('style', 'color: #0cc4f8;');
                    break;
                }
            }
            // 导航栏滚动条定位
            var right_to = (right_current.offsetTop || 0) - 200;
            document.querySelector('#article-toc .widget .title + .toc').scrollTop = right_to;
        }, 100);
    });

    //返回顶部
    $backToTop.onclick = function() {
        cancelAnimationFrame(timer);
        timer = requestAnimationFrame(function fn() {
            var sTop = getScrollTop();
            if (sTop > 0) {
                $body.scrollTop = document.documentElement.scrollTop = sTop - 50;
                timer = requestAnimationFrame(fn);
            } else {
                cancelAnimationFrame(timer);
            }
        });
    };
// };

// 右键复制代码
document.addEventListener('contextmenu', function (event) {
    if (event.target.parentElement.className == 'code') {
        var target = event.target;
        var input_temp = document.createElement('textarea');
        input_temp.setAttribute('style', 'display: absolute;top:-100px;');
        input_temp.innerHTML = target.innerText;
        document.body.append(input_temp);
        input_temp.select();
        document.execCommand('copy');
        input_temp.remove();
        event.stopPropagation();
        event.preventDefault();
        return false;
    }
});

// 分页按钮ejs的bug???
var prev_btn = document.querySelector('.extend.prev');
if (prev_btn) prev_btn.innerHTML = prev_btn.innerText;
var next_btn = document.querySelector('.extend.next');
if (next_btn) next_btn.innerHTML = next_btn.innerText;

// banner效果
/* var movementStrength = 25;
var height = movementStrength / screen.height;
var width = movementStrength / screen.width;
var top_image = document.getElementById('top-image');
document.body.onmousemove = function(e){
    var pageX = e.pageX - (screen.width / 2);
    var pageY = e.pageY - (screen.height / 2);
    var newvalueX = width * pageX * -1 - 25;
    var newvalueY = height * pageY * -1 - 50;
    top_image.style.backgroundPosition = newvalueX + "px " + newvalueY + "px";
} */