const countTypes = 5;
const countInLine = 6;
const areaSize = 400;
const gameTypes = [{ name: 'Легко', steps: 3 }, { name: 'Нормально', steps: 4 }, { name: 'Сложно', steps: 5 }];
const elSize = `${areaSize / countInLine - 5}px`;

function gameType({ name, steps}) {
  this.text = name;
  this.click = () => { generate({ name, steps }); }
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
  isWin: ko.pureComputed(() => (new Set(vm.blocks().map(x => x.blockType()))).size < 2),
  topData: ko.observableArray()
}

ko.applyBindings(vm);

let curGameType;
let start;
let userName;
const storageKey = 'fillGame'
vm.isWin.subscribe(newVal => {
  if (newVal && start) {    
    const time = (new Date() - start) / 1000;
    const packedTopData = vm.topData();
    if (isTopResult({ time, steps: curGameType.steps, packedTopData })) {
      userName = prompt('А Ваш результат хорош!\nПод каким именем записать?', userName);
      const topData = unPackTopData(packedTopData);
      topData.push({ steps: curGameType.steps, name: userName, time });
      vm.topData(packTopData(topData));
      localStorage.setItem(storageKey, JSON.stringify(topData));
    }
  } else {
    start = new Date();
  }
});

function generate({ name, steps}) {
  const elCount = countInLine * countInLine;
  vm.blocks([]);
  for (let i = 0; i < elCount; i++) {
    vm.blocks.push(new block(i));
  }
  for (let i = 0; i < steps; i++) {
    const rnd = ~~(Math.random() * (elCount - 1));
    vm.blocks()[rnd].click();    
  }
  curGameType = { name, steps };
}

const packTopData = topData => gameTypes.map(x => ({
  topData: topData.filter(y => y.steps === x.steps).sort((a, b) => a.time - b.time).filter((t, i) => i < 2),
  gameType: x.name,
  steps: x.steps
})
);
const unPackTopData = packedTopData => packedTopData.reduce((rez, x) => [...rez, ...x.topData], []);

const isTopResult = ({ steps, time, packedTopData}) => {
  const topArr = packedTopData.find(x => x.steps === steps).topData || [];
  return (!topArr.length) || topArr[topArr.length - 1].time > time;
}

vm.topData(packTopData(JSON.parse(localStorage.getItem(storageKey) || '[]')));
