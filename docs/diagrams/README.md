# Diagram Export Guide

1. Edit the Mermaid source (`*.mmd`) in this directory or inline within docs.
2. Generate SVG and PNG assets using the Mermaid CLI:

   ```sh
   npx @mermaid-js/mermaid-cli -i system-overview.mmd -o system-overview.svg --png
   ```

3. Commit the updated `.mmd`, `.svg`, and `.png` files together.
4. Reference both the Mermaid code and exported assets in documentation so diagrams remain accessible even when Mermaid rendering is unavailable.
