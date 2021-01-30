let Parser = require('rss-parser');
let parser = new Parser({
    customFields:{
        item:[["inception:page", "page"], ["inception:slug", "slug"],["inception:break", "break"]]
    }
});


module.exports = {
    quesGen: (category) => {
        if(category == "BASKETBALL"){
            fetch('https://jservice.io/api/category?id=2094').then(result => result.json()).then(data => {
                console.log(data)
            })
        }
    },

    rssParse: async () => {
        let feed = await parser.parseURL("https://news.demo.inception.cloud/inception/RunningOrder/RunningOrder.rss?id=3961");
        console.log(feed.title);
        let topics = [];

        feed.items.forEach(item => {
            console.log(item.slug)
            topics.push(item.slug)
            
            if(item.break == "true"){
                console.log("break")
            }
        });
        return topics
    }



    
}