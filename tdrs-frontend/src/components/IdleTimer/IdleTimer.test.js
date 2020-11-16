import React from 'react'
import thunk from 'redux-thunk'
import axios from 'axios'
import { mount } from 'enzyme'
import { fireEvent, render } from '@testing-library/react'

import { act } from 'react-dom/test-utils'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import IdleTimer from './IdleTimer'

describe('IdleTimer', () => {
  const mockStore = configureStore([thunk])
  it('should have a modal with an id of "myModal"', () => {
    const store = mockStore()
    const wrapper = mount(
      <Provider store={store}>
        <IdleTimer />
      </Provider>
    )

    const modal = wrapper.find('#myModal')

    expect(modal).toExist()
  })

  it('should start with a className of display-none', () => {
    const store = mockStore()
    const wrapper = mount(
      <Provider store={store}>
        <IdleTimer />
      </Provider>
    )

    const modal = wrapper.find('#myModal')

    expect(modal.hasClass('display-none')).toBeTruthy()
  })

  it('should change to a className of display-block after 2 seconds', () => {
    jest.useFakeTimers()
    const { container } = render(<IdleTimer />)

    const modal = container.querySelector('#myModal')

    act(() => {
      jest.runAllTimers()
    })

    expect(modal.classList.contains('display-block')).toBeTruthy()
  })

  it('should change window location to sign out url when sign out button is clicked on session timeout modal', () => {
    const url = 'http://localhost:8080/v1/logout/oidc'
    global.window = Object.create(window)
    Object.defineProperty(window, 'location', {
      value: {
        href: url,
      },
    })

    const store = mockStore()
    const wrapper = mount(
      <Provider store={store}>
        <IdleTimer />
      </Provider>
    )

    const signOutButton = wrapper.find('.sign-out').hostNodes()

    expect(signOutButton).toExist()

    signOutButton.simulate('click')

    expect(window.location.href).toEqual(url)
  })

  it('should call an axios post method when `Stay Signed In` button is clicked', () => {
    axios.post.mockImplementationOnce(() => Promise.resolve('hello'))

    const store = mockStore()
    const wrapper = mount(
      <Provider store={store}>
        <IdleTimer />
      </Provider>
    )

    const staySignedInButton = wrapper.find('.renew-session').hostNodes()

    staySignedInButton.simulate('click')

    expect(axios.post).toHaveBeenCalledTimes(1)
  })

  it('should call console.error when axios post method fails', () => {
    axios.post.mockImplementationOnce(() =>
      Promise.reject(new Error('Something went wrong'))
    )

    global.console = {
      error: jest.fn(),
    }

    const store = mockStore()
    const wrapper = mount(
      <Provider store={store}>
        <IdleTimer />
      </Provider>
    )

    const staySignedInButton = wrapper.find('.renew-session').hostNodes()

    staySignedInButton.simulate('click')

    expect(axios.post).toThrow('Something went wrong')
  })

  it('should focus `Sign Out` button if tab is pressed when modal is open', () => {
    const { container } = render(<IdleTimer />)

    const modal = container.querySelector('#myModal')
    const signOutButton = container.querySelector('.sign-out')

    fireEvent.keyDown(modal, { keyCode: 9 })

    expect(document.activeElement).toEqual(signOutButton)
  })

  it('should focus `Stay Signed In` button if tab is pressed when modal is open', () => {
    const { container } = render(<IdleTimer />)

    const modal = container.querySelector('#myModal')
    const staySignedInButton = container.querySelector('.renew-session')

    fireEvent.keyDown(modal, { shiftKey: true, keyCode: 9 })

    expect(document.activeElement).toEqual(staySignedInButton)
  })
})