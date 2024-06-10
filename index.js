#!/usr/bin/env node

import { program } from "commander";
import chalk from "chalk";
import inquirer from "inquirer";
import { simpleGit } from 'simple-git';


const gitBaseUrl = 'https://api.github.com';
program.version("1.0.0").description("App Server Scaffolder")

program.action(() => {
  console.log(chalk.greenBright('Starting App Server Scaffolder...'))
  try {
    inquirer
    .prompt([
      {
        type: "input",
        name: "pRepoName",
        message: "Please enter your new repo name:"
      }
      // {
      //   type: "password",
      //   name: "pSitePwd",
      //   message: "Please enter your github password:"
      // }
    ])
    .then((answers) => {
      console.log(chalk.cyanBright(`Creating the public repo ${answers.pRepoName}...`));
      const repo = createGitRepo(answers.pRepoName);
      repo.then((response) => {
        response.json()
        if(response.status > 201){
          throw {statusCode: response.status, errorMessage: response.statusText}
        }        
      })
      .catch((err) => {
        throw err
      });

      console.log(chalk.greenBright(`Public repo ${answers.pRepoName} has been created.`));
      const repoURL = `https://github.com/rhinton1/${answers.pRepoName}.git`;



    });
  } catch (error) {
    console.error(chalk.redBright(`There was problem creating your public repo ${answers.pRepoName} with error: status code ${error.statusCode} and message "${error.errorMessage}".`));
  }  
});

program.parse(process.argv);

async function createGitRepo(repo) {
  return new Promise((resolve) => {
    resolve(
      fetch(
        `${gitBaseUrl}/user/repos`,
        {
          method: 'POST',
          headers: {
            "authorization": `Bearer ${Token}`
          },
          body: JSON.stringify({
            "name": repo,
            "homepage": "https://github.com",
            "private": false,
            "has_issues": true,
            "has_projects": true,
            "has_wiki": true
          }),
        }
      )
    )    
  })
}

