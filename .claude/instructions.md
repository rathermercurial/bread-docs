# Claude Code Instructions for Bread-Docs

## Project Context

This is an Astro-based documentation project called "bread-docs". Astro is a modern static site builder optimized for content-focused websites.

## Critical: Git Commit Attribution

**MANDATORY FOR EVERY COMMIT:**

Before making ANY git commit, you MUST:

1. **Ask the user for their name and email**: "What name and email should I use for Git attribution?"
2. **Wait for their response** - DO NOT proceed without this information
3. **Use their details in the commit** with proper attribution

### Commit Format

Always use this format for commits:

```bash
git commit -m "Commit message here

Co-Authored-By: [User Name] <user@email.com>"
```

**NEVER commit without asking for and receiving the user's attribution details first.**

## Astro-Specific Guidelines

### Framework Knowledge

- Astro uses a component-based architecture with `.astro` files
- Content Collections are the recommended way to manage documentation
- Astro supports MDX for rich Markdown content
- Islands architecture for interactive components

### Best Practices

- Keep components in `src/components/`
- Use layouts in `src/layouts/` for page templates
- Store documentation content in `src/content/`
- Static assets go in `public/`
- Follow Astro's file-based routing in `src/pages/`

### Development Workflow

- Use `npm run dev` for local development
- Run `npm run build` before committing to catch build errors
- Test responsiveness and accessibility
- Validate links and images in documentation

## Code Quality

- Follow TypeScript best practices
- Maintain consistent formatting
- Write semantic HTML
- Ensure WCAG 2.1 AA accessibility compliance
- Keep components modular and reusable

## Testing

- Test all changes locally before committing
- Verify the build succeeds
- Check for console errors
- Test on different screen sizes

## Documentation

- Keep documentation clear and concise
- Update relevant docs when making changes
- Use proper Markdown formatting
- Include code examples where helpful
