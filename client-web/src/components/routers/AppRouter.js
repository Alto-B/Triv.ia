import React from 'react';
import { Route, Switch } from 'react-router-dom';
import SignIn from '../auth/SignIn';
import SignUp from '../auth/SignUp';
import Dashboard from '../dashboard/dashboard';

const AppRouter = () => {
    return ( 
        <Switch>
            <Route exact path="/" component={SignIn}/>
            <Route exact path="/app/login" component={SignIn}/>
            <Route exact path="/app/signup" component={SignUp}/>
            <Route exact path="/app/Dashboard" component={Dashboard}/>
        </Switch>
     );
}
 
export default AppRouter;