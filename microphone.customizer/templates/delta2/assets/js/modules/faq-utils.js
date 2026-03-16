// FAQ utilities for start screen
export function toggleFaq(element) {
    const faqItem = element.closest('.start-screen-faq-item');
    if (!faqItem) return;
    
    const icon = faqItem.querySelector('.start-screen-faq-icon');
    const content = faqItem.querySelector('.start-screen-faq-content');
    
    if (!icon || !content) return;
    
    const isOpen = content.style.display === 'block';
    
    if (isOpen) {
        // Close FAQ
        content.style.display = 'none';
        icon.style.transform = 'rotate(0deg)';
        element.setAttribute('aria-expanded', 'false');
    } else {
        // Open FAQ
        content.style.display = 'block';
        icon.style.transform = 'rotate(180deg)';
        element.setAttribute('aria-expanded', 'true');
    }
}
