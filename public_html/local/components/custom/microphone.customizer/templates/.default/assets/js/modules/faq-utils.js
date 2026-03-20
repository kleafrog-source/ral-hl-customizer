function setFaqOpenState(trigger, icon, content, isOpen) {
    content.style.display = isOpen ? 'block' : 'none';
    icon.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
    trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
}

// FAQ utilities for start screen
export function toggleFaq(element) {
    const faqItem = element.closest('.start-screen-faq-item');
    if (!faqItem) return;

    const icon = faqItem.querySelector('.start-screen-faq-icon');
    const content = faqItem.querySelector('.start-screen-faq-content');

    if (!icon || !content) return;

    const isOpen = content.style.display === 'block';
    setFaqOpenState(element, icon, content, !isOpen);
}
