import React, { useState, useEffect } from 'react';
import { Typography } from '@material-ui/core';
import wordsToNumbers from 'words-to-numbers';
import alanBtn from '@alan-ai/alan-sdk-web';

import NewsCards from './components/NewsCards/NewsCards';
import useStyles from "./styles.js"

import logo from "../src/images/AI.jpg"


const App = () => {
    const [activeArticle, setActiveArticle] = useState(0);
    const [newsArticles, setNewsArticles] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
  
    const classes = useStyles();
  
    useEffect(() => {
      alanBtn({
        key: '43fff4bd823a4646f1cf4521543e90182e956eca572e1d8b807a3e2338fdd0dc/stage',
        onCommand: ({ command, articles, number }) => {
          if (command === 'newHeadlines') {
            setNewsArticles(articles);
            setActiveArticle(-1);
          } else if (command === 'instructions') {
            setIsOpen(true);
          } else if (command === 'highlight') {
            setActiveArticle((prevActiveArticle) => prevActiveArticle + 1);
          } else if (command === 'open') {
            const parsedNumber = number.length > 2 ? wordsToNumbers((number), { fuzzy: true }) : number;
            const article = articles[parsedNumber - 1];
  
            if (parsedNumber > articles.length) {
              alanBtn().playText('Please try that again...');
            } else if (article) {
              window.open(article.url, '_blank');
              alanBtn().playText('Opening...');
            } else {
              alanBtn().playText('Please try that again...');
            }
          }
        },
      });
    }, []);
  
    return (
      <div>
        <div className={classes.logoContainer}>
          {newsArticles.length ? (
            <div className={classes.infoContainer}>
              <div className={classes.card}><Typography variant="h5" component="h2">Try saying: <br /><br />Open article number [4]</Typography></div>
              <div className={classes.card}><Typography variant="h5" component="h2">Try saying: <br /><br />Go back</Typography></div>
            </div>
          ) : null}
          <img src={logo} className={classes.alanLogo} alt="logo" />
        </div>
        <NewsCards articles={newsArticles} activeArticle={activeArticle} />
        {!newsArticles.length ? (
          <div className={classes.footer}>
            <Typography variant="body1" component="h2">
              Made by
              <a className={classes.link} href="https://www.linkedin.com/in/takudzwa-pamhirwa-3152a71b5/"> Takudzwa Pamhirwa</a>
            </Typography>
          </div>
        ) : null}
      </div>
    );
  };




export default App