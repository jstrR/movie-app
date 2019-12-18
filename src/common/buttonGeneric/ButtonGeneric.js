import React from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

const stylesUtils = {
  mainColor: "#2196F3",
  hoverColorBg: "#21CBF3",
  logOutColor: "#DC004E",
  logOutColorBg: "#FE6B8B"
};

const useStyles = makeStyles(theme => ({
  root: {
    background: props =>
      props.event === "logOut"
        ? stylesUtils.logOutColor
        : stylesUtils.mainColor,
    border: 0,
    borderRadius: 3,
    color: "white",
    height: 32,
    padding: "0 30px",
    margin: "0 1rem",
    "&:hover": {
      backgroundColor: stylesUtils.logOutColorBg
    },
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      margin: "0.8rem 0",
      height: 40
    }
  }
}));

const ButtonGeneric = props => {
  const classes = useStyles(props);
  return (
    <>
      <Button className={classes.root} variant="contained" {...props} />
    </>
  );
};

export default ButtonGeneric;