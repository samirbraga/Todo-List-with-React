import React, { Component } from 'react';
import Moment from 'moment';
import './App.css';

const getShortHash = () => Math.random().toString(36).substring(7);

const STORAGE_KEY = 'react-todo-list';

let defaultTaskList = [{
  description: 'I have to insert an other task here.',
  done: false,
  key: getShortHash(),
  date: new Date()
}];

let todoStorage = {
  fetch () {
    var taskList = JSON.parse(localStorage.getItem(STORAGE_KEY) || JSON.stringify(defaultTaskList));
    return taskList;
  },
  save (taskList) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(taskList));
  }
};

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
    if (e.keyCode === 13) {
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
        <input placeholder="Insert a new task here..." onBlur={this.toggleFocus} onFocus={this.toggleFocus} onKeyDown={this.createItem} ref="newItem" className="TodoList-Add uk-input uk-form-large" type="text" />
      </div>
    );
  }
}

class ListItem extends Component {
  constructor (props) {
    super(props);

    this.state = {
      done: this.props.done,
      shown: false,
      editing: false,
    }

    this.deleteItem = this.deleteItem.bind(this);
    this.toggleItem = this.toggleItem.bind(this);
    this.editItem = this.editItem.bind(this);
    this.endEditItem = this.endEditItem.bind(this);
  }

  deleteItem () {
    this.refs.ListItem.classList.remove('shown');
    setTimeout(() => {
      this.props.removeListItem(this.props.id);
    }, 200);
  }

  toggleItem() {
    this.state.done = this.props.toggleListItem(this.props.id);
    this.setState({ done: this.state.done });
  }

  editItem (e) {
    setTimeout(() => {
      this.refs.ListItemEdit.focus();
    }, 10);
    
    this.refs.ListItemEdit.value = this.props.description;
    this.setState({ editing: true });
  }

  endEditItem(e) {
    if (e.keyCode) {
      if (e.keyCode === 13) {
        this.props.editListItem(this.props.id, this.refs.ListItemEdit.value);
        this.setState({ editing: false });
      }
    } else {
      this.props.editListItem(this.props.id, this.refs.ListItemEdit.value);
      this.setState({ editing: false });
    }
  }

  componentDidMount() {
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
          <div onDoubleClick={this.editItem} className="uk-width-1-1" >
            <span className={`${this.state.editing ? 'uk-hidden' : ''} TodoList-Item-Content`}>{this.props.description}</span>
            <input onKeyDown={this.endEditItem} onBlur={this.endEditItem} ref="ListItemEdit" type="text" className={`${!this.state.editing ? 'uk-hidden' : ''} TodoList-Item-Edit`} />
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
    super(props);

    this.state = {
      taskList: todoStorage.fetch(),
    };

    this.addListItem = this.addListItem.bind(this);
    this.removeListItem = this.removeListItem.bind(this);
    this.toggleListItem = this.toggleListItem.bind(this);
    this.editListItem = this.editListItem.bind(this);
    this.removeDoneItems = this.removeDoneItems.bind(this);
  }

  addListItem (description) {
    if (/\w/g.test(description)) {
      this.state.taskList.push({
        description,
        done: false,
        key: getShortHash()
      });

      this.setState({ taskList: this.state.taskList });
      
      todoStorage.save(this.state.taskList);

      let listContainer = this.refs.ListContainer;
      setTimeout(() => listContainer.scrollTop = listContainer.scrollHeight, 10);
    }
  }
  
  removeListItem (key) {
    this.setState({ taskList: this.state.taskList.filter(task => task.key != key) });

    todoStorage.save(this.state.taskList);
  }

  toggleListItem(key) {
    let done;
    this.state.taskList.some((task, i) => {
      if (task.key === key) {
        task.done = task.done === true ? false : true;
        done = task.done;
        this.state.taskList[i] = task;
        return true;
      }
    });
    this.setState({ taskList: this.state.taskList });

    todoStorage.save(this.state.taskList);

    return done;
  }

  editListItem(key, description) {
    let taskList = this.state.taskList;

    this.setState({
      taskList: taskList.map(task => {
        if (task.key === key) {
          task.description = description;
        }
        return task;
      })
    });

    todoStorage.save(this.state.taskList);
  }

  removeDoneItems() {
    this.setState({
      taskList: this.state.taskList.filter(task => !task.done)
    }, () => {
      todoStorage.save(this.state.taskList);
    });
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
        toggleListItem={this.toggleListItem}
        editListItem={this.editListItem} />
    ) :
    <span class="TodoList-Fallback">Nothing to do.</span>;
    let doneItems = this.state.taskList.filter(task => !!task.done);
    let leftItemsLen = this.state.taskList.length - doneItems.length;

    return (
      <div className="TodoList-Container uk-margin-auto" >
        <div ref="ListContainer" className="TodoList-List-Container" >
          <ul className="TodoList-List uk-list uk-margin-small-top uk-margin-small-bottom" >
            {listItems}
          </ul>
        </div>
        <PlainInput addListItem={this.addListItem} />
        <hr/>
        <div className="TodoList-Info uk-flex uk-flex-between" >
          <span>
            {leftItemsLen}&nbsp;
            {leftItemsLen === 1 ? 'item' : 'items'} left
            &nbsp;of&nbsp;
            {this.state.taskList.length}
          </span>
          <button onClick={this.removeDoneItems} disabled={!doneItems.length} className="uk-button uk-button-default" >
            Remove done ({doneItems.length})
          </button>
        </div>
      </div>
    );
  }
}


class App extends Component {
  render = () => {
    return (
      <div className="uk-padding">
        <div className="App-Container">
          <h1 className="uk-text-center uk-text-lead">ToDo List in React</h1>
          <TodoList />
        </div>
        <footer className="App-Footer">

        </footer>
      </div>
    );
  };
}

export default App;
