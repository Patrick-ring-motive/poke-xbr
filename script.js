(() => {
  const Q = fn => {
    try {
      return fn();
    } catch (e) { }
  };
  const str = x => String(x?.description ?? x?.source ?? x?.name ?? x);

  function XpathIterator(xpathExpression, options = {
    resultType: XPathResult.ANY_TYPE,
    contextNode: document,
    namespaceResolver: null,
    result: null,
  }) {

    xpathExpression = str(xpathExpression);
    const xpath = Q(() => document.evaluate(
      xpathExpression,
      contextNode,
      namespaceResolver,
      resultType,
      result,
    ));

    const $this = new.target ? this : Object.create(XpathIterator.prototype);
    $this.next = function next() {
      const x = Q(() => xpath?.iterateNext?.());
      return x ? { value: x, done: false } : { done: true };
    };

    $this[Symbol.iterator] = function iterator() { return $this; };
    return $this;
  }

  function xpathSelect() {
    const xpath = document.evaluate(...arguments);

    const iter = Object.create(null);
    iter.next = function next() {
      const x = Q(() => (
        xpath.iterateNext()
      ));
      return x ? { value: x, done: false } : { done: true };
    };

    iter[Symbol.iterator] = function iterator() { return iter; };
    return iter;
  }


  function TreeIterator() {
    const tree = Q(() => document.createTreeWalker(...arguments));

    const $this = new.target ? this : Object.create(TreeIterator.prototype);
    $this.next = function next() {
      const x = Q(() => tree.nextNode());
      return x ? { value: x, done: false } : { done: true };
    };

    $this[Symbol.iterator] = function iterator() { return $this; };
    return $this;
  }

  const getStat = (baseStats, x) => str(str(baseStats?.querySelector?.(`a[href$="${x}i"]`)?.parentElement?.parentElement?.textContent).split(':')[1]).trim();

  //const str = x => String(x?.description ?? x?.source ?? x?.name ?? x);
  /*(async()=>{
    const parser = new DOMParser();
    const parse = x => parser.parseFromString(x, "text/html");
    const bulbasaur = parse(await(await fetch('https://poke-scrape.patrickring.net/wiki/Bulbasaur_(Pok%C3%A9mon)')).text());
    const baseStats = bulbasaur.querySelector('h4:has(#Base_stats)')?.nextElementSibling;
    const HP = getStat(baseStats,'HP');
    console.log(HP);
  })();*/

  function Pokemon(init = {}) {
    const $class = Q(() => arguments?.callee) ?? Pokemon;
    const $this = new.target ? this : Object.create($class.prototype);
    $this.type1 = init.type1 ?? init.type2 ?? 'normal';
    $this.type2 = init.type2 ?? init.type1 ?? 'normal';
    $this.moves = [...(init.moves ?? [{
      name: 'tackle'
    }])].filter(x => x.name);
    $this.moves = $this.moves.filter(x => ($this.moves.find(y => y.name) == x));
    $this.moves.forEach(x => {
      x.maxpp ??= 5;
      x.pp ??= x.maxpp;
    });
    $this.species = init.species ?? new Species();
    $this.name = init.name ?? init.species;
    $this.level = init.level ?? 1;
    $this.exp = init.exp ?? 1;
    $this.stats = init.stats ?? {};
    $this.stats.maxhp ??= 1;
    $this.stats.hp ??= $this.stats.maxhp;
    $this.stats.attack ??= 1;
    $this.stats.defense ??= 1;
    $this.stats.specialAttack ??= 1;
    $this.stats.specialDefense ??= 1;
    $this.stats.speed ??= 1;
    $this.battleStats = init.battleStats ?? $this.stats;
    $this.battleStats.accuracy ??= 1;
    $this.battleStats.evasion ??= 1;
    $this.battleEffects = init.battleEffects ?? [];
    $this.statusEffects = init.battleEffects ?? [];
    return $this;
  }
  function Species(init = {}) {
    const $class = Q(() => arguments?.callee) ?? Species;
    const $this = new.target ? this : Object.create($class.prototype);
    $this.name = init.name ?? 'MissingNo';
    $this.type1 = init.type1 ?? init.type2 ?? 'normal';
    $this.type2 = init.type2 ?? init.type1 ?? 'normal';
    $this.frontSprite = init.frontSprite ?? 'https://poke-archive-scrape.patrickring.net/media/upload/9/98/Missingno_RB.png';
    $this.backSprite = init.backSprite ?? 'https://poke-archive-scrape.patrickring.net/media/upload/f/f6/Spr_1b_003.png';
    $this.icon = init.icon ?? 'https://poke-archive-scrape.patrickring.net/media/upload/1/1f/AniMS_Missingno_I.png';
    $this.moveSet = [...(init.moveSet ?? [{
      name: 'tackle'
    }])].filter(x => x.name);
    $this.moveSet = $this.moveSet.filter(x => ($this.moveSet.find(y => y.name) == x));
    $this.evolutions = init.evolutions ?? [];
    return $this
  }


  const pokemon = new Pokemon();
  const opponent = new Pokemon();
  const topLeft = document.querySelector('[id="top-left"i]');
  const topRight = document.querySelector('[id="top-right"i]');
  const bottomLeft = document.querySelector('[id="bottom-left"i]');
  const bottomRight = document.querySelector('[id="bottom-right"i]');

  [...topLeft?.children].forEach(x => x.remove?.());
  let oph = document.createElement('div');
  oph.setAttribute('style', "border-top-color:green;border-top-width:thick;border-top-style:solid;width:100%;height:100%");
  topLeft.appendChild(oph);

  [...topRight?.children].forEach(x => x.remove?.());
  let op = document.createElement('img');
  op.crossOrigin = 'anonymous';
  op.src = opponent.species.frontSprite;
  op.style.opactiy = 0;
  op.style.width = '100%';
  op.style.height = '100%';

  topRight.appendChild(op);

  [...bottomLeft?.children].forEach(x => x.remove?.());
  let pk = document.createElement('img');
  pk.crossOrigin = 'anonymous';
  pk.src = pokemon.species.backSprite;
  pk.style.opacity = 0;
  pk.style.width = '100%';
  pk.style.height = '100%';

  bottomLeft.appendChild(pk);

  [...bottomRight?.children].forEach(x => x.remove?.());
  let pkh = document.createElement('div');
  pkh.setAttribute('style', "border-bottom-color:green;border-bottom-width:thick;border-bottom-style:solid;width:100%;height:100%");
  bottomRight.appendChild(pkh);



})();