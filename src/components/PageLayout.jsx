/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import "./PageLayout.module.css"
import { useMsalAuthentication } from '@azure/msal-react';
import { SignInButton } from "./SignInButton";
import { SignOutButton } from "./SignOutButton";

/**
 * Renders the navbar component with a sign in or sign out button depending on whether or not a user is authenticated
 * @param props
 */
export const PageLayout = (props) => {
  const isAuthenticated =  useMsalAuthentication("redirect")//useIsAuthenticated();

  return (
    < >
    <div className="App">
      <div>
        <br></br>
        <h4>Welcome </h4>
      </div>
      </div>
      {props.children}
    </>
  );
};