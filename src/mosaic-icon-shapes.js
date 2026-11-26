export const mosaicIcons = {
  pitch: ['xxxxxxx','x..x..x','xx.x.xx','xxaxaxx','xx.x.xx','x..x..x','xxxxxxx'],
  rules: ['.xxxxx.','.x...x.','.xaxxx.','.x...x.','.xaxxx.','.x...x.','.xxxxx.'],
  calendar: ['.x...x.','xxxxxxx','x.....x','xaxaxax','x.....x','xaxaxax','xxxxxxx'],
  routes: ['..x...a','..x..a.','..x.a..','..xa...','..x....','.xxx...','xxxxx..'],
  publish: ['....a..','...aa..','..axxxx','.ax..xx','axxx.x.','..x.x..','..xx...'],
  map: ['x...x..','xx.xx.x','xxxxx.x','x.x.xxx','x.x.x.x','x.xx.xx','xx..x..'],
  network: ['xx...xx','xx...xx','..x.x..','...a...','..x.x..','xx...xx','xx...xx'],
  venue: ['..xxx..','.x...x.','x..a..x','x.aaa.x','.x.a.x.','..x.x..','...x...'],
  play: ['.x.....','.xx....','.xax...','.xaax..','.xax...','.xx....','.x.....'],
  price: ['..xxxx.','.x....x','.x.aa.x','.x.aa.x','.x....x','..xxxx.','......'],
  people: ['..xx...','..xx.a.','.....a.','.xxxx..','x....xa','x....xa','xxxxxxa'],
  archive: ['xxxxxxx','x.....x','xxxxxxx','.x...x.','.xaaax.','.x...x.','.xxxxx.'],
  shield: ['xxxxxxx','x.....x','x...a.x','x..a..x','.x.a.x.','..x.x..','...x...'],
  mail: ['xxxxxxx','xa...ax','x.a.a.x','x..a..x','x.....x','x.....x','xxxxxxx'],
  access: ['..xxx..','..x.x..','..x.x..','.xxxxx.','.x.a.x.','.x.a.x.','.xxxxx.'],
  arrow: ['.......','....x..','.....x.','aaaaaax','.....x.','....x..','.......'],
  left: ['.......','..x....','.x.....','xaaaaaa','.x.....','..x....','.......'],
  caret: ['.......','.......','.x...x.','..x.x..','...a...','.......','.......'],
  menu: ['xxxxxxx','.......','aaaaaaa','.......','xxxxxxx','.......','.......'],
  close: ['x.....x','.x...x.','..x.x..','...a...','..x.x..','.x...x.','x.....x'],
  check: ['......a','.....a.','....a..','x..a...','.xa....','..a....','.......'],
  download: ['...x...','...x...','...x...','.x.x.x.','..xax..','...a...','xxxxxxx'],
  motion: ['.xx....','...x...','..xx...','....a..','.....aa','....a..','......a'],
};

export function mosaicTiles(name) {
  const grid = mosaicIcons[name] || mosaicIcons.pitch;
  return grid.flatMap((line, row) => [...line].flatMap((cell, column) => cell === '.' ? [] : [{
    index: row * 7 + column,
    x: (column * 4 + .35).toFixed(2),
    y: (row * 4 + .35).toFixed(2),
    accent: cell === 'a',
  }]));
}
