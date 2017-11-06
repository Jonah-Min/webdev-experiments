import React, { Component } from 'react';
import logo from './logo.svg';
import elasticlunr from 'elasticlunr';
import { Button, ButtonToolbar, Navbar, MenuItem, Nav, NavItem, NavDropdown, FormControl, Panel } from 'react-bootstrap';

import termDump from './smallClasses.json';
import searchIndex from './smallSearchIndex.json';

import request from './request'

import './bootstrap.css';
import './bootstrap-theme.css';
import './App.css';

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

      showingClass: null
    };

    this.textBox = null;

    this.usernameBox = null;
    this.passwordBox = null;


    console.log('Loading search index...');
    this.index = elasticlunr.Index.load(searchIndex);
    console.log('Done loading search index');

    this.onSubmit = this.onSubmit.bind(this);
    this.showClass = this.showClass.bind(this);
    this.verifyLogin = this.verifyLogin.bind(this);
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

  async verifyLogin() {
    // verify that information was input to the forms
    if(!this.usernameBox.value || !this.passwordBox.value) {
      alert('Please input a Username and Password!')
    }

    let resp = await request({
      method: 'POST',
      form: true,
      body: {
        password: this.passwordBox.value,
        email: this.usernameBox.value
      },
      url: '/session'
    })

    debugger




    let posts = await request ({
      url: '/posts',
      method: 'GET'
    })

    debugger




  }

  showClass(aClass) {
    console.log(aClass);
    this.setState({
      showingClass: aClass
    })
  }

  getHomePage() {
    return (
      <span>
          <form className='form'>
            <FormControl
              className='input'
              type='text'
              placeholder='Enter text'
              inputRef={ (textBox) => { this.textBox = textBox; } }
              onChange={ this.onSubmit }
            />
          </form>
          <div className='class-counter'>
            {this.state.classes.length}
          </div>
          <div className='results'>
            {this.state.classes.map((aClass) => {
              return (
                <div>
                  <Panel header={ `${aClass.subject} ${aClass.classId}: ${aClass.name}` }>
                    {aClass.desc}

                    {/* Add reviews here*/}

                    <br/>

                    <span>Add a review</span>


                    <a href="#" onClick={this.showClass.bind(this, aClass)} > Write a review >> </a>

                  </Panel>
                </div>
              );
            })}
          </div>
          </span>
        
        )
  }

  getClassDetails() {
    console.log(this.state.showingClass);
    let thisClass = this.state.showingClass;
    
    return (
      <span>
        <div className='class-title'>
          { thisClass.name }
        </div>
        <a href={ thisClass.url } className='class-subject'>
          { `${thisClass.subject }${ thisClass.classId }` }
        </a>
        <div className='class-desc'>
          { thisClass.desc }
        </div>
        <div className='crn-container'>
          <span className='crn-title'><strong> CRN: </strong></span>
          <ul className='class-crns-list'>
            { this.state.showingClass.crns.map((crn) => {
              return(
                <li className='class-crn'>{ crn }</li>
              );
            })}
          </ul>
        </div>
        <a href="#" className='back-button' onClick={ this.showClass.bind(this, null) }>Back</a>
      </span>
      )
  }

  render() {

    let content;
    if (this.state.showingClass) {
      content = this.getClassDetails();
      console.log('details!', this.state.showingClass, !!this.state.showingClass)
    }
    else {
      content = this.getHomePage();
      console.log('homepage!')
    }


    return (
      <div className='App'>
        <Navbar inverse collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <a href='#' onClick={this.showClass.bind(this, null)}>Rate a Class</a>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <form className='login-form'>
            <FormControl
              className='login-input'
              type='text'
              placeholder='Username'
              inputRef={ (usernameBox) => { this.usernameBox = usernameBox; } }
            />
            <FormControl
              className='login-input'
              type='password'
              placeholder='Password'
              inputRef={ (passwordBox) => { this.passwordBox = passwordBox; } }
            />
            <ButtonToolbar>
              <Button 
                bsStyle="primary" 
                className='login-submit'
                onClick={this.verifyLogin}>
                  Login!
              </Button>
            </ButtonToolbar>
          </form>
          <Navbar.Collapse>
            <Nav />
            <Nav pullRight />
          </Navbar.Collapse>
        </Navbar>

        <div className='container'>
          {content}
        </div>
          
      </div>
    );
  }
}

export default App;
