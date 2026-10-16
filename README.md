# Developer Project Collection

Five documented learning projects: a portfolio template, pixel editor, hand-controlled browser game, bestseller CSV analysis and Arduino RGB controller.

| Project | Focus | Local route |
| --- | --- | --- |
| [Pixel Studio](projects/pixel-studio) | Drawing, flood fill, undo/redo and export | /projects/pixel-studio/ |
| [Air Juggler](projects/air-juggler) | MediaPipe hand tracking and game physics | /projects/air-juggler/ |
| [Books, by the Numbers](projects/book-analysis) | Python/pandas and validated CSV analytics | /projects/book-analysis/ |
| [Pocket Rave](projects/pocket-rave) | C++/Arduino, PWM and non-blocking timing | /projects/pocket-rave/ |
| [Portfolio template](index.html) | Semantic HTML and responsive CSS | / |

## Run

Requires Python 3.10+ and a modern browser. From the repository root:

```sh
python -m http.server 8000
```

Open http://localhost:8000. No frontend build or npm installation is needed. Customize the generic portfolio text before using it as a personal website.

## Checks

Requires Node.js 20+ for JavaScript tests.

```sh
node --test tests/*.test.mjs
python -m pip install -r projects/book-analysis/requirements.txt
python -m unittest discover -s tests -p 'test_*.py'
python projects/book-analysis/analyze.py projects/book-analysis/data/demo_books.csv --output /tmp/book-report
```

The book CSV is fictional, not Amazon data. Upload an appropriately licensed real dataset for real analysis. The camera integration uses a pinned MediaPipe version, downloads external model assets, processes frames locally and supports pointer/keyboard controls without a camera. Hardware and live camera verification remain outstanding. Browser visual QA was unavailable in the build environment. See each project README for setup, architecture and limits.

## Structure

- Root HTML, CSS and JavaScript: generic portfolio template.
- `projects/`: four interactive project folders and their source.
- `tests/`: data validation and game physics checks.
- `docs/`: GitHub profile README draft and setup notes.
- `.github/workflows/`: automated checks on pushes and pull requests.

## License

MIT for original code. Dependencies and remotely loaded assets retain their own licenses.
