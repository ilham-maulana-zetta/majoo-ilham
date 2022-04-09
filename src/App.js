import logo from './logo.svg';
import './App.css';
import React, { Component, useSyncExternalStore } from 'react';
import { toHaveDisplayValue } from '@testing-library/jest-dom/dist/matchers';
import Modal from "./component/modal/Modal"

class App extends Component {
  state = {
    chores: [],
    unfinished: [],
    finished: [],
    isFirstLoad: true
  }

  componentDidMount() {
    fetch("https://virtserver.swaggerhub.com/hanabyan/todo/1.0.0/to-do-list")
      .then(response => response.json())
      .then(tasks => {
        this.setState({chores: tasks})
      })
  }

  handleForm = (item) => {
    let updateData = [...this.state.chores]
    if (this.state.chores.some(x => x.id === item.id)) {
      this.state.chores.map((edit, index) => {
        if (edit.id === item.id) {
          updateData[index] = {
            id: item.id,
            title: item.title,
            description: item.description,
            status: item.status,
            createdAt: item.createdAt
          }
          return updateData
        }
        this.state.chores = updateData
      })
    } else {
      this.state.chores.push(item)
    }
    this.state.unfinished = []
    this.state.finished = []
    this.groupingData()
    this.forceUpdate()
  }

  deleteItem = (item) => {
    this.state.chores = this.state.chores.filter((x) => {
      return x.id !== item.id
    })
    this.state.unfinished = []
    this.state.finished = []
    this.groupingData()
    this.forceUpdate()
  }

  groupingData() {
    this.state.chores.forEach(item => {
      if (item.status === 0) {
        this.state.unfinished.push(item)
        this.state.unfinished =  this.state.unfinished.sort((a, b) => {
          var dateFirst = new Date(a.createdAt)
          var dateSecond = new Date(b.createdAt)
          return dateSecond - dateFirst
        })
      } else {
        this.state.finished.push(item)
        this.state.unfinished =  this.state.unfinished.sort((a, b) => {
          var dateFirst = new Date(a.createdAt)
          var dateSecond = new Date(b.createdAt)
          return dateFirst - dateSecond
        })
      }
    })
  }

  render() {
    let isOpen = false

    if (this.state.isFirstLoad && this.state.chores.length > 0) {
      this.groupingData()
      this.state.isFirstLoad = false
    }

    return (
      <section className='p-6'>

        <div className='flex w-full items-center justify-center'>
          <h1 className='text-2xl font-bold text-blue-900'>To-do List App</h1>
        </div>

        <div className='mt-8'>
          <div className='flex justify-between w-full'>
            <p className='text-xl font-semibold text-blue-900'>Unfinished Tasks</p>
            <Modal value="Add New Task" length={this.state.chores.length} onSubmitForm={this.handleForm} />
          </div>
          {this.state.unfinished.map(item => (
            <div className='flex justify-between items-center w-full p-4 my-2 bg-blue-100 rounded-md'>
              <div className='flex flex-col space-y-1'>
                <p className='text-blue-900 font-medium'>{item.title}</p>
                <p className='text-xs text-gray-800'>{item.createdAt} | {item.description}</p>
              </div>
              <div className='flex flex-row space-x-2'>
                <Modal value="Edit Task" data={item} onDeleteItem={this.deleteItem} onSubmitForm={this.handleForm} />
              </div>
            </div>
          ))}
        </div>

        <div className='mt-8'>
          <p className='text-xl font-semibold text-blue-900'>Finished Tasks</p>
          {this.state.finished.map(item => (
            <div className='flex justify-between items-center w-full p-4 my-2 bg-green-100 rounded-md'>
            <div className='flex flex-col space-y-1'>
                <p className='text-green-900 font-medium'>{item.title}</p>
                <p className='text-xs text-gray-800'>{item.createdAt} | {item.description}</p>
              </div>
            <div className='flex flex-row space-x-2'>
            <Modal value="Edit Task" data={item} onDeleteItem={this.deleteItem} onSubmitForm={this.handleForm} />
            </div>
          </div>
          ))}
        </div>
      </section>
    )
  }
}

export default App;
