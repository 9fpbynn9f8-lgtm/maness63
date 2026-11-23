// MENU MOBILE
const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuButton && navLinks) {
  menuButton.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');

    menuButton.setAttribute(
      'aria-expanded',
      String(isOpen)
    );
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    });
  });
}

// ANNÉE AUTOMATIQUE
document.getElementById('year').textContent =
  new Date().getFullYear();

// FORMULAIRE WHATSAPP
const projectForm = document.getElementById('project-form');

if (projectForm) {
  projectForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = new FormData(projectForm);

    const message = [
      'Bonjour, je souhaite parler de mon projet carrelage.',
      `Nom : ${data.get('nom')}`,
      `Téléphone : ${data.get('telephone') || 'Non renseigné'}`,
      `E-mail : ${data.get('email') || 'Non renseigné'}`,
      `Projet : ${data.get('type')}`,
      `Message : ${data.get('message')}`
    ].join('\n');

    const url =
      'https://api.whatsapp.com/send?phone=33660079044&text='
      + encodeURIComponent(message);

    window.open(url, '_blank', 'noopener');
  });
}

// PAIEMENT STRIPE
// Le serveur doit exposer POST /create-checkout-session.

const payButton = document.getElementById('payer-consultation');

if (payButton) {
  payButton.addEventListener('click', async () => {

    payButton.disabled = true;
    payButton.textContent = 'Préparation du paiement…';

    try {
      const response = await fetch(
        '/create-checkout-session',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            prestation: 'consultation'
          })
        }
      );

      const result = await response.json();

      if (!response.ok || !result.url) {
        throw new Error(
          result.error || 'La session de paiement n’a pas été créée.'
        );
      }

      window.location.href = result.url;

    } catch (error) {
      console.error(error);

      alert(
        'Le paiement ne peut pas être lancé. Vérifiez la route Stripe dans server.js et réessayez.'
      );

      payButton.disabled = false;
      payButton.textContent = 'Payer ma consultation – 40 €';
    }
  });
}

         
