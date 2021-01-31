import React, {useState, useEffect} from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import ChartTitle from '../charts/ChartTitle';

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

const Leaderboard = ({info}) => {
  const classes = useStyles();
  return (
    <React.Fragment>
      <ChartTitle>Leaderboard</ChartTitle>


      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Username</TableCell>
            <TableCell>Score</TableCell>
            <TableCell>Correct</TableCell>
            <TableCell>Attempted</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {info?.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.username}</TableCell>
              <TableCell>{row.score}</TableCell>
              <TableCell>{row.correct}</TableCell>
              <TableCell>{row.attempted}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>


      <div className={classes.seeMore}>
        {/* <Link color="primary" href="#" onClick={preventDefault}>
          See more orders
        </Link> */}
      </div>
    </React.Fragment>
  );
}

export default Leaderboard;