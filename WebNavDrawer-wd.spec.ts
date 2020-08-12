import { expect, assert } from 'chai';
import { Builder, By, until, WebDriver} from 'selenium-webdriver';
import ojwd, { DriverManager as dm }  from '@oracle/oraclejet-webdriver';
import {ojNavigationList, ojWebElement} from '@oracle/oraclejet-webdriver/elements';

export async function  loadPageAndTestPageLoaded(driver:WebDriver, tabName:string) {


  let navListItem = await ojNavigationList(
    driver, By.id('navTabBar'));

  await navListItem.changeSelection(tabName);
  let compText = await navListItem.getProperty("selection");
  expect(compText).to.equal(tabName);
};

export async function notifyPageLoad(driver: WebDriver):Promise<string> {

  let announceElement = await ojWebElement(driver, By.id('ariaLiveMessage'));
  return new Promise<string>(resolve => {
    setTimeout(() => {
      announceElement.getDriver().executeScript(function() {
        return document.querySelector('#ariaLiveMessage').textContent;
      }).then(function(ariaLiveMessage:string) {
        resolve(ariaLiveMessage);
      });
    }, 200);
  });
}

describe('Test Web NavDrawer', function() {
  let driver: WebDriver;

  ['JET-Template-Web-NavDrawer', 'JET-Template-Web-NavDrawer-Typescript']
  .forEach(path => {
    describe(path, () => {
      // Called once
      before(async function() {
        driver = await dm.getDriver();
        await ojwd.get(driver, `@url@/built/apps/public_samples/${path}/public_html/index.html`);

      });

      // Notify Incidents page load
      it('can notify Incidents page load', async function() {
        let notificationMessage = 'Incidents page loaded.';
        await loadPageAndTestPageLoaded(driver, 'incidents');
        let pageLoadMessage:string = await notifyPageLoad(driver);
        expect(pageLoadMessage).to.equal(notificationMessage);
      });

      // Notify Dashboard page load
      it('can notify Dashboard page load', async function() {
        let notificationMessage = 'Dashboard page loaded.';
        await loadPageAndTestPageLoaded(driver, 'dashboard');
        let pageLoadMessage:string = await notifyPageLoad(driver);
        expect(pageLoadMessage).to.equal(notificationMessage);
      });

      // Notify Customers page load
      it('can notify Customers page load', async function() {
        let notificationMessage = 'Customers page loaded.';
        await loadPageAndTestPageLoaded(driver, 'customers');
        let pageLoadMessage:string = await notifyPageLoad(driver);
        expect(pageLoadMessage).to.equal(notificationMessage);
      });

      // Notify About page load
      it('can notify About page load', async function() {
        let notificationMessage = 'About page loaded.';
        await loadPageAndTestPageLoaded(driver, 'about');
        let pageLoadMessage:string = await notifyPageLoad(driver);
        expect(pageLoadMessage).to.equal(notificationMessage);
      });

    });
  });

  // Called once
  after(async function() {
    await dm.releaseDriver(driver);
  });
});
