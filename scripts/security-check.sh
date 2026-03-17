#!/bin/bash
# Security check script - Run before committing sensitive data

echo "🔍 VoxShield Security Scanner"
echo "=============================="
echo ""

# Check for common secret patterns in files
echo "Scanning for exposed secrets..."

# Patterns to search for
patterns=(
  "GEMINI_API_KEY="
  "FIREBASE_API_KEY="
  "OPENAI_API_KEY="
  "API_KEY=AIz"
  "password="
  "secret="
  "token="
  "privateKey"
  "BEGIN PRIVATE KEY"
  "BEGIN RSA PRIVATE KEY"
)

found_issues=0

for pattern in "${patterns[@]}"; do
  if git diff --cached | grep -i "$pattern" > /dev/null; then
    echo "⚠️  WARNING: Found potential secret: $pattern"
    found_issues=$((found_issues + 1))
  fi
done

# Check for .env files being committed
if git diff --cached --name-only | grep "\.env" | grep -v "\.env\.example"; then
  echo "⚠️  WARNING: .env files should not be committed!"
  found_issues=$((found_issues + 1))
fi

# Check for secret files
secret_files=("*.pem" "*.key" "*credentials*" "*secret*" "*-firebase-*.json")
for file_pattern in "${secret_files[@]}"; do
  if git diff --cached --name-only | grep -E "$file_pattern"; then
    echo "⚠️  WARNING: Secret file pattern found: $file_pattern"
    found_issues=$((found_issues + 1))
  fi
done

if [ $found_issues -eq 0 ]; then
  echo "✅ No obvious secrets detected"
else
  echo ""
  echo "❌ Found $found_issues potential security issues"
  echo "Remove these before committing!"
  exit 1
fi
