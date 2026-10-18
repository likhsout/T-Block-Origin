/*******************************************************************************

    T-Block Origin — popup panel logic
    Based on uBlock Origin Lite, Copyright (C) 2022-present Raymond Hill
    Copyright (C) 2026-present T-Block Origin contributors

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see {http://www.gnu.org/licenses/}.

    Home: https://github.com/gorhill/uBlock
*/

import { browser, runtime, sendMessage } from './ext.js';
import { dom, qs$ } from './dom.js';
import { i18n$ } from './i18n.js';
import punycode from './punycode.js';

/******************************************************************************/

const popupPanelData = {};
const  currentTab = {};
const tabURL = new URL(runtime.getURL('/'));

/******************************************************************************/

function renderAdminRules() {
    const { disabledFeatures: forbid = [] } = popupPanelData;
    if ( forbid.length === 0 ) { return; }
    dom.body.dataset.forbid = forbid.join(' ');
}

/******************************************************************************/

const BLOCKING_MODE_MAX = 3;

function renderModeDescription(level) {
    dom.text(
        '#filteringModeDescription',
        i18n$(`popupFilteringMode${level}Description`)
    );
}

async function setFilteringMode(level, commit = false) {
    const modeSlider = qs$('.filteringModeSlider');
    modeSlider.dataset.level = level;
    const heroShield = qs$('#heroShield');
    if ( heroShield ) {
        heroShield.dataset.level = level;
    }
    const heroStats = qs$('#heroStats');
    if ( heroStats ) {
        if ( level === 0 ) {
            heroStats.textContent = 'Protection Paused';
        } else if ( level === 1 ) {
            heroStats.textContent = 'Basic Protection Active';
        } else if ( level === 2 ) {
            heroStats.textContent = 'Optimal Protection Active';
        } else if ( level === 3 ) {
            heroStats.textContent = 'Complete Protection Active';
        }
    }
    const sliderLabels = qs$('.md-slider-labels');
    if ( sliderLabels ) {
        sliderLabels.dataset.level = level;
    }
    if ( qs$('.filteringModeSlider.moving') === null ) {
        dom.text(
            '#filteringModeText .md-mode-name',
            i18n$(`filteringMode${level}Name`)
        );
        renderModeDescription(level);
    }
    if ( commit !== true ) { return; }
    await commitFilteringMode();
}

async function commitFilteringMode() {
    if ( tabURL.hostname === '' ) { return; }
    const targetHostname = tabURL.hostname;
    const modeSlider = qs$('.filteringModeSlider');
    const afterLevel = parseInt(modeSlider.dataset.level, 10);
    const beforeLevel = parseInt(modeSlider.dataset.levelBefore, 10);
    if ( afterLevel > 1 ) {
        if ( beforeLevel <= 1 ) {
            sendMessage({
                what: 'setPendingFilteringMode',
                tabId: currentTab.id,
                url: tabURL.href,
                hostname: targetHostname,
                beforeLevel,
                afterLevel,
            });
        }
        let granted = false;
        try {
            granted = await browser.permissions.request({
                origins: [ `*://*.${targetHostname}/*` ],
            });
        } catch {
        }
        if ( granted !== true ) {
            setFilteringMode(beforeLevel);
            return;
        }
    }
    dom.text(
        '#filteringModeText .md-mode-name',
        i18n$(`filteringMode${afterLevel}Name`)
    );
    const actualLevel = await sendMessage({
        what: 'setFilteringMode',
        hostname: targetHostname,
        level: afterLevel,
    });
    if ( actualLevel !== afterLevel ) {
        setFilteringMode(actualLevel);
    }
    if ( actualLevel !== beforeLevel && popupPanelData.autoReload ) {
        const justReload = tabURL.href === currentTab.url;
        self.setTimeout(( ) => {
            if ( justReload ) {
                browser.tabs.reload(currentTab.id);
            } else {
                browser.tabs.update(currentTab.id, { url: tabURL.href });
            }
        }, 437);
    }
}

{
    let mx0 = 0;
    let l0 = 0;
    let lMax = 0;
    let step = 0;
    let isRTL = false;
    let modeButton = null;
    let modeSlider = null;
    let pendingLevel = -1;

    const move = ev => {
        if ( !modeSlider || dom.cl.has(modeSlider, 'moving') === false ) { return; }
        const deltaX = isRTL ? (mx0 - ev.pageX) : (ev.pageX - mx0);
        const l1 = Math.min(Math.max(l0 + deltaX, 0), lMax);

        if ( modeButton ) {
            if ( isRTL ) {
                modeButton.style.right = `${l1}px`;
                modeButton.style.left = 'auto';
            } else {
                modeButton.style.left = `${l1}px`;
            }
        }

        const level = Math.min(BLOCKING_MODE_MAX, Math.max(0, Math.round(l1 / step)));
        if ( level === pendingLevel ) { return; }
        pendingLevel = level;

        dom.text(
            '#filteringModeText .md-mode-preview',
            i18n$(`filteringMode${level}Name`)
        );
        renderModeDescription(level);

        const sliderLabels = qs$('.md-slider-labels');
        if ( sliderLabels ) {
            sliderLabels.dataset.level = level;
        }
    };

    const stop = ev => {
        if ( ev.button !== 0 ) { return; }
        if ( !modeSlider || dom.cl.has(modeSlider, 'moving') === false ) { return; }
        dom.cl.remove(modeSlider, 'moving');
        self.removeEventListener('mousemove', move, { capture: true });
        self.removeEventListener('mouseup', stop, { capture: true });

        if ( modeButton ) {
            modeButton.style.left = '';
            modeButton.style.right = '';
        }

        dom.text('#filteringModeText .md-mode-preview', '');

        const finalLevel = pendingLevel >= 0 ? pendingLevel : parseInt(modeSlider.dataset.level, 10);
        setFilteringMode(finalLevel, true);

        ev.stopPropagation();
        ev.preventDefault();
    };

    const startSliding = ev => {
        if ( ev.button !== 0 ) { return; }
        modeButton = qs$('.filteringModeButton');
        if ( ev.currentTarget !== modeButton ) { return; }
        modeSlider = qs$('.filteringModeSlider');
        if ( dom.cl.has(modeSlider, 'moving') ) { return; }

        isRTL = qs$('body[dir="rtl"]') !== null;
        modeSlider.dataset.levelBefore = modeSlider.dataset.level;
        const currentLevel = parseInt(modeSlider.dataset.level, 10) || 0;
        pendingLevel = currentLevel;

        const sliderRect = modeSlider.getBoundingClientRect();
        const buttonRect = modeButton.getBoundingClientRect();
        lMax = sliderRect.width - buttonRect.width;
        step = lMax / BLOCKING_MODE_MAX;
        l0 = currentLevel * step;
        mx0 = ev.pageX;

        dom.cl.add(modeSlider, 'moving');
        self.addEventListener('mousemove', move, { capture: true });
        self.addEventListener('mouseup', stop, { capture: true });
        ev.stopPropagation();
        ev.preventDefault();
    };

    dom.on('.filteringModeButton', 'mousedown', startSliding);
}

dom.on(
    '.filteringModeSlider, .md-slider-labels',
    'click',
    'span[data-level]',
    ev => {
        const modeSlider = qs$('.filteringModeSlider');
        modeSlider.dataset.levelBefore = modeSlider.dataset.level;
        const span = ev.target;
        const level = parseInt(span.dataset.level, 10);
        setFilteringMode(level, true);
    }
);

if ( dom.cl.has(dom.html, 'mobile') === false ) {
    dom.on('.filteringModeSlider, .md-slider-labels',
        'mouseenter',
        'span[data-level]',
        ev => {
            const span = ev.target;
            const level = parseInt(span.dataset.level, 10);
            dom.text('#filteringModeText .md-mode-preview',
                i18n$(`filteringMode${level}Name`)
            );
            renderModeDescription(level);
        }
    );

    dom.on('.filteringModeSlider, .md-slider-labels',
        'mouseleave',
        'span[data-level]',
        ( ) => {
            dom.text('#filteringModeText .md-mode-preview', '');
            const modeSlider = qs$('.filteringModeSlider');
            renderModeDescription(parseInt(modeSlider.dataset.level, 10) || 0);
        }
    );
}

/******************************************************************************/

dom.on('#gotoMatchedRules', 'click', ev => {
    if ( ev.isTrusted !== true ) { return; }
    if ( ev.button !== 0 ) { return; }
    sendMessage({
        what: 'showMatchedRules',
        tabId: currentTab.id,
    });
});

/******************************************************************************/

dom.on('#gotoReport', 'click', ev => {
    if ( ev.isTrusted !== true ) { return; }
    let url;
    try {
        url = new URL(currentTab.url);
    } catch {
    }
    if ( url === undefined ) { return; }
    const reportURL = new URL(runtime.getURL('/report.html'));
    reportURL.searchParams.set('tabid', currentTab.id);
    reportURL.searchParams.set('url', tabURL.href);
    reportURL.searchParams.set('mode', popupPanelData.level);
    sendMessage({
        what: 'gotoURL',
        url: `${reportURL.pathname}${reportURL.search}`,
    });
});

/******************************************************************************/

dom.on('#gotoDashboard', 'click', ev => {
    if ( ev.isTrusted !== true ) { return; }
    if ( ev.button !== 0 ) { return; }
    runtime.openOptionsPage();
});

/******************************************************************************/

dom.on('#gotoZapper', 'click', ( ) => {
    if ( browser.scripting === undefined ) { return; }
    browser.scripting.executeScript({
        files: [ '/js/scripting/tool-overlay.js', '/js/scripting/zapper.js' ],
        target: { tabId: currentTab.id },
    });
    self.close();
});

/******************************************************************************/

dom.on('#gotoPicker', 'click', ( ) => {
    if ( browser.scripting === undefined ) { return; }
    browser.scripting.executeScript({
        files: [
            '/js/scripting/css-procedural-api.js',
            '/js/scripting/tool-overlay.js',
            '/js/scripting/picker.js',
        ],
        target: { tabId: currentTab.id },
    });
    self.close();
});

/******************************************************************************/

dom.on('#gotoUnpicker', 'click', ( ) => {
    if ( browser.scripting === undefined ) { return; }
    browser.scripting.executeScript({
        files: [
            '/js/scripting/css-procedural-api.js',
            '/js/scripting/tool-overlay.js',
            '/js/scripting/unpicker.js',
        ],
        target: { tabId: currentTab.id },
    });
    self.close();
});

/******************************************************************************/

let activePauseState = null;
let pauseTimerId = null;

function isHostPaused() {
    return activePauseState !== null && activePauseState.resumeAt > Date.now();
}

async function pauseProtection(durationMs) {
    if ( tabURL.hostname === '' ) { return; }
    dom.cl.add(dom.body, 'busy');
    try {
        const res = await sendMessage({
            what: 'pauseProtection',
            hostname: tabURL.hostname,
            durationMs,
        });
        if ( res?.success ) {
            setFilteringMode(0);
            updatePauseUI({ resumeAt: res.resumeAt, previousLevel: res.previousLevel });
            if ( popupPanelData.autoReload && tabURL.href === currentTab.url ) {
                browser.tabs.reload(currentTab.id);
            }
        }
    } finally {
        dom.cl.remove(dom.body, 'busy');
    }
}

async function resumeProtection() {
    if ( tabURL.hostname === '' ) { return; }
    dom.cl.add(dom.body, 'busy');
    try {
        const res = await sendMessage({
            what: 'resumeProtection',
            hostname: tabURL.hostname,
        });
        if ( res?.success ) {
            setFilteringMode(res.level);
            updatePauseUI(null);
            if ( popupPanelData.autoReload && tabURL.href === currentTab.url ) {
                browser.tabs.reload(currentTab.id);
            }
        }
    } finally {
        dom.cl.remove(dom.body, 'busy');
    }
}

function updatePauseUI(pauseState) {
    activePauseState = pauseState;
    if ( pauseTimerId !== null ) {
        clearInterval(pauseTimerId);
        pauseTimerId = null;
    }
    const pauseBtn = qs$('#pauseButton');
    const pauseBtnText = qs$('#pauseBtnText');
    const heroShield = qs$('#heroShield');
    const heroStats = qs$('#heroStats');

    if ( pauseState && pauseState.resumeAt > Date.now() ) {
        if ( heroShield ) {
            heroShield.classList.add('paused');
        }
        if ( pauseBtn ) {
            pauseBtn.classList.add('paused');
        }
        const tick = () => {
            const msLeft = pauseState.resumeAt - Date.now();
            if ( msLeft <= 0 ) {
                resumeProtection();
                return;
            }
            const totalSec = Math.ceil(msLeft / 1000);
            const m = Math.floor(totalSec / 60);
            const s = totalSec % 60;
            const timeStr = `${m}:${s < 10 ? '0' : ''}${s}`;
            if ( pauseBtnText ) {
                pauseBtnText.textContent = `Paused (${timeStr}) • Resume`;
            }
            if ( heroStats ) {
                heroStats.textContent = `Protection paused for anti-adblock (${timeStr} left)`;
            }
        };
        tick();
        pauseTimerId = setInterval(tick, 1000);
    } else {
        activePauseState = null;
        if ( heroShield ) {
            heroShield.classList.remove('paused');
        }
        if ( pauseBtn ) {
            pauseBtn.classList.remove('paused');
        }
        if ( pauseBtnText ) {
            pauseBtnText.textContent = 'Pause';
        }
    }
}

dom.on('#heroShield', 'click', async () => {
    if ( isHostPaused() ) {
        await resumeProtection();
        return;
    }
    const modeSlider = qs$('.filteringModeSlider');
    const currentLevel = parseInt(modeSlider.dataset.level, 10);
    const targetLevel = currentLevel > 0 ? 0 : 2;
    modeSlider.dataset.levelBefore = currentLevel;
    setFilteringMode(targetLevel, true);
});

dom.on('#heroShield', 'keydown', (e) => {
    if ( e.key === 'Enter' || e.key === ' ' ) {
        e.preventDefault();
        qs$('#heroShield')?.click();
    }
});

dom.on('#pauseButton', 'click', async (e) => {
    e.stopPropagation();
    if ( isHostPaused() ) {
        await resumeProtection();
        return;
    }
    const menu = qs$('#pauseMenu');
    menu?.classList.toggle('hidden');
});

dom.on('.md-pause-option', 'click', async (e) => {
    e.stopPropagation();
    qs$('#pauseMenu')?.classList.add('hidden');
    const durationMs = parseInt(e.currentTarget.dataset.duration, 10);
    if ( !isNaN(durationMs) && durationMs > 0 ) {
        await pauseProtection(durationMs);
    }
});

document.addEventListener('click', () => {
    qs$('#pauseMenu')?.classList.add('hidden');
});

/******************************************************************************/

async function init() {
    const [ tab ] = await browser.tabs.query({
        active: true,
        currentWindow: true,
    });
    if ( tab instanceof Object === false ) { return false; }
    Object.assign(currentTab, tab);

    let url;
    try {
        const strictBlockURL = runtime.getURL('/strictblock.');
        url = new URL(currentTab.url);
        if ( url.href.startsWith(strictBlockURL) ) {
            url = new URL(url.hash.slice(1));
        }
        tabURL.href = url.href || '';
    } catch {
    }
    if ( url === undefined ) { return false; }
    if ( url.hostname === '' ) { return false; }
    if ( /^https?:/.test(url.protocol) === false ) { return false; }

    const response = await sendMessage({
        what: 'popupPanelData',
        origin: url.origin,
        hostname: tabURL.hostname,
    });
    if ( response instanceof Object === false ) { return false; }
    Object.assign(popupPanelData, response);

    renderAdminRules();

    setFilteringMode(popupPanelData.level);
    updatePauseUI(popupPanelData.pauseState || null);

    dom.text('#hostname', punycode.toUnicode(tabURL.hostname));

    dom.cl.toggle('#gotoMatchedRules', 'enabled',
        popupPanelData.isSideloaded === true &&
        popupPanelData.developerMode &&
        typeof currentTab.id === 'number' &&
        isNaN(currentTab.id) === false
    );

    const isHTTP = url.protocol === 'http:' || url.protocol === 'https:';
    dom.cl.toggle(dom.root, 'isHTTP', isHTTP);

    dom.cl.toggle('#gotoUnpicker', 'enabled', popupPanelData.hasCustomFilters);

    if ( typeof browser !== 'undefined' && browser.action?.getBadgeText ) {
        try {
            const badge = await browser.action.getBadgeText({ tabId: currentTab.id });
            const count = parseInt(badge, 10);
            const badgeEl = qs$('#heroBadge');
            const heroStats = qs$('#heroStats');
            if ( badgeEl && !isNaN(count) && count > 0 ) {
                badgeEl.textContent = badge;
                badgeEl.style.display = 'inline-flex';
                if ( heroStats && popupPanelData.level > 0 && !isHostPaused() ) {
                    heroStats.textContent = `${count} requests blocked on this page`;
                }
            }
        } catch {
        }
    }

    return true;
}

async function tryInit() {
    try {
        const status = await init();
        if ( status === false ) {
            dom.cl.add(dom.body, 'nodata');
            dom.text('#hostname', i18n$('popupNoWebsite'));
        }
    } catch {
    } finally {
        dom.cl.remove(dom.body, 'loading', 'busy');
    }
}

tryInit();

/******************************************************************************/
