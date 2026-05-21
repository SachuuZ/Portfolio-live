function initTerminal() {

    // --- 1. Terminal State ---
    const terminalBody = document.getElementById('terminal-body');
    const terminalHistory = document.getElementById('history');
    const terminalInput = document.getElementById('terminal-input');
    const clockElement = document.getElementById('clock');

    let isTyping = false; // block input while auto-typing output

    // --- 2. Content Dictionary ---
    const commands = {
        'help': "Available commands:\n\n" +
            "  about          - Learn more about me\n" +
            "  projects       - View my work & and what i did\n" +
            "  skills         - Review my technical Level\n" +
            "  experience     - View my work history\n" +
            "  contact        - Get in touch\n" +
            "  education      - View my education details\n" +
            "  certifications - View my certifications\n" +
            "  leadership     - View leadership roles\n" +
            "  sudo           - Access Denied\n" +
            "  clear          - Clear terminal history",

        'about': "Cybersecurity Researcher and published vulnerability researcher with \n" +
            "hands-on experience in penetration testing, vulnerability assessment, \n" +
            "and Capture the Flag (CTF) architecture design.\n\n" +
            "Discovered more than 20+ vulnerabilities and Recently credited with \n" +
            "CVE-2025-65647 for discovering an IDOR vulnerability in an Online \n" +
            "Shopping Portal and rest are yet to be published.\n\n" +
            "Skilled in conducting research on government websites, identifying \n" +
            "critical security gaps, and delivering detailed reports to \n" +
            "strengthen defense strategies. My commitment to security education \n" +
            "includes extensive community contribution, highlighted by my role as \n" +
            "a Mentor and Instructor who delivered a focused 3-day penetration \n" +
            "testing bootcamp at Providence Women's College, Calicut.\n\n" +
            "Passionate about cybersecurity education, ethical hacking, and \n" +
            "advancing practical security solutions.",

        'projects': "[ 1 ] AutoReconX: Resilient Reconnaissance Script\n" +
            "      Developed a Bash script to automate initial reconnaissance, integrating Subfinder, \n" +
            "      Shodan, and Nuclei, saving multiple hours per day.\n" +
            "      Documented fixes to address the three biggest causes of tool failures.\n\n" +
            "[ 2 ] Password Strength Analyzer\n" +
            "      Developed a tool to evaluate password security using criteria like complexity, \n" +
            "      length, and resistance to attacks. Implemented algorithms to assess entropy.\n" +
            "      Offered functionality via CLI, GUI, and live web versions.",

        'skills': "Pentesting Platforms : TryHackMe (Top 3%), VulnHub\n" +
            "Specializations      : Web Application, Network, Android Pentesting\n" +
            "Tools & Technologies : Nmap, Burp Suite, Wireshark, Metasploit, Hashcat,\n" +
            "                       Peass tools, ADB, Apktool, Jadx, Evil-Winrm, Responder,\n" +
            "                       Shodan, OpenVAS & Nessus, Shell Scripting, Splunk",

        'experience': "Research Team Member @ EHACKIFY (Apr 2025 - Present)\n" +
            " - Co-designed technical architecture for an upcoming Capture the Flag (CTF).\n" +
            " - Performed penetration tests on government websites (team of 5).\n" +
            " - Documented findings and prepared comprehensive security reports.\n\n" +
            "VAPT Intern @ Hacker4Help (Apr 2025 - Jun 2025)\n" +
            " - Engaged in real-time vulnerability assessments and penetration testing tasks.\n" +
            " - Assisted in preparing reports on exploited vulnerabilities.",

        'contact': "Email    : Sachinpv2004@gmail.com\n" +
            "LinkedIn : linkedin.com/in/sachin-p-v",

        'education': "Advanced Pentester (APT)\n" +
            "Ehackify Training & Research Institute (2024 - 2025)\n\n" +
            "Bachelor of Computer Science\n" +
            "NAM College, Kallikkandy, Kannur University (2021 - 2024)",

        'certifications': " - Certified Network Security Practitioner (CNSP) - The SecOps Group\n" +
            " - Introduction to Linux (LFS101) - The Linux Foundation\n" +
            " - Ethical Hacker - Cisco Networking Academy\n" +
            " - Mobile Hacking Lab - Mobile Hacking Lab\n" +
            " - Cybersecurity Analyst Job Simulation - Forage\n" +
            " - CVE-2025-65647 Credited Researcher (IDOR vulnerability)",

        'leadership': " - Mentor and Instructor: 3-day penetration testing bootcamp at Providence \n" +
            "   Women's College, Calicut",

        'sudo': "Nothing much....\nJust a Random Anime dude trying to Live his life."
    };

    // Keep input focused when clicking anywhere in terminal scroll area
    const terminalScroll = document.getElementById('terminal-scroll');
    terminalBody.addEventListener('click', (e) => {
        if (e.target.tagName !== 'A' && e.target.tagName !== 'BUTTON') {
            terminalInput.focus();
        }
    });

    // --- 3. Keystroke Management ---
    terminalInput.addEventListener('keydown', (e) => {
        if (isTyping) {
            e.preventDefault();
            return;
        }

        if (e.key === 'Enter') {
            const cmdToExecute = terminalInput.value.trim().toLowerCase();
            if (cmdToExecute) {
                executeCommand(cmdToExecute);
            }
            terminalInput.value = '';
            scrollToBottom();
        }
    });

    // Handle Quick Links
    document.querySelectorAll('.quick-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            if (isTyping) return;
            const cmd = e.target.getAttribute('data-cmd');
            // Animate typing the command itself slightly before executing
            simulateCommandTyping(cmd);
        });
    });

    function simulateCommandTyping(cmd) {
        isTyping = true;
        terminalInput.value = '';
        let i = 0;
        const typeInterval = setInterval(() => {
            terminalInput.value += cmd[i];
            i++;
            if (i >= cmd.length) {
                clearInterval(typeInterval);
                setTimeout(() => {
                    executeCommand(cmd);
                    terminalInput.value = '';
                }, 200);
            }
        }, 50); // fast typing speed for links
    }

    // --- 4. Command Execution and Typewriter Effect ---
    function executeCommand(cmd) {
        if (cmd === 'clear') {
            terminalHistory.innerHTML = '';
            isTyping = false;
            return;
        }

        // Append user command log
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';

        const promptLine = document.createElement('div');
        promptLine.innerHTML = '<span class="prompt">sachin@portfolio:~$</span><span class="log-cmd">' + cmd + '</span>';
        logEntry.appendChild(promptLine);

        const outputDiv = document.createElement('div');
        outputDiv.className = 'log-output';
        logEntry.appendChild(outputDiv);

        terminalHistory.appendChild(logEntry);
        scrollToBottom();

        // Get text
        let outputText = commands[cmd];
        if (!outputText) {
            outputText = "bash: " + cmd + ": command not found";
        }

        // Play typewriter effect
        typewriterPrint(outputDiv, outputText);
    }

    function typewriterPrint(element, text) {
        isTyping = true;
        let i = 0;
        // In the original, the typing is very fast, line by line or fast chars
        const speed = 15;

        function typeNext() {
            if (i < text.length) {
                // Determine block to type (helps performance vs char by char on large strings)
                let chunk = text.charAt(i);
                // HTML encoding for formatting
                if (chunk === '\n') {
                    element.innerHTML += '<br>';
                } else if (chunk === ' ') {
                    element.innerHTML += '&nbsp;';
                } else {
                    element.innerHTML += chunk;
                }

                i++;
                scrollToBottom();
                setTimeout(typeNext, speed);
            } else {
                isTyping = false;
                terminalInput.focus();
            }
        }

        typeNext();
    }

    function scrollToBottom() {
        // Scroll the inner scroll container, not the outer wrapper
        const scrollEl = document.getElementById('terminal-scroll');
        if (scrollEl) scrollEl.scrollTop = scrollEl.scrollHeight;
    }

    // --- 5. Boot Sequence ---
    // Inject the welcome message manually on load as if "welcome" command was typed
    function bootTerminal() {
        try {
            const logEntry = document.createElement('div');
            logEntry.className = 'log-entry';
            const promptLine = document.createElement('div');
            promptLine.innerHTML = '<span class="prompt">sachin@portfolio:~$</span><span class="log-cmd">welcome</span>';
            logEntry.appendChild(promptLine);
            const outputDiv = document.createElement('div');
            outputDiv.className = 'log-output';
            logEntry.appendChild(outputDiv);
            terminalHistory.appendChild(logEntry);
            scrollToBottom();

            const msg = "Hi, I'm Sachin PV, a Cybersecurity Researcher." +
                "Welcome to my interactive portfolio terminal!\n" +
                "Type 'help' to see available commands.";
            typewriterPrint(outputDiv, msg);
        } catch (err) {
            console.error("bootTerminal ERROR:", err);
            document.body.innerHTML += "<div style='color:red; background:black; padding:20px; font-size:20px; z-index:9999; position:absolute; top:0; left:0;'>bootTerminal ERROR: " + err.message + "</div>";
        }
    }

    setTimeout(bootTerminal, 500);

    // --- 6. Footer Clock ---
    function updateClock() {
        const now = new Date();
        const dateString = now.toLocaleDateString('en-US');
        const timeString = now.toLocaleTimeString('en-US');
        clockElement.textContent = dateString + ", " + timeString;
    }

    setInterval(updateClock, 1000);
    updateClock();
}

function initProfileCard() {
    const wrap = document.getElementById('profile-card-wrapper');
    const shell = document.getElementById('profile-card-shell');
    if (!wrap || !shell) return;

    // "Contact Me" fires terminal contact command
    const contactBtn = document.getElementById('contact-btn');
    if (contactBtn) {
        contactBtn.addEventListener('click', () => {
            const input = document.getElementById('terminal-input');
            if (!input) return;
            input.value = 'contact';
            input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
            input.focus();
        });
    }

    // Spring physics state
    let rafId = null;
    let running = false;
    let lastTs = 0;
    let cX = 0, cY = 0, tX = 0, tY = 0;
    let cpX = 50, cpY = 50, tpX = 50, tpY = 50;

    const TAU = 0.12;
    const MAX_TILT = 8;
    const lerp = (a, b, t) => a + (b - a) * t;

    function applyVars() {
        wrap.style.setProperty('--tilt-x', cX.toFixed(2) + 'deg');
        wrap.style.setProperty('--tilt-y', cY.toFixed(2) + 'deg');
        wrap.style.setProperty('--pointer-x', cpX.toFixed(1) + '%');
        wrap.style.setProperty('--pointer-y', cpY.toFixed(1) + '%');
        const dist = Math.hypot(cpX - 50, cpY - 50) / 50;
        wrap.style.setProperty('--glare-opacity', (dist * 0.4).toFixed(2));
    }

    function step(ts) {
        if (!running) return;
        if (lastTs === 0) lastTs = ts;
        const dt = Math.min((ts - lastTs) / 1000, 0.05);
        lastTs = ts;
        const k = 1 - Math.exp(-dt / TAU);
        cX = lerp(cX, tX, k);
        cY = lerp(cY, tY, k);
        cpX = lerp(cpX, tpX, k);
        cpY = lerp(cpY, tpY, k);
        applyVars();
        const settled = Math.abs(tX - cX) < 0.01 && Math.abs(tY - cY) < 0.01 &&
                        Math.abs(tpX - cpX) < 0.1 && Math.abs(tpY - cpY) < 0.1;
        if (settled) { running = false; lastTs = 0; rafId = null; }
        else { rafId = requestAnimationFrame(step); }
    }

    function startAnim() {
        if (running) return;
        running = true; lastTs = 0;
        rafId = requestAnimationFrame(step);
    }

    function onMove(evt) {
        const rect = shell.getBoundingClientRect();
        const w = rect.width || 1;
        const h = rect.height || 1;
        tpX = Math.max(0, Math.min(100, ((evt.clientX - rect.left) / w) * 100));
        tpY = Math.max(0, Math.min(100, ((evt.clientY - rect.top)  / h) * 100));
        tY =  ((tpX - 50) / 50) * MAX_TILT;
        tX = -((tpY - 50) / 50) * MAX_TILT;
        startAnim();
    }

    shell.addEventListener('pointermove',  onMove);
    shell.addEventListener('pointerenter', (evt) => { wrap.classList.add('active'); onMove(evt); });
    shell.addEventListener('pointerleave', () => {
        wrap.classList.remove('active');
        tX = 0; tY = 0; tpX = 50; tpY = 50;
        startAnim();
    });

    applyVars();
}

function bootstrap() {
    try {
        initTerminal();
        initProfileCard();
    } catch (err) {
        document.body.innerHTML = "<div style='color:red; background:black; padding:20px; font-size:20px;'>ERROR: " + err.message + "<br>" + err.stack + "</div>";
        console.error(err);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
} else {
    bootstrap();
}
