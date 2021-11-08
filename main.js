const countTypes = 5;
const countInLine = 6;
const areaSize = 400;
const gameTypes = [{ name: 'Легко', steps: 3 }, { name: 'Нормально', steps: 4 }, { name: 'Сложно', steps: 5 }];
const elSize = `${areaSize / countInLine - 5}px`;

function gameType({ name, steps}) {
  this.text = name;
  this.click = () => { generate({ steps }); }
}

function block(id) {
  this.size = elSize;
  this.blockType = ko.observable(0);
  this.incType = () => {
    this.blockType((this.blockType() + 1) % countTypes);
  };
  this.style = ko.computed(() => `block-${this.blockType()}`); 
  this.id = id;
  this.click = () => {
    vm.elClick(id);
  };
}

const vm = {
  blocks: ko.observableArray(),
  gameTypes: ko.observableArray(gameTypes.map(x => new gameType(x))),
  elClick(elId){
    vm.blocks().forEach(({ id, incType}) => {
      if (((id % countInLine) === (elId % countInLine)) || (~~(id / countInLine)) === (~~(elId / countInLine))) {
        incType();
      }
    });
  },
  isWin: ko.pureComputed(() => (new Set(vm.blocks().map(x => x.blockType()))).size < 2)
}

function generate ({steps}) {
  const elCount = countInLine * countInLine;
  vm.blocks([]);
  for (let i = 0; i < elCount; i++) {
    vm.blocks.push(new block(i));
  }
  for (let i = 0; i < steps; i++) {
    const rnd = ~~(Math.random() * (elCount - 1));
    vm.blocks()[rnd].click();    
  }
}


ko.applyBindings(vm);


