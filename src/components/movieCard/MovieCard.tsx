import React, { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useTranslation } from "react-i18next";
import ReactPlayer from "react-player";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";

import { IMovieObject, IMovieRatings } from "../../utils/types";
import {
  selectIsAuthenticated,
  selectUserMoviesRatings,
} from "../../redux/selectors/auth";
import { selectActiveMovie } from "../../redux/selectors/movie";
import movieData from "../../utils/movieData";
import { setActiveMovie } from "../../redux/modules/movie";
import Comments from "../comments/Comments";
import MovieRatings from "../../common/movieRatings/MovieRatings";
import ButtonNav from "../../common/buttonNav/ButtonNav";
import CinemaSessions from "../cinemaSessions/CinemaSessions";

const formatCurrency = (value: number, currency = "USD"): string => {
  const localFormat = localStorage.getItem("i18nextLng");
  if (localFormat === "ja-JP") {
    return (value * 108).toLocaleString(localFormat, {
      useGrouping: true,
      style: "currency",
      currency: "JPY",
    });
  }
  return value.toLocaleString("en-US", {
    useGrouping: true,
    style: "currency",
    currency: currency,
  });
};

const getDateDisplayValue = (
  date: Date,
  format = localStorage.getItem("i18nextLng") || ""
): string | null => {
  return date
    ? date.toLocaleString(format, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;
};

const stylesUtils = {
  mainColor: "#2196F3",
  lightMainColor: "#21CBF3",
  captionColor: "#878787",
  disabledColor: "#FE6B8B",
};

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: theme.spacing(4, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  media: {
    minHeight: "375px",
    paddingTop: "56.25%", // 16:9
  },
  sectionHeading: {
    fontWeight: 900,
  },
  buttonNav: {
    "&$disabled": {
      color: "white",
      backgroundColor: stylesUtils.disabledColor,
    },
  },
  disabled: {},
  buttonBack: {
    height: 0,
    margin: "3rem 4rem 0",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
}));

const MovieCard = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { t } = useTranslation();
  let location = useLocation();
  let { id } = useParams();
  let { from }: any = location.state || { from: { pathname: "/" } };

  const isAuthenticated: boolean = useSelector(
    selectIsAuthenticated,
    shallowEqual
  );

  const userMoviesRatings: Array<IMovieRatings> | undefined = useSelector(
    selectUserMoviesRatings,
    shallowEqual
  );

  const activeMovie: IMovieObject | undefined = useSelector(
    selectActiveMovie,
    shallowEqual
  );

  useEffect(() => {
    const moviesDb = JSON.parse(localStorage.getItem("moviesDb") || "");
    if (moviesDb && moviesDb.length) {
      dispatch(
        setActiveMovie(
          moviesDb.find((movie: IMovieObject) => movie.id === Number(id))
        )
      );
    } else {
      localStorage.setItem("moviesDb", JSON.stringify(movieData));
      dispatch(
        setActiveMovie(
          movieData.find((movie: IMovieObject) => movie.id === Number(id))
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <main>
      <ButtonNav className={classes.buttonBack} to={from}>
        <ArrowBackIosIcon style={{ color: "#2196F3", fontSize: "2.5rem" }} />
      </ButtonNav>
      <div className={classes.paper}>
        <Container maxWidth="lg" disableGutters>
          <Grid container alignItems="center">
            <Grid item xs={12} sm={6} md={8}>
              <Typography component="h1" variant="h4">
                {t(`movieContent|title.${activeMovie && activeMovie.title}`, {
                  nsSeparator: "|",
                })}
              </Typography>
            </Grid>
            <Grid
              container
              item
              xs={12}
              sm={6}
              md={4}
              justify="flex-end"
              alignItems="center">
              <Typography
                component="span"
                variant="h6"
                style={{ color: stylesUtils.mainColor }}>
                {activeMovie && activeMovie.vote_average}
              </Typography>
              <Typography
                component="span"
                variant="h6"
                style={{ color: stylesUtils.captionColor }}>
                /10
              </Typography>

              {userMoviesRatings &&
                activeMovie &&
                activeMovie.id &&
                userMoviesRatings[activeMovie.id] && (
                  <Typography
                    component="span"
                    variant="h6"
                    style={{ color: stylesUtils.captionColor }}>
                    &nbsp;({t("translations:common.ratingsPrevious")}&nbsp;
                    {userMoviesRatings[activeMovie && activeMovie.id]})
                  </Typography>
                )}

              <Grid container justify="flex-end" alignItems="center">
                <MovieRatings
                  movieid={(activeMovie && activeMovie.id) || null}
                  rating={(activeMovie && activeMovie.vote_average) || 0}
                  maxrating={10}
                  style={{ fontSize: "2rem" }}
                  disabled={!isAuthenticated}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={12} sm={12} md={10}>
              <Typography
                component="span"
                variant="subtitle1"
                style={{ color: stylesUtils.captionColor }}>
                {t(`movieContent|tagline.${activeMovie && activeMovie.title}`, {
                  nsSeparator: "|",
                })}
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <Typography
              component="span"
              variant="subtitle2"
              style={{ color: stylesUtils.lightMainColor }}>
              {activeMovie &&
                activeMovie.genres &&
                activeMovie.genres
                  .map((genre: string) => t(`movieCommon:genres.${genre}`))
                  .join(", ")}
            </Typography>
          </Grid>
          <Grid container spacing={5} style={{ marginTop: "1rem" }}>
            <Grid item xs={12} sm={6} md={5}>
              <Card>
                {activeMovie && activeMovie.poster_path && (
                  <CardMedia
                    className={classes.media}
                    image={activeMovie && activeMovie.poster_path}
                    title={activeMovie && activeMovie.title}
                  />
                )}
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={7}>
              <CinemaSessions
                cinemaSessions={activeMovie && activeMovie.cinemas}
              />
              <Typography
                component="div"
                variant="h5"
                className={classes.sectionHeading}>
                {t("movieCommon:description.aboutMovie")}
              </Typography>
              <Typography paragraph>
                {t(
                  `movieContent|overview.${activeMovie && activeMovie.title}`,
                  {
                    nsSeparator: "|",
                  }
                )}
              </Typography>

              <Grid style={{ marginBottom: "1rem" }}>
                {ReactPlayer.canPlay(
                  (activeMovie && activeMovie.trailerUrl) || ""
                ) && (
                  <ReactPlayer
                    url={activeMovie && activeMovie.trailerUrl}
                    controls
                    width="100%"
                  />
                )}
              </Grid>
              <Grid container wrap="wrap" justify="space-between">
                <Grid item>
                  <Typography
                    component="h4"
                    variant="h5"
                    className={classes.sectionHeading}>
                    {t("movieCommon:description.releaseDate")}
                  </Typography>
                  {activeMovie && activeMovie.release_date && (
                    <Typography paragraph>
                      {getDateDisplayValue(
                        new Date(activeMovie && activeMovie.release_date)
                      )}
                    </Typography>
                  )}
                </Grid>

                <Grid item>
                  <Typography
                    component="h4"
                    variant="h5"
                    className={classes.sectionHeading}>
                    {t("movieCommon:description.runtime")}
                  </Typography>
                  <Typography paragraph>
                    {activeMovie && activeMovie.runtime}{" "}
                    {t("translations:common.mins")}
                  </Typography>
                </Grid>

                {activeMovie && activeMovie.budget ? (
                  <Grid item>
                    <Typography
                      component="h4"
                      variant="h5"
                      className={classes.sectionHeading}>
                      {t("movieCommon:description.budget")}
                    </Typography>
                    <Typography paragraph>
                      {formatCurrency(activeMovie && activeMovie.budget)}
                    </Typography>
                  </Grid>
                ) : null}

                {activeMovie && activeMovie.revenue ? (
                  <Grid item>
                    <Typography
                      component="h4"
                      variant="h5"
                      className={classes.sectionHeading}>
                      {t("movieCommon:description.revenue")}
                    </Typography>
                    <Typography paragraph>
                      {formatCurrency(activeMovie && activeMovie.revenue)}
                    </Typography>
                  </Grid>
                ) : null}
              </Grid>
              <Grid container justify="space-between">
                {activeMovie && activeMovie.price ? (
                  <Typography
                    component="h4"
                    variant="h5"
                    className={classes.sectionHeading}>
                    {formatCurrency(activeMovie && activeMovie.price)}
                  </Typography>
                ) : null}
                <ButtonNav
                  to={`${location.pathname}/seats`}
                  disabled={!isAuthenticated}
                  classes={{
                    root: classes.buttonNav,
                    disabled: classes.disabled,
                  }}>
                  {t("translations:common.buyTicket")}
                </ButtonNav>
              </Grid>
            </Grid>
          </Grid>
          <Comments commentsStack={activeMovie && activeMovie.comments} />
        </Container>
      </div>
    </main>
  );
};

export default MovieCard;
