# Books, by the Numbers

Python/pandas analysis and a browser CSV explorer for the common Amazon bestseller CSV schema. The included 12-row CSV is **fictional** and contains 8 unique titles. It is a software demonstration, not a report about Amazon.

## Browser
From repository root: `python -m http.server 8000`. Open http://localhost:8000/projects/book-analysis/. Upload CSV, filter by genre/year, inspect highest rated observations, and export a JSON summary. The file stays in the browser.

## Python
```sh
python -m pip install -r projects/book-analysis/requirements.txt
python projects/book-analysis/analyze.py projects/book-analysis/data/demo_books.csv --output /tmp/book-report
```

Outputs: `cleaned_books.csv`, `by_genre.csv`, `top_rated.csv`, `summary.json`.

## Data contract
Required columns: `Name,Author,User Rating,Reviews,Price,Year,Genre`.

- Name, author and genre must be nonempty after trimming.
- Rating must be finite and between 0 and 5.
- Reviews must be a nonnegative integer. Price must be finite and nonnegative.
- Year must be an integer from 1900 to 2100.
- Wrong-width and invalid rows are excluded and counted. Exact normalized duplicates are removed.
- A title appearing in more than one year remains more than one observation. Unique titles are counted by exact title string.
- Means are unweighted over valid book-year entries. Price is in the source dataset's units.
- Ranking is by rating, then review count. There is no sales-volume field, so this does not estimate units sold.

The JavaScript and Python validators use the same schema and rules. Browser file limit: 5 MB. Acquire a licensed real dataset separately; nothing is scraped or represented as live Amazon data.

References: https://pandas.pydata.org/docs/reference/api/pandas.read_csv.html and https://pandas.pydata.org/docs/user_guide/groupby.html
