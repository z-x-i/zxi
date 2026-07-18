(function() {
    "use strict";

    // আপনার মেইন ব্যাকএন্ড সার্ভার ইউআরএল
    const SERVER_URL = "https://zxi-file-loader.ah4734536.workers.dev"; 

    // ক্লিনআপ: আগের কোনো এলিমেন্ট থাকলে তা রিমুভ করা হচ্ছে
    const oldOverlay = document.getElementById('zxi-global-overlay');
    if(oldOverlay) oldOverlay.remove();

    let matrixInterval = null;

    // নতুন গোল্ডেন-ব্ল্যাক লাক্সারি স্টাইল ইনজেকশন
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
        @keyframes gold-pulse {
            0%, 100% { box-shadow: 0 0 25px rgba(255, 215, 0, 0.2); border-color: rgba(255, 215, 0, 0.4); }
            50% { box-shadow: 0 0 45px rgba(255, 215, 0, 0.5); border-color: rgba(255, 215, 0, 0.9); }
        }
        .zxi-gold-btn { width: 100%; padding: 16px; border-radius: 12px; font-weight: bold; cursor: pointer; font-size: 14px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; letter-spacing: 2px; margin-bottom: 14px; border: 1px solid #ffd700; background: transparent; color: #ffd700; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); text-shadow: 0 0 5px rgba(255, 215, 0, 0.5); position: relative; z-index: 2; overflow: hidden; }
        .zxi-gold-btn:hover { background: #ffd700; color: #000; box-shadow: 0 0 25px #ffd700; text-shadow: none; }
        
        .zxi-input-gold { width: 100%; padding: 16px; margin-bottom: 25px; border: 1px solid rgba(255, 215, 0, 0.3); border-radius: 12px; background: rgba(15, 15, 15, 0.85); color: #fff; text-align: center; font-size: 15px; outline: none; font-family: monospace; transition: all 0.3s; position: relative; z-index: 2; }
        .zxi-input-gold:focus { border-color: #ffd700; box-shadow: 0 0 15px rgba(255, 215, 0, 0.3); }
        
        /* গোল্ডেন টাচ রিপল ইফেক্ট */
        .zxi-gold-ripple { position: absolute; background: rgba(255, 215, 0, 0.4); border-radius: 50%; pointer-events: none; transform: scale(0); animation: zxi-ripple-effect 0.6s cubic-bezier(0.1, 0.8, 0.3, 1); z-index: 999999; }
        @keyframes zxi-ripple-effect { to { transform: scale(6); opacity: 0; } }
    `;
    document.head.appendChild(styleSheet);

    // পুরো স্ক্রিন কালো করার জন্য ফুল-স্ক্রিন ওভারলে কন্টেইনার
    const globalOverlay = document.createElement('div');
    globalOverlay.id = 'zxi-global-overlay';
    globalOverlay.style.cssText = 'position:fixed; top:0; left:0; width:100vw; height:100vh; background:#000000; z-index:2147483646; overflow:hidden; display:flex; align-items:center; justify-content:center;';
    
    // ফুল-স্ক্রিন গোল্ডেন ক্যানভাস এবং মেইন ইন্টারফেস কন্টেইনার
    globalOverlay.innerHTML = `
        <canvas id="matrix-fullscreen-canvas" style="position:absolute; top:0; left:0; width:100%; height:100%; z-index:1; opacity:0.35; pointer-events:none;"></canvas>
        
        <!-- মেইন কনসোল বক্স -->
        <div id="zxi-auth-box" style="position:relative; z-index:2; background:rgba(10, 10, 10, 0.85); backdrop-filter:blur(25px); -webkit-backdrop-filter:blur(25px); color:#ffd700; padding:45px 35px; border-radius:24px; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; text-align:center; border:1px solid rgba(255, 215, 0, 0.3); width:390px; box-sizing:border-box; animation: gold-pulse 4s infinite ease-in-out;">
            <button id="zxi-panel-close" style="position:absolute; top:20px; right:20px; background:none; border:none; color:#ff4444; font-size:16px; cursor:pointer; font-family:monospace; font-weight:bold; outline:none; transition:0.3s;">[ CLOSE ]</button>
            
            <div id="zxi-dynamic-content">
                <h3 style="margin:15px 0 6px 0; color:#ffd700; font-size:24px; font-weight:800; letter-spacing:3px; text-shadow: 0 0 12px rgba(255, 215, 0, 0.6);">ZXI PREMIUM</h3>
                <p style="margin:0 0 30px 0; color:#888; font-size:11px; letter-spacing:4px; font-family:monospace;">CORE.SYSTEM.INITIALIZATION</p>
                
                <input type="password" id="zxi-key-input" class="zxi-input-gold" placeholder="[ ENTER ACCESS KEY ]">
                <button id="zxi-login-btn" class="zxi-gold-btn" style="background:#ffd700; color:#000; font-weight:900;">DECRYPT CORE</button>
                
                <div id="zxi-status" style="margin-top:20px; font-size:11px; font-weight:bold; color:#555; letter-spacing:2px; font-family:monospace;">STATUS: STANDBY</div>
            </div>
        </div>
    `;
    document.body.appendChild(globalOverlay);

    // টাচ/ক্লিক সোনালী রিপল ইফেক্ট
    globalOverlay.addEventListener('click', (e) => {
        const ripple = document.createElement('div');
        ripple.className = 'zxi-gold-ripple';
        globalOverlay.appendChild(ripple);
        ripple.style.left = `${e.clientX - 10}px`;
        ripple.style.top = `${e.clientY - 10}px`;
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.addEventListener('animationend', () => ripple.remove());
    });

    // ফুল-স্ক্রিন গোল্ডেন চাইনিজ রেইন এনিমেশন (ঝিনুকের মতো উজ্জ্বল স্পার্কল ইফেক্ট সহ)
    function initGoldMatrixRain() {
        const canvas = document.getElementById('matrix-fullscreen-canvas');
        if(!canvas) return;
        const ctx = canvas.getContext('2d');
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // প্রফেশনাল ট্র্যাডিশনাল চাইনিজ ক্যারেক্টার সেট
        const chinese = "零一二三四五六七八九十百千万亿𪚥𩶘𩙖𢏵𣡽𤳏𦈡𧚔𨷿𩬊𪏵𧿏永和三暮春之初會於會稽山陰之蘭亭修禊事也群賢畢至少長咸集";
        const alphabet = chinese.split("");

        const fontSize = 16; // একটু বড় সাইজ যাতে স্ক্রিনে দেখতে গর্জিয়াস লাগে
        const columns = canvas.width / fontSize;
        const rainDrops = Array(Math.floor(columns)).fill(1);

        const draw = () => {
            // গভীর পিচ-ব্ল্যাক ফেড আউট ট্রেইল
            ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < rainDrops.length; i++) {
                const text = alphabet[Math.floor(Math.random() * alphabet.length)];
                
                // ঝিনুকের মতো ঝকঝকে ভাইব্রেন্ট গোল্ডেন গ্রেডিয়েন্ট তৈরি
                const isBright = Math.random() > 0.93; // কিছু ক্যারেক্টার এক্সট্রা গ্লো করবে
                ctx.fillStyle = isBright ? '#ffffff' : '#ffd700';
                ctx.shadowColor = '#ffd700';
                ctx.shadowBlur = isBright ? 20 : 6; // স্পার্কলিং গ্লো ইফেক্ট

                ctx.font = 'bold ' + fontSize + 'px monospace';
                ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

                // শ্যাডো রিসেট করা হচ্ছে পরেরগুলোর পারফরম্যান্সের জন্য
                ctx.shadowBlur = 0;

                if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.985) {
                    rainDrops[i] = 0;
                }
                rainDrops[i]++;
            }
        };
        
        // উইন্ডো রিসাইজ হ্যান্ডলার
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });

        matrixInterval = setInterval(draw, 33);
    }
    
    setTimeout(initGoldMatrixRain, 50);

    // ক্লোজ ও ক্লিনআপ
    function cleanup() {
        if(matrixInterval) clearInterval(matrixInterval);
        globalOverlay.remove();
    }
    document.getElementById('zxi-panel-close').addEventListener('click', cleanup);

    // মেইন বাইপাস ইন্টারফেস (সোনালী থিমে সাজানো)
    function showMainOptionsPanel() {
        const contentDiv = document.getElementById('zxi-dynamic-content');
        contentDiv.innerHTML = `
            <h3 style="margin:15px 0 6px 0; color:#ffd700; font-size:22px; font-weight:800; letter-spacing:2px; text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);">// CORE_TERMINAL</h3>
            <p style="margin:0 0 25px 0; color:#888; font-size:11px; letter-spacing:2px; font-family:monospace;">ACCESS AUTHORIZED. SYSTEM READY.</p>
            
            <input type="text" id="zxi-bypass-input" class="zxi-input-gold" placeholder="[ PASTE TARGET URL ]" style="text-align: left; padding-left: 15px;">
            <button id="zxi-fetch-bypass-btn" class="zxi-gold-btn">RUN AUTOMATED EXPLOIT</button>
            
            <div id="zxi-bypass-status" style="margin-top:20px; font-size:11px; font-weight:bold; color:#555; letter-spacing:1px; font-family:monospace;">STATUS: INJECTOR_IDLE</div>
        `;

        const bypassInput = document.getElementById('zxi-bypass-input');
        const fetchBtn = document.getElementById('zxi-fetch-bypass-btn');
        const bStatus = document.getElementById('zxi-bypass-status');

        fetchBtn.addEventListener('click', async () => {
            const urlVal = bypassInput.value.trim();
            if (!urlVal) {
                bStatus.innerHTML = "<span style='color:#ff4444;'>[!] ERROR: URL INSTANCE REQUIRED</span>";
                return;
            }

            bStatus.innerHTML = "<span style='color:#ffd700;'>[~] INJECTING EXPLOIT PAYLOAD...</span>";
            fetchBtn.disabled = true;
            fetchBtn.style.opacity = "0.4";

            try {
                const response = await fetch(`${SERVER_URL}/api/bypass?url=${encodeURIComponent(urlVal)}`);
                const data = await response.json();
                
                if (data && data.bypassed_url) {
                    bStatus.innerHTML = "<span style='color:#00ff66;'>[+] DATA DECRYPTED SUCCESSFULLY ✓</span>";
                    bypassInput.value = data.bypassed_url;
                    bypassInput.select();
                    
                    fetchBtn.outerHTML = `<button id="zxi-copy-btn" class="zxi-gold-btn" style="background:#ffd700; color:#000; box-shadow: 0 0 20px #ffd700;">EXTRACT DATA (COPY)</button>`;
                    
                    document.getElementById('zxi-copy-btn').addEventListener('click', () => {
                        navigator.clipboard.writeText(data.bypassed_url);
                        bStatus.innerHTML = "<span style='color:#00ff66;'>[+] COPIED. ERASING SYSTEM LOGS...</span>";
                        setTimeout(cleanup, 1200);
                    });
                } else {
                    bStatus.innerHTML = "<span style='color:#ff4444;'>[!] INJECTION REJECTED BY SERVER</span>";
                    fetchBtn.disabled = false; fetchBtn.style.opacity = "1";
                }
            } catch (err) {
                bStatus.innerHTML = "<span style='color:#ff4444;'>[!] CRITICAL GATEWAY TIMEOUT</span>";
                fetchBtn.disabled = false; fetchBtn.style.opacity = "1";
            }
        });
    }

    // লগইন চেক হ্যান্ডলার 
    const keyInput = document.getElementById('zxi-key-input');
    const loginBtn = document.getElementById('zxi-login-btn');
    const statusDiv = document.getElementById('zxi-status');

    loginBtn.addEventListener('click', () => {
        const inputKey = keyInput.value.trim();
        if(!inputKey) { 
            statusDiv.innerHTML = "<span style='color:#ff4444;'>[!] AUTHENTICATION KEY REQUIRED</span>"; 
            return; 
        }
        
        statusDiv.innerHTML = "<span style='color:#ffd700;'>COMPUTING ACCESS SIGNATURE...</span>";
        
        setTimeout(() => {
            // ডিফল্ট পাসওয়ার্ড 'admin' রাখা হয়েছে, আপনার সার্ভার লজিক অনুযায়ী বদলাতে পারবেন
            if (inputKey === "admin") {
                statusDiv.innerHTML = "<span style='color:#00ff66;'>ACCESS GRANTED</span>";
                setTimeout(showMainOptionsPanel, 800);
            } else {
                statusDiv.innerHTML = "<span style='color:#ff4444;'>[!] INVALID ACCESS CREDENTIALS</span>";
            }
        }, 600);
    });

})();
