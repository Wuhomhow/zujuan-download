import {
    MSG
} from "./shared.js";
async function saveSettings(e) {
    const t = (await chrome.storage.local.get(["mvpState"])).mvpState || {};
    t.settings = {
        ...t.settings || {},
        ...e
    }, await chrome.storage.local.set({
        mvpState: t
    })
}

function renderSettingControl(e, t) {
    const n = document.getElementById(e);
    n && ("checkbox" === n.type ? n.checked = Boolean(t) : n.value = t)
}

function bindSettingControl(e, t = e => e) {
    const n = document.getElementById(e);
    n && n.addEventListener("change", async n => {
        const r = "checkbox" === n.target.type ? n.target.checked : t(n.target.value);
        try {
            await saveSettings({
                [e]: r
            }), await rerender("设置已保存")
        } catch (e) {
            document.getElementById("message").textContent = e.message || "设置保存失败"
        }
    })
}
async function refreshSupportedTabs() {
    const e = (await chrome.tabs.query({})).filter(e => {
        const t = e.url || "";
        return /https:\/\/.*\.xkw\.com\//i.test(t) || /https:\/\/.*\.jyeoo\.com\//i.test(t) || /https:\/\/www\.jyeoo\.com\//i.test(t)
    });
    await Promise.all(e.map(e => chrome.tabs.reload(e.id).catch(() => {})))
}

async function getState() {
    try {
        const e = await chrome.runtime.sendMessage({
            type: MSG.STATE_GET
        });
        return e?.state
    } catch (e) {
        throw new Error("后台服务未就绪，请在扩展管理页重新加载插件")
    }
}

function render(e, t = "") {
    renderSettingControl("answerPosition", e.settings?.answerPosition || "questionEnd"), renderSettingControl("showParse", !1 !== e.settings?.showParse), renderSettingControl("showKnowledge", !0 === e.settings?.showKnowledge), renderSettingControl("showDifficulty", !0 === e.settings?.showDifficulty), renderSettingControl("addAnswerArea", !0 === e.settings?.addAnswerArea), renderSettingControl("format", e.settings?.format || "docx"), document.getElementById("installationId").textContent = e.license.installationId || "-", document.getElementById("debugStep").textContent = e.debug?.lastStep || "-", document.getElementById("debugError").textContent = e.debug?.lastError || "-", document.getElementById("message").textContent = t || "";
    /* 显示题目来源三态 */
    const so = "stem" === e.settings?.showOrigin || "answer" === e.settings?.showOrigin ? e.settings.showOrigin : !0 === e.settings?.showOrigin || "true" === e.settings?.showOrigin ? "stem" : "none";
    [["showOriginNone", "none"], ["showOriginStem", "stem"], ["showOriginAnswer", "answer"]].forEach(([e2, t2]) => {
        const n = document.getElementById(e2);
        n && (n.checked = so === t2)
    });
    /* 来源颜色：黑/红 */
    const oc = "red" === e.settings?.originColor ? "red" : "black";
    [["originColorBlack", "black"], ["originColorRed", "red"]].forEach(([e2, t2]) => {
        const n = document.getElementById(e2);
        n && (n.checked = oc === t2)
    })
}
async function rerender(e = "") {
    try {
        const t = await getState();
        if (!t) throw new Error("后台服务未返回状态");
        render(t, e)
    } catch (e) {
        document.getElementById("message").textContent = e.message || "后台服务未就绪，请重新加载插件"
    }
}
bindSettingControl("answerPosition"), bindSettingControl("showParse"), bindSettingControl("showKnowledge"), bindSettingControl("showDifficulty"), bindSettingControl("addAnswerArea"), bindSettingControl("format"), rerender();
/* 显示题目来源三态单选组 */
["showOriginNone", "showOriginStem", "showOriginAnswer"].forEach(e => {
    const n = document.getElementById(e);
    n && n.addEventListener("change", async () => {
        if (!n.checked) return;
        try {
            await saveSettings({
                showOrigin: n.value
            }), await rerender("设置已保存")
        } catch (e) {
            document.getElementById("message").textContent = e.message || "设置保存失败"
        }
    })
});
/* 来源颜色单选组 */
["originColorBlack", "originColorRed"].forEach(e => {
    const n = document.getElementById(e);
    n && n.addEventListener("change", async () => {
        if (!n.checked) return;
        try {
            await saveSettings({
                originColor: n.value
            }), await rerender("设置已保存")
        } catch (e) {
            document.getElementById("message").textContent = e.message || "设置保存失败"
        }
    })
});
