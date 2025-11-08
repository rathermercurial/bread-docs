# Claude Instructions for Bread-Docs

This is an Astro-based documentation project.

## Project Overview

This project uses the Astro framework for building a documentation site.

## Development Guidelines

### Astro Best Practices

- Follow Astro's recommended project structure
- Use Astro components (.astro files) for reusable UI elements
- Leverage Astro's content collections for managing documentation content
- Optimize for static site generation where possible

### Code Standards

- Write clean, maintainable code
- Follow TypeScript best practices
- Ensure responsive design for all components
- Maintain accessibility standards (WCAG 2.1 AA)

## Important: Git Commit Attribution

**CRITICAL**: For EVERY commit, you MUST:

1. **Always ask for the user's name and email** before making any commits
2. **Credit the user properly** in every commit with their GitHub attribution details
3. Use the standard Git commit format with proper attribution

### Commit Process

Before making any commits:
1. Ask the user: "What name and email should I use for Git attribution?"
2. Configure the commit with the provided details
3. Ensure the commit message is clear and descriptive
4. Always include proper co-authorship when applicable

Example:
```
git commit -m "Add feature X

Co-Authored-By: [User Name] <user@email.com>"
```

## Project Structure

```
bread-docs/
├── src/
│   ├── pages/        # Astro pages
│   ├── components/   # Reusable components
│   ├── layouts/      # Layout components
│   └── content/      # Content collections
├── public/           # Static assets
└── astro.config.mjs  # Astro configuration
```

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Additional Notes

- Always test changes locally before committing
- Keep dependencies up to date
- Document any significant changes or new features
