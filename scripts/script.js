const getLinkTarget = link => link.tagName === 'A' ? link.getAttribute('href').replace(/^(#)(.+)/, '$2') : null;

const burgersInput = document.querySelector('[name="burgers"]');
const overlay = document.querySelector('.overlay');
const popup = document.getElementById('order-is-processed');
const productPrice = document.querySelectorAll('.product__price');

const [popupName, popupOrderList] = popup.querySelectorAll('.popup__name, .popup__order-list');

const linksTarget = [...document.querySelectorAll('.nav-link')].reduce((sections, link) => {
  const target = getLinkTarget(link);
  
  !sections[target] && (sections[target] = document.getElementById(target));

  return sections;
}, {});

const scrollToTarget = target => linksTarget[target].scrollIntoView({behavior: 'smooth'});

document.addEventListener('click', e => {
  const {target} = e;
  const isOverlay = overlay === target;
  const link = target.closest('.nav-link');
  const productButton = target.closest('.product__button');
  const closePopup = target.closest('.popup__cloce');
  const chengeCurrency = target.closest('#change-currency');

  if (!link && !productButton && !closePopup && !isOverlay && !chengeCurrency) return;

  if (isOverlay || closePopup) {
    overlay.classList.remove('_active');
    popup.classList.remove('_show');
  }

  if (link) {
    e.preventDefault();
    scrollToTarget(getLinkTarget(link));
  }

  if (productButton) {
    const productName = productButton.closest('.product').querySelector('.product__title').textContent;

    scrollToTarget('order');

    burgersInput.value += burgersInput.value ? `, ${productName}` : productName;    
  }

  if (chengeCurrency) {

    console.log(chengeCurrency, target.innerText);
    let newCurrency = target.innerText;
    let coefficient = 1;

    switch (newCurrency) {
      case '$':
        newCurrency = '₽';
        coefficient = 80;
        break;
      case '₽':
        newCurrency = 'BYN';
        coefficient = 3;
        break;
      case 'BYN':
        newCurrency = '€';
        coefficient = .9;
        break;
      case '€':
        newCurrency = '¥';
        coefficient = 6.9;
        break;
      default:
        newCurrency = ''
        coefficient = 1;
    }

    target.innerText = newCurrency;
    productPrice.forEach(item => item.textContent = `${(+item.dataset.basePrice * coefficient).toFixed(1)} ${newCurrency}`);
  }
});

document.forms.order.addEventListener('invalid', e => {
  const {target} = e;

  e.preventDefault();
  
  target.parentElement.style.background = 'red';
  setTimeout(() => target.parentElement.style.cssText = '', 1000);
}, true);

document.forms.order.addEventListener('submit', e => {
  const {target: form} = e;
  const formData = new FormData(form);

  e.preventDefault();
  
  overlay.classList.add('_active');
  popup.classList.add('_show');
  popupName.textContent = formData.get('name');
  popupOrderList.innerHTML = formData.get('burgers').split(/\s*\,\s*/g).map(item => `<li class="popup__order-item">${item}</li>`).join(' ');

  form.reset(); 
});