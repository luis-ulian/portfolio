//x e y sao a posição da cidade no mapa (svg de 1200x680)
const cities = {
    sobre: {
        name: "Sobre mim",
        x: 303 / 1200,
        y: 316 / 680,
        test: "Intuição",
        results: [
            "Você me confundiu com um NPC qualquer da taverna.",
            "Você sente que tem uma história aqui, mas ainda não sabe qual.",
            "Você percebe alguém que começou cedo e não parou mais.",
            "Intuição afiada: essa curiosidade ainda vai longe.",
            "Você já está pensando em me chamar para o seu grupo."
        ]
    },
    projetos: {
        name: "Projetos",
        x: 682 / 1200,
        y: 241 / 680,
        test: "Percepção",
        results: [
            "Você tropeçou num bug e caiu dentro do repositório.",
            "Você vê projetos, mas não repara no capricho dos detalhes.",
            "Você nota o cuidado: até este mapa foi desenhado à mão em SVG.",
            "Você percebe que o próximo projeto vai ser ainda melhor.",
            "Você encontrou o tesouro escondido: este portfólio é incrível."
        ]
    },
    habilidades: {
        name: "Habilidades",
        x: 898 / 1200,
        y: 481 / 680,
        test: "Inteligência",
        results: [
            "Você tentou centralizar uma div e perdeu 1d6 de sanidade.",
            "Runas demais. Talvez com um pergaminho de tradução…",
            "Você reconhece as ferramentas e entende como elas se encaixam.",
            "Você nota que o inventário cresce a cada aventura.",
            "Você aprendeu uma magia nova só de olhar."
        ]
    },
    contato: {
        name: "Contato",
        x: 493 / 1200,
        y: 505 / 680,
        test: "Persuasão",
        results: [
            "Uma gaivota levou sua carta. Melhor tentar o e-mail.",
            "Você hesita no cais… mas uma mensagem curta já basta.",
            "Você convence o capitão: a carta parte hoje.",
            "Vento a favor! Sua mensagem vai chegar rapidinho.",
            "Você já está escrevendo o e-mail, não está?"
        ]
    }
};

const order = ["sobre", "projetos", "habilidades", "contato"];
const rollTitles = ["Falha crítica", "Falhou", "Sucesso", "Grande sucesso", "Acerto crítico!"];

const frame = document.getElementById("atlas");
const mapWindow = document.getElementById("mapWindow");
const scene = document.getElementById("mapScene");
const detail = document.getElementById("detail");
const legend = document.getElementById("legend");
const backButton = document.getElementById("backButton");
const diceButton = document.getElementById("diceButton");
const diceNumber = document.getElementById("diceNumber");
const diceInstruction = document.getElementById("diceInstruction");
const testName = document.getElementById("testName");
const rollTitle = document.getElementById("rollTitle");
const rollMessage = document.getElementById("rollMessage");
const prevButton = document.getElementById("prevCity");
const nextButton = document.getElementById("nextCity");
const copyButton = document.getElementById("copyEmail");
const copyStatus = document.getElementById("copyStatus");

//no tablet/celular o painel fica embaixo do mapa
const stacked = window.matchMedia("(max-width: 900px)");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let current = null;
let lastButton = null;
let rollInterval = 0;
let resizeFrame = 0;

const limit = (value, min, max) => {
    if(value < min) return min;
    if(value > max) return max;
    return value;
}

const getZoom = (id) => {
    const city = cities[id];
    let scale = 2.6;
    let panelSpace = detail.offsetWidth + 40;

    if(stacked.matches){
        scale = 2.3;
        panelSpace = 0;
    }

    const width = mapWindow.clientWidth;
    const height = mapWindow.clientHeight;
    const sceneWidth = scene.offsetWidth;
    const sceneHeight = scene.offsetHeight;
    const sceneLeft = scene.offsetLeft;
    const sceneTop = scene.offsetTop;

    //centraliza a cidade no espaço que sobra do lado do painel
    const targetX = (width - panelSpace) / 2;
    const targetY = height / 2;

    //o limit impede que a borda do mapa apareça quando a cidade ta perto do canto
    const x = limit(targetX - sceneLeft - scale * city.x * sceneWidth, width - sceneLeft - scale * sceneWidth, -sceneLeft);
    const y = limit(targetY - sceneTop - scale * city.y * sceneHeight, height - sceneTop - scale * sceneHeight, -sceneTop);

    return `translate(${x}px, ${y}px) scale(${scale})`;
}

const zoomWithoutAnimation = (transform) => {
    scene.classList.add("no-transition");
    scene.style.transform = transform;
    scene.offsetWidth; //força o navegador a aplicar antes de voltar a animação
    scene.classList.remove("no-transition");
}

const openCity = (id, updateHistory = true, instant = false) => {
    if(!cities[id]) return;

    const city = cities[id];
    const wasOpen = current !== null;
    current = id;

    for(const panel of document.querySelectorAll(".city-panel")){
        panel.classList.toggle("active", panel.id === "panel-" + id);
    }
    for(const button of document.querySelectorAll(".city")){
        button.setAttribute("aria-expanded", button.dataset.city === id);
    }

    frame.classList.add("is-open");
    mapWindow.classList.add("focused", "explored");
    scene.inert = true;
    legend.inert = true;
    detail.inert = false;
    backButton.hidden = false;

    if(instant){
        zoomWithoutAnimation(getZoom(id));
    } else {
        scene.style.transform = getZoom(id);
    }

    //botoes de anterior e proxima, dando a volta no final da lista
    const index = order.indexOf(id);
    const prev = order[(index - 1 + order.length) % order.length];
    const next = order[(index + 1) % order.length];
    prevButton.dataset.city = prev;
    nextButton.dataset.city = next;
    prevButton.querySelector(".nav-name").textContent = cities[prev].name;
    nextButton.querySelector(".nav-name").textContent = cities[next].name;

    resetDice(city.test);
    document.title = city.name + " — Atlas de Luís Ulian";

    if(updateHistory && location.hash !== "#" + id){
        history.pushState(null, "", "#" + id);
    }

    detail.scrollTop = 0;
    if(stacked.matches){
        let behavior = "smooth";
        if(instant || reducedMotion.matches) behavior = "auto";
        frame.scrollIntoView({ behavior: behavior, block: "start" });
    }

    if(!instant || wasOpen){
        document.getElementById("panel-" + id).focus({ preventScroll: true });
    }
}

const closeCity = (updateHistory = true) => {
    if(current === null) return;

    const closed = current;
    current = null;
    stopRolling();

    frame.classList.remove("is-open");
    mapWindow.classList.remove("focused");
    scene.style.transform = "";
    scene.inert = false;
    legend.inert = false;
    detail.inert = true;
    backButton.hidden = true;
    for(const button of document.querySelectorAll(".city")){
        button.setAttribute("aria-expanded", "false");
    }
    document.title = "Atlas de Luís Ulian — Portfólio";

    if(updateHistory && location.hash){
        history.pushState(null, "", location.pathname + location.search);
    }

    //volta o foco pro botao que abriu a cidade
    let returnTo = document.querySelector('.city[data-city="' + closed + '"]');
    if(lastButton && lastButton.isConnected) returnTo = lastButton;
    returnTo.focus({ preventScroll: !stacked.matches });
}

const routeFromHash = (instant = false) => {
    const id = decodeURIComponent(location.hash.slice(1));

    if(cities[id]){
        if(id !== current) openCity(id, false, instant);
    } else {
        closeCity(false);
    }
}

const resetDice = (test) => {
    stopRolling();
    testName.textContent = test;
    diceNumber.textContent = "20";
    diceInstruction.hidden = false;
    rollTitle.textContent = "";
    rollMessage.textContent = "";
    diceButton.classList.remove("crit", "fumble");
}

const stopRolling = () => {
    clearInterval(rollInterval);
    diceButton.classList.remove("rolling");
    diceButton.disabled = false;
}

const getResultIndex = (roll) => {
    if(roll === 1) return 0;
    if(roll <= 9) return 1;
    if(roll <= 15) return 2;
    if(roll <= 19) return 3;
    return 4;
}

const showRoll = (roll) => {
    stopRolling();
    const index = getResultIndex(roll);

    diceNumber.textContent = roll;
    diceButton.classList.toggle("crit", roll === 20);
    diceButton.classList.toggle("fumble", roll === 1);
    rollTitle.textContent = rollTitles[index] + " (" + roll + ")";
    rollMessage.textContent = cities[current].results[index];
}

const rollDice = () => {
    if(!current || diceButton.classList.contains("rolling")) return;

    const roll = Math.floor(Math.random() * 20) + 1;
    diceButton.classList.remove("crit", "fumble");
    diceInstruction.hidden = true;
    rollTitle.textContent = "";
    rollMessage.textContent = "";

    if(reducedMotion.matches){
        showRoll(roll);
        return;
    }

    //fica trocando os numeros ate dar o tempo da animação
    diceButton.classList.add("rolling");
    diceButton.disabled = true;
    const started = performance.now();
    rollInterval = setInterval(() => {
        if(performance.now() - started >= 650){
            showRoll(roll);
        } else {
            diceNumber.textContent = Math.floor(Math.random() * 20) + 1;
        }
    }, 70);
}

//jeito antigo de copiar, pra quando o navegador nao deixa usar o clipboard
const copyWithTextarea = (text) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    textarea.remove();
    return copied;
}

const copyEmail = async() => {
    const email = copyButton.dataset.email;
    try{
        await navigator.clipboard.writeText(email);
        copyStatus.textContent = "Endereço copiado!";
    } catch(error){
        console.log("erro ao copiar email: " + error);
        if(copyWithTextarea(email)){
            copyStatus.textContent = "Endereço copiado!";
        } else {
            copyStatus.textContent = "Não deu para copiar. O endereço está logo acima.";
        }
    }
    setTimeout(() => {
        copyStatus.textContent = "";
    }, 3000);
}

for(const button of document.querySelectorAll(".city, .legend-list button")){
    button.addEventListener("click", () => {
        lastButton = button;
        openCity(button.dataset.city);
    });
}

prevButton.addEventListener("click", () => openCity(prevButton.dataset.city));
nextButton.addEventListener("click", () => openCity(nextButton.dataset.city));
backButton.addEventListener("click", () => closeCity());
diceButton.addEventListener("click", rollDice);
copyButton.addEventListener("click", copyEmail);

window.addEventListener("popstate", () => routeFromHash());
window.addEventListener("hashchange", () => routeFromHash());

document.addEventListener("keydown", (e) => {
    if(e.altKey || e.ctrlKey || e.metaKey || !current) return;

    if(e.key === "Escape") closeCity();
    if(e.key === "ArrowLeft") prevButton.click();
    if(e.key === "ArrowRight") nextButton.click();
});

window.addEventListener("resize", () => {
    if(!current) return;
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => {
        zoomWithoutAnimation(getZoom(current));
    });
});

detail.inert = true;
routeFromHash(true);
