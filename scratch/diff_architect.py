import subprocess

# Get the diff of architect.svg from the last commit
result = subprocess.run(['git', 'diff', 'HEAD~1', 'assets/svgs/architect.svg'], capture_output=True, text=True)
print("Diff length:", len(result.stdout))
# Print the first 1000 characters of the diff
print(result.stdout[:2000])
