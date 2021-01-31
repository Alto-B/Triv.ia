import React from 'react';
import { Route, Switch } from 'react-router-dom';
import SignIn from '../auth/SignIn';
import SignUp from '../auth/SignUp';
import Dashboard from '../dashboard/dashboard';
import Game from '../game/Game';
import QuestionCreate from '../question/QuestionCreate';

const AppRouter = () => {
    return ( 
        <Switch>
            <Route exact path="/" component={SignIn}/>
            <Route exact path="/app/login" component={SignIn}/>
            <Route exact path="/app/signup" component={SignUp}/>
            <Route exact path="/app/Dashboard" component={Dashboard}/>
            <Route exact path="/app/game" component={Game}/>
            <Route exact path="/app/questions/:index" component={QuestionCreate}/>
        </Switch>
     );
}
 
export default AppRouter;