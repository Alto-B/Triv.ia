
import { Button, makeStyles, TextField } from '@material-ui/core';
import axios from 'axios';
import React, { useContext, useEffect } from 'react';
import {useForm} from 'react-hook-form'
import { AuthContext } from '../../contexts/AuthContext';

const useStyles = makeStyles(theme => ({
    form:{
        width: "50%"
    },
    textbox:{
        margin: 10
    }
}))


const QuestionCreate = ({match}) => {
    const {handleSubmit, register} = useForm();
    const classes = useStyles();
    const {API, eventList} = useContext(AuthContext);

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

        axios.post(`${API}/question`, {prompt, eventID: eventList[match.params.index]._id}, {headers:{'token': localStorage.getItem('token')}})
        .then(result => {
            axios.post(`${API}/answer`, {questionID: result.data.question._id, answers}, {headers:{'token': localStorage.getItem('token')}})
            //console.log(result.data);
        })
    }

    
    
    return (
        <div style={{width: "100%", alignItems:'center'}}>
            <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
                <TextField name="prompt" variant="outlined" inputRef={register} label="Question" fullWidth className={classes.textbox}/>
                <TextField name="a1" variant="outlined" inputRef={register} label="Answer 1" fullWidth className={classes.textbox}/>
                <TextField name="a2" variant="outlined" inputRef={register} label="Answer 2" fullWidth className={classes.textbox}/>
                <TextField name="a3" variant="outlined" inputRef={register} label="Answer 3" fullWidth className={classes.textbox}/>
                <TextField name="a4" variant="outlined" inputRef={register} label="Answer 4" fullWidth className={classes.textbox}/>
                <TextField name="correct" variant="outlined" inputRef={register} label="Correct" fullWidth className={classes.textbox}/>

                <Button type="submit">Submit</Button>
                
            </form>
        </div> 

     );
}
 
export default QuestionCreate;