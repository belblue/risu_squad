Is the element definitely on the page?
→ YES → Use getBy*
→ NO → Use queryBy*

Is the element loaded asynchronously?
→ YES → Use findBy* (with await)
→ NO → Use getBy* or queryBy

Are there multiple elements?
→ YES → Use getAll*, queryAll*, findAll*
→ NO → Use getBy*, queryBy*, findBy*
