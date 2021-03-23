import React from 'react'
import { mount } from 'enzyme'

import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import configureStore from 'redux-mock-store'
import { render } from '@testing-library/react'
import Reports from './Reports'
import Button from '../Button'

describe('Reports', () => {
  const initialState = {
    reports: {
      file: null,
      error: null,
      year: 2020,
      stt: '',
    },
    stts: {
      sttList: [
        {
          id: 1,
          type: 'state',
          code: 'AL',
          name: 'Alabama',
        },
      ],
      loading: false,
    },
    auth: {
      authenticated: true,
      user: {
        email: 'hi@bye.com',
        roles: [{ id: 1, name: 'OFA Admin', permission: [] }],
      },
    },
  }
  const mockStore = configureStore([thunk])

  it('should render the Fiscal Year dropdown with two options', () => {
    const store = mockStore(initialState)
    const { getByLabelText } = render(
      <Provider store={store}>
        <Reports />
      </Provider>
    )

    const select = getByLabelText('Fiscal Year')

    expect(select).toBeInTheDocument()

    const options = select.children

    expect(options.length).toEqual(2)
  })

  it('should render the STT dropdown with one option, when the user is an OFA Admin', () => {
    const store = mockStore(initialState)
    const { getByTestId } = render(
      <Provider store={store}>
        <Reports />
      </Provider>
    )

    const select = getByTestId('stt-combobox')

    const options = select.children

    // There is only STT in the mock list but the combobox has a default option
    expect(options.length).toEqual(2)
  })

  it('should not render the STT if the user is not an OFA Admin', () => {
    const store = mockStore({
      ...initialState,
      auth: {
        authenticated: true,
        user: {
          email: 'hi@bye.com',
          roles: [], // Remove the OFA Admin role
        },
      },
    })

    const { queryByTestId } = render(
      <Provider store={store}>
        <Reports />
      </Provider>
    )

    const select = queryByTestId('stt-combobox')

    expect(select).toBe(null)
  })

  it('should change route to `/reports/:year/upload` on click of `Begin Report` button', () => {
    const store = mockStore(initialState)
    const wrapper = mount(
      <Provider store={store}>
        <Reports />
      </Provider>
    )

    const beginButton = wrapper.find(Button)

    expect(beginButton).toExist()

    beginButton.simulate('click')

    expect(window.location.href.includes('/reports/2020/upload')).toBeTruthy()
  })
})
