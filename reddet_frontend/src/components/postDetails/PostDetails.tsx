import {
  createStyles, Grid,
} from '@mantine/core';
import { ReactEventHandler } from 'react';
import { useNavigate } from 'react-router-dom';
import PostDetailContainer from './PostDetailContainer';

const useStyles = createStyles(() => ({
  sidePane: {
    cursor: 'pointer',
    margin: 0,
    padding: 0,
  },
  midPane: {
    padding: 0,
  },
}));

export default function PostDetails() {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const handleSidePaneClick: ReactEventHandler = (ev) => {
    ev.stopPropagation();
    navigate('/');
  };

  return (
    <Grid
      sx={(theme) => ({
        backgroundColor: theme.colors.gray[9],
        margin: 0,
        padding: 0,
      })}
    >
      <Grid.Col
        span={1}
        className={classes.sidePane}
        onClick={handleSidePaneClick}
      />
      <Grid.Col
        span={10}
        className={classes.midPane}
      >
        <PostDetailContainer />
      </Grid.Col>
      <Grid.Col
        span={1}
        className={classes.sidePane}
        onClick={handleSidePaneClick}
      />
    </Grid>
  );
}
