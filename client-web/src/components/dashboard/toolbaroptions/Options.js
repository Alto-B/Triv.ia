import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import React from 'react';
import DashboardIcon from '@material-ui/icons/Dashboard'
import EventIcon from '@material-ui/icons/Event';

const Options = ({event, eventOff}) => {
    return (
        <div>
        <ListItem button onClick={eventOff}>
            <ListItemIcon>
                <DashboardIcon></DashboardIcon>
            </ListItemIcon>
            <ListItemText primary="dashboard"></ListItemText>
        </ListItem>

        <ListItem button onClick={event}>
            <ListItemIcon>
                <EventIcon></EventIcon>
            </ListItemIcon>
            <ListItemText primary="Events"></ListItemText>
        </ListItem>
    </div>
    );
    
}

export default Options;
