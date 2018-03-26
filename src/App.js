import React, { Component } from 'react';
import './App.css';

const getShortHash = () => Math.random().toString(36).substring(7);

let taskList = [{
  description: 'I have to insert an other task here.',
  done: false,
  key: getShortHash(),
}];

class PlainInput extends Component {
  constructor (props) {
    super(props);

    this.state = {
      focused: true,
    };
    this.createItem = this.createItem.bind(this);
    this.toggleFocus = this.toggleFocus.bind(this);
  }

  createItem (e) {
    if (e.keyCode == 13) {
      e.preventDefault();
      this.props.addListItem(this.refs.newItem.value);

      this.refs.newItem.value = "";
    }
  }

  toggleFocus () {
    this.refs.ListItemAdd.classList.toggle('focused');
  }

  render () {
    return (
      <div ref="ListItemAdd" className="ListItem-Add uk-inline uk-width-1-1 uk-box-shadow-large" >
        <span className="uk-form-icon uk-form-icon-flip" uk-icon="icon: plus"></span>          
        <input onBlur={this.toggleFocus} onFocus={this.toggleFocus} onKeyDown={this.createItem} ref="newItem" className="TodoList-Add uk-input uk-form-large" type="text" />
      </div>
    );
  }
}

class ListItem extends Component {
  constructor (props) {
    super(props);

    this.state = {
      done: false,
      shoon: false
    }

    this.deleteItem = this.deleteItem.bind(this);
    this.toggleItem = this.toggleItem.bind(this);
  }

  deleteItem () {
    this.refs.ListItem.classList.remove('shown');
    setTimeout(() => {
      this.props.removeListItem(this.props.id);
    }, 200);
  }
  
  toggleItem () {
    this.state.done = this.props.toggleListItem(this.props.id);
    this.setState({ done: this.state.done });
  }
  
  componentDidMount () {
    setTimeout(() => {
      this.state.shown = true;
      this.setState({ show: this.state.show });
    }, 200);
  }

  render () {
    let done = this.state.done ? 'done' : '';
    let shown = this.state.shown ? 'shown' : '';
    let itemClassName = `${done} ${shown} TodoList-Item uk-box-shadow-large`
    return (
      <li ref="ListItem" className={itemClassName} >
        <div className="uk-flex uk-flex-between uk-flex-middle uk-flex-nowrap uk-inline">
          <span role="button" className="TodoList-Item-Opt TodoList-Item-Do uk-icon-button uk-position-center-left-out" ref="toggleItem" onClick={this.toggleItem} >
            <span uk-icon={this.props.done ? 'refresh' : 'check'}></span>
          </span>
          <div>
            <span>{this.props.description}</span>
          </div>
          <span role="button" className="TodoList-Item-Opt TodoList-Item-Remove uk-margin-small-right uk-icon-button uk-position-center-right-out" ref="removeItem" onClick={this.deleteItem} >
            <span uk-icon="icon: trash"></span>
          </span>
        </div>
      </li>
    );
  }
}

class TodoList extends Component {
  constructor (props) {
    super(props)

    this.state = {
      taskList
    };

    this.addListItem = this.addListItem.bind(this);
    this.removeListItem = this.removeListItem.bind(this);
    this.toggleListItem = this.toggleListItem.bind(this);
  }

  addListItem (description) {
    if (/\w/g.test(description)) {
      this.state.taskList.push({
        description,
        done: false,
        key: getShortHash()
      });
      this.setState({ taskList: this.state.taskList });
    }
  }
  
  removeListItem (key) {
    this.setState({ taskList: this.state.taskList.filter(task => task.key != key) });
  }

  toggleListItem (key) {
    let done;
    this.state.taskList.some((task, i) => {
      if (task.key === key) {
        task.done = task.done === true ? false : true;
        done = task.done;
        this.state.taskList[i] = task;
        return true;
      }
    });

    this.setState({ state: this.state.taskList });

    return done;
  }

  render () {
    const listItems = this.state.taskList.length ?
    this.state.taskList.map(task => 
      <ListItem 
        key={task.key} 
        id={task.key} 
        done={task.done} 
        description={task.description} 
        removeListItem={this.removeListItem} 
        toggleListItem={this.toggleListItem} />
    ) :
    <span>No tasks to do.</span>;

    return (
      <div className="TodoList-Container uk-width-1-3 uk-margin-auto" >
        <div>
          <ul className="TodoList-List uk-list uk-margin-small-top uk-margin-small-bottom" >
            {listItems}
          </ul>
        </div>
        <PlainInput addListItem={this.addListItem} />
      </div>
    );
  }
}


class App extends Component {
  render = () => {
    return (
      <div uk-grid className="uk-padding">
        <h1 className="uk-text-center uk-text-lead">ToDo List in React</h1>
        <TodoList />
      </div>
    );
  };
}

export default App;
