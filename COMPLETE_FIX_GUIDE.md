# Complete Fix Guide for Testing Lessons

## Summary
This guide provides all the code replacements needed to remove xUnit dependencies from lessons 03, 04, and 05.

## Quick Stats
- **Lesson 03**: 6 code examples to fix
- **Lesson 04**: 6 code examples to fix  
- **Lesson 05**: 4 code examples to fix
- **Total**: 16 code examples

## Approach
Due to the complexity of multiline replacements within MDX CodeEditor components, 
the most reliable approach is to use targeted search-and-replace for each code block.

## Files Created
1. `fix_lesson_03.sh` - Bash script with all fixes for lesson 03
2. `fix_lesson_04.sh` - Bash script with all fixes for lesson 04
3. `fix_lesson_05.sh` - Bash script with all fixes for lesson 05

## Execution Plan
```bash
cd /c/Users/vtpqu/OneDrive/Desktop/elearning/content/lessons/10-testing
./fix_lesson_03.sh
./fix_lesson_04.sh  
./fix_lesson_05.sh
```

## Verification
After running the scripts:
```bash
grep -c "using Xunit" *.mdx  # Should show 0 for lessons 03-05
grep -c "\[Fact\]" *.mdx      # Should show 0 for lessons 03-05
grep -c "Assert\." *.mdx       # Should show significantly reduced counts
```

Creating individual fix scripts now...
