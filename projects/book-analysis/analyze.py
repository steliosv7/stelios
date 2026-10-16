"""Validate a bestseller CSV and export reproducible descriptive summaries.
Bundled data is fictional. No sales volumes can be inferred from this schema.
"""
import argparse
import csv
import json
from pathlib import Path
import pandas as pd
HEADERS = ['Name', 'Author', 'User Rating', 'Reviews', 'Price', 'Year', 'Genre']

def analyze(path, output):
    with Path(path).open(encoding='utf-8-sig', newline='') as handle:
        reader = csv.reader(handle, strict=True)
        header = next(reader, [])
        header = [h.strip() for h in header]
        if not set(HEADERS).issubset(header):
            raise ValueError('Required columns: ' + ', '.join(HEADERS))
        indices = [header.index(h) for h in HEADERS]
        records, malformed = [], 0
        for row in reader:
            if not any(v.strip() for v in row):
                continue
            if len(row) != len(header):
                malformed += 1
                continue
            records.append([row[i].strip() for i in indices])
    frame = pd.DataFrame(records, columns=HEADERS)
    numeric = ['User Rating', 'Reviews', 'Price', 'Year']
    for column in numeric:
        frame[column] = pd.to_numeric(frame[column], errors='coerce')
    valid = frame[['Name', 'Author', 'Genre']].ne('').all(axis=1)
    valid &= frame[numeric].notna().all(axis=1)
    valid &= frame['User Rating'].between(0, 5)
    valid &= frame['Reviews'].ge(0) & frame['Reviews'].mod(1).eq(0)
    valid &= frame['Price'].ge(0) & frame['Price'].lt(float('inf'))
    valid &= frame['Year'].between(1900, 2100) & frame['Year'].mod(1).eq(0)
    invalid = int((~valid).sum()) + malformed
    frame = frame[valid].copy()
    duplicates = int(frame.duplicated().sum())
    frame = frame.drop_duplicates()
    if frame.empty:
        raise ValueError('No valid entries found.')
    frame[['Reviews', 'Year']] = frame[['Reviews', 'Year']].astype(int)
    report = {
        'source': Path(path).name,
        'entries': len(frame),
        'unique_titles': int(frame['Name'].nunique()),
        'mean_rating': float(frame['User Rating'].mean()),
        'mean_price': float(frame['Price'].mean()),
        'invalid_rows_excluded': invalid,
        'exact_duplicates_removed': duplicates,
        'entries_by_year': {str(k): int(v) for k,v in frame.groupby('Year').size().items()},
        'note': 'Book-year observations, not sales volumes. Demo data is fictional.'
    }
    output = Path(output)
    output.mkdir(parents=True, exist_ok=True)
    frame.to_csv(output / 'cleaned_books.csv', index=False)
    frame.groupby('Genre', as_index=False).agg(entries=('Name', 'size'), mean_rating=('User Rating', 'mean'), mean_price=('Price', 'mean')).to_csv(output / 'by_genre.csv', index=False)
    frame.sort_values(['User Rating', 'Reviews'], ascending=False).head(20).to_csv(output / 'top_rated.csv', index=False)
    (output / 'summary.json').write_text(json.dumps(report, indent=2, allow_nan=False), encoding='utf-8')
    return report

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('csv', type=Path)
    parser.add_argument('--output', type=Path, default=Path('output'))
    args = parser.parse_args()
    try:
        print(json.dumps(analyze(args.csv, args.output), indent=2))
    except (ValueError, OSError, csv.Error) as exc:
        parser.exit(2, f'Analysis failed: {exc}\n')
