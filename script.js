// Изготвено от Борис Иванов, 9А. Випуск 2024/2025
const cellWrapper = document.querySelector('.cell-wrapper');
const info = document.getElementById('info');
const infoImg = document.getElementById('info-img');
const infoTitle = document.getElementById('info-title');
const infoSubtitle = document.getElementById('info-subtitle');
const infoText = document.getElementById('info-text');
const infoTemplates = document.getElementById('info-templates');
const line = document.getElementById('line');

let activeId = null;
let lineLength = 0;
let isCooldown = false;

document.querySelectorAll('.hotspot').forEach(button => {
  button.addEventListener('click', () => {
    if (isCooldown) return;
    isCooldown = true;
    setTimeout(() => isCooldown = false, 2000);

    const id = button.dataset.id;
    if (activeId === id) {
      activeId = null;
      retractLine(() => reset());
    } else {
      activeId = id;
      showInfo(id, button);
    }
  });
});

function showInfo(id, button) {
  cellWrapper.style.transform = 'translateX(-150px)';
  const template = infoTemplates.querySelector(`[data-id="${id}"]`);
  const imgSrc = template.dataset.img;
  const title = template.querySelector('h2').textContent;

  infoImg.src = imgSrc;
  infoTitle.textContent = title;

  // Clear previous subtitles and paragraphs
  infoSubtitle.innerHTML = '';
  infoText.innerHTML = '';

  // Add all <h4> elements
  template.querySelectorAll('h4').forEach(h4 => {
    const h4Elem = document.createElement('h4');
    h4Elem.textContent = h4.textContent;
    infoSubtitle.appendChild(h4Elem);
  });

  // Add all <p> elements
  template.querySelectorAll('p').forEach(p => {
    const pElem = document.createElement('p');
    pElem.innerHTML = p.innerHTML; // Preserves <br> and other inline HTML
    infoText.appendChild(pElem);
  });

  info.style.opacity = 1;

  setTimeout(() => {
    const hotspotRect = button.getBoundingClientRect();
    const infoImgRect = infoImg.getBoundingClientRect();

    const x1 = hotspotRect.left + hotspotRect.width / 2;
    const y1 = hotspotRect.top + hotspotRect.height / 2;
    const x2 = infoImgRect.left + infoImgRect.width / 2;
    const y2 = infoImgRect.top + infoImgRect.height / 2;

    const dx = x2 - x1;
    const dy = y2 - y1;
    lineLength = Math.sqrt(dx * dx + dy * dy);

    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke-dasharray', lineLength);
    line.setAttribute('stroke-dashoffset', lineLength);

    requestAnimationFrame(() => {
      line.style.transition = 'stroke-dashoffset 0.5s ease';
      line.setAttribute('stroke-dashoffset', '0');
    });
  }, 100);
}


function retractLine(callback) {
  line.style.transition = 'stroke-dashoffset 0.5s ease';
  line.setAttribute('stroke-dashoffset', lineLength);
  setTimeout(callback, 500);
}

function reset() {
  cellWrapper.style.transform = '';
  info.style.opacity = 0;
  setTimeout(() => {
    infoImg.src = '';
    infoTitle.textContent = '';
    infoSubtitle.textContent = '';
    infoText.textContent = '';
    line.setAttribute('x1', 0);
    line.setAttribute('y1', 0);
    line.setAttribute('x2', 0);
    line.setAttribute('y2', 0);
    line.setAttribute('stroke-dasharray', 0);
    line.setAttribute('stroke-dashoffset', 0);
  }, 500);
}

// Loading spinner
window.addEventListener('load', () => {
  const spinner = document.getElementById('loading-spinner');
  setTimeout(() => {
    spinner.style.opacity = '0';
    setTimeout(() => spinner.remove(), 500);
  }, 3000);
});
