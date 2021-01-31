import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../../contexts/AuthContext';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { TextField } from '@material-ui/core';
import axios from 'axios';
import { useForm } from 'react-hook-form';


const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  textbox:{
    marginBottom: 10
  }
  
});

const EventCard = ({name, description, image, index}) => {
    const history = useHistory()
    const {handleSubmit, register} = useForm();
    const classes = useStyles();
    const {API, eventList, setCurEvent} = useContext(AuthContext);

    const onSubmit = (data) => {
        const {prompt,a1,a2,a3,a4,correct } = data
        let answers = [];

        answers.push({text: a1, correct: false});
        answers.push({text: a2, correct: false});
        answers.push({text: a3, correct: false});
        answers.push({text: a4, correct: false});

        for(let i = 0; i < answers.length; i++){
            if(answers[i].text === correct){
                answers[i].correct = true;
            }
        }

        //console.log(eventList[match.params.index]);

        axios.post(`${API}/question`, {prompt, eventID: eventList[index]._id}, {headers:{'token': localStorage.getItem('token')}})
        .then(result => {
            axios.post(`${API}/answer`, {questionID: result.data.question._id, answers}, {headers:{'token': localStorage.getItem('token')}})
            //console.log(result.data);
        })
    }

    const startGame = () => {
      setCurEvent(index)
      history.push("/app/game")
    }

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };



    //const classes = useStyles();

    return (
      <div>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Create Question</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Use Dialog to create question
          </DialogContentText>
          
            <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
                <TextField name="prompt" variant="outlined" inputRef={register} label="Question" fullWidth className={classes.textbox}/>
                <TextField name="a1" variant="outlined" inputRef={register} label="Answer 1" fullWidth className={classes.textbox}/>
                <TextField name="a2" variant="outlined" inputRef={register} label="Answer 2" fullWidth className={classes.textbox}/>
                <TextField name="a3" variant="outlined" inputRef={register} label="Answer 3" fullWidth className={classes.textbox}/>
                <TextField name="a4" variant="outlined" inputRef={register} label="Answer 4" fullWidth className={classes.textbox}/>
                <TextField name="correct" variant="outlined" inputRef={register} label="Correct" fullWidth className={classes.textbox}/>

                <Button type="submit" onClick={handleClose} variant="outlined" style={{float: 'right', margin: 10}}>Submit</Button>
            </form>
        </DialogContent>
      </Dialog>
     
        <Card className={classes.root}>
        <CardActionArea>
          <CardMedia
            className={classes.media}
            image={image}
            title={name}
            component="img"
            height={240}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {name}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {description}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button size="small" color="primary" onClick={startGame}>
            Start
          </Button>
          <Button size="small" color="primary" onClick={handleClickOpen}>
            Edit
          </Button>
        </CardActions>
      </Card>
      </div> 
     );
}
 
export default EventCard;