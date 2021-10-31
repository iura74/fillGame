const countTypes = 5;
const size = 6;
const areaSize = 400;


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
  elClick(elId){
    vm.blocks().forEach(({ id, incType}) => {
      if (((id % size) === (elId % size)) || (~~(id / size)) === (~~(elId / size))) {
        incType();
      }
    });
  },
  calcWin() {
    const blocks = vm.blocks();
    const rez = (new Set(blocks.map(x => x.blockType()))).size === 1;
    console.log(rez);
    vm.isWin(rez); 
  },
  isWin: ko.pureComputed(() => (new Set(vm.blocks().map(x => x.blockType()))).size === 1)
}

for (let i = 0; i < size * size; i++) {
  vm.blocks.push(new block(i));  
}
for (let i = 0; i < 3; i++) {
  const rnd = ~~(Math.random() * (size * size - 1));
  vm.blocks()[rnd].click();
  console.log(rnd);
}

ko.applyBindings(vm);


