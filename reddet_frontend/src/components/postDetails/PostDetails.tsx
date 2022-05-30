import {
  Button, createStyles, Grid,
} from '@mantine/core';
import { ReactEventHandler } from 'react';
import { useNavigate } from 'react-router-dom';
import { PostDetailContainer } from './PostDetailContainer';

export const useStyles = createStyles((theme) => ({

  sidePane: {
    cursor: 'pointer',
  },
}));

export default function PostDetails() {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const handleSidePaneClick: ReactEventHandler = (ev) => {
    ev.stopPropagation();
    navigate(-1);
  };

  return (
    <Grid
      sx={(theme) => ({
        backgroundColor: theme.colors.gray[9],
        width: '100vw',
      })}
    >
      <Grid.Col
        span={1}
        className={classes.sidePane}
        onClick={handleSidePaneClick}
      />
      <Grid.Col
        span={10}
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
