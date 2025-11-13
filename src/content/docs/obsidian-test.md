---
title: Obsidian Features Test
description: Testing Obsidian markdown support
---

# Obsidian Markdown Features

This page demonstrates the Obsidian markdown features now supported in Breadchain Docs.

## Wikilinks

Internal links using Obsidian's wikilink syntax:

- Basic link: [[another-page]]
- Link with custom text: [[another-page|Click here to visit]]
- Link with heading anchor: [[another-page#section-name]]

## Image Embeds

Images using Obsidian's embed syntax:

- Basic image embed: ![[example.png]]
- Image with alt text: ![[example.png|A descriptive caption]]

## Callouts

### Note Callout

> [!note]
> This is a note callout. Use it for general information that you want to highlight.

### Tip Callout

> [!tip]
> This is a tip callout. Great for helpful hints and best practices.

### Warning Callout

> [!warning]
> This is a warning callout. Use it to alert readers about potential issues or important considerations.

### Danger Callout

> [!danger]
> This is a danger callout. Use it for critical warnings or things that could break.

### Success Callout

> [!success]
> This is a success callout. Perfect for highlighting achievements or positive outcomes.

### Info Callout

> [!info]
> This is an info callout. Similar to note, but more specifically for informational content.

### Question Callout

> [!question]
> This is a question callout. Use it for FAQs or questions that need addressing.

### Example Callout

> [!example]
> This is an example callout. Great for showing code examples or use cases.

### Quote Callout

> [!quote]
> This is a quote callout. Perfect for highlighting quotes from sources or important statements.

### Abstract Callout

> [!abstract]
> This is an abstract/summary callout. Use it for TL;DR sections or summaries.

## Foldable Callouts

You can make callouts collapsible:

> [!tip]- Collapsed by default
> This callout is collapsed by default. Click the title to expand it.

> [!note]+ Expanded by default
> This callout is expanded by default but can be collapsed.

## Nested Content

Callouts can contain complex markdown:

> [!example] Code Example
> Here's some code:
>
> ```javascript
> function greet(name) {
>   return `Hello, ${name}!`;
> }
> ```
>
> And you can also have:
> - Lists
> - **Bold text**
> - _Italic text_
> - Links: [[other-page]]

## Standard Markdown

All standard markdown features still work:

- Lists
- **Bold** and _italic_
- `inline code`
- [Standard links](https://example.com)

```javascript
// Code blocks
console.log('Hello, world!');
```

This combination of Obsidian and standard markdown gives you a powerful authoring experience!
