
/**
 * Frontend JavaScript for the Masthead block
 * Handles lazy loading for large contributor lists and accessibility enhancements
 */

document.addEventListener('DOMContentLoaded', function() {
	const mastheadBlocks = document.querySelectorAll('.wp-block-wp-fundi-blocks-masthead');
	
	mastheadBlocks.forEach(function(block) {
		const entries = block.querySelectorAll('.masthead-entry');
		
		// Lazy rendering for long lists (>20 entries)
		if (entries.length > 20) {
			lazyRenderEntries(block, entries);
		}
		
		// Enhanced accessibility
		enhanceAccessibility(block);
	});
});

/**
 * Lazy render entries for performance with large lists
 */
function lazyRenderEntries(block, entries) {
	const observer = new IntersectionObserver(function(observerEntries) {
		observerEntries.forEach(function(entry) {
			if (entry.isIntersecting) {
				const mastheadEntry = entry.target;
				mastheadEntry.style.opacity = '1';
				mastheadEntry.style.transform = 'translateY(0)';
				observer.unobserve(mastheadEntry);
			}
		});
	}, {
		rootMargin: '50px 0px',
		threshold: 0.1
	});
	
	// Initially hide entries beyond the first 10
	entries.forEach(function(entry, index) {
		if (index > 10) {
			entry.style.opacity = '0';
			entry.style.transform = 'translateY(20px)';
			entry.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
			observer.observe(entry);
		}
	});
}

/**
 * Enhance accessibility with proper ARIA labels and keyboard navigation
 */
function enhanceAccessibility(block) {
	const container = block.querySelector('.masthead-container');
	if (!container) return;
	
	// Ensure proper role and aria-label
	if (!container.getAttribute('role')) {
		container.setAttribute('role', 'list');
	}
	
	if (!container.getAttribute('aria-label')) {
		container.setAttribute('aria-label', 'Masthead contributors');
	}
	
	// Add role="listitem" to entries
	const entries = container.querySelectorAll('.masthead-entry');
	entries.forEach(function(entry) {
		if (!entry.getAttribute('role')) {
			entry.setAttribute('role', 'listitem');
		}
		
		// Add tabindex for keyboard navigation
		entry.setAttribute('tabindex', '0');
		
		// Add focus styles for keyboard users
		entry.addEventListener('focus', function() {
			this.style.outline = '2px solid #007cba';
			this.style.outlineOffset = '2px';
		});
		
		entry.addEventListener('blur', function() {
			this.style.outline = 'none';
		});
	});
}

// Export functions for potential external use
window.MastheadBlock = {
	lazyRenderEntries,
	enhanceAccessibility
};
