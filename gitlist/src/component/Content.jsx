import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
  } from "react-router-dom";
import Popular from './Tab';
import Battle from './Battle';

//内容部分
class Content extends React.Component{
    render(){
        return(
            <div>
                <Switch>
                    <Route exact path="/">
                    <Redirect from="/" to="/Popular" />
                    </Route>
                    <Route path="/Popular">
                    <Popular></Popular>
                    </Route>
                    <Route path="/Battle">
                    <Battle></Battle>
                    </Route>
                </Switch>
            </div>
        )
    }
}

export default Content;