/* 组卷移动站 UA 伪装（MAIN world，document_start）。
 * 移动站 mzujuan.xkw.com 的前置脚本会检测桌面浏览器（读 navigator.userAgent 等）
 * 并 JS 跳转到桌面站 zujuan.xkw.com，导致后台采集标签页拿不到 window.__NUXT__。
 * 在页面任何脚本运行前伪装成 iPhone 即可留在移动站；WAF 挑战本身与 UA 无关。 */
(() => {
    "use strict";
    const d = (o, p, v) => {
        try {
            Object.defineProperty(o, p, {
                get: () => v,
                configurable: !0
            })
        } catch {}
    };
    d(navigator, "userAgent", "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1");
    d(navigator, "platform", "iPhone");
    d(navigator, "vendor", "Apple Computer, Inc.");
    d(navigator, "maxTouchPoints", 5);
    d(navigator, "userAgentData", void 0);
})();
