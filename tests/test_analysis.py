import importlib.util
import json
import tempfile
import unittest
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('analyze', ROOT / 'projects/book-analysis/analyze.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
HEADER = 'Name,Author,User Rating,Reviews,Price,Year,Genre\n'

class AnalysisTests(unittest.TestCase):
    def test_fixture_and_exported_artifacts(self):
        with tempfile.TemporaryDirectory() as tmp:
            report = module.analyze(ROOT / 'projects/book-analysis/data/demo_books.csv', tmp)
            self.assertEqual(report['entries'], 12)
            self.assertEqual(report['unique_titles'], 8)
            self.assertEqual(report['entries_by_year']['2025'], 4)
            self.assertAlmostEqual(report['mean_rating'], 4.566666666666666)
            self.assertEqual(json.loads((Path(tmp)/'summary.json').read_text()), report)
            self.assertTrue((Path(tmp)/'top_rated.csv').exists())
            self.assertTrue((Path(tmp)/'by_genre.csv').exists())
    def test_invalid_rows_duplicates_and_zeroes(self):
        with tempfile.TemporaryDirectory() as tmp:
            source = Path(tmp)/'input.csv'
            source.write_text(HEADER+'A,B,0,0,0,2023,Fiction\nA,B,0.0,0,0,2023,Fiction\nA,B,4,5,10,2024,Fiction\nA,B,6,0,1,2024,Fiction\nA,B,4,inf,1,2024,Fiction\nA,B,4,1,inf,2024,Fiction\nA,B,4,1.5,1,2024,Fiction\nA,B,4,1,1,2024.5,Fiction\nA,B,,1,1,2024,Fiction\nA,B,4,1,1,2024,Fiction,extra')
            report=module.analyze(source,Path(tmp)/'report')
            self.assertEqual(report['entries'],2)
            self.assertEqual(report['unique_titles'],1)
            self.assertEqual(report['exact_duplicates_removed'],1)
            self.assertEqual(report['invalid_rows_excluded'],7)
            self.assertEqual(report['mean_rating'],2)
    def test_missing_schema_and_empty_data(self):
        with tempfile.TemporaryDirectory() as tmp:
            source=Path(tmp)/'bad.csv'
            source.write_text('Title,Price\na,4')
            with self.assertRaises(ValueError): module.analyze(source,Path(tmp)/'out')
            source.write_text(HEADER)
            with self.assertRaises(ValueError): module.analyze(source,Path(tmp)/'out')
    def test_quoted_titles(self):
        with tempfile.TemporaryDirectory() as tmp:
            source=Path(tmp)/'quoted.csv'
            source.write_text(HEADER+'"Book, One","Author ""A""",4,2,1,2024,Fiction')
            report=module.analyze(source,Path(tmp)/'out')
            self.assertEqual(report['entries'],1)

if __name__ == '__main__': unittest.main()
