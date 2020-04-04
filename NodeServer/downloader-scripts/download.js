var webdriver = require('selenium-webdriver')
By = webdriver.By,
until = webdriver.until;

var sleep = require('sleep');

var driver = new webdriver.Builder().forBrowser('chrome').build();

function getGoogleSearchURLs(){
    return driver.findElements(By.xpath('//*[@class="r"]/a')).then((tags) => {
        var allLinks = tags.map((tag) => {
            return tag.getAttribute('href');
        });
        return Promise.all(allLinks);
    })
    .catch((err) => {
        console.log("Not able to find a tag on Google search");
        console.log(err);
    });;
}

function searchInPage(href){
    // console.log("Searching at", href);
    return driver.get(href).then(() => {
        return driver.findElements(By.xpath('//a[substring(@href, string-length(@href) - string-length("mp3") + 1) = "mp3"]')).then((tags) => {
            // console.log(tags);
            var allLinks = tags.map((tag) => {
                // console.log(tag.getAttribute('href'));
                return tag.getAttribute('href');
            });
            // console.log(allLinks);
            return Promise.all(allLinks);
        });
    });
}

function downloadFromLink(links, id){
    if(id >= links.length){
        return;
    }

    driver.get(links[id]).then(() => {
        
    })
    .catch(() => {
        downloadFromLink(links, id+1);
    })
}

function parseLinksFromHref(hrefs, id){
    if(id >= hrefs.length){
        return;
    }

    searchInPage(hrefs[id]).then((links) => {
        downloadFromLink(links, 0);
    })
    .catch(() => {
        parseLinksFromHref(hrefs, id+1);
    });
}

driver.get('http://www.google.com').then(() => {
    driver.findElement(By.name('q')).then((element) => {
        element.sendKeys('download haaye ve ammy virk\n').then(() => {
            // console.log("Element found");
            getGoogleSearchURLs().then((hrefs) => {
                // console.log('got hrefs: ', hrefs.length, hrefs);

                parseLinksFromHref(hrefs, 0);

            })
            .catch((err) => {
                console.log(err);
            });
        });
    })
    .catch((err) => {
        console.log("Search not initiated");
        console.log(err);
    });
})
.catch((err) => {
    console.log("Driver not opened");
    console.log(err);
});
