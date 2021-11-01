const countTypes = 5;
const size = 6;
const areaSize = 400;
const gameTypes = [{ name: 'Нормально', steps: 3 }, { name: 'Сложно', steps: 4 }, { name: 'Очень сложно', steps: 5 }];

function gameType({ name, steps}) {
  this.text = name;
  this.click = () => { generate({ steps }); }
}

function block(id) {
  this.size = `${areaSize / size - 5}px`;
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
      if (((id % size) === (elId % size)) || (~~(id / size)) === (~~(elId / size))) {
        incType();
      }
    });
  },
  isWin: ko.pureComputed(() => (new Set(vm.blocks().map(x => x.blockType()))).size < 2)
}

function generate ({steps}) {
  const elCount = size * size;
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


