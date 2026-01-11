#!/usr/bin/perl
use strict;
use warnings;
use File::Copy;

# This script fixes all xUnit dependencies in testing lessons 03, 04, and 05
# to make them compatible with Judge0 (which doesn't have xUnit installed)

my @files = (
    'content/lessons/10-testing/03-writing-first-tests.mdx',
    'content/lessons/10-testing/04-advanced-patterns.mdx',
    'content/lessons/10-testing/05-integration-best-practices.mdx'
);

foreach my $file (@files) {
    print "Processing $file...\n";
    
    # Read file
    open(my $fh, '<', $file) or die "Cannot open $file: $!";
    my $content = do { local $/; <$fh> };
    close($fh);
    
    # Create backup
    copy($file, "$file.auto_backup") or die "Backup failed: $!";
    
    # Remove 'using Xunit;' lines
    $content =~ s/^using Xunit;\n//gm;
    
    # Count replacements
    my $count = 0;
    
    # Save the modified content
    open($fh, '>', $file) or die "Cannot write $file: $!";
    print $fh $content;
    close($fh);
    
    print "  ✓ Processed $file\n";
}

print "\n=== Summary ===\n";
print "Created backups with .auto_backup extension\n";
print "Removed 'using Xunit;' from all files\n";
print "\nNext: Apply specific code transformations for each example\n";

