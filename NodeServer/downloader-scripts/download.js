var webdriver = require('selenium-webdriver')
By = webdriver.By,
until = webdriver.until;

let chrome = require('selenium-webdriver/chrome');
var shell = require('shelljs');

class Downloader {

    constructor(dirname){

        shell.mkdir('-p', '/home/lavishgulati/Github/Music-Downloader/NodeServer/public/songs/'+dirname);

        this.driver = new webdriver.Builder().forBrowser('chrome').setChromeOptions(new chrome.Options().setUserPreferences({
            "download.default_directory": '/home/lavishgulati/Github/Music-Downloader/NodeServer/public/songs/'+dirname+'/'
        })).build();
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
        if(links.length == 0){
            throw "Download links not available on this site";
            return Promise.resolve({

            });
        }

        if(id >= links.length){
            throw "All download links exhausted on this site";
            return Promise.resolve({

            });
        }

        return Promise.resolve({
            'exitcode': 1,
            'success': true,
            'link': links[id]
        });

        // return this.driver.get(links[id]).then(() => {
        //     console.log("Done");
        //     return Promise.resolve({
        //         'exit-code': 1,
        //         'success': true
        //     });
        // })
        // .catch(() => {
        //     return this.downloadFromLink(links, id+1).then((res) => {
        //         return res;
        //     });
        // })
    }

    parseLinksFromHref(hrefs, id){
        if(id >= hrefs.length){
            return Promise.resolve({
                'exitcode': -1,
                'success': 'false'
            });
        }

        return this.searchInPage(hrefs[id]).then((links) => {
            return this.downloadFromLink(links, 0).then((res) => {
                // console.log(res);
                return res;
            });
        })
        .catch(() => {
            return this.parseLinksFromHref(hrefs, id+1).then((res) => {
                return res;
            });
        });
    }

    downloadSong(name, album, format){
        return this.driver.get('http://www.google.com').then(() => {
            return this.driver.findElement(By.name('q')).then((element) => {
                return element.sendKeys('download ', name, ' ', album, ' ', format, '\n').then(() => {
                    // console.log("Element found");
                    return this.getGoogleSearchURLs().then((hrefs) => {
                        // console.log('got hrefs: ', hrefs.length, hrefs);
                        return this.parseLinksFromHref(hrefs, 0).then((res) => {
                            // console.log(res);
                            return res;
                        });

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

    destroy(){
        this.driver.quit();
    }
}

module.exports = Downloader;
