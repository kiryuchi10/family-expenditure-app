# Git Workflow Guide for Family Expenditure App

## 🌳 Branch Structure

### Main Branches

- `main` - Production-ready code
- `develop` - Integration branch for features
- `staging` - Pre-production testing

### Feature Branches

- `feature/database-mysql` - MySQL database implementation
- `feature/ui-improvements` - UI/UX enhancements
- `feature/korean-processing` - Korean text processing
- `feature/api-integration` - External API integrations
- `feature/excel-export` - Excel export functionality

### Support Branches

- `hotfix/critical-bug-fix` - Critical production fixes
- `release/v1.0.0` - Release preparation

## 🚀 Git Commands Workflow

### Initial Setup

```bash
# Clone repository
git clone <repository-url>
cd family-expenditure-app

# Set up remote tracking
git remote -v
git branch -a

# Create and switch to develop branch
git checkout -b develop
git push -u origin develop
```

### Feature Development Workflow

#### 1. Start New Feature

```bash
# Switch to develop and pull latest
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/database-mysql
git push -u origin feature/database-mysql
```

#### 2. Work on Feature

```bash
# Make changes and commit frequently
git add .
git commit -m "feat: add MySQL database schema setup"

# Push changes regularly
git push origin feature/database-mysql

# Keep feature branch updated with develop
git checkout develop
git pull origin develop
git checkout feature/database-mysql
git merge develop
```

#### 3. Complete Feature

```bash
# Final commit and push
git add .
git commit -m "feat: complete MySQL integration with test suite"
git push origin feature/database-mysql

# Create Pull Request (via GitHub/GitLab)
# After PR approval, merge to develop
git checkout develop
git pull origin develop
git branch -d feature/database-mysql
```

### Release Workflow

#### 1. Prepare Release

```bash
# Create release branch from develop
git checkout develop
git pull origin develop
git checkout -b release/v1.0.0
git push -u origin release/v1.0.0

# Update version numbers, documentation
git add .
git commit -m "chore: prepare release v1.0.0"
git push origin release/v1.0.0
```

#### 2. Deploy to Staging

```bash
# Merge to staging for testing
git checkout staging
git merge release/v1.0.0
git push origin staging
```

#### 3. Production Release

```bash
# Merge to main
git checkout main
git merge release/v1.0.0
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin main --tags

# Merge back to develop
git checkout develop
git merge release/v1.0.0
git push origin develop

# Clean up
git branch -d release/v1.0.0
git push origin --delete release/v1.0.0
```

### Hotfix Workflow

```bash
# Create hotfix from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-security-fix
git push -u origin hotfix/critical-security-fix

# Make fix and test
git add .
git commit -m "fix: resolve critical security vulnerability"
git push origin hotfix/critical-security-fix

# Merge to main and develop
git checkout main
git merge hotfix/critical-security-fix
git tag -a v1.0.1 -m "Hotfix version 1.0.1"
git push origin main --tags

git checkout develop
git merge hotfix/critical-security-fix
git push origin develop

# Clean up
git branch -d hotfix/critical-security-fix
git push origin --delete hotfix/critical-security-fix
```

## 📝 Commit Message Convention

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
git commit -m "feat(database): add MySQL schema with Korean text support"
git commit -m "fix(ui): resolve mobile responsive issues in transaction table"
git commit -m "docs: update README with MySQL setup instructions"
git commit -m "test: add comprehensive backend API tests"
```

## 🔧 Git Configuration

### Setup Git Config

```bash
# Set user information
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Set default branch name
git config --global init.defaultBranch main

# Set up aliases for common commands
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
git config --global alias.visual '!gitk'
```

### Useful Git Aliases

```bash
# Add to ~/.gitconfig or use git config --global
[alias]
    # Short status
    s = status -s

    # Pretty log
    lg = log --oneline --decorate --graph --all

    # Show branches
    br = branch -v

    # Quick commit
    cm = commit -m

    # Push current branch
    pc = push origin HEAD

    # Pull with rebase
    pr = pull --rebase

    # Undo last commit (keep changes)
    undo = reset --soft HEAD~1

    # Show what changed
    changed = show --name-only
```

## 🛠 Development Workflow Commands

### Daily Development

```bash
# Start of day - sync with remote
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/new-feature

# Work and commit
git add .
git commit -m "feat: implement new feature"

# Push regularly
git push origin feature/new-feature

# End of day - ensure everything is pushed
git push origin feature/new-feature
```

### Code Review Process

```bash
# Before creating PR
git checkout develop
git pull origin develop
git checkout feature/new-feature
git rebase develop  # Clean up history

# Squash commits if needed
git rebase -i HEAD~3  # Interactive rebase for last 3 commits

# Force push after rebase (only on feature branches)
git push --force-with-lease origin feature/new-feature
```

### Troubleshooting Common Issues

#### Merge Conflicts

```bash
# When merge conflict occurs
git status  # See conflicted files
# Edit files to resolve conflicts
git add .
git commit -m "resolve: merge conflicts with develop"
```

#### Accidentally Committed to Wrong Branch

```bash
# Move commits to correct branch
git log --oneline  # Find commit hash
git checkout correct-branch
git cherry-pick <commit-hash>
git checkout wrong-branch
git reset --hard HEAD~1  # Remove from wrong branch
```

#### Reset to Remote State

```bash
# Discard all local changes
git fetch origin
git reset --hard origin/develop
```

## 📊 Branch Management

### View Branch Information

```bash
# List all branches
git branch -a

# Show branch tracking
git branch -vv

# Show merged branches
git branch --merged

# Show unmerged branches
git branch --no-merged
```

### Clean Up Branches

```bash
# Delete local branch
git branch -d feature/completed-feature

# Delete remote branch
git push origin --delete feature/completed-feature

# Prune remote tracking branches
git remote prune origin
```

## 🔍 Monitoring and Maintenance

### Regular Maintenance

```bash
# Weekly cleanup
git checkout develop
git pull origin develop
git branch --merged | grep -v "\*\|main\|develop" | xargs -n 1 git branch -d

# Check repository health
git fsck
git gc --prune=now
```

### Backup Important Work

```bash
# Create backup branch before risky operations
git checkout -b backup/before-major-refactor

# Stash work in progress
git stash push -m "WIP: working on complex feature"
git stash list
git stash pop
```

This workflow ensures clean, organized development with proper version control and collaboration.
