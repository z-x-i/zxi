javascript:(function() {
    "use strict";

    const RAILWAY_SERVER_URL = "https://zxi-file-loader.ah4734536.workers.dev"; 

    let userIndex = -1;
    if (typeof window.ZXI_BOOKMARK_LOAD !== "undefined") {
        userIndex = 0;
    } else {
        for (let i = 1; i <= 500; i++) {
            if (typeof window['ZXI' + i + '_BOOKMARK_LOAD'] !== "undefined") {
                userIndex = i;
                break;
            }
        }
    }

    if (userIndex === -1) {
        console.log("%cAccess Denied - Bookmark Required", "color:#ff0000;font-size:15px;font-weight:bold");
        return;
    }

    const sKey = "Hey";

    const _d = {
        r: `${RAILWAY_SERVER_URL}/?file=zxi.txt&key=${sKey}`,
        p: `${RAILWAY_SERVER_URL}/?file=zx.txt&key=${sKey}`,
        t: `${RAILWAY_SERVER_URL}/?file=button.txt`,
        m: `${RAILWAY_SERVER_URL}/?file=music.txt`,
        n: `${RAILWAY_SERVER_URL}/?file=name.txt`, 
        s: 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(5,15,5,0.88);backdrop-filter:blur(15px);-webkit-backdrop-filter:blur(15px);color:#00ff41;padding:40px 30px;border-radius:16px;z-index:2147483647;font-family:"Courier New",Courier,monospace;text-align:center;box-shadow:0 0 40px rgba(0,255,65,0.3), inset 0 0 20px rgba(0,255,65,0.1);border:1px solid #00ff41;width:380px;box-sizing:border-box;overflow:hidden;'
    };

    let zxiAudio = null;
    let audioContext = null;
    let analyser = null;
    let dataArray = null;
    let source = null;
    let isMusicLoading = false;
    let matrixInterval = null;

    (async function() {
        const oldBox = document.getElementById('zxi-auth-box');
        if(oldBox) oldBox.remove();
        
        const oldCredit = document.getElementById('zxi-floating-credit');
        if(oldCredit) oldCredit.remove();

        const oldMusicBtn = document.getElementById('zxi-music-btn');
        if(oldMusicBtn) oldMusicBtn.remove();

        let systemName = "MATRIX BYPASS";
        let userTelegram = "https://t.me/zxiowner"; 
        let correctPassword = "";

        try {
            const nameRes = await fetch(_d.n + '&t=' + Date.now());
            const nameText = await nameRes.text();
            const lines = nameText.split(/\r?\n/).map(l => l.trim()).filter(l => l !== "");
            
            if (lines[userIndex]) {
                const matches = lines[userIndex].match(/"([^"]+)"/g);
                if (matches && matches.length >= 3) {
                    systemName = matches[0].replace(/"/g, '');      
                    userTelegram = matches[1].replace(/"/g, '');    
                    correctPassword = matches[2].replace(/"/g, ''); 
                }
            }
        } catch(e) {
            console.error("Initialization error:", e);
        }

        const styleSheet = document.createElement("style");
        styleSheet.textContent = `
            @keyframes matrix-pulse {
                0%, 100% { box-shadow: 0 0 30px rgba(0,255,65,0.2); }
                50% { box-shadow: 0 0 50px rgba(0,255,65,0.5); }
            }
            .zxi-clickable-credit { position: fixed; bottom: 18px; right: 22px; font-size: 15px; font-weight: bold; font-family: monospace; letter-spacing: 2px; z-index: 2147483647; text-decoration: none; cursor: pointer; color: #00ff41; text-shadow: 0 0 8px #00ff41; }
            .zxi-mode-btn { width: 100%; padding: 16px; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 14px; font-family: monospace; letter-spacing: 1px; margin-bottom: 14px; border: 1px solid #00ff41; background: rgba(0,0,0,0.7); color: #00ff41; transition: all 0.3s ease; text-shadow: 0 0 5px #00ff41; position: relative; z-index: 2; }
            .zxi-mode-btn:hover { background: #00ff41; color: #000; box-shadow: 0 0 20px #00ff41; text-shadow: none; }
            .zxi-input-matrix { width: 100%; padding: 16px; margin-bottom: 20px; border: 1px solid #00ff41; border-radius: 8px; background: rgba(0,0,0,0.6); color: #fff; text-align: center; font-size: 14px; outline: none; font-family: monospace; transition: all 0.3s; position: relative; z-index: 2; }
            .zxi-input-matrix:focus { box-shadow: 0 0 15px #00ff41; }
            .zxi-ripple { position: absolute; background: rgba(0, 255, 65, 0.4); border-radius: 50%; pointer-events: none; transform: scale(0); animation: zxi-ripple-effect 0.6s linear; z-index: 999999; }
            @keyframes zxi-ripple-effect { to { transform: scale(4); opacity: 0; } }
        `;
        document.head.appendChild(styleSheet);

        /* Touch / Click Ripple Animation Event Listener */
        window.addEventListener('click', function(e) {
            const ripple = document.createElement('div');
            ripple.className = 'zxi-ripple';
            document.body.appendChild(ripple);
            ripple.style.left = `${e.clientX - 10}px`;
            ripple.style.top = `${e.clientY - 10}px`;
            ripple.style.width = '20px';
            ripple.style.height = '20px';
            ripple.addEventListener('animationend', () => ripple.remove());
        });

        window.addEventListener('touchstart', function(e) {
            const touch = e.touches[0];
            const ripple = document.createElement('div');
            ripple.className = 'zxi-ripple';
            document.body.appendChild(ripple);
            ripple.style.left = `${touch.clientX - 10}px`;
            ripple.style.top = `${touch.clientY - 10}px`;
            ripple.style.width = '20px';
            ripple.style.height = '20px';
            ripple.addEventListener('animationend', () => ripple.remove());
        });

        const creditLink = document.createElement('a');
        creditLink.id = 'zxi-floating-credit';
        creditLink.className = 'zxi-clickable-credit';
        creditLink.innerText = '[ OPERATOR ]';
        creditLink.href = userTelegram; 
        creditLink.target = '_blank';
        document.body.appendChild(creditLink);

        const musicBtn = document.createElement('button');
        musicBtn.id = 'zxi-music-btn';
        musicBtn.style.cssText = 'position:fixed; bottom:20px; left:20px; background:rgba(0,10,0,0.8); border:1px solid #00ff41; color:#00ff41; border-radius:50%; width:50px; height:50px; cursor:pointer; font-size:20px; display:flex; align-items:center; justify-content:center; box-shadow:0 0 15px rgba(0,255,65,0.3); z-index:2147483647; outline:none;';
        musicBtn.textContent = '🔇';
        document.body.appendChild(musicBtn);

        const box = document.createElement('div');
        box.id = 'zxi-auth-box';
        box.style.cssText = _d.s;
        box.style.animation = "matrix-pulse 4s infinite ease-in-out";
        
        box.innerHTML = `
          <canvas id="matrix-canvas" style="position:absolute; top:0; left:0; width:100%; height:100%; z-index:1; opacity:0.15; pointer-events:none;"></canvas>
          <div style="position:relative; z-index:2;">
            <button id="zxi-panel-close" style="position:absolute;top:-25px;right:-15px;background:none;border:none;color:#ff3333;font-size:18px;cursor:pointer;font-family:monospace;font-weight:bold;outline:none;">[X]</button>
            <h3 style="margin:10px 0 4px 0;color:#00ff41;font-size:22px;font-weight:900;letter-spacing:2px;text-shadow:0 0 8px #00ff41;">// ${systemName}</h3>
            <p style="margin:0 0 25px 0;color:#666;font-size:11px;letter-spacing:3px;">SYSTEM.CORE.LOGIN</p>
            <input type="text" id="zxi-key-input" class="zxi-input-matrix" placeholder="[ ENTER ACCESS KEY ]">
            <button id="zxi-login-btn" style="width:100%;background:#00ff41;color:#000;border:none;padding:16px;border-radius:8px;font-weight:bold;cursor:pointer;font-size:14px;font-family:monospace;box-shadow:0 0 15px rgba(0,255,65,0.4);letter-spacing:2px;position:relative;z-index:2;">INITIALIZE_DECRYPT</button>
            <button id="zxi-telegram-btn" style="width:100%;background:rgba(0,0,0,0.5);color:#00ff41;border:1px solid rgba(0,255,65,0.5);padding:14px;border-radius:8px;font-weight:bold;cursor:pointer;font-family:monospace;margin-top:12px;letter-spacing:1px;position:relative;z-index:2;">CONTACT_OPERATOR</button>
            <div id="zxi-status" style="margin-top:20px;font-size:11px;font-weight:bold;color:#555;letter-spacing:1px;">STATUS: STANDBY</div>
          </div>
        `;
        document.body.appendChild(box);

        /* Matrix Digital Rain Animation Engine */
        function initMatrixRain() {
            const canvas = document.getElementById('matrix-canvas');
            if(!canvas) return;
            const ctx = canvas.getContext('2d');
            
            canvas.width = box.offsetWidth;
            canvas.height = box.offsetHeight;

            // Chinese characters + Matrix alphabets
            const katakana = "𪚥𩶘𪚥𩙖𢏵𣡽𤳏𦈡𧚔𨷿𩬊𪏵私はガラスを食べられます病気になりませんabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            const alphabet = katakana.split("");

            const fontSize = 11;
            const columns = canvas.width / fontSize;

            const rainDrops = [];
            for (let x = 0; x < columns; x++) {
                rainDrops[x] = 1;
            }

            const draw = () => {
                ctx.fillStyle = 'rgba(5, 15, 5, 0.05)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                ctx.fillStyle = '#00ff41';
                ctx.font = fontSize + 'px monospace';

                for (let i = 0; i < rainDrops.length; i++) {
                    const text = alphabet[Math.floor(Math.random() * alphabet.length)];
                    ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

                    if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                        rainDrops[i] = 0;
                    }
                    rainDrops[i]++;
                }
            };
            matrixInterval = setInterval(draw, 30);
        }
        
        setTimeout(initMatrixRain, 100);

        function cleanup() {
            if(zxiAudio) zxiAudio.pause();
            if(musicBtn) musicBtn.remove();
            if(creditLink) creditLink.remove();
            if(matrixInterval) clearInterval(matrixInterval);
            box.remove();
        }

        document.getElementById('zxi-panel-close').addEventListener('click', cleanup);

        async function setupVisualizer() {
            if (audioContext) return;
            try {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                analyser = audioContext.createAnalyser();
                analyser.fftSize = 512;
                analyser.smoothingTimeConstant = 0.3; 
                dataArray = new Uint8Array(analyser.frequencyBinCount);
                source = audioContext.createMediaElementSource(zxiAudio);
                source.connect(analyser);
                analyser.connect(audioContext.destination);
            } catch(e) {}
        }

        musicBtn.addEventListener('click', async () => {
            if (isMusicLoading) return;
            if (!zxiAudio) {
                try {
                    isMusicLoading = true; musicBtn.textContent = '⏳';
                    const res = await fetch(_d.m + '&t=' + Date.now());
                    const audioUrl = (await res.text()).trim();
                    if(audioUrl && audioUrl.startsWith('http')) {
                        const audioFetch = await fetch(audioUrl);
                        const blobUrl = URL.createObjectURL(await audioFetch.blob());
                        zxiAudio = new Audio(blobUrl); zxiAudio.loop = true; zxiAudio.crossOrigin = "anonymous";
                    } else { isMusicLoading = false; musicBtn.textContent = '🔇'; return; }
                } catch(err) { isMusicLoading = false; musicBtn.textContent = '🔇'; return; }
                isMusicLoading = false;
            }
            if (audioContext && audioContext.state === 'suspended') { await audioContext.resume(); }
            if (zxiAudio.paused) {
                await setupVisualizer();
                zxiAudio.play().then(() => {
                    musicBtn.textContent = '🔊'; musicBtn.style.color = '#ff3333';
                    musicBtn.style.borderColor = '#ff3333';
                    musicBtn.style.boxShadow = '0 0 15px #ff3333';
                }).catch(err => {});
            } else {
                zxiAudio.pause(); musicBtn.textContent = '🔇'; musicBtn.style.color = '#00ff41';
                musicBtn.style.borderColor = '#00ff41'; musicBtn.style.boxShadow = '0 0 15px rgba(0,255,65,0.3)';
            }
        });

        const keyInput = document.getElementById('zxi-key-input');
        const loginBtn = document.getElementById('zxi-login-btn');
        const tgBtn = document.getElementById('zxi-telegram-btn');
        const statusDiv = document.getElementById('zxi-status');

        tgBtn.addEventListener('click', () => window.open(userTelegram, '_blank'));

        function triggerPowerZxPanel(engineMode) {
            if(matrixInterval) clearInterval(matrixInterval);
            
            box.innerHTML = `
                <canvas id="matrix-canvas" style="position:absolute; top:0; left:0; width:100%; height:100%; z-index:1; opacity:0.15; pointer-events:none;"></canvas>
                <div style="position:relative; z-index:2;">
                    <button id="zxi-back-btn" style="position:absolute;top:-25px;left:-15px;background:none;border:none;color:#00ff41;font-size:20px;cursor:pointer;font-family:monospace;font-weight:bold;"><-</button>
                    <button id="zxi-panel-close" style="position:absolute;top:-25px;right:-15px;background:none;border:none;color:#ff3333;font-size:18px;cursor:pointer;font-family:monospace;font-weight:bold;">[X]</button>
                    <h3 style="margin:30px 0 4px 0;color:#00ff41;font-size:20px;font-weight:800;font-family:monospace;text-shadow:0 0 8px #00ff41;">// BYPASS_TERMINAL</h3>
                    <p style="margin:0 0 24px 0;color:#666;font-size:11px;letter-spacing:1px;">MODE: ${engineMode.toUpperCase()}</p>
                    <input type="text" id="zxi-bypass-input" class="zxi-input-matrix" placeholder="[ PASTE TARGET VPLINK HERE ]">
                    <button id="zxi-fetch-bypass-btn" style="width:100%;background:#00ff41;color:#000;border:none;padding:16px;border-radius:8px;font-weight:bold;cursor:pointer;font-family:monospace;letter-spacing:1px;box-shadow:0 0 15px rgba(0,255,65,0.3)">RUN_EXPLOIT</button>
                    <div id="zxi-bypass-status" style="margin-top:20px;font-size:11px;font-weight:bold;color:#555;letter-spacing:1px;">STATUS: INJECTOR_READY</div>
                </div>
            `;
            
            setTimeout(initMatrixRain, 100);
            
            document.getElementById('zxi-back-btn').addEventListener('click', showMainOptionsPanel);
            document.getElementById('zxi-panel-close').addEventListener('click', cleanup);

            const bypassInput = document.getElementById('zxi-bypass-input');
            const fetchBtn = document.getElementById('zxi-fetch-bypass-btn');
            const bStatus = document.getElementById('zxi-bypass-status');

            fetchBtn.addEventListener('click', async () => {
                const urlVal = bypassInput.value.trim();
                if (!urlVal || !urlVal.includes('vplink.in/')) {
                    bStatus.innerHTML = "<span style='color:#ff3333;'>[!] ERROR: INVALID_TARGET_NODE</span>"; return;
                }

                bStatus.innerHTML = "<span style='color:#00ff41;'>[~] EXECUTING_BUFFER_OVERFLOW...</span>";
                fetchBtn.disabled = true;
                fetchBtn.style.opacity = "0.5";

                try {
                    const response = await fetch(`${RAILWAY_SERVER_URL}/api/bypass?mode=power&user=${userIndex}&url=${encodeURIComponent(urlVal)}`);
                    const data = await response.json();
                    
                    if (data && data.status === "success" && data.bypassed_url) {
                        bStatus.innerHTML = "<span style='color:#00ff41;'>[+] PLOAD_INJECTED_SUCCESSFULLY ✓</span>";
                        bypassInput.value = data.bypassed_url;
                        bypassInput.select();

                        fetchBtn.outerHTML = `<button id="zxi-copy-bypass-btn" style="width:100%;background:#00ff41;color:#000;border:none;padding:16px;border-radius:8px;font-weight:bold;cursor:pointer;font-family:monospace;letter-spacing:1px;box-shadow:0 0 20px #00ff41;">[📋] EXTRACT_DECRYPTED_DATA</button>`;
                        
                        document.getElementById('zxi-copy-bypass-btn').addEventListener('click', () => {
                            navigator.clipboard.writeText(data.bypassed_url).then(() => {
                                bStatus.innerHTML = "<span style='color:#00ff41;'>[+] COPIED TO CLIPBOARD. TERMINATING...</span>";
                                setTimeout(cleanup, 1200);
                            });
                        });
                    } else {
                        bStatus.innerHTML = "<span style='color:#ff3333;'>[!] INJECTION_FAILED: RETRYING</span>"; 
                        fetchBtn.disabled = false; fetchBtn.style.opacity = "1";
                    }
                } catch (err) {
                    bStatus.innerHTML = "<span style='color:#ff3333;'>[!] CRITICAL_SERVER_TIMEOUT</span>"; 
                    fetchBtn.disabled = false; fetchBtn.style.opacity = "1";
                }
            });
        }

        function showMainOptionsPanel() {
            if(matrixInterval) clearInterval(matrixInterval);
            
            box.innerHTML = `
                <canvas id="matrix-canvas" style="position:absolute; top:0; left:0; width:100%; height:100%; z-index:1; opacity:0.15; pointer-events:none;"></canvas>
                <div style="position:relative; z-index:2;">
                    <button id="zxi-panel-close" style="position:absolute;top:-25px;right:-15px;background:none;border:none;color:#ff3333;font-size:18px;cursor:pointer;font-family:monospace;font-weight:bold;">[X]</button>
                    <h3 style="margin:10px 0 8px 0;color:#00ff41;font-size:20px;font-weight:800;font-family:monospace;text-shadow:0 0 10px #00ff41;">// LOAD_MODULE</h3>
                    <p style="margin:0 0 26px 0;color:#666;font-size:11px;letter-spacing:1px;">ACCESS_GRANTED. SELECT_TARGET.</p>
                    <button id="zxi-choice-powerzx" class="zxi-mode-btn">> VPLINK_STANDARD_BYPASS</button>
                    <button id="zxi-choice-powerplus" class="zxi-mode-btn">> VPLINK_HUNTER_MAX</button>
                </div>
            `;

            setTimeout(initMatrixRain, 100);
            document.getElementById('zxi-panel-close').addEventListener('click', cleanup);
            document.getElementById('zxi-choice-powerzx').addEventListener('click', () => triggerPowerZxPanel("power"));
            document.getElementById('zxi-choice-powerplus').addEventListener('click', () => triggerPowerZxPanel("powerplus"));
        }

        loginBtn.addEventListener('click', () => {
            const inputKey = keyInput.value.trim();
            if(!inputKey) { statusDiv.innerHTML = "<span style='color:#ff3333;'>[!] EMPTY_KEY_FIELD</span>"; return; }
            statusDiv.innerHTML = "<span style='color:#00ff41;'>[~] VERIFYING_DIGITAL_SIGNATURE...</span>";
            
            setTimeout(() => {
                if (correctPassword !== "" && inputKey === correctPassword) {
                    statusDiv.innerHTML = "<span style='color:#00ff41;'>[+] SIGNATURE_VALID. OVERRIDING...</span>";
                    setTimeout(showMainOptionsPanel, 1000);
                } else {
                    statusDiv.innerHTML = "<span style='color:#ff3333;'>[!] INVALID_KEY. ACCESS_DENIED.</span>";
                }
            }, 600);
        });
    })();
})();
