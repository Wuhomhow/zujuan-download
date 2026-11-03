export const MSG = {
    STATE_GET: "STATE_GET",
    START_EXPORT: "START_EXPORT",
    RESOLVE_SOURCE_DOC: "RESOLVE_SOURCE_DOC",
    LICENSE_ACTIVATE: "LICENSE_ACTIVATE",
    LICENSE_STATUS: "LICENSE_STATUS",
    LICENSE_REQUIRE: "LICENSE_REQUIRE",
    LICENSE_DEACTIVATE: "LICENSE_DEACTIVATE"
};
export const DEFAULT_STATE = {
    settings: {
        answerPosition: "paperEnd",
        showParse: !0,
        showKnowledge: !1,
        showDifficulty: !1,
        /* 显示题目来源：none=不显示 / stem=题文前 / answer=答案处 */
        showOrigin: "none",
        /* 题文前来源颜色：black / red */
        originColor: "black",
        showAiCheck: !0,
        addAnswerArea: !1,
        paperTitle: "",
        formulaMode: "mathtype"
    },
    debug: {
        lastStep: null,
        lastError: null,
        updatedAt: null
    },
    license: {
        installationId: null,
        token: null,
        maskedKey: null,
        status: "inactive",
        expiresAt: null,
        lastCheckedAt: null
    },
    export: {
        status: "idle",
        lastResult: null,
        lastErrorCode: null,
        requestId: null,
        startedAt: null,
        format: null,
        sourceSite: null,
        sourcePageType: null
    }
};
export const ERROR_TEXT = {
    LICENSE_REQUIRED: "卡密未激活或授权已失效，请重新激活",
    EXPORT_UNSUPPORTED_PAGE: "当前页面暂不支持导出",
    EXPORT_EXTRACT_FAILED: "页面内容提取失败，请确认已登录目标网站",
    EXPORT_CONTENT_TIMEOUT: "页面响应超时，请刷新页面后重试",
    EXPORT_RENDER_DOCX_FAILED: "DOCX 导出失败",
    EXPORT_COMMIT_FAILED: "导出已完成，但状态同步失败",
    NETWORK_ERROR: "网络异常，请稍后重试"
};
const JYEOO_SUBJECT_MAP = {
        math3: {
            stage: "小学",
            subject: "数学"
        },
        chinese3: {
            stage: "小学",
            subject: "语文"
        },
        english3: {
            stage: "小学",
            subject: "英语"
        },
        math0: {
            stage: "小学",
            subject: "奥数"
        },
        science3: {
            stage: "小学",
            subject: "科学"
        },
        politics3: {
            stage: "小学",
            subject: "道德与法治"
        },
        math: {
            stage: "初中",
            subject: "数学"
        },
        physics: {
            stage: "初中",
            subject: "物理"
        },
        chemistry: {
            stage: "初中",
            subject: "化学"
        },
        bio: {
            stage: "初中",
            subject: "生物"
        },
        geography: {
            stage: "初中",
            subject: "地理"
        },
        chinese: {
            stage: "初中",
            subject: "语文"
        },
        english: {
            stage: "初中",
            subject: "英语"
        },
        politics: {
            stage: "初中",
            subject: "道德与法治"
        },
        history: {
            stage: "初中",
            subject: "历史"
        },
        science: {
            stage: "初中",
            subject: "科学"
        },
        tech6: {
            stage: "初中",
            subject: "信息技术"
        },
        math2: {
            stage: "高中",
            subject: "数学"
        },
        physics2: {
            stage: "高中",
            subject: "物理"
        },
        chemistry2: {
            stage: "高中",
            subject: "化学"
        },
        bio2: {
            stage: "高中",
            subject: "生物"
        },
        geography2: {
            stage: "高中",
            subject: "地理"
        },
        chinese2: {
            stage: "高中",
            subject: "语文"
        },
        english2: {
            stage: "高中",
            subject: "英语"
        },
        politics2: {
            stage: "高中",
            subject: "政治"
        },
        history2: {
            stage: "高中",
            subject: "历史"
        },
        tech1: {
            stage: "高中",
            subject: "信息"
        },
        tech2: {
            stage: "高中",
            subject: "通用"
        },
        math7: {
            stage: "中职",
            subject: "数学"
        },
        chinese7: {
            stage: "中职",
            subject: "语文"
        },
        english7: {
            stage: "中职",
            subject: "英语"
        }
    },
    ZUJUAN_SUBJECT_MAP = {
        1: "语文",
        2: "数学",
        3: "英语",
        4: "物理",
        5: "化学",
        6: "生物",
        7: "政治",
        8: "历史",
        9: "地理",
        10: "科学",
        25: "英语"
    };
export function humanError(e) {
    return ERROR_TEXT[e] || e || "未知错误"
}
/* 显示题目来源三态归一化：none=不显示 / stem=题文前 / answer=答案处。
 * 兼容旧布尔存储（true→stem，false→none）与字符串 "true"/"false"。 */
export function normalizeShowOrigin(e) {
    return "stem" === e || "answer" === e ? e : !0 === e || "true" === e ? "stem" : "none"
}
export function detectPage(e) {
    try {
        const t = new URL(e);
        if (/xkw\.com$/i.test(t.hostname) || /\.xkw\.com$/i.test(t.hostname)) {
            if (/^\/zhineng-view\/?$/i.test(t.pathname)) return {
                supported: !0,
                sourceSite: "zujuan",
                sourcePageType: "intelligentPaper"
            };
            /* 组卷中心试题篮：统一 URL，页面内 ZujuanCom.Paper.Xml() 提供当前用户当前篮子结构。 */
            if (/^\/zujuan\/?$/i.test(t.pathname)) return {
                supported: !0,
                sourceSite: "zujuan",
                sourcePageType: "questionBasket"
            };
            /* 个人中心「我的题库」试卷页 /usertk/{bankId}p{paperId}.html：用户私有组卷，
             * 页面 userPaperInfo 出试卷结构 + 移动站试题详情逐题出内容（专用 userPaper 流程） */
            if (/^\/usertk\/\d+p\d+\.html/i.test(t.pathname)) return {
                supported: !0,
                sourceSite: "zujuan",
                sourcePageType: "userPaper"
            };

            /* 「上好课」入口及其教材章节落地页：导出当前页已经加载的试题列表。 */
            if (/^\/shanghaoke\/\d+\.html/i.test(t.pathname) || /^\/[a-z0-9]+\/zj\d+\/?$/i.test(t.pathname)) return {
                supported: !0,
                sourceSite: "zujuan",
                sourcePageType: "questionList"
            };

            /* 高考真题页 /gkzt/gzsx/zhenti/y{year}i{id}/：真题整卷题目已完整直出在 DOM，
             * 与普通试卷页同构（.tk-quest-item/.quesdiv），按 questionList 走 PC DOM 直抓（无答案）。 */
            if (/^\/gkzt\//i.test(t.pathname)) return {
                supported: !0,
                sourceSite: "zujuan",
                sourcePageType: "questionList"
            };

            /* 精品专辑页 /thematiclist/{id}.html：页面展示专辑内当前试卷，按试卷处理（取数流程与试卷页一致）。
             * 必须先于 q/p 数字模式判断：专辑 id 为字母数字混合串，可能被 /q\d+|p\d+/ 误命中 */
            if (/\/thematiclist\/[\w-]+\.html/i.test(t.pathname)) return {
                supported: !0,
                sourceSite: "zujuan",
                sourcePageType: "paper"
            };
            /* 分享试卷：PC 分享页 /share-paper/{sfId}.html?secret=…（短链 xkw.com/xxx 301 到此处）、
             * 移动端 recorddetail?type=5&sfId=…&secret=…，均按试卷处理（取数流程不变） */
            if (/\/share-paper\/\d+\.html/i.test(t.pathname)) return {
                supported: !0,
                sourceSite: "zujuan",
                sourcePageType: "paper"
            };
            if (/\/recorddetail/i.test(t.pathname) && t.searchParams.get("sfId")) return {
                supported: !0,
                sourceSite: "zujuan",
                sourcePageType: "paper"
            };
            if (/\/\d+q\d+\.html/i.test(t.pathname) || /q\d+/i.test(t.pathname)) return {
                supported: !0,
                sourceSite: "zujuan",
                sourcePageType: "question"
            };
            if (/\/\d+p\d+\.html/i.test(t.pathname) || /p\d+/i.test(t.pathname)) return {
                supported: !0,
                sourceSite: "zujuan",
                sourcePageType: "paper"
            }
        }
        if (/jyeoo\.com$/i.test(t.hostname) || /\.jyeoo\.com$/i.test(t.hostname)) {
            if (/\/ques\/detail\//i.test(t.pathname)) return {
                supported: !0,
                sourceSite: "jyeoo",
                sourcePageType: "question"
            };
            /* 报告页与组卷页（/paper/make?id=…）都按试卷处理，取数方式一致 */
            if (/\/report\/detail\//i.test(t.pathname) || /\/paper\/make/i.test(t.pathname)) return {
                supported: !0,
                sourceSite: "jyeoo",
                sourcePageType: "paper"
            }
        }
        return {
            supported: !1,
            sourceSite: null,
            sourcePageType: null
        }
    } catch {
        return {
            supported: !1,
            sourceSite: null,
            sourcePageType: null
        }
    }
}
export function cloneDefaultState() {
    return JSON.parse(JSON.stringify(DEFAULT_STATE))
}
export function formatExportTitle(e, t, s = new Date) {
    return `${s.getFullYear()}年${s.getMonth()+1}月${s.getDate()}日${s.getHours()}点${String(s.getMinutes()).padStart(2,"0")}分${e||"未知学段"}${t||"未知学科"}试卷`
}
export function resolveJyeooStageSubjectFromPath(e = "") {
    const t = e.match(/^\/([a-z]+[0-9]*)\//i);
    return t && JYEOO_SUBJECT_MAP[t[1]] || {
        stage: "未知学段",
        subject: "未知学科"
    }
}
export function resolveZujuanSubjectFromSubjectId(e) {
    return ZUJUAN_SUBJECT_MAP[Number(e)] || "未知学科"
}
export function resolveStageSubjectPair(e = "") {
    const t = String(e || "").trim();
    return {
        stage: ["小学", "初中", "高中", "中职"].find(e => t.includes(e)) || "未知学段",
        subject: ["语文", "数学", "英语", "物理", "化学", "生物", "政治", "历史", "地理", "科学", "道德与法治", "信息技术", "通用", "信息", "奥数"].find(e => t.includes(e)) || "未知学科"
    }
}
export function resolveSubjectFromTitleText(e = "") {
    return resolveStageSubjectPair(e).subject
}
export function resolveStageFromLearnGradeName(e = "") {
    return e ? /^[一二三四五六]年级$/.test(e) || /(一年级|二年级|三年级|四年级|五年级|六年级)/.test(e) ? "小学" : /(七年级|八年级|九年级)/.test(e) ? "初中" : /(高一|高二|高三)/.test(e) ? "高中" : /(中职一|中职二|中职三)/.test(e) ? "中职" : "未知学段" : "未知学段"
}
