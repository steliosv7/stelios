export const HEADERS=['Name','Author','User Rating','Reviews','Price','Year','Genre'];
export function parseCSV(text){
 text=text.replace(/^\uFEFF/,'');const rows=[];let row=[],field='',quoted=false,afterQuote=false;
 for(let i=0;i<text.length;i++){const c=text[i];if(quoted){if(c==='"'){if(text[i+1]==='"'){field+='"';i++}else{quoted=false;afterQuote=true}}else field+=c;continue}
 if(c==='"'){if(field||afterQuote)throw Error('Malformed CSV quote.');quoted=true;continue}
 if(c===','||c==='\n'||c==='\r'){row.push(field);field='';afterQuote=false;if(c!==','){if(row.some(v=>v.trim()))rows.push(row);row=[];if(c==='\r'&&text[i+1]==='\n')i++}continue}
 if(afterQuote&&c.trim())throw Error('Unexpected text after quoted field.');if(!afterQuote)field+=c;
 }if(quoted)throw Error('Unclosed CSV quote.');row.push(field);if(row.some(v=>v.trim()))rows.push(row);return rows;
}
export function cleanRows(rows){if(!rows.length)throw Error('CSV is empty.');const header=rows[0].map(v=>v.trim()),idx=HEADERS.map(h=>header.indexOf(h));if(idx.some(i=>i<0))throw Error('Missing columns. Expected: '+HEADERS.join(', '));
 const result=[],seen=new Set();let invalid=0,duplicates=0;
 for(const row of rows.slice(1)){const v=idx.map(i=>(row[i]??'').trim());const [name,author,rating,reviews,price,year,genre]=v;const nums=[rating,reviews,price,year].map(Number);if(row.length!==header.length||!name||!author||!genre||[rating,reviews,price,year].some(v=>!v)||!nums.every(Number.isFinite)||nums[0]<0||nums[0]>5||nums[1]<0||!Number.isInteger(nums[1])||nums[2]<0||!Number.isInteger(nums[3])||nums[3]<1900||nums[3]>2100){invalid++;continue}const normalized=[name,author,...nums,genre],key=JSON.stringify(normalized);if(seen.has(key)){duplicates++;continue}seen.add(key);result.push({name,author,rating:nums[0],reviews:nums[1],price:nums[2],year:nums[3],genre})}
 return {rows:result,invalid,duplicates};
}
export function summarize(rows){return {entries:rows.length,unique_titles:new Set(rows.map(r=>r.name)).size,mean_rating:rows.length?rows.reduce((s,r)=>s+r.rating,0)/rows.length:null,mean_price:rows.length?rows.reduce((s,r)=>s+r.price,0)/rows.length:null,entries_by_year:rows.reduce((a,r)=>(a[r.year]=(a[r.year]||0)+1,a),{})}}
