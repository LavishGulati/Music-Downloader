var webdriver = require('selenium-webdriver')
By = webdriver.By,
until = webdriver.until;

class Downloader {

    constructor(){
        this.driver = new webdriver.Builder().forBrowser('chrome').build();
    }

    getGoogleSearchURLs(){
        return this.driver.findElements(By.xpath('//*[@class="r"]/a')).then((tags) => {
            var allLinks = tags.map((tag) => {
                return tag.getAttribute('href');
            });
            return Promise.all(allLinks);
        })
        .catch((err) => {
            console.log("Not able to find a tag on Google search");
            console.log(err);
        });
    }

    searchInPage(href){
        // console.log("Searching at", href);
        return this.driver.get(href).then(() => {
            return this.driver.findElements(By.xpath('//a[substring(@href, string-length(@href) - string-length("mp3") + 1) = "mp3"]')).then((tags) => {
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

    downloadFromLink(links, id){
        if(id >= links.length){
            return;
        }

        this.driver.get(links[id]).then(() => {

        })
        .catch(() => {
            this.downloadFromLink(links, id+1);
        })
    }

    parseLinksFromHref(hrefs, id){
        if(id >= hrefs.length){
            return;
        }

        this.searchInPage(hrefs[id]).then((links) => {
            this.downloadFromLink(links, 0);
        })
        .catch(() => {
            this.parseLinksFromHref(hrefs, id+1);
        });
    }

    downloadSong(name, album, format){
        this.driver.get('http://www.google.com').then(() => {
            this.driver.findElement(By.name('q')).then((element) => {
                element.sendKeys('download ', name, ' ', album, ' ', format, '\n').then(() => {
                    // console.log("Element found");
                    this.getGoogleSearchURLs().then((hrefs) => {
                        // console.log('got hrefs: ', hrefs.length, hrefs);
                        this.parseLinksFromHref(hrefs, 0);

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

    }
}

module.exports = Downloader;
