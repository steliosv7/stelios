import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseCSV,cleanRows,summarize} from '../projects/book-analysis/analysis.mjs';
import {advance} from '../projects/air-juggler/physics.mjs';
const header='Name,Author,User Rating,Reviews,Price,Year,Genre\n';
test('CSV preserves quoted commas, escaped quotes, CRLF and multiline fields',()=>{
 const rows=parseCSV('a,b\r\n"one, two","say ""hi"""\r\n"line\nbreak",ok');
 assert.deepEqual(rows,[['a','b'],['one, two','say "hi"'],['line\nbreak','ok']]);
});
test('Malformed CSV and missing columns are rejected',()=>{
 assert.throws(()=>parseCSV('a\n"unfinished'));assert.throws(()=>parseCSV('a\n"x"oops'));
 assert.throws(()=>cleanRows(parseCSV('Title,Price\na,1')));
});
test('Invalid numbers, row widths and empty fields are excluded; duplicates normalized',()=>{
 const text=header+'A,B,4.5,100,12,2024,Fiction\nA,B,4.50,100,12,2024,Fiction\nA,B,6,100,12,2024,Fiction\nA,B,4,Infinity,12,2024,Fiction\nA,B,4,2,Infinity,2024,Fiction\nA,B,4,1.5,12,2024,Fiction\nA,B,4,2,12,2024.5,Fiction\nA,B,,2,12,2024,Fiction\nA,B,4,2,12,2024,Fiction,extra';
 const clean=cleanRows(parseCSV(text));assert.equal(clean.rows.length,1);assert.equal(clean.invalid,7);assert.equal(clean.duplicates,1);
});
test('Zero ratings/prices/reviews are legitimate and repeated years remain observations',()=>{
 const clean=cleanRows(parseCSV(header+'A,B,0,0,0,2023,Fiction\nA,B,4,1,10,2024,Fiction'));
 assert.equal(clean.invalid,0);assert.deepEqual(summarize(clean.rows),{entries:2,unique_titles:1,mean_rating:2,mean_price:5,entries_by_year:{2023:1,2024:1}});
 assert.equal(summarize([]).mean_rating,null);
});
test('Fictional fixture has expected aggregate values',()=>{
 const clean=cleanRows(parseCSV(readFileSync(new URL('../projects/book-analysis/data/demo_books.csv',import.meta.url),'utf8')));
 const summary=summarize(clean.rows);assert.equal(summary.entries,12);assert.equal(summary.unique_titles,8);assert.equal(summary.entries_by_year[2025],4);assert.ok(Math.abs(summary.mean_rating-4.5666666667)<1e-6);
});
test('Paddle collision scores once and sends descending ball upward',()=>{
 const ball={x:425,y:399,vx:0,vy:100};assert.equal(advance(ball,425,.016),'hit');assert.ok(ball.vy<0);assert.notEqual(advance(ball,425,.016),'hit');
});
test('Side and top walls reflect balls; missing the paddle loses a life',()=>{
 const left={x:5,y:50,vx:-100,vy:0};advance(left,425,.016);assert.equal(left.x,12);assert.ok(left.vx>0);
 const right={x:845,y:50,vx:100,vy:0};advance(right,425,.016);assert.equal(right.x,838);assert.ok(right.vx<0);
 const top={x:100,y:5,vx:0,vy:-100};advance(top,425,.016);assert.ok(top.vy>0);
 const miss={x:100,y:511,vx:0,vy:100};assert.equal(advance(miss,425,.016),'miss');
});
