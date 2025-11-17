// Link audit utility to check for broken links
export async function auditLinks() {
  const links = document.querySelectorAll('a[href]');
  const results = {
    total: links.length,
    internal: 0,
    external: 0,
    broken: [] as string[],
    working: [] as string[]
  };

  for (const link of links) {
    const href = (link as HTMLAnchorElement).href;
    
    if (!href || href.startsWith('#') || href.startsWith('javascript:')) {
      continue;
    }

    if (href.startsWith(window.location.origin)) {
      results.internal++;
    } else if (href.startsWith('http')) {
      results.external++;
    }

    try {
      // For external links, we'll just check if they're properly formatted
      if (href.startsWith('http')) {
        const url = new URL(href);
        if (url.hostname) {
          results.working.push(href);
        }
      } else {
        // For internal links, check if the route exists
        const response = await fetch(href, { method: 'HEAD' });
        if (response.ok) {
          results.working.push(href);
        } else {
          results.broken.push(href);
        }
      }
    } catch (error) {
      results.broken.push(href);
    }
  }

  return results;
}

// Common link patterns to validate
export const linkPatterns = {
  email: /^mailto:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^tel:\+?[1-9]\d{1,14}$/,
  social: {
    linkedin: /^https:\/\/(www\.)?linkedin\.com\/.*$/,
    twitter: /^https:\/\/(www\.)?(twitter\.com|x\.com)\/.*$/,
    facebook: /^https:\/\/(www\.)?facebook\.com\/.*$/
  }
};

export function validateLink(href: string): boolean {
  if (!href) return false;
  
  // Check for common patterns
  if (linkPatterns.email.test(href)) return true;
  if (linkPatterns.phone.test(href)) return true;
  if (Object.values(linkPatterns.social).some(pattern => pattern.test(href))) return true;
  
  // Check for valid URLs
  try {
    new URL(href);
    return true;
  } catch {
    return false;
  }
}