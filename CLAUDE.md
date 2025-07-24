# Instructions for Claude

## Git Commit Guidelines

1. **NEVER** add Claude-related attribution to commits or PRs:
   - No "🤖 Generated with [Claude Code]" 
   - No "Co-Authored-By: Claude"
   - No mentions of AI assistance

2. **Git staging rules**:
   - **NEVER** use `git add .` or `git add -A`
   - **ALWAYS** use `git commit -am` for committing tracked files
   - When adding new files, add them individually with `git add <filename>`

3. **Commit messages**:
   - Keep them concise and descriptive
   - Focus on what changed, not who/what made the changes
   - Use conventional commit format when appropriate