// https://stackoverflow.com/questions/799981/document-ready-equivalent-without-jquery
document.addEventListener("DOMContentLoaded", function(event) {
    addNavbar();
    addBackToTopButton();

    var enableDisqus = true;
    if (window.location.pathname == "/"
        || window.location.pathname == "/index.html"
        || window.location.pathname == "/archives.html"
        || window.location.pathname == "/skills.html"
        || window.location.pathname == "/others/english/index.html"
        || window.location.pathname == "/translate/index.html"
        || window.location.pathname == "/link/index.html") {
        // 这些页面不启用 Disqus
        enableDisqus = false;
    }
//// Disqus has ads, so don't load it
//    if (enableDisqus) {
//        addDisqus();
//    }

    // Navbar 的导航页面在小屏幕上会折叠为一个按钮，这个按钮的响应需要 bootstrap.min.js
    // 而 bootstrap.min.js 依赖于 popper.js（Bootstrap dropdowns, popovers, and tooltips depend on it）
    loadScripts(['https://unpkg.com/@popperjs/core@2.11.6/dist/umd/popper.min.js',
                 'https://unpkg.com/bootstrap@5.2.1/dist/js/bootstrap.min.js'])
});

var disqus_config = function () {
    this.page.url = "http://xuchangwei.com" + window.location.pathname;
    // 以 window.location.pathname 作为 identifier，且去掉前面的 /（为了兼容旧 comments）
    this.page.identifier = window.location.pathname.substring(1);
};

function addDisqus() {
    // 增加 <div id="disqus_thread"></div> 为 body 的最后一个孩子
    var disqusDiv = document.createElement("div");
    disqusDiv.id = "disqus_thread"
    document.querySelector("body").appendChild(disqusDiv);

    var disqus_loaded = false;
    function load_disqus() {
        console.log("load_disqus")
        if (!disqus_loaded)  {
            disqus_loaded = true; // Ensure that Disqus widget is loaded only once

            var d = document, s = d.createElement('script');
            s.src = 'https://aandds.disqus.com/embed.js';
            s.setAttribute('data-timestamp', +new Date());
            (d.head || d.body).appendChild(s);
        }
    }
    load_disqus();
}

// 刷新 disqus
function refreshDisqus() {
    if (typeof DISQUS !== 'undefined') {
        DISQUS.reset({ reload: true, config: disqus_config });
    }
}

function addBackToTopButton() {
    // See https://www.npmjs.com/package/vanilla-back-to-top
    loadScriptAsync('https://unpkg.com/vanilla-back-to-top@7.2.1/dist/vanilla-back-to-top.min.js', function(){addBackToTop();})
}

function addNavbar() {
    var preambleDiv = document.createElement("div");
    preambleDiv.id = "preamble"
    preambleDiv.className = "status"
    // From https://getbootstrap.com/docs/5.2/components/navbar/
    preambleDiv.innerHTML = `
<nav class="navbar fixed-top navbar-expand-lg navbar-expand-md navbar-expand-sm navbar-dark bg-dark">
  <div class="container-fluid">
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item"><a class="nav-link" href="/">JasperHsu</a></li>
        <li class="nav-item"><a class="nav-link" href="/skills.html">技能</a></li>
        <li class="nav-item"><a class="nav-link" href="/others/english/index.html">英语</a></li>
        <li class="nav-item"><a class="nav-link" href="/translate/index.html">翻译</a></li>
        <li class="nav-item"><a class="nav-link" href="/archives.html">归档</a></li>
        <li class="nav-item"><a class="nav-link" href="/link/index.html">友链</a></li>
        <li class="nav-item"><a class="nav-link" href="/about.html">关于</a></li>
      </ul>
      <form method="get" action="https://www.google.com/search" class="form-inline my-2 my-lg-0 my-md-0 my-sm-0" target="_blank">
        <div class="input-group">
          <input type="text" name="q" class="form-control" placeholder="Search Site" style="border-radius: 10px; border: 1px solid #4d4d4d; background-color: #4d4d4d; color: #f2f2f2;">
          <input type="hidden" name="sitesearch" value="xuchangwei.com" />
        </div>
      </form>
      <span class="navbar-nav btn" id="toggle-dark-light" href="" style="padding-left: 10px;">
	    <img src="/static/aandds.com/moon.svg" height="25" width="25">
      </span>
    </div>
  </div>
</nav>
<div class="container">
<p class="info">
  🏆 欢迎来到本站：
  <strong>希望这里有你感兴趣的内容</strong>。
</p>
</div>
    `;

    // 增加 preambleDiv 为 body 的第一个孩子
    var elm = document.querySelector("body");
    elm.insertBefore(preambleDiv, elm.firstChild);

    //  找到 toggle-dark-light，为其绑定 click 事件
    var toggleBtn = document.getElementById("toggle-dark-light");
    toggleBtn.addEventListener("click", toggle_theme);
    set_theme(localStorage.getItem("theme"));

    // 在设置 dark mode 后，跳转页面时出现白屏一闪而过的问题。
    // 为了解决这个问题，在 main.css 中默认不显示 body，当 dark mode（如果已经设置）应用后，才在 js 中让 body 显示
    // 参考：https://zwbetz.com/fix-the-white-flash-on-page-load-when-using-a-dark-theme-on-a-static-site/
    document.body.style.visibility = 'visible';
    document.body.style.opacity = 1;
}

// 按顺序加载 scripts
// https://stackoverflow.com/questions/8996852/load-and-execute-order-of-scripts
function loadScripts(scripts) {
    scripts.forEach(function(value) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = value;
        script.async = false; //<-- the important part
        document.body.appendChild(script); //<-- make sure to append to body instead of head
    });
}

function loadScriptAsync(url, callback) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.onload = function() {
        callback();
    };
    document.body.appendChild(script);
}

// 切换颜色主题
function toggle_theme() {
    var newTheme = localStorage.getItem("theme") == "dark" ? "light" : "dark";

    localStorage.setItem("theme", newTheme);
    set_theme(newTheme);

    // 改变颜色模式后，Disqus 需要重新加载，否则显示颜色不正常
    // See https://ourcodeworld.com/articles/read/1606/how-to-reset-disqus-color-schema-automatically
    refreshDisqus();
}

// 设置颜色主题
// 当参数 theme 为 dark 时，设置 toggle 图标为太阳，为 body 元素增加 class dark-theme，同时删除 class light-theme
// 当参数 theme 为其它值时，设置 toggle 图标为月亮，为 body 元素增加 class light-theme，同时删除 class dark-theme
function set_theme(theme) {
    var toggleBtn = document.getElementById("toggle-dark-light");
    var toggleIcon = toggleBtn.firstElementChild;

    if (theme === "dark") {
        document.body.classList.add("dark-theme");
        document.body.classList.remove("light-theme");

	toggleIcon.src = "/static/aandds.com/sun.svg";
    } else {
        document.body.classList.add("light-theme");
        document.body.classList.remove("dark-theme");

        toggleIcon.src = "/static/aandds.com/moon.svg";
    }
}
