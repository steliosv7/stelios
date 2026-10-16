# Pixel Studio

A browser pixel art editor built with plain JavaScript and Canvas.

## Run
From the repository root: `python -m http.server 8000`, then open http://localhost:8000/projects/pixel-studio/.

## Features
Pencil, eraser, eyedropper, flood fill, mirrored drawing, 16/32/64 grids, grid toggle, 80-step undo, redo, PNG export with transparent empty cells, JSON save/open, and local autosave. Canvas supports mouse, touch and arrow keys + Space. Grid changes and clear actions can be undone.

## Design
The cell array is the source of truth; rendering is separate. A history snapshot is taken once per stroke. Project imports validate the grid size, cell count and colors. Storage failure leaves manual JSON export available.

## Limits
History is session-only. Autosave stores one canvas in this browser and origin. PNG import is not implemented; use JSON to reopen an editable project. Export uses native grid resolution, without grid lines.
