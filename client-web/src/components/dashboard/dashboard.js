import React, { useContext, useEffect, useState } from 'react';
import {makeStyles} from '@material-ui/core/styles';
import clsx from 'clsx';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import axios from 'axios';
//import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
//import Badge from '@material-ui/core/Badge';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
//import Link from '@material-ui/core/Link';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
//import NotificationsIcon from '@material-ui/icons/Notifications';
import UserActivity from './charts/user-activity';
import Options from './toolbaroptions/Options';
import Leaderboard from './leaderboard/Leaderboard';
import AddIcon from '@material-ui/icons/Add';
import BallotIcon from '@material-ui/icons/Ballot';
import EventCard from './Event-Cards/EventCard';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {useForm} from 'react-hook-form';
import {AuthContext} from '../../contexts/AuthContext'
//import { mainListItems, secondaryListItems } from './listItems';

// function Copyright() {
//     return (
//       <Typography variant="body2" color="textSecondary" align="center">
//         {'Copyright © '}
//         <Link color="inherit" href="https://material-ui.com/">
//           Your Website
//         </Link>{' '}
//         {new Date().getFullYear()}
//         {'.'}
//       </Typography>
//     );
//   }
  


const drawerWidth = 240; 

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
      },
      toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
      },
      toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
      },
      appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
      },
      appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
      menuButton: {
        marginRight: 36,
      },
      menuButtonHidden: {
        display: 'none',
      },
      title: {
        flexGrow: 1,
      },
      drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
      drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      },
      appBarSpacer: theme.mixins.toolbar,
      content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
      },
      container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
      },
      paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
      },
      fixedHeight: {
        height: 240,
      },
      field: {
        marginBottom: 10
      }
}))

const Dashboard = () => {
    const classes = useStyles()
    const [open, setOpen] = useState(true);
    const [events, setEvents] = useState(false);

    const {API, eventList, setEventList} = useContext(AuthContext);

    const [lb, setLb] = useState(null)

    const [openD, setOpenD] = useState(false)
    const {register, handleSubmit} = useForm();

    const handleClickOpen = () => {
        setOpenD(true);
      };
    
    const handleClose = () => {
        setOpenD(false);
    };

    const handleEventOn = () => {
        console.log("activated")
        setEvents(true);
    }

    const handleEventOff = () => {
        console.log("activated")
        setEvents(false);
    }

    const handleDrawerOpen = () => {
        setOpen(true);
      };
    const handleDrawerClose = () => {
        setOpen(false);
    };

    const getEvents = () => {
      axios.get(`${API}/event`, {headers:{'token': localStorage.getItem('token')}}).then(result => {
        setEventList(result.data.events);
      })
      .catch(error=>{

      })
    }

    const getLeaderboard = () => {
      axios.get(`${API}/leaderboard`, {headers:{'token': localStorage.getItem('token')}}).then(result => {
        setLb(result.data.result);
      })
      .catch(error=>{

      })
    }

    useEffect(() => {
      getEvents();
      getLeaderboard();
    },[])

    const onDSubmit = (data) => {
      //const {name, image, description} = data; 

      let url = (data.link) ? `${API}/loadRSS` : `${API}/event`;

      console.log(data);
      handleClose();
      
      axios.post(url,data, {headers:{'token': localStorage.getItem('token')}}).then(result => {
        getEvents();
      })
      .catch(error => {

      })
    }

    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

    return ( 
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            
          </Typography>
          {events? (
            <div>
          <IconButton color="inherit" onClick={handleClickOpen}>
            <AddIcon fontSize="large"></AddIcon>
          </IconButton>
          <Dialog open={openD} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Create Event</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    Use this Dialogue to create Events
                </DialogContentText>
                  <form onSubmit={handleSubmit(onDSubmit)} style={{alignContent: 'center', textAlign: 'center'}}>
                    <TextField required  variant="outlined" name="name" fullWidth label="Event Name" inputRef={register} className={classes.field}></TextField>
                    <TextField required  variant="outlined" name="description" fullWidth label="Description" inputRef={register} className={classes.field} multiline rows={4}></TextField>
                    <TextField required  variant="outlined" name="image" fullWidth label="Image URL" inputRef={register} className={classes.field}></TextField>
                    <TextField variant="outlined" name="link" fullWidth label="RSS Feed" inputRef={register} className={classes.field} helperText="Optional: Import questions from RSS feed"></TextField>

                    <br></br>
                    <Button type="submit" variant="outlined" style={{ marginTop: 5, marginBottom: 5}}>Submit</Button>
                    {/* <Button onClick={handleClose} variant="outlined" style={{float: "left", marginTop: 5, marginBottom: 5}}>cancel</Button> */}
                  </form>
                </DialogContent>
            </Dialog>
          
          </div>):
          <IconButton color="inherit">
            <BallotIcon fontSize="large"></BallotIcon>
          </IconButton> 
          }
          
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
            <Options event={handleEventOn} eventOff={handleEventOff}></Options>
        </List>
        <Divider />
        {/* <List>{secondaryListItems}</List> */}
      </Drawer>
      {events?
      <div >

        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
              <Grid container spacing={2}>
                {eventList.map((x, index) => (
                  <Grid item xs={6} key={index}>
                    
                      <EventCard name={x.name} image={x.image} index={index} description={x.description} key={index}></EventCard>
                    
                  </Grid>
                ))}
              </Grid>
            </Container>

          
        </main>
      </div> 
      
      : (
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3} style={{overflow: "auto"}}>
            {/* Chart */}
            {/* <Grid item xs={12} md={8} lg={12}>
              <Paper className={fixedHeightPaper}>
                <UserActivity></UserActivity>
              </Paper>
            </Grid> */}
            {/* Recent Deposits */}
            {/* <Grid item xs={12} md={4} lg={3}>
              <Paper className={fixedHeightPaper}>
                <Deposits />
              </Paper>
            </Grid> */}
            {/* Recent Orders */}
            <Grid item xs={4}>
              <Paper className={classes.paper} style={{textAlign: "left"}}>
                <Typography variant="h4" gutterBottom>Getting Started</Typography>
                <Typography variant="body1" gutterBottom>
                  Welcome to triv.ia, a robust platform that leverages trivia games to increase fan engagement.
                </Typography>
                <Typography variant="body1">
                  To get started, select the Events pannel from the sidebar. Here you can create events and questions, and also start organizing the game.
                </Typography>
              </Paper>
            </Grid>


            <Grid item xs={8}>
              <Paper className={classes.paper}>
                <Leaderboard info={lb}></Leaderboard>
              </Paper>
            </Grid>
          </Grid>
          {/* <Box pt={4}>
            <Copyright />
          </Box> */}
        </Container>
      </main>
      )}
    </div>

     );
}
 
export default Dashboard;