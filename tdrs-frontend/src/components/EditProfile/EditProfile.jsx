import React from 'react'
import {
  GridContainer,
  Form,
  Label,
  TextInput,
  Button,
} from '@trussworks/react-uswds'

import './EditProfile.scss'

/**
 * This component renders when a user logs in for the first time
 * and needs to finish setting up their account. The user will
 * submit their first and last name along with their state, tribe or territory.
 */

function EditProfile() {
  return (
    <GridContainer>
      <h1 className="request-access-header font-serif-2xl">Request Access</h1>
      <p className="request-access-secondary">
        We need to collect some information before an OFA Admin can grant you
        access
      </p>
      <Form>
        <Label htmlFor="first-name">First name</Label>
        <TextInput id="first-name" name="first-name" type="text" />
        <Label htmlFor="last-name">Last name</Label>
        <TextInput id="last-name" name="last-name" type="text" />
        <Button className="usa-button--big" type="submit" disabled>
          Request Access
        </Button>
      </Form>
    </GridContainer>
  )
}

export default EditProfile