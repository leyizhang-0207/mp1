/* Your JS here. */


const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));

document.addEventListener('DOMContentLoaded', () => {
  $('#year').textContent = new Date().getFullYear();//year in footer


  const nav = $('#navbar');
  const progress = $('#read-progress');
  const root = document.documentElement;

  const onScroll = () => {
    const y = window.scrollY || window.pageYOffset;
    const docH = document.body.scrollHeight - window.innerHeight;
    progress.style.width = `${(y / (docH || 1)) * 100}%`;
    nav.classList.toggle('shrink', y > 10);

    const navBottom = nav.getBoundingClientRect().bottom + window.scrollY;
    let activeId = null;
    const sections = ['hero','about','experience','projects','skills','media','contact']
    .map(id => {
        const el = $('#' + id);
        if (!el) return null;
        return { id, top: el.offsetTop };
    })
    .filter(Boolean);

    for (let i = 0; i < sections.length; i++) {
      if (sections[i].top <= navBottom + 1) activeId = sections[i].id;
    }
    if ((window.innerHeight + y) >= (document.body.scrollHeight - 2)) {
      activeId = 'contact';
    }

    $$('.nav-links a').forEach(a => {
      a.classList.toggle('is-active', a.getAttribute('href') === `#${activeId}`);
    });
  };

  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  
  $$('.nav-links a, a.btn[href^="#"]').forEach(link => {//smooth scroll
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = nav.classList.contains('shrink')
        ? parseInt(getComputedStyle(root).getPropertyValue('--nav-height-small'))
        : parseInt(getComputedStyle(root).getPropertyValue('--nav-height-big'));
      const y = target.getBoundingClientRect().top + window.scrollY - navH + 1;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });

  const carousel = $('.carousel');//sliding carousel with aniamtions
  if (carousel) {
    const track = $('.car-track', carousel);
    const slides = $$('.car-slide', carousel);
    const btnPrev = $('.car-arrow.left', carousel);
    const btnNext = $('.car-arrow.right', carousel);
    const dotsWrap = $('.car-dots', carousel);
    let index = 0;
    let timer;

    const go = (i) => {
      const newIndex = (i + slides.length) % slides.length;
      if (slides.length > 0) {
        const slideWidth = slides[0].clientWidth;
        track.style.transform = `translateX(-${newIndex * slideWidth}px)`;
      }
      
      if (dotsWrap.children[index]) {
        dotsWrap.children[index].setAttribute('aria-selected', 'false');
      }
      if (dotsWrap.children[newIndex]) {
        dotsWrap.children[newIndex].setAttribute('aria-selected', 'true');
      }
      index = newIndex;
    };

    slides.forEach((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', `Go to slide ${i + 1}`);
      b.addEventListener('click', () => go(i));
      dotsWrap.appendChild(b);
    });

    btnPrev.addEventListener('click', () => go(index - 1));
    btnNext.addEventListener('click', () => go(index + 1));

    const startTimer = () => {
      timer = setInterval(() => go(index + 1), 5000);
    };
    const stopTimer = () => clearInterval(timer);

    carousel.addEventListener('mouseenter', stopTimer);
    carousel.addEventListener('mouseleave', startTimer);

    go(0);
    startTimer();
  }


  $$('.exp-card').forEach(card => {  //experience card flip
    const flipCard = () => card.classList.toggle('is-flipped');
    const closeButton = card.querySelector('[data-flip-back]');

    card.addEventListener('click', (e) => {
      if (e.target !== closeButton) flipCard();
    });

    if (closeButton) {
      closeButton.addEventListener('click', (e) => {
        e.stopPropagation();
        flipCard();
      });
    }
  });

  //modal
  const openModal = (modal) => {
    if (!modal) return;
    document.body.classList.add('modal-open');
    modal.hidden = false;
  };

  const closeModal = (modal) => {
    if (!modal) return;
    document.body.classList.remove('modal-open');
    modal.hidden = true;
  };

  document.addEventListener('click', (e) => {
    const targetButton = e.target.closest('[data-modal-target]');
    if (targetButton) {
      const modal = $(targetButton.dataset.modalTarget);
      openModal(modal);
    }
  });

  document.addEventListener('click', (e) => {
    const targetButton = e.target.closest('[data-close]');
    if (targetButton) {
      const modal = targetButton.closest('.modal');
      closeModal(modal);
    }
  });
});