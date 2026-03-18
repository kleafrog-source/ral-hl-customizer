  <? if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();
  $startAssetsPath = ($templateFolder ?? '') . '/assets/image/custom/start';
  ?>
            <div class="start-screen-container">
    <!-- Hero Section -->
    <div class="start-screen-hero">
      <div class="start-screen-hero-left">
        <!-- Текстовый логотип: ТВОЙ / АВТОРСКИЙ / СТИЛЬ -->
        <div class="start-screen-hero-logo">
          <h1>
            <span class="line1">ТВОЙ</span>
            <span class="line2">АВТОРСКИЙ</span>
            <span class="line3">СТИЛЬ</span>
          </h1>
        </div>
        <div class="start-screen-hero-bottom">
          <div class="start-screen-hero-title">
            <p>Персонализация микрофонов СОЮЗ</p>
            <p>Создайте микрофон, который отражает вас</p>
          </div>
          <a href="#startcustom" class="start-screen-hero-cta">
            <p class="start-screen-hero-cta-text">Создать микрофон</p>
            <div class="start-screen-hero-arrow">
              <svg viewBox="0 0 27.5967 23.8994" fill="none">
                <path d="M13.7983 0L27.5967 23.8994H0L13.7983 0Z" fill="#1a1a19"/>
              </svg>
            </div>
          </a>
        </div>
      </div>
      <div class="start-screen-hero-image">
        <img 
          src="<?= htmlspecialchars($startAssetsPath) ?>/hero-mobile-360@1x.webp"
          srcset="
            <?= htmlspecialchars($startAssetsPath) ?>/hero-mobile-360@1x.webp 360w,
            <?= htmlspecialchars($startAssetsPath) ?>/hero-mobile-360@2x.webp 720w,
            <?= htmlspecialchars($startAssetsPath) ?>/hero-tablet-1024@1x.webp 1024w,
            <?= htmlspecialchars($startAssetsPath) ?>/hero-pc-1920@1x.webp 1920w,
            <?= htmlspecialchars($startAssetsPath) ?>/hero-pc-1920@2x.webp 3840w
          "
          sizes="(max-width: 360px) 360px, (max-width: 1024px) 1024px, 1920px"
          alt="Кастомный микрофон СОЮЗ"
        >
      </div>
    </div>

    <!-- Индивидуальность блок -->
    <div class="start-screen-individuality-block animate-on-scroll">
      <div class="start-screen-individuality-title">
        <p>Мы верим,</p>
        <p>что инструмент должен быть</p>
        <p>продолжением вашего творчества.</p>
      </div>
      <p class="start-screen-individuality-text">Именно поэтому мы предлагаем программу индивидуальной персонализации — возможность создать микрофон, который будет уникален как ваш звук. От выбора цвета корпуса до гравировки собственного логотипа — каждая деталь в ваших руках. Наши мастера в Туле воплотят вашу идею с тем же вниманием и точностью, с которыми мы создаём каждый микрофон СОЮЗ.</p>
    </div>

    <!-- Cards Section -->
    <div class="start-screen-cards-section">
      <div class="start-screen-card animate-on-scroll">
        <div class="start-screen-card-icon">
          <svg viewBox="0 0 60.1089 62.4609" fill="none">
            <path d="M43.7662 60.1633C35.6826 56.9052 32.8673 44.8847 33.3084 37.2247H27.4966C27.9377 44.8847 25.1225 56.9052 17.0389 60.1633H43.7662Z" stroke="url(#paint0_linear_price)" stroke-width="4.59518" stroke-linecap="square" stroke-linejoin="bevel"/>
            <circle cx="29.9962" cy="19.0187" r="16.7211" stroke="url(#paint1_linear_price)" stroke-width="4.59518"/>
            <circle cx="29.9971" cy="19.0187" r="9.34067" stroke="url(#paint2_linear_price)" stroke-width="4.59518"/>
            <defs>
              <linearGradient id="paint0_linear_price" x1="17.3538" y1="41.3802" x2="26.8556" y2="43.1998" gradientUnits="userSpaceOnUse">
                <stop stop-color="#368C9D"/>
                <stop offset="1" stop-color="#007187"/>
              </linearGradient>
              <linearGradient id="paint1_linear_price" x1="54.8663" y1="10.6772" x2="23.3572" y2="29.0965" gradientUnits="userSpaceOnUse">
                <stop stop-color="#368C9D"/>
                <stop offset="1" stop-color="#007187"/>
              </linearGradient>
              <linearGradient id="paint2_linear_price" x1="45.216" y1="13.9142" x2="25.9344" y2="25.1856" gradientUnits="userSpaceOnUse">
                <stop stop-color="#368C9D"/>
                <stop offset="1" stop-color="#007187"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div class="start-screen-card-title">
          <p>Стоимость:</p>
          <p>от 10 000 до 50 000 ₽</p>
        </div>
        <div class="start-screen-card-description">
          <p>Цена зависит от сложности опций</p>
          <p>и выбранных материалов</p>
        </div>
      </div>

      <div class="start-screen-card animate-on-scroll">
        <div class="start-screen-card-icon">
          <svg viewBox="0 0 60.1633 60.1633" fill="none">
            <path d="M57.8111 30.0543C57.8111 35.5441 56.1832 40.9106 53.1333 45.4752C50.0833 50.0398 45.7483 53.5974 40.6764 55.6983C35.6045 57.7991 30.0236 58.3488 24.6393 57.2778C19.255 56.2068 14.3092 53.5632 10.4274 49.6813C6.54552 45.7995 3.90194 40.8537 2.83094 35.4694C1.75994 30.0851 2.30962 24.5042 4.41046 19.4323C6.51131 14.3604 10.069 10.0254 14.6335 6.97545C19.1981 3.9255 24.5646 2.29759 30.0544 2.29759" stroke="url(#paint0_linear_time)" stroke-width="4.59518"/>
            <path d="M34.9778 2.7377C37.6882 3.2263 40.3108 4.11556 42.7593 5.37625" stroke="#007187" stroke-width="4.59518"/>
            <path d="M46.6204 7.78345C48.8302 9.4272 50.783 11.3907 52.4147 13.6093" stroke="#007187" stroke-width="4.59518"/>
            <path d="M54.8002 17.483C56.0476 19.9385 56.9225 22.5658 57.3963 25.2788" stroke="#007187" stroke-width="4.59518"/>
            <path d="M30.1626 16.3339V34.8252L47.0332 26.715" stroke="url(#paint1_linear_time)" stroke-width="4.59518" stroke-linecap="square" stroke-linejoin="bevel"/>
            <defs>
              <linearGradient id="paint0_linear_time" x1="30.0544" y1="0" x2="30.0544" y2="60.1087" gradientUnits="userSpaceOnUse">
                <stop stop-color="#368C9D"/>
                <stop offset="1" stop-color="#007187"/>
              </linearGradient>
              <linearGradient id="paint1_linear_time" x1="49.6284" y1="21.5245" x2="35.0301" y2="29.3103" gradientUnits="userSpaceOnUse">
                <stop stop-color="#368C9D"/>
                <stop offset="1" stop-color="#007187"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div class="start-screen-card-title">
          <p>Срок изготовления:</p>
          <p>до 2 месяцев</p>
        </div>
        <div class="start-screen-card-description">
          <p>Зависит от сложности</p>
          <p>выбранных опций</p>
        </div>
      </div>

      <div class="start-screen-card animate-on-scroll">
        <div class="start-screen-card-icon">
          <svg viewBox="0 0 60.1098 60.1089" fill="none">
            <path d="M40.8938 0.52074H54.6374L19.214 59.2315H5.47032L40.8938 0.52074Z" fill="url(#paint0_linear_payment)"/>
            <circle cx="46.5407" cy="46.5398" r="11.2715" stroke="url(#paint1_linear_payment)" stroke-width="4.59518"/>
            <circle cx="13.5691" cy="13.5691" r="11.2715" stroke="url(#paint2_linear_payment)" stroke-width="4.59518"/>
            <defs>
              <linearGradient id="paint0_linear_payment" x1="30.0539" y1="0.52074" x2="30.0539" y2="59.2315" gradientUnits="userSpaceOnUse">
                <stop stop-color="#368C9D"/>
                <stop offset="1" stop-color="#007187"/>
              </linearGradient>
              <linearGradient id="paint1_linear_payment" x1="64.2846" y1="40.5884" x2="41.804" y2="53.7299" gradientUnits="userSpaceOnUse">
                <stop stop-color="#368C9D"/>
                <stop offset="1" stop-color="#007187"/>
              </linearGradient>
              <linearGradient id="paint2_linear_payment" x1="31.313" y1="7.61779" x2="8.83239" y2="20.7592" gradientUnits="userSpaceOnUse">
                <stop stop-color="#368C9D"/>
                <stop offset="1" stop-color="#007187"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div class="start-screen-card-title">
          <p>Предоплата:</p>
          <p>20% от стоимости</p>
        </div>
        <div class="start-screen-card-description">
          <p>Покрывает материалы и резервирует</p>
          <p>производственное время</p>
        </div>
      </div>
    </div>

    <!-- FAQ Title -->
    <h2 class="start-screen-faq-title animate-on-scroll">Часто задаваемые вопросы</h2>

    <!-- FAQ Section -->
    <div class="start-screen-faq-section">
      <div class="start-screen-faq-item animate-on-scroll" onclick="toggleFaq(this)">
        <div class="start-screen-faq-header">
          <p class="start-screen-faq-question">Сколько времени занимает изготовление персонализированного микрофона?</p>
          <div class="start-screen-faq-icon">
            <svg viewBox="0 0 49.0332 49.0332" fill="none">
              <path d="M24.5117 0V49.0332" stroke="#1a1a19" stroke-width="4"/>
              <path d="M8.74228e-08 24.5206L49.0332 24.5206" stroke="#1a1a19" stroke-width="4"/>
            </svg>
          </div>
        </div>
        <div class="start-screen-faq-answer">
          <p>Сроки зависят от сложности персонализации и текущей загрузки мастерской. Обычно это занимает от 4 до 8 недель с момента подтверждения заказа.</p>
          <p>Мы сообщим точные сроки после обсуждения всех деталей вашего проекта.</p>
        </div>
      </div>

      <div class="start-screen-faq-item animate-on-scroll" onclick="toggleFaq(this)">
        <div class="start-screen-faq-header">
          <p class="start-screen-faq-question">Можно ли увидеть, как будет выглядеть микрофон перед производством?</p>
          <div class="start-screen-faq-icon">
            <svg viewBox="0 0 49.0332 49.0332" fill="none">
              <path d="M24.5117 0V49.0332" stroke="#1a1a19" stroke-width="4"/>
              <path d="M8.74228e-08 24.5206L49.0332 24.5206" stroke="#1a1a19" stroke-width="4"/>
            </svg>
          </div>
        </div>
        <div class="start-screen-faq-answer">
          <p>Да. После обсуждения всех опций мы подготовим визуализацию или макет, чтобы вы могли утвердить финальный дизайн перед запуском в производство.</p>
        </div>
      </div>

      <div class="start-screen-faq-item animate-on-scroll" onclick="toggleFaq(this)">
        <div class="start-screen-faq-header">
          <p class="start-screen-faq-question">Какие модели микрофонов доступны для персонализации?</p>
          <div class="start-screen-faq-icon">
            <svg viewBox="0 0 49.0332 49.0332" fill="none">
              <path d="M24.5117 0V49.0332" stroke="#1a1a19" stroke-width="4"/>
              <path d="M8.74228e-08 24.5206L49.0332 24.5206" stroke="#1a1a19" stroke-width="4"/>
            </svg>
          </div>
        </div>
        <div class="start-screen-faq-answer">
          <p>Программа персонализации доступна для большинства наших моделей. Свяжитесь с нами, чтобы уточнить возможности для конкретной модели — некоторые опции могут различаться в зависимости от конструкции микрофона.</p>
        </div>
      </div>

      <div class="start-screen-faq-item animate-on-scroll" onclick="toggleFaq(this)">
        <div class="start-screen-faq-header">
          <p class="start-screen-faq-question">Что такое палитра RAL K7?</p>
          <div class="start-screen-faq-icon">
            <svg viewBox="0 0 49.0332 49.0332" fill="none">
              <path d="M24.5117 0V49.0332" stroke="#1a1a19" stroke-width="4"/>
              <path d="M8.74228e-08 24.5206L49.0332 24.5206" stroke="#1a1a19" stroke-width="4"/>
            </svg>
          </div>
        </div>
        <div class="start-screen-faq-answer">
          <p>RAL K7 — это профессиональная цветовая система, включающая более 200 оттенков. Она используется в промышленном дизайне и позволяет выбрать практически любой цвет — от классических до самых необычных.</p>
          <p>Премиум-цвета из этой палитры доступны за дополнительную плату.</p>
        </div>
      </div>

      <div class="start-screen-faq-item animate-on-scroll" onclick="toggleFaq(this)">
        <div class="start-screen-faq-header">
          <p class="start-screen-faq-question">Можно ли нанести свой логотип вместо эмблемы СОЮЗ?</p>
          <div class="start-screen-faq-icon">
            <svg viewBox="0 0 49.0332 49.0332" fill="none">
              <path d="M24.5117 0V49.0332" stroke="#1a1a19" stroke-width="4"/>
              <path d="M8.74228e-08 24.5206L49.0332 24.5206" stroke="#1a1a19" stroke-width="4"/>
            </svg>
          </div>
        </div>
        <div class="start-screen-faq-answer">
          <p>Да, это возможно. Мы можем заменить стандартную эмблему на ваш логотип.</p>
          <p>Для этого потребуется предоставить векторный файл изображения (AI, EPS или PDF). Эта опция доступна за дополнительную плату.</p>
        </div>
      </div>

      <div class="start-screen-faq-item animate-on-scroll" onclick="toggleFaq(this)">
        <div class="start-screen-faq-header">
          <p class="start-screen-faq-question">Как наносится изображение на деревянный футляр?</p>
          <div class="start-screen-faq-icon">
            <svg viewBox="0 0 49.0332 49.0332" fill="none">
              <path d="M24.5117 0V49.0332" stroke="#1a1a19" stroke-width="4"/>
              <path d="M8.74228e-08 24.5206L49.0332 24.5206" stroke="#1a1a19" stroke-width="4"/>
            </svg>
          </div>
        </div>
        <div class="start-screen-faq-answer">
          <p>Мы используем лазерную гравировку. Это долговечный и точный метод, который сохраняет естественную текстуру дерева.</p>
          <p>Вам нужно будет предоставить растровое изображение или векторный файл.</p>
        </div>
      </div>
    </div>
  </div>
  <script>
function toggleFaq(element) {
    // Закрываем все другие открытые FAQ
    const allFaqItems = document.querySelectorAll('.start-screen-faq-item');
    const currentItem = element.closest('.start-screen-faq-item');
    
    if (!currentItem) return;
    
    // Проверяем, открыт ли текущий элемент
    const isActive = currentItem.classList.contains('active');
    
    if (!isActive) {
        // Закрываем все остальные открытые FAQ
        allFaqItems.forEach(item => {
            if (item !== currentItem && item.classList.contains('active')) {
                item.classList.remove('active');
                const icon = item.querySelector('.start-screen-faq-icon');
                if (icon) {
                    icon.style.transform = 'rotate(0deg)';
                }
            }
        });
        
        // Открываем текущий
        currentItem.classList.add('active');
        const icon = currentItem.querySelector('.start-screen-faq-icon');
        if (icon) {
            icon.style.transform = 'rotate(45deg)';
        }
    } else {
        // Закрываем текущий
        currentItem.classList.remove('active');
        const icon = currentItem.querySelector('.start-screen-faq-icon');
        if (icon) {
            icon.style.transform = 'rotate(0deg)';
        }
    }
}

// Инициализация: закрываем все FAQ при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.start-screen-faq-item');
    faqItems.forEach(item => {
        item.classList.remove('active');
        const icon = item.querySelector('.start-screen-faq-icon');
        if (icon) {
            icon.style.transform = 'rotate(0deg)';
        }
    });
});
</script>
