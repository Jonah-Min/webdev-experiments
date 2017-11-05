import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import elasticlunr from 'elasticlunr';
import { Button, Navbar, MenuItem, Nav, NavItem, NavDropdown, FormControl, Panel } from 'react-bootstrap';

import termDump from './smallClasses.json';
import searchIndex from './smallSearchIndex.json';

import './bootstrap.css';
import './bootstrap-theme.css';


const classSearchConfig = {
  fields: {
    classId: {
      boost: 4,
    },
    acronym: {
      boost: 4,
    },
    subject: {
      boost: 2,
    },
    desc: {
      boost: 1,
    },
    name: {
      boost: 1.1,
    },
    profs: {
      boost: 1,
    },
    crns: {
      boost: 1,
    },
  },
  expand: true,
};


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      classes: [],
    };

    this.textBox = null;
    console.log('Loading search index...');
    this.index = elasticlunr.Index.load(searchIndex);
    console.log('Done loading search index');

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit() {
    const results = this.index.search(this.textBox.value, classSearchConfig);

    const classes = [];

    for (const result of results.slice(0, 10)) {
      classes.push(termDump.classMap[result.ref]);
    }

    this.setState({
      classes: classes,
    });
  }

  render() {
    return (
      <div className='App'>
        <Navbar inverse collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <a href='#'>Rate a Class</a>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav />
            <Nav pullRight />
          </Navbar.Collapse>
        </Navbar>

        <div className='container'>
          <form className='form'>
            <FormControl
              className='input'
              type='text'
              placeholder='Enter text'
              inputRef={ (textBox) => { this.textBox = textBox; } }
              onChange={ this.onSubmit }
            />
          </form>

          {this.state.classes.length}
          <br />
          <br />
          <br />
          <br />
          <div className='results'>
            {this.state.classes.map((aClass) => {
              console.log(aClass.name);
              return (
                <div>
                  <Panel header={ `${aClass.subject} ${aClass.classId}: ${aClass.name}` }>
                    {aClass.desc}
                  </Panel>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
