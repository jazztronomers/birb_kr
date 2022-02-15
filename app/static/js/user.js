function toggleTab(tab_to_show, tab_class_name){
    for (let tab of document.getElementsByClassName(tab_class_name)){
        if (tab.getAttribute('name') == tab_to_show.getAttribute('name')){
            tab.style.display='block'
        }
        else {
            tab.style.display='none'
        }
    }
}

class Component {
  $target;
  $state;
  constructor ($target) {
    this.$target = $target;
    this.setup();
    this.render();
  }
  setup () {};
  template () { return ''; }
  render () {
    this.$target.innerHTML = this.template();
    this.setEvent();
  }
  setEvent () {}
  setState (newState) {
    this.$state = { ...this.$state, ...newState };
    this.render();
  }
}

//class App extends Component {
//  setup () {
//    this.$state = { items: ['item1', 'item2'] };
//  }
//  template () {
//    const { items } = this.$state;
//    return `
//        <ul>
//          ${items.map(item => `<li>${item}</li>`).join('')}
//        </ul>
//        <button>추가</button>
//    `
//  }
//
//
//}


tab = [
    {"name":"gallery", "display": "block"},
    {"name":"post", "display": "block"},
    {"name":"collection", "display": "block"},
    {"name":"map", "display": "flex"}
]


class UserBodyHeader extends Component {

    setup(){
        this.$state = { items:tab }
    }

    template () {
        const { items } = this.$state;

        return `
            ${items.map(item => `<span class="tab_title" onclick="toggleTab(this, 'user_body_content')" name='${item.name}'>${item.name}</span>`).join('')}
        `
    }
}

class UserBodyContent extends Component {

    setup(){
        this.$state = { items:tab}
    }

    template () {
        const { items } = this.$state;

        return `
            ${items.map(item => `<div class="user_body_content tab_content" name="${item.name}" style="display: ${item.display}">${item.name}</div>`).join('')}
        `
    }
}

