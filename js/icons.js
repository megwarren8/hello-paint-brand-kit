/* hello paint · 60 brand icons / symbols / emoji
   Each lives in a 0 0 100 100 box. Plum (#312B3D) line work, brand-colour dabs.
   `inner` is wrapped by the renderer into a standalone <svg>.               */
(function (root) {
  var HP = root.HP || (root.HP = {});
  var INK = '#312B3D', BERRY = '#E64C81', TEAL = '#15A39A', SUN = '#F6C744',
      LEAF = '#5BA86B', SKY = '#BFE6F2', CARD = '#FFFDF8', PAPER = '#FBF4E8';
  var NS = HP.NS || "'Nunito Sans','Trebuchet MS',sans-serif";
  // common stroke attrs
  var L = 'fill="none" stroke="' + INK + '" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"';
  var L4 = 'fill="none" stroke="' + INK + '" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"';

  HP.ICONS = [
    { id: 'brush', label: 'brush', sub: 'paint & studio', inner:
      '<rect x="43" y="14" width="14" height="40" rx="7" fill="' + TEAL + '"/>' +
      '<rect x="40" y="51" width="20" height="10" rx="2.5" fill="' + INK + '"/>' +
      '<path d="M41 61 L59 61 L55 82 Q50 89 45 82 Z" fill="' + BERRY + '"/>' },

    { id: 'palette', label: 'palette', sub: 'paint & studio', inner:
      '<ellipse cx="50" cy="52" rx="37" ry="31" fill="' + CARD + '" stroke="' + INK + '" stroke-width="5"/>' +
      '<circle cx="67" cy="64" r="7" ' + L4 + '/>' +
      '<circle cx="38" cy="40" r="5.5" fill="' + BERRY + '"/><circle cx="55" cy="37" r="5.5" fill="' + TEAL + '"/>' +
      '<circle cx="38" cy="58" r="5.5" fill="' + SUN + '"/><circle cx="56" cy="55" r="5.5" fill="' + LEAF + '"/>' },

    { id: 'tube', label: 'paint tube', sub: 'paint & studio', inner:
      '<rect x="20" y="40" width="13" height="20" rx="3" fill="' + INK + '"/>' +
      '<rect x="33" y="34" width="42" height="32" rx="11" fill="' + CARD + '" stroke="' + INK + '" stroke-width="5"/>' +
      '<line x1="72" y1="40" x2="72" y2="60" ' + L4 + '/>' +
      '<circle cx="13" cy="50" r="7" fill="' + BERRY + '"/>' },

    { id: 'dab', label: 'paint dab', sub: 'paint & studio', inner:
      '<path d="M50 17 C67 15 85 30 82 49 C80 67 70 73 72 82 C62 84 60 78 47 81 C30 85 15 68 18 49 C21 31 33 19 50 17 Z" fill="' + BERRY + '"/>' +
      '<circle cx="40" cy="42" r="6" fill="#FFFFFF" opacity="0.45"/>' },

    { id: 'jar', label: 'paint jar', sub: 'paint & studio', inner:
      '<rect x="28" y="40" width="44" height="44" rx="11" fill="' + CARD + '" stroke="' + INK + '" stroke-width="5"/>' +
      '<path d="M33 60 Q50 53 67 60 L67 76 Q50 82 33 76 Z" fill="' + LEAF + '"/>' +
      '<rect x="24" y="26" width="52" height="16" rx="6" fill="' + INK + '"/>' },

    { id: 'easel', label: 'easel', sub: 'paint & studio', inner:
      '<line x1="34" y1="84" x2="50" y2="30" ' + L + '/><line x1="66" y1="84" x2="50" y2="30" ' + L + '/>' +
      '<line x1="50" y1="58" x2="50" y2="88" ' + L + '/>' +
      '<rect x="28" y="24" width="44" height="36" rx="4" fill="' + CARD + '" stroke="' + INK + '" stroke-width="5"/>' +
      '<circle cx="50" cy="42" r="7" fill="' + BERRY + '"/>' },

    { id: 'camera', label: 'camera', sub: 'photo & upload', inner:
      '<rect x="16" y="34" width="68" height="46" rx="11" fill="' + CARD + '" stroke="' + INK + '" stroke-width="5"/>' +
      '<path d="M37 34 L40 26 L60 26 L63 34 Z" fill="' + INK + '"/>' +
      '<circle cx="50" cy="57" r="15" ' + L + '/><circle cx="50" cy="57" r="7" fill="' + TEAL + '"/>' +
      '<circle cx="72" cy="45" r="3.5" fill="' + SUN + '"/>' },

    { id: 'photo', label: 'photo', sub: 'photo & upload', inner:
      '<rect x="18" y="24" width="64" height="52" rx="9" fill="' + CARD + '" stroke="' + INK + '" stroke-width="5"/>' +
      '<rect x="24" y="30" width="52" height="40" rx="4" fill="' + SKY + '"/>' +
      '<circle cx="37" cy="42" r="6" fill="' + SUN + '"/>' +
      '<path d="M24 70 Q42 46 56 62 Q66 50 76 70 Z" fill="' + LEAF + '"/>' },

    { id: 'upload', label: 'upload', sub: 'photo & upload', inner:
      '<path d="M24 62 L24 78 Q24 82 28 82 L72 82 Q76 82 76 78 L76 62" ' + L + '/>' +
      '<line x1="50" y1="58" x2="50" y2="20" fill="none" stroke="' + BERRY + '" stroke-width="7" stroke-linecap="round"/>' +
      '<path d="M37 33 L50 20 L63 33" fill="none" stroke="' + BERRY + '" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>' },

    { id: 'frame', label: 'frame', sub: 'photo & upload', inner:
      '<circle cx="50" cy="14" r="3.5" fill="' + INK + '"/>' +
      '<line x1="50" y1="16" x2="34" y2="34" ' + L4 + '/><line x1="50" y1="16" x2="66" y2="34" ' + L4 + '/>' +
      '<rect x="28" y="34" width="44" height="48" rx="5" fill="' + CARD + '" stroke="' + INK + '" stroke-width="5"/>' +
      '<circle cx="50" cy="58" r="9" fill="' + TEAL + '"/>' },

    { id: 'number', label: 'number dot', sub: 'paint-by-number', inner:
      '<circle cx="50" cy="50" r="32" fill="' + SUN + '"/>' +
      '<text x="50" y="65" font-family="' + NS + '" font-weight="800" font-size="42" fill="' + INK + '" text-anchor="middle">1</text>' },

    { id: 'grid', label: 'number grid', sub: 'paint-by-number', inner:
      '<rect x="20" y="20" width="60" height="60" rx="10" fill="' + CARD + '" stroke="' + INK + '" stroke-width="5"/>' +
      '<rect x="24" y="24" width="18" height="18" fill="' + SKY + '"/><rect x="44" y="44" width="12" height="12" fill="' + SUN + '"/><rect x="58" y="58" width="18" height="18" fill="' + LEAF + '"/>' +
      '<line x1="40" y1="20" x2="40" y2="80" ' + L4 + '/><line x1="60" y1="20" x2="60" y2="80" ' + L4 + '/>' +
      '<line x1="20" y1="40" x2="80" y2="40" ' + L4 + '/><line x1="20" y1="60" x2="80" y2="60" ' + L4 + '/>' },

    { id: 'swatch', label: 'paint chips', sub: 'paint-by-number', inner:
      '<g transform="rotate(-13 50 78)"><rect x="38" y="30" width="24" height="50" rx="5" fill="' + LEAF + '" stroke="' + INK + '" stroke-width="3.5"/></g>' +
      '<g transform="rotate(0 50 78)"><rect x="38" y="28" width="24" height="52" rx="5" fill="' + SUN + '" stroke="' + INK + '" stroke-width="3.5"/></g>' +
      '<g transform="rotate(13 50 78)"><rect x="38" y="30" width="24" height="50" rx="5" fill="' + BERRY + '" stroke="' + INK + '" stroke-width="3.5"/></g>' },

    { id: 'heart', label: 'heart', sub: 'love & memory', inner:
      '<path d="M50 82 L22 54 C10 42 18 22 36 22 C44 22 49 28 50 34 C51 28 56 22 64 22 C82 22 90 42 78 54 Z" fill="' + BERRY + '"/>' },

    { id: 'star', label: 'star', sub: 'reviews', inner:
      '<path d="M50 15 L61 39 L86 42 L67 60 L72 85 L50 72 L28 85 L33 60 L14 42 L39 39 Z" fill="' + SUN + '" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"/>' },

    { id: 'gift', label: 'gift', sub: 'commerce', inner:
      '<rect x="24" y="44" width="52" height="40" rx="5" fill="' + CARD + '" stroke="' + INK + '" stroke-width="5"/>' +
      '<rect x="19" y="34" width="62" height="14" rx="4" fill="' + BERRY + '"/>' +
      '<rect x="45" y="34" width="10" height="50" fill="' + TEAL + '"/>' +
      '<circle cx="41" cy="30" r="7" fill="' + TEAL + '"/><circle cx="59" cy="30" r="7" fill="' + TEAL + '"/>' },

    { id: 'bag', label: 'shopping bag', sub: 'commerce', inner:
      '<path d="M28 38 L72 38 L77 82 Q77 84 75 84 L25 84 Q23 84 23 82 Z" fill="' + CARD + '" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round"/>' +
      '<path d="M40 38 Q40 22 50 22 Q60 22 60 38" ' + L + '/>' +
      '<circle cx="50" cy="62" r="7" fill="' + BERRY + '"/>' },

    { id: 'tag', label: 'price tag', sub: 'commerce', inner:
      '<path d="M40 26 L80 26 Q84 26 84 30 L84 70 Q84 74 80 74 L40 74 L16 50 Z" fill="' + SUN + '" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round"/>' +
      '<circle cx="34" cy="50" r="6" fill="' + PAPER + '" stroke="' + INK + '" stroke-width="3.5"/>' },

    { id: 'package', label: 'package', sub: 'shipping', inner:
      '<path d="M50 24 L80 38 L50 52 L20 38 Z" fill="' + PAPER + '" stroke="' + INK + '" stroke-width="4.5" stroke-linejoin="round"/>' +
      '<path d="M20 38 L50 52 L50 84 L20 70 Z" fill="' + CARD + '" stroke="' + INK + '" stroke-width="4.5" stroke-linejoin="round"/>' +
      '<path d="M80 38 L50 52 L50 84 L80 70 Z" fill="#F0E5D2" stroke="' + INK + '" stroke-width="4.5" stroke-linejoin="round"/>' +
      '<path d="M35 31 L65 45" stroke="' + BERRY + '" stroke-width="4.5" stroke-linecap="round"/>' },

    { id: 'sparkle', label: 'sparkle', sub: 'social & ui', inner:
      '<path d="M50 14 C53 38 62 47 86 50 C62 53 53 62 50 86 C47 62 38 53 14 50 C38 47 47 38 50 14 Z" fill="' + SUN + '"/>' +
      '<path d="M78 16 C79 25 81 27 90 28 C81 29 79 31 78 40 C77 31 75 29 66 28 C75 27 77 25 78 16 Z" fill="' + BERRY + '"/>' },

    { id: 'roller', label: 'paint roller', sub: 'paint & studio', inner:
      '<rect x="22" y="26" width="48" height="22" rx="9" fill="' + BERRY + '" stroke="' + INK + '" stroke-width="4"/>' +
      '<rect x="26" y="20" width="40" height="7" rx="3.5" fill="' + INK + '"/>' +
      '<path d="M46 48 L46 60 L64 74" ' + L + '/>' +
      '<rect x="60" y="72" width="11" height="14" rx="3" fill="' + INK + '"/>' },

    { id: 'bucket', label: 'paint can', sub: 'paint & studio', inner:
      '<path d="M30 38 L70 38 L66 82 Q66 84 64 84 L36 84 Q34 84 34 82 Z" fill="' + CARD + '" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round"/>' +
      '<ellipse cx="50" cy="38" rx="20" ry="6" fill="' + SUN + '"/>' +
      '<path d="M32 40 Q50 18 68 40" ' + L4 + '/>' },

    { id: 'droplet', label: 'droplet', sub: 'paint & studio', inner:
      '<path d="M50 16 C66 40 74 54 74 64 A24 24 0 1 1 26 64 C26 54 34 40 50 16 Z" fill="' + TEAL + '"/>' +
      '<circle cx="40" cy="62" r="6" fill="#FFFFFF" opacity="0.45"/>' },

    { id: 'splatter', label: 'splatter', sub: 'paint & studio', inner:
      '<circle cx="50" cy="52" r="20" fill="' + BERRY + '"/>' +
      '<circle cx="76" cy="38" r="7" fill="' + SUN + '"/><circle cx="26" cy="40" r="6" fill="' + TEAL + '"/>' +
      '<circle cx="70" cy="72" r="6" fill="' + LEAF + '"/><circle cx="30" cy="74" r="5" fill="' + SUN + '"/>' +
      '<circle cx="84" cy="58" r="3.5" fill="' + BERRY + '"/><circle cx="50" cy="20" r="4" fill="' + TEAL + '"/>' },

    { id: 'pencil', label: 'pencil', sub: 'paint & studio', inner:
      '<g transform="rotate(45 50 50)"><rect x="42" y="16" width="16" height="50" fill="' + SUN + '" stroke="' + INK + '" stroke-width="3.5"/>' +
      '<rect x="42" y="12" width="16" height="7" fill="' + BERRY + '"/>' +
      '<path d="M42 66 L58 66 L50 84 Z" fill="' + INK + '"/></g>' },

    { id: 'scissors', label: 'scissors', sub: 'craft', inner:
      '<circle cx="38" cy="70" r="9" ' + L4 + '/><circle cx="62" cy="70" r="9" ' + L4 + '/>' +
      '<line x1="44" y1="64" x2="72" y2="24" stroke="' + INK + '" stroke-width="5" stroke-linecap="round"/>' +
      '<line x1="56" y1="64" x2="28" y2="24" stroke="' + INK + '" stroke-width="5" stroke-linecap="round"/>' +
      '<circle cx="50" cy="58" r="3" fill="' + BERRY + '"/>' },

    { id: 'wand', label: 'magic wand', sub: 'transform', inner:
      '<line x1="26" y1="78" x2="62" y2="40" stroke="' + INK + '" stroke-width="8" stroke-linecap="round"/>' +
      '<path d="M70 22 C72 33 74 35 85 37 C74 39 72 41 70 52 C68 41 66 39 55 37 C66 35 68 33 70 22 Z" fill="' + SUN + '"/>' +
      '<circle cx="40" cy="30" r="3" fill="' + BERRY + '"/><circle cx="84" cy="64" r="3" fill="' + TEAL + '"/>' },

    { id: 'polaroid', label: 'polaroid', sub: 'photo & upload', inner:
      '<rect x="22" y="18" width="56" height="64" rx="5" fill="' + CARD + '" stroke="' + INK + '" stroke-width="5"/>' +
      '<rect x="29" y="25" width="42" height="38" fill="' + SKY + '"/>' +
      '<circle cx="40" cy="38" r="6" fill="' + SUN + '"/>' +
      '<path d="M29 63 Q45 44 58 60 Q64 52 71 63 Z" fill="' + LEAF + '"/>' },

    { id: 'paw', label: 'paw', sub: 'pets', inner:
      '<ellipse cx="50" cy="64" rx="18" ry="15" fill="' + BERRY + '"/>' +
      '<circle cx="34" cy="44" r="8" fill="' + BERRY + '"/><circle cx="46" cy="34" r="8" fill="' + BERRY + '"/>' +
      '<circle cx="58" cy="34" r="8" fill="' + BERRY + '"/><circle cx="70" cy="44" r="8" fill="' + BERRY + '"/>' },

    { id: 'rings', label: 'rings', sub: 'weddings', inner:
      '<circle cx="40" cy="58" r="20" fill="none" stroke="' + SUN + '" stroke-width="7"/>' +
      '<circle cx="62" cy="58" r="20" fill="none" stroke="' + TEAL + '" stroke-width="7"/>' +
      '<path d="M62 24 L66 31 L62 38 L58 31 Z" fill="' + SUN + '"/>' },

    { id: 'plane', label: 'paper plane', sub: 'travel', inner:
      '<path d="M18 50 L84 22 L70 82 L52 58 Z" fill="' + CARD + '" stroke="' + INK + '" stroke-width="4.5" stroke-linejoin="round"/>' +
      '<path d="M52 58 L84 22" fill="none" stroke="' + INK + '" stroke-width="3.5"/>' +
      '<path d="M18 50 L52 58" fill="none" stroke="' + INK + '" stroke-width="3.5"/>' },

    { id: 'mug', label: 'mug', sub: 'cozy', inner:
      '<rect x="26" y="40" width="40" height="42" rx="9" fill="' + CARD + '" stroke="' + INK + '" stroke-width="5"/>' +
      '<path d="M66 50 Q84 50 84 61 Q84 72 66 72" fill="none" stroke="' + INK + '" stroke-width="5"/>' +
      '<path d="M28 41 Q46 31 64 41 L64 44 Q46 36 28 44 Z" fill="' + BERRY + '"/>' +
      '<path d="M38 22 Q34 28 38 34 M50 22 Q46 28 50 34" fill="none" stroke="' + INK + '" stroke-width="3.5" stroke-linecap="round"/>' },

    { id: 'envelope', label: 'envelope', sub: 'social & ui', inner:
      '<rect x="18" y="28" width="64" height="44" rx="7" fill="' + CARD + '" stroke="' + INK + '" stroke-width="5"/>' +
      '<path d="M21 32 L50 54 L79 32" fill="none" stroke="' + INK + '" stroke-width="4.5" stroke-linejoin="round"/>' },

    { id: 'pin', label: 'location pin', sub: 'social & ui', inner:
      '<path d="M50 14 C66 14 78 26 78 42 C78 60 50 86 50 86 C50 86 22 60 22 42 C22 26 34 14 50 14 Z" fill="' + BERRY + '"/>' +
      '<circle cx="50" cy="40" r="10" fill="' + CARD + '"/>' },

    { id: 'comment', label: 'comment', sub: 'social & ui', inner:
      '<rect x="18" y="22" width="64" height="44" rx="14" fill="' + CARD + '" stroke="' + INK + '" stroke-width="5"/>' +
      '<path d="M34 62 L30 80 L50 64" fill="' + CARD + '" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round"/>' +
      '<circle cx="38" cy="44" r="4.5" fill="' + BERRY + '"/><circle cx="50" cy="44" r="4.5" fill="' + TEAL + '"/><circle cx="62" cy="44" r="4.5" fill="' + SUN + '"/>' },

    { id: 'share', label: 'share', sub: 'social & ui', inner:
      '<circle cx="30" cy="50" r="9" fill="' + TEAL + '"/><circle cx="70" cy="28" r="9" fill="' + BERRY + '"/><circle cx="70" cy="72" r="9" fill="' + SUN + '"/>' +
      '<line x1="38" y1="46" x2="62" y2="32" stroke="' + INK + '" stroke-width="4.5" stroke-linecap="round"/>' +
      '<line x1="38" y1="54" x2="62" y2="68" stroke="' + INK + '" stroke-width="4.5" stroke-linecap="round"/>' },

    { id: 'check', label: 'check', sub: 'reviews', inner:
      '<circle cx="50" cy="50" r="34" fill="' + LEAF + '"/>' +
      '<path d="M36 52 L46 63 L66 39" fill="none" stroke="#FFFFFF" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>' },

    { id: 'play', label: 'play', sub: 'social & ui', inner:
      '<circle cx="50" cy="50" r="34" fill="' + BERRY + '"/>' +
      '<path d="M43 36 L43 64 L66 50 Z" fill="#FFFFFF"/>' },

    { id: 'hashtag', label: 'hashtag', sub: 'social & ui', inner:
      '<line x1="40" y1="22" x2="34" y2="78" stroke="' + INK + '" stroke-width="7" stroke-linecap="round"/>' +
      '<line x1="64" y1="22" x2="58" y2="78" stroke="' + INK + '" stroke-width="7" stroke-linecap="round"/>' +
      '<line x1="26" y1="40" x2="74" y2="40" stroke="' + INK + '" stroke-width="7" stroke-linecap="round"/>' +
      '<line x1="24" y1="60" x2="72" y2="60" stroke="' + INK + '" stroke-width="7" stroke-linecap="round"/>' },

    { id: 'bulb', label: 'lightbulb', sub: 'ideas', inner:
      '<circle cx="50" cy="44" r="23" fill="' + SUN + '" stroke="' + INK + '" stroke-width="4"/>' +
      '<rect x="40" y="64" width="20" height="9" rx="2" fill="' + INK + '"/>' +
      '<rect x="43" y="74" width="14" height="6" rx="3" fill="' + INK + '"/>' +
      '<path d="M50 35 L50 55 M44 43 L50 49 L56 41" fill="none" stroke="' + INK + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>' },

    { id: 'calendar', label: 'calendar', sub: 'planning', inner:
      '<rect x="20" y="28" width="60" height="54" rx="8" fill="' + CARD + '" stroke="' + INK + '" stroke-width="5"/>' +
      '<rect x="22" y="30" width="56" height="14" fill="' + BERRY + '"/>' +
      '<line x1="36" y1="20" x2="36" y2="34" ' + L + '/><line x1="64" y1="20" x2="64" y2="34" ' + L + '/>' +
      '<circle cx="38" cy="58" r="4" fill="' + TEAL + '"/><circle cx="54" cy="58" r="4" fill="' + SUN + '"/><circle cx="70" cy="58" r="4" fill="' + LEAF + '"/><circle cx="38" cy="72" r="4" fill="' + SUN + '"/><circle cx="54" cy="72" r="4" fill="' + LEAF + '"/>' },

    { id: 'trophy', label: 'trophy', sub: 'reviews', inner:
      '<path d="M34 22 L66 22 L64 44 Q50 58 36 44 Z" fill="' + SUN + '" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"/>' +
      '<path d="M34 26 Q22 26 24 38 Q26 46 36 44" ' + L4 + '/><path d="M66 26 Q78 26 76 38 Q74 46 64 44" ' + L4 + '/>' +
      '<rect x="46" y="56" width="8" height="12" fill="' + INK + '"/><rect x="36" y="68" width="28" height="9" rx="3" fill="' + INK + '"/>' },

    { id: 'thumbsup', label: 'thumbs up', sub: 'social & ui', inner:
      '<path d="M28 52 L40 52 L40 80 L28 80 Z" fill="' + CARD + '" stroke="' + INK + '" stroke-width="4"/>' +
      '<path d="M40 52 Q44 52 46 48 L54 30 Q56 24 61 26 Q66 28 64 38 L60 50 L74 50 Q81 50 79 58 L75 74 Q73 80 66 80 L40 80 Z" fill="' + SUN + '" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"/>' },

    { id: 'smiley', label: 'smiley', sub: 'social & ui', inner:
      '<circle cx="50" cy="50" r="34" fill="' + SUN + '"/>' +
      '<circle cx="39" cy="44" r="4.5" fill="' + INK + '"/><circle cx="61" cy="44" r="4.5" fill="' + INK + '"/>' +
      '<path d="M37 58 Q50 70 63 58" fill="none" stroke="' + INK + '" stroke-width="5" stroke-linecap="round"/>' },

    { id: 'ruler', label: 'ruler', sub: 'craft', inner:
      '<g transform="rotate(45 50 50)"><rect x="30" y="22" width="40" height="56" rx="4" fill="' + TEAL + '" stroke="' + INK + '" stroke-width="4"/>' +
      '<line x1="30" y1="34" x2="42" y2="34" stroke="' + INK + '" stroke-width="3"/><line x1="30" y1="44" x2="46" y2="44" stroke="' + INK + '" stroke-width="3"/><line x1="30" y1="54" x2="42" y2="54" stroke="' + INK + '" stroke-width="3"/><line x1="30" y1="64" x2="46" y2="64" stroke="' + INK + '" stroke-width="3"/></g>' },

    { id: 'spraycan', label: 'spray can', sub: 'paint & studio', inner:
      '<rect x="34" y="34" width="34" height="50" rx="8" fill="' + CARD + '" stroke="' + INK + '" stroke-width="5"/>' +
      '<rect x="40" y="24" width="22" height="12" rx="3" fill="' + INK + '"/>' +
      '<rect x="44" y="46" width="16" height="14" rx="2" fill="' + BERRY + '"/>' +
      '<circle cx="78" cy="22" r="3" fill="' + TEAL + '"/><circle cx="85" cy="31" r="2.5" fill="' + SUN + '"/><circle cx="74" cy="34" r="2" fill="' + BERRY + '"/>' },

    { id: 'clock', label: 'clock', sub: 'planning', inner:
      '<circle cx="50" cy="52" r="32" fill="' + CARD + '" stroke="' + INK + '" stroke-width="5"/>' +
      '<line x1="50" y1="52" x2="50" y2="34" stroke="' + INK + '" stroke-width="5" stroke-linecap="round"/><line x1="50" y1="52" x2="64" y2="58" stroke="' + INK + '" stroke-width="5" stroke-linecap="round"/>' +
      '<circle cx="50" cy="52" r="3.5" fill="' + BERRY + '"/>' },

    { id: 'flower', label: 'flower', sub: 'love & memory', inner:
      '<circle cx="50" cy="30" r="11" fill="' + BERRY + '"/><circle cx="68" cy="41" r="11" fill="' + BERRY + '"/><circle cx="68" cy="61" r="11" fill="' + BERRY + '"/><circle cx="50" cy="72" r="11" fill="' + BERRY + '"/><circle cx="32" cy="61" r="11" fill="' + BERRY + '"/><circle cx="32" cy="41" r="11" fill="' + BERRY + '"/>' +
      '<circle cx="50" cy="51" r="12" fill="' + SUN + '"/>' },

    { id: 'balloon', label: 'balloon', sub: 'love & memory', inner:
      '<ellipse cx="50" cy="42" rx="26" ry="30" fill="' + BERRY + '"/>' +
      '<path d="M44 70 L56 70 L50 80 Z" fill="' + BERRY + '"/>' +
      '<path d="M50 80 Q57 88 50 95" fill="none" stroke="' + INK + '" stroke-width="3" stroke-linecap="round"/>' },

    { id: 'cake', label: 'cake', sub: 'love & memory', inner:
      '<rect x="24" y="54" width="52" height="28" rx="5" fill="' + BERRY + '" stroke="' + INK + '" stroke-width="4"/>' +
      '<rect x="30" y="42" width="40" height="16" rx="4" fill="' + SUN + '" stroke="' + INK + '" stroke-width="4"/>' +
      '<line x1="50" y1="30" x2="50" y2="42" stroke="' + INK + '" stroke-width="4"/><circle cx="50" cy="27" r="4" fill="' + TEAL + '"/>' },

    { id: 'wave', label: 'wave', sub: 'social & ui', inner:
      '<g transform="rotate(12 50 58)">' +
      '<rect x="34" y="40" width="32" height="42" rx="15" fill="' + SUN + '" stroke="' + INK + '" stroke-width="4"/>' +
      '<line x1="40" y1="44" x2="40" y2="30" stroke="' + INK + '" stroke-width="5" stroke-linecap="round"/>' +
      '<line x1="48" y1="44" x2="48" y2="26" stroke="' + INK + '" stroke-width="5" stroke-linecap="round"/>' +
      '<line x1="56" y1="44" x2="56" y2="28" stroke="' + INK + '" stroke-width="5" stroke-linecap="round"/>' +
      '<line x1="63" y1="46" x2="68" y2="36" stroke="' + INK + '" stroke-width="5" stroke-linecap="round"/>' +
      '<path d="M34 58 Q26 56 24 63" fill="none" stroke="' + INK + '" stroke-width="5" stroke-linecap="round"/></g>' +
      '<path d="M74 32 Q81 40 79 50" fill="none" stroke="' + BERRY + '" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M82 26 Q90 36 88 50" fill="none" stroke="' + BERRY + '" stroke-width="4" stroke-linecap="round"/>' },

    { id: 'rainbow', label: 'rainbow', sub: 'love & memory', inner:
      '<path d="M16 72 A34 34 0 0 1 84 72" fill="none" stroke="' + BERRY + '" stroke-width="9" stroke-linecap="round"/>' +
      '<path d="M27 72 A23 23 0 0 1 73 72" fill="none" stroke="' + SUN + '" stroke-width="9" stroke-linecap="round"/>' +
      '<path d="M38 72 A12 12 0 0 1 62 72" fill="none" stroke="' + TEAL + '" stroke-width="9" stroke-linecap="round"/>' +
      '<circle cx="16" cy="76" r="8" fill="#FFFFFF" stroke="' + INK + '" stroke-width="3.5"/>' +
      '<circle cx="84" cy="76" r="8" fill="#FFFFFF" stroke="' + INK + '" stroke-width="3.5"/>' },

    { id: 'party', label: 'party popper', sub: 'love & memory', inner:
      '<path d="M20 84 L40 50 L58 64 Z" fill="' + SUN + '" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"/>' +
      '<path d="M28 70 L46 60 M24 78 L40 70" fill="none" stroke="' + INK + '" stroke-width="3" stroke-linecap="round"/>' +
      '<circle cx="60" cy="40" r="5" fill="' + BERRY + '"/><circle cx="74" cy="28" r="4.5" fill="' + TEAL + '"/>' +
      '<circle cx="80" cy="46" r="4" fill="' + LEAF + '"/><circle cx="56" cy="22" r="4" fill="' + TEAL + '"/>' +
      '<rect x="66" y="56" width="8" height="8" rx="1.5" fill="' + BERRY + '" transform="rotate(20 70 60)"/>' +
      '<path d="M52 58 Q66 48 76 56" fill="none" stroke="' + SUN + '" stroke-width="3" stroke-linecap="round"/>' },

    { id: 'medal', label: 'medal', sub: 'reviews', inner:
      '<path d="M36 18 L48 50 L34 54 Z" fill="' + BERRY + '"/>' +
      '<path d="M64 18 L66 54 L52 50 Z" fill="' + TEAL + '"/>' +
      '<circle cx="50" cy="64" r="22" fill="' + SUN + '" stroke="' + INK + '" stroke-width="4"/>' +
      '<path d="M50 52 L54 61 L64 62 L56 68 L59 78 L50 72 L41 78 L44 68 L36 62 L46 61 Z" fill="' + INK + '"/>' },

    { id: 'crown', label: 'crown', sub: 'reviews', inner:
      '<path d="M22 74 L26 38 L40 54 L50 30 L60 54 L74 38 L78 74 Z" fill="' + SUN + '" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"/>' +
      '<line x1="22" y1="74" x2="78" y2="74" stroke="' + INK + '" stroke-width="4" stroke-linecap="round"/>' +
      '<circle cx="26" cy="36" r="4" fill="' + BERRY + '"/><circle cx="50" cy="28" r="4" fill="' + BERRY + '"/><circle cx="74" cy="36" r="4" fill="' + BERRY + '"/>' +
      '<circle cx="40" cy="66" r="3.5" fill="' + TEAL + '"/><circle cx="50" cy="66" r="3.5" fill="' + BERRY + '"/><circle cx="60" cy="66" r="3.5" fill="' + TEAL + '"/>' },

    { id: 'music', label: 'music note', sub: 'social & ui', inner:
      '<line x1="62" y1="24" x2="62" y2="64" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/>' +
      '<path d="M62 24 Q80 26 80 42 Q72 35 62 40 Z" fill="' + INK + '"/>' +
      '<ellipse cx="50" cy="66" rx="13" ry="10" fill="' + BERRY + '" stroke="' + INK + '" stroke-width="4" transform="rotate(-16 50 66)"/>' },

    { id: 'sun', label: 'sun', sub: 'cozy', inner:
      '<g stroke="' + SUN + '" stroke-width="6" stroke-linecap="round">' +
      '<line x1="50" y1="12" x2="50" y2="24"/><line x1="50" y1="76" x2="50" y2="88"/>' +
      '<line x1="12" y1="50" x2="24" y2="50"/><line x1="76" y1="50" x2="88" y2="50"/>' +
      '<line x1="24" y1="24" x2="33" y2="33"/><line x1="67" y1="67" x2="76" y2="76"/>' +
      '<line x1="76" y1="24" x2="67" y2="33"/><line x1="33" y1="67" x2="24" y2="76"/></g>' +
      '<circle cx="50" cy="50" r="19" fill="' + SUN + '" stroke="' + INK + '" stroke-width="4"/>' },

    { id: 'moon', label: 'moon', sub: 'cozy', inner:
      '<path d="M62 20 A32 32 0 1 0 62 80 A25 25 0 1 1 62 20 Z" fill="' + SKY + '" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"/>' +
      '<path d="M74 28 L76 34 L82 36 L76 38 L74 44 L72 38 L66 36 L72 34 Z" fill="' + SUN + '"/>' +
      '<circle cx="80" cy="52" r="2.5" fill="' + SUN + '"/>' },

    { id: 'fire', label: 'fire', sub: 'social & ui', inner:
      '<path d="M52 16 C60 32 72 38 72 56 A22 22 0 1 1 28 56 C28 44 38 44 40 33 C49 39 45 27 52 16 Z" fill="' + BERRY + '"/>' +
      '<path d="M51 46 C56 54 59 58 59 65 A9 9 0 1 1 41 65 C41 58 45 56 47 51 C51 56 48 50 51 46 Z" fill="' + SUN + '"/>' },

    { id: 'gem', label: 'gem', sub: 'commerce', inner:
      '<path d="M30 30 L70 30 L84 46 L50 84 L16 46 Z" fill="' + TEAL + '" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"/>' +
      '<path d="M30 30 L38 46 L16 46 M70 30 L62 46 L84 46 M38 46 L50 84 L62 46 M38 46 L62 46 M44 30 L38 46 M56 30 L62 46" fill="none" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>' +
      '<path d="M40 35 L46 35" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" opacity="0.6"/>' }
  ];
})(window);
