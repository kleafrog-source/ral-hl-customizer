<?php
// Массив разметок по страницам
$SCHEMA_PAGES = [

    // Главная страница
    '/' => <<<HTML
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "«Союз» микрофоны",
  "legalName": ["ООО «Байкал Майкрофонс»", "Soyuz Microphones LLC"],
  "url": "https://soyuzmicrophones.ru",
  "logo": "https://soyuzmicrophones.ru/image/logo.svg",
  "description": "СОЮЗ — бренд премиальных студийных микрофонов, создаваемых вручную на собственном производстве в Туле. Особое внимание к каждой детали, инновации и качество.",
  "founder": [
    {"@type": "Person","name": "Дэвид Артур Браун","jobTitle": "Сооснователь, дизайнер"},
    {"@type": "Person","name": "Павел Баздырев","jobTitle": "Сооснователь, директор"}
  ],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Красноармейский пр-кт, д. 25, 2 этаж, офис 220",
    "addressLocality": "Тула",
    "addressCountry": "RU"
  },
  "contactPoint": [
    {"@type": "ContactPoint","telephone": "+7 980 800 26 08","contactType": "customer service","areaServed": "RU","availableLanguage": ["Russian","English"]},
    {"@type": "ContactPoint","telephone": "+7 487 234 48 30","contactType": "customer service","areaServed": "RU","availableLanguage": ["Russian"]},
    {"@type": "ContactPoint","email": "baikalmics@gmail.com","contactType": "customer service"}
  ],
  "sameAs": [
    "https://soyuzmicrophones.com",
    "https://vk.com/soyuzmicrophones",
    "https://www.youtube.com/@soyuzmics",
    "https://www.youtube.com/@soyuznaya.official",
    "https://t.me/soyuzmics",
    "https://rutube.ru/channel/38548904",
    "https://wa.me/79808002608"
  ]
}
</script>

<meta property="og:title" content="Микрофоны СОЮЗ — премиальные студийные микрофоны ручной работы" />
<meta property="og:description" content="Винтажное звучание и современное качество. Микрофоны и предусилители ручной сборки, которым доверяют инженеры и музыканты по всему миру." />
<meta property="og:image" content="https://soyuzmicrophones.ru/image/og/og-main.jpg" />
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url" content="https://soyuzmicrophones.ru/" />
<meta property="og:type" content="website" />
<meta property="og:locale" content="ru_RU" />
<meta property="og:logo" content="https://soyuzmicrophones.ru/image/logo.svg" />


<!-- Twitter Meta Tags -->
<meta name="twitter:card" content="summary_large_image">
<meta property="twitter:domain" content="soyuzmicrophones.ru">
<meta property="twitter:url" content="https://soyuzmicrophones.ru/">
<meta name="twitter:title" content="Микрофоны СОЮЗ — премиальные студийные микрофоны ручной работы">
<meta name="twitter:description" content="Винтажное звучание и современное качество. Микрофоны и предусилители ручной сборки, которым доверяют инженеры и музыканты по всему миру.">
<meta name="twitter:image" content="https://soyuzmicrophones.ru/image/og/og-main.jpg">
HTML
,

    // Страница бонусы
    '/bonuses/' => <<<JSON
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Что нужно для теста микрофона?",
      "acceptedAnswer": {"@type": "Answer","text": "Заключить договор и перевести депозит 10 000 рублей за каждый микрофон."}
    },
    {
      "@type": "Question",
      "name": "Тест бесплатный?",
      "acceptedAnswer": {"@type": "Answer","text": "Да, депозит вернем полностью после проверки микрофона."}
    },
    {
      "@type": "Question",
      "name": "Будет ли лончер работать с микрофонами Союз?",
      "acceptedAnswer": {"@type": "Answer","text": "По умолчанию нет, но можно использовать дополнительный блок фантомного питания."}
    },
    {
      "@type": "Question",
      "name": "Нужен ли предусилитель?",
      "acceptedAnswer": {"@type": "Answer","text": "Дополнительный предусилитель необязателен, но улучшает звук."}
    }
  ]
}
</script>
JSON
,

    // Страница тест-драйв
    '/demo-tradein/' => <<<JSON
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "image": "https://soyuzmicrophones.ru/image/form_illustrator_mic_demo2.png",
  "name": "Тест-драйв микрофона СОЮЗ",
  "description": "Протестируйте микрофон перед покупкой в течение недели. Депозит 10 000 ₽ за микрофон. Доставка туда и обратно бесплатная.",
  "offers": {
    "@type": "Offer",
    "price": "10000",
    "priceCurrency": "RUB",
    "availability": "https://schema.org/InStock",
    "url": "https://soyuzmicrophones.ru/demo-tradein/"
  }
}
</script>
JSON
,

    // Страница доставка и оплата
    '/deliverypay/' => <<<JSON
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Доставка и оплата",
  "provider": {
    "@type": "Organization",
    "name": "«Союз» микрофоны"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Услуги",
    "itemListElement": [
      {"@type": "Offer","itemOffered":{"@type":"Service","name":"Бесплатная доставка по России"}},
      {"@type": "Offer","itemOffered":{"@type":"Service","name":"Обмен и возврат в течение 14 дней"}},
      {"@type": "Offer","itemOffered":{"@type":"Service","name":"Подарок при покупке"}},
      {"@type": "Offer","itemOffered":{"@type":"Service","name":"Сервисная поддержка"}}
    ]
  }
}
</script>
JSON
,

    // Страница контакты
    '/contacts/' => <<<JSON
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "url": "https://soyuzmicrophones.ru/contacts/",
  "contactOption": "TollFree",
  "telephone": "+7 980 800 26 08",
  "email": "baikalmics@gmail.com"
}
</script>
JSON
,

    // Страница О нас
    '/about-us/' => <<<JSON
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "name": "О компании СОЮЗ",
  "description": "СОЮЗ — бренд премиальных студийных микрофонов, создаваемых вручную в Туле. История, основатели, философия компании.",
  "mainEntity": {
    "@type": "Organization",
    "name": "«Союз» микрофоны",
    "founder": [
      {"@type": "Person","name": "Дэвид Артур Браун"},
      {"@type": "Person","name": "Павел Баздырев"}
    ]
  }
}
</script>
JSON
,

    // Политика конфиденциальности
    '/privacy-policy/' => <<<JSON
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Политика конфиденциальности",
  "url": "https://soyuzmicrophones.ru/privacy-policy/"
}
</script>
JSON
,

    // Публичная оферта
    '/public-offer/' => <<<JSON
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Публичная оферта",
  "url": "https://soyuzmicrophones.ru/public-offer/"
}
</script>
JSON
,

    // Пользовательское соглашение
    '/user-agreement/' => <<<JSON
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Пользовательское соглашение",
  "url": "https://soyuzmicrophones.ru/user-agreement/"
}
</script>
JSON
,

    // Страница Craft (Мастерская)
    '/craft/' => <<<HTML
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Мастерская СОЮЗ - изделия из натурального дерева ручной работы",
  "description": "Закажите уникальные изделия из натурального дерева: акустические панели, рэковые стойки, аксессуары и шкатулки ручной работы. Индивидуальный подход и премиальное качество.",
  "url": "https://soyuzmicrophones.ru/craft/",
  "mainEntity": {
    "@type": "Organization",
    "name": "«Союз» микрофоны",
    "url": "https://soyuzmicrophones.ru"
  }
}
</script>

<meta property="og:title" content="Мастерская СОЮЗ - изделия из натурального дерева ручной работы" />
<meta property="og:description" content="Закажите уникальные изделия из натурального дерева: акустические панели, рэковые стойки, аксессуары и шкатулки ручной работы. Индивидуальный подход и премиальное качество." />
<meta property="og:image" content="https://soyuzmicrophones.ru/image/og/og-craft.jpg" />
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url" content="https://soyuzmicrophones.ru/craft/" />
<meta property="og:type" content="website" />
<meta property="og:locale" content="ru_RU" />

<!-- Twitter Meta Tags -->
<meta name="twitter:card" content="summary_large_image">
<meta property="twitter:domain" content="soyuzmicrophones.ru">
<meta property="twitter:url" content="https://soyuzmicrophones.ru/craft/">
<meta name="twitter:title" content="Мастерская СОЮЗ - изделия из натурального дерева ручной работы">
<meta name="twitter:description" content="Закажите уникальные изделия из натурального дерева: акустические панели, рэковые стойки, аксессуары и шкатулки ручной работы. Индивидуальный подход и премиальное качество.">
<meta name="twitter:image" content="https://soyuzmicrophones.ru/image/og/og-craft.jpg">
HTML


];

// Конец schema.php
?>
