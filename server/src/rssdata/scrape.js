const request = require('request');
const cheerio = require('cheerio');

const URLS = {
    badminton: 'https://www.gkseries.com/general-knowledge/sports/tennis/1-gk-mcqs-with-answers-on-tennis', 
    football: 'https://www.gkseries.com/general-knowledge/sports/00001-world-cup-football-quiz', 
    hockey: 'https://www.gkseries.com/general-knowledge/sports/hockey/1-general-knowledge-questions-and-answers-on-hockey', 
    tennis: 'https://www.gkseries.com/general-knowledge/sports/tennis/1-gk-mcqs-with-answers-on-tennis',
    olympics: 'https://www.gkseries.com/general-knowledge/sports/olympics/1-general-awareness-questions-and-answers-on-olympic-games',
    cricket: 'https://www.gkseries.com/general-knowledge/sports/cricket/1-gk-on-world-cup-cricket-2015',
    wrestling: 'https://www.gkseries.com/general-knowledge/sports/wrestling/1-general-awareness-multiple-choice-questions-and-answers-on-wrestling'
}

const scrapeQuestions = (topic) => {

    if(!URLS[topic]) return new Promise(resolve => {
        resolve([]);
    });

    return new Promise(resolve => {
        request(URLS[topic], (error, response, html) => {
            if(!error && response.statusCode == 200){
                const $ = cheerio.load(html); 
        
                const questions = [];
                const ans = [];
                
                // Getting questions 
                
                $(".mcq").each((i,el) => {
                    var questionOptions = [];

                    const question = $(el).find('.question-content.clearfix').text().replace(/\s\s+/g, '').substring(1);

                    const ans = $(el).find('.card.card-block').text();

                    $(el).find('.col-md-12.option').each((index, option) =>{
                        const opt = $(option).text().replace(/\s\s+/g, ''); 
                        if(ans.replace(/(\s+)/g, '').charAt(14) == opt.charAt(0)){
                            questionOptions.push({
                                text: opt.substring(1),
                                correct: true
                            });
                        }else{
                            questionOptions.push({
                                text: opt.substring(1),
                                correct: false
                            });
                        }
                        
                    });


                    questions.push({
                        prompt: question, 
                        answers: questionOptions
                    });

                    questionOptions = [];

                });
    
        
                resolve(questions);
            }
        });
    });
   
}


module.exports = {
    scrapeQuestions
}